'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GardenDesignerCanvas, GardenBed } from '@/components/garden-designer-canvas'
import { PLANT_LIBRARY, PlantInfo, getPlantsByCategory } from '@/lib/data/plant-library'
import { GardenTutorial } from '@/components/garden-tutorial'
import { PlantInfoModal } from '@/components/plant-info-modal'
import { GARDEN_TEMPLATES } from '@/lib/data/garden-templates'
import { useHistory } from '@/hooks/use-history'
import { ElementSelector } from '@/components/element-selector'
import { ElementSubtype } from '@/lib/canvas-elements'
import { CommandPalette } from '@/components/command-palette'
import { StatusBar } from '@/components/status-bar'
import { PremiumTooltip, RichTooltip } from '@/components/premium-tooltip'
import { MobileMenu } from '@/components/mobile-menu'
import { PlantGroupPanel } from '@/components/plant-group-panel'
import { PlantGroup } from '@/lib/plant-management'
import { useFeedback } from '@/components/ui/action-feedback'
import { useAuth } from '@/lib/auth/auth-context'
import { useGardenPersistence } from '@/hooks/use-garden-persistence'
import {
  Layers, Save, Share2, Download, Settings, Info,
  Grid, Eye, EyeOff, Ruler,
  MousePointer, Square, Pencil, Leaf, Trash2,
  Sun, Droplets, TreePine, Flower, Sprout, Cherry,
  HelpCircle, CheckCircle, AlertCircle, Play,
  Undo, Redo, FileJson, Upload, BookOpen,
  Circle, Hexagon, Triangle, UserPlus, LogIn, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Example starter garden layout
const STARTER_GARDEN: GardenBed[] = [
  {
    id: 'raised-bed-1',
    name: 'Herb Garden',
    points: [
      { x: 100, y: 100 },
      { x: 250, y: 100 },
      { x: 250, y: 150 },
      { x: 100, y: 150 }
    ],
    fill: '#e0f2e0',
    stroke: '#22c55e',
    plants: [
      { id: 'p1', plantId: 'basil', x: 130, y: 125 },
      { id: 'p2', plantId: 'thyme', x: 180, y: 125 },
      { id: 'p3', plantId: 'rosemary', x: 220, y: 125 }
    ]
  },
  {
    id: 'raised-bed-2',
    name: 'Salad Bed',
    points: [
      { x: 300, y: 100 },
      { x: 450, y: 100 },
      { x: 450, y: 150 },
      { x: 300, y: 150 }
    ],
    fill: '#e0f2e0',
    stroke: '#22c55e',
    plants: [
      { id: 'p4', plantId: 'lettuce', x: 320, y: 115 },
      { id: 'p5', plantId: 'lettuce', x: 350, y: 115 },
      { id: 'p6', plantId: 'lettuce', x: 380, y: 115 },
      { id: 'p7', plantId: 'lettuce', x: 320, y: 135 },
      { id: 'p8', plantId: 'lettuce', x: 350, y: 135 },
      { id: 'p9', plantId: 'lettuce', x: 380, y: 135 }
    ]
  },
  {
    id: 'three-sisters',
    name: 'Three Sisters',
    points: [
      { x: 200, y: 250 },
      { x: 250, y: 220 },
      { x: 300, y: 220 },
      { x: 350, y: 250 },
      { x: 350, y: 320 },
      { x: 300, y: 350 },
      { x: 250, y: 350 },
      { x: 200, y: 320 }
    ],
    fill: '#fff4e0',
    stroke: '#f59e0b',
    plants: [
      { id: 'p10', plantId: 'corn', x: 275, y: 285 },
      { id: 'p11', plantId: 'beans', x: 250, y: 270 },
      { id: 'p12', plantId: 'beans', x: 300, y: 270 },
      { id: 'p13', plantId: 'squash', x: 275, y: 320 }
    ]
  }
]

function DemoPageContent() {
  const searchParams = useSearchParams()
  const [selectedTool, setSelectedTool] = useState('select')
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [selectedElement, setSelectedElement] = useState<ElementSubtype | null>(null)
  const { state: gardenBeds, setState: setGardenBeds, undo, redo, canUndo, canRedo } = useHistory<GardenBed[]>(STARTER_GARDEN)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showSpacing, setShowSpacing] = useState(false)
  const [showSunRequirements, setShowSunRequirements] = useState(false)
  const [showWaterRequirements, setShowWaterRequirements] = useState(false)
  const [activeTab, setActiveTab] = useState('plants')
  const [plantCategory, setPlantCategory] = useState<PlantInfo['category']>('vegetable')
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)
  const [plantSearch, setPlantSearch] = useState('')
  const [showOnlyCompanions, setShowOnlyCompanions] = useState(false)
  const [showPlantModal, setShowPlantModal] = useState<string | null>(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showElements, setShowElements] = useState(false)
  const [plantGroups, setPlantGroups] = useState<PlantGroup[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [showGroupPanel, setShowGroupPanel] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const feedback = useFeedback()
  const { user, loading: authLoading } = useAuth()

  // Garden persistence with auto-save - DISABLED TEMPORARILY
  // Comment out to isolate infinite loop issue
  const saveState = { status: 'idle' as const, hasUnsavedChanges: false }
  const save = async () => ({ success: false, error: 'Persistence disabled' })
  const load = async () => ({ success: false, error: 'Persistence disabled' })
  const listGardens = async () => []
  const deleteGarden = async () => ({ success: false })
  const canSave = false
  const hasUnsavedChanges = false
  const lastSaved = null as Date | null
  const planId = undefined as string | undefined

  // Track mouse position for status bar - only within canvas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('#canvas-svg')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      // Only update if mouse is within canvas bounds
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const canvasElement = document.querySelector('#canvas-svg') as HTMLElement | null
    canvasElement?.addEventListener('mousemove', handleMouseMove as EventListener)
    return () => canvasElement?.removeEventListener('mousemove', handleMouseMove as EventListener)
  }, [])

  // Check if user has seen tutorial before
  useEffect(() => {
    const seenTutorial = localStorage.getItem('gardenTutorialSeen')
    setHasSeenTutorial(!!seenTutorial)
  }, [])

  // Load plan from URL parameter (from wizard completion)
  useEffect(() => {
    // Temporarily disabled to isolate infinite loop
    /*
    const planIdFromUrl = searchParams?.get('planId')
    if (planIdFromUrl && load && !loadingPlan) {
      setLoadingPlan(true)
      load(planIdFromUrl)
        .then((result) => {
          if (result.success && result.garden && result.garden.beds) {
            setGardenBeds(result.garden.beds as any)
            feedback.success('Garden plan loaded successfully!')
          } else {
            feedback.error('Failed to load garden plan')
          }
        })
        .catch((error) => {
          console.error('Error loading plan:', error)
          feedback.error('Failed to load garden plan')
        })
        .finally(() => {
          setLoadingPlan(false)
        })
    }
    */
  }, [searchParams]) // Removed feedback from dependencies

  // Calculate garden statistics - memoized to prevent recalculation
  const calculatePolygonArea = useCallback((points: { x: number; y: number }[]) => {
    if (points.length < 3) return 0
    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].x * points[j].y
      area -= points[j].x * points[i].y
    }
    return Math.abs(area / 2)
  }, [])

  const stats = useMemo(() => {
    const totalPlants = gardenBeds.reduce((sum, bed) => sum + bed.plants.length, 0)
    const uniquePlants = new Set(gardenBeds.flatMap(bed => bed.plants.map(p => p.plantId))).size
    const totalArea = gardenBeds.reduce((sum, bed) => {
      const area = calculatePolygonArea(bed.points)
      return sum + area
    }, 0)

    return {
      beds: gardenBeds.length,
      plants: totalPlants,
      varieties: uniquePlants,
      area: Math.round(totalArea / 144) // Convert to sq ft
    }
  }, [gardenBeds, calculatePolygonArea])

  // Tool configuration
  const tools = [
    { id: 'select', icon: MousePointer, name: 'Select', description: 'Select and move' },
    { id: 'rect', icon: Square, name: 'Rectangle', description: 'Draw rectangular bed' },
    { id: 'rect-precise', icon: Ruler, name: 'Precise Rect', description: 'Set exact dimensions' },
    { id: 'circle', icon: Circle, name: 'Circle', description: 'Create circular bed' },
    { id: 'triangle', icon: Triangle, name: 'Triangle', description: 'Create triangular bed' },
    { id: 'hexagon', icon: Hexagon, name: 'Hexagon', description: 'Create hexagonal bed' },
    { id: 'l-shape', icon: Square, name: 'L-Shape', description: 'Create L-shaped bed' },
    { id: 'draw', icon: Pencil, name: 'Custom', description: 'Draw any shape' },
    { id: 'plant', icon: Leaf, name: 'Plant', description: 'Place plants', requiresPlant: true },
    { id: 'element', icon: TreePine, name: 'Element', description: 'Place structures', requiresElement: true },
    { id: 'delete', icon: Trash2, name: 'Delete', description: 'Remove elements' }
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    if (toolId !== 'plant') {
      setSelectedPlant(null)
    }
    if (toolId !== 'element') {
      setSelectedElement(null)
    }
  }

  const handlePlantSelect = (plant: PlantInfo) => {
    setSelectedPlant(plant)
    setSelectedTool('plant')
    setSelectedElement(null)
  }

  const handleElementSelect = (element: ElementSubtype) => {
    setSelectedElement(element)
    setSelectedTool('element')
    setSelectedPlant(null)
  }

  const clearGarden = () => {
    if (confirm('Clear all beds? This cannot be undone.')) {
      setGardenBeds([])
      feedback.success('Design cleared successfully')
    }
  }

  const loadExample = () => {
    setGardenBeds(STARTER_GARDEN)
    setIsFirstVisit(false)
    feedback.success('Example design loaded')
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem('gardenTutorialSeen', 'true')
    setHasSeenTutorial(true)
  }

  // Save design to database or show login prompt
  const saveDesign = useCallback(async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      const result = await save()

      if (result.success) {
        feedback.success('Design saved successfully!')
      }
    } catch (error) {
      console.error('Save error:', error)
      feedback.error('Failed to save design')
    }
  }, [user, save, feedback])

  // Export design as JSON
  const exportDesign = useCallback(() => {
    const design = {
      name: `Permaculture Plan ${new Date().toLocaleDateString()}`,
      beds: gardenBeds,
      timestamp: Date.now(),
      version: '1.0'
    }
    const dataStr = JSON.stringify(design, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `permaculture-plan-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [gardenBeds])

  // Load design from database
  const loadDesign = useCallback(async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    // Persistence is temporarily disabled
    feedback.info('Design loading is temporarily disabled')
  }, [user, listGardens, load, feedback, setGardenBeds])

  // Handle command palette actions
  const handleCommand = useCallback((actionId: string) => {
    switch (actionId) {
      case 'new-bed':
        setSelectedTool('rect')
        break
      case 'save':
        if (user) {
          saveDesign()
        } else {
          setShowLoginPrompt(true)
        }
        break
      case 'export':
        exportDesign()
        break
      case 'import':
        document.querySelector<HTMLInputElement>('#import-input')?.click()
        break
      case 'undo':
        if (canUndo) undo()
        break
      case 'redo':
        if (canRedo) redo()
        break
      case 'toggle-grid':
        setShowGrid(!showGrid)
        break
      case 'help':
        setShowTutorial(true)
        break
    }
  }, [canUndo, canRedo, undo, redo, showGrid, saveDesign, user, exportDesign])

  // Import design from JSON file
  const importDesign = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const design = JSON.parse(e.target?.result as string)
        if (design.beds && Array.isArray(design.beds)) {
          setGardenBeds(design.beds)
          alert(`Imported: ${design.name || 'Permaculture Plan'}`)
        } else {
          alert('Invalid permaculture plan file')
        }
      } catch (error) {
        alert('Error importing design file')
      }
    }
    reader.readAsText(file)
    // Reset input
    event.target.value = ''
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
      }
      // Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveDesign()
      }
      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        switch(e.key) {
          case 'v':
          case 'V':
            setSelectedTool('select')
            break
          case 'r':
          case 'R':
            setSelectedTool('rect')
            break
          case 'd':
          case 'D':
            setSelectedTool('draw')
            break
          case 'p':
          case 'P':
            setSelectedTool('plant')
            break
          case 'Delete':
          case 'Backspace':
            if (selectedTool !== 'delete') {
              setSelectedTool('delete')
            }
            break
          case 'Escape':
            setSelectedTool('select')
            setSelectedPlant(null)
            break
          case '?':
            setShowTutorial(true)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo, undo, redo, selectedTool, saveDesign, setSelectedTool, setSelectedPlant, setShowTutorial])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white pb-8">
      {/* Command Palette */}
      <CommandPalette onAction={handleCommand} />
      {/* Header */}
      <section className="py-6 px-4 border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Permaculture Planning Studio
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="text-xs">{stats.beds} Elements</Badge>
                <Badge variant="secondary" className="text-xs">{stats.plants} Plants</Badge>
                <Badge variant="secondary" className="text-xs">{stats.varieties} Species</Badge>
              </div>
            </div>

            {/* Desktop Primary Action */}
            <div className="hidden md:flex items-center">
              <PremiumTooltip content={user ? 'Save to cloud' : 'Sign in to save'} shortcut="⌘S">
                <Button
                  id="save-button"
                  className={user ? "gradient-understory rounded-lg hover-lift" : ""}
                  variant={user ? "default" : "outline"}
                  onClick={saveDesign}
                  size="lg"
                >
                  {false ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {user ? <Save className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
                      {user ? 'Save Plan' : 'Sign In'}
                    </>
                  )}
                </Button>
              </PremiumTooltip>
            </div>

            {/* Hidden file input for import */}
            <input
              id="import-input"
              type="file"
              accept=".json"
              className="hidden"
              onChange={importDesign}
            />

            {/* Mobile Menu */}
            <MobileMenu
              onSave={user ? saveDesign : () => setShowLoginPrompt(true)}
              onExport={exportDesign}
              onImport={() => document.querySelector<HTMLInputElement>('#import-input')?.click()}
              onUndo={undo}
              onRedo={redo}
              onClear={clearGarden}
              onTemplates={() => setShowTemplates(true)}
              onHelp={() => setShowTutorial(true)}
              canUndo={canUndo}
              canRedo={canRedo}
              className="md:hidden"
            />
          </div>
        </div>
      </section>

      {/* Secondary Toolbar */}
      <section className="container mx-auto max-w-7xl px-4 pt-4 hidden md:block">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <PremiumTooltip content="Undo" shortcut="⌘Z">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </PremiumTooltip>
            <PremiumTooltip content="Redo" shortcut="⌘⇧Z">
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </PremiumTooltip>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadDesign}
              disabled={!user}
            >
              <Download className="h-4 w-4 mr-2" />
              {user ? 'Load' : 'Sign in to Load'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportDesign}
            >
              <FileJson className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.querySelector<HTMLInputElement>('#import-input')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearGarden}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="container mx-auto max-w-7xl p-2 md:p-4">
        <div className="grid md:grid-cols-[320px,1fr] gap-2 md:gap-4">
          {/* Left Sidebar - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block space-y-4">
            {/* Tools */}
            <Card id="drawing-tools" className="card-nature rounded-lg opacity-0 animate-slide-in-left" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-1">
                  {tools.map(tool => (
                    <RichTooltip
                      key={tool.id}
                      title={tool.name}
                      description={tool.description}
                      shortcut={tool.id === 'select' ? 'V' : tool.id === 'rect' ? 'R' : tool.id === 'draw' ? 'D' : undefined}
                    >
                      <Button
                        variant={selectedTool === tool.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToolSelect(tool.id)}
                        className={cn(
                          "justify-start rounded-lg hover-nature transition-all duration-200 hover:scale-105 active:scale-95",
                          selectedTool === tool.id && "gradient-understory hover:bg-green-700 shadow-lg"
                        )}
                        disabled={(tool.requiresPlant && !selectedPlant) || (tool.requiresElement && !selectedElement)}
                      >
                        <tool.icon className="h-4 w-4 mr-2" />
                        <span className="hidden lg:inline">{tool.name}</span>
                        <span className="lg:hidden">{tool.name.slice(0, 4)}</span>
                      </Button>
                    </RichTooltip>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plant Library */}
            <Card id="plant-library" className="card-nature rounded-lg opacity-0 animate-slide-in-left" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Plant Library</CardTitle>
                <CardDescription>Click a plant to select it for planting</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <Tabs value={plantCategory} onValueChange={(v) => setPlantCategory(v as PlantInfo['category'])}>
                  <TabsList className="grid grid-cols-3 h-auto">
                    <TabsTrigger value="vegetable" className="text-xs">
                      <Sprout className="h-3 w-3 mr-1" />
                      Veggies
                    </TabsTrigger>
                    <TabsTrigger value="herb" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      Herbs
                    </TabsTrigger>
                    <TabsTrigger value="fruit" className="text-xs">
                      <Cherry className="h-3 w-3 mr-1" />
                      Fruits
                    </TabsTrigger>
                  </TabsList>

                  {/* Search bar */}
                  <div className="mt-2 mb-2">
                    <input
                      type="text"
                      placeholder="🔍 Search plants..."
                      value={plantSearch}
                      onChange={(e) => setPlantSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Companion filter */}
                  {selectedPlant && (
                    <label className="flex items-center gap-2 mb-2 text-xs">
                      <input
                        type="checkbox"
                        checked={showOnlyCompanions}
                        onChange={(e) => setShowOnlyCompanions(e.target.checked)}
                        className="rounded"
                      />
                      <span>Show only companions for {selectedPlant.name}</span>
                    </label>
                  )}

                  <ScrollArea className="h-[250px]">
                    <div className="space-y-1">
                      {getPlantsByCategory(plantCategory)
                        .filter(plant => {
                          // Search filter
                          if (plantSearch && !plant.name.toLowerCase().includes(plantSearch.toLowerCase())) {
                            return false
                          }
                          // Companion filter
                          if (showOnlyCompanions && selectedPlant) {
                            return selectedPlant.companions.includes(plant.id) ||
                                   plant.companions.includes(selectedPlant.id)
                          }
                          return true
                        })
                        .map(plant => {
                        return <Button
                          key={plant.id}
                          variant={selectedPlant?.id === plant.id ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handlePlantSelect(plant)}
                          className={cn(
                            "w-full justify-start text-left rounded-lg hover-nature",
                            selectedPlant?.id === plant.id && "gradient-understory hover:bg-green-700",
                            showOnlyCompanions && selectedPlant?.companions.includes(plant.id) && "ring-2 ring-green-400"
                          )}
                        >
                          <span className="text-lg mr-2">{plant.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {plant.name}
                              {selectedPlant && selectedPlant.companions.includes(plant.id) && (
                                <span className="ml-1 text-green-300">✓</span>
                              )}
                              {selectedPlant && selectedPlant.antagonists.includes(plant.id) && (
                                <span className="ml-1 text-red-300">✗</span>
                              )}
                            </div>
                            <div className="text-xs opacity-70">
                              {plant.requirements.sun} sun • {plant.size.spacing}" spacing
                            </div>
                          </div>
                          <div
                            role="button"
                            tabIndex={0}
                            className="p-0 h-6 w-6 inline-flex items-center justify-center hover:bg-gray-100 rounded transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPlantModal(plant.id)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowPlantModal(plant.id)
                              }
                            }}
                          >
                            <Info className="h-3 w-3" />
                          </div>
                        </Button>
                      })}
                    </div>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>

            {/* Permaculture Elements */}
            <Card className="card-nature rounded-lg opacity-0 animate-slide-in-left" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Permaculture Elements</CardTitle>
                <CardDescription>Water, structures, paths, and more</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <ElementSelector
                  selectedElement={selectedElement}
                  onElementSelect={handleElementSelect}
                />
              </CardContent>
            </Card>

            {/* Selected Plant Info */}
            {selectedPlant && (
              <Card className="card-nature rounded-lg opacity-0 animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-2xl">{selectedPlant.icon}</span>
                    {selectedPlant.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <strong>Size:</strong> {selectedPlant.size.mature_width}" × {selectedPlant.size.mature_height}"
                  </div>
                  <div>
                    <strong>Spacing:</strong> {selectedPlant.size.spacing}" between plants
                  </div>
                  <div>
                    <strong>Sun:</strong> {selectedPlant.requirements.sun}
                  </div>
                  <div>
                    <strong>Water:</strong> {selectedPlant.requirements.water}
                  </div>
                  <Separator className="my-2" />
                  <div>
                    <strong className="text-green-600">Good with:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPlant.companions.map(id => (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {PLANT_LIBRARY.find(p => p.id === id)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedPlant.antagonists.length > 0 && (
                    <div>
                      <strong className="text-red-600">Keep away from:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPlant.antagonists.map(id => (
                          <Badge key={id} variant="destructive" className="text-xs">
                            {PLANT_LIBRARY.find(p => p.id === id)?.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Canvas Area - Full width on mobile */}
          <Card className="overflow-visible card-nature rounded-lg opacity-0 animate-scale-in md:col-span-1" id="canvas" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <CardHeader className="py-2 md:py-3 gradient-canopy text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg">Planning Canvas</CardTitle>
                <div className="flex gap-1 md:gap-2" id="view-controls">
                  {/* View Controls */}
                  <Button
                    size="sm"
                    variant={showGrid ? 'secondary' : 'ghost'}
                    onClick={() => setShowGrid(!showGrid)}
                    className={showGrid ? "bg-green-600 text-white hover:bg-green-700" : "text-white hover:bg-white/20"}
                    title="Toggle Grid"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showLabels ? 'secondary' : 'ghost'}
                    onClick={() => setShowLabels(!showLabels)}
                    className={showLabels ? "bg-green-600 text-white hover:bg-green-700" : "text-white hover:bg-white/20"}
                    title="Toggle Labels"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showSpacing ? 'secondary' : 'ghost'}
                    onClick={() => setShowSpacing(!showSpacing)}
                    className={showSpacing ? "bg-green-600 text-white hover:bg-green-700" : "text-white hover:bg-white/20"}
                    title="Show Spacing"
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showSunRequirements ? 'secondary' : 'ghost'}
                    onClick={() => setShowSunRequirements(!showSunRequirements)}
                    className={showSunRequirements ? "bg-green-600 text-white hover:bg-green-700" : "text-white hover:bg-white/20"}
                    title="Show Sun Requirements"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showWaterRequirements ? 'secondary' : 'ghost'}
                    onClick={() => setShowWaterRequirements(!showWaterRequirements)}
                    className={showWaterRequirements ? "bg-green-600 text-white hover:bg-green-700" : "text-white hover:bg-white/20"}
                    title="Show Water Requirements"
                  >
                    <Droplets className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="relative h-[400px] md:h-[600px]">
                {/* Welcome message for first-time users */}
                {gardenBeds.length === 0 && isFirstVisit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                    <div className="text-center space-y-6 max-w-lg p-8 glass rounded-lg shadow-xl">
                      <div className="text-6xl">🌱</div>
                      <h3 className="text-2xl font-bold text-gray-800">Plan Regenerative Systems</h3>
                      <p className="text-gray-600 text-lg">
                        Create complete permaculture plans with plant guilds, water harvesting, zones, sectors, and polycultures.
                      </p>
                      <div className="grid gap-3">
                        <Button
                          size="lg"
                          onClick={() => { setShowTutorial(true); setIsFirstVisit(false) }}
                          className="gradient-understory rounded-lg hover-lift text-lg py-6"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Start Interactive Tutorial
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={loadExample}
                          className="text-lg py-6 rounded-lg hover-nature"
                        >
                          <Layers className="h-5 w-5 mr-2" />
                          Load Example Plan
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => { setSelectedTool('rect'); setIsFirstVisit(false) }}
                          className="hover-nature"
                        >
                          Start from Scratch →
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Design Canvas */}
                <div id="canvas-svg" className="relative h-full">
                  <GardenDesignerCanvas
                    beds={gardenBeds}
                    onBedsChange={setGardenBeds}
                    selectedPlant={selectedPlant}
                    selectedTool={selectedTool}
                    selectedElement={selectedElement}
                    showGrid={showGrid}
                    showLabels={showLabels}
                    showSpacing={showSpacing}
                    showSunRequirements={showSunRequirements}
                    showWaterRequirements={showWaterRequirements}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help Section - Hidden on mobile */}
      <section className="hidden md:block container mx-auto max-w-7xl p-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Tips:</strong> 🎨 Draw beds with Rectangle or Custom tools •
            🌿 Select plants from the library • 📍 Click in beds to place •
            🔍 Hover for plant details • 💧☀️ Toggle layers to see requirements
          </AlertDescription>
        </Alert>
      </section>

      {/* Mobile Tools Panel */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t p-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tools.map(tool => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleToolSelect(tool.id)}
              className={cn(
                "shrink-0 rounded-lg",
                selectedTool === tool.id && "gradient-understory"
              )}
              disabled={(tool.requiresPlant && !selectedPlant) || (tool.requiresElement && !selectedElement)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Tutorial Overlay */}
      <GardenTutorial
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
      />

      {/* Plant Info Modal */}
      <PlantInfoModal
        plantId={showPlantModal}
        isOpen={!!showPlantModal}
        onClose={() => setShowPlantModal(null)}
      />

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoginPrompt(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sign In Required</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Sign in to save your designs to the cloud, access them from any device, and enable auto-save.
                </p>

                <div className="space-y-2">
                  <Button
                    className="w-full gradient-understory"
                    onClick={() => {
                      setShowLoginPrompt(false)
                      // router.push is available from next/navigation
                      window.location.href = '/auth/login?redirect_to=/demo'
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowLoginPrompt(false)
                      window.location.href = '/auth/signup?redirect_to=/demo'
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </div>

                <div className="text-sm text-gray-500 text-center">
                  Continue without signing in to use local storage only
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Drawer - Responsive width */}
      {showTemplates && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplates(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 glass shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Design Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplates(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {GARDEN_TEMPLATES.map(template => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow card-nature rounded-lg hover-lift"
                    onClick={() => {
                      setGardenBeds(template.beds)
                      setShowTemplates(false)
                      setIsFirstVisit(false)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {template.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.size}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Status Bar */}
      <StatusBar
        selectedTool={selectedTool}
        gridEnabled={showGrid}
        layersCount={1}
        saved={false}
        online={true}
        coordinates={mousePosition}
        itemsCount={{ beds: stats.beds, plants: stats.plants }}
        className="hidden md:flex"
      />
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading planning studio...</p>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  )
}
