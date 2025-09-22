'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSceneStore } from '@/modules/scene/sceneStore'
import { SvgRenderer } from '@/modules/renderer/SvgRenderer'
import { InputManager } from '@/modules/input/InputManager'
import { SelectTool } from '@/modules/tools/SelectTool'
import { DrawBedTool } from '@/modules/tools/DrawBedTool'
import { DrawCurvedBedTool } from '@/modules/tools/DrawCurvedBedTool'
import { DrawPathTool } from '@/modules/tools/DrawPathTool'
import { MeasureTool } from '@/modules/tools/MeasureTool'
import { GARDEN_TEMPLATES, templateToScene } from '@/lib/templates/garden-templates'
import { PlantLibrary } from '@/components/plant-library'
import { PlantData } from '@/lib/data/plant-database'
import { GardenFeaturesLibrary, GardenFeature } from '@/components/garden-features-library'
import { PropertyPanel } from '@/components/property-panel'
import { HelpButton, KeyboardShortcuts, GuidedTour } from '@/components/help-system'
import { getNodeBounds } from '@/modules/scene/sceneTypes'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  MousePointer, Square, Move, Save, Undo, Redo, ZoomIn, ZoomOut,
  Grid, Eye, EyeOff, Layers, Settings, Download, ArrowLeft,
  Copy, Clipboard, Trash2, RotateCw, FlipHorizontal, FlipVertical,
  Sparkles, Package, History, PlayCircle, PauseCircle, SkipForward,
  Camera, Share2, FolderOpen, FilePlus, Layout, Sliders, Target, Spline, Ruler, Type, Palette
} from 'lucide-react'

interface VisualEditorProps {
  plan: any
}

interface EditorVersion {
  id: string
  name: string
  timestamp: Date
  snapshot: any
}

export default function EnhancedVisualEditor({ plan }: VisualEditorProps) {
  const router = useRouter()
  const svgRef = useRef<HTMLDivElement>(null)
  const inputManagerRef = useRef<InputManager | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedTool, setSelectedTool] = useState('select')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [versions, setVersions] = useState<EditorVersion[]>([])
  const [currentVersion, setCurrentVersion] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(6)
  const [showDimensions, setShowDimensions] = useState(true)
  const [showTextures, setShowTextures] = useState(true)

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
    getAllNodes,
    getNode
  } = useSceneStore()

  // Initialize scene from plan data or template
  useEffect(() => {
    if (plan.scene_json) {
      loadScene(plan.scene_json)
      // Save initial version
      saveVersion('Initial')
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
      saveVersion('Imported')
    }
  }, [plan])

  // Version management
  const saveVersion = useCallback((name: string) => {
    const newVersion: EditorVersion = {
      id: `v${versions.length + 1}`,
      name,
      timestamp: new Date(),
      snapshot: JSON.parse(JSON.stringify(scene))
    }
    setVersions(prev => [...prev, newVersion])
  }, [scene, versions])

  const loadVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (version) {
      loadScene(version.snapshot)
    }
  }, [versions, loadScene])

  // Playback functionality for iterations
  useEffect(() => {
    if (isPlaying && versions.length > 1) {
      const interval = setInterval(() => {
        setCurrentVersion(prev => {
          const next = (prev + 1) % versions.length
          loadVersion(versions[next].id)
          return next
        })
      }, 2000 / playbackSpeed)

      return () => clearInterval(interval)
    }
  }, [isPlaying, versions, playbackSpeed, loadVersion])

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
        snapToleranceIn: snapToGrid ? gridSize : 0.25,
        preventOverlap: true,
        accessibility: false
      },
      grid: {
        enabled: showGrid,
        spacingIn: gridSize
      },
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
      'draw-curved-bed': new DrawCurvedBedTool(toolContext),
      'draw-path': new DrawPathTool(toolContext),
      'measure': new MeasureTool(toolContext)
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
  }, [selectedTool, scene, viewport, selection, showGrid, snapToGrid, gridSize])

  // Enhanced save with version tracking
  const handleSave = async () => {
    setSaving(true)

    try {
      // Save current version
      saveVersion(`Save ${new Date().toLocaleTimeString()}`)

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
        await (supabase as any).from('beds').delete().eq('plan_id', plan.id)
        await (supabase as any).from('beds').insert(beds)
      }

      if (!planError) {
        console.log('Saved successfully')
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setSaving(false)
    }
  }

  // Handle plant drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    // Check for plant data first
    const plantDataStr = e.dataTransfer.getData('plant')
    const featureDataStr = e.dataTransfer.getData('gardenFeature')

    if (!plantDataStr && !featureDataStr) return

    try {
      // Get drop position in world coordinates
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect) return

      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top
      const worldPos = {
        xIn: screenX / viewport.zoom - viewport.pan.x,
        yIn: screenY / viewport.zoom - viewport.pan.y
      }

      if (plantDataStr) {
        // Handle plant drop
        const plant: PlantData = JSON.parse(plantDataStr)

        // Create a plant node
        const plantNode: any = {
          id: uuidv4(),
          type: 'Plant',
          transform: {
            xIn: worldPos.xIn,
            yIn: worldPos.yIn,
            rotationDeg: 0
          },
          plant: {
            plantId: plant.id,
            commonName: plant.commonName,
            icon: plant.visual.icon,
            matureSize: plant.visual.matureSize,
            spacingIn: plant.requirements.spacing.betweenPlants,
            plantedDate: new Date().toISOString()
          }
        }

        // Check if dropped on a bed
        const beds = getAllNodes().filter(n => n.type === 'Bed')
        for (const bed of beds) {
          if ('size' in bed) {
            const bounds = getNodeBounds(bed)
            if (worldPos.xIn >= bounds.minX && worldPos.xIn <= bounds.maxX &&
                worldPos.yIn >= bounds.minY && worldPos.yIn <= bounds.maxY) {
              plantNode.parentBedId = bed.id
              break
            }
          }
        }

        // Add the plant to the scene
        addNode(plantNode)
        setSelection([plantNode.id])

      } else if (featureDataStr) {
        // Handle garden feature drop
        const feature: GardenFeature = JSON.parse(featureDataStr)

        let newNode: any = {
          id: uuidv4(),
          transform: {
            xIn: worldPos.xIn,
            yIn: worldPos.yIn,
            rotationDeg: 0
          }
        }

        // Create appropriate node based on feature category
        if (feature.category === 'irrigation') {
          newNode = {
            ...newNode,
            type: 'Irrigation',
            size: feature.defaultSize,
            irrigation: feature.properties
          }
        } else if (feature.category === 'structure') {
          newNode = {
            ...newNode,
            type: 'Structure',
            size: { ...feature.defaultSize, heightFt: feature.properties.heightFt },
            structure: feature.properties
          }
        } else if (feature.category === 'compost') {
          newNode = {
            ...newNode,
            type: 'Compost',
            size: feature.defaultSize,
            compost: feature.properties
          }
        }

        // Add the feature to the scene
        addNode(newNode)
        setSelection([newNode.id])
      }
    } catch (error) {
      console.error('Error dropping plant:', error)
    }
  }

  // Export functionality
  const handleExport = (format: 'svg' | 'png' | 'pdf') => {
    const svgElement = svgRef.current?.querySelector('svg')
    if (!svgElement) return

    if (format === 'svg') {
      const svgString = new XMLSerializer().serializeToString(svgElement)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${plan.name.replace(/\s+/g, '-')}.svg`
      a.click()
      URL.revokeObjectURL(url)
    }
    // Add PNG and PDF export if needed
  }

  // Template application
  const applyTemplate = (templateId: string) => {
    const template = GARDEN_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      const sceneData = templateToScene(template)
      loadScene(sceneData)
      saveVersion(`Applied: ${template.name}`)
      setShowTemplates(false)
    }
  }

  // Property editing for selected objects
  const handlePropertyChange = (property: string, value: any) => {
    selection.ids.forEach(id => {
      const node = getNode(id)
      if (node) {
        const updatedNode: any = { ...node }

        // Handle nested property updates
        if (property.includes('.')) {
          const [parent, child] = property.split('.')
          updatedNode[parent] = { ...updatedNode[parent], [child]: value }
        } else {
          updatedNode[property] = value
        }

        updateNode(id, updatedNode)
      }
    })
    saveVersion(`Modified ${property}`)
  }

  // Transform operations
  const transformSelection = (operation: 'rotate' | 'flipH' | 'flipV' | 'duplicate') => {
    if (selection.ids.length === 0) return

    switch (operation) {
      case 'rotate':
        selection.ids.forEach(id => {
          const node = getNode(id)
          if (node?.transform) {
            updateNode(id, {
              ...node,
              transform: {
                ...node.transform,
                rotationDeg: (node.transform.rotationDeg + 90) % 360
              }
            })
          }
        })
        break
      case 'duplicate':
        // Duplicate selected nodes
        selection.ids.forEach(id => {
          const node = getNode(id)
          if (node) {
            const newNode = {
              ...node,
              id: `${node.id}-copy-${Date.now()}`,
              transform: {
                ...node.transform,
                xIn: node.transform.xIn + 12,
                yIn: node.transform.yIn + 12
              }
            }
            addNode(newNode)
          }
        })
        break
      // Add flip operations
    }
    saveVersion(`Transform: ${operation}`)
  }

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Enhanced Header */}
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
              <span className="text-xs text-gray-500">
                v{versions.length}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Undo/Redo with history count */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={false}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={false}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6" />

              {/* View controls */}
              <Button variant="ghost" size="sm" onClick={() => setZoom(viewport.zoom * 1.2)}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-xs w-12 text-center">{Math.round(viewport.zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(viewport.zoom * 0.8)}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
                <Target className="h-4 w-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Grid controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className={`h-4 w-4 ${showGrid ? 'text-blue-600' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSnapToGrid(!snapToGrid)}
              >
                <Target className={`h-4 w-4 ${snapToGrid ? 'text-blue-600' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDimensions(!showDimensions)}
                title="Toggle Dimensions"
              >
                <Type className={`h-4 w-4 ${showDimensions ? 'text-blue-600' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTextures(!showTextures)}
                title="Toggle Textures"
              >
                <Palette className={`h-4 w-4 ${showTextures ? 'text-blue-600' : ''}`} />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Help */}
              <KeyboardShortcuts />

              <Separator orientation="vertical" className="h-6" />

              {/* Version playback */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={versions.length < 2}
              >
                {isPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              </Button>
              <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-6" />

              {/* Templates */}
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Garden Templates</DialogTitle>
                    <DialogDescription>
                      Choose a starter template optimized for your goals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {GARDEN_TEMPLATES.map(template => (
                      <Card
                        key={template.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                          selectedTemplate === template.id ? 'ring-2 ring-green-600' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <span className="text-sm text-gray-500">{template.sqft} sq ft</span>
                        </div>
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between text-xs text-gray-500">
                          <span>Setup: {template.timeEstimate.setupHours}h</span>
                          <span>Weekly: {template.timeEstimate.weeklyMinutes}min</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" onClick={() => setShowTemplates(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
                      disabled={!selectedTemplate}
                    >
                      Apply Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Export options */}
              <Button variant="outline" size="sm" onClick={() => handleExport('svg')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              {/* Save button */}
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
          {/* Enhanced Left Toolbar */}
          <div className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === 'select' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setSelectedTool('select')}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Select Tool (V)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === 'draw-bed' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setSelectedTool('draw-bed')}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Draw Bed (B)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === 'draw-curved-bed' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setSelectedTool('draw-curved-bed')}
                >
                  <Spline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Draw Curved Bed (C)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === 'draw-path' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setSelectedTool('draw-path')}
                >
                  <Move className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Draw Path (P)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === 'measure' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setSelectedTool('measure')}
                >
                  <Ruler className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Measure Tool (M)</TooltipContent>
            </Tooltip>

            <Separator className="my-2" />

            {/* Transform tools */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => transformSelection('rotate')}
                  disabled={selection.ids.length === 0}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Rotate 90° (R)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => transformSelection('flipH')}
                  disabled={selection.ids.length === 0}
                >
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Flip Horizontal</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => transformSelection('flipV')}
                  disabled={selection.ids.length === 0}
                >
                  <FlipVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Flip Vertical</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => transformSelection('duplicate')}
                  disabled={selection.ids.length === 0}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Duplicate (Ctrl+D)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    selection.ids.forEach(id => removeNode(id))
                    setSelection([])
                  }}
                  disabled={selection.ids.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Delete (Del)</TooltipContent>
            </Tooltip>
          </div>

          {/* Canvas */}
          <div
            className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
            ref={svgRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <SvgRenderer
              scene={scene}
              viewport={viewport}
              selection={selection}
              showHandles={selectedTool === 'select'}
              showDimensions={showDimensions}
              showTextures={showTextures}
              units="imperial"
            />

            {/* Canvas overlay info */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">Grid: {gridSize}"</span>
                <span className="text-gray-500">Zoom: {Math.round(viewport.zoom * 100)}%</span>
                <span className="text-gray-500">Objects: {getAllNodes().length}</span>
                {selection.ids.length > 0 && (
                  <span className="text-blue-600">Selected: {selection.ids.length}</span>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Right Sidebar */}
          <div className="w-80 bg-white border-l">
            <Tabs defaultValue="plants" className="w-full h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-6">
                <TabsTrigger value="plants">Plants</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="properties">Props</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
                <TabsTrigger value="versions">Ver</TabsTrigger>
                <TabsTrigger value="settings">Set</TabsTrigger>
              </TabsList>

              <TabsContent value="plants" className="flex-1 overflow-hidden">
                <PlantLibrary
                  onPlantSelect={(plant) => console.log('Plant selected:', plant)}
                  showDetails={true}
                />
              </TabsContent>

              <TabsContent value="features" className="flex-1 overflow-hidden">
                <GardenFeaturesLibrary
                  onFeatureSelect={(feature) => console.log('Feature selected:', feature)}
                />
              </TabsContent>

              <TabsContent value="properties" className="flex-1 overflow-hidden">
                {selection.ids.length === 0 ? (
                  <div className="p-4">
                    <p className="text-sm text-gray-500">Select an object to edit its properties</p>
                    <GuidedTour />
                  </div>
                ) : selection.ids.length === 1 ? (
                  <PropertyPanel
                    node={getNode(selection.ids[0]) || null}
                    onUpdate={(updates) => updateNode(selection.ids[0], updates)}
                    onDelete={() => {
                      removeNode(selection.ids[0])
                      setSelection([])
                    }}
                  />
                ) : (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Selected: {selection.ids.length} objects</label>
                      <p className="text-xs text-gray-500 mt-1">Select a single object to edit properties</p>
                    </div>

                    {false && (() => {
                      const node: any = getNode(selection.ids[0])
                      if (!node) return null

                      return (
                        <>
                          {/* Position */}
                          <div className="space-y-2">
                            <Label className="text-xs">Position</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="x" className="text-xs text-gray-500">X (inches)</Label>
                                <Input
                                  id="x"
                                  type="number"
                                  value={node.transform?.xIn || 0}
                                  onChange={(e) => handlePropertyChange('transform.xIn', Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label htmlFor="y" className="text-xs text-gray-500">Y (inches)</Label>
                                <Input
                                  id="y"
                                  type="number"
                                  value={node.transform?.yIn || 0}
                                  onChange={(e) => handlePropertyChange('transform.yIn', Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Size */}
                          {node.size && (
                            <div className="space-y-2">
                              <Label className="text-xs">Size</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor="width" className="text-xs text-gray-500">Width (ft)</Label>
                                  <Input
                                    id="width"
                                    type="number"
                                    value={node.size.widthIn / 12}
                                    onChange={(e) => handlePropertyChange('size.widthIn', Number(e.target.value) * 12)}
                                    className="h-8"
                                    step="0.5"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="length" className="text-xs text-gray-500">Length (ft)</Label>
                                  <Input
                                    id="length"
                                    type="number"
                                    value={node.size.heightIn / 12}
                                    onChange={(e) => handlePropertyChange('size.heightIn', Number(e.target.value) * 12)}
                                    className="h-8"
                                    step="0.5"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Bed-specific properties */}
                          {node.type === 'Bed' && node.bed && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="height" className="text-xs">Height (inches)</Label>
                                <Slider
                                  id="height"
                                  min={6}
                                  max={36}
                                  step={6}
                                  value={[node.bed.heightIn]}
                                  onValueChange={([v]) => handlePropertyChange('bed.heightIn', v)}
                                />
                                <span className="text-xs text-gray-500">{node.bed.heightIn}"</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor="wicking" className="text-xs">Wicking Bed</Label>
                                <Switch
                                  id="wicking"
                                  checked={node.bed.wicking}
                                  onCheckedChange={(v) => handlePropertyChange('bed.wicking', v)}
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label htmlFor="trellis" className="text-xs">Trellis</Label>
                                <Switch
                                  id="trellis"
                                  checked={node.bed.trellisNorth}
                                  onCheckedChange={(v) => handlePropertyChange('bed.trellisNorth', v)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="crops" className="text-xs">Crops</Label>
                                <Input
                                  id="crops"
                                  value={node.bed.familyTag || ''}
                                  onChange={(e) => handlePropertyChange('bed.familyTag', e.target.value)}
                                  placeholder="e.g., Tomatoes, Basil"
                                  className="h-8"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )
                    })()}

                    {/* Batch operations */}
                    {selection.ids.length > 1 && (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // Align selected objects
                          }}
                        >
                          <Layout className="h-4 w-4 mr-2" />
                          Align Objects
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // Distribute selected objects
                          }}
                        >
                          <Sliders className="h-4 w-4 mr-2" />
                          Distribute Evenly
                        </Button>
                      </div>
                    )}
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
                              // Toggle layer visibility
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

              <TabsContent value="versions" className="p-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {versions.map((version, idx) => (
                    <Card
                      key={version.id}
                      className={`p-3 cursor-pointer transition-all ${
                        idx === currentVersion ? 'ring-2 ring-green-600' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        loadVersion(version.id)
                        setCurrentVersion(idx)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{version.name}</span>
                          <p className="text-xs text-gray-500">
                            {version.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        <History className="h-4 w-4 text-gray-400" />
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => saveVersion('Manual Save')}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Save Version
                </Button>
              </TabsContent>

              <TabsContent value="settings" className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Grid Settings</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-grid" className="text-xs">Show Grid</Label>
                        <Switch
                          id="show-grid"
                          checked={showGrid}
                          onCheckedChange={setShowGrid}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="snap-grid" className="text-xs">Snap to Grid</Label>
                        <Switch
                          id="snap-grid"
                          checked={snapToGrid}
                          onCheckedChange={setSnapToGrid}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="grid-size" className="text-xs">Grid Size (inches)</Label>
                        <Slider
                          id="grid-size"
                          min={1}
                          max={12}
                          step={1}
                          value={[gridSize]}
                          onValueChange={([v]) => setGridSize(v)}
                        />
                        <span className="text-xs text-gray-500">{gridSize}"</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Constraints</Label>
                    <div className="space-y-2 mt-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Max Bed Width</Label>
                        <p className="text-xs text-gray-600">48 inches (4 feet)</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Min Path Width</Label>
                        <p className="text-xs text-gray-600">18 inches (walking)</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Wheelchair Access</Label>
                        <p className="text-xs text-gray-600">36 inches minimum</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Auto-Save</Label>
                    <div className="flex items-center justify-between mt-2">
                      <Label htmlFor="auto-save" className="text-xs">Enable Auto-Save</Label>
                      <Switch id="auto-save" defaultChecked />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Saves every 2 minutes</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <HelpButton />
    </TooltipProvider>
  )
}