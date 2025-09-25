'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Layers, MousePointer, Square, Pencil, Trash2,
  Undo, Redo, ZoomIn, ZoomOut, Grid, Eye, EyeOff,
  TreePine, Flower, Droplets, Home, Users, Package,
  Info, Download, Save, Upload, Settings
} from 'lucide-react'
import { PLANTS, PlantData, getPlantsByCategory } from '@/lib/data/plant-database'
import { PERMACULTURE_STRUCTURES, PermacultureStructure, getStructuresByCategory } from '@/lib/data/permaculture-structures'
import { cn } from '@/lib/utils'

interface PlacedItem {
  id: string
  type: 'plant' | 'structure'
  itemId: string
  x: number
  y: number
  rotation?: number
  scale?: number
}

interface GardenArea {
  id: string
  name: string
  type: 'bed' | 'path' | 'zone'
  points: { x: number; y: number }[]
  fill: string
  stroke: string
  items: PlacedItem[]
}

export function PermacultureDesigner() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [selectedTool, setSelectedTool] = useState<'select' | 'draw' | 'plant' | 'structure' | 'delete'>('select')
  const [selectedCategory, setSelectedCategory] = useState<'vegetables' | 'herbs' | 'fruits' | 'structures'>('vegetables')
  const [selectedItem, setSelectedItem] = useState<PlantData | PermacultureStructure | null>(null)
  const [gardenAreas, setGardenAreas] = useState<GardenArea[]>([])
  const [selectedArea, setSelectedArea] = useState<GardenArea | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Get items for current category
  const categoryItems = selectedCategory === 'structures'
    ? PERMACULTURE_STRUCTURES
    : getPlantsByCategory(selectedCategory as any)

  // Handle canvas click for placing items
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'plant' || selectedTool === 'structure') {
      if (!selectedItem || !selectedArea) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) * (100 / zoom)
      const y = (e.clientY - rect.top) * (100 / zoom)

      const newItem: PlacedItem = {
        id: `item-${Date.now()}`,
        type: selectedTool === 'plant' ? 'plant' : 'structure',
        itemId: selectedItem.id,
        x,
        y,
        rotation: 0,
        scale: 1
      }

      setGardenAreas(areas =>
        areas.map(area =>
          area.id === selectedArea.id
            ? { ...area, items: [...area.items, newItem] }
            : area
        )
      )
    }
  }, [selectedTool, selectedItem, selectedArea, zoom])

  // Create a new garden bed
  const createNewBed = () => {
    const newBed: GardenArea = {
      id: `bed-${Date.now()}`,
      name: `Garden Bed ${gardenAreas.length + 1}`,
      type: 'bed',
      points: [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 300, y: 200 },
        { x: 100, y: 200 }
      ],
      fill: '#e8f5e9',
      stroke: '#4caf50',
      items: []
    }
    setGardenAreas([...gardenAreas, newBed])
    setSelectedArea(newBed)
  }

  return (
    <div className="flex h-[800px] gap-4">
      {/* Left Sidebar - Tools & Items */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Permaculture Designer</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4">
          {/* Tool Selection */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            <Button
              size="sm"
              variant={selectedTool === 'select' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('select')}
              className="p-2"
            >
              <MousePointer className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'draw' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('draw')}
              className="p-2"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'plant' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('plant')}
              className="p-2"
            >
              <TreePine className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'structure' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('structure')}
              className="p-2"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedTool === 'delete' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('delete')}
              className="p-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="mb-4" />

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="vegetables" className="text-xs">Veg</TabsTrigger>
              <TabsTrigger value="herbs" className="text-xs">Herbs</TabsTrigger>
              <TabsTrigger value="fruits" className="text-xs">Fruits</TabsTrigger>
              <TabsTrigger value="structures" className="text-xs">Struct</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-3 gap-2">
                  {selectedCategory === 'structures' ? (
                    // Render structures
                    PERMACULTURE_STRUCTURES.map(structure => (
                      <Card
                        key={structure.id}
                        className={cn(
                          "p-2 cursor-pointer hover:bg-accent transition-colors",
                          selectedItem?.id === structure.id && "ring-2 ring-primary"
                        )}
                        onClick={() => {
                          setSelectedItem(structure)
                          setSelectedTool('structure')
                        }}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{structure.icon}</div>
                          <div className="text-xs font-medium truncate">{structure.name}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {structure.category}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    // Render plants
                    categoryItems.map((plant: any) => (
                      <Card
                        key={plant.id}
                        className={cn(
                          "p-2 cursor-pointer hover:bg-accent transition-colors",
                          selectedItem?.id === plant.id && "ring-2 ring-primary"
                        )}
                        onClick={() => {
                          setSelectedItem(plant)
                          setSelectedTool('plant')
                        }}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{plant.visual?.icon || '🌱'}</div>
                          <div className="text-xs font-medium truncate">{plant.commonName}</div>
                          {plant.lifecycle && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {plant.lifecycle.type}
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Selected Item Info */}
          {selectedItem && (
            <Card className="mt-4 p-3 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">
                {(selectedItem as any).name || (selectedItem as any).commonName}
              </h4>
              {'requirements' in selectedItem && (
                <div className="space-y-1 text-xs">
                  <div>Sun: {selectedItem.requirements.sun}</div>
                  <div>Water: {selectedItem.requirements.water}</div>
                </div>
              )}
              {'functions' in selectedItem && (
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">Functions:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedItem.functions.slice(0, 3).map(func => (
                      <Badge key={func} variant="secondary" className="text-xs">
                        {func}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Main Canvas */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={createNewBed}>
                <Square className="h-4 w-4 mr-1" />
                New Bed
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                size="sm"
                variant={showGrid ? 'default' : 'outline'}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={showLabels ? 'default' : 'outline'}
                onClick={() => setShowLabels(!showLabels)}
              >
                {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoom(Math.min(200, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg relative overflow-auto border-2 border-dashed border-gray-300"
            onClick={handleCanvasClick}
            style={{
              backgroundImage: showGrid ? 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)' : 'none',
              backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
              cursor: selectedTool === 'plant' || selectedTool === 'structure' ? 'crosshair' : 'default'
            }}
          >
            {/* Render garden areas */}
            {gardenAreas.map(area => (
              <div
                key={area.id}
                className={cn(
                  "absolute border-2 rounded",
                  selectedArea?.id === area.id && "ring-2 ring-blue-500"
                )}
                style={{
                  left: `${area.points[0].x * (zoom / 100)}px`,
                  top: `${area.points[0].y * (zoom / 100)}px`,
                  width: `${(area.points[1].x - area.points[0].x) * (zoom / 100)}px`,
                  height: `${(area.points[2].y - area.points[0].y) * (zoom / 100)}px`,
                  backgroundColor: area.fill,
                  borderColor: area.stroke,
                  transform: `scale(${zoom / 100})`
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedArea(area)
                }}
              >
                {showLabels && (
                  <div className="absolute -top-6 left-0 text-sm font-medium bg-white px-2 py-1 rounded shadow">
                    {area.name}
                  </div>
                )}

                {/* Render items in area */}
                {area.items.map(item => {
                  const itemData = item.type === 'plant'
                    ? PLANTS.find(p => p.id === item.itemId)
                    : PERMACULTURE_STRUCTURES.find(s => s.id === item.itemId)

                  if (!itemData) return null

                  return (
                    <div
                      key={item.id}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation || 0}deg) scale(${item.scale || 1})`
                      }}
                    >
                      <div className="text-2xl">
                        {item.type === 'plant'
                          ? (itemData as PlantData).visual?.icon || '🌱'
                          : (itemData as PermacultureStructure).icon}
                      </div>
                      {showLabels && (
                        <div className="absolute -bottom-4 text-xs bg-white/80 px-1 rounded whitespace-nowrap">
                          {(itemData as any).commonName || (itemData as any).name}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Helper text when empty */}
            {gardenAreas.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TreePine className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-lg font-medium">Start Your Permaculture Design</p>
                  <p className="text-sm mt-1">Click "New Bed" to create your first garden area</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Sidebar - Properties */}
      <Card className="w-72">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Properties</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {selectedArea ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Area Name</label>
                <input
                  type="text"
                  value={selectedArea.name}
                  onChange={(e) => {
                    setGardenAreas(areas =>
                      areas.map(a =>
                        a.id === selectedArea.id
                          ? { ...a, name: e.target.value }
                          : a
                      )
                    )
                    setSelectedArea({ ...selectedArea, name: e.target.value })
                  }}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Contents</h4>
                <div className="text-xs text-muted-foreground">
                  {selectedArea.items.length} items placed
                </div>

                {selectedArea.items.length > 0 && (
                  <ScrollArea className="h-48 mt-2 border rounded p-2">
                    {selectedArea.items.map(item => {
                      const itemData = item.type === 'plant'
                        ? PLANTS.find(p => p.id === item.itemId)
                        : PERMACULTURE_STRUCTURES.find(s => s.id === item.itemId)

                      return (
                        <div key={item.id} className="flex items-center justify-between py-1">
                          <span className="text-xs">
                            {(itemData as any)?.commonName || (itemData as any)?.name || 'Unknown'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                            onClick={() => {
                              setGardenAreas(areas =>
                                areas.map(a =>
                                  a.id === selectedArea.id
                                    ? { ...a, items: a.items.filter(i => i.id !== item.id) }
                                    : a
                                )
                              )
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    })}
                  </ScrollArea>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Zone Info</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{selectedArea.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">
                      {Math.round((selectedArea.points[1].x - selectedArea.points[0].x) / 12)}'
                      x
                      {Math.round((selectedArea.points[2].y - selectedArea.points[0].y) / 12)}'
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setGardenAreas(areas => areas.filter(a => a.id !== selectedArea.id))
                  setSelectedArea(null)
                }}
              >
                Delete Area
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select an area to view properties</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}