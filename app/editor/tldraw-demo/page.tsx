'use client'

import { useState, useEffect } from 'react'
import { PermacultureEditor } from '@/components/tldraw/permaculture-editor'
import { GardenBed } from '@/lib/garden/garden-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Demo page showcasing the new tldraw-based permaculture canvas
 *
 * This demonstrates the migration from the old SVG-based canvas
 * to the high-performance tldraw implementation with full features.
 */
export default function TldrawDemo() {
  const router = useRouter()
  const [gardenBeds, setGardenBeds] = useState<GardenBed[]>([])
  const [saveCount, setSaveCount] = useState(0)

  // Load demo data
  useEffect(() => {
    const demoData: GardenBed[] = [
      {
        id: 'bed-1',
        name: 'Tomato Bed',
        points: [
          { x: 100, y: 100 },
          { x: 300, y: 100 },
          { x: 300, y: 200 },
          { x: 100, y: 200 },
        ],
        fill: '#e0f2e0',
        stroke: '#22c55e',
        plants: [
          {
            id: 'plant-1',
            plantId: 'tomato',
            x: 50,
            y: 50,
          },
          {
            id: 'plant-2',
            plantId: 'basil',
            x: 150,
            y: 50,
          },
        ],
        width: 200,
        height: 100,
        elementCategory: 'bed',
        zone: 1,
      },
      {
        id: 'bed-2',
        name: 'Herb Garden',
        points: [
          { x: 350, y: 150 },
          { x: 500, y: 150 },
          { x: 500, y: 250 },
          { x: 350, y: 250 },
        ],
        fill: '#f0e6ff',
        stroke: '#8b5cf6',
        plants: [
          {
            id: 'plant-3',
            plantId: 'rosemary',
            x: 50,
            y: 40,
          },
        ],
        width: 150,
        height: 100,
        elementCategory: 'bed',
        zone: 2,
      },
      {
        id: 'pond-1',
        name: 'Pond',
        points: [
          { x: 550, y: 100 },
          { x: 650, y: 100 },
          { x: 650, y: 200 },
          { x: 550, y: 200 },
        ],
        fill: '#dbeafe',
        stroke: '#3b82f6',
        plants: [],
        width: 100,
        height: 100,
        elementCategory: 'water_management',
        elementType: 'pond',
        zone: 3,
      },
    ]

    setGardenBeds(demoData)
  }, [])

  const handleSave = (updatedBeds: GardenBed[]) => {
    setGardenBeds(updatedBeds)
    setSaveCount((prev) => prev + 1)
  }

  const handleSaveToDatabase = () => {
    // TODO: Implement database save
    toast.success('Saved to database (demo mode)')
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Simple Header */}
      <header className="border-b bg-card/50 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              Next-Gen Editor
            </Badge>
            <Badge variant="outline">{saveCount} auto-saves</Badge>
          </div>
        </div>
      </header>

      {/* Integrated Editor */}
      <div className="flex-1">
        <PermacultureEditor
          initialData={gardenBeds}
          onSave={handleSave}
          showHeader={false}
        />
      </div>
    </div>
  )
}
