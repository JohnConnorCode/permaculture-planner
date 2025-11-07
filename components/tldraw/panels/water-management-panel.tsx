/**
 * Water Management Panel - Comprehensive water system design
 *
 * KEY DIFFERENTIATOR: Most planners ignore water management
 * This provides professional-grade water system design
 *
 * Features:
 * - Rainwater catchment calculations
 * - Swale/berm placement guidance
 * - Greywater system design
 * - Irrigation efficiency scoring
 * - Water budget analysis
 * - Drought resilience planning
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Droplets,
  CloudRain,
  Waves,
  TrendingDown,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Layers,
  Navigation,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { SiteData } from './analytics-panel'
import { deriveClimateFromLocation } from '@/lib/climate/climate-utils'
import { cn } from '@/lib/utils'

interface WaterManagementPanelProps {
  gardenBeds: GardenBed[]
  siteData?: SiteData | null
}

/**
 * Water Management Panel
 */
export function WaterManagementPanel({ gardenBeds, siteData }: WaterManagementPanelProps) {
  const [roofArea, setRoofArea] = useState<number>(1500) // sq ft
  const [annualRainfall, setAnnualRainfall] = useState<number>(40) // inches
  const [greywarerDaily, setGreywaterDaily] = useState<number>(50) // gallons

  // Analyze water management
  const analysis = useMemo(
    () => analyzeWaterManagement(gardenBeds, siteData, roofArea, annualRainfall, greywarerDaily),
    [gardenBeds, siteData, roofArea, annualRainfall, greywarerDaily]
  )

  const hasLocation = !!siteData?.location

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Water Management
          </h2>
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-xs',
              analysis.resilienceScore >= 80 && 'bg-green-100 text-green-800',
              analysis.resilienceScore >= 60 && analysis.resilienceScore < 80 && 'bg-yellow-100 text-yellow-800',
              analysis.resilienceScore < 60 && 'bg-red-100 text-red-800'
            )}
          >
            {analysis.resilienceScore}% resilient
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Design water capture, storage, and conservation systems
        </p>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b grid grid-cols-4">
          <TabsTrigger value="overview">
            <Droplets className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="catchment">
            <CloudRain className="h-4 w-4 mr-2" />
            Catchment
          </TabsTrigger>
          <TabsTrigger value="swales">
            <Waves className="h-4 w-4 mr-2" />
            Swales
          </TabsTrigger>
          <TabsTrigger value="greywater">
            <TrendingDown className="h-4 w-4 mr-2" />
            Greywater
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Overview Tab */}
          <TabsContent value="overview" className="m-0 p-4 space-y-4">
            {/* Water Resilience Score */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Droplets className="h-5 w-5" />
                  Water Resilience Score
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300 text-xs">
                  How well your design handles water challenges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Overall Score</span>
                  <Badge variant="secondary" className="font-mono text-lg">
                    {analysis.resilienceScore}/100
                  </Badge>
                </div>
                <Progress value={analysis.resilienceScore} className="h-3" />
              </CardContent>
            </Card>

            {/* Water Budget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Water Budget</CardTitle>
                <CardDescription className="text-xs">Weekly water supply vs demand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 dark:text-green-300 mb-1">Supply</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {analysis.weeklySupply.toFixed(0)}
                    </div>
                    <div className="text-[10px] text-green-600">gal/week</div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
                    <div className="text-xs text-red-700 dark:text-red-300 mb-1">Demand</div>
                    <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                      {analysis.weeklyDemand.toFixed(0)}
                    </div>
                    <div className="text-[10px] text-red-600">gal/week</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <Badge
                    className={cn(
                      analysis.waterBalance >= 0 ? 'bg-green-600' : 'bg-red-600',
                      'text-white'
                    )}
                  >
                    {analysis.waterBalance >= 0 ? '+' : ''}
                    {analysis.waterBalance.toFixed(0)} gal/week
                  </Badge>
                </div>

                {analysis.waterBalance < 0 && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-amber-800 dark:text-amber-200">
                      Water deficit! Consider rainwater catchment or reduce plantings
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Water Sources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Current Water Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <source.icon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <Badge variant="outline">{source.capacity} gal/week</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Priority Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rainwater Catchment Tab */}
          <TabsContent value="catchment" className="m-0 p-4 space-y-4">
            {/* Calculator */}
            <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-sky-900 dark:text-sky-100">
                  <CloudRain className="h-5 w-5" />
                  Rainwater Catchment Calculator
                </CardTitle>
                <CardDescription className="text-sky-700 dark:text-sky-300 text-xs">
                  Calculate potential rainwater harvest from your roof
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roofArea" className="text-xs">
                    Roof Catchment Area (sq ft)
                  </Label>
                  <Input
                    id="roofArea"
                    type="number"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall" className="text-xs">
                    Annual Rainfall (inches)
                  </Label>
                  <Input
                    id="rainfall"
                    type="number"
                    value={annualRainfall}
                    onChange={(e) => setAnnualRainfall(Number(e.target.value))}
                    className="h-9"
                  />
                  {hasLocation && (
                    <p className="text-[10px] text-muted-foreground">
                      Estimated for your location: {analysis.estimatedRainfall}" annually
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-sky-700 dark:text-sky-300">Annual Catchment:</span>
                    <span className="font-mono font-semibold text-sky-900 dark:text-sky-100">
                      {analysis.annualCatchment.toLocaleString()} gal
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sky-700 dark:text-sky-300">Weekly Average:</span>
                    <span className="font-mono font-semibold text-sky-900 dark:text-sky-100">
                      {analysis.weeklyCatchment.toFixed(0)} gal
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sky-700 dark:text-sky-300">Per 1" Rain:</span>
                    <span className="font-mono font-semibold text-sky-900 dark:text-sky-100">
                      {analysis.perInchCatchment.toFixed(0)} gal
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recommended Storage</CardTitle>
                <CardDescription className="text-xs">
                  Cistern/barrel capacity to buffer dry periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded">
                  <div className="text-xs text-muted-foreground mb-2">Minimum (1 week buffer)</div>
                  <div className="text-2xl font-bold">
                    {analysis.minStorageGallons.toLocaleString()} gal
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    ~{Math.ceil(analysis.minStorageGallons / 55)} rain barrels (55gal each)
                  </div>
                </div>

                <div className="p-3 bg-primary/10 rounded">
                  <div className="text-xs text-primary mb-2">Optimal (4 week buffer)</div>
                  <div className="text-2xl font-bold text-primary">
                    {analysis.optimalStorageGallons.toLocaleString()} gal
                  </div>
                  <div className="text-[10px] text-primary/70 mt-1">
                    Consider {Math.ceil(analysis.optimalStorageGallons / 275)} IBC totes (275gal
                    each)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Design */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Catchment System Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Install gutters on all roof edges (aluminum or galvanized)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Use leaf guards/screens to prevent debris
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    First flush diverter to discard initial dirty water
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Overflow directed to swales or rain garden
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Mosquito-proof screens on all openings
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swales & Earthworks Tab */}
          <TabsContent value="swales" className="m-0 p-4 space-y-4">
            <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 border-teal-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-teal-900 dark:text-teal-100">
                  <Waves className="h-5 w-5" />
                  Swale & Berm Systems
                </CardTitle>
                <CardDescription className="text-teal-700 dark:text-teal-300 text-xs">
                  Capture and infiltrate runoff on contour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded">
                  <div className="text-sm font-semibold text-teal-900 dark:text-teal-100 mb-2">
                    What is a Swale?
                  </div>
                  <p className="text-xs text-teal-800 dark:text-teal-200">
                    A level ditch on contour that captures runoff and allows it to infiltrate.
                    Downhill berm grows productive plants. Works with gravity, not against it.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Swale Sizing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recommended Swale Dimensions</CardTitle>
                <CardDescription className="text-xs">
                  Based on your site's total area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-muted rounded text-center">
                    <div className="text-muted-foreground mb-1">Width</div>
                    <div className="text-lg font-bold">{analysis.swale.width}"</div>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <div className="text-muted-foreground mb-1">Depth</div>
                    <div className="text-lg font-bold">{analysis.swale.depth}"</div>
                  </div>
                  <div className="p-2 bg-muted rounded text-center">
                    <div className="text-muted-foreground mb-1">Spacing</div>
                    <div className="text-lg font-bold">{analysis.swale.spacing}'</div>
                  </div>
                </div>

                <Separator />

                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Total length needed:</span>{' '}
                    {analysis.swale.totalLength}' of swale
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Capture capacity:</span> ~
                    {analysis.swale.captureGallons.toLocaleString()} gal per heavy rain
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Placement Guidelines */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Swale Placement Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <span className="font-medium">On contour:</span> Use A-frame level or laser to
                    mark level lines
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <span className="font-medium">Upslope of plantings:</span> Trees benefit from
                    infiltrated water
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <span className="font-medium">Avoid slopes &gt;30%:</span> Too steep for
                    effective swales
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <span className="font-medium">Overflow spillways:</span> Direct excess to next
                    swale downhill
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Berm Planting */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Berm Planting Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {BERM_PLANTS.map((plant, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded text-xs">
                    <span className="text-lg">{plant.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{plant.name}</div>
                      <div className="text-[10px] text-muted-foreground">{plant.benefit}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {plant.layer}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Greywater Tab */}
          <TabsContent value="greywater" className="m-0 p-4 space-y-4">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <TrendingDown className="h-5 w-5" />
                  Greywater Recycling
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300 text-xs">
                  Reuse household water for irrigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="greywater" className="text-xs">
                    Daily Greywater Available (gallons)
                  </Label>
                  <Input
                    id="greywater"
                    type="number"
                    value={greywarerDaily}
                    onChange={(e) => setGreywaterDaily(Number(e.target.value))}
                    className="h-9"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Average household: 50-100 gal/day from showers, sinks, laundry
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700 dark:text-purple-300">Weekly Supply:</span>
                    <span className="font-mono font-semibold text-purple-900 dark:text-purple-100">
                      {(greywarerDaily * 7).toFixed(0)} gal
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700 dark:text-purple-300">% of Water Needs:</span>
                    <span className="font-mono font-semibold text-purple-900 dark:text-purple-100">
                      {((greywarerDaily * 7) / analysis.weeklyDemand * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Greywater Sources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Safe Greywater Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">
                      Shower/Bath
                    </div>
                    <div className="text-green-700 dark:text-green-300">
                      Best source - use biodegradable soap
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">
                      Bathroom Sink
                    </div>
                    <div className="text-green-700 dark:text-green-300">
                      Good source - avoid harsh chemicals
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">
                      Washing Machine
                    </div>
                    <div className="text-green-700 dark:text-green-300">
                      Good - use plant-safe detergent
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900 dark:text-red-100">
                      Kitchen Sink / Dishwasher
                    </div>
                    <div className="text-red-700 dark:text-red-300">
                      Avoid - high grease and food particles
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-900 dark:text-red-100">Toilet</div>
                    <div className="text-red-700 dark:text-red-300">
                      Blackwater - requires separate treatment
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Greywater System Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded">
                  <div className="font-semibold text-sm mb-2">1. Laundry-to-Landscape</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Simplest system - divert washing machine to mulch basins
                  </p>
                  <div className="text-xs">
                    <span className="text-green-600 font-medium">Cost:</span> $200-500 |
                    <span className="text-green-600 font-medium ml-2">Permits:</span> Usually not
                    required
                  </div>
                </div>

                <div className="p-3 border rounded">
                  <div className="font-semibold text-sm mb-2">2. Branched Drain</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Gravity-fed system splits flow to multiple outlets
                  </p>
                  <div className="text-xs">
                    <span className="text-amber-600 font-medium">Cost:</span> $500-2000 |
                    <span className="text-amber-600 font-medium ml-2">Permits:</span> May be required
                  </div>
                </div>

                <div className="p-3 border rounded">
                  <div className="font-semibold text-sm mb-2">3. Pumped System</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Surge tank with pump for uphill irrigation
                  </p>
                  <div className="text-xs">
                    <span className="text-red-600 font-medium">Cost:</span> $2000-5000 |
                    <span className="text-red-600 font-medium ml-2">Permits:</span> Usually required
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Greywater Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Use immediately - don't store longer than 24 hours
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Subsurface irrigation only - avoid spray/surface application
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Mulch basins help filter and absorb water
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Don't irrigate root vegetables - use for trees/shrubs/non-edible parts
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Check local codes - regulations vary by jurisdiction
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

// Helper Functions & Data

interface WaterAnalysis {
  resilienceScore: number
  weeklySupply: number
  weeklyDemand: number
  waterBalance: number
  sources: { name: string; capacity: number; icon: any }[]
  recommendations: string[]
  annualCatchment: number
  weeklyCatchment: number
  perInchCatchment: number
  estimatedRainfall: number
  minStorageGallons: number
  optimalStorageGallons: number
  swale: {
    width: number
    depth: number
    spacing: number
    totalLength: number
    captureGallons: number
  }
}

function analyzeWaterManagement(
  beds: GardenBed[],
  siteData?: SiteData | null,
  roofArea: number = 1500,
  annualRainfall: number = 40,
  greywarerDaily: number = 50
): WaterAnalysis {
  // Calculate water demand from plants
  const totalPlants = beds.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0)
  const weeklyDemand = totalPlants * 2 // Rough estimate: 2 gal per plant per week

  // Calculate water supply sources
  const sources: { name: string; capacity: number; icon: any }[] = []

  // Municipal/well water (assumed available but not preferred)
  if (siteData?.waterSource === 'municipal' || siteData?.waterSource === 'well') {
    sources.push({
      name: siteData.waterSource === 'municipal' ? 'Municipal Water' : 'Well Water',
      capacity: weeklyDemand, // Assume sufficient
      icon: Droplets,
    })
  }

  // Rainwater catchment
  const perInchCatchment = roofArea * 0.623 // 1" rain on 1 sq ft = 0.623 gallons
  const annualCatchment = perInchCatchment * annualRainfall * 0.9 // 90% efficiency
  const weeklyCatchment = annualCatchment / 52

  if (siteData?.waterSource === 'rain' || roofArea > 0) {
    sources.push({
      name: 'Rainwater Catchment',
      capacity: weeklyCatchment,
      icon: CloudRain,
    })
  }

  // Greywater
  if (greywarerDaily > 0) {
    sources.push({
      name: 'Greywater Recycling',
      capacity: greywarerDaily * 7,
      icon: TrendingDown,
    })
  }

  const weeklySupply = sources.reduce((sum, s) => sum + s.capacity, 0)
  const waterBalance = weeklySupply - weeklyDemand

  // Calculate resilience score
  const hasRainwater = sources.some((s) => s.name === 'Rainwater Catchment')
  const hasGreywater = sources.some((s) => s.name === 'Greywater Recycling')
  const hasDiverseSources = sources.length >= 2
  const hasPositiveBalance = waterBalance >= 0

  let resilienceScore = 20 // Base score
  if (hasRainwater) resilienceScore += 30
  if (hasGreywater) resilienceScore += 25
  if (hasDiverseSources) resilienceScore += 15
  if (hasPositiveBalance) resilienceScore += 10

  // Recommendations
  const recommendations: string[] = []
  if (!hasRainwater) {
    recommendations.push('Install rainwater catchment - capture free water from your roof')
  }
  if (!hasGreywater && weeklyDemand > 200) {
    recommendations.push('Consider greywater recycling for large garden water needs')
  }
  if (waterBalance < 0) {
    recommendations.push(
      `Add ${Math.abs(waterBalance).toFixed(0)} gal/week capacity or reduce plantings`
    )
  }
  if (recommendations.length === 0) {
    recommendations.push('Excellent water management! Monitor during peak summer demand')
  }

  // Estimate rainfall based on location (simplified)
  const estimatedRainfall = siteData?.location
    ? deriveClimateFromLocation(siteData.location.lat, siteData.location.lng) === 'humid'
      ? 50
      : deriveClimateFromLocation(siteData.location.lat, siteData.location.lng) === 'dry'
      ? 15
      : 35
    : 40

  // Storage recommendations
  const minStorageGallons = weeklyDemand * 1 // 1 week buffer
  const optimalStorageGallons = weeklyDemand * 4 // 4 week buffer

  // Swale sizing (simplified)
  const totalArea = beds.reduce((sum, bed) => sum + (bed.width || 0) * (bed.height || 0), 0)
  const swale = {
    width: 24, // inches
    depth: 12, // inches
    spacing: 30, // feet between swales
    totalLength: Math.ceil(totalArea / 30), // rough estimate
    captureGallons: Math.ceil((24 * 12 * totalArea) / 231), // cubic inches to gallons
  }

  return {
    resilienceScore: Math.min(100, resilienceScore),
    weeklySupply,
    weeklyDemand,
    waterBalance,
    sources,
    recommendations,
    annualCatchment,
    weeklyCatchment,
    perInchCatchment,
    estimatedRainfall,
    minStorageGallons,
    optimalStorageGallons,
    swale,
  }
}

const BERM_PLANTS = [
  {
    name: 'Fruit Trees',
    icon: '🍎',
    benefit: 'Deep roots utilize infiltrated water',
    layer: 'Canopy',
  },
  {
    name: 'Nitrogen Fixers',
    icon: '🌿',
    benefit: 'Build soil while using water (clover, vetch)',
    layer: 'Ground',
  },
  {
    name: 'Deep-Rooted Perennials',
    icon: '🌾',
    benefit: 'Break compaction, mine nutrients',
    layer: 'Herbaceous',
  },
  {
    name: 'Berries',
    icon: '🫐',
    benefit: 'High value crops on berm edge',
    layer: 'Shrub',
  },
]
