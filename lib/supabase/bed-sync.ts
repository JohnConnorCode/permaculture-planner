/**
 * Supabase Bed Synchronization
 *
 * Handles bidirectional sync between GardenBed format (used by canvas)
 * and Supabase beds table format (used by database)
 */

import { GardenBed } from '@/lib/garden/garden-types'
import { SupabaseClient } from '@supabase/supabase-js'

export interface SupabaseBed {
  id: string
  plan_id: string
  name: string
  shape: 'rect' | 'circular' | 'keyhole' | 'spiral'
  length_ft: number
  width_ft: number
  height_in: number
  orientation: 'NS' | 'EW'
  surface: 'soil' | 'hard' | 'rooftop' | 'concrete'
  wicking: boolean
  trellis: boolean
  path_clearance_in: number
  notes?: string
  order_index: number
  position_json?: {
    x: number
    y: number
    rotation: number
  }
}

/**
 * Convert GardenBed to Supabase beds format
 */
export function gardenBedToSupabase(bed: GardenBed, planId: string, orderIndex: number = 0): Partial<SupabaseBed> {
  // Convert inches to feet for length and width
  const lengthFt = (bed.width || 48) / 12
  const widthFt = (bed.height || 48) / 12

  // Determine orientation from rotation
  // 0° or 180° = North-South, 90° or 270° = East-West
  const rotation = bed.rotation || 0
  const orientation = (rotation === 90 || rotation === 270) ? 'EW' : 'NS'

  // Store position and rotation for visual editor
  const positionJson = bed.points && bed.points.length > 0
    ? {
        x: bed.points[0].x,
        y: bed.points[0].y,
        rotation,
      }
    : { x: 0, y: 0, rotation }

  return {
    id: bed.id,
    plan_id: planId,
    name: bed.name || 'Garden Bed',
    shape: 'rect', // All beds from canvas are rectangular for now
    length_ft: Math.round(lengthFt * 100) / 100, // Round to 2 decimals
    width_ft: Math.round(widthFt * 100) / 100,
    height_in: 12, // Default bed depth
    orientation,
    surface: 'soil',
    wicking: false,
    trellis: false,
    path_clearance_in: 24,
    order_index: orderIndex,
    position_json: positionJson,
  }
}

/**
 * Save all garden beds to Supabase
 *
 * Strategy:
 * 1. Get existing beds for this plan
 * 2. Upsert (insert/update) all beds from canvas
 * 3. Delete beds that were removed from canvas
 */
export async function syncBedsToSupabase(
  supabase: SupabaseClient,
  planId: string,
  gardenBeds: GardenBed[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Get existing bed IDs
    const { data: existingBeds, error: fetchError } = await (supabase as any)
      .from('beds')
      .select('id')
      .eq('plan_id', planId)

    if (fetchError) {
      console.error('Error fetching existing beds:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const existingBedIds = new Set(existingBeds?.map((b: any) => b.id) || [])
    const currentBedIds = new Set(gardenBeds.map(b => b.id))

    // Step 2: Convert all garden beds to Supabase format
    const supabaseBeds = gardenBeds.map((bed, index) =>
      gardenBedToSupabase(bed, planId, index)
    )

    // Step 3: Upsert beds (insert new, update existing)
    if (supabaseBeds.length > 0) {
      const { error: upsertError } = await (supabase as any)
        .from('beds')
        .upsert(supabaseBeds, {
          onConflict: 'id',
          ignoreDuplicates: false, // Update if exists
        })

      if (upsertError) {
        console.error('Error upserting beds:', upsertError)
        return { success: false, error: upsertError.message }
      }
    }

    // Step 4: Delete beds that were removed from canvas
    const bedsToDelete = Array.from(existingBedIds).filter(
      id => !currentBedIds.has(id)
    )

    if (bedsToDelete.length > 0) {
      const { error: deleteError } = await (supabase as any)
        .from('beds')
        .delete()
        .in('id', bedsToDelete)

      if (deleteError) {
        console.error('Error deleting removed beds:', deleteError)
        return { success: false, error: deleteError.message }
      }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error syncing beds to Supabase:', error)
    return { success: false, error: errorMessage }
  }
}

/**
 * Save tldraw scene JSON to plans table
 *
 * This preserves the entire canvas state including all shapes,
 * not just beds. Useful for complete restoration of the editor state.
 */
export async function saveSceneToSupabase(
  supabase: SupabaseClient,
  planId: string,
  sceneJson: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('plans')
      .update({ scene_json: sceneJson })
      .eq('id', planId)

    if (error) {
      console.error('Error saving scene JSON:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error saving scene to Supabase:', error)
    return { success: false, error: errorMessage }
  }
}
