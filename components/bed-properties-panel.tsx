'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GardenBed } from '@/components/garden-designer-canvas'
import {
  Palette, Type, Shapes, Layers, Settings,
  Square, Circle, Triangle, Hexagon, Pentagon,
  Star, Heart, Diamond, Flower2, TreePine
} from 'lucide-react'

interface BedPropertiesPanelProps {
  selectedBed: GardenBed | null
  onBedUpdate: (bed: GardenBed) => void
  onClose?: () => void
}

// Predefined color schemes
const COLOR_SCHEMES = {
  vegetables: [
    { fill: '#d4f4dd', stroke: '#22c55e', name: 'Garden Green' },
    { fill: '#fff4e0', stroke: '#f59e0b', name: 'Harvest Gold' },
    { fill: '#fee2e2', stroke: '#ef4444', name: 'Tomato Red' },
    { fill: '#e0e7ff', stroke: '#6366f1', name: 'Eggplant Purple' }
  ],
  herbs: [
    { fill: '#ecfdf5', stroke: '#10b981', name: 'Mint Fresh' },
    { fill: '#f3f4f6', stroke: '#6b7280', name: 'Sage Gray' },
    { fill: '#fef3c7', stroke: '#f59e0b', name: 'Thyme Yellow' },
    { fill: '#ede9fe', stroke: '#8b5cf6', name: 'Lavender' }
  ],
  flowers: [
    { fill: '#fce7f3', stroke: '#ec4899', name: 'Rose Pink' },
    { fill: '#fbcfe8', stroke: '#f472b6', name: 'Peony' },
    { fill: '#fde68a', stroke: '#fbbf24', name: 'Sunflower' },
    { fill: '#ddd6fe', stroke: '#a78bfa', name: 'Iris' }
  ],
  custom: []
}

// Shape templates
const SHAPE_TEMPLATES = [
  { id: 'square', icon: Square, name: 'Square' },
  { id: 'circle', icon: Circle, name: 'Circle' },
  { id: 'triangle', icon: Triangle, name: 'Triangle' },
  { id: 'hexagon', icon: Hexagon, name: 'Hexagon' },
  { id: 'pentagon', icon: Pentagon, name: 'Pentagon' },
  { id: 'star', icon: Star, name: 'Star' },
  { id: 'heart', icon: Heart, name: 'Heart' },
  { id: 'diamond', icon: Diamond, name: 'Diamond' },
  { id: 'flower', icon: Flower2, name: 'Flower' },
  { id: 'tree', icon: TreePine, name: 'Tree' }
]

export function BedPropertiesPanel({
  selectedBed,
  onBedUpdate,
  onClose
}: BedPropertiesPanelProps) {
  const [bedName, setBedName] = useState(selectedBed?.name || '')
  const [fillColor, setFillColor] = useState(selectedBed?.fill || '#d4f4dd')
  const [strokeColor, setStrokeColor] = useState(selectedBed?.stroke || '#22c55e')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(selectedBed?.rotation || 0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (selectedBed) {
      setBedName(selectedBed.name)
      setFillColor(selectedBed.fill)
      setStrokeColor(selectedBed.stroke)
      setRotation(selectedBed.rotation || 0)
    }
  }, [selectedBed])

  const handleApply = () => {
    if (!selectedBed) return

    const updatedBed: GardenBed = {
      ...selectedBed,
      name: bedName,
      fill: fillColor,
      stroke: strokeColor,
      rotation: rotation
    }

    onBedUpdate(updatedBed)
  }

  const applyColorScheme = (scheme: { fill: string, stroke: string }) => {
    setFillColor(scheme.fill)
    setStrokeColor(scheme.stroke)
  }

  const convertToShape = (shapeId: string) => {
    if (!selectedBed) return

    // This would need to be implemented in the parent component
    // to actually change the shape of the bed
    console.log('Convert to shape:', shapeId)
  }

  if (!selectedBed) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-gray-500">
          Select an element to edit its properties
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bed Properties
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <Type className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="shape">
              <Shapes className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Layers className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="bed-name">Bed Name</Label>
              <Input
                id="bed-name"
                value={bedName}
                onChange={(e) => setBedName(e.target.value)}
                placeholder="e.g., Herb Guild, Tomato Zone"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bed-type">Bed Type</Label>
              <Select defaultValue="raised">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select bed type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raised">Raised Bed</SelectItem>
                  <SelectItem value="ground">In-Ground</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="hydroponic">Hydroponic</SelectItem>
                  <SelectItem value="hugelkultur">Hugelkultur</SelectItem>
                  <SelectItem value="keyhole">Keyhole Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                rows={3}
                placeholder="Add notes about this bed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div>
              <Label className="mb-2 block">Quick Color Schemes</Label>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Vegetables</p>
                  <div className="grid grid-cols-4 gap-1">
                    {COLOR_SCHEMES.vegetables.map((scheme, i) => (
                      <button
                        key={i}
                        onClick={() => applyColorScheme(scheme)}
                        className="h-8 w-full rounded border-2 hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: scheme.fill,
                          borderColor: scheme.stroke
                        }}
                        title={scheme.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Herbs</p>
                  <div className="grid grid-cols-4 gap-1">
                    {COLOR_SCHEMES.herbs.map((scheme, i) => (
                      <button
                        key={i}
                        onClick={() => applyColorScheme(scheme)}
                        className="h-8 w-full rounded border-2 hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: scheme.fill,
                          borderColor: scheme.stroke
                        }}
                        title={scheme.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Flowers</p>
                  <div className="grid grid-cols-4 gap-1">
                    {COLOR_SCHEMES.flowers.map((scheme, i) => (
                      <button
                        key={i}
                        onClick={() => applyColorScheme(scheme)}
                        className="h-8 w-full rounded border-2 hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: scheme.fill,
                          borderColor: scheme.stroke
                        }}
                        title={scheme.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fill-color">Fill Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="fill-color"
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    placeholder="#d4f4dd"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stroke-color">Border Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="stroke-color"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    placeholder="#22c55e"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="opacity">Opacity: {opacity}%</Label>
              <Slider
                id="opacity"
                min={10}
                max={100}
                step={10}
                value={[opacity]}
                onValueChange={([value]) => setOpacity(value)}
                className="mt-2"
              />
            </div>
          </TabsContent>

          {/* Shape Tab */}
          <TabsContent value="shape" className="space-y-4">
            <div>
              <Label className="mb-2 block">Convert to Shape</Label>
              <div className="grid grid-cols-5 gap-2">
                {SHAPE_TEMPLATES.map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => convertToShape(shape.id)}
                    className="p-3 border rounded-lg hover:bg-gray-50 hover:border-green-500 transition-all"
                    title={shape.name}
                  >
                    <shape.icon className="h-6 w-6 mx-auto" />
                    <p className="text-xs mt-1">{shape.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="rotation">Rotation: {rotation}°</Label>
              <Slider
                id="rotation"
                min={0}
                max={360}
                step={15}
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="border-width">Border Width: {strokeWidth}px</Label>
              <Slider
                id="border-width"
                min={1}
                max={10}
                step={1}
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
                className="mt-2"
              />
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label htmlFor="soil-type">Soil Type</Label>
              <Select defaultValue="loam">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="peat">Peat</SelectItem>
                  <SelectItem value="chalk">Chalk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sun-exposure">Sun Exposure</Label>
              <Select defaultValue="full-sun">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select sun exposure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-sun">Full Sun (6+ hours)</SelectItem>
                  <SelectItem value="partial-sun">Partial Sun (3-6 hours)</SelectItem>
                  <SelectItem value="partial-shade">Partial Shade (2-3 hours)</SelectItem>
                  <SelectItem value="full-shade">Full Shade (&lt; 2 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="water-source">Water Source</Label>
              <Select defaultValue="manual">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select water source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Watering</SelectItem>
                  <SelectItem value="drip">Drip Irrigation</SelectItem>
                  <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                  <SelectItem value="soaker">Soaker Hose</SelectItem>
                  <SelectItem value="rain">Rain Harvesting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bed-width">Width (ft)</Label>
                <Input
                  id="bed-width"
                  type="number"
                  defaultValue={selectedBed.width || 4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bed-height">Length (ft)</Label>
                <Input
                  id="bed-height"
                  type="number"
                  defaultValue={selectedBed.height || 8}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleApply}
            className="flex-1 gradient-understory"
          >
            Apply Changes
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}