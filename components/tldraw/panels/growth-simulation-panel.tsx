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
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import {
  initializeSimulation,
  advanceMonth,
  jumpToMonth,
  SimulationState,
  SimulationScenario,
  compareScenarios,
} from '@/lib/simulation/growth-engine'
import { TimelineControls } from '@/components/simulation/timeline-controls'
import { cn } from '@/lib/utils'
import { useFeatureAccess } from '@/lib/subscription/subscription-context'

interface GrowthSimulationPanelProps {
  gardenBeds: GardenBed[]
}

const SCENARIOS: Record<string, SimulationScenario> = {
  optimal: {
    name: 'Optimal Conditions',
    waterAvailability: 100,
    temperature: 'normal',
    pestPressure: 'low',
    maintenanceLevel: 'intensive',
  },
  drought: {
    name: 'Drought Scenario',
    waterAvailability: 40,
    temperature: 'hot',
    pestPressure: 'medium',
    maintenanceLevel: 'regular',
  },
  neglect: {
    name: 'Minimal Maintenance',
    waterAvailability: 70,
    temperature: 'normal',
    pestPressure: 'high',
    maintenanceLevel: 'minimal',
  },
  ideal: {
    name: 'Perfect Permaculture',
    waterAvailability: 100,
    temperature: 'normal',
    pestPressure: 'low',
    maintenanceLevel: 'intensive',
  },
}

export function GrowthSimulationPanel({ gardenBeds }: GrowthSimulationPanelProps) {
  const { hasAccess } = useFeatureAccess('canUseAICritique')
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(5)
  const [selectedScenario, setSelectedScenario] = useState<string>('optimal')
  const [totalMonths] = useState(120) // 10 years
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [simulationCount, setSimulationCount] = useState(0)
  const [showComparison, setShowComparison] = useState(false)

  // Initialize simulation
  useEffect(() => {
    if (gardenBeds.length > 0 && !simulationState) {
      const initial = initializeSimulation(gardenBeds)
      setSimulationState(initial)
    }
  }, [gardenBeds, simulationState])

  // Handle playback
  useEffect(() => {
    if (isPlaying && simulationState) {
      // Base interval is 500ms, adjusted by speed
      const interval = 500 / speed

      intervalRef.current = setInterval(() => {
        setSimulationState((prev) => {
          if (!prev || prev.currentMonth >= totalMonths) {
            setIsPlaying(false)
            return prev
          }
          return advanceMonth(prev, SCENARIOS[selectedScenario])
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
      // Free tier limit
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
    const initial = initializeSimulation(gardenBeds)
    setSimulationState(initial)
  }

  const handleSeek = (month: number) => {
    setIsPlaying(false)
    if (simulationState) {
      const initial = initializeSimulation(gardenBeds)
      const newState = jumpToMonth(initial, month, SCENARIOS[selectedScenario])
      setSimulationState(newState)
    }
  }

  // Recent events
  const recentEvents = useMemo(() => {
    if (!simulationState) return []
    return simulationState.events
      .filter((e) => e.month >= simulationState.currentMonth - 3)
      .slice(-5)
  }, [simulationState])

  if (!simulationState) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Add plants to your garden to run simulations
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Growth Simulation
          </h2>
          <p className="text-muted-foreground">
            Watch your garden evolve over time with realistic growth modeling
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
            <CardTitle className="text-base">Simulation Scenario</CardTitle>
            <CardDescription>
              Test your design under different conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SCENARIOS).map(([key, scenario]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {key === 'drought' && <Droplets className="h-4 w-4 text-orange-600" />}
                      {key === 'optimal' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {key === 'neglect' && <Bug className="h-4 w-4 text-red-600" />}
                      {key === 'ideal' && <Sparkles className="h-4 w-4 text-purple-600" />}
                      <span>{scenario.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span>Water: {SCENARIOS[selectedScenario].waterAvailability}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-orange-600" />
                <span>
                  Temp: {SCENARIOS[selectedScenario].temperature}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Bug className="h-4 w-4 text-red-600" />
                <span>
                  Pests: {SCENARIOS[selectedScenario].pestPressure}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-green-600" />
                <span>
                  Care: {SCENARIOS[selectedScenario].maintenanceLevel}
                </span>
              </div>
            </div>
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

        {/* Metrics Dashboard */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4 text-green-600" />
                Plant Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {simulationState.metrics.alivePlants} / {simulationState.metrics.totalPlants}
              </div>
              <Progress
                value={(simulationState.metrics.alivePlants / simulationState.metrics.totalPlants) * 100}
                className="mt-2"
              />
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Producing: </span>
                  <span className="font-semibold">{simulationState.metrics.producingPlants}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Species: </span>
                  <span className="font-semibold">{simulationState.metrics.biodiversity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Cumulative Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(simulationState.metrics.totalYield)} lbs
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round(simulationState.metrics.currentMonthlyYield)} lbs/month current
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Production Level</span>
                  <span>{Math.round((simulationState.metrics.producingPlants / simulationState.metrics.totalPlants) * 100)}%</span>
                </div>
                <Progress
                  value={(simulationState.metrics.producingPlants / simulationState.metrics.totalPlants) * 100}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Canopy Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(simulationState.metrics.canopyCoverage)}%
              </div>
              <Progress value={simulationState.metrics.canopyCoverage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Target: 80-100% for mature food forest
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-600" />
                Total Biomass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(simulationState.metrics.biomass)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total plant mass (height × canopy)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visual representation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Garden Visualization</CardTitle>
            <CardDescription>Animated view of your garden growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-b from-sky-100 to-green-50 dark:from-sky-950/20 dark:to-green-950/20 rounded-lg overflow-hidden">
              {/* Simple plant visualization */}
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-8 gap-2 h-full">
                  {simulationState.plants.slice(0, 32).map((plant, i) => {
                    const heightPercent = Math.min((plant.height / 180) * 100, 100)
                    const opacity = plant.isAlive ? 1 : 0.2

                    return (
                      <div
                        key={plant.id}
                        className="relative flex items-end justify-center"
                        style={{ opacity }}
                      >
                        <div
                          className={cn(
                            'w-full rounded-t-full transition-all duration-300',
                            plant.plantInfo.category === 'tree' && 'bg-green-700',
                            plant.plantInfo.category === 'shrub' && 'bg-green-600',
                            plant.plantInfo.category === 'groundcover' && 'bg-green-500',
                            plant.plantInfo.category === 'herb' && 'bg-green-400',
                            plant.health === 'excellent' && 'brightness-110',
                            plant.health === 'good' && 'brightness-100',
                            plant.health === 'fair' && 'brightness-75',
                            plant.health === 'poor' && 'brightness-50'
                          )}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {plant.currentYield > 0 && (
                            <div className="absolute -top-2 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-900/90 rounded p-2 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-700 rounded" />
                  <span>Trees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded" />
                  <span>Shrubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span>Perennials</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span>Producing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events yet...</p>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm border-l-2 border-primary pl-3 py-1">
                    <span className="text-muted-foreground">
                      Year {Math.floor(event.month / 12)}, Month {event.month % 12}:
                    </span>
                    <span>{event.description}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
