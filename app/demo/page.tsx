'use client'

import { useState, useEffect } from 'react'
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
import { AIAssistant } from '@/components/ai-assistant'
import {
  Layers, Save, Share2, Download, Settings, Info,
  ZoomIn, ZoomOut, Grid, Eye, EyeOff, Ruler,
  MousePointer, Square, Pencil, Leaf, Trash2,
  Sun, Droplets, TreePine, Flower, Sprout, Cherry,
  HelpCircle, CheckCircle, AlertCircle, Play,
  Undo, Redo, FileJson, Upload, BookOpen, Bot
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
    { id: 'draw', icon: Pencil, name: 'Custom Shape', description: 'Draw any shape' },
    { id: 'plant', icon: Leaf, name: 'Plant', description: 'Place plants', requiresPlant: true },
    { id: 'delete', icon: Trash2, name: 'Delete', description: 'Remove elements' }
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    if (toolId !== 'plant') {
      setSelectedPlant(null)
    }
  }

  const handlePlantSelect = (plant: PlantInfo) => {
    setSelectedPlant(plant)
    setSelectedTool('plant')
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
  const saveDesign = () => {
    const design = {
      name: `Garden Design ${new Date().toLocaleDateString()}`,
      beds: gardenBeds,
      timestamp: Date.now()
    }
    const saved = JSON.parse(localStorage.getItem('gardenDesigns') || '[]')
    saved.push(design)
    localStorage.setItem('gardenDesigns', JSON.stringify(saved))
    alert('Design saved successfully!')
  }

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

  // Export design as JSON
  const exportDesign = () => {
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
  }

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white">
      {/* Header */}
      <section className="py-8 px-4 border-b glass">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                Real Garden Designer
              </h1>
              <p className="text-gray-600 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                Draw custom beds • Plant real vegetables • Check companion compatibility
              </p>
            </div>
            <div className="flex gap-2 opacity-0 animate-slide-in-right" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              {/* Undo/Redo */}
              <div className="flex gap-1 border-r pr-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Templates
              </Button>
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
              <Button
                id="save-button"
                className="gradient-understory rounded-lg hover-lift"
                onClick={saveDesign}
                title="Save to browser (Ctrl+S)"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
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
          </div>

          {/* Quick Stats */}
          <div className="flex gap-6 mt-4 opacity-0 animate-slide-in-left" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.beds} Beds</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.plants} Plants</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.varieties} Varieties</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.area} sq ft</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="container mx-auto max-w-7xl p-4">
        <div className="grid lg:grid-cols-[320px,1fr] gap-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Tools */}
            <Card id="drawing-tools" className="card-nature rounded-lg opacity-0 animate-slide-in-left" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-1">
                  {tools.map(tool => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToolSelect(tool.id)}
                      className={cn(
                        "justify-start rounded-lg hover-nature",
                        selectedTool === tool.id && "gradient-understory hover:bg-green-700"
                      )}
                      disabled={tool.requiresPlant && !selectedPlant}
                    >
                      <tool.icon className="h-4 w-4 mr-2" />
                      {tool.name}
                    </Button>
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

          {/* Canvas Area */}
          <Card className="overflow-hidden card-nature rounded-lg opacity-0 animate-scale-in" id="canvas" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <CardHeader className="py-3 gradient-canopy text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Garden Canvas</CardTitle>
                <div className="flex gap-2" id="view-controls">
                  {/* View Controls */}
                  <Button
                    size="sm"
                    variant={showGrid ? 'secondary' : 'ghost'}
                    onClick={() => setShowGrid(!showGrid)}
                    className="text-white hover:text-white"
                    title="Toggle Grid"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showLabels ? 'secondary' : 'ghost'}
                    onClick={() => setShowLabels(!showLabels)}
                    className="text-white hover:text-white"
                    title="Toggle Labels"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showSpacing ? 'secondary' : 'ghost'}
                    onClick={() => setShowSpacing(!showSpacing)}
                    className="text-white hover:text-white"
                    title="Show Spacing"
                  >
                    <Ruler className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showSunRequirements ? 'secondary' : 'ghost'}
                    onClick={() => setShowSunRequirements(!showSunRequirements)}
                    className="text-white hover:text-white"
                    title="Show Sun Requirements"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={showWaterRequirements ? 'secondary' : 'ghost'}
                    onClick={() => setShowWaterRequirements(!showWaterRequirements)}
                    className="text-white hover:text-white"
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
                    className="text-white hover:text-white"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">{zoom}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="text-white hover:text-white"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <div className="relative h-[600px]">
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
                <GardenDesignerCanvas
                  beds={gardenBeds}
                  onBedsChange={setGardenBeds}
                  selectedPlant={selectedPlant}
                  selectedTool={selectedTool}
                  zoom={zoom}
                  showGrid={showGrid}
                  showLabels={showLabels}
                  showSpacing={showSpacing}
                  showSunRequirements={showSunRequirements}
                  showWaterRequirements={showWaterRequirements}
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help Section */}
      <section className="container mx-auto max-w-7xl p-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Tips:</strong> 🎨 Draw beds with Rectangle or Custom tools •
            🌿 Select plants from the library • 📍 Click in beds to place •
            🔍 Hover for plant details • 💧☀️ Toggle layers to see requirements
          </AlertDescription>
        </Alert>
      </section>

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

      {/* Templates Drawer */}
      {showTemplates && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTemplates(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-96 glass shadow-xl overflow-y-auto">
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

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="fixed bottom-4 right-4 z-40 w-96">
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
    </div>
  )
}