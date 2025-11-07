/**
 * Implementation Phasing Panel - Break down large projects into manageable phases
 *
 * CRITICAL FOR ADOPTION: Most people get overwhelmed
 * This creates actionable, budgeted, time-bound implementation plans
 *
 * Features:
 * - Phase-by-phase breakdown (Year 1, 2, 3...)
 * - Budget allocation and tracking
 * - Labor hour estimates
 * - Priority ranking
 * - Seasonal timing
 * - Resource requirements
 * - ROI timeline
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Target,
  Hammer,
  Users,
  Zap,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import { cn } from '@/lib/utils'

interface ImplementationPhasingPanelProps {
  gardenBeds: GardenBed[]
}

interface Phase {
  id: number
  name: string
  timeline: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  budget: number
  laborHours: number
  tasks: Task[]
  roi: { timeframe: string; value: string }
}

interface Task {
  name: string
  category: 'infrastructure' | 'planting' | 'soil' | 'water'
  hours: number
  cost: number
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'any'
}

/**
 * Implementation Phasing Panel
 */
export function ImplementationPhasingPanel({ gardenBeds }: ImplementationPhasingPanelProps) {
  const [selectedPhase, setSelectedPhase] = useState<number>(1)

  // Generate implementation phases
  const phases = useMemo(() => generateImplementationPhases(gardenBeds), [gardenBeds])

  const currentPhase = phases.find((p) => p.id === selectedPhase)
  const totalBudget = phases.reduce((sum, p) => sum + p.budget, 0)
  const totalLaborHours = phases.reduce((sum, p) => sum + p.laborHours, 0)

  const hasElements = gardenBeds.length > 0

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Hammer className="h-5 w-5 text-orange-600" />
            Implementation Plan
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            {phases.length} phases
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Break your project into manageable, budgeted phases
        </p>
      </div>

      {!hasElements && (
        <div className="p-4">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6 text-center">
              <Hammer className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-2">No elements to phase</p>
              <p className="text-xs text-muted-foreground">
                Add beds and plants to generate an implementation plan
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {hasElements && (
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Project Overview */}
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-orange-900 dark:text-orange-100">
                  <Target className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border">
                    <DollarSign className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                      ${totalBudget.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Total Budget</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border">
                    <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {totalLaborHours}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Labor Hours</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {phases.length}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Years</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Phase</CardTitle>
                <CardDescription className="text-xs">
                  Click a phase to see detailed breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {phases.map((phase) => (
                  <Button
                    key={phase.id}
                    variant={selectedPhase === phase.id ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-mono text-xs',
                          phase.priority === 'critical' && 'bg-red-100 text-red-800',
                          phase.priority === 'high' && 'bg-orange-100 text-orange-800',
                          phase.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                          phase.priority === 'low' && 'bg-green-100 text-green-800'
                        )}
                      >
                        {phase.priority}
                      </Badge>
                      <span>{phase.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">${phase.budget.toLocaleString()}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Current Phase Detail */}
            {currentPhase && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{currentPhase.name}</CardTitle>
                      <Badge
                        className={cn(
                          'text-xs',
                          currentPhase.priority === 'critical' && 'bg-red-600',
                          currentPhase.priority === 'high' && 'bg-orange-600',
                          currentPhase.priority === 'medium' && 'bg-yellow-600',
                          currentPhase.priority === 'low' && 'bg-green-600'
                        )}
                      >
                        {currentPhase.priority} priority
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{currentPhase.timeline}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-700 dark:text-green-300">Budget</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          ${currentPhase.budget.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-xs text-blue-700 dark:text-blue-300">Labor</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {currentPhase.laborHours}h
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                          Return on Investment
                        </span>
                      </div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        {currentPhase.roi.value} in {currentPhase.roi.timeframe}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Breakdown */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tasks ({currentPhase.tasks.length})</CardTitle>
                    <CardDescription className="text-xs">
                      Detailed breakdown by category and season
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentPhase.tasks.map((task, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{task.name}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {task.season}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{task.hours}h</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>${task.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Implementation Tips */}
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <Zap className="h-4 w-4" />
                      Implementation Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-blue-900 dark:text-blue-100">
                    {getImplementationTips(currentPhase.id).map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Budget Comparison */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Budget Allocation</CardTitle>
                <CardDescription className="text-xs">How costs are distributed across phases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {phases.map((phase) => {
                  const percentage = (phase.budget / totalBudget) * 100
                  return (
                    <div key={phase.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{phase.name}:</span>
                        <span className="font-semibold">${phase.budget.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Seasonal Timing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Seasonal Timing Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SEASONAL_GUIDE.map((season, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">{season.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{season.months}</div>
                    <div className="space-y-1">
                      {season.tasks.map((task, taskIdx) => (
                        <div key={taskIdx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// Helper Functions & Data

function generateImplementationPhases(beds: GardenBed[]): Phase[] {
  const bedCount = beds.length
  const plantCount = beds.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0)

  return [
    {
      id: 1,
      name: 'Phase 1: Foundation',
      timeline: 'Year 1, Spring-Fall',
      priority: 'critical' as const,
      budget: 2500,
      laborHours: 80,
      roi: { timeframe: '6 months', value: 'First harvests, soil improvement' },
      tasks: [
        {
          name: 'Build raised beds',
          category: 'infrastructure' as const,
          hours: 24,
          cost: 800,
          season: 'spring' as const,
        },
        {
          name: 'Install irrigation system',
          category: 'water' as const,
          hours: 16,
          cost: 600,
          season: 'spring' as const,
        },
        {
          name: 'Soil amendment (compost, minerals)',
          category: 'soil' as const,
          hours: 12,
          cost: 400,
          season: 'spring' as const,
        },
        {
          name: 'Plant annuals and quick perennials',
          category: 'planting' as const,
          hours: 20,
          cost: 500,
          season: 'spring' as const,
        },
        {
          name: 'Mulch pathways',
          category: 'infrastructure' as const,
          hours: 8,
          cost: 200,
          season: 'summer' as const,
        },
      ],
    },
    {
      id: 2,
      name: 'Phase 2: Perennial Establishment',
      timeline: 'Year 2, Fall-Spring',
      priority: 'high' as const,
      budget: 1800,
      laborHours: 50,
      roi: { timeframe: '2-3 years', value: 'Perennial harvests begin' },
      tasks: [
        {
          name: 'Plant fruit trees',
          category: 'planting' as const,
          hours: 12,
          cost: 600,
          season: 'fall' as const,
        },
        {
          name: 'Install berry shrubs',
          category: 'planting' as const,
          hours: 8,
          cost: 400,
          season: 'fall' as const,
        },
        {
          name: 'Plant perennial vegetables',
          category: 'planting' as const,
          hours: 10,
          cost: 300,
          season: 'spring' as const,
        },
        {
          name: 'Build compost system',
          category: 'infrastructure' as const,
          hours: 12,
          cost: 300,
          season: 'any' as const,
        },
        {
          name: 'Add ground covers',
          category: 'planting' as const,
          hours: 8,
          cost: 200,
          season: 'spring' as const,
        },
      ],
    },
    {
      id: 3,
      name: 'Phase 3: Guild Development',
      timeline: 'Year 3-4',
      priority: 'medium' as const,
      budget: 1200,
      laborHours: 35,
      roi: { timeframe: '3-5 years', value: 'Self-sustaining guilds' },
      tasks: [
        {
          name: 'Plant nitrogen fixers',
          category: 'planting' as const,
          hours: 8,
          cost: 200,
          season: 'spring' as const,
        },
        {
          name: 'Add pollinator plants',
          category: 'planting' as const,
          hours: 6,
          cost: 250,
          season: 'spring' as const,
        },
        {
          name: 'Install rainwater catchment',
          category: 'water' as const,
          hours: 16,
          cost: 600,
          season: 'any' as const,
        },
        {
          name: 'Create swales',
          category: 'water' as const,
          hours: 5,
          cost: 150,
          season: 'fall' as const,
        },
      ],
    },
  ]
}

function getImplementationTips(phaseId: number): string[] {
  const tipsByPhase: Record<number, string[]> = {
    1: [
      'Start small - build 2-3 beds well rather than 10 poorly',
      'Invest in good soil from the start - it pays dividends for years',
      'Install irrigation before planting - retrofitting is harder',
      'Choose fast-growing annuals for quick wins and morale',
      "Document everything with photos - you'll forget what you planted where",
    ],
    2: [
      'Plant trees in fall for better establishment',
      'Space trees thinking of their mature size, not current size',
      'Berry bushes need 2-3 years to really produce - be patient',
      'Build compost bins near kitchen for ease of use',
      "Label everything - memory fades, labels don't",
    ],
    3: [
      'Plant nitrogen fixers under and around fruit trees',
      'Diverse plantings mean less pest pressure',
      'Rainwater catchment pays for itself quickly',
      'Swales can be dug by hand or with mini excavator',
      'This is when magic happens - plants start working together',
    ],
  }

  return tipsByPhase[phaseId] || []
}

const SEASONAL_GUIDE = [
  {
    name: 'Spring',
    months: 'March - May',
    tasks: [
      'Plant cool-season vegetables (lettuce, peas, spinach)',
      'Transplant perennials',
      'Prepare beds and add compost',
      'Start annuals from seed',
    ],
  },
  {
    name: 'Summer',
    months: 'June - August',
    tasks: [
      'Plant warm-season crops (tomatoes, peppers, squash)',
      'Mulch heavily to conserve water',
      'Maintain irrigation',
      'Harvest and preserve',
    ],
  },
  {
    name: 'Fall',
    months: 'September - November',
    tasks: [
      'Plant fruit trees and berry bushes',
      'Sow cover crops',
      'Plant garlic and perennial onions',
      'Clean up and compost',
    ],
  },
  {
    name: 'Winter',
    months: 'December - February',
    tasks: [
      "Plan next year's garden",
      'Order seeds and plants',
      'Build infrastructure (beds, paths, trellises)',
      'Prune fruit trees (when dormant)',
    ],
  },
]
