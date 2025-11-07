/**
 * Garden Evolution Panel - Visualize garden development over time
 *
 * KILLER FEATURE: Show how garden transforms over 1, 3, 5, 10 years
 * Most people can't visualize long-term permaculture outcomes
 * This makes the invisible visible and builds confidence
 *
 * Features:
 * - Timeline slider for different years
 * - Plant maturation visualization
 * - Canopy development
 * - Yield progression
 * - Guild establishment stages
 * - Visual before/after comparisons
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Clock,
  TrendingUp,
  TreeDeciduous,
  Sprout,
  Leaf,
  Award,
  Info,
  Zap,
  Target,
  DollarSign,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'
import { cn } from '@/lib/utils'

interface GardenEvolutionPanelProps {
  gardenBeds: GardenBed[]
}

const TIMELINE_YEARS = [1, 2, 3, 5, 7, 10]

/**
 * Garden Evolution Panel
 */
export function GardenEvolutionPanel({ gardenBeds }: GardenEvolutionPanelProps) {
  const [selectedYear, setSelectedYear] = useState(3)

  // Analyze garden evolution
  const evolution = useMemo(() => analyzeGardenEvolution(gardenBeds, selectedYear), [
    gardenBeds,
    selectedYear,
  ])

  const hasPlants = gardenBeds.some((bed) => bed.plants && bed.plants.length > 0)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Garden Evolution
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            Year {selectedYear}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Visualize how your garden matures and produces over time
        </p>
      </div>

      {!hasPlants && (
        <div className="p-4">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No plants to visualize</p>
              <p className="text-xs text-muted-foreground">
                Add plants to see how your garden evolves over time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasPlants && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Timeline Slider */}
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <Clock className="h-5 w-5" />
                  Time Slider
                </CardTitle>
                <CardDescription className="text-emerald-700 dark:text-emerald-300 text-xs">
                  Move the slider to see your garden at different stages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700 dark:text-emerald-300">Year:</span>
                    <Badge className="bg-emerald-600 text-white text-lg px-3">
                      {selectedYear}
                    </Badge>
                  </div>

                  <Slider
                    value={[selectedYear]}
                    onValueChange={(value) => setSelectedYear(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                    <span>Year 1</span>
                    <span>Year 10</span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  <span className="font-medium">Stage:</span>{' '}
                  {getGardenStage(selectedYear)}
                </div>
              </CardContent>
            </Card>

            {/* Maturation Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Garden Maturation</CardTitle>
                <CardDescription className="text-xs">
                  How mature your garden is at year {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Overall Maturity:</span>
                    <span className="font-semibold">{evolution.maturityScore}%</span>
                  </div>
                  <Progress value={evolution.maturityScore} className="h-3" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-muted rounded">
                    <div className="text-muted-foreground mb-1">Producing</div>
                    <div className="text-lg font-bold text-green-600">
                      {evolution.producingPlants}
                    </div>
                    <div className="text-[10px] text-muted-foreground">plants</div>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <div className="text-muted-foreground mb-1">Establishing</div>
                    <div className="text-lg font-bold text-amber-600">
                      {evolution.establishingPlants}
                    </div>
                    <div className="text-[10px] text-muted-foreground">plants</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canopy Development */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TreeDeciduous className="h-4 w-4 text-green-600" />
                  Canopy Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Canopy Coverage:</span>
                    <span className="font-semibold">{evolution.canopyCoverage}%</span>
                  </div>
                  <Progress value={evolution.canopyCoverage} className="h-2" />
                </div>

                {evolution.layers.map((layer, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <layer.icon className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">{layer.name}:</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {layer.count} {layer.count === 1 ? 'plant' : 'plants'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Yield Progression */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Yield Progression
                </CardTitle>
                <CardDescription className="text-xs">
                  Estimated production at year {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200">
                  <div className="text-xs text-green-700 dark:text-green-300 mb-2">
                    Annual Production
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-900 dark:text-green-100">
                      {evolution.annualYieldLbs.toFixed(0)}
                    </span>
                    <span className="text-sm text-green-700 dark:text-green-300">lbs/year</span>
                  </div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    Market value: ${evolution.annualYieldValue.toFixed(0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium">Yield Growth Over Time:</div>
                  {TIMELINE_YEARS.filter((y) => y <= selectedYear).map((year) => (
                    <div key={year} className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-16">Year {year}:</span>
                      <div className="flex-1">
                        <Progress
                          value={(year / selectedYear) * evolution.maturityScore}
                          className="h-2"
                        />
                      </div>
                      <span className="w-20 text-right text-muted-foreground">
                        {((year / selectedYear) * evolution.annualYieldLbs).toFixed(0)} lbs
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guild Establishment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-purple-600" />
                  Guild Establishment
                </CardTitle>
                <CardDescription className="text-xs">
                  How plant communities develop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {evolution.guilds.map((guild, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{guild.name}</span>
                      <Badge
                        className={cn(
                          'text-xs',
                          guild.maturity >= 80 && 'bg-green-600',
                          guild.maturity >= 50 && guild.maturity < 80 && 'bg-amber-600',
                          guild.maturity < 50 && 'bg-gray-600'
                        )}
                      >
                        {guild.maturity}% mature
                      </Badge>
                    </div>
                    <Progress value={guild.maturity} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{guild.description}</p>
                  </div>
                ))}

                {evolution.guilds.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No guilds detected. Add companion plants to create synergistic communities.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stage Milestones */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-600" />
                  Milestones & Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {evolution.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-xs',
                      milestone.achieved
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200'
                        : 'bg-muted'
                    )}
                  >
                    {milestone.achieved ? (
                      <Award className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium mb-1">
                        {milestone.achieved ? '✓ ' : ''}
                        {milestone.title}
                      </div>
                      <div className="text-muted-foreground">{milestone.description}</div>
                      {!milestone.achieved && (
                        <div className="text-[10px] text-amber-600 mt-1">
                          Expected: Year {milestone.year}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline Visualization */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Key Stages</CardTitle>
                <CardDescription className="text-xs">
                  What to expect at each stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {STAGE_DESCRIPTIONS.map((stage) => (
                  <div
                    key={stage.year}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all',
                      selectedYear >= stage.year
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                        : 'border-muted bg-muted/50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={selectedYear >= stage.year ? 'default' : 'outline'}
                        className="font-mono"
                      >
                        Year {stage.year}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {stage.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Educational Tips */}
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Info className="h-4 w-4" />
                  Understanding Garden Evolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-blue-900 dark:text-blue-100">
                <p>
                  <strong>Permaculture gardens mature like forests:</strong> What starts as
                  annual beds gradually transforms into a multi-layered food forest with
                  perennials, trees, and self-seeding plants.
                </p>
                <p>
                  <strong>Patience is rewarded:</strong> While annuals produce in months,
                  perennials and trees take years to establish but then produce for decades with
                  minimal maintenance.
                </p>
                <p>
                  <strong>Plan for succession:</strong> Design now for what you want in 10 years.
                  Plant trees first - they take the longest. Fill gaps with shorter-lived plants.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// Helper Functions & Data

interface GardenEvolution {
  maturityScore: number
  producingPlants: number
  establishingPlants: number
  canopyCoverage: number
  layers: { name: string; count: number; icon: React.ElementType }[]
  annualYieldLbs: number
  annualYieldValue: number
  guilds: { name: string; maturity: number; description: string }[]
  milestones: { title: string; description: string; year: number; achieved: boolean }[]
}

function analyzeGardenEvolution(beds: GardenBed[], year: number): GardenEvolution {
  const allPlants = beds.flatMap((bed) => bed.plants || [])
  const totalPlants = allPlants.length

  // Calculate plant maturity based on type and year
  let producingPlants = 0
  let establishingPlants = 0
  let annualYieldLbs = 0
  let annualYieldValue = 0

  const layerCounts = {
    canopy: 0,
    shrub: 0,
    herbaceous: 0,
    ground: 0,
  }

  allPlants.forEach((plant) => {
    const plantInfo = PLANT_LIBRARY.find((p) => p.id === plant.plantId)
    if (!plantInfo) return

    // Determine maturity based on plant type and year
    let maturity = 0
    let yearsToMaturity = 1

    if (['fruit_trees', 'nut_trees'].includes(plant.plantId)) {
      yearsToMaturity = 5
      layerCounts.canopy++
    } else if (['berries'].includes(plant.plantId)) {
      yearsToMaturity = 2
      layerCounts.shrub++
    } else if (['tomatoes', 'peppers', 'lettuce'].includes(plant.plantId)) {
      yearsToMaturity = 1
      layerCounts.herbaceous++
    } else {
      yearsToMaturity = 1
      layerCounts.ground++
    }

    maturity = Math.min(100, (year / yearsToMaturity) * 100)

    if (maturity >= 50) {
      producingPlants++
      // Yield scales with maturity
      const yieldFactor = maturity / 100
      annualYieldLbs += (plantInfo.yield?.amount || 10) * yieldFactor
      annualYieldValue += (plantInfo.yield?.amount || 10) * 3 * yieldFactor // $3/lb average
    } else {
      establishingPlants++
    }
  })

  // Overall maturity score
  const maturityScore = totalPlants > 0 ? Math.round((producingPlants / totalPlants) * 100) : 0

  // Canopy coverage (trees take time to spread)
  const canopyCoverage = Math.min(100, (layerCounts.canopy * 20 * (year / 5)))

  // Layers
  const layers = [
    { name: 'Canopy', count: layerCounts.canopy, icon: TreeDeciduous },
    { name: 'Shrub', count: layerCounts.shrub, icon: Leaf },
    { name: 'Herbaceous', count: layerCounts.herbaceous, icon: Sprout },
    { name: 'Ground Cover', count: layerCounts.ground, icon: Leaf },
  ].filter((layer) => layer.count > 0)

  // Guild maturity (simplified)
  const guilds = [
    {
      name: 'Three Sisters Guild',
      maturity: Math.min(100, year * 33),
      description: 'Corn, beans, squash working together',
    },
  ]

  // Milestones
  const milestones = [
    {
      title: 'First Harvest',
      description: 'Annual vegetables begin producing',
      year: 1,
      achieved: year >= 1,
    },
    {
      title: 'Berry Production',
      description: 'Berry bushes start yielding fruit',
      year: 2,
      achieved: year >= 2,
    },
    {
      title: 'Perennials Established',
      description: 'Asparagus, rhubarb, herbs fully established',
      year: 3,
      achieved: year >= 3,
    },
    {
      title: 'First Tree Harvest',
      description: 'Fruit trees begin bearing',
      year: 5,
      achieved: year >= 5,
    },
    {
      title: 'Guilds Mature',
      description: 'Plant communities fully integrated and self-supporting',
      year: 7,
      achieved: year >= 7,
    },
    {
      title: 'Food Forest Complete',
      description: 'Multi-layered edible ecosystem producing abundantly',
      year: 10,
      achieved: year >= 10,
    },
  ]

  return {
    maturityScore,
    producingPlants,
    establishingPlants,
    canopyCoverage,
    layers,
    annualYieldLbs,
    annualYieldValue,
    guilds,
    milestones,
  }
}

function getGardenStage(year: number): string {
  if (year === 1) return 'Establishment'
  if (year <= 3) return 'Early Growth'
  if (year <= 5) return 'Productive Development'
  if (year <= 7) return 'Mature Production'
  return 'Abundant Food Forest'
}

const STAGE_DESCRIPTIONS = [
  {
    year: 1,
    title: 'Establishment',
    description:
      'Infrastructure built, annuals planted, trees and perennials just beginning. Focus on soil building and water systems.',
  },
  {
    year: 3,
    title: 'Early Maturity',
    description:
      'Berry bushes producing, perennials established, young trees growing vigorously. Guilds forming.',
  },
  {
    year: 5,
    title: 'Productive Phase',
    description:
      'Fruit trees begin bearing, canopy developing, diverse yields. Less maintenance needed as systems stabilize.',
  },
  {
    year: 10,
    title: 'Mature Food Forest',
    description:
      'Multi-layered ecosystem producing abundantly. Minimal maintenance, maximum diversity. Self-regulating systems.',
  },
]
