'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ShowMoreList } from '@/components/ui/paginated-list'
import { MapPin, Eye, EyeOff, Info, Target, TrendingUp, AlertCircle } from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { cn } from '@/lib/utils'

interface ZoneManagementPanelProps {
  /** Current garden beds with zone assignments */
  gardenBeds: GardenBed[]
  /** Callback when zone visibility changes */
  onZoneVisibilityChange?: (zone: number, visible: boolean) => void
  /** Callback when zone overlay settings change */
  onZoneSettingsChange?: (settings: ZoneSettings) => void
}

interface ZoneSettings {
  showZoneOverlay: boolean
  zoneOpacity: number
  highlightedZone: number | null
  centerX: number
  centerY: number
}

interface ZoneInfo {
  number: 0 | 1 | 2 | 3 | 4 | 5
  name: string
  description: string
  color: string
  visitFrequency: string
  maintenanceLevel: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low'
  typicalElements: string[]
  examples: string[]
}

const ZONE_DATA: ZoneInfo[] = [
  {
    number: 0,
    name: 'Zone 0 - Home',
    description: 'The house itself and immediate surroundings',
    color: '#dc2626',
    visitFrequency: 'Multiple times daily',
    maintenanceLevel: 'Very High',
    typicalElements: ['Kitchen garden', 'Herb pots', 'Sprouts', 'Indoor plants'],
    examples: ['Windowsill herbs', 'Countertop microgreens', 'Indoor composting'],
  },
  {
    number: 1,
    name: 'Zone 1 - Intensive',
    description: 'Areas requiring daily attention and frequent visits',
    color: '#ea580c',
    visitFrequency: 'Daily',
    maintenanceLevel: 'High',
    typicalElements: ['Salad greens', 'Herbs', 'Small animals', 'Compost'],
    examples: ['Kitchen garden', 'Herb spiral', 'Chicken coop', 'Cold frames'],
  },
  {
    number: 2,
    name: 'Zone 2 - Semi-intensive',
    description: 'Main production areas visited frequently',
    color: '#f59e0b',
    visitFrequency: '2-3 times per week',
    maintenanceLevel: 'Medium',
    typicalElements: ['Main crops', 'Berry bushes', 'Greenhouse', 'Tool shed'],
    examples: ['Vegetable beds', 'Raspberries', 'Fruit bushes', 'Propagation area'],
  },
  {
    number: 3,
    name: 'Zone 3 - Occasional',
    description: 'Areas requiring weekly or less frequent visits',
    color: '#eab308',
    visitFrequency: 'Weekly',
    maintenanceLevel: 'Low',
    typicalElements: ['Orchards', 'Grain crops', 'Pastures', 'Large animals'],
    examples: ['Apple trees', 'Wheat field', 'Grazing paddock', 'Windbreak'],
  },
  {
    number: 4,
    name: 'Zone 4 - Minimal',
    description: 'Semi-wild areas for foraging and timber',
    color: '#84cc16',
    visitFrequency: 'Monthly',
    maintenanceLevel: 'Very Low',
    typicalElements: ['Nut trees', 'Timber', 'Wild foraging', 'Firewood'],
    examples: ['Walnut grove', 'Coppiced woodland', 'Wild berries', 'Managed forest'],
  },
  {
    number: 5,
    name: 'Zone 5 - Wild',
    description: 'Unmanaged wilderness for observation and learning',
    color: '#22c55e',
    visitFrequency: 'Rarely',
    maintenanceLevel: 'Very Low',
    typicalElements: ['Wilderness', 'Wildlife habitat', 'Seed collection', 'Study area'],
    examples: ['Native forest', 'Wetlands', 'Wild meadow', 'Wildlife corridor'],
  },
]

/**
 * ZoneManagementPanel - Complete zone planning interface
 *
 * Features:
 * - Zone 0-5 visualization and management
 * - Element distribution by zone
 * - Zone overlay controls
 * - Efficiency analysis
 * - Zone recommendations
 */
export function ZoneManagementPanel({
  gardenBeds,
  onZoneVisibilityChange,
  onZoneSettingsChange,
}: ZoneManagementPanelProps) {
  const [settings, setSettings] = useState<ZoneSettings>({
    showZoneOverlay: true,
    zoneOpacity: 0.3,
    highlightedZone: null,
    centerX: 0,
    centerY: 0,
  })
  const [visibleZones, setVisibleZones] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  })

  // Calculate zone statistics
  const zoneStats = useMemo(() => {
    const stats: Record<number, { count: number; elements: GardenBed[] }> = {
      0: { count: 0, elements: [] },
      1: { count: 0, elements: [] },
      2: { count: 0, elements: [] },
      3: { count: 0, elements: [] },
      4: { count: 0, elements: [] },
      5: { count: 0, elements: [] },
    }

    gardenBeds.forEach(bed => {
      const zone = bed.zone ?? -1
      if (zone >= 0 && zone <= 5) {
        stats[zone].count++
        stats[zone].elements.push(bed)
      }
    })

    return stats
  }, [gardenBeds])

  // Calculate unassigned elements
  const unassignedCount = gardenBeds.filter(bed => (bed.zone ?? -1) < 0).length

  // Calculate zone efficiency
  const zoneEfficiency = useMemo(() => {
    // Simple efficiency calculation based on element distribution
    const totalElements = gardenBeds.length
    if (totalElements === 0) return 0

    // Ideal distribution: more in zones 1-3, less in 0, 4, 5
    const idealRatios = { 0: 0.05, 1: 0.25, 2: 0.35, 3: 0.25, 4: 0.08, 5: 0.02 }
    let efficiencyScore = 100

    Object.entries(idealRatios).forEach(([zone, idealRatio]) => {
      const actualRatio = zoneStats[parseInt(zone)].count / totalElements
      const deviation = Math.abs(actualRatio - idealRatio)
      efficiencyScore -= deviation * 100
    })

    return Math.max(0, Math.min(100, efficiencyScore))
  }, [zoneStats, gardenBeds.length])

  const handleZoneVisibilityToggle = (zone: number) => {
    const newVisibility = { ...visibleZones, [zone]: !visibleZones[zone] }
    setVisibleZones(newVisibility)
    if (onZoneVisibilityChange) {
      onZoneVisibilityChange(zone, newVisibility[zone])
    }
  }

  const handleSettingsChange = (newSettings: Partial<ZoneSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    if (onZoneSettingsChange) {
      onZoneSettingsChange(updated)
    }
  }

  const handleZoneHighlight = (zone: number | null) => {
    handleSettingsChange({ highlightedZone: zone })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Zone Management
          </h2>
          <Badge variant="outline">
            {gardenBeds.length} elements
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Organize elements by visit frequency
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Zone Overlay Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Overlay Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-overlay" className="text-sm">
                  Show Zone Overlay
                </Label>
                <Switch
                  id="show-overlay"
                  checked={settings.showZoneOverlay}
                  onCheckedChange={(checked) => handleSettingsChange({ showZoneOverlay: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opacity" className="text-sm">
                  Opacity: {Math.round(settings.zoneOpacity * 100)}%
                </Label>
                <Slider
                  id="opacity"
                  value={[settings.zoneOpacity * 100]}
                  onValueChange={([value]) => handleSettingsChange({ zoneOpacity: value / 100 })}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zone Efficiency */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Zone Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all',
                        zoneEfficiency >= 80 ? 'bg-green-500' :
                        zoneEfficiency >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      )}
                      style={{ width: `${zoneEfficiency}%` }}
                    />
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {Math.round(zoneEfficiency)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {zoneEfficiency >= 80 && 'Excellent distribution! Your design follows permaculture principles.'}
                {zoneEfficiency >= 60 && zoneEfficiency < 80 && 'Good distribution. Consider moving some elements to optimize access.'}
                {zoneEfficiency < 60 && 'Room for improvement. High-maintenance items should be closer to the home.'}
              </p>
              {unassignedCount > 0 && (
                <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {unassignedCount} element{unassignedCount > 1 ? 's' : ''} not assigned to any zone
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zone Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Zones</h3>
            {ZONE_DATA.map((zone) => {
              const stats = zoneStats[zone.number]
              const isVisible = visibleZones[zone.number]
              const isHighlighted = settings.highlightedZone === zone.number

              return (
                <Card
                  key={zone.number}
                  className={cn(
                    'transition-all cursor-pointer',
                    isHighlighted && 'ring-2',
                    !isVisible && 'opacity-50'
                  )}
                  style={{ borderLeftColor: zone.color, borderLeftWidth: 4 }}
                  onMouseEnter={() => handleZoneHighlight(zone.number)}
                  onMouseLeave={() => handleZoneHighlight(null)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          {zone.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {zone.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleZoneVisibilityToggle(zone.number)
                        }}
                      >
                        {isVisible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Visit Frequency</span>
                      <Badge variant="outline" className="text-xs">
                        {zone.visitFrequency}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Maintenance</span>
                      <Badge variant="outline" className="text-xs">
                        {zone.maintenanceLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Elements in Zone</span>
                      <Badge variant="secondary" className="font-mono">
                        {stats.count}
                      </Badge>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-1">
                      <p className="text-xs font-medium">Typical Elements:</p>
                      <div className="flex flex-wrap gap-1">
                        {zone.typicalElements.map((element) => (
                          <Badge key={element} variant="outline" className="text-xs">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {stats.count > 0 && (
                      <>
                        <Separator className="my-2" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Your Elements:</p>
                          <div className="flex flex-wrap gap-1">
                            {stats.elements.slice(0, 5).map((bed) => (
                              <Badge key={bed.id} variant="secondary" className="text-xs">
                                {bed.name}
                              </Badge>
                            ))}
                            {stats.count > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{stats.count - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Zone Planning Tips */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Info className="h-4 w-4" />
                Zone Planning Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-blue-900 dark:text-blue-100">
              <ul className="space-y-1 list-disc list-inside">
                <li>Place high-maintenance plants closer to your home (Zone 1-2)</li>
                <li>Position water sources strategically across multiple zones</li>
                <li>Use Zone 5 as a seed bank and learning laboratory</li>
                <li>Consider seasonal access patterns and weather conditions</li>
                <li>Stack functions: paths can also be windbreaks or edges</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
