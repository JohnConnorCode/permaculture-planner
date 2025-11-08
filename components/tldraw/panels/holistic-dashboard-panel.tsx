'use client'

import React, { useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Zap,
  Droplets, Sun, Sprout, Users, Target
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { SiteData } from '@/lib/types/site-context'
import {
  PermacultureDesignContext,
  HolisticAnalyzer,
  createDefaultContext
} from '@/lib/permaculture/holistic-context'

interface HolisticDashboardProps {
  gardenBeds: GardenBed[]
  siteData?: SiteData | null
}

export function HolisticDashboardPanel({ gardenBeds, siteData }: HolisticDashboardProps) {
  // Create comprehensive context
  const context = useMemo(() => {
    const baseContext = createDefaultContext()

    // Populate with real data
    const fullContext: PermacultureDesignContext = {
      ...baseContext,
      site: {
        ...baseContext.site!,
        basic: siteData || ({} as SiteData)
      },
      design: {
        ...baseContext.design!,
        beds: gardenBeds
      },
      performance: baseContext.performance!,
      relationships: baseContext.relationships!,
      holisticScore: {
        overall: 0,
        ethics: { earthCare: 0, peopleCare: 0, fairShare: 0 },
        principles: [],
        scientificMetrics: {
          soilHealth: {
            organicMatterPercent: 0,
            infiltrationRate: 0,
            bulkDensity: 0,
            aggregateStability: 0,
            microbialBiomass: 0,
            earthwormCount: 0,
            cec: 0
          },
          waterEfficiency: {
            infiltrationRate: 0,
            waterHoldingCapacity: 0,
            runoffPercentage: 0,
            irrigationEfficiency: 0,
            rainwaterCapturePercent: 0
          },
          biodiversity: {
            speciesRichness: 0,
            shannonIndex: 0,
            nativeSpeciesPercent: 0,
            pollinatorVisitsPerHour: 0,
            beneficialInsectRatio: 0
          },
          productivity: {
            yieldPerSqFt: 0,
            caloriesPerSqFt: 0,
            proteinGramsPerSqFt: 0,
            perennialToAnnualRatio: 0,
            cropDiversity: 0
          },
          carbonSequestration: {
            tonsCO2PerYear: 0,
            biomassAccumulationRate: 0,
            woodyPerennialPercent: 0
          },
          nutrientCycling: {
            nitrogenFixationLbsPerAcre: 0,
            compostProductionVsImport: 0,
            closedLoopPercent: 0,
            mulchProductionSqFt: 0
          },
          energyEfficiency: {
            eroi: 0,
            laborHoursPerLbYield: 0,
            fuelInputsPerAcre: 0,
            renewableEnergyPercent: 0
          }
        }
      },
      recommendations: {
        immediate: [],
        seasonal: new Map(),
        longTerm: []
      }
    }

    // Analyze holistically
    return HolisticAnalyzer.analyzeDesign(fullContext)
  }, [gardenBeds, siteData])

  const { holisticScore, recommendations } = context

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Developing'
    return 'Needs Work'
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Overall Holistic Score */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Holistic Design Score</CardTitle>
                  <CardDescription>Integrated permaculture analysis</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-700">
                  {Math.round(holisticScore.overall)}
                </div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={holisticScore.overall} className="h-3" />
            <div className="mt-3 flex items-center gap-2">
              {holisticScore.overall >= 70 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
              <p className="text-sm text-muted-foreground">
                {holisticScore.overall >= 70
                  ? 'Your design demonstrates strong permaculture integration'
                  : 'Opportunities exist to strengthen permaculture integration'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permaculture Ethics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" />
              Permaculture Ethics
            </CardTitle>
            <CardDescription>Earth Care • People Care • Fair Share</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Earth Care</span>
                <Badge className={getScoreColor(holisticScore.ethics.earthCare)}>
                  {Math.round(holisticScore.ethics.earthCare)}%
                </Badge>
              </div>
              <Progress value={holisticScore.ethics.earthCare} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Soil health, biodiversity, water cycle, regeneration
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">People Care</span>
                <Badge className={getScoreColor(holisticScore.ethics.peopleCare)}>
                  {Math.round(holisticScore.ethics.peopleCare)}%
                </Badge>
              </div>
              <Progress value={holisticScore.ethics.peopleCare} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Food production, health, education, accessibility
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fair Share</span>
                <Badge className={getScoreColor(holisticScore.ethics.fairShare)}>
                  {Math.round(holisticScore.ethics.fairShare)}%
                </Badge>
              </div>
              <Progress value={holisticScore.ethics.fairShare} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Surplus sharing, community integration, resource efficiency
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scientific Metrics - Research-Based Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Scientific Metrics
            </CardTitle>
            <CardDescription>Research-backed permaculture performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="soil" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="soil">Soil</TabsTrigger>
                <TabsTrigger value="productivity">Yield</TabsTrigger>
                <TabsTrigger value="biodiversity">Ecology</TabsTrigger>
                <TabsTrigger value="efficiency">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="soil" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xs text-muted-foreground mb-1">Organic Matter</div>
                    <div className="text-xl font-bold text-amber-700">
                      {holisticScore.scientificMetrics.soilHealth.organicMatterPercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Target: 5-8%</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-muted-foreground mb-1">Infiltration Rate</div>
                    <div className="text-xl font-bold text-blue-700">
                      {holisticScore.scientificMetrics.soilHealth.infiltrationRate.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">inches/hour</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-muted-foreground mb-1">Earthworm Count</div>
                    <div className="text-xl font-bold text-green-700">
                      {Math.round(holisticScore.scientificMetrics.soilHealth.earthwormCount)}
                    </div>
                    <div className="text-xs text-muted-foreground">per cubic foot</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-muted-foreground mb-1">CEC</div>
                    <div className="text-xl font-bold text-purple-700">
                      {holisticScore.scientificMetrics.soilHealth.cec.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">meq/100g</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="productivity" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-muted-foreground mb-1">Calories/sq ft</div>
                    <div className="text-xl font-bold text-green-700">
                      {Math.round(holisticScore.scientificMetrics.productivity.caloriesPerSqFt)}
                    </div>
                    <div className="text-xs text-muted-foreground">annual production</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-muted-foreground mb-1">Protein g/sq ft</div>
                    <div className="text-xl font-bold text-blue-700">
                      {Math.round(holisticScore.scientificMetrics.productivity.proteinGramsPerSqFt)}
                    </div>
                    <div className="text-xs text-muted-foreground">annual production</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-muted-foreground mb-1">Perennial Ratio</div>
                    <div className="text-xl font-bold text-purple-700">
                      {(holisticScore.scientificMetrics.productivity.perennialToAnnualRatio * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Target: 60%+</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xs text-muted-foreground mb-1">Crop Diversity</div>
                    <div className="text-xl font-bold text-amber-700">
                      {Math.round(holisticScore.scientificMetrics.productivity.cropDiversity)}
                    </div>
                    <div className="text-xs text-muted-foreground">species count</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="biodiversity" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-muted-foreground mb-1">Shannon Index</div>
                    <div className="text-xl font-bold text-green-700">
                      {holisticScore.scientificMetrics.biodiversity.shannonIndex.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">diversity (1.5-3.5)</div>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <div className="text-xs text-muted-foreground mb-1">Native Species</div>
                    <div className="text-xl font-bold text-rose-700">
                      {Math.round(holisticScore.scientificMetrics.biodiversity.nativeSpeciesPercent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">of total</div>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="text-xs text-muted-foreground mb-1">Pollinator Visits</div>
                    <div className="text-xl font-bold text-pink-700">
                      {Math.round(holisticScore.scientificMetrics.biodiversity.pollinatorVisitsPerHour)}
                    </div>
                    <div className="text-xs text-muted-foreground">per hour</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-xs text-muted-foreground mb-1">Beneficial:Pest</div>
                    <div className="text-xl font-bold text-amber-700">
                      {holisticScore.scientificMetrics.biodiversity.beneficialInsectRatio.toFixed(1)}:1
                    </div>
                    <div className="text-xs text-muted-foreground">insect ratio</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="efficiency" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-muted-foreground mb-1">Water Capture</div>
                    <div className="text-xl font-bold text-blue-700">
                      {Math.round(holisticScore.scientificMetrics.waterEfficiency.rainwaterCapturePercent)}%
                    </div>
                    <div className="text-xs text-muted-foreground">of rainfall</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-muted-foreground mb-1">N-Fixation</div>
                    <div className="text-xl font-bold text-green-700">
                      {Math.round(holisticScore.scientificMetrics.nutrientCycling.nitrogenFixationLbsPerAcre)}
                    </div>
                    <div className="text-xs text-muted-foreground">lbs N/acre/yr</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-muted-foreground mb-1">EROI</div>
                    <div className="text-xl font-bold text-purple-700">
                      {holisticScore.scientificMetrics.energyEfficiency.eroi.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">energy return</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-xs text-muted-foreground mb-1">Carbon Sequestration</div>
                    <div className="text-xl font-bold text-emerald-700">
                      {holisticScore.scientificMetrics.carbonSequestration.tonsCO2PerYear.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">tons CO₂/year</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Smart Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>AI-powered insights from holistic analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="immediate" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="immediate" className="flex-1">
                  Immediate ({recommendations.immediate.length})
                </TabsTrigger>
                <TabsTrigger value="seasonal" className="flex-1">
                  Seasonal
                </TabsTrigger>
                <TabsTrigger value="longterm" className="flex-1">
                  Long-term
                </TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="space-y-3 mt-4">
                {recommendations.immediate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <p>No immediate actions needed - great work!</p>
                  </div>
                ) : (
                  recommendations.immediate.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === 'critical'
                          ? 'border-red-500 bg-red-50'
                          : rec.priority === 'high'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {rec.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.effort}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{rec.suggestion}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            Impact: {rec.impact}%
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.reasoning}</p>
                      <div className="flex flex-wrap gap-1">
                        {rec.relatedPanels.map((panel) => (
                          <Badge key={panel} variant="secondary" className="text-xs">
                            {panel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="seasonal" className="space-y-4 mt-4">
                {Array.from(recommendations.seasonal.entries()).map(([season, tasks]) => (
                  <div key={season}>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {season}
                    </h4>
                    <ul className="space-y-1">
                      {tasks.map((task, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="longterm" className="space-y-4 mt-4">
                {recommendations.longTerm.map((plan) => (
                  <Card key={plan.year}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Year {plan.year}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <div className="text-sm font-semibold mb-1">Goals:</div>
                        <ul className="space-y-1">
                          {plan.goals.map((goal: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <Target className="h-3 w-3 mt-1 text-green-600 flex-shrink-0" />
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <div className="text-sm font-semibold mb-1">Milestones:</div>
                        <ul className="space-y-1">
                          {plan.milestones.map((milestone: string, idx: number) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <CheckCircle2 className="h-3 w-3 mt-1 text-blue-600 flex-shrink-0" />
                              <span>{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 12 Permaculture Principles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              12 Permaculture Principles
            </CardTitle>
            <CardDescription>Evaluate design against core principles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {holisticScore.principles.map((principle, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{principle.principle}</span>
                  <Badge className={getScoreColor(principle.score)}>
                    {Math.round(principle.score)}%
                  </Badge>
                </div>
                <Progress value={principle.score} className="h-1.5" />
                {principle.improvements.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Improvements: {principle.improvements.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cross-Panel Insights */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Cross-Panel Insights
            </CardTitle>
            <CardDescription>How your design elements work together</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-start gap-2">
                <Droplets className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Water-Soil Integration</div>
                  <p className="text-xs text-muted-foreground">
                    Your topography and soil data suggest swales on the east slope would
                    increase water retention by 40% while building soil organic matter.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-start gap-2">
                <Sun className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Sun-Guild Synergy</div>
                  <p className="text-xs text-muted-foreground">
                    Based on sun analysis, your companion plantings in the south beds will
                    benefit from additional shade from nitrogen-fixing trees.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">Zone-Access Optimization</div>
                  <p className="text-xs text-muted-foreground">
                    Reorganizing zones based on your site infrastructure would reduce
                    daily walking distance by 35% while maintaining access to all areas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
