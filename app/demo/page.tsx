'use client'

import { useState, useEffect, useRef } from 'react'
import { PermacultureEditorIntegrated } from '@/components/tldraw/permaculture-editor-integrated'
import { GardenBed } from '@/lib/garden/garden-types'
import { useDemoPersistence } from '@/hooks/use-demo-persistence'
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
  const [gardenData, setGardenData] = useState<GardenBed[]>(STARTER_GARDEN)
  const [isLoading, setIsLoading] = useState(true)
  const persistence = useDemoPersistence(STARTER_GARDEN)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load persisted data on mount
  useEffect(() => {
    const { data } = persistence.load()
    if (data && data.length > 0) {
      setGardenData(data)
    }
    setIsLoading(false)
  }, [])

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
          <p className="text-gray-600">Loading demo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Persistence status bar */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b px-4 py-2 text-xs text-gray-600 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>📋 Demo Mode - Full featured, saves locally</span>
          {persistence.lastSaved && (
            <span className="text-gray-500">
              Last saved: {persistence.lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium"
          >
            💾 Save
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
          >
            📥 Export
          </button>
          <button
            onClick={handleImportClick}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs font-medium"
          >
            📤 Import
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
          >
            🗑️ Clear
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Main editor */}
      <div className="flex-1 overflow-hidden">
        <PermacultureEditorIntegrated
          initialData={gardenData}
          onSave={handleCanvasChange}
          showHeader={true}
        />
      </div>
    </div>
  )
}
