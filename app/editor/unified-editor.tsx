'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GardenDesignerCanvas, GardenBed } from '@/components/garden-designer-canvas'
import { PlantGroupPanel } from '@/components/plant-group-panel'
import { PlantGroup } from '@/lib/plant-management'
import { PLANT_LIBRARY, PlantInfo, getPlantsByCategory } from '@/lib/data/plant-library'
import { ElementSelector } from '@/components/element-selector'
import { ElementSubtype } from '@/lib/canvas-elements'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useHistory } from '@/hooks/use-history'
import {
  Save, Share2, Download, Settings, Info, Layers,
  ZoomIn, ZoomOut, Grid, Eye, EyeOff, Ruler,
  MousePointer, Square, Pencil, Leaf, Trash2,
  Sun, Droplets, TreePine, Flower, Sprout, Cherry,
  HelpCircle, CheckCircle, AlertCircle, Play,
  Undo, Redo, FileJson, Upload, BookOpen, Bot,
  Circle, Hexagon, Triangle, Users, Package,
  ArrowLeft, Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface UnifiedEditorProps {
  plan?: any // Plan data from database
  isDemo?: boolean
}

export default function UnifiedEditor({ plan, isDemo = false }: UnifiedEditorProps) {
  const router = useRouter()
  const supabase = createClient()

  // Core state
  const [selectedTool, setSelectedTool] = useState('select')
  const [selectedPlant, setSelectedPlant] = useState<PlantInfo | null>(null)
  const [selectedElement, setSelectedElement] = useState<ElementSubtype | null>(null)

  // Garden state with history
  const { state: gardenBeds, setState: setGardenBeds, undo, redo, canUndo, canRedo } = useHistory<GardenBed[]>(
    plan?.beds || []
  )

  // View settings
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showSpacing, setShowSpacing] = useState(false)
  const [showSunRequirements, setShowSunRequirements] = useState(false)
  const [showWaterRequirements, setShowWaterRequirements] = useState(false)
  const [showZones, setShowZones] = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState('plants')
  const [plantCategory, setPlantCategory] = useState<PlantInfo['category']>('vegetable')
  const [plantSearch, setPlantSearch] = useState('')
  const [showElements, setShowElements] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Grouping state
  const [plantGroups, setPlantGroups] = useState<PlantGroup[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [showGroupPanel, setShowGroupPanel] = useState(false)

  // Save to database
  const handleSave = async () => {
    if (isDemo || !plan) {
      toast.success('Changes saved locally')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('beds')
        .upsert(
          gardenBeds.map(bed => ({
            id: bed.id,
            plan_id: plan.id,
            data: bed
          }))
        )

      if (error) throw error

      setLastSaved(new Date())
      toast.success('Garden saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save garden')
    } finally {
      setSaving(false)
    }
  }

  // Auto-save
  useEffect(() => {
    if (!isDemo && plan) {
      const autoSaveTimer = setInterval(handleSave, 30000) // Auto-save every 30 seconds
      return () => clearInterval(autoSaveTimer)
    }
  }, [gardenBeds, plan, isDemo])

  // Filter plants
  const filteredPlants = getPlantsByCategory(plantCategory).filter(plant =>
    plant.name.toLowerCase().includes(plantSearch.toLowerCase())
  )

  // Tools configuration
  const tools = [
    { id: 'select', name: 'Select', icon: MousePointer, hotkey: 'V' },
    { id: 'rectangle', name: 'Rectangle', icon: Square, hotkey: 'R' },
    { id: 'circle', name: 'Circle', icon: Circle, hotkey: 'C' },
    { id: 'triangle', name: 'Triangle', icon: Triangle, hotkey: 'T' },
    { id: 'hexagon', name: 'Hexagon', icon: Hexagon, hotkey: 'H' },
    { id: 'pencil', name: 'Draw', icon: Pencil, hotkey: 'D' },
    { id: 'delete', name: 'Delete', icon: Trash2, hotkey: 'Del' }
  ]

  // Group panel handlers
  const handleGroupEdit = (group: PlantGroup) => {
    // TODO: Implement group edit dialog
    console.log('Edit group:', group)
  }

  const handleGroupDelete = (groupId: string) => {
    setPlantGroups(prev => prev.filter(g => g.id !== groupId))
    toast.success('Group deleted')
  }

  const handleGroupDuplicate = (group: PlantGroup) => {
    const newGroup = {
      ...group,
      id: `group-${Date.now()}`,
      name: `${group.name} (Copy)`
    }
    setPlantGroups(prev => [...prev, newGroup])
    toast.success('Group duplicated')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isDemo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          <h1 className="text-lg font-semibold">
            {isDemo ? 'Garden Designer Demo' : plan?.name || 'Garden Editor'}
          </h1>

          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            variant={showGrid ? "default" : "ghost"}
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant={showLabels ? "default" : "ghost"}
            onClick={() => setShowLabels(!showLabels)}
          >
            <Layers className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant={showGroupPanel ? "default" : "ghost"}
            onClick={() => setShowGroupPanel(!showGroupPanel)}
          >
            <Users className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <Card className="m-3">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-2 grid grid-cols-2 gap-1">
              {tools.map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedTool(tool.id)
                    setSelectedPlant(null)
                    setSelectedElement(null)
                  }}
                  className="justify-start"
                >
                  <tool.icon className="h-4 w-4 mr-1" />
                  <span className="text-xs">{tool.name}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Plant Library */}
          <Card className="m-3">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Plant Library</CardTitle>
              <CardDescription>Click a plant to select</CardDescription>
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

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="🔍 Search plants..."
                    value={plantSearch}
                    onChange={(e) => setPlantSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <ScrollArea className="h-64 mt-2">
                  <div className="grid grid-cols-3 gap-1">
                    {filteredPlants.map(plant => (
                      <button
                        key={plant.id}
                        onClick={() => {
                          setSelectedPlant(plant)
                          setSelectedTool('plant')
                          setSelectedElement(null)
                        }}
                        className={cn(
                          "p-2 rounded-lg border transition-all",
                          selectedPlant?.id === plant.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="text-2xl">{plant.icon}</div>
                        <div className="text-xs mt-1">{plant.name}</div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>

          {/* Elements */}
          <Card className="m-3">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Elements</CardTitle>
              <CardDescription>Add structures & features</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <Button
                size="sm"
                variant={showElements ? "default" : "outline"}
                className="w-full"
                onClick={() => setShowElements(!showElements)}
              >
                <Package className="h-4 w-4 mr-2" />
                Browse Elements
              </Button>

              {showElements && (
                <div className="mt-2">
                  <ElementSelector
                    selectedElement={selectedElement}
                    onSelectElement={(element) => {
                      setSelectedElement(element)
                      setSelectedTool('element')
                      setSelectedPlant(null)
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="flex-1">
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

        {/* Right Sidebar - Groups Panel */}
        {showGroupPanel && (
          <div className="w-80 bg-white border-l overflow-y-auto">
            <PlantGroupPanel
              groups={plantGroups}
              beds={gardenBeds}
              plantLibrary={PLANT_LIBRARY}
              selectedGroupId={selectedGroupId}
              onGroupSelect={setSelectedGroupId}
              onGroupEdit={handleGroupEdit}
              onGroupDelete={handleGroupDelete}
              onGroupDuplicate={handleGroupDuplicate}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t px-4 py-1 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Zoom: {zoom}%</span>
          <span>Beds: {gardenBeds.length}</span>
          <span>Plants: {gardenBeds.reduce((acc, bed) => acc + bed.plants.length, 0)}</span>
          <span>Groups: {plantGroups.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isDemo && plan?.sites?.address && (
            <span>Site: {plan.sites.address}</span>
          )}
          <span>Mode: {selectedTool}</span>
        </div>
      </div>
    </div>
  )
}