'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { PermacultureEditorIntegrated } from '@/components/tldraw/permaculture-editor-integrated'
import { GardenBed } from '@/lib/garden/garden-types'
import { useDemoPersistence } from '@/hooks/use-demo-persistence'
import { gardenService } from '@/lib/garden/garden-service'
import { toast } from 'sonner'

// Example starter garden layout
const STARTER_GARDEN: GardenBed[] = [
  {
    id: 'herb-bed',
    name: 'Herb Garden',
    points: [
      { x: 100, y: 100 },
      { x: 300, y: 100 },
      { x: 300, y: 200 },
      { x: 100, y: 200 }
    ],
    fill: '#e0f2e0',
    stroke: '#22c55e',
    plants: [
      { id: 'p1', plantId: 'basil', x: 140, y: 140 },
      { id: 'p2', plantId: 'thyme', x: 200, y: 140 },
      { id: 'p3', plantId: 'rosemary', x: 260, y: 140 }
    ]
  },
  {
    id: 'veggie-bed',
    name: 'Vegetable Bed',
    points: [
      { x: 400, y: 100 },
      { x: 600, y: 100 },
      { x: 600, y: 200 },
      { x: 400, y: 200 }
    ],
    fill: '#fef3c7',
    stroke: '#f59e0b',
    plants: [
      { id: 'p4', plantId: 'tomato', x: 450, y: 140 },
      { id: 'p5', plantId: 'lettuce', x: 520, y: 140 },
      { id: 'p6', plantId: 'peppers', x: 580, y: 140 }
    ]
  }
]

export default function DemoPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')
  const [gardenData, setGardenData] = useState<GardenBed[]>(STARTER_GARDEN)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const persistence = useDemoPersistence(STARTER_GARDEN)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load garden from planId (wizard) or localStorage (demo mode)
  useEffect(() => {
    const loadGarden = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        // Priority 1: Load from planId if provided (from wizard)
        if (planId) {
          const result = await gardenService.loadGarden(planId)
          if (result.success && result.garden) {
            setGardenData(result.garden.beds)
            toast.success('Loaded your garden plan from wizard')
          } else {
            setLoadError(result.error || 'Failed to load garden plan')
            toast.error('Could not load your garden plan', {
              description: 'Showing starter garden instead'
            })
            // Fall back to localStorage
            const { data } = persistence.load()
            if (data && data.length > 0) {
              setGardenData(data)
            }
          }
        } else {
          // Priority 2: Load from localStorage (demo mode)
          const { data } = persistence.load()
          if (data && data.length > 0) {
            setGardenData(data)
            toast.success('Loaded your saved demo garden')
          } else {
            toast.info('Starting with example garden', {
              description: 'Try the wizard to create a custom plan!'
            })
          }
        }
      } catch (error) {
        console.error('Error loading garden:', error)
        setLoadError('Failed to load garden')
        toast.error('Error loading garden')
      } finally {
        setIsLoading(false)
      }
    }

    loadGarden()
  }, [planId])

  const handleCanvasChange = (updatedData: GardenBed[]) => {
    setGardenData(updatedData)
    persistence.autoSave(updatedData)
  }

  const handleSave = () => {
    const result = persistence.save(gardenData)
    if (result.success) {
      toast.success('Plan saved to your browser', {
        description: 'Your design is automatically saved'
      })
    } else {
      toast.error('Failed to save', { description: result.error })
    }
  }

  const handleExport = () => {
    persistence.exportJSON(gardenData)
    toast.success('Plan exported', { description: 'JSON file downloaded' })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await persistence.importJSON(file)
    if (result.success && result.data) {
      setGardenData(result.data)
      persistence.save(result.data, persistence.planName)
      toast.success('Plan imported', { description: `Loaded: ${persistence.planName}` })
    } else {
      toast.error('Failed to import', { description: 'Invalid file format' })
    }
  }

  const handleClear = () => {
    if (confirm('Clear all beds? This cannot be undone.')) {
      setGardenData([])
      persistence.clear()
      toast.success('Design cleared')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {planId ? 'Loading your garden plan...' : 'Loading demo...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Error alert */}
      {(loadError || persistence.error) && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex justify-between items-center">
          <span>⚠️ {loadError || persistence.error}</span>
          <button
            onClick={() => {
              setLoadError(null)
              persistence.setError(null)
            }}
            className="text-red-600 hover:text-red-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main editor - handles its own header and UI */}
      <div className="flex-1 overflow-hidden">
        <PermacultureEditorIntegrated
          initialData={gardenData}
          onSave={handleCanvasChange}
          showHeader={true}
        />
      </div>

      {/* Hidden file input for future import if needed */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import JSON file"
      />
    </div>
  )
}
