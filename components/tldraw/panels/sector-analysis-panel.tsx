/**
 * Sector Analysis Panel - External energies affecting the site
 *
 * Core permaculture concept: analyze wild energies entering site
 * - Sun paths (summer/winter)
 * - Wind direction and intensity
 * - Fire risk and firebreak needs
 * - Wildlife patterns (deer, rabbits, pollinators)
 * - Noise sources and buffering
 * - Views (desirable and undesirable)
 *
 * Provides recommendations for working with these energies
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Compass,
  Wind,
  Flame,
  Rabbit,
  Sun,
  Eye,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Navigation,
  ChevronRight,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { CompleteSiteContext, SiteData } from '@/lib/types/site-context'
import { cn } from '@/lib/utils'

interface SectorAnalysisPanelProps {
  gardenBeds: GardenBed[]
  siteData?: SiteData | null
  siteContext?: CompleteSiteContext | null
}

/**
 * Sector Analysis Panel
 */
export function SectorAnalysisPanel({ gardenBeds, siteData, siteContext }: SectorAnalysisPanelProps) {
  const [selectedSector, setSelectedSector] = useState<string>('overview')

  // Analyze site for sector considerations
  const analysis = useMemo(() => analyzeSectors(gardenBeds, siteData, siteContext), [
    gardenBeds,
    siteData,
    siteContext,
  ])

  const hasLocation = !!siteData?.location
  const hasSectorData = !!siteContext?.sectors

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Compass className="h-5 w-5 text-purple-600" />
            Sector Analysis
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            {analysis.totalSectors} sectors
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Analyze external energies and wild forces affecting your site
        </p>
      </div>

      {!hasLocation && (
        <div className="p-4">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <Compass className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">Location required for sector analysis</p>
              <p className="text-xs text-muted-foreground">
                Complete the wizard to analyze sun paths, wind, and other site factors
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasLocation && (
        <Tabs value={selectedSector} onValueChange={setSelectedSector} className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b grid grid-cols-7">
            <TabsTrigger value="overview" title="Overview">
              <Compass className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="sun" title="Sun">
              <Sun className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="wind" title="Wind">
              <Wind className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="fire" title="Fire">
              <Flame className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="wildlife" title="Wildlife">
              <Rabbit className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="noise" title="Noise">
              <Volume2 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="views" title="Views">
              <Eye className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 p-4 space-y-4">
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-purple-900 dark:text-purple-100">
                    <Compass className="h-5 w-5" />
                    Sector Map Overview
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300 text-xs">
                    External energies entering your site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <SectorCard
                      icon={Sun}
                      label="Sun"
                      status={analysis.sun.status}
                      onClick={() => setSelectedSector('sun')}
                    />
                    <SectorCard
                      icon={Wind}
                      label="Wind"
                      status={analysis.wind.status}
                      onClick={() => setSelectedSector('wind')}
                    />
                    <SectorCard
                      icon={Flame}
                      label="Fire"
                      status={analysis.fire.status}
                      onClick={() => setSelectedSector('fire')}
                    />
                    <SectorCard
                      icon={Rabbit}
                      label="Wildlife"
                      status={analysis.wildlife.status}
                      onClick={() => setSelectedSector('wildlife')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Key Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Priority Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sun Tab */}
            <TabsContent value="sun" className="m-0 p-4 space-y-4">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                    <Sun className="h-5 w-5" />
                    Sun Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-700 dark:text-yellow-300">Latitude:</span>
                      <span className="font-mono text-yellow-900 dark:text-yellow-100">
                        {siteData?.location?.lat.toFixed(2)}°
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-700 dark:text-yellow-300">Summer Path:</span>
                      <span className="text-yellow-900 dark:text-yellow-100 text-xs">
                        High arc, long days
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-700 dark:text-yellow-300">Winter Path:</span>
                      <span className="text-yellow-900 dark:text-yellow-100 text-xs">Low arc, short days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Sun Sector Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.sun.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wind Tab */}
            <TabsContent value="wind" className="m-0 p-4 space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Wind className="h-5 w-5" />
                    Wind Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {siteContext?.sectors?.wind ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Prevailing Direction:</span>
                        <Badge className="bg-blue-600 text-white">
                          {siteContext.sectors.wind.prevailingDirection}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Intensity:</span>
                        <span className="capitalize text-blue-900 dark:text-blue-100">
                          {siteContext.sectors.wind.intensity}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Wind data not yet configured. Add wind information in site settings.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Wind Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.wind.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fire Tab */}
            <TabsContent value="fire" className="m-0 p-4 space-y-4">
              <Card
                className={cn(
                  'bg-gradient-to-br border-red-200',
                  analysis.fire.status === 'high'
                    ? 'from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30'
                    : 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30'
                )}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-red-900 dark:text-red-100">
                    <Flame className="h-5 w-5" />
                    Fire Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700 dark:text-red-300">Risk Level:</span>
                    <Badge
                      className={cn(
                        'capitalize',
                        analysis.fire.status === 'high' && 'bg-red-600 text-white',
                        analysis.fire.status === 'medium' && 'bg-orange-500 text-white',
                        analysis.fire.status === 'low' && 'bg-green-600 text-white'
                      )}
                    >
                      {analysis.fire.status}
                    </Badge>
                  </div>
                  {analysis.fire.status !== 'low' && (
                    <div className="flex items-start gap-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-xs">
                      <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-800 dark:text-red-200">
                        Firebreak zones and defensible space recommended
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Fire Safety Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.fire.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wildlife Tab */}
            <TabsContent value="wildlife" className="m-0 p-4 space-y-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
                    <Rabbit className="h-5 w-5" />
                    Wildlife Sector
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <WildlifeBadge label="Deer" present={analysis.wildlife.deer} />
                    <WildlifeBadge label="Rabbits" present={analysis.wildlife.rabbits} />
                    <WildlifeBadge label="Birds" present={analysis.wildlife.birds} />
                    <WildlifeBadge label="Pollinators" present={analysis.wildlife.pollinators !== 'low'} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Wildlife Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.wildlife.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Noise Tab */}
            <TabsContent value="noise" className="m-0 p-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-600" />
                    Noise Sector
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Buffer unwanted sounds with plants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.noise.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-gray-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Views Tab */}
            <TabsContent value="views" className="m-0 p-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4 text-indigo-600" />
                    View Sector
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Frame good views, screen bad ones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.views.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-indigo-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  )
}

// Helper Components

interface SectorCardProps {
  icon: React.ElementType
  label: string
  status: 'low' | 'medium' | 'high'
  onClick: () => void
}

function SectorCard({ icon: Icon, label, status, onClick }: SectorCardProps) {
  const statusColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-2 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium">{label}</div>
        <Badge className={cn('text-[10px] h-4 px-1', statusColors[status])}>{status}</Badge>
      </div>
    </button>
  )
}

function WildlifeBadge({ label, present }: { label: string; present: boolean }) {
  return (
    <div
      className={cn(
        'px-2 py-1 rounded text-xs text-center',
        present
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      )}
    >
      {label}
    </div>
  )
}

// Analysis Logic

interface SectorAnalysis {
  totalSectors: number
  sun: {
    status: 'low' | 'medium' | 'high'
    recommendations: string[]
  }
  wind: {
    status: 'low' | 'medium' | 'high'
    recommendations: string[]
  }
  fire: {
    status: 'low' | 'medium' | 'high'
    recommendations: string[]
  }
  wildlife: {
    deer: boolean
    rabbits: boolean
    birds: boolean
    pollinators: 'low' | 'medium' | 'high'
    recommendations: string[]
  }
  noise: {
    recommendations: string[]
  }
  views: {
    recommendations: string[]
  }
  recommendations: string[]
}

function analyzeSectors(
  beds: GardenBed[],
  siteData?: SiteData | null,
  siteContext?: CompleteSiteContext | null
): SectorAnalysis {
  const lat = siteData?.location?.lat || 0
  const absLat = Math.abs(lat)

  // Sun analysis
  const sunStatus: 'low' | 'medium' | 'high' = absLat > 50 ? 'low' : absLat > 35 ? 'medium' : 'high'
  const sunRecs = [
    'Place heat-loving crops (tomatoes, peppers) on south-facing areas',
    'Use shade from buildings/trees for cool-season crops',
    'Plan for seasonal sun angle changes',
    absLat > 45 && 'Consider season extension structures for short growing season',
  ].filter(Boolean) as string[]

  // Wind analysis
  const windData = siteContext?.sectors?.wind
  const windStatus: 'low' | 'medium' | 'high' =
    windData?.intensity === 'strong' || windData?.intensity === 'extreme'
      ? 'high'
      : windData?.intensity === 'moderate'
      ? 'medium'
      : 'low'
  const windRecs = [
    'Plant windbreaks perpendicular to prevailing wind',
    'Use hedgerows of native shrubs for year-round protection',
    'Create microclimates with wind protection',
    windStatus === 'high' && 'Consider structural windbreaks (fences, walls)',
  ].filter(Boolean) as string[]

  // Fire analysis
  const fireData = siteContext?.sectors?.fire
  const fireStatus: 'low' | 'medium' | 'high' =
    fireData?.riskLevel === 'extreme' || fireData?.riskLevel === 'high'
      ? 'high'
      : fireData?.riskLevel === 'moderate'
      ? 'medium'
      : 'low'
  const fireRecs = [
    'Create 30ft defensible space with low-fuel plants',
    'Use fire-resistant species near structures',
    'Maintain green, irrigated zones as firebreaks',
    fireStatus === 'high' && 'Consider gravel paths as fire barriers',
    fireStatus === 'high' && 'Remove dead wood and dry vegetation regularly',
  ].filter(Boolean) as string[]

  // Wildlife analysis
  const wildlifeData = siteContext?.sectors?.wildlife
  const wildlifeRecs = [
    wildlifeData?.deer && 'Install 8ft deer fencing or use deer-resistant plants',
    wildlifeData?.rabbits && 'Use 3ft chicken wire around vulnerable crops',
    'Plant native flowers to attract pollinators',
    'Create habitat corridors for beneficial wildlife',
    wildlifeData?.pollinators !== 'high' && 'Add pollinator plants (milkweed, echinacea, etc.)',
  ].filter(Boolean) as string[]

  // Noise recommendations
  const noiseRecs = [
    'Use dense evergreen hedges to buffer noise',
    'Create berm + planting combinations for maximum reduction',
    'Position quiet sitting areas away from noise sources',
    'Use water features to mask unwanted sounds',
  ]

  // Views recommendations
  const viewsRecs = [
    'Frame desirable views with strategic tree placement',
    'Use screening plants to block undesirable views',
    'Keep sight lines open to important features',
    'Consider seasonal views (deciduous vs evergreen)',
  ]

  // Overall recommendations
  const recommendations = []
  if (sunStatus === 'high') recommendations.push('Maximize sun exposure with proper plant placement')
  if (windStatus === 'high') recommendations.push('Priority: Install windbreaks before planting')
  if (fireStatus === 'high') recommendations.push('Critical: Create defensible space immediately')
  if (wildlifeData?.deer) recommendations.push('Protect vulnerable plants from deer browse')

  return {
    totalSectors: 6,
    sun: { status: sunStatus, recommendations: sunRecs },
    wind: { status: windStatus, recommendations: windRecs },
    fire: { status: fireStatus, recommendations: fireRecs },
    wildlife: {
      deer: wildlifeData?.deer || false,
      rabbits: wildlifeData?.rabbits || false,
      birds: wildlifeData?.birds || false,
      pollinators: wildlifeData?.pollinators || 'medium',
      recommendations: wildlifeRecs,
    },
    noise: { recommendations: noiseRecs },
    views: { recommendations: viewsRecs },
    recommendations: recommendations.length > 0 ? recommendations : ['Complete site assessment for personalized recommendations'],
  }
}
