'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Play,
  Pause,
  TrendingUp,
  Droplets,
  Thermometer,
  Bug,
  Leaf,
  Activity,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Users,
  Target,
  Snowflake,
  Sun,
  Package,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import {
  initializeEnhancedSimulation,
  advanceEnhancedMonth,
  EnhancedSimulationState,
  EnhancedScenario,
  DEFAULT_ENHANCED_SCENARIO,
  DEFAULT_CLIMATE,
} from '@/lib/simulation/growth-engine-enhanced'
import { TimelineControls } from '@/components/simulation/timeline-controls'
import { cn } from '@/lib/utils'
import { useFeatureAccess } from '@/lib/subscription/subscription-context'

interface EnhancedSimulationPanelProps {
  gardenBeds: GardenBed[]
}

const SCENARIOS: Record<string, EnhancedScenario> = {
  realistic: {
    ...DEFAULT_ENHANCED_SCENARIO,
    name: 'Realistic Conditions',
    climate: {
      zone: '7a',
      firstFrostMonth: 10, // November
      lastFrostMonth: 3, // April
      averageRainfall: 3,
      temperatureModifier: 'normal',
    },
    budget: 500,
    maintenanceLevel: 'regular',
    useSuccessionPlanting: true,
    targetYield: 200,
  },
  drought: {
    ...DEFAULT_ENHANCED_SCENARIO,
    name: 'Drought / Climate Change',
    climate: {
      zone: '8a',
      firstFrostMonth: 11,
      lastFrostMonth: 2,
      averageRainfall: 1.5,
      temperatureModifier: 'hot',
    },
    budget: 500,
    maintenanceLevel: 'intensive',
    useSuccessionPlanting: true,
    targetYield: 150,
  },
  coldClimate: {
    ...DEFAULT_ENHANCED_SCENARIO,
    name: 'Cold Climate (Zone 4)',
    climate: {
      zone: '4b',
      firstFrostMonth: 9, // October
      lastFrostMonth: 4, // May
      averageRainfall: 2,
      temperatureModifier: 'cold',
    },
    budget: 500,
    maintenanceLevel: 'regular',
    useSuccessionPlanting: true,
    targetYield: 100,
  },
  lowBudget: {
    ...DEFAULT_ENHANCED_SCENARIO,
    name: 'Budget-Conscious',
    climate: DEFAULT_CLIMATE,
    budget: 150,
    maintenanceLevel: 'minimal',
    useSuccessionPlanting: false,
    targetYield: 80,
  },
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function EnhancedSimulationPanel({ gardenBeds }: EnhancedSimulationPanelProps) {
  const { hasAccess } = useFeatureAccess('canUseAICritique')
  const [simulationState, setSimulationState] = useState<EnhancedSimulationState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [selectedScenario, setSelectedScenario] = useState<string>('realistic')
  const [totalMonths] = useState(120) // 10 years
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [simulationCount, setSimulationCount] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  // Initialize simulation
  useEffect(() => {
    if (gardenBeds.length > 0 && !simulationState) {
      const initial = initializeEnhancedSimulation(gardenBeds, SCENARIOS[selectedScenario])
      setSimulationState(initial)
    }
  }, [gardenBeds, simulationState, selectedScenario])

  // Handle playback
  useEffect(() => {
    if (isPlaying && simulationState) {
      const interval = 500 / speed

      intervalRef.current = setInterval(() => {
        setSimulationState((prev) => {
          if (!prev || prev.currentMonth >= totalMonths) {
            setIsPlaying(false)
            return prev
          }
          return advanceEnhancedMonth(prev, SCENARIOS[selectedScenario])
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, selectedScenario, totalMonths, simulationState])

  const handlePlay = () => {
    if (!hasAccess && simulationCount >= 1) {
      return
    }
    setIsPlaying(true)
    setSimulationCount((c) => c + 1)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    const initial = initializeEnhancedSimulation(gardenBeds, SCENARIOS[selectedScenario])
    setSimulationState(initial)
  }

  const handleSeek = (month: number) => {
    setIsPlaying(false)
    if (simulationState) {
      let state = initializeEnhancedSimulation(gardenBeds, SCENARIOS[selectedScenario])
      // Advance to target month
      for (let i = 0; i < month; i++) {
        state = advanceEnhancedMonth(state, SCENARIOS[selectedScenario])
      }
      setSimulationState(state)
    }
  }

  // Recent events (high priority)
  const recentEvents = useMemo(() => {
    if (!simulationState) return []
    return simulationState.events
      .filter((e) => e.month >= simulationState.currentMonth - 6)
      .slice(-8)
      .reverse()
  }, [simulationState])

  // Current month's harvestable items
  const currentHarvest = useMemo(() => {
    if (!simulationState || !simulationState.harvestCalendar.length) return null
    return simulationState.harvestCalendar[0]
  }, [simulationState])

  // Upcoming tasks
  const upcomingTasks = useMemo(() => {
    if (!simulationState) return []
    return simulationState.tasks
      .filter((t) => t.month >= simulationState.currentMonth)
      .slice(0, 5)
  }, [simulationState])

  if (!simulationState) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Add plants to your garden to run realistic growth simulations
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { metrics, economics } = simulationState

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Realistic Growth Simulation
          </h2>
          <p className="text-muted-foreground">
            Science-based modeling with companion planting, frost dates, economics & more
          </p>
        </div>

        {/* Usage limit banner */}
        {!hasAccess && (
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">
                    Free Tier: {simulationCount}/1 simulation used
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => (window.location.href = '/pricing')}
                >
                  Upgrade for Unlimited
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenario selector */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Climate & Budget Scenario</CardTitle>
            <CardDescription>
              Test your design with realistic constraints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedScenario} onValueChange={(v) => {
              setSelectedScenario(v)
              handleReset()
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SCENARIOS).map(([key, scenario]) => (
                  <SelectItem key={key} value={key}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-blue-600" />
                <span>Zone: {simulationState.climate.zone}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>Budget: ${SCENARIOS[selectedScenario].budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-600" />
                <span>
                  Climate: {simulationState.climate.temperatureModifier}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-600" />
                <span>
                  Care: {SCENARIOS[selectedScenario].maintenanceLevel}
                </span>
              </div>
            </div>

            {SCENARIOS[selectedScenario].useSuccessionPlanting && (
              <Badge variant="outline" className="bg-green-50">
                <Package className="h-3 w-3 mr-1" />
                Succession Planting Enabled
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Timeline Controls */}
        <Card>
          <CardContent className="pt-6">
            <TimelineControls
              currentMonth={simulationState.currentMonth}
              totalMonths={totalMonths}
              isPlaying={isPlaying}
              speed={speed}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onSeek={handleSeek}
              onSpeedChange={setSpeed}
            />
          </CardContent>
        </Card>

        {/* Key Metrics - Always Visible */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                Garden Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(metrics.healthScore)}%
              </div>
              <Progress
                value={metrics.healthScore}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.alivePlants}/{metrics.totalPlants} plants alive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Total Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(metrics.totalYield)} lbs
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ${Math.round(economics.totalYieldValue)} market value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-3xl font-bold",
                economics.roi >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {economics.roi >= 0 ? '+' : ''}{Math.round(economics.roi)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {economics.breakEvenMonth !== null
                  ? `Break-even: Month ${economics.breakEvenMonth}`
                  : 'Not yet profitable'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Companion Pairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {metrics.companionPlantings}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.crowdedPlants > 0 && (
                  <span className="text-orange-600">
                    {metrics.crowdedPlants} crowded plants
                  </span>
                )}
                {metrics.crowdedPlants === 0 && (
                  <span className="text-green-600">
                    Optimal spacing
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="harvest">Harvest</TabsTrigger>
            <TabsTrigger value="economics">Economics</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Garden Visualization</CardTitle>
                <CardDescription>
                  Plant heights and health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {simulationState.plants.slice(0, 32).map((plant, i) => {
                    const maxHeight = 180 // inches
                    const heightPercent = (plant.height / maxHeight) * 100
                    const healthColors = {
                      excellent: 'bg-green-500',
                      good: 'bg-lime-500',
                      fair: 'bg-yellow-500',
                      poor: 'bg-orange-500',
                      dying: 'bg-red-500',
                    }

                    return (
                      <div
                        key={i}
                        className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
                        title={`${plant.plantInfo.name} - ${plant.health} - ${Math.round(plant.height)}" tall`}
                      >
                        {plant.isAlive ? (
                          <>
                            <div
                              className={cn(
                                'absolute bottom-0 w-full transition-all duration-300',
                                healthColors[plant.health]
                              )}
                              style={{ height: `${Math.min(100, heightPercent)}%` }}
                            />
                            <div className="absolute top-1 left-1/2 -translate-x-1/2">
                              <span className="text-xl">{plant.plantInfo.icon}</span>
                            </div>
                            {plant.companionBonus > 0.05 && (
                              <div className="absolute top-1 right-1">
                                <Users className="h-3 w-3 text-green-600" />
                              </div>
                            )}
                            {plant.spacingPenalty < -0.1 && (
                              <div className="absolute top-1 left-1">
                                <AlertTriangle className="h-3 w-3 text-orange-600" />
                              </div>
                            )}
                            {plant.stage === 'dormant' && (
                              <div className="absolute bottom-1 right-1">
                                <Snowflake className="h-3 w-3 text-blue-400" />
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-2xl">☠️</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {simulationState.plants.length > 32 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Showing 32 of {simulationState.plants.length} plants
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Production Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Currently Producing:</span>
                    <span className="font-semibold">{metrics.producingPlants} plants</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month's Yield:</span>
                    <span className="font-semibold">{Math.round(metrics.currentMonthlyYield)} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canopy Coverage:</span>
                    <span className="font-semibold">{Math.round(metrics.canopyCoverage)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biodiversity:</span>
                    <span className="font-semibold">{metrics.biodiversity} species</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dormant Plants:</span>
                    <span className="font-semibold">{metrics.dormantPlants}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Climate Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Current Season:</span>
                    <Badge variant="outline">
                      {simulationState.season.charAt(0).toUpperCase() + simulationState.season.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Frost Risk:</span>
                    <span className="font-semibold">
                      {(simulationState.month <= simulationState.climate.lastFrostMonth ||
                        simulationState.month >= simulationState.climate.firstFrostMonth)
                        ? '⚠️ Active'
                        : '✅ None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>USDA Zone:</span>
                    <span className="font-semibold">{simulationState.climate.zone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Harvest Calendar Tab */}
          <TabsContent value="harvest" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Month Harvest</CardTitle>
                <CardDescription>
                  {currentHarvest
                    ? `${currentHarvest.monthName} - ${currentHarvest.totalYield.toFixed(1)} lbs worth $${Math.round(currentHarvest.totalValue)}`
                    : 'Loading...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentHarvest && currentHarvest.harvestableItems.length > 0 ? (
                  <div className="space-y-2">
                    {currentHarvest.harvestableItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-medium">{item.plantName}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.quantity.toFixed(1)} lbs</div>
                          <div className="text-xs text-muted-foreground">${item.value.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No harvest this month
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12-Month Harvest Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-1">
                  {simulationState.harvestCalendar.map((month, i) => (
                    <div
                      key={i}
                      className={cn(
                        'aspect-square rounded p-1 text-center cursor-pointer transition-colors',
                        month.totalYield > 0
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 dark:bg-gray-800'
                      )}
                      title={`${month.monthName}: ${month.totalYield.toFixed(1)} lbs`}
                    >
                      <div className="text-xs font-medium">{month.monthName}</div>
                      {month.totalYield > 0 && (
                        <div className="text-xs">{Math.round(month.totalYield)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economics Tab */}
          <TabsContent value="economics" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${Math.round(economics.totalInvestment)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seeds + maintenance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total Yield Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${Math.round(economics.totalYieldValue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Market value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-2xl font-bold",
                    economics.totalYieldValue - economics.totalInvestment >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}>
                    ${Math.round(economics.totalYieldValue - economics.totalInvestment)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {economics.roi >= 0 ? '+' : ''}{Math.round(economics.roi)}% ROI
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Economics (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {economics.monthlyBreakdown.slice(-12).reverse().map((month, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          Month {month.month}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Costs: ${month.costs.toFixed(0)}
                        </span>
                        <span className="text-xs text-green-600">
                          Value: ${month.yieldValue.toFixed(0)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "font-semibold",
                          month.netProfit >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {month.netProfit >= 0 ? '+' : ''}${month.netProfit.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: ${month.cumulativeProfit.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Garden Tasks</CardTitle>
                <CardDescription>
                  Recommended maintenance and harvesting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingTasks.map((task, i) => {
                      const priorityColors = {
                        critical: 'border-red-500 bg-red-50 dark:bg-red-950/20',
                        high: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20',
                        medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
                        low: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
                      }

                      const taskIcons = {
                        plant: <Leaf className="h-4 w-4" />,
                        harvest: <Package className="h-4 w-4" />,
                        water: <Droplets className="h-4 w-4" />,
                        fertilize: <TrendingUp className="h-4 w-4" />,
                        prune: <Target className="h-4 w-4" />,
                        pest_control: <Bug className="h-4 w-4" />,
                        succession_plant: <Package className="h-4 w-4" />,
                      }

                      return (
                        <div
                          key={i}
                          className={cn(
                            'border-l-4 p-3 rounded',
                            priorityColors[task.priority]
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              {taskIcons[task.type]}
                              <div>
                                <div className="font-medium">{task.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {task.estimatedTime} min
                                  {task.cost && ` • $${task.cost}`}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No tasks scheduled
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  Last 6 months of garden activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvents.length > 0 ? (
                  <div className="space-y-2">
                    {recentEvents.map((event, i) => {
                      const severityColors = {
                        info: 'text-blue-600',
                        warning: 'text-orange-600',
                        error: 'text-red-600',
                      }

                      const eventIcons = {
                        planted: <Leaf className="h-4 w-4" />,
                        germinated: <Sun className="h-4 w-4" />,
                        first_harvest: <Package className="h-4 w-4 text-green-600" />,
                        peak_production: <TrendingUp className="h-4 w-4 text-green-600" />,
                        frost_damage: <Snowflake className="h-4 w-4 text-blue-600" />,
                        death: <AlertTriangle className="h-4 w-4 text-red-600" />,
                        succession_planted: <Package className="h-4 w-4 text-purple-600" />,
                        milestone: <CheckCircle2 className="h-4 w-4 text-green-600" />,
                        warning: <AlertTriangle className="h-4 w-4 text-orange-600" />,
                      }

                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded"
                        >
                          {eventIcons[event.type]}
                          <div className="flex-1">
                            <div className={cn(
                              'text-sm',
                              event.severity && severityColors[event.severity]
                            )}>
                              {event.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Month {event.month} • {MONTH_NAMES[event.month % 12]}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent events
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
