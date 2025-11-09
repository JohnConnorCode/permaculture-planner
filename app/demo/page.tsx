'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PermacultureEditorIntegrated } from '@/components/tldraw/permaculture-editor-integrated'
import { useGardenStore } from '@/lib/store/garden-store'
import { LocalStoragePersistence } from '@/lib/persistence/local-storage-adapter'
import { SupabasePersistence } from '@/lib/persistence/supabase-adapter'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { GardenBed } from '@/lib/garden/garden-types'

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

function DemoPageContent() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('planId')

  // Access centralized store
  const beds = useGardenStore((state) => state.beds)
  const isLoading = useGardenStore((state) => state.isLoading)
  const error = useGardenStore((state) => state.error)
  const isDirty = useGardenStore((state) => state.isDirty)

  // Actions
  const setPersistence = useGardenStore((state) => state.setPersistence)
  const setPlanId = useGardenStore((state) => state.setPlanId)
  const load = useGardenStore((state) => state.load)
  const updateBeds = useGardenStore((state) => state.updateBeds)
  const clearError = useGardenStore((state) => state.clearError)
  const reset = useGardenStore((state) => state.reset)

  // Setup persistence adapter on mount
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      reset()
    }
  }, [reset])

  useEffect(() => {
    const initializePersistence = async () => {
      // Priority 1: Load from planId (wizard flow)
      if (planId) {
        const supabase = createClient()
        const adapter = new SupabasePersistence(supabase, planId)
        setPersistence(adapter)
        setPlanId(planId)

        await load(planId)

        if (beds.length > 0) {
          toast.success('Loaded your garden plan from wizard')
        } else {
          toast.error('Could not load your garden plan', {
            description: 'Showing starter garden instead'
          })
          updateBeds(STARTER_GARDEN)
        }
      } else {
        // Priority 2: Demo mode with localStorage
        const adapter = new LocalStoragePersistence()
        setPersistence(adapter)

        await load()

        const loadedBeds = useGardenStore.getState().beds

        if (loadedBeds.length > 0) {
          toast.success('Loaded your saved demo garden')
        } else {
          // No saved data, use starter garden
          updateBeds(STARTER_GARDEN)
          toast.info('Starting with example garden', {
            description: 'Try the wizard to create a custom plan!'
          })
        }
      }
    }

    initializePersistence()
  }, [planId, setPersistence, setPlanId, load, updateBeds])

  // Loading state
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
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm text-red-800 flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Unsaved changes indicator */}
      {isDirty && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800">
          💾 Auto-saving changes...
        </div>
      )}

      {/* Main editor - now directly reads from store */}
      <div className="flex-1 overflow-hidden">
        <PermacultureEditorIntegrated
          initialData={beds}
          onSave={updateBeds}
          showHeader={true}
        />
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading demo...</p>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  )
}
