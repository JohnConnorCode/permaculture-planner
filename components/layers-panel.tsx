'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  Eye, EyeOff, Lock, Unlock, Layers, ChevronDown, ChevronRight,
  Trash2, Plus, Settings, Palette, Move, Copy, Grid
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export interface Layer {
  id: string
  name: string
  type: 'beds' | 'plants' | 'labels' | 'grid' | 'measurements' | 'guides'
  visible: boolean
  locked: boolean
  opacity: number
  color?: string
  order: number
}

interface LayersPanelProps {
  layers: Layer[]
  onLayersChange: (layers: Layer[]) => void
  className?: string
  isFloating?: boolean
}

export function LayersPanel({
  layers: initialLayers,
  onLayersChange,
  className,
  isFloating = false
}: LayersPanelProps) {
  const [layers, setLayers] = useState<Layer[]>(initialLayers)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['all']))
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(layers)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order properties
    const updatedLayers = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
  }

  const toggleVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    )
    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
  }

  const toggleLock = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    )
    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
  }

  const updateOpacity = (layerId: string, opacity: number) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, opacity } : layer
    )
    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
  }

  const deleteLayer = (layerId: string) => {
    const updatedLayers = layers.filter(layer => layer.id !== layerId)
    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
    setSelectedLayer(null)
  }

  const duplicateLayer = (layerId: string) => {
    const layerToDuplicate = layers.find(l => l.id === layerId)
    if (!layerToDuplicate) return

    const newLayer = {
      ...layerToDuplicate,
      id: `${layerToDuplicate.id}-copy-${Date.now()}`,
      name: `${layerToDuplicate.name} Copy`
    }

    const updatedLayers = [...layers, newLayer]
    setLayers(updatedLayers)
    onLayersChange(updatedLayers)
  }

  const LayerIcon = ({ type }: { type: Layer['type'] }) => {
    switch (type) {
      case 'beds': return <Grid className="h-4 w-4" />
      case 'plants': return <span className="text-sm">🌱</span>
      case 'labels': return <span className="text-sm">Aa</span>
      case 'grid': return <Grid className="h-4 w-4" />
      case 'measurements': return <span className="text-sm">📏</span>
      case 'guides': return <span className="text-sm">📐</span>
      default: return <Layers className="h-4 w-4" />
    }
  }

  return (
    <Card className={cn(
      "w-80",
      isFloating && "fixed right-4 top-20 z-40 shadow-2xl",
      className
    )}>
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Layers
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newLayer: Layer = {
                  id: `layer-${Date.now()}`,
                  name: 'New Layer',
                  type: 'beds',
                  visible: true,
                  locked: false,
                  opacity: 100,
                  order: layers.length
                }
                setLayers([...layers, newLayer])
                onLayersChange([...layers, newLayer])
              }}
              className="h-7 w-7 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="layers">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                {layers.sort((a, b) => a.order - b.order).map((layer, index) => (
                  <Draggable key={layer.id} draggableId={layer.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group",
                          snapshot.isDragging && "opacity-50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors",
                            selectedLayer === layer.id && "bg-blue-50 ring-1 ring-blue-200"
                          )}
                          onClick={() => setSelectedLayer(layer.id)}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Move className="h-3 w-3 text-gray-400" />
                          </div>

                          {/* Layer Icon */}
                          <LayerIcon type={layer.type} />

                          {/* Layer Name */}
                          <span className="flex-1 text-sm font-medium truncate">
                            {layer.name}
                          </span>

                          {/* Visibility Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleVisibility(layer.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {layer.visible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>

                          {/* Lock Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleLock(layer.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {layer.locked ? (
                              <Lock className="h-3 w-3 text-orange-500" />
                            ) : (
                              <Unlock className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </div>

                        {/* Expanded Options */}
                        {selectedLayer === layer.id && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg space-y-3 animate-fade-in">
                            {/* Opacity Slider */}
                            <div className="space-y-1">
                              <Label className="text-xs flex items-center justify-between">
                                <span>Opacity</span>
                                <span className="text-gray-500">{layer.opacity}%</span>
                              </Label>
                              <Slider
                                value={[layer.opacity]}
                                onValueChange={([value]) => updateOpacity(layer.id, value)}
                                min={0}
                                max={100}
                                step={5}
                                className="w-full"
                              />
                            </div>

                            {/* Layer Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => duplicateLayer(layer.id)}
                                className="flex-1 h-8"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Duplicate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteLayer(layer.id)}
                                className="flex-1 h-8 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>

                            {/* Layer-specific settings */}
                            {layer.type === 'beds' && (
                              <div className="space-y-2">
                                <Label className="text-xs">Bed Settings</Label>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">Show borders</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">Show fill</span>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            )}

                            {layer.type === 'plants' && (
                              <div className="space-y-2">
                                <Label className="text-xs">Plant Display</Label>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">Show icons</span>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs">Show names</span>
                                  <Switch />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Quick Actions</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updatedLayers = layers.map(l => ({ ...l, visible: true }))
                setLayers(updatedLayers)
                onLayersChange(updatedLayers)
              }}
              className="text-xs h-7"
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updatedLayers = layers.map(l => ({ ...l, visible: false }))
                setLayers(updatedLayers)
                onLayersChange(updatedLayers)
              }}
              className="text-xs h-7"
            >
              Hide All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updatedLayers = layers.map(l => ({ ...l, locked: false }))
                setLayers(updatedLayers)
                onLayersChange(updatedLayers)
              }}
              className="text-xs h-7"
            >
              Unlock All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}