'use client'

import React, { useState } from 'react'
import { Node, isBedNode, isPathNode, isPlantNode, isIrrigationNode, isStructureNode, isCompostNode } from '@/modules/scene/sceneTypes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Palette, Ruler, RotateCw, Move, Maximize,
  Droplet, Sun, Wind, Thermometer, Calendar,
  AlertCircle, Info, Zap, Leaf, TreePine,
  Clock, DollarSign, Users, Settings2
} from 'lucide-react'

interface PropertyPanelProps {
  node: Node | null
  onUpdate: (updates: Partial<Node>) => void
  onDelete?: () => void
}

export function PropertyPanel({ node, onUpdate, onDelete }: PropertyPanelProps) {
  const [localValues, setLocalValues] = useState<any>({})

  if (!node) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Info className="h-12 w-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Select an element to edit its properties</p>
      </div>
    )
  }

  const handleUpdate = (path: string, value: any) => {
    const keys = path.split('.')
    const updates: any = {}
    let current = updates

    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = {}
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    onUpdate(updates)
    setLocalValues({ ...localValues, [path]: value })
  }

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Basic Properties Tab */}
        <TabsContent value="basic" className="space-y-4 p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Move className="h-4 w-4" />
                Position & Transform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">X Position (inches)</Label>
                  <Input
                    type="number"
                    value={node.transform.xIn}
                    onChange={(e) => handleUpdate('transform.xIn', parseFloat(e.target.value))}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y Position (inches)</Label>
                  <Input
                    type="number"
                    value={node.transform.yIn}
                    onChange={(e) => handleUpdate('transform.yIn', parseFloat(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <RotateCw className="h-3 w-3" />
                    Rotation
                  </span>
                  <span className="text-gray-500">{node.transform.rotationDeg}°</span>
                </Label>
                <Slider
                  value={[node.transform.rotationDeg]}
                  onValueChange={([v]) => handleUpdate('transform.rotationDeg', v)}
                  min={0}
                  max={360}
                  step={15}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Size controls for applicable nodes */}
          {('size' in node && node.size) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Maximize className="h-4 w-4" />
                  Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Width (inches)</Label>
                    <Input
                      type="number"
                      value={node.size.widthIn}
                      onChange={(e) => handleUpdate('size.widthIn', parseFloat(e.target.value))}
                      className="h-8"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height (inches)</Label>
                    <Input
                      type="number"
                      value={node.size.heightIn}
                      onChange={(e) => handleUpdate('size.heightIn', parseFloat(e.target.value))}
                      className="h-8"
                      min={1}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Area: {((node.size.widthIn * node.size.heightIn) / 144).toFixed(1)} sq ft
                </div>
              </CardContent>
            </Card>
          )}

          {/* Node-specific properties */}
          {isBedNode(node) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TreePine className="h-4 w-4" />
                  Garden Bed Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Bed Name/Tag</Label>
                  <Input
                    value={node.bed.familyTag || ''}
                    onChange={(e) => handleUpdate('bed.familyTag', e.target.value)}
                    placeholder="e.g., Tomato Bed"
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs">Bed Height (inches)</Label>
                  <Slider
                    value={[node.bed.heightIn]}
                    onValueChange={([v]) => handleUpdate('bed.heightIn', v)}
                    min={6}
                    max={36}
                    step={2}
                    className="mt-2"
                  />
                  <span className="text-xs text-gray-500">{node.bed.heightIn}" tall</span>
                </div>

                <div>
                  <Label className="text-xs">Orientation</Label>
                  <Select
                    value={node.bed.orientation}
                    onValueChange={(v) => handleUpdate('bed.orientation', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NS">North-South</SelectItem>
                      <SelectItem value="EW">East-West</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Wicking Bed</Label>
                  <Switch
                    checked={node.bed.wicking}
                    onCheckedChange={(v) => handleUpdate('bed.wicking', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">Trellis (North Side)</Label>
                  <Switch
                    checked={node.bed.trellisNorth}
                    onCheckedChange={(v) => handleUpdate('bed.trellisNorth', v)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {isPathNode(node) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Path Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Material</Label>
                  <Select
                    value={node.path.material || 'mulch'}
                    onValueChange={(v) => handleUpdate('path.material', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mulch">Wood Chip Mulch</SelectItem>
                      <SelectItem value="gravel">Gravel</SelectItem>
                      <SelectItem value="pavers">Pavers/Brick</SelectItem>
                      <SelectItem value="grass">Grass</SelectItem>
                      <SelectItem value="decomposed-granite">Decomposed Granite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-gray-500">
                  <div>Width: {(node.size.widthIn / 12).toFixed(1)} ft</div>
                  <div>Accessibility: {node.size.widthIn >= 36 ? '✓ Wheelchair accessible' : '⚠ Narrow path'}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {isIrrigationNode(node) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplet className="h-4 w-4" />
                  Irrigation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={node.irrigation.irrigationType}
                    onValueChange={(v) => handleUpdate('irrigation.irrigationType', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drip-line">Drip Line</SelectItem>
                      <SelectItem value="sprinkler">Sprinkler</SelectItem>
                      <SelectItem value="soaker-hose">Soaker Hose</SelectItem>
                      <SelectItem value="rain-barrel">Rain Barrel</SelectItem>
                      <SelectItem value="swale">Swale</SelectItem>
                      <SelectItem value="pond">Pond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {node.irrigation.flowRate !== undefined && (
                  <div>
                    <Label className="text-xs">Flow Rate (gph)</Label>
                    <Slider
                      value={[node.irrigation.flowRate]}
                      onValueChange={([v]) => handleUpdate('irrigation.flowRate', v)}
                      min={0.5}
                      max={10}
                      step={0.5}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">{node.irrigation.flowRate} gal/hour</span>
                  </div>
                )}

                {node.irrigation.capacity !== undefined && (
                  <div>
                    <Label className="text-xs">Capacity (gallons)</Label>
                    <Input
                      type="number"
                      value={node.irrigation.capacity}
                      onChange={(e) => handleUpdate('irrigation.capacity', parseFloat(e.target.value))}
                      className="h-8"
                      min={1}
                    />
                  </div>
                )}

                {node.irrigation.coverage !== undefined && (
                  <div>
                    <Label className="text-xs">Coverage Radius (inches)</Label>
                    <Slider
                      value={[node.irrigation.coverage]}
                      onValueChange={([v]) => handleUpdate('irrigation.coverage', v)}
                      min={24}
                      max={240}
                      step={12}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">{(node.irrigation.coverage / 12).toFixed(0)} ft radius</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isStructureNode(node) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Structure Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={node.structure.structureType}
                    onValueChange={(v) => handleUpdate('structure.structureType', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bench">Bench</SelectItem>
                      <SelectItem value="pergola">Pergola</SelectItem>
                      <SelectItem value="trellis">Trellis</SelectItem>
                      <SelectItem value="shade-sail">Shade Sail</SelectItem>
                      <SelectItem value="greenhouse">Greenhouse</SelectItem>
                      <SelectItem value="shed">Shed</SelectItem>
                      <SelectItem value="arbor">Arbor</SelectItem>
                      <SelectItem value="gazebo">Gazebo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Material</Label>
                  <Select
                    value={node.structure.material || 'wood'}
                    onValueChange={(v) => handleUpdate('structure.material', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="fabric">Fabric</SelectItem>
                      <SelectItem value="bamboo">Bamboo</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="composite">Composite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {node.structure.shadePercentage !== undefined && (
                  <div>
                    <Label className="text-xs">Shade Coverage (%)</Label>
                    <Slider
                      value={[node.structure.shadePercentage]}
                      onValueChange={([v]) => handleUpdate('structure.shadePercentage', v)}
                      min={0}
                      max={100}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-xs text-gray-500">{node.structure.shadePercentage}% shade</span>
                  </div>
                )}

                {node.size.heightFt !== undefined && (
                  <div>
                    <Label className="text-xs">Height (feet)</Label>
                    <Input
                      type="number"
                      value={node.size.heightFt}
                      onChange={(e) => handleUpdate('size.heightFt', parseFloat(e.target.value))}
                      className="h-8"
                      min={1}
                      max={20}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isCompostNode(node) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Compost Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={node.compost.compostType}
                    onValueChange={(v) => handleUpdate('compost.compostType', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bin">Bin System</SelectItem>
                      <SelectItem value="pile">Open Pile</SelectItem>
                      <SelectItem value="tumbler">Tumbler</SelectItem>
                      <SelectItem value="worm-bin">Worm Bin</SelectItem>
                      <SelectItem value="leaf-mold">Leaf Mold Bin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {node.compost.compostType === 'bin' && (
                  <div>
                    <Label className="text-xs">Number of Bins</Label>
                    <Select
                      value={String(node.compost.numberOfBins || 1)}
                      onValueChange={(v) => handleUpdate('compost.numberOfBins', parseInt(v))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Single Bin</SelectItem>
                        <SelectItem value="2">2-Bin System</SelectItem>
                        <SelectItem value="3">3-Bin System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label className="text-xs">Capacity (cu ft)</Label>
                  <Input
                    type="number"
                    value={node.compost.capacity || 20}
                    onChange={(e) => handleUpdate('compost.capacity', parseFloat(e.target.value))}
                    className="h-8"
                    min={1}
                    max={200}
                  />
                </div>

                <div>
                  <Label className="text-xs">Material</Label>
                  <Select
                    value={node.compost.material || 'wood'}
                    onValueChange={(v) => handleUpdate('compost.material', v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="plastic">Plastic</SelectItem>
                      <SelectItem value="wire">Wire Mesh</SelectItem>
                      <SelectItem value="concrete-blocks">Concrete Blocks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Advanced Properties Tab */}
        <TabsContent value="advanced" className="space-y-4 p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Selectable</Label>
                <Switch
                  checked={node.selectable !== false}
                  onCheckedChange={(v) => handleUpdate('selectable', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Draggable</Label>
                <Switch
                  checked={node.draggable !== false}
                  onCheckedChange={(v) => handleUpdate('draggable', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Resizable</Label>
                <Switch
                  checked={node.resizable !== false}
                  onCheckedChange={(v) => handleUpdate('resizable', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Rotatable</Label>
                <Switch
                  checked={node.rotatable !== false}
                  onCheckedChange={(v) => handleUpdate('rotatable', v)}
                />
              </div>

              {/* Style options */}
              {node.style && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs">Opacity</Label>
                    <Slider
                      value={[node.style.opacity || 1]}
                      onValueChange={([v]) => handleUpdate('style.opacity', v)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  {node.style.label && (
                    <div>
                      <Label className="text-xs">Label Text</Label>
                      <Input
                        value={node.style.label.text || ''}
                        onChange={(e) => handleUpdate('style.label.text', e.target.value)}
                        className="h-8"
                        placeholder="Custom label"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Cost tracking */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Installation Cost ($)</Label>
                <Input
                  type="number"
                  value={(node.meta?.cost || 0) as number}
                  onChange={(e) => handleUpdate('meta.cost', parseFloat(e.target.value))}
                  className="h-8"
                  min={0}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label className="text-xs">Time to Install (hours)</Label>
                <Input
                  type="number"
                  value={(node.meta?.installTime || 0) as number}
                  onChange={(e) => handleUpdate('meta.installTime', parseFloat(e.target.value))}
                  className="h-8"
                  min={0}
                  step={0.5}
                />
              </div>

              <div>
                <Label className="text-xs">Maintenance (hours/year)</Label>
                <Input
                  type="number"
                  value={(node.meta?.maintenanceTime || 0) as number}
                  onChange={(e) => handleUpdate('meta.maintenanceTime', parseFloat(e.target.value))}
                  className="h-8"
                  min={0}
                  step={0.5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environmental Tab */}
        <TabsContent value="environment" className="space-y-4 p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Sun & Shade Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Sun Exposure</Label>
                <Select
                  value={(node.meta?.sunExposure || 'full-sun') as string}
                  onValueChange={(v) => handleUpdate('meta.sunExposure', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-sun">Full Sun (6+ hours)</SelectItem>
                    <SelectItem value="partial-sun">Partial Sun (4-6 hours)</SelectItem>
                    <SelectItem value="partial-shade">Partial Shade (2-4 hours)</SelectItem>
                    <SelectItem value="full-shade">Full Shade (&lt;2 hours)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Morning vs Afternoon Sun</Label>
                <Select
                  value={(node.meta?.sunTiming || 'both') as string}
                  onValueChange={(v) => handleUpdate('meta.sunTiming', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning Sun Preferred</SelectItem>
                    <SelectItem value="afternoon">Afternoon Sun OK</SelectItem>
                    <SelectItem value="both">Both OK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Water & Drainage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Water Needs</Label>
                <Select
                  value={(node.meta?.waterNeeds || 'moderate') as string}
                  onValueChange={(v) => handleUpdate('meta.waterNeeds', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drought-tolerant">Drought Tolerant</SelectItem>
                    <SelectItem value="low">Low Water</SelectItem>
                    <SelectItem value="moderate">Moderate Water</SelectItem>
                    <SelectItem value="high">High Water</SelectItem>
                    <SelectItem value="aquatic">Aquatic/Bog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Drainage</Label>
                <Select
                  value={(node.meta?.drainage || 'well-drained') as string}
                  onValueChange={(v) => handleUpdate('meta.drainage', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="well-drained">Well Drained</SelectItem>
                    <SelectItem value="moist">Consistently Moist</SelectItem>
                    <SelectItem value="dry">Dry/Sandy</SelectItem>
                    <SelectItem value="clay">Heavy Clay</SelectItem>
                    <SelectItem value="poor">Poor Drainage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Temperature & Climate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">USDA Hardiness Zone</Label>
                <Select
                  value={(node.meta?.hardinessZone || '7') as string}
                  onValueChange={(v) => handleUpdate('meta.hardinessZone', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(13)].map((_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        Zone {i + 1} ({-60 + (i * 10)}°F to {-50 + (i * 10)}°F)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Frost Protection Needed</Label>
                <Switch
                  checked={(node.meta?.frostProtection || false) as boolean}
                  onCheckedChange={(v) => handleUpdate('meta.frostProtection', v)}
                />
              </div>

              <div>
                <Label className="text-xs">Wind Protection Needed</Label>
                <Switch
                  checked={(node.meta?.windProtection || false) as boolean}
                  onCheckedChange={(v) => handleUpdate('meta.windProtection', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Notes & Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Planting Date</Label>
                <Input
                  type="date"
                  value={(node.meta?.plantingDate || '') as string}
                  onChange={(e) => handleUpdate('meta.plantingDate', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Expected Harvest</Label>
                <Input
                  type="date"
                  value={(node.meta?.harvestDate || '') as string}
                  onChange={(e) => handleUpdate('meta.harvestDate', e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-xs">Notes</Label>
                <textarea
                  value={(node.meta?.notes || '') as string}
                  onChange={(e) => handleUpdate('meta.notes', e.target.value)}
                  className="w-full min-h-[100px] p-2 text-sm border rounded-md"
                  placeholder="Add notes about this element..."
                />
              </div>

              <div>
                <Label className="text-xs">Tags</Label>
                <Input
                  value={(node.meta?.tags || '') as string}
                  onChange={(e) => handleUpdate('meta.tags', e.target.value)}
                  className="h-8"
                  placeholder="organic, perennial, native..."
                />
              </div>

              <div>
                <Label className="text-xs">Priority</Label>
                <Select
                  value={(node.meta?.priority || 'medium') as string}
                  onValueChange={(v) => handleUpdate('meta.priority', v)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="future">⚪ Future</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete button */}
      {onDelete && (
        <div className="p-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="w-full"
          >
            Delete Element
          </Button>
        </div>
      )}
    </div>
  )
}