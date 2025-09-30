'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { gardenService } from '@/lib/garden/garden-service'
import { useAuth } from '@/lib/auth/auth-context'
import { showSuccess, showError, showWarning } from '@/components/ui/action-feedback'
import {
  GardenBed,
  GardenData,
  CanvasMetadata,
  SaveGardenResult,
  LoadGardenResult
} from '@/lib/garden/garden-types'

export interface GardenPersistenceConfig {
  autoSaveInterval?: number // milliseconds, default 30 seconds
  enableAutoSave?: boolean // default true
  conflictResolution?: 'prompt' | 'auto-local' | 'auto-server' // default 'prompt'
  maxRetries?: number // default 3
  enableOfflineCache?: boolean // default true
}

export interface SaveState {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date
  error?: string
  planId?: string
  hasUnsavedChanges: boolean
}

export function useGardenPersistence(
  beds: GardenBed[],
  metadata: CanvasMetadata,
  config: GardenPersistenceConfig = {}
) {
  const {
    autoSaveInterval = 30000, // 30 seconds
    enableAutoSave = true,
    conflictResolution = 'prompt',
    maxRetries = 3,
    enableOfflineCache = true
  } = config

  const { user } = useAuth()
  const [saveState, setSaveState] = useState<SaveState>({
    status: 'idle',
    hasUnsavedChanges: false
  })
  const [loadedGarden, setLoadedGarden] = useState<GardenData | null>(null)

  // Refs to track state for auto-save
  const lastSaveDataRef = useRef<string>('')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)

  // Generate a hash of the current data for comparison
  const generateDataHash = useCallback((beds: GardenBed[], metadata: CanvasMetadata) => {
    return JSON.stringify({ beds, metadata })
  }, [])

  // Check if data has changed since last save
  const hasChanges = useCallback(() => {
    const currentHash = generateDataHash(beds, metadata)
    return currentHash !== lastSaveDataRef.current
  }, [beds, metadata, generateDataHash])

  // Update unsaved changes flag - use JSON comparison to prevent infinite loop
  useEffect(() => {
    const currentHash = JSON.stringify({ beds, metadata })
    const hasUnsavedChanges = currentHash !== lastSaveDataRef.current
    setSaveState(prev => {
      // Only update if the value actually changed
      if (prev.hasUnsavedChanges !== hasUnsavedChanges) {
        return {
          ...prev,
          hasUnsavedChanges
        }
      }
      return prev
    })
  }, [beds, metadata])

  // Save to database
  const save = useCallback(async (
    forceSave = false,
    options: { name?: string; siteData?: any } = {}
  ): Promise<SaveGardenResult> => {
    if (!user) {
      showError('Please sign in to save your garden')
      return { success: false, error: 'Not authenticated' }
    }

    if (!forceSave && !hasChanges()) {
      return { success: true, planId: saveState.planId }
    }

    setSaveState(prev => ({ ...prev, status: 'saving', error: undefined }))

    try {
      let result: SaveGardenResult

      if (saveState.planId) {
        // Update existing garden
        result = await gardenService.updateGarden(saveState.planId, beds, metadata)
      } else {
        // Create new garden
        result = await gardenService.saveGarden(
          beds,
          metadata,
          options.siteData,
          { name: options.name }
        )
      }

      if (result.success) {
        const currentHash = generateDataHash(beds, metadata)
        lastSaveDataRef.current = currentHash

        setSaveState(prev => ({
          ...prev,
          status: 'saved',
          lastSaved: new Date(),
          planId: result.planId || prev.planId,
          hasUnsavedChanges: false
        }))

        retryCountRef.current = 0

        // Cache locally if enabled
        if (enableOfflineCache) {
          try {
            localStorage.setItem('garden_cache', JSON.stringify({
              beds,
              metadata,
              timestamp: Date.now(),
              planId: result.planId
            }))
          } catch (e) {
            console.warn('Failed to cache garden locally:', e)
          }
        }
      } else {
        setSaveState(prev => ({
          ...prev,
          status: 'error',
          error: result.error
        }))
      }

      return result

    } catch (error) {
      console.error('Save error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Save failed'

      setSaveState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }))

      return { success: false, error: errorMessage }
    }
  }, [user, beds, metadata, saveState.planId, hasChanges, generateDataHash, enableOfflineCache])

  // Load from database
  const load = useCallback(async (planId: string): Promise<LoadGardenResult> => {
    if (!user) {
      showError('Please sign in to load gardens')
      return { success: false, error: 'Not authenticated' }
    }

    setSaveState(prev => ({ ...prev, status: 'saving' })) // Reuse saving status for loading

    try {
      const result = await gardenService.loadGarden(planId)

      if (result.success && result.garden) {
        setLoadedGarden(result.garden)
        setSaveState(prev => ({
          ...prev,
          status: 'saved',
          lastSaved: new Date(),
          planId: result.garden!.plan.id,
          hasUnsavedChanges: false
        }))

        // Update hash to match loaded data
        const currentHash = generateDataHash(result.garden.beds, result.garden.canvas)
        lastSaveDataRef.current = currentHash
      } else {
        setSaveState(prev => ({
          ...prev,
          status: 'error',
          error: result.error
        }))
      }

      return result

    } catch (error) {
      console.error('Load error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Load failed'

      setSaveState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage
      }))

      return { success: false, error: errorMessage }
    }
  }, [user, generateDataHash])

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (!enableAutoSave || !user) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (hasChanges() && retryCountRef.current < maxRetries) {
        const result = await gardenService.autoSave(
          beds,
          metadata,
          saveState.planId,
          saveState.lastSaved?.getTime()
        )

        if (result.success) {
          const currentHash = generateDataHash(beds, metadata)
          lastSaveDataRef.current = currentHash

          setSaveState(prev => ({
            ...prev,
            status: 'saved',
            lastSaved: new Date(),
            planId: result.planId || prev.planId,
            hasUnsavedChanges: false
          }))

          retryCountRef.current = 0
        } else if (result.error !== 'Conflict detected') {
          retryCountRef.current++
          if (retryCountRef.current < maxRetries) {
            scheduleAutoSave() // Retry
          } else {
            setSaveState(prev => ({
              ...prev,
              status: 'error',
              error: 'Auto-save failed after multiple attempts'
            }))
            showWarning('Auto-save failed. Please save manually.')
          }
        }
      }
    }, autoSaveInterval)
  }, [enableAutoSave, user, beds, metadata, saveState.planId, saveState.lastSaved, hasChanges, maxRetries, autoSaveInterval, generateDataHash])

  // Schedule auto-save when data changes
  useEffect(() => {
    if (enableAutoSave && hasChanges()) {
      scheduleAutoSave()
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [enableAutoSave, scheduleAutoSave, hasChanges])

  // Load cached data on mount if available
  useEffect(() => {
    if (!enableOfflineCache) return

    try {
      const cached = localStorage.getItem('garden_cache')
      if (cached) {
        const cacheData = JSON.parse(cached)
        const cacheAge = Date.now() - cacheData.timestamp

        // Use cache if less than 1 hour old and no planId set
        if (cacheAge < 3600000 && !saveState.planId) {
          setSaveState(prev => ({
            ...prev,
            planId: cacheData.planId,
            lastSaved: new Date(cacheData.timestamp)
          }))

          const currentHash = generateDataHash(cacheData.beds, cacheData.metadata)
          lastSaveDataRef.current = currentHash
        }
      }
    } catch (e) {
      console.warn('Failed to load cached garden:', e)
    }
  }, [enableOfflineCache, saveState.planId, generateDataHash])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  // List user gardens
  const listGardens = useCallback(async () => {
    if (!user) return []
    return gardenService.listUserGardens()
  }, [user])

  // Delete garden
  const deleteGarden = useCallback(async (planId: string) => {
    if (!user) {
      showError('Please sign in to delete gardens')
      return { success: false, error: 'Not authenticated' }
    }

    const result = await gardenService.deleteGarden(planId)

    if (result.success && saveState.planId === planId) {
      // Clear current state if this was the active garden
      setSaveState({
        status: 'idle',
        hasUnsavedChanges: false
      })
      setLoadedGarden(null)
      lastSaveDataRef.current = ''
    }

    return result
  }, [user, saveState.planId])

  // Force save (bypass change detection)
  const forceSave = useCallback((options?: { name?: string; siteData?: any }) => {
    return save(true, options)
  }, [save])

  // Check if garden can be saved
  const canSave = useCallback(() => {
    return !!user && (hasChanges() || !saveState.planId)
  }, [user, hasChanges, saveState.planId])

  return {
    // State
    saveState,
    loadedGarden,
    canSave: canSave(),
    isAuthenticated: !!user,

    // Actions
    save,
    forceSave,
    load,
    listGardens,
    deleteGarden,

    // Utilities
    hasUnsavedChanges: saveState.hasUnsavedChanges,
    lastSaved: saveState.lastSaved,
    planId: saveState.planId
  }
}