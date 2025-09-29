'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X } from 'lucide-react'
import { GardenDesignerCanvas, GardenBed } from '@/components/garden-designer-canvas'
import { PLANT_LIBRARY, PlantInfo, getPlantsByCategory } from '@/lib/data/plant-library'
import { GardenTutorial } from '@/components/garden-tutorial'
import { PlantInfoModal } from '@/components/plant-info-modal'
import { GARDEN_TEMPLATES } from '@/lib/data/garden-templates'
import { useHistory } from '@/hooks/use-history'
import { ElementSelector } from '@/components/element-selector'
import { ElementSubtype } from '@/lib/canvas-elements'
import { AIAssistant } from '@/components/ai-assistant'
import { CommandPalette } from '@/components/command-palette'
import { StatusBar } from '@/components/status-bar'
import { PremiumTooltip, RichTooltip } from '@/components/premium-tooltip'
import { MobileMenu } from '@/components/mobile-menu'
import { PlantGroupPanel } from '@/components/plant-group-panel'
import { PlantGroup } from '@/lib/plant-management'
import {
  Layers, Save, Share2, Download, Settings, Info,
  ZoomIn, ZoomOut, Grid, Eye, EyeOff, Ruler,
  MousePointer, Square, Pencil, Leaf, Trash2,
  Sun, Droplets, TreePine, Flower, Sprout, Cherry,
  HelpCircle, CheckCircle, AlertCircle, Play,
  Undo, Redo, FileJson, Upload, BookOpen, Bot,
  Circle, Hexagon, Triangle
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

export default function DemoPage() {
  const [selectedTool, setSelectedTool] = useState('select')
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [selectedElement, setSelectedElement] = useState<ElementSubtype | null>(null)
  const { state: gardenBeds, setState: setGardenBeds, undo, redo, canUndo, canRedo } = useHistory<GardenBed[]>(STARTER_GARDEN)
  const [zoom, setZoom] = useState(100)
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
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [showElements, setShowElements] = useState(false)
  const [plantGroups, setPlantGroups] = useState<PlantGroup[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [showGroupPanel, setShowGroupPanel] = useState(false)

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
    const seen = localStorage.getItem('gardenTutorialSeen')
    if (!seen && gardenBeds.length === 0) {
      setShowTutorial(true)
    }
    setHasSeenTutorial(!!seen)
  }, [])

  // Calculate garden statistics
  const calculateStats = () => {
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
  }

  const calculatePolygonArea = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return 0
    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].x * points[j].y
      area -= points[j].x * points[i].y
    }
    return Math.abs(area / 2)
  }

  const stats = calculateStats()

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
    if (confirm('Clear all garden beds? This cannot be undone.')) {
      setGardenBeds([])
    }
  }

  const loadExample = () => {
    setGardenBeds(STARTER_GARDEN)
    setIsFirstVisit(false)
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem('gardenTutorialSeen', 'true')
    setHasSeenTutorial(true)
  }

  // Save design to localStorage
  const saveDesign = useCallback(() => {
    setSaveStatus('saving')
    const design = {
      name: `Garden Design ${new Date().toLocaleDateString()}`,
      beds: gardenBeds,
      timestamp: Date.now()
    }
    const saved = JSON.parse(localStorage.getItem('gardenDesigns') || '[]')
    saved.push(design)
    localStorage.setItem('gardenDesigns', JSON.stringify(saved))
    setTimeout(() => setSaveStatus('saved'), 1000)
  }, [gardenBeds])

  // Load design from localStorage
  const loadDesign = () => {
    const saved = JSON.parse(localStorage.getItem('gardenDesigns') || '[]')
    if (saved.length > 0) {
      const latest = saved[saved.length - 1]
      setGardenBeds(latest.beds || [])
      alert(`Loaded: ${latest.name}`)
    } else {
      alert('No saved designs found')
    }
  }

  // Handle command palette actions
  const handleCommand = useCallback((actionId: string) => {
    switch (actionId) {
      case 'new-bed':
        setSelectedTool('rect')
        break
      case 'save':
        saveDesign()
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
      case 'zoom-in':
        setZoom(Math.min(200, zoom + 10))
        break
      case 'zoom-out':
        setZoom(Math.max(50, zoom - 10))
        break
      case 'fit-to-screen':
        setZoom(100)
        break
      case 'help':
        setShowTutorial(true)
        break
    }
  }, [canUndo, canRedo, undo, redo, showGrid, zoom, saveDesign])

  // Export design as JSON
  const exportDesign = useCallback(() => {
    const design = {
      name: `Garden Design ${new Date().toLocaleDateString()}`,
      beds: gardenBeds,
      timestamp: Date.now(),
      version: '1.0'
    }
    const dataStr = JSON.stringify(design, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `garden-design-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [gardenBeds])

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
          alert(`Imported: ${design.name || 'Garden Design'}`)
        } else {
          alert('Invalid garden design file')
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
  }, [canUndo, canRedo, undo, redo, selectedTool])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white pb-8">
      {/* Command Palette */}
      <CommandPalette onAction={handleCommand} />
      {/* Header */}
      <section className="py-4 md:py-8 px-4 border-b glass">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                Real Garden Designer
              </h1>
              <p className="text-sm md:text-base text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="hidden sm:inline">Draw custom beds • Plant real vegetables • Check companion compatibility</span>
                <span className="sm:hidden">Design your perfect garden</span>
              </p>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex gap-2 opacity-0 animate-slide-in-right" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              {/* Undo/Redo */}
              <div className="flex gap-1 border-r pr-2">
                <PremiumTooltip content="Undo last action" shortcut="⌘Z">
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </PremiumTooltip>
                <PremiumTooltip content="Redo last action" shortcut="⌘⇧Z">
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </PremiumTooltip>
              </div>

              <PremiumTooltip content="Browse garden templates">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Templates</span>
                </Button>
              </PremiumTooltip>
              <Button variant="outline" onClick={loadDesign}>
                <Download className="h-4 w-4 mr-2" />
                Load
              </Button>
              <Button variant="outline" onClick={clearGarden}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className={cn(
                  "border-purple-500 text-purple-600 hover:bg-purple-50",
                  showAIAssistant && "bg-purple-50"
                )}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTutorial(true)}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <PremiumTooltip content="Save to browser" shortcut="⌘S">
                <Button
                  id="save-button"
                  className="gradient-understory rounded-lg hover-lift"
                  onClick={saveDesign}
                >
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </PremiumTooltip>
              <Button
                variant="outline"
                onClick={exportDesign}
                title="Export as JSON file"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export
              </Button>
              <label>
                <input
                  id="import-input"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importDesign}
                />
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.currentTarget.parentElement?.click()
                  }}
                  title="Import JSON file"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </label>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
              onSave={saveDesign}
              onExport={exportDesign}
              onImport={() => document.querySelector<HTMLInputElement>('#import-input')?.click()}
              onUndo={undo}
              onRedo={redo}
              onClear={clearGarden}
              onTemplates={() => setShowTemplates(true)}
              onHelp={() => setShowTutorial(true)}
              onAI={() => setShowAIAssistant(!showAIAssistant)}
              canUndo={canUndo}
              canRedo={canRedo}
              showAI={showAIAssistant}
              className="absolute top-4 right-4 md:hidden"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2 md:gap-6 mt-4 opacity-0 animate-slide-in-left" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Badge variant="secondary" className="text-xs md:text-sm">{stats.beds} Beds</Badge>
            <Badge variant="secondary" className="text-xs md:text-sm">{stats.plants} Plants</Badge>
            <Badge variant="secondary" className="text-xs md:text-sm">{stats.varieties} Varieties</Badge>
            <Badge variant="secondary" className="text-xs md:text-sm">{stats.area} sq ft</Badge>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowPlantModal(plant.id)
                            }}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
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
          <Card className="overflow-hidden card-nature rounded-lg opacity-0 animate-scale-in md:col-span-1" id="canvas" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <CardHeader className="py-2 md:py-3 gradient-canopy text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg">Garden Canvas</CardTitle>
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
                  <Separator orientation="vertical" className="h-6 bg-white/20" />
                  {/* Zoom Controls */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2 text-white">{zoom}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="text-white hover:bg-white/20"
                  >
                    <ZoomOut className="h-4 w-4" />
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
                      <h3 className="text-2xl font-bold text-gray-800">Welcome to Your Garden Designer!</h3>
                      <p className="text-gray-600 text-lg">
                        Create your perfect garden layout with real plants, companion planting advice, and seasonal planning.
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
                          Load Example Garden
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

                {/* Garden Designer Canvas */}
                <div id="canvas-svg" className="relative h-full">
                  <GardenDesignerCanvas
                    beds={gardenBeds}
                    onBedsChange={setGardenBeds}
                    selectedPlant={selectedPlant}
                    selectedTool={selectedTool}
                    selectedElement={selectedElement}
                    zoom={zoom}
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

      {/* Templates Drawer - Responsive width */}
      {showTemplates && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplates(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 glass shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Garden Templates</h2>
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

      {/* AI Assistant Panel - Responsive positioning */}
      {showAIAssistant && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 md:w-96">
          <AIAssistant
            context={{
              beds: gardenBeds,
              plants: gardenBeds.flatMap(bed => bed.plants),
              stats: stats,
              selectedPlant: selectedPlant
            }}
            onSuggestion={(suggestion) => {
              // Handle AI suggestions
              console.log('AI Suggestion:', suggestion)
            }}
          />
        </div>
      )}

      {/* Status Bar */}
      <StatusBar
        zoom={zoom}
        selectedTool={selectedTool}
        gridEnabled={showGrid}
        layersCount={1}
        saved={saveStatus === 'saved'}
        online={true}
        coordinates={mousePosition}
        itemsCount={{ beds: stats.beds, plants: stats.plants }}
        className="hidden md:flex"
      />
    </div>
  )
}