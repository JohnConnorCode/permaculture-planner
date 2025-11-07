'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Sprout,
  Sun,
  Cloud,
  Snowflake,
  Leaf,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  ListTodo,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import {
  generateSeasonalTimeline,
  getCurrentPlantingWindow,
  generateTasksFromTimeline,
  SeasonalTimeline,
  PlantingWindow,
} from '@/lib/planning/seasonal-timeline'
import { syncTasksToSupabase } from '@/lib/supabase/task-sync'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SeasonalTimelinePanelProps {
  /** Current garden beds */
  gardenBeds: GardenBed[]
  /** Frost dates from wizard/site */
  frostDates?: {
    lastFrost: Date
    firstFrost: Date
  }
  /** USDA zone */
  usdaZone?: string
  /** Plan ID for saving tasks */
  planId?: string
}

/**
 * SeasonalTimelinePanel - Shows planting calendar based on frost dates
 *
 * Features:
 * - Season-by-season planting schedule
 * - Current planting window highlighted
 * - Succession planting recommendations
 * - Task generation from timeline
 */
export function SeasonalTimelinePanel({
  gardenBeds,
  frostDates,
  usdaZone = '7a',
  planId,
}: SeasonalTimelinePanelProps) {
  const [expandedSeason, setExpandedSeason] = React.useState<string | null>('current')
  const [generatingTasks, setGeneratingTasks] = useState(false)

  // Generate timeline from planted crops
  const timeline = useMemo(() => {
    if (!frostDates) {
      // Use default frost dates for zone 7a
      return generateSeasonalTimeline(
        [],
        {
          lastFrost: new Date(new Date().getFullYear(), 3, 15), // Apr 15
          firstFrost: new Date(new Date().getFullYear(), 9, 15), // Oct 15
        },
        usdaZone
      )
    }

    // Extract plant IDs from beds
    const plantIds = new Set<string>()
    gardenBeds.forEach(bed => {
      bed.plants?.forEach(plant => plantIds.add(plant.plantId))
    })

    return generateSeasonalTimeline(Array.from(plantIds), frostDates, usdaZone)
  }, [gardenBeds, frostDates, usdaZone])

  // Get current planting window
  const currentWindow = useMemo(() => {
    return getCurrentPlantingWindow(timeline)
  }, [timeline])

  const hasContent = gardenBeds.some(bed => bed.plants && bed.plants.length > 0)

  // Generate and save tasks to database
  const handleGenerateTasks = async () => {
    if (!planId) {
      toast.error('Cannot generate tasks', {
        description: 'Plan ID is required',
      })
      return
    }

    if (!frostDates) {
      toast.error('Cannot generate tasks', {
        description: 'Frost dates are required. Complete the wizard first.',
      })
      return
    }

    setGeneratingTasks(true)
    const toastId = toast.loading('Generating tasks from planting timeline...')

    try {
      // Generate tasks from timeline
      const tasks = generateTasksFromTimeline(timeline, planId)

      if (tasks.length === 0) {
        toast.dismiss(toastId)
        toast.info('No tasks to generate', {
          description: 'Add plants to create planting tasks',
        })
        setGeneratingTasks(false)
        return
      }

      // Save to Supabase
      const supabase = createClient()
      const result = await syncTasksToSupabase(supabase, planId, tasks as any)

      toast.dismiss(toastId)

      if (!result.success) {
        throw new Error(result.error || 'Failed to save tasks')
      }

      toast.success('✅ Tasks generated!', {
        description: `Created ${result.tasksCreated} new task(s) from your planting calendar`,
      })
    } catch (error) {
      toast.dismiss(toastId)
      console.error('Error generating tasks:', error)
      toast.error('Failed to generate tasks', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setGeneratingTasks(false)
    }
  }

  const seasons = [
    { key: 'spring', name: 'Spring', icon: Sprout, color: 'green', items: timeline.spring },
    { key: 'summer', name: 'Summer', icon: Sun, color: 'yellow', items: timeline.summer },
    { key: 'fall', name: 'Fall', icon: Leaf, color: 'orange', items: timeline.fall },
    { key: 'winter', name: 'Winter', icon: Snowflake, color: 'blue', items: timeline.winter },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Planting Calendar
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              Zone {usdaZone}
            </Badge>
            {hasContent && planId && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateTasks}
                disabled={generatingTasks}
              >
                <ListTodo className="h-3 w-3 mr-2" />
                {generatingTasks ? 'Generating...' : 'Generate Tasks'}
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Season-by-season planting schedule based on your frost dates
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!hasContent && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Add plants to see your planting calendar
                </p>
              </CardContent>
            </Card>
          )}

          {hasContent && (
            <>
              {/* Current Planting Window */}
              {currentWindow.length > 0 && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-green-900 dark:text-green-100">
                      <Clock className="h-5 w-5" />
                      Plant This Week
                    </CardTitle>
                    <CardDescription className="text-green-700 dark:text-green-300">
                      {currentWindow.length} action{currentWindow.length !== 1 ? 's' : ''} due
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentWindow.slice(0, 5).map((window, idx) => (
                      <PlantingWindowCard key={idx} window={window} compact />
                    ))}
                    {currentWindow.length > 5 && (
                      <p className="text-xs text-green-700 dark:text-green-300 text-center pt-2">
                        +{currentWindow.length - 5} more
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Seasonal Breakdown */}
              {seasons.map(season => (
                <Card key={season.key}>
                  <CardHeader
                    className="pb-3 cursor-pointer"
                    onClick={() => setExpandedSeason(expandedSeason === season.key ? null : season.key)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <season.icon className={cn('h-5 w-5', `text-${season.color}-600`)} />
                        {season.name}
                        <Badge variant="secondary" className="ml-2">
                          {season.items.length}
                        </Badge>
                      </CardTitle>
                      {expandedSeason === season.key ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedSeason === season.key && (
                    <CardContent className="space-y-3">
                      {season.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No planting activities for this season
                        </p>
                      ) : (
                        season.items.map((window, idx) => (
                          <PlantingWindowCard key={idx} window={window} />
                        ))
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* Frost Date Info */}
              {frostDates && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <AlertCircle className="h-4 w-4" />
                      Frost Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Last Spring Frost:</span>
                      <span className="font-mono text-blue-900 dark:text-blue-100">
                        {frostDates.lastFrost.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">First Fall Frost:</span>
                      <span className="font-mono text-blue-900 dark:text-blue-100">
                        {frostDates.firstFrost.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
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

interface PlantingWindowCardProps {
  window: PlantingWindow
  compact?: boolean
}

function PlantingWindowCard({ window, compact = false }: PlantingWindowCardProps) {
  const actionColors = {
    direct_sow: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    transplant: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    harvest: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    prune: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    mulch: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  }

  const priorityColors = {
    essential: 'border-red-300 bg-red-50 dark:bg-red-950/20',
    recommended: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20',
    optional: 'border-gray-300 bg-gray-50 dark:bg-gray-950/20',
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xl">{window.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{window.plantName}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {window.action.replace('_', ' ')}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {window.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-lg p-3', priorityColors[window.priority])}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{window.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium">{window.plantName}</p>
            <Badge className={cn('text-xs', actionColors[window.action])}>
              {window.action.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{window.notes}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {window.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
              {window.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
