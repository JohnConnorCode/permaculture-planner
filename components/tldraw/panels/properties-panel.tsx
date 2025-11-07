'use client'

import React, { useState, useEffect } from 'react'
import { Editor, TLShape } from 'tldraw'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Settings, Pencil, Trash2, Copy } from 'lucide-react'
import { BedShape } from '../shapes/bed-shape'
import { PlantShape } from '../shapes/plant-shape'
import { ElementShape } from '../shapes/element-shape'
import { ZoneShape } from '../shapes/zone-shape'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'

interface PropertiesPanelProps {
  editor: Editor | null
}

/**
 * PropertiesPanel - Edit properties of selected shapes
 *
 * Features:
 * - Real-time property editing
 * - Type-specific controls (bed, plant, element, zone)
 * - Zone assignment
 * - Color and size controls
 * - Delete and duplicate actions
 */
export function PropertiesPanel({ editor }: PropertiesPanelProps) {
  const [selectedShape, setSelectedShape] = useState<TLShape | null>(null)
  const [properties, setProperties] = useState<any>({})

  // Listen for selection changes
  useEffect(() => {
    if (!editor) return

    const handleSelectionChange = () => {
      const selectedShapes = editor.getSelectedShapes()
      if (selectedShapes.length === 1) {
        setSelectedShape(selectedShapes[0])
        setProperties(selectedShapes[0].props)
      } else {
        setSelectedShape(null)
        setProperties({})
      }
    }

    // Initial check
    handleSelectionChange()

    // Listen for changes
    const unsubscribe = editor.store.listen(() => {
      handleSelectionChange()
    })

    return () => {
      unsubscribe()
    }
  }, [editor])

  const updateProperty = (key: string, value: any) => {
    if (!editor || !selectedShape) return

    editor.updateShape({
      id: selectedShape.id,
      type: selectedShape.type,
      props: {
        ...selectedShape.props,
        [key]: value,
      },
    } as any)

    setProperties({ ...properties, [key]: value })
  }

  const handleDelete = () => {
    if (!editor || !selectedShape) return
    editor.deleteShape(selectedShape.id)
    setSelectedShape(null)
  }

  const handleDuplicate = () => {
    if (!editor || !selectedShape) return
    editor.duplicateShapes([selectedShape.id])
  }

  if (!selectedShape) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Properties</h2>
        </div>
        <div className="text-center text-sm text-muted-foreground py-8">
          Select an element to edit its properties
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Properties</h2>
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedShape.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Editing selected element
          </p>
        </div>

        {/* Type-specific properties */}
        {selectedShape.type === 'bed' && (
          <BedProperties
            shape={selectedShape as any}
            properties={properties}
            onUpdate={updateProperty}
          />
        )}

        {selectedShape.type === 'plant' && (
          <PlantProperties
            shape={selectedShape as any}
            properties={properties}
            onUpdate={updateProperty}
          />
        )}

        {selectedShape.type === 'element' && (
          <ElementProperties
            shape={selectedShape as any}
            properties={properties}
            onUpdate={updateProperty}
          />
        )}

        {selectedShape.type === 'zone' && (
          <ZoneProperties
            shape={selectedShape as any}
            properties={properties}
            onUpdate={updateProperty}
          />
        )}

        <Separator />

        {/* Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleDuplicate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

interface PropertyEditorProps {
  shape: any
  properties: any
  onUpdate: (key: string, value: any) => void
}

function BedProperties({ properties, onUpdate }: PropertyEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Bed Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={properties.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Garden Bed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={properties.w || 0}
              onChange={(e) => onUpdate('w', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={properties.h || 0}
              onChange={(e) => onUpdate('h', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zone">Zone Assignment</Label>
          <Select
            value={properties.zone?.toString() || '-1'}
            onValueChange={(v) => onUpdate('zone', parseInt(v))}
          >
            <SelectTrigger id="zone">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">No Zone</SelectItem>
              <SelectItem value="0">Zone 0 - Home</SelectItem>
              <SelectItem value="1">Zone 1 - Intensive</SelectItem>
              <SelectItem value="2">Zone 2 - Semi-intensive</SelectItem>
              <SelectItem value="3">Zone 3 - Occasional</SelectItem>
              <SelectItem value="4">Zone 4 - Minimal</SelectItem>
              <SelectItem value="5">Zone 5 - Wild</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            value={properties.color || '#22c55e'}
            onChange={(e) => onUpdate('color', e.target.value)}
            className="h-10"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PlantProperties({ properties, onUpdate }: PropertyEditorProps) {
  const plant = PLANT_LIBRARY.find(p => p.id === properties.plantId)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Plant Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <div className="text-3xl">{properties.emoji}</div>
          <div className="flex-1">
            <p className="font-semibold">{properties.plantName}</p>
            <p className="text-xs text-muted-foreground">
              {plant?.category || 'Unknown category'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plantedDate">Planted Date</Label>
          <Input
            id="plantedDate"
            type="date"
            value={properties.plantedDate ? new Date(properties.plantedDate).toISOString().split('T')[0] : ''}
            onChange={(e) => onUpdate('plantedDate', new Date(e.target.value).toISOString())}
          />
        </div>

        {plant && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sun</span>
              <Badge variant="outline">{plant.requirements.sun}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water</span>
              <Badge variant="outline">{plant.requirements.water}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spacing</span>
              <Badge variant="outline">{plant.size.spacing}"</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harvest</span>
              <Badge variant="outline">{plant.harvest_time}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ElementProperties({ properties, onUpdate }: PropertyEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Element Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={properties.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            placeholder="Element Name"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Badge variant="secondary" className="w-full justify-center capitalize">
            {properties.subtype?.replace('_', ' ')}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              value={properties.w || 0}
              onChange={(e) => onUpdate('w', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              type="number"
              value={properties.h || 0}
              onChange={(e) => onUpdate('h', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zone">Zone Assignment</Label>
          <Select
            value={properties.zone?.toString() || '-1'}
            onValueChange={(v) => onUpdate('zone', parseInt(v))}
          >
            <SelectTrigger id="zone">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">No Zone</SelectItem>
              <SelectItem value="0">Zone 0 - Home</SelectItem>
              <SelectItem value="1">Zone 1 - Intensive</SelectItem>
              <SelectItem value="2">Zone 2 - Semi-intensive</SelectItem>
              <SelectItem value="3">Zone 3 - Occasional</SelectItem>
              <SelectItem value="4">Zone 4 - Minimal</SelectItem>
              <SelectItem value="5">Zone 5 - Wild</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {properties.category === 'water_management' && properties.capacity !== undefined && (
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (gallons)</Label>
            <Input
              id="capacity"
              type="number"
              value={properties.capacity || 0}
              onChange={(e) => onUpdate('capacity', parseFloat(e.target.value))}
            />
          </div>
        )}

        {properties.category === 'structure' && (
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={properties.material || ''}
              onChange={(e) => onUpdate('material', e.target.value)}
              placeholder="Wood, metal, plastic..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ZoneProperties({ properties, onUpdate }: PropertyEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Zone Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="radius">Radius</Label>
          <Slider
            id="radius"
            value={[properties.radius || 100]}
            onValueChange={([value]) => onUpdate('radius', value)}
            min={50}
            max={500}
            step={10}
          />
          <p className="text-xs text-muted-foreground text-right">
            {properties.radius || 100}px
          </p>
        </div>

        <div className="space-y-2">
          <Label>Zone Number</Label>
          <Badge variant="secondary" className="w-full justify-center">
            Zone {properties.zoneNumber} - {properties.label}
          </Badge>
        </div>

        <div className="p-3 bg-muted rounded-lg text-xs">
          <p className="text-muted-foreground">{properties.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
