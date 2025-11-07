'use client'

import { useState, useEffect } from 'react'
import { PermacultureCanvas } from '@/components/tldraw/permaculture-canvas'
import { GardenBed } from '@/lib/garden/garden-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Download, Zap, Layers, Smartphone, Maximize2, CheckCircle2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

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
    setHasChanges(true)
    setSaveCount((prev) => prev + 1)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(gardenBeds, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `permaculture-plan-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast.success('Plan exported successfully')
  }

  const handleSaveToDatabase = () => {
    // TODO: Implement database save
    toast.success('Saved to database (demo mode)')
    setHasChanges(false)
  }

  const bedCount = gardenBeds.length
  const plantCount = gardenBeds.reduce((sum, bed) => sum + bed.plants.length, 0)

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
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">tldraw Canvas Demo</h1>
                <Badge variant="default" className="bg-green-500">
                  Next-Gen
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Professional-grade permaculture planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="hidden sm:flex">
                {saveCount} auto-saves
              </Badge>
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
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b px-4 py-3">
        <div className="flex items-start gap-3 max-w-7xl mx-auto">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm space-y-1">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              🚀 Welcome to the Next-Generation Canvas
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Try panning (space + drag), zooming (ctrl/cmd + scroll), selecting shapes, and transforming them.
              This canvas handles 100+ elements smoothly and works great on mobile.
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
        <aside className="w-80 border-l bg-card/30 backdrop-blur overflow-y-auto">
          <div className="p-4 space-y-4">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Canvas Stats</CardTitle>
                    <CardDescription>Real-time performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Garden Beds</span>
                      <Badge variant="secondary" className="font-mono">{bedCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plants</span>
                      <Badge variant="secondary" className="font-mono">{plantCount}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Shapes</span>
                      <Badge variant="secondary" className="font-mono">{bedCount + plantCount}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Renderer</span>
                      <Badge className="font-mono bg-green-600">tldraw</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Target FPS</span>
                      <Badge variant="secondary" className="font-mono">60</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Auto-saves</span>
                      <Badge variant="secondary" className="font-mono">{saveCount}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Data Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto max-h-40 bg-muted/50 p-3 rounded border">
                      {JSON.stringify(gardenBeds.slice(0, 1), null, 2)}
                      {gardenBeds.length > 1 && '\n... and ' + (gardenBeds.length - 1) + ' more'}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Viewport culling - only visible shapes render</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>60fps smooth interactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Handles 100+ elements without lag</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>WebGL-powered rendering</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-blue-500" />
                      User Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Professional transform handles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Built-in undo/redo</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Multi-selection & grouping</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Smooth pan & zoom</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-purple-500" />
                      Mobile Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Touch gestures (pinch-to-zoom)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Two-finger pan</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Responsive on all devices</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-900 dark:text-green-100">
                      Keyboard Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-muted-foreground">Space + Drag</kbd>
                      <span className="text-muted-foreground">Pan</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-muted-foreground">Ctrl + Scroll</kbd>
                      <span className="text-muted-foreground">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-muted-foreground">Ctrl + Z</kbd>
                      <span className="text-muted-foreground">Undo</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-muted-foreground">Ctrl + D</kbd>
                      <span className="text-muted-foreground">Duplicate</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-0.5 bg-muted rounded text-muted-foreground">Delete</kbd>
                      <span className="text-muted-foreground">Delete</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </aside>
      </div>
    </div>
  )
}
