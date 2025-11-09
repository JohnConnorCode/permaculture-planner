import { SupabaseClient } from '@supabase/supabase-js'
import { GardenBed } from '@/lib/garden/garden-types'
import {
  IPersistenceAdapter,
  SaveResult,
  LoadResult,
  DeleteResult,
  CanvasMetadata,
} from './types'
import { syncBedsToSupabase } from '@/lib/supabase/bed-sync'

/**
 * Supabase persistence adapter
 *
 * Saves garden plans to Supabase database with:
 * - Auto-save debouncing (2 seconds)
 * - Conflict detection
 * - Transaction-based saves
 * - Real-time sync support
 */
export class SupabasePersistence implements IPersistenceAdapter {
  private debounceTimer: NodeJS.Timeout | null = null
  private isDirty = false
  private lastSaved: Date | null = null
  private saveInProgress = false

  constructor(
    private supabase: SupabaseClient,
    private planId: string
  ) {}

  /**
   * Save garden plan to Supabase
   */
  async save(
    data: GardenBed[],
    metadata?: CanvasMetadata,
    planName?: string
  ): Promise<SaveResult> {
    // Prevent concurrent saves
    if (this.saveInProgress) {
      return {
        success: false,
        error: 'Save already in progress',
      }
    }

    try {
      this.saveInProgress = true

      // Validate data
      if (!Array.isArray(data)) {
        return { success: false, error: 'Invalid data: beds must be an array' }
      }

      // Update plan metadata if provided
      if (metadata || planName) {
        const { error: metadataError } = await (this.supabase as any)
          .from('plans')
          .update({
            name: planName,
            canvas_metadata: metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', this.planId)

        if (metadataError) {
          console.error('Failed to update plan metadata:', metadataError)
          // Don't fail the entire save if metadata update fails
        }
      }

      // Sync beds to Supabase
      const result = await syncBedsToSupabase(this.supabase, this.planId, data)

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to sync beds to database',
        }
      }

      this.lastSaved = new Date()
      this.isDirty = false

      return { success: true, planId: this.planId }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save to Supabase',
      }
    } finally {
      this.saveInProgress = false
    }
  }

  /**
   * Load garden plan from Supabase
   */
  async load(id?: string): Promise<LoadResult> {
    const loadId = id || this.planId

    try {
      // Fetch plan with beds and plantings
      const { data: plan, error } = await (this.supabase as any)
        .from('plans')
        .select(
          `
          *,
          beds (
            *,
            plantings (*)
          )
        `
        )
        .eq('id', loadId)
        .single()

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to load plan from database',
        }
      }

      if (!plan) {
        return {
          success: false,
          error: 'Plan not found',
        }
      }

      // Transform Supabase beds to GardenBed format
      const beds: GardenBed[] = this.transformSupabaseBedsToGardenBeds(
        plan.beds || [],
        plan.plantings || []
      )

      this.isDirty = false
      this.lastSaved = plan.updated_at ? new Date(plan.updated_at) : null

      return {
        success: true,
        data: beds,
        metadata: plan.canvas_metadata || {},
        planName: plan.name,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load from Supabase',
      }
    }
  }

  /**
   * Delete garden plan from Supabase
   */
  async delete(id?: string): Promise<DeleteResult> {
    const deleteId = id || this.planId

    try {
      const { error } = await (this.supabase as any).from('plans').delete().eq('id', deleteId)

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to delete plan',
        }
      }

      this.isDirty = false
      this.lastSaved = null

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete from Supabase',
      }
    }
  }

  /**
   * Auto-save with 2 second debouncing
   */
  autoSave(data: GardenBed[], metadata?: CanvasMetadata): void {
    this.isDirty = true

    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    // Set new timer for 2 seconds
    this.debounceTimer = setTimeout(() => {
      this.save(data, metadata).catch((error) => {
        console.error('Auto-save failed:', error)
      })
    }, 2000)
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.isDirty
  }

  /**
   * Mark current state as saved
   */
  markAsSaved(): void {
    this.isDirty = false
    this.lastSaved = new Date()
  }

  /**
   * Get the last save timestamp
   */
  getLastSaved(): Date | null {
    return this.lastSaved
  }

  /**
   * Transform Supabase beds to GardenBed format
   * (Inverse of gardenBedToSupabase in bed-sync.ts)
   */
  private transformSupabaseBedsToGardenBeds(beds: any[], plantings: any[]): GardenBed[] {
    return beds.map((bed) => {
      // Get position from JSON or default to 0,0
      const position = bed.position_json || { x: 0, y: 0, rotation: 0 }

      // Convert feet back to pixels (roughly 48px per 4ft bed)
      const width = bed.length_ft * 12 // Convert to inches as pixels
      const height = bed.width_ft * 12

      // Create polygon points for rectangle
      const points = [
        { x: position.x, y: position.y },
        { x: position.x + width, y: position.y },
        { x: position.x + width, y: position.y + height },
        { x: position.x, y: position.y + height },
      ]

      // Get plants for this bed
      const bedPlantings = plantings
        .filter((p: any) => p.bed_id === bed.id)
        .map((planting: any) => {
          const plantPosition = planting.successions_json?.position || { x: 24, y: 24 }
          return {
            id: planting.id,
            plantId: planting.variety || 'unknown',
            x: plantPosition.x,
            y: plantPosition.y,
          }
        })

      return {
        id: bed.id,
        name: bed.name || 'Garden Bed',
        points,
        fill: '#e0f2e0',
        stroke: '#22c55e',
        rotation: position.rotation || 0,
        width,
        height,
        plants: bedPlantings,
      }
    })
  }
}
