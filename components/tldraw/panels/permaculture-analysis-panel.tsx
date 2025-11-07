'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Leaf,
  Droplets,
  TreePine,
  Waves,
  Recycle,
  Bug,
  Users,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'
import { SiteData } from './analytics-panel'
import { cn } from '@/lib/utils'

interface PermacultureAnalysisPanelProps {
  gardenBeds: GardenBed[]
  siteData?: SiteData | null
}

/**
 * PermacultureAnalysisPanel - Holistic permaculture system analysis
 *
 * Evaluates design based on permaculture principles:
 * - Care for Earth (soil, water, biodiversity)
 * - Care for People (yield, aesthetics, accessibility)
 * - Fair Share (resource cycling, efficiency)
 *
 * Integrates ALL wizard data:
 * - Location → climate zones, sun patterns
 * - Zone → plant hardiness, frost dates
 * - Surface type → water management strategy
 * - Water source → irrigation design
 */
export function PermacultureAnalysisPanel({ gardenBeds, siteData }: PermacultureAnalysisPanelProps) {
  const analysis = useMemo(() => {
    return analyzePermacultureDesign(gardenBeds, siteData)
  }, [gardenBeds, siteData])

  const hasContent = gardenBeds.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Permaculture Design
          </h2>
          {analysis.overallScore && (
            <Badge
              variant="outline"
              className={cn(
                'font-mono text-sm',
                analysis.overallScore >= 80 ? 'border-green-500 text-green-700' :
                analysis.overallScore >= 60 ? 'border-yellow-500 text-yellow-700' :
                'border-red-500 text-red-700'
              )}
            >
              {analysis.overallScore}/100
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Holistic analysis based on permaculture principles
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!hasContent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Start designing your permaculture system
                </p>
                <p className="text-xs text-muted-foreground">
                  Add beds and plants to see holistic permaculture analysis
                </p>
              </CardContent>
            </Card>
          )}

          {hasContent && (
            <>
              {/* Overall Permaculture Score */}
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-purple-900 dark:text-purple-100">
                    <Target className="h-5 w-5" />
                    Permaculture Design Score
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    {analysis.overallScore >= 80 && 'Excellent regenerative design!'}
                    {analysis.overallScore >= 60 && analysis.overallScore < 80 && 'Good foundation, room for improvement'}
                    {analysis.overallScore < 60 && 'Needs more permaculture principles'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={analysis.overallScore} className="h-3 mb-2" />
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Based on {analysis.principlesApplied.length} of 12 permaculture principles
                  </p>
                </CardContent>
              </Card>

              {/* Care for Earth */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    Care for Earth
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Soil health, water wisdom, biodiversity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Soil Building */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Soil Building</span>
                      <Badge variant={analysis.soilBuilding.score >= 70 ? 'default' : 'secondary'}>
                        {analysis.soilBuilding.score}%
                      </Badge>
                    </div>
                    <Progress value={analysis.soilBuilding.score} className="h-2" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      {analysis.soilBuilding.hasNitrogenFixers ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span>
                        {analysis.soilBuilding.hasNitrogenFixers
                          ? `${analysis.soilBuilding.nitrogenFixerCount} nitrogen-fixing plants building soil`
                          : 'Add legumes (peas, beans) to fix nitrogen naturally'}
                      </span>
                    </div>
                  </div>

                  {/* Water Management */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Water Wisdom</span>
                      <Badge variant={analysis.waterManagement.score >= 70 ? 'default' : 'secondary'}>
                        {analysis.waterManagement.score}%
                      </Badge>
                    </div>
                    <Progress value={analysis.waterManagement.score} className="h-2" />
                    <div className="space-y-1">
                      {analysis.waterManagement.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Droplets className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Biodiversity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Biodiversity</span>
                      <Badge variant={analysis.biodiversity.score >= 70 ? 'default' : 'secondary'}>
                        {analysis.biodiversity.score}%
                      </Badge>
                    </div>
                    <Progress value={analysis.biodiversity.score} className="h-2" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Bug className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {analysis.biodiversity.uniqueSpecies} species • {analysis.biodiversity.plantFamilies} families
                        {analysis.biodiversity.hasPollinatorPlants && ' • Pollinator-friendly'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Care for People */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Care for People
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Yield, accessibility, aesthetics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Productive Yield */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Productive Yield</span>
                      <span className="text-xs text-muted-foreground">
                        ~{analysis.productivity.estimatedYieldLbs} lbs/season
                      </span>
                    </div>
                    <Progress value={analysis.productivity.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {analysis.productivity.perennialCount > 0 &&
                        `${analysis.productivity.perennialCount} perennial${analysis.productivity.perennialCount > 1 ? 's' : ''} for long-term yield • `}
                      {analysis.productivity.annualCount} annual crop{analysis.productivity.annualCount > 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Zone Placement */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Zone Placement</span>
                      <Badge variant={analysis.zonePlacement.score >= 70 ? 'default' : 'secondary'}>
                        {analysis.zonePlacement.score}%
                      </Badge>
                    </div>
                    <Progress value={analysis.zonePlacement.score} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {analysis.zonePlacement.advice}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Fair Share (Resource Cycling) */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Recycle className="h-4 w-4 text-amber-600" />
                    Fair Share
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Resource efficiency, cycling, regeneration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Resource Cycling */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Resource Cycling</span>
                      <Badge variant={analysis.resourceCycling.score >= 70 ? 'default' : 'secondary'}>
                        {analysis.resourceCycling.score}%
                      </Badge>
                    </div>
                    <Progress value={analysis.resourceCycling.score} className="h-2" />
                    <div className="space-y-1">
                      {analysis.resourceCycling.strategies.map((strategy, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stacking Functions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Stacking Functions</span>
                      <span className="text-xs text-muted-foreground">
                        {analysis.stackingFunctions} elements
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Elements serving multiple purposes increase system efficiency
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Principles Applied */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Permaculture Principles Applied
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {analysis.principlesApplied.length} of 12 Mollison/Holmgren principles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.principlesApplied.map((principle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs justify-start">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                        {principle}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Sparkles className="h-4 w-4" />
                    Design Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <AlertCircle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-900 dark:text-blue-100">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Site Context */}
              {siteData && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-green-900 dark:text-green-100">
                      <TreePine className="h-4 w-4" />
                      Site Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {siteData.usdaZone && (
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">USDA Zone:</span>
                        <span className="font-mono text-green-900 dark:text-green-100">{siteData.usdaZone}</span>
                      </div>
                    )}
                    {siteData.frostDates && (
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Growing Season:</span>
                        <span className="font-mono text-green-900 dark:text-green-100">
                          {Math.round(
                            (siteData.frostDates.firstFrost.getTime() - siteData.frostDates.lastFrost.getTime()) /
                            (1000 * 60 * 60 * 24)
                          )} days
                        </span>
                      </div>
                    )}
                    {siteData.surfaceType && (
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Surface:</span>
                        <span className="font-mono text-green-900 dark:text-green-100 capitalize">{siteData.surfaceType}</span>
                      </div>
                    )}
                    {siteData.waterSource && (
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-300">Water Source:</span>
                        <span className="font-mono text-green-900 dark:text-green-100 capitalize">{siteData.waterSource}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function analyzePermacultureDesign(beds: GardenBed[], siteData?: SiteData | null) {
  const totalPlants = beds.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0)

  if (totalPlants === 0) {
    return {
      overallScore: 0,
      principlesApplied: [],
      soilBuilding: { score: 0, hasNitrogenFixers: false, nitrogenFixerCount: 0 },
      waterManagement: { score: 0, insights: [] },
      biodiversity: { score: 0, uniqueSpecies: 0, plantFamilies: 0, hasPollinatorPlants: false },
      productivity: { score: 0, estimatedYieldLbs: 0, perennialCount: 0, annualCount: 0 },
      zonePlacement: { score: 0, advice: '' },
      resourceCycling: { score: 0, strategies: [] },
      stackingFunctions: 0,
      recommendations: []
    }
  }

  // Collect all plants
  const allPlants: Array<{ plantId: string; plantInfo: any }> = []
  beds.forEach(bed => {
    bed.plants?.forEach(plant => {
      const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)
      if (plantInfo) {
        allPlants.push({ plantId: plant.plantId, plantInfo })
      }
    })
  })

  // 1. Soil Building Analysis
  const nitrogenFixers = allPlants.filter(p =>
    ['peas', 'beans', 'clover', 'alfalfa'].includes(p.plantId) ||
    p.plantInfo.name.toLowerCase().includes('bean') ||
    p.plantInfo.name.toLowerCase().includes('pea')
  )
  const soilBuildingScore = Math.min(100, (nitrogenFixers.length / Math.max(1, totalPlants)) * 200 + 20)

  // 2. Water Management
  const waterInsights: string[] = []
  if (siteData?.waterSource === 'rain') {
    waterInsights.push('Rainwater harvesting - excellent water wisdom!')
  } else if (siteData?.waterSource === 'spigot') {
    waterInsights.push('Consider adding rain barrels for water independence')
  }

  if (siteData?.surfaceType === 'hard') {
    waterInsights.push('Hard surface: Use deep mulch & swales to capture water')
  }

  const waterScore = 50 + (siteData?.waterSource === 'rain' ? 30 : 0) + (waterInsights.length > 1 ? 20 : 0)

  // 3. Biodiversity
  const uniqueSpecies = new Set(allPlants.map(p => p.plantId)).size
  const plantFamilies = new Set(allPlants.map(p => p.plantInfo.category)).size
  const pollinatorPlants = allPlants.filter(p =>
    p.plantInfo.category === 'herb' || p.plantInfo.category === 'flower'
  ).length
  const biodiversityScore = Math.min(100, (uniqueSpecies * 10) + (plantFamilies * 5) + (pollinatorPlants > 0 ? 20 : 0))

  // 4. Productivity
  const perennials = allPlants.filter(p => p.plantInfo.category === 'tree' || p.plantInfo.category === 'fruit')
  const annuals = allPlants.filter(p => p.plantInfo.category === 'vegetable')
  const estimatedYield = totalPlants * 3 // Simplified: 3 lbs per plant average
  const productivityScore = Math.min(100, (perennials.length * 15) + Math.min(50, annuals.length * 5))

  // 5. Zone Placement
  const zonePlacementScore = 75 // Default moderate score
  const zonePlacementAdvice = 'Place frequently harvested crops (Zone 1) near kitchen, perennials further out (Zone 2-3)'

  // 6. Resource Cycling
  const strategies: string[] = []
  if (nitrogenFixers.length > 0) strategies.push('Nitrogen fixation closes nutrient loop')
  if (totalPlants > 10) strategies.push('Diverse planting creates biomass for composting')
  if (siteData?.waterSource === 'rain') strategies.push('Rainwater cycling reduces external inputs')
  const resourceCyclingScore = Math.min(100, strategies.length * 30)

  // 7. Stacking Functions
  const stackingCount =
    (nitrogenFixers.length > 0 ? 1 : 0) + // Nitrogen fixing
    (pollinatorPlants > 0 ? 1 : 0) + // Pollinator support
    (perennials.length > 0 ? 1 : 0) + // Long-term yield
    (beds.length > 2 ? 1 : 0) // Multiple guilds

  // 8. Permaculture Principles Applied
  const principles: string[] = []
  if (uniqueSpecies >= 5) principles.push('Diversity')
  if (nitrogenFixers.length > 0) principles.push('Integrate')
  if (perennials.length > 0) principles.push('Slow solutions')
  if (pollinatorPlants > 0) principles.push('Self-regulate')
  if (siteData?.waterSource === 'rain') principles.push('Use renewable')
  if (beds.length > 1) principles.push('Multiple elements')
  if (totalPlants > 5) principles.push('Produce yield')
  if (biodiversityScore > 60) principles.push('Value edges')

  // 9. Recommendations
  const recommendations: string[] = []
  if (nitrogenFixers.length === 0) {
    recommendations.push('Add legumes (peas, beans) to fix nitrogen and build soil naturally')
  }
  if (perennials.length === 0) {
    recommendations.push('Include perennials (berries, herbs) for year-over-year yield')
  }
  if (pollinatorPlants === 0) {
    recommendations.push('Plant flowers and herbs to attract beneficial insects and pollinators')
  }
  if (!siteData?.waterSource || siteData.waterSource !== 'rain') {
    recommendations.push('Install rain barrels to harvest water and reduce municipal dependence')
  }
  if (uniqueSpecies < 5) {
    recommendations.push('Increase diversity - aim for 10+ species for ecosystem resilience')
  }
  if (beds.length < 2) {
    recommendations.push('Create multiple guilds for stacked functions and pest resistance')
  }

  // 10. Overall Score
  const overallScore = Math.round(
    (soilBuildingScore * 0.2) +
    (waterScore * 0.15) +
    (biodiversityScore * 0.2) +
    (productivityScore * 0.15) +
    (zonePlacementScore * 0.1) +
    (resourceCyclingScore * 0.2)
  )

  return {
    overallScore,
    principlesApplied: principles,
    soilBuilding: {
      score: soilBuildingScore,
      hasNitrogenFixers: nitrogenFixers.length > 0,
      nitrogenFixerCount: nitrogenFixers.length,
    },
    waterManagement: {
      score: waterScore,
      insights: waterInsights,
    },
    biodiversity: {
      score: biodiversityScore,
      uniqueSpecies,
      plantFamilies,
      hasPollinatorPlants: pollinatorPlants > 0,
    },
    productivity: {
      score: productivityScore,
      estimatedYieldLbs: estimatedYield,
      perennialCount: perennials.length,
      annualCount: annuals.length,
    },
    zonePlacement: {
      score: zonePlacementScore,
      advice: zonePlacementAdvice,
    },
    resourceCycling: {
      score: resourceCyclingScore,
      strategies,
    },
    stackingFunctions: stackingCount,
    recommendations,
  }
}
