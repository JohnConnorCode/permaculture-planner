import { GardenBed } from '@/lib/garden/garden-types'

/**
 * Metadata for the canvas/garden design
 */
export interface CanvasMetadata {
  zoom?: number
  pan?: { x: number; y: number }
  showGrid?: boolean
  gridSize?: number
  lastModified?: string
  version?: string
}

/**
 * Complete garden plan data
 */
export interface GardenPlanData {
  beds: GardenBed[]
  metadata: CanvasMetadata
  planName?: string
}

/**
 * Result of a save operation
 */
export interface SaveResult {
  success: boolean
  error?: string
  planId?: string
}

/**
 * Result of a load operation
 */
export interface LoadResult {
  success: boolean
  data?: GardenBed[]
  metadata?: CanvasMetadata
  planName?: string
  error?: string
}

/**
 * Result of a delete operation
 */
export interface DeleteResult {
  success: boolean
  error?: string
}

/**
 * Unified persistence adapter interface
 *
 * All persistence strategies (localStorage, Supabase, etc.)
 * must implement this interface to ensure consistent behavior.
 */
export interface IPersistenceAdapter {
  /**
   * Save garden plan data
   */
  save(data: GardenBed[], metadata?: CanvasMetadata, planName?: string): Promise<SaveResult>

  /**
   * Load garden plan data
   * @param id Optional plan ID (for database backends)
   */
  load(id?: string): Promise<LoadResult>

  /**
   * Delete a garden plan
   * @param id Plan ID to delete
   */
  delete(id?: string): Promise<DeleteResult>

  /**
   * Auto-save with debouncing
   * Implementation should debounce this call to avoid excessive saves
   */
  autoSave(data: GardenBed[], metadata?: CanvasMetadata): void

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean

  /**
   * Clear unsaved changes flag
   */
  markAsSaved(): void

  /**
   * Get the last save timestamp
   */
  getLastSaved(): Date | null
}
