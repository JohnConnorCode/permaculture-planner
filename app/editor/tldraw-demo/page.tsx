'use client'

import { useState, useEffect } from 'react'
import { PermacultureCanvas } from '@/components/tldraw/permaculture-canvas'
import { GardenBed } from '@/lib/garden/garden-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Demo page showcasing the new tldraw-based permaculture canvas
 *
 * This demonstrates the migration from the old SVG-based canvas
 * to the high-performance tldraw implementation.
 */
export default function TldrawDemo() {
  const router = useRouter()
  const [gardenBeds, setGardenBeds] = useState<GardenBed[]>([])
  const [hasChanges, setHasChanges] = useState(false)

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
    setHasChanges(true)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(gardenBeds, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'permaculture-plan.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast.success('Plan exported successfully')
  }

  const handleSaveToDatabase = () => {
    // TODO: Implement database save
    toast.success('Saved to database (demo)')
    setHasChanges(false)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">tldraw Canvas Demo</h1>
              <p className="text-xs text-muted-foreground">
                Next-generation permaculture planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-muted-foreground">
                Unsaved changes
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleSaveToDatabase}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border-b px-4 py-2">
        <div className="flex items-start gap-3">
          <div className="flex-1 text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              🚀 New Canvas Technology
            </p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              This is the new tldraw-powered canvas with professional-grade performance.
              Try panning (space + drag), zooming (ctrl/cmd + scroll), selecting shapes, and transforming them.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Canvas + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <PermacultureCanvas
            initialData={gardenBeds}
            onSave={handleSave}
            className="w-full h-full"
          />
        </div>

        {/* Sidebar */}
        <aside className="w-80 border-l bg-card/50 backdrop-blur overflow-y-auto">
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beds:</span>
                  <span className="font-mono">{gardenBeds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plants:</span>
                  <span className="font-mono">
                    {gardenBeds.reduce((sum, bed) => sum + bed.plants.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renderer:</span>
                  <span className="font-mono text-green-600">tldraw</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Viewport culling (renders only visible shapes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>60fps smooth interactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Professional transform handles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Multi-selection & grouping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Built-in undo/redo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Touch & mobile support</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Space + Drag</span>
                  <span>Pan canvas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ctrl/Cmd + Scroll</span>
                  <span>Zoom</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ctrl/Cmd + Z</span>
                  <span>Undo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ctrl/Cmd + Shift + Z</span>
                  <span>Redo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delete</span>
                  <span>Delete selection</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ctrl/Cmd + D</span>
                  <span>Duplicate</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Plan Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-40 bg-muted p-2 rounded">
                  {JSON.stringify(gardenBeds, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}
