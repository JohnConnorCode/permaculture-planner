import { useEffect, useCallback, useState } from 'react'
import { GardenBed } from '@/lib/garden/garden-types'

const DEMO_STORAGE_KEY = 'permaculture_demo_plan'
const DEMO_METADATA_KEY = 'permaculture_demo_metadata'

export interface DemoPlanMetadata {
  name: string
  lastSaved: number
  createdAt: number
}

/**
 * useдемoPersistence - Full localStorage persistence for demo
 * Auto-saves every change and allows load/save/delete operations
 */
export function useDemoPersistence(initialData: GardenBed[]) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [planName, setPlanName] = useState('Demo Plan')
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Load persisted data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Data will be loaded by parent component
        const metadata = localStorage.getItem(DEMO_METADATA_KEY)
        if (metadata) {
          const meta = JSON.parse(metadata) as DemoPlanMetadata
          setPlanName(meta.name)
          setLastSaved(new Date(meta.lastSaved))
        }
      }
    } catch (error) {
      console.error('Failed to load demo data:', error)
    }
  }, [])

  // Auto-save with debounce
  const autoSave = useCallback((data: GardenBed[], metadata?: Partial<DemoPlanMetadata>) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))

        const meta: DemoPlanMetadata = {
          name: metadata?.name || planName,
          lastSaved: Date.now(),
          createdAt: metadata?.createdAt || Date.now(),
        }
        localStorage.setItem(DEMO_METADATA_KEY, JSON.stringify(meta))

        setLastSaved(new Date(meta.lastSaved))
        setHasUnsavedChanges(false)
      } catch (error) {
        console.error('Failed to save demo data:', error)
      }
    }, 1000) // 1 second debounce

    setSaveTimeout(timeout)
    setHasUnsavedChanges(true)
  }, [planName, saveTimeout])

  // Immediate save (for explicit save action)
  const save = useCallback((data: GardenBed[], name?: string) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))

      const newName = name || planName
      const meta: DemoPlanMetadata = {
        name: newName,
        lastSaved: Date.now(),
        createdAt: Date.now(),
      }
      localStorage.setItem(DEMO_METADATA_KEY, JSON.stringify(meta))

      setPlanName(newName)
      setLastSaved(new Date(meta.lastSaved))
      setHasUnsavedChanges(false)
      return { success: true }
    } catch (error) {
      console.error('Failed to save:', error)
      return { success: false, error: (error as Error).message }
    }
  }, [planName, saveTimeout])

  // Load from storage
  const load = useCallback((): { success: boolean; data?: GardenBed[] } => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY)
      if (!saved) {
        return { success: false }
      }
      const data = JSON.parse(saved) as GardenBed[]
      return { success: true, data }
    } catch (error) {
      console.error('Failed to load:', error)
      return { success: false }
    }
  }, [])

  // Clear all data
  const clear = useCallback(() => {
    localStorage.removeItem(DEMO_STORAGE_KEY)
    localStorage.removeItem(DEMO_METADATA_KEY)
    setPlanName('Demo Plan')
    setLastSaved(null)
    setHasUnsavedChanges(false)
  }, [])

  // Export as JSON
  const exportJSON = useCallback((data: GardenBed[]) => {
    const plan = {
      name: planName,
      beds: data,
      timestamp: Date.now(),
      version: '1.0',
    }
    const dataStr = JSON.stringify(plan, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const link = document.createElement('a')
    link.setAttribute('href', dataUri)
    link.setAttribute('download', `${planName.replace(/\s+/g, '-')}-${Date.now()}.json`)
    link.click()
  }, [planName])

  // Import from JSON
  const importJSON = useCallback((file: File): Promise<{ success: boolean; data?: GardenBed[] }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const plan = JSON.parse(content)
          if (plan.beds && Array.isArray(plan.beds)) {
            setPlanName(plan.name || 'Imported Plan')
            resolve({ success: true, data: plan.beds })
          } else {
            resolve({ success: false })
          }
        } catch (error) {
          console.error('Failed to import:', error)
          resolve({ success: false })
        }
      }
      reader.readAsText(file)
    })
  }, [])

  return {
    autoSave,
    save,
    load,
    clear,
    exportJSON,
    importJSON,
    hasUnsavedChanges,
    lastSaved,
    planName,
    setPlanName,
  }
}
