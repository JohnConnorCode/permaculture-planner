'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  TrendingUp, TrendingDown, Minus, DollarSign, Droplet,
  Leaf, Apple, Calendar, Clock, AlertTriangle, CheckCircle,
  BarChart3, PieChart, Activity, Zap, Target, Award,
  Sun, Cloud, Thermometer, Wind, Users, Heart, Star
} from 'lucide-react'
import { GardenOptimizer, OptimizationResult } from '@/lib/garden-optimizer'
import { Node } from '@/modules/scene/sceneTypes'

interface GardenAnalyticsProps {
  nodes: Node[]
  hardinessZone?: string
  onSuggestionApply?: (suggestion: any) => void
}

interface MetricCard {
  title: string
  value: string | number
  change?: number
  unit?: string
  icon: any
  color: string
  description?: string
}

export function GardenAnalytics({
  nodes,
  hardinessZone = '7a',
  onSuggestionApply
}: GardenAnalyticsProps) {
  const optimizer = useMemo(
    () => new GardenOptimizer(nodes, hardinessZone),
    [nodes, hardinessZone]
  )

  const analysis = useMemo(
    () => optimizer.analyze(),
    [optimizer]
  )

  const recommendations = useMemo(
    () => optimizer.generateRecommendations(),
    [optimizer]
  )

  // Calculate key metrics
  const metrics: MetricCard[] = [
    {
      title: 'Garden Score',
      value: Math.round(analysis.score),
      unit: '/100',
      icon: Award,
      color: analysis.score >= 70 ? 'text-green-600' : analysis.score >= 50 ? 'text-yellow-600' : 'text-red-600',
      description: 'Overall optimization score'
    },
    {
      title: 'Expected Yield',
      value: analysis.yieldPrediction.totalYieldLbs.toFixed(0),
      unit: 'lbs',
      change: 15,
      icon: Apple,
      color: 'text-green-600',
      description: 'Total harvest prediction'
    },
    {
      title: 'Market Value',
      value: `$${analysis.yieldPrediction.marketValue.toFixed(0)}`,
      change: 20,
      icon: DollarSign,
      color: 'text-blue-600',
      description: 'Estimated produce value'
    },
    {
      title: 'Water Efficiency',
      value: analysis.resourceEfficiency.waterEfficiency,
      unit: '%',
      icon: Droplet,
      color: 'text-blue-500',
      description: 'Water conservation rating'
    },
    {
      title: 'Space Used',
      value: analysis.resourceEfficiency.spaceUtilization,
      unit: '%',
      icon: Target,
      color: 'text-purple-600',
      description: 'Bed utilization'
    },
    {
      title: 'Biodiversity',
      value: analysis.biodiversityScore,
      unit: '/100',
      icon: Leaf,
      color: 'text-green-500',
      description: 'Ecosystem health'
    },
    {
      title: 'Soil Health',
      value: analysis.resourceEfficiency.soilHealth,
      unit: '%',
      icon: Heart,
      color: 'text-amber-600',
      description: 'Soil condition score'
    },
    {
      title: 'Labor Hours',
      value: analysis.resourceEfficiency.laborHours.toFixed(0),
      unit: 'hrs/season',
      icon: Clock,
      color: 'text-gray-600',
      description: 'Estimated work time'
    }
  ]

  const getChangeIcon = (change?: number) => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with overall score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Garden Analytics Dashboard</CardTitle>
              <CardDescription>
                Real-time optimization insights for your {hardinessZone} garden
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(analysis.score)}
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
              <Progress value={analysis.score} className="w-24 mt-2" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{metric.title}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                      </span>
                      {metric.unit && (
                        <span className="text-sm text-gray-500">{metric.unit}</span>
                      )}
                    </div>
                    {metric.change && (
                      <div className="flex items-center gap-1 mt-1">
                        {getChangeIcon(metric.change)}
                        <span className="text-xs text-gray-500">
                          {Math.abs(metric.change)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>
                {metric.description && (
                  <p className="text-xs text-gray-400 mt-2">{metric.description}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="yield" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="yield">Yield</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="suggestions">Optimize</TabsTrigger>
          <TabsTrigger value="warnings">Issues</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        {/* Yield Analysis */}
        <TabsContent value="yield" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Harvest Predictions</CardTitle>
              <CardDescription>
                Expected yields and harvest timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.yieldPrediction.byPlant.map((plant, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{plant.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {plant.harvestWindow.start.toLocaleDateString()} -
                          {plant.harvestWindow.end.toLocaleDateString()}
                        </Badge>
                      </div>
                      <Progress
                        value={(plant.expectedYieldLbs / plant.yieldRangeMax) * 100}
                        className="h-2 mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Min: {plant.yieldRangeMin} lbs</span>
                        <span className="font-medium text-gray-700">
                          Expected: {plant.expectedYieldLbs} lbs
                        </span>
                        <span>Max: {plant.yieldRangeMax} lbs</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {analysis.yieldPrediction.totalYieldLbs.toFixed(0)} lbs
                    </p>
                    <p className="text-xs text-gray-500">Total Yield</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {(analysis.yieldPrediction.caloriesTotal / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-gray-500">Calories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      ${analysis.yieldPrediction.marketValue.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">Market Value</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resource Efficiency */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resource Efficiency Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      Water Efficiency
                    </span>
                    <span className="text-sm font-medium">
                      {analysis.resourceEfficiency.waterEfficiency}%
                    </span>
                  </div>
                  <Progress value={analysis.resourceEfficiency.waterEfficiency} />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      Space Utilization
                    </span>
                    <span className="text-sm font-medium">
                      {analysis.resourceEfficiency.spaceUtilization.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={analysis.resourceEfficiency.spaceUtilization} />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 text-amber-500" />
                      Soil Health
                    </span>
                    <span className="text-sm font-medium">
                      {analysis.resourceEfficiency.soilHealth}%
                    </span>
                  </div>
                  <Progress value={analysis.resourceEfficiency.soilHealth} />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Energy Balance
                    </span>
                    <span className="text-sm font-medium">
                      {analysis.resourceEfficiency.energyBalance.toFixed(1)}x
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, analysis.resourceEfficiency.energyBalance * 20)}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Cost Efficiency
                    </span>
                    <span className="text-sm font-medium">
                      {(analysis.resourceEfficiency.costEfficiency * 100).toFixed(0)}% ROI
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, analysis.resourceEfficiency.costEfficiency * 100)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Suggestions */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Optimization Suggestions</CardTitle>
              <CardDescription>
                AI-powered recommendations to improve your garden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                          <span className="font-medium text-sm">{suggestion.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        {suggestion.impact && (
                          <div className="flex items-center gap-1 mb-2">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">
                              Impact: {suggestion.impact}
                            </span>
                          </div>
                        )}
                        {suggestion.implementation && (
                          <div className="mt-2 space-y-1">
                            {suggestion.implementation.map((step, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="text-gray-400">{i + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {onSuggestionApply && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSuggestionApply(suggestion)}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Wins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: rec }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Warnings and Issues */}
        <TabsContent value="warnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issues & Warnings</CardTitle>
              <CardDescription>
                Problems that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.warnings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No issues detected!</p>
                  <p className="text-xs mt-1">Your garden is well optimized</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysis.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${getSeverityColor(warning.severity)}`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{warning.title}</div>
                          <p className="text-sm mt-1">{warning.description}</p>
                          {warning.solution && (
                            <div className="mt-2 p-2 bg-white/50 rounded text-sm">
                              <span className="font-medium">Solution: </span>
                              {warning.solution}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Analysis */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nutritional Value</CardTitle>
              <CardDescription>
                Health benefits of your garden produce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600">
                  {analysis.yieldPrediction.nutritionScore}
                </div>
                <p className="text-sm text-gray-500">Nutrition Score</p>
                <Progress value={analysis.yieldPrediction.nutritionScore} className="w-32 mx-auto mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {(analysis.yieldPrediction.caloriesTotal / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-gray-600">Total Calories</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {analysis.yieldPrediction.byPlant.length}
                  </p>
                  <p className="text-xs text-gray-600">Crop Varieties</p>
                </div>
              </div>

              {/* Nutritional breakdown by plant */}
              <div className="mt-4 space-y-2">
                {analysis.yieldPrediction.byPlant.map((plant, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{plant.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plant.nutritionalValue.vitamins.map(v => (
                            <Badge key={v} variant="outline" className="text-xs">
                              Vit {v}
                            </Badge>
                          ))}
                          {plant.nutritionalValue.minerals.slice(0, 2).map(m => (
                            <Badge key={m} variant="outline" className="text-xs">
                              {m}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">
                          {plant.nutritionalValue.calories.toFixed(0)} cal
                        </p>
                        <p className="text-xs text-gray-500">
                          {plant.expectedYieldLbs.toFixed(1)} lbs
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}