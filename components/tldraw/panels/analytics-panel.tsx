'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Sun,
  Leaf,
  DollarSign,
  Calendar,
  Target,
  Award,
  AlertCircle,
  Info,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'
import { analyzeCompanionPlanting } from '@/lib/algorithms/companion-planting-engine'
import {
  PLANT_YIELD_DATABASE,
  calculateWaterNeeds,
  calculateExpectedYield,
  calculateMarketValue,
} from '@/lib/data/plant-yield-data'
import { deriveClimateFromLocation } from '@/lib/climate/climate-utils'
import { cn } from '@/lib/utils'

export interface SiteData {
  usdaZone?: string
  frostDates?: {
    lastFrost: Date
    firstFrost: Date
  } | null
  location?: {
    lat: number
    lng: number
  } | null
  surfaceType?: string
  waterSource?: string
}

interface AnalyticsPanelProps {
  /** Current garden beds */
  gardenBeds: GardenBed[]
  /** Site data from wizard */
  siteData?: SiteData | null
  /** Garden settings */
  settings?: {
    location?: string
    zone?: string
    soilType?: string
    waterSource?: string
  }
}

/**
 * AnalyticsPanel - Comprehensive garden analytics and insights
 *
 * Features:
 * - Overall garden score
 * - Yield predictions
 * - Resource efficiency (water, space, sunlight)
 * - Biodiversity metrics
 * - Recommendations for optimization
 * - Cost estimates
 */
export function AnalyticsPanel({
  gardenBeds,
  siteData = null,
  settings = {},
}: AnalyticsPanelProps) {
  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    return calculateGardenAnalytics(gardenBeds, siteData)
  }, [gardenBeds, siteData])

  const hasContent = gardenBeds.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Garden Analytics
          </h2>
          <Badge
            variant="outline"
            className={cn(
              analytics.overallScore >= 80 ? 'border-green-500 text-green-700' :
              analytics.overallScore >= 60 ? 'border-yellow-500 text-yellow-700' :
              'border-red-500 text-red-700'
            )}
          >
            {analytics.overallScore}/100
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time insights and optimization suggestions
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {!hasContent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Add beds and plants to see analytics
                </p>
              </CardContent>
            </Card>
          )}

          {hasContent && (
            <>
              {/* Overall Score */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Overall Garden Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {analytics.overallScore}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {analytics.overallScore >= 90 && '🏆 Exceptional! Professional-level design'}
                      {analytics.overallScore >= 80 && analytics.overallScore < 90 && '🌟 Excellent design with great optimization'}
                      {analytics.overallScore >= 70 && analytics.overallScore < 80 && '✅ Good design, some room for improvement'}
                      {analytics.overallScore >= 60 && analytics.overallScore < 70 && '⚠️ Decent start, needs optimization'}
                      {analytics.overallScore < 60 && '📝 Early stage, follow recommendations'}
                    </p>
                  </div>
                  <Progress value={analytics.overallScore} className="h-2" />
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={<Leaf className="h-4 w-4" />}
                  label="Biodiversity"
                  value={analytics.biodiversity.score}
                  max={100}
                  suffix="%"
                  color="green"
                />
                <MetricCard
                  icon={<Droplets className="h-4 w-4" />}
                  label="Water Efficiency"
                  value={analytics.waterEfficiency.score}
                  max={100}
                  suffix="%"
                  color="blue"
                />
                <MetricCard
                  icon={<Sun className="h-4 w-4" />}
                  label="Space Utilization"
                  value={analytics.spaceUtilization.score}
                  max={100}
                  suffix="%"
                  color="yellow"
                />
                <MetricCard
                  icon={<Target className="h-4 w-4" />}
                  label="Companion Score"
                  value={analytics.companionScore}
                  max={100}
                  suffix="%"
                  color="purple"
                />
              </div>

              {/* Yield Predictions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Yield Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estimated Annual Yield</span>
                    <Badge variant="secondary" className="font-mono">
                      {analytics.yieldPredictions.totalLbs.toFixed(0)} lbs
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Value</span>
                    <Badge variant="secondary" className="font-mono">
                      ${analytics.yieldPredictions.marketValue.toFixed(0)}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Top Producers:</p>
                    {analytics.yieldPredictions.topCrops.map((crop, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          {crop.icon} {crop.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {crop.yield.toFixed(0)} lbs
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Water Management */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    Water Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Water Needs</span>
                    <Badge variant="secondary" className="font-mono">
                      {analytics.waterEfficiency.dailyGallons.toFixed(1)} gal
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Weekly Total</span>
                    <Badge variant="secondary" className="font-mono">
                      {(analytics.waterEfficiency.dailyGallons * 7).toFixed(0)} gal
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium">By Category:</p>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">💧 Low Water</span>
                        <Badge variant="outline" className="text-xs">
                          {analytics.waterEfficiency.byCategory.low}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">💧💧 Medium Water</span>
                        <Badge variant="outline" className="text-xs">
                          {analytics.waterEfficiency.byCategory.medium}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">💧💧💧 High Water</span>
                        <Badge variant="outline" className="text-xs">
                          {analytics.waterEfficiency.byCategory.high}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Biodiversity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Biodiversity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plant Varieties</span>
                    <Badge variant="secondary" className="font-mono">
                      {analytics.biodiversity.uniqueSpecies}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plant Families</span>
                    <Badge variant="secondary" className="font-mono">
                      {analytics.biodiversity.plantFamilies}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Categories:</p>
                    {Object.entries(analytics.biodiversity.categories).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground capitalize">{category}</span>
                        <Badge variant="outline" className="text-xs">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {analytics.recommendations.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <Info className="h-4 w-4" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analytics.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-blue-900 dark:text-blue-100">
                        <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                        <p>{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Stats Grid */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Garden Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Beds</p>
                      <p className="font-semibold">{analytics.stats.totalBeds}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Plants</p>
                      <p className="font-semibold">{analytics.stats.totalPlants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Growing Area</p>
                      <p className="font-semibold">{analytics.stats.totalArea} sq ft</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Planting Density</p>
                      <p className="font-semibold">{analytics.stats.density.toFixed(1)}/sq ft</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: number
  max: number
  suffix?: string
  color: 'green' | 'blue' | 'yellow' | 'purple' | 'red'
}

function MetricCard({ icon, label, value, max, suffix = '', color }: MetricCardProps) {
  const percentage = (value / max) * 100

  const colorClasses = {
    green: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20',
    blue: 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/20',
    yellow: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20',
    purple: 'text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-950/20',
    red: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20',
  }

  return (
    <Card className={colorClasses[color]}>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className={cn('p-2 rounded-lg bg-background')}>{icon}</div>
          <Badge variant="secondary" className="font-mono">
            {value}{suffix}
          </Badge>
        </div>
        <div>
          <p className="text-xs font-medium">{label}</p>
          <Progress value={percentage} className="h-1 mt-1" />
        </div>
      </CardContent>
    </Card>
  )
}

// Analytics calculation logic
function calculateGardenAnalytics(beds: GardenBed[], siteData?: SiteData | null) {
  // Derive climate from location (instead of hardcoding 'moderate')
  const climate = siteData?.location
    ? deriveClimateFromLocation(siteData.location.lat, siteData.location.lng)
    : 'moderate' // Fallback to moderate if no location

  const totalBeds = beds.length
  const totalPlants = beds.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0)
  const totalArea = beds.reduce((sum, bed) => {
    const width = bed.width || 100
    const height = bed.height || 100
    return sum + (width * height) / 144 // Convert to sq ft
  }, 0)

  // Biodiversity
  const plantIds = new Set<string>()
  const categories = new Map<string, number>()
  beds.forEach(bed => {
    bed.plants?.forEach(plant => {
      plantIds.add(plant.plantId)
      const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)
      if (plantInfo) {
        categories.set(plantInfo.category, (categories.get(plantInfo.category) || 0) + 1)
      }
    })
  })

  const biodiversity = {
    uniqueSpecies: plantIds.size,
    plantFamilies: new Set(Array.from(plantIds).map(id => {
      const plant = PLANT_LIBRARY.find(p => p.id === id)
      return plant?.category || 'unknown'
    })).size,
    categories: Object.fromEntries(categories),
    score: Math.min(100, (plantIds.size / Math.max(1, totalPlants)) * 100 + plantIds.size * 5)
  }

  // Water efficiency - using accurate calculations
  const waterNeeds = { low: 0, medium: 0, high: 0 }
  let weeklyGallons = 0
  beds.forEach(bed => {
    bed.plants?.forEach(plant => {
      const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)
      if (plantInfo) {
        waterNeeds[plantInfo.requirements.water]++
        // Use accurate water data with derived climate
        const plantWaterPerWeek = calculateWaterNeeds(plant.plantId, climate)
        weeklyGallons += plantWaterPerWeek
      }
    })
  })

  const dailyGallons = weeklyGallons / 7

  const waterEfficiency = {
    dailyGallons,
    weeklyGallons,
    byCategory: waterNeeds,
    score: Math.min(100, 100 - (waterNeeds.high / Math.max(1, totalPlants)) * 30)
  }

  // Yield predictions - using accurate data
  const yieldByPlant = new Map<string, { pounds: number; value: number; count: number }>()

  beds.forEach(bed => {
    bed.plants?.forEach(plant => {
      const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)
      if (plantInfo) {
        // Calculate days since planting (default to 120 days for mature plants)
        const daysSincePlanting = plant.plantedDate
          ? Math.floor((Date.now() - new Date(plant.plantedDate).getTime()) / (1000 * 60 * 60 * 24))
          : 120

        // Get accurate yield for this plant
        const yieldLbs = calculateExpectedYield(plant.plantId, daysSincePlanting, 1)
        const value = calculateMarketValue(plant.plantId, yieldLbs)

        const existing = yieldByPlant.get(plant.plantId) || { pounds: 0, value: 0, count: 0 }
        yieldByPlant.set(plant.plantId, {
          pounds: existing.pounds + yieldLbs,
          value: existing.value + value,
          count: existing.count + 1,
        })
      }
    })
  })

  const totalYield = Array.from(yieldByPlant.values()).reduce((sum, data) => sum + data.pounds, 0)
  const totalValue = Array.from(yieldByPlant.values()).reduce((sum, data) => sum + data.value, 0)

  const topCrops = Array.from(yieldByPlant.entries())
    .map(([plantId, data]) => {
      const plant = PLANT_LIBRARY.find(p => p.id === plantId)
      return {
        plantId,
        name: plant?.name || plantId,
        icon: plant?.icon || '🌱',
        yield: data.pounds,
        value: data.value,
        count: data.count,
      }
    })
    .sort((a, b) => b.yield - a.yield)
    .slice(0, 5)

  const yieldPredictions = {
    totalLbs: totalYield,
    marketValue: totalValue,
    topCrops
  }

  // Space utilization
  const density = totalPlants / Math.max(1, totalArea)
  const spaceUtilization = {
    score: Math.min(100, density * 30),
    density
  }

  // Companion score
  const companionAnalysis = analyzeCompanionPlanting(beds)
  const companionScore = companionAnalysis.score

  // Overall score
  const overallScore = Math.round(
    (biodiversity.score * 0.25 +
    waterEfficiency.score * 0.2 +
    spaceUtilization.score * 0.2 +
    companionScore * 0.35)
  )

  // Recommendations - Enhanced with site data
  const recommendations: string[] = []

  // Biodiversity recommendations
  if (biodiversity.uniqueSpecies < 10) {
    recommendations.push('Add more plant varieties to increase biodiversity and resilience')
  }

  // Water recommendations based on water source
  if (waterNeeds.high > totalPlants * 0.4) {
    if (siteData?.waterSource === 'rain') {
      recommendations.push('High water plants detected - consider adding rain barrels or swales')
    } else if (siteData?.waterSource === 'none') {
      recommendations.push('⚠️ Many high-water plants without water source - switch to drought-tolerant varieties')
    } else {
      recommendations.push('Consider drought-tolerant alternatives to reduce water usage')
    }
  }

  // Density recommendations
  if (density < 0.5) {
    recommendations.push('Increase planting density to maximize space utilization')
  } else if (density > 4) {
    recommendations.push('⚠️ Overcrowded - reduce density to prevent competition and disease')
  }

  // Companion planting
  if (companionScore < 70) {
    recommendations.push('Review companion planting suggestions to improve plant relationships')
  }

  // Zone-specific recommendations
  if (siteData?.usdaZone) {
    const zoneNum = parseInt(siteData.usdaZone.replace(/[a-z]/i, ''))
    if (zoneNum <= 6) {
      recommendations.push(`Zone ${siteData.usdaZone}: Focus on cold-hardy varieties and season extension`)
    } else if (zoneNum >= 9) {
      recommendations.push(`Zone ${siteData.usdaZone}: Take advantage of year-round growing potential`)
    }
  }

  // Frost date recommendations
  if (siteData?.frostDates) {
    const today = new Date()
    const lastFrost = siteData.frostDates.lastFrost
    const firstFrost = siteData.frostDates.firstFrost
    const growingSeason = Math.round((firstFrost.getTime() - lastFrost.getTime()) / (1000 * 60 * 60 * 24))

    if (growingSeason < 150) {
      recommendations.push(`Short ${growingSeason}-day season - prioritize fast-maturing varieties`)
    } else if (growingSeason > 240) {
      recommendations.push(`Long ${growingSeason}-day season - excellent for succession planting`)
    }
  }

  // Surface type recommendations
  if (siteData?.surfaceType === 'hard' || siteData?.surfaceType === 'concrete') {
    recommendations.push('Hard surface detected - ensure adequate soil depth (12-18") for root crops')
  }

  return {
    overallScore,
    biodiversity,
    waterEfficiency,
    spaceUtilization,
    yieldPredictions,
    companionScore,
    recommendations,
    stats: {
      totalBeds,
      totalPlants,
      totalArea,
      density
    }
  }
}
