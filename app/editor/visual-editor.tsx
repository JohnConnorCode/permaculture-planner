'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSceneStore } from '@/modules/scene/sceneStore'
import { SvgRenderer } from '@/modules/renderer/SvgRenderer'
import { InputManager } from '@/modules/input/InputManager'
import { SelectTool } from '@/modules/tools/SelectTool'
import { DrawBedTool } from '@/modules/tools/DrawBedTool'
import { DrawPathTool } from '@/modules/tools/DrawPathTool'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MousePointer,
  Square,
  Move,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Eye,
  EyeOff,
  Layers,
  Settings,
  Download,
  ArrowLeft
} from 'lucide-react'

interface VisualEditorProps {
  plan: any
}

export default function VisualEditor({ plan }: VisualEditorProps) {
  const router = useRouter()
  const svgRef = useRef<HTMLDivElement>(null)
  const inputManagerRef = useRef<InputManager | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedTool, setSelectedTool] = useState('select')

  const supabase = createClient()
  const {
    scene,
    viewport,
    selection,
    activeTool,
    setActiveTool,
    addNode,
    updateNode,
    removeNode,
    setSelection,
    setZoom,
    setPan,
    setGridEnabled,
    undo,
    redo,
    loadScene,
    getAllNodes
  } = useSceneStore()

  // Initialize scene from plan data
  useEffect(() => {
    if (plan.scene_json) {
      loadScene(plan.scene_json)
    } else if (plan.beds && plan.beds.length > 0) {
      // Convert beds to scene nodes
      const nodes = plan.beds.map((bed: any) => ({
        id: bed.id,
        type: 'Bed',
        transform: {
          xIn: bed.position_json?.x || 24,
          yIn: bed.position_json?.y || 24,
          rotationDeg: bed.orientation === 'NS' ? 0 : 90
        },
        size: {
          widthIn: bed.width_ft * 12,
          heightIn: bed.length_ft * 12
        },
        bed: {
          heightIn: bed.height_in,
          orientation: bed.orientation,
          wicking: bed.wicking,
          trellisNorth: bed.trellis,
          familyTag: bed.name
        }
      }))

      loadScene({
        ...scene,
        layers: [{
          ...scene.layers[0],
          nodes
        }]
      })
    }
  }, [plan])

  // Set up input manager and tools
  useEffect(() => {
    if (!svgRef.current) return

    const toolContext = {
      scene,
      viewport,
      selection,
      constraints: {
        bedWidthMaxIn: 48,
        pathWidthMinIn: 18,
        pathWidthWheelbarrowIn: 36,
        snapToleranceIn: 0.25,
        preventOverlap: true,
        accessibility: false
      },
      grid: viewport.grid,
      addNode,
      updateNode,
      removeNode,
      setSelection,
      worldToScreen: (point: { xIn: number; yIn: number }) => ({
        x: (point.xIn + viewport.pan.x) * viewport.zoom,
        y: (point.yIn + viewport.pan.y) * viewport.zoom
      }),
      screenToWorld: (point: { x: number; y: number }) => ({
        xIn: point.x / viewport.zoom - viewport.pan.x,
        yIn: point.y / viewport.zoom - viewport.pan.y
      })
    }

    const inputManager = new InputManager({
      element: svgRef.current,
      worldToScreen: toolContext.worldToScreen,
      screenToWorld: toolContext.screenToWorld
    })

    // Set up tool switching
    const tools = {
      select: new SelectTool(toolContext),
      'draw-bed': new DrawBedTool(toolContext),
      'draw-path': new DrawPathTool(toolContext)
    }

    inputManager.setActiveTool(tools[selectedTool as keyof typeof tools])

    // Set up callbacks
    inputManager.onToolChange = (toolId) => {
      setSelectedTool(toolId)
      setActiveTool(toolId as any)
    }

    inputManager.onZoom = (delta, center) => {
      const newZoom = Math.max(0.1, Math.min(4, viewport.zoom * delta))
      setZoom(newZoom)
    }

    inputManager.onUndo = undo
    inputManager.onRedo = redo
    inputManager.onSave = handleSave

    inputManagerRef.current = inputManager

    return () => {
      inputManager.destroy()
    }
  }, [selectedTool, scene, viewport, selection])

  const handleSave = async () => {
    setSaving(true)

    try {
      // Save scene to database
      const { error: planError } = await (supabase as any)
        .from('plans')
        .update({
          scene_json: scene,
          updated_at: new Date().toISOString()
        })
        .eq('id', plan.id)

      // Save beds
      const beds = getAllNodes()
        .filter(node => node.type === 'Bed')
        .map((node: any) => ({
          id: node.id,
          plan_id: plan.id,
          name: node.bed?.familyTag || `Bed ${node.id}`,
          length_ft: node.size.heightIn / 12,
          width_ft: node.size.widthIn / 12,
          height_in: node.bed?.heightIn || 12,
          orientation: node.bed?.orientation || 'NS',
          wicking: node.bed?.wicking || false,
          trellis: node.bed?.trellisNorth || false,
          position_json: {
            x: node.transform.xIn,
            y: node.transform.yIn
          }
        }))

      if (beds.length > 0) {
        // Delete old beds and insert new ones
        await (supabase as any).from('beds').delete().eq('plan_id', plan.id)
        await (supabase as any).from('beds').insert(beds)
      }

      if (!planError) {
        // Show success message
        console.log('Saved successfully')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    // Export as SVG
    const svgElement = svgRef.current?.querySelector('svg')
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${plan.name.replace(/\s+/g, '-')}.svg`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold">{plan.name}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={undo}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={redo}>
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={() => setZoom(viewport.zoom * 1.2)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setZoom(viewport.zoom * 0.8)}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGridEnabled(!viewport.grid.enabled)}
            >
              <Grid className={`h-4 w-4 ${viewport.grid.enabled ? 'text-blue-600' : ''}`} />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              size="sm"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-2">
          <Button
            variant={selectedTool === 'select' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedTool('select')}
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === 'draw-bed' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedTool('draw-bed')}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === 'draw-path' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setSelectedTool('draw-path')}
          >
            <Move className="h-4 w-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden" ref={svgRef}>
          <SvgRenderer
            scene={scene}
            viewport={viewport}
            selection={selection}
            showHandles={selectedTool === 'select'}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
              <TabsTrigger value="layers" className="flex-1">Layers</TabsTrigger>
              <TabsTrigger value="constraints" className="flex-1">Constraints</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="p-4">
              {selection.ids.length === 0 ? (
                <p className="text-sm text-gray-500">Select an object to edit its properties</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Selected Objects</label>
                    <p className="text-sm text-gray-600">{selection.ids.length} selected</p>
                  </div>
                  {/* Add property editors here */}
                </div>
              )}
            </TabsContent>

            <TabsContent value="layers" className="p-4">
              <div className="space-y-2">
                {scene.layers.map((layer) => (
                  <Card key={layer.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{layer.name}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            // Toggle visibility
                          }}
                        >
                          {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{layer.nodes.length} objects</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="constraints" className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Max Bed Width</label>
                  <p className="text-sm text-gray-600">48 inches</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Min Path Width</label>
                  <p className="text-sm text-gray-600">18 inches</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Wheelchair Access</label>
                  <p className="text-sm text-gray-600">36 inch paths</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}