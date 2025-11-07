/**
 * Succession Planning Panel - Crop rotation over multiple years
 *
 * KEY DIFFERENTIATOR: Most garden planners only show current season
 * This panel enables multi-year permaculture succession planning
 *
 * Features:
 * - 3-5 year crop rotation plans
 * - Soil building progression (nitrogen fixers → heavy feeders)
 * - Pest/disease break cycles
 * - Annual → Perennial transition planning
 * - Guild maturation timelines
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  TrendingUp,
  Repeat,
  Sprout,
  TreeDeciduous,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY, PlantInfo } from '@/lib/data/plant-library'
import { cn } from '@/lib/utils'

interface SuccessionPlanningPanelProps {
  gardenBeds: GardenBed[]
  planId?: string
}

/**
 * Plant families for rotation
 */
const PLANT_FAMILIES = {
  legumes: { name: 'Legumes', soilEffect: 'nitrogen-fixing', color: 'green' },
  brassicas: { name: 'Brassicas', soilEffect: 'heavy-feeder', color: 'purple' },
  solanaceae: { name: 'Nightshades', soilEffect: 'heavy-feeder', color: 'red' },
  cucurbits: { name: 'Cucurbits', soilEffect: 'heavy-feeder', color: 'orange' },
  alliums: { name: 'Alliums', soilEffect: 'light-feeder', color: 'yellow' },
  roots: { name: 'Root Crops', soilEffect: 'light-feeder', color: 'amber' },
  greens: { name: 'Leafy Greens', soilEffect: 'medium-feeder', color: 'emerald' },
} as const

/**
 * Succession Planning Panel
 */
export function SuccessionPlanningPanel({ gardenBeds, planId }: SuccessionPlanningPanelProps) {
  const [selectedBed, setSelectedBed] = useState<string | null>(null)
  const [rotationYears, setRotationYears] = useState<number>(3)

  // Analyze current plantings
  const analysis = useMemo(() => analyzeSuccession(gardenBeds), [gardenBeds])

  // Generate rotation plan for selected bed
  const rotationPlan = useMemo(() => {
    if (!selectedBed) return null
    const bed = gardenBeds.find(b => b.id === selectedBed)
    if (!bed) return null
    return generateRotationPlan(bed, rotationYears)
  }, [selectedBed, gardenBeds, rotationYears])

  const hasBeds = gardenBeds.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Repeat className="h-5 w-5 text-indigo-600" />
            Succession Planning
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            {rotationYears}yr rotation
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-year crop rotation for soil health and pest management
        </p>
      </div>

      {!hasBeds && (
        <div className="p-4">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No beds to plan succession for</p>
              <p className="text-xs text-muted-foreground">
                Add garden beds to see crop rotation recommendations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasBeds && (
        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b grid grid-cols-3">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="rotation">
              <Repeat className="h-4 w-4 mr-2" />
              Rotation
            </TabsTrigger>
            <TabsTrigger value="transition">
              <TreeDeciduous className="h-4 w-4 mr-2" />
              Transition
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            {/* Overview Tab */}
            <TabsContent value="overview" className="m-0 p-4 space-y-4">
              {/* Succession Score */}
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                    <Layers className="h-5 w-5" />
                    Succession Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-700 dark:text-indigo-300">
                      Overall Score
                    </span>
                    <Badge variant="secondary" className="font-mono text-lg">
                      {analysis.successionScore}/100
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                      style={{ width: `${analysis.successionScore}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Current State */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current Garden State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Annuals:</span>
                      <span className="font-semibold">{analysis.annualCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Perennials:</span>
                      <span className="font-semibold">{analysis.perennialCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">N-Fixers:</span>
                      <span className="font-semibold">{analysis.nitrogenFixerCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Heavy Feeders:</span>
                      <span className="font-semibold">{analysis.heavyFeederCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Succession Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="h-3 w-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rotation Planning Tab */}
            <TabsContent value="rotation" className="m-0 p-4 space-y-4">
              {/* Bed Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Select Bed for Rotation Plan</CardTitle>
                  <CardDescription className="text-xs">
                    View recommended crop succession over {rotationYears} years
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {gardenBeds.filter(b => b.elementCategory === 'bed').map((bed) => (
                    <Button
                      key={bed.id}
                      variant={selectedBed === bed.id ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedBed(bed.id)}
                    >
                      <Sprout className="h-4 w-4 mr-2" />
                      {bed.name}
                      {bed.plants && bed.plants.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {bed.plants.length} plants
                        </Badge>
                      )}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Rotation Timeline */}
              {rotationPlan && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      {rotationYears}-Year Rotation Plan
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Optimized for soil health and pest management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {rotationPlan.years.map((year, idx) => (
                      <div key={idx}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            Year {idx + 1}
                          </Badge>
                          <Badge
                            className={cn(
                              'text-xs',
                              year.soilEffect === 'building' && 'bg-green-600',
                              year.soilEffect === 'maintaining' && 'bg-blue-600',
                              year.soilEffect === 'depleting' && 'bg-orange-600'
                            )}
                          >
                            {year.soilEffect}
                          </Badge>
                        </div>
                        <div className="space-y-1 ml-2">
                          {year.crops.map((crop, cropIdx) => (
                            <div
                              key={cropIdx}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <span className="text-base">{crop.icon}</span>
                              <span>{crop.name}</span>
                              <span className="ml-auto text-[10px] opacity-70">
                                {crop.family}
                              </span>
                            </div>
                          ))}
                        </div>
                        {idx < rotationPlan.years.length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {!selectedBed && (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="pt-6 text-center">
                    <Repeat className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-xs text-muted-foreground">
                      Select a bed above to see rotation plan
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Annual to Perennial Transition Tab */}
            <TabsContent value="transition" className="m-0 p-4 space-y-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
                    <TreeDeciduous className="h-5 w-5" />
                    Perennialization Strategy
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300 text-xs">
                    Gradually transition from annuals to perennials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded">
                      <div className="text-green-700 dark:text-green-300 mb-1">Current</div>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {Math.round((analysis.perennialCount / Math.max(1, analysis.annualCount + analysis.perennialCount)) * 100)}%
                      </div>
                      <div className="text-[10px] text-green-600 dark:text-green-400">
                        perennial
                      </div>
                    </div>
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded">
                      <div className="text-emerald-700 dark:text-emerald-300 mb-1">Goal (5yr)</div>
                      <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        60%
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        perennial
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transition Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">5-Year Transition Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3, 4, 5].map((year) => (
                    <div key={year} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                        Y{year}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="font-medium mb-1">
                          {getTransitionGoal(year)}
                        </div>
                        <div className="text-muted-foreground text-[10px]">
                          {getTransitionAction(year)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Perennial Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Recommended Perennials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {PERENNIAL_RECOMMENDATIONS.map((plant, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border rounded text-xs">
                      <span className="text-lg">{plant.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{plant.name}</div>
                        <div className="text-[10px] text-muted-foreground">{plant.benefit}</div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Y{plant.establishmentYear}
                      </Badge>
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

// Helper Functions & Data

interface SuccessionAnalysis {
  successionScore: number
  annualCount: number
  perennialCount: number
  nitrogenFixerCount: number
  heavyFeederCount: number
  recommendations: string[]
}

function analyzeSuccession(beds: GardenBed[]): SuccessionAnalysis {
  const allPlants = beds.flatMap(bed => bed.plants || [])

  let annualCount = 0
  let perennialCount = 0
  let nitrogenFixerCount = 0
  let heavyFeederCount = 0

  allPlants.forEach(plant => {
    const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)
    if (!plantInfo) return

    // Count annuals vs perennials
    if (['beans', 'peas', 'tomatoes', 'lettuce', 'carrots'].includes(plant.plantId)) {
      annualCount++
    } else if (['berries', 'fruit_trees'].includes(plant.plantId)) {
      perennialCount++
    }

    // Count nitrogen fixers
    if (['beans', 'peas', 'clover'].includes(plant.plantId)) {
      nitrogenFixerCount++
    }

    // Count heavy feeders
    if (['tomatoes', 'peppers', 'squash'].includes(plant.plantId)) {
      heavyFeederCount++
    }
  })

  // Calculate succession score
  const totalPlants = allPlants.length || 1
  const perennialRatio = perennialCount / totalPlants
  const nitrogenFixerRatio = nitrogenFixerCount / totalPlants
  const diversityScore = Math.min(100, (new Set(allPlants.map(p => p.plantId)).size / totalPlants) * 100)

  const successionScore = Math.round(
    (perennialRatio * 40) +
    (nitrogenFixerRatio * 30) +
    (diversityScore * 0.3)
  )

  // Generate recommendations
  const recommendations: string[] = []
  if (nitrogenFixerCount === 0) {
    recommendations.push('Add nitrogen-fixing plants (beans, peas, clover) to build soil')
  }
  if (perennialRatio < 0.2) {
    recommendations.push('Consider adding perennials for long-term stability')
  }
  if (heavyFeederCount > annualCount * 0.5) {
    recommendations.push('Balance heavy feeders with light feeders and nitrogen fixers')
  }
  if (recommendations.length === 0) {
    recommendations.push('Good succession planning! Continue rotating crops annually')
  }

  return {
    successionScore,
    annualCount,
    perennialCount,
    nitrogenFixerCount,
    heavyFeederCount,
    recommendations,
  }
}

interface RotationPlan {
  years: {
    crops: { name: string; icon: string; family: string }[]
    soilEffect: 'building' | 'maintaining' | 'depleting'
  }[]
}

function generateRotationPlan(bed: GardenBed, years: number): RotationPlan {
  // Simple 3-year rotation: Legumes → Heavy Feeders → Light Feeders
  const rotationCycle = [
    {
      crops: [
        { name: 'Beans', icon: '🫘', family: 'Legumes' },
        { name: 'Peas', icon: '🫛', family: 'Legumes' },
      ],
      soilEffect: 'building' as const,
    },
    {
      crops: [
        { name: 'Tomatoes', icon: '🍅', family: 'Nightshades' },
        { name: 'Peppers', icon: '🌶️', family: 'Nightshades' },
      ],
      soilEffect: 'depleting' as const,
    },
    {
      crops: [
        { name: 'Lettuce', icon: '🥬', family: 'Greens' },
        { name: 'Carrots', icon: '🥕', family: 'Roots' },
      ],
      soilEffect: 'maintaining' as const,
    },
  ]

  const plan: RotationPlan = { years: [] }
  for (let i = 0; i < years; i++) {
    plan.years.push(rotationCycle[i % rotationCycle.length])
  }

  return plan
}

function getTransitionGoal(year: number): string {
  const goals = [
    'Establish herb spiral and berry patch',
    'Plant fruit trees and nitrogen-fixing shrubs',
    'Add perennial vegetables (asparagus, artichokes)',
    'Expand forest garden edges',
    'Mature perennial systems producing',
  ]
  return goals[year - 1] || 'Maintain perennial systems'
}

function getTransitionAction(year: number): string {
  const actions = [
    'Start with easy perennials in high-traffic areas',
    'Focus on establishing long-term woody plants',
    'Add productive perennials for food security',
    'Fill gaps with complementary perennials',
    'Fine-tune and harvest from established systems',
  ]
  return actions[year - 1] || 'Ongoing maintenance'
}

const PERENNIAL_RECOMMENDATIONS = [
  { name: 'Asparagus', icon: '🥦', benefit: 'Productive for 20+ years', establishmentYear: 1 },
  { name: 'Rhubarb', icon: '🌱', benefit: 'Low maintenance, early spring harvest', establishmentYear: 1 },
  { name: 'Blueberries', icon: '🫐', benefit: 'High value, soil acidifier', establishmentYear: 2 },
  { name: 'Fruit Trees', icon: '🍎', benefit: 'Long-term food and habitat', establishmentYear: 2 },
  { name: 'Herbs (Perennial)', icon: '🌿', benefit: 'Medicine, culinary, pollinators', establishmentYear: 1 },
]
