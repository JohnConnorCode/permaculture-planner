'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Link2,
  Waves,
  Sun,
  Droplets,
  Leaf,
  Ruler,
  Eye,
  EyeOff,
  Info,
  Sparkles,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { EnvironmentalMode } from './overlays/environmental-zones-overlay'

export interface OverlayConfig {
  // Main toggles
  showCompanionLines: boolean
  showImpactZones: boolean
  showEnvironmentalZones: boolean
  showTooltips: boolean
  showSpacing: boolean

  // Environmental mode
  environmentalMode: EnvironmentalMode

  // Visual customization
  lineOpacity: number
  zoneOpacity: number
  showLabels: boolean
  animationSpeed: 'slow' | 'medium' | 'fast' | 'none'

  // Filters
  showOnlyStrongRelationships: boolean
  minimumRelationshipStrength: 'weak' | 'moderate' | 'strong'
  maxDisplayDistance: number // pixels
}

interface OverlayConfigPanelProps {
  config: OverlayConfig
  onChange: (config: OverlayConfig) => void
  onClose?: () => void
}

export function OverlayConfigPanel({ config, onChange, onClose }: OverlayConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState<OverlayConfig>(config)

  const updateConfig = (updates: Partial<OverlayConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    onChange(newConfig)
  }

  const resetToDefaults = () => {
    const defaults: OverlayConfig = {
      showCompanionLines: false,
      showImpactZones: false,
      showEnvironmentalZones: false,
      showTooltips: true,
      showSpacing: false,
      environmentalMode: 'sun',
      lineOpacity: 60,
      zoneOpacity: 15,
      showLabels: true,
      animationSpeed: 'medium',
      showOnlyStrongRelationships: false,
      minimumRelationshipStrength: 'weak',
      maxDisplayDistance: 300,
    }
    setLocalConfig(defaults)
    onChange(defaults)
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Overlay Settings</CardTitle>
          </div>
          <Badge variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Advanced
          </Badge>
        </div>
        <CardDescription>
          Customize visual overlays and analysis display
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Tabs defaultValue="overlays" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
            </TabsList>

            {/* OVERLAYS TAB */}
            <TabsContent value="overlays" className="space-y-4 mt-4">
              {/* Companion Lines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-green-600" />
                    <Label htmlFor="companion-lines" className="font-semibold">
                      Companion Lines
                    </Label>
                  </div>
                  <Switch
                    id="companion-lines"
                    checked={localConfig.showCompanionLines}
                    onCheckedChange={(checked) =>
                      updateConfig({ showCompanionLines: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show visual connections between companion plants
                </p>

                {localConfig.showCompanionLines && (
                  <div className="ml-6 space-y-3 pt-2 border-l-2 border-green-200 pl-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Filter by Strength</Label>
                      <Select
                        value={localConfig.minimumRelationshipStrength}
                        onValueChange={(value: any) =>
                          updateConfig({ minimumRelationshipStrength: value })
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weak">Show All (Weak+)</SelectItem>
                          <SelectItem value="moderate">Moderate+</SelectItem>
                          <SelectItem value="strong">Strong Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <Label>Max Display Distance</Label>
                        <span className="text-muted-foreground">{localConfig.maxDisplayDistance}px</span>
                      </div>
                      <Slider
                        value={[localConfig.maxDisplayDistance]}
                        onValueChange={([value]) => updateConfig({ maxDisplayDistance: value })}
                        min={100}
                        max={500}
                        step={50}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Impact Zones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="impact-zones" className="font-semibold">
                      Impact Zones
                    </Label>
                  </div>
                  <Switch
                    id="impact-zones"
                    checked={localConfig.showImpactZones}
                    onCheckedChange={(checked) =>
                      updateConfig({ showImpactZones: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show service areas for water, structures, and animals
                </p>
              </div>

              <Separator />

              {/* Environmental Zones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-600" />
                    <Label htmlFor="env-zones" className="font-semibold">
                      Environmental Zones
                    </Label>
                  </div>
                  <Switch
                    id="env-zones"
                    checked={localConfig.showEnvironmentalZones}
                    onCheckedChange={(checked) =>
                      updateConfig({ showEnvironmentalZones: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show sun, water, or nutrient requirement zones
                </p>

                {localConfig.showEnvironmentalZones && (
                  <div className="ml-6 space-y-2 pt-2 border-l-2 border-amber-200 pl-3">
                    <Label className="text-xs">Zone Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={localConfig.environmentalMode === 'sun' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateConfig({ environmentalMode: 'sun' })}
                        className="h-8"
                      >
                        <Sun className="h-3 w-3 mr-1" />
                        Sun
                      </Button>
                      <Button
                        variant={localConfig.environmentalMode === 'water' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateConfig({ environmentalMode: 'water' })}
                        className="h-8"
                      >
                        <Droplets className="h-3 w-3 mr-1" />
                        Water
                      </Button>
                      <Button
                        variant={localConfig.environmentalMode === 'nutrients' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateConfig({ environmentalMode: 'nutrients' })}
                        className="h-8"
                      >
                        <Leaf className="h-3 w-3 mr-1" />
                        Nutrients
                      </Button>
                      <Button
                        variant={localConfig.environmentalMode === 'spacing' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateConfig({ environmentalMode: 'spacing' })}
                        className="h-8"
                      >
                        <Ruler className="h-3 w-3 mr-1" />
                        Spacing
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Tooltips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="tooltips" className="font-semibold">
                      Detailed Tooltips
                    </Label>
                  </div>
                  <Switch
                    id="tooltips"
                    checked={localConfig.showTooltips}
                    onCheckedChange={(checked) =>
                      updateConfig({ showTooltips: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show detailed companion information on hover
                </p>
              </div>

              <Separator />

              {/* Spacing Guides */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-indigo-600" />
                    <Label htmlFor="spacing" className="font-semibold">
                      Spacing Guides
                    </Label>
                  </div>
                  <Switch
                    id="spacing"
                    checked={localConfig.showSpacing}
                    onCheckedChange={(checked) =>
                      updateConfig({ showSpacing: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show optimal spacing circles around plants
                </p>
              </div>
            </TabsContent>

            {/* VISUAL TAB */}
            <TabsContent value="visual" className="space-y-4 mt-4">
              {/* Line Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Companion Line Opacity</Label>
                  <span className="text-xs text-muted-foreground">{localConfig.lineOpacity}%</span>
                </div>
                <Slider
                  value={[localConfig.lineOpacity]}
                  onValueChange={([value]) => updateConfig({ lineOpacity: value })}
                  min={10}
                  max={100}
                  step={10}
                />
              </div>

              <Separator />

              {/* Zone Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Zone Opacity</Label>
                  <span className="text-xs text-muted-foreground">{localConfig.zoneOpacity}%</span>
                </div>
                <Slider
                  value={[localConfig.zoneOpacity]}
                  onValueChange={([value]) => updateConfig({ zoneOpacity: value })}
                  min={5}
                  max={50}
                  step={5}
                />
              </div>

              <Separator />

              {/* Show Labels */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {localConfig.showLabels ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  <Label htmlFor="labels">Show Zone Labels</Label>
                </div>
                <Switch
                  id="labels"
                  checked={localConfig.showLabels}
                  onCheckedChange={(checked) =>
                    updateConfig({ showLabels: checked })
                  }
                />
              </div>

              <Separator />

              {/* Animation Speed */}
              <div className="space-y-2">
                <Label>Animation Speed</Label>
                <Select
                  value={localConfig.animationSpeed}
                  onValueChange={(value: any) =>
                    updateConfig({ animationSpeed: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Static)</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults} className="flex-1">
              Reset to Defaults
            </Button>
            {onClose && (
              <Button onClick={onClose} className="flex-1">
                Done
              </Button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <Label className="text-xs font-semibold mb-2 block">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateConfig({
                    showCompanionLines: false,
                    showImpactZones: false,
                    showEnvironmentalZones: false,
                    showTooltips: true,
                    showSpacing: false,
                  })
                }}
              >
                Clean View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateConfig({
                    showCompanionLines: true,
                    showImpactZones: true,
                    showEnvironmentalZones: false,
                    showTooltips: true,
                    showSpacing: false,
                  })
                }}
              >
                Analysis Mode
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateConfig({
                    showCompanionLines: false,
                    showImpactZones: false,
                    showEnvironmentalZones: true,
                    environmentalMode: 'sun',
                    showTooltips: true,
                    showSpacing: false,
                  })
                }}
              >
                Sun Planning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateConfig({
                    showCompanionLines: true,
                    showImpactZones: true,
                    showEnvironmentalZones: true,
                    showTooltips: true,
                    showSpacing: true,
                  })
                }}
              >
                Show All
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
