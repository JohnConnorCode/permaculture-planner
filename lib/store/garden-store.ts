import { create } from 'zustand'
import { GardenBed } from '@/lib/garden/garden-types'
import { IPersistenceAdapter, CanvasMetadata } from '@/lib/persistence/types'

/**
 * Garden State
 * - Single source of truth for all garden/canvas data
 * - Used by demo, editor, and canvas components
 */
interface GardenState {
  // Data
  beds: GardenBed[]
  metadata: CanvasMetadata
  planName: string
  planId: string | null

  // State flags
  isLoading: boolean
  isDirty: boolean
  lastSaved: Date | null
  error: string | null

  // Persistence
  persistence: IPersistenceAdapter | null
}

/**
 * Garden Actions
 * - All state mutations go through these actions
 * - Ensures consistency and predictability
 */
interface GardenActions {
  // Setup
  setPersistence: (adapter: IPersistenceAdapter) => void
  setPlanId: (planId: string | null) => void
  reset: () => void

  // Data mutations
  updateBeds: (beds: GardenBed[]) => void
  updateMetadata: (metadata: Partial<CanvasMetadata>) => void
  updatePlanName: (name: string) => void

  // Persistence operations
  save: () => Promise<void>
  load: (id?: string) => Promise<void>
  autoSave: () => void
  clear: () => Promise<void>

  // Utility
  setError: (error: string | null) => void
  clearError: () => void
}

/**
 * Initial state
 */
const initialState: GardenState = {
  beds: [],
  metadata: {
    zoom: 100,
    pan: { x: 0, y: 0 },
    showGrid: true,
    gridSize: 20,
  },
  planName: 'Untitled Garden',
  planId: null,
  isLoading: false,
  isDirty: false,
  lastSaved: null,
  error: null,
  persistence: null,
}

/**
 * Garden Store
 *
 * Usage:
 *
 * // Setup persistence
 * const setPersistence = useGardenStore((state) => state.setPersistence)
 * useEffect(() => {
 *   const adapter = new LocalStoragePersistence()
 *   setPersistence(adapter)
 *   load()
 * }, [])
 *
 * // Access state
 * const beds = useGardenStore((state) => state.beds)
 * const isDirty = useGardenStore((state) => state.isDirty)
 *
 * // Mutate state
 * const updateBeds = useGardenStore((state) => state.updateBeds)
 * updateBeds(newBeds)
 */
export const useGardenStore = create<GardenState & GardenActions>((set, get) => ({
  // ========== Initial State ==========
  ...initialState,

  // ========== Setup Actions ==========

  setPersistence: (adapter) => {
    set({ persistence: adapter })
  },

  setPlanId: (planId) => {
    set({ planId })
  },

  reset: () => {
    set(initialState)
  },

  // ========== Data Mutation Actions ==========

  updateBeds: (beds) => {
    const { persistence } = get()
    set({ beds, isDirty: true })

    // Trigger auto-save
    if (persistence) {
      get().autoSave()
    }
  },

  updateMetadata: (metadata) => {
    set((state) => ({
      metadata: { ...state.metadata, ...metadata },
      isDirty: true,
    }))
  },

  updatePlanName: (planName) => {
    set({ planName, isDirty: true })
  },

  // ========== Persistence Actions ==========

  save: async () => {
    const { persistence, beds, metadata, planName } = get()

    if (!persistence) {
      set({ error: 'No persistence adapter configured' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const result = await persistence.save(beds, metadata, planName)

      if (result.success) {
        set({
          isDirty: false,
          lastSaved: new Date(),
          isLoading: false,
          planId: result.planId || get().planId,
        })
      } else {
        set({
          error: result.error || 'Save failed',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Save failed',
        isLoading: false,
      })
    }
  },

  load: async (id?: string) => {
    const { persistence } = get()

    if (!persistence) {
      set({ error: 'No persistence adapter configured' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const result = await persistence.load(id)

      if (result.success && result.data) {
        set({
          beds: result.data,
          metadata: { ...get().metadata, ...result.metadata },
          planName: result.planName || 'Untitled Garden',
          isDirty: false,
          lastSaved: persistence.getLastSaved(),
          isLoading: false,
        })
      } else {
        set({
          error: result.error || 'Load failed',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Load failed',
        isLoading: false,
      })
    }
  },

  autoSave: () => {
    const { persistence, beds, metadata } = get()

    if (persistence) {
      persistence.autoSave(beds, metadata)
    }
  },

  clear: async () => {
    const { persistence } = get()

    if (!persistence) {
      set({ error: 'No persistence adapter configured' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const result = await persistence.delete()

      if (result.success) {
        set({
          ...initialState,
          persistence, // Keep persistence adapter
          isLoading: false,
        })
      } else {
        set({
          error: result.error || 'Clear failed',
          isLoading: false,
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Clear failed',
        isLoading: false,
      })
    }
  },

  // ========== Utility Actions ==========

  setError: (error) => {
    set({ error })
  },

  clearError: () => {
    set({ error: null })
  },
}))
