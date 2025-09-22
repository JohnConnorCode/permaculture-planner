'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar, Clock, Droplet, Sun, Thermometer, Wind,
  Sprout, Flower, TreePine, Leaf, Apple, Scissors,
  AlertTriangle, CheckCircle, Info, TrendingUp,
  Cloud, CloudRain, CloudSnow, Zap, Star
} from 'lucide-react'

interface SeasonalTimelineProps {
  hardinessZone?: string
  lastFrostDate?: Date
  firstFrostDate?: Date
  onPlantingSchedule?: (schedule: PlantingSchedule) => void
}

interface PlantingSchedule {
  crop: string
  startIndoors?: Date
  transplant?: Date
  directSow?: Date
  harvest?: Date[]
  tasks: GardenTask[]
}

interface GardenTask {
  id: string
  date: Date
  type: 'sow' | 'transplant' | 'fertilize' | 'prune' | 'harvest' | 'water' | 'pest-control' | 'cover'
  crop?: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  completed?: boolean
  weather?: WeatherCondition
}

interface WeatherCondition {
  temp: number
  precipitation: number
  frost: boolean
  suitable: boolean
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SEASONS = {
  spring: { months: [2, 3, 4], color: 'bg-green-100', icon: Sprout },
  summer: { months: [5, 6, 7], color: 'bg-yellow-100', icon: Sun },
  fall: { months: [8, 9, 10], color: 'bg-orange-100', icon: Leaf },
  winter: { months: [11, 0, 1], color: 'bg-blue-100', icon: CloudSnow }
}

// Crop planting data with nuanced timing
const CROP_SCHEDULES = {
  tomato: {
    name: 'Tomato',
    startIndoors: -8, // weeks before last frost
    transplant: 2, // weeks after last frost
    daysToHarvest: [60, 80],
    succession: 2, // weeks between plantings
    companions: ['basil', 'carrot', 'parsley'],
    avoid: ['brassicas', 'fennel'],
    waterNeeds: 'high',
    sunNeeds: 'full',
    tasks: [
      { week: 0, type: 'sow', description: 'Start seeds indoors under grow lights' },
      { week: 6, type: 'fertilize', description: 'Feed seedlings with diluted fertilizer' },
      { week: 10, type: 'transplant', description: 'Harden off and transplant outdoors' },
      { week: 12, type: 'water', description: 'Deep water and mulch' },
      { week: 14, type: 'prune', description: 'Remove suckers and lower leaves' },
      { week: 16, type: 'fertilize', description: 'Side-dress with compost' },
      { week: 20, type: 'harvest', description: 'Begin harvesting ripe fruit' }
    ]
  },
  lettuce: {
    name: 'Lettuce',
    startIndoors: -4,
    transplant: -2,
    directSow: -2,
    daysToHarvest: [30, 60],
    succession: 2,
    companions: ['carrot', 'radish', 'strawberry'],
    avoid: [],
    waterNeeds: 'moderate',
    sunNeeds: 'partial',
    coolSeason: true,
    tasks: [
      { week: 0, type: 'sow', description: 'Direct sow or transplant' },
      { week: 2, type: 'water', description: 'Keep soil consistently moist' },
      { week: 4, type: 'fertilize', description: 'Apply liquid fertilizer' },
      { week: 6, type: 'harvest', description: 'Begin harvesting outer leaves' }
    ]
  },
  carrot: {
    name: 'Carrot',
    directSow: -3,
    daysToHarvest: [70, 80],
    succession: 3,
    companions: ['lettuce', 'onion', 'pea'],
    avoid: ['dill'],
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    tasks: [
      { week: 0, type: 'sow', description: 'Direct sow seeds 1/4" deep' },
      { week: 3, type: 'water', description: 'Thin seedlings to 2" apart' },
      { week: 6, type: 'fertilize', description: 'Side-dress with compost' },
      { week: 12, type: 'harvest', description: 'Harvest when shoulders emerge' }
    ]
  },
  beans: {
    name: 'Beans',
    directSow: 2,
    daysToHarvest: [50, 65],
    succession: 2,
    companions: ['corn', 'squash', 'radish'],
    avoid: ['onion', 'garlic'],
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    nitrogenFixer: true,
    tasks: [
      { week: 0, type: 'sow', description: 'Direct sow after soil warms' },
      { week: 2, type: 'water', description: 'Water at base of plants' },
      { week: 6, type: 'harvest', description: 'Pick beans every 2-3 days' }
    ]
  }
}

export function SeasonalTimeline({
  hardinessZone = '7a',
  lastFrostDate = new Date(new Date().getFullYear(), 3, 15), // April 15
  firstFrostDate = new Date(new Date().getFullYear(), 10, 15), // Nov 15
  onPlantingSchedule
}: SeasonalTimelineProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['tomato', 'lettuce', 'carrot'])
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'tasks'>('timeline')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue'>('upcoming')

  // Calculate frost-free days
  const frostFreeDays = useMemo(() => {
    const days = Math.floor((firstFrostDate.getTime() - lastFrostDate.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }, [lastFrostDate, firstFrostDate])

  // Generate planting schedules for selected crops
  const plantingSchedules = useMemo(() => {
    return selectedCrops.map(cropId => {
      const crop = CROP_SCHEDULES[cropId as keyof typeof CROP_SCHEDULES]
      if (!crop) return null

      const schedule: PlantingSchedule = {
        crop: crop.name,
        tasks: []
      }

      // Calculate dates based on frost dates
      if ('startIndoors' in crop) {
        const weeksBeforeFrost = crop.startIndoors
        schedule.startIndoors = new Date(lastFrostDate.getTime() + (weeksBeforeFrost * 7 * 24 * 60 * 60 * 1000))
      }

      if ('transplant' in crop) {
        const weeksAfterFrost = crop.transplant
        schedule.transplant = new Date(lastFrostDate.getTime() + (weeksAfterFrost * 7 * 24 * 60 * 60 * 1000))
      }

      if ('directSow' in crop) {
        const weeksFromFrost = crop.directSow
        schedule.directSow = new Date(lastFrostDate.getTime() + (weeksFromFrost * 7 * 24 * 60 * 60 * 1000))
      }

      // Calculate harvest dates
      const plantingDate = schedule.transplant || schedule.directSow || schedule.startIndoors
      if (plantingDate && crop.daysToHarvest) {
        schedule.harvest = crop.daysToHarvest.map(days =>
          new Date(plantingDate.getTime() + (days * 24 * 60 * 60 * 1000))
        )
      }

      // Generate tasks with dates
      const baseDate = schedule.directSow || schedule.transplant || schedule.startIndoors
      if (baseDate) {
        schedule.tasks = crop.tasks.map((task, index) => ({
          id: `${cropId}-task-${index}`,
          date: new Date(baseDate.getTime() + (task.week * 7 * 24 * 60 * 60 * 1000)),
          type: task.type as GardenTask['type'],
          crop: crop.name,
          description: task.description,
          priority: task.week === 0 ? 'high' : task.type === 'harvest' ? 'high' : 'medium',
          completed: false
        }))
      }

      return schedule
    }).filter(Boolean) as PlantingSchedule[]
  }, [selectedCrops, lastFrostDate, firstFrostDate])

  // Get all tasks sorted by date
  const allTasks = useMemo(() => {
    const tasks: GardenTask[] = []
    plantingSchedules.forEach(schedule => {
      tasks.push(...schedule.tasks)
    })
    return tasks.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [plantingSchedules])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const now = new Date()
    switch (filter) {
      case 'upcoming':
        return allTasks.filter(task =>
          task.date >= now &&
          task.date <= new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
        )
      case 'overdue':
        return allTasks.filter(task => task.date < now && !task.completed)
      default:
        return allTasks
    }
  }, [allTasks, filter])

  const getTaskIcon = (type: GardenTask['type']) => {
    const icons = {
      sow: Sprout,
      transplant: Flower,
      fertilize: Zap,
      prune: Scissors,
      harvest: Apple,
      water: Droplet,
      'pest-control': AlertTriangle,
      cover: Cloud
    }
    return icons[type] || Info
  }

  const getTaskColor = (priority: GardenTask['priority']) => {
    const colors = {
      critical: 'text-red-600 bg-red-50',
      high: 'text-orange-600 bg-orange-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    }
    return colors[priority]
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seasonal Garden Timeline
          </CardTitle>
          <CardDescription>
            Zone {hardinessZone} • {frostFreeDays} frost-free days •
            Last frost: {lastFrostDate.toLocaleDateString()} •
            First frost: {firstFrostDate.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(SEASONS).map(([season, data]) => {
              const SeasonIcon = data.icon
              return (
                <div key={season} className={`p-3 rounded-lg ${data.color}`}>
                  <div className="flex items-center gap-2">
                    <SeasonIcon className="h-4 w-4" />
                    <span className="font-medium capitalize">{season}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {data.months.map(m => MONTHS[m]).join(', ')}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="upcoming">Next 30 Days</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Planting & Harvest Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {plantingSchedules.map((schedule, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant="outline">{schedule.crop}</Badge>
                      <div className="flex-1">
                        <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                          {/* Growing season bar */}
                          <div
                            className="absolute h-full bg-gradient-to-r from-green-200 via-green-400 to-amber-400"
                            style={{
                              left: '20%',
                              width: '60%'
                            }}
                          />

                          {/* Key dates markers */}
                          {schedule.startIndoors && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
                              style={{ left: '20%' }}
                              title={`Start indoors: ${schedule.startIndoors.toLocaleDateString()}`}
                            />
                          )}
                          {schedule.transplant && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-green-600 rounded-full"
                              style={{ left: '35%' }}
                              title={`Transplant: ${schedule.transplant.toLocaleDateString()}`}
                            />
                          )}
                          {schedule.harvest?.[0] && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-600 rounded-full"
                              style={{ left: '70%' }}
                              title={`Harvest: ${schedule.harvest[0].toLocaleDateString()}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Month labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      {MONTHS.map(month => (
                        <span key={month}>{month.substring(0, 1)}</span>
                      ))}
                    </div>

                    {/* Task indicators */}
                    <div className="flex gap-2 mt-2">
                      {schedule.tasks.slice(0, 5).map(task => {
                        const TaskIcon = getTaskIcon(task.type)
                        return (
                          <div key={task.id} className={`p-1 rounded ${getTaskColor(task.priority)}`}>
                            <TaskIcon className="h-3 w-3" />
                          </div>
                        )
                      })}
                      {schedule.tasks.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{schedule.tasks.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Planting Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {MONTHS.map((month, monthIndex) => {
                const monthTasks = allTasks.filter(task =>
                  task.date.getMonth() === monthIndex
                )

                // Find season for this month
                const season = Object.entries(SEASONS).find(([_, data]) =>
                  data.months.includes(monthIndex)
                )?.[0]
                const seasonData = season ? SEASONS[season as keyof typeof SEASONS] : null

                return (
                  <div
                    key={month}
                    className={`p-3 rounded-lg border ${seasonData?.color || 'bg-white'}`}
                  >
                    <div className="font-medium text-sm mb-2">{month}</div>
                    <div className="space-y-1">
                      {monthTasks.slice(0, 3).map(task => {
                        const TaskIcon = getTaskIcon(task.type)
                        return (
                          <div key={task.id} className="flex items-center gap-1 text-xs">
                            <TaskIcon className="h-3 w-3" />
                            <span className="truncate">{task.crop}</span>
                          </div>
                        )
                      })}
                      {monthTasks.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{monthTasks.length - 3} more
                        </div>
                      )}
                      {monthTasks.length === 0 && (
                        <div className="text-xs text-gray-400">No tasks</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks View */}
      {viewMode === 'tasks' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Garden Tasks ({filteredTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredTasks.map(task => {
                  const TaskIcon = getTaskIcon(task.type)
                  const isOverdue = task.date < new Date() && !task.completed

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.completed ? 'bg-gray-50 opacity-60' :
                        isOverdue ? 'bg-red-50 border-red-200' :
                        'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getTaskColor(task.priority)}`}>
                            <TaskIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{task.crop}</div>
                            <div className="text-sm text-gray-600">{task.description}</div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {task.date.toLocaleDateString()}
                              </div>
                              {task.weather && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Thermometer className="h-3 w-3" />
                                  {task.weather.temp}°F
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={task.completed ? "outline" : "ghost"}
                          size="sm"
                          onClick={() => {
                            // Toggle task completion
                            task.completed = !task.completed
                          }}
                        >
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Companion Planting Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Companion Planting Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedCrops.map(cropId => {
              const crop = CROP_SCHEDULES[cropId as keyof typeof CROP_SCHEDULES]
              if (!crop) return null

              const conflicts = selectedCrops.filter(otherId =>
                otherId !== cropId &&
                crop.avoid && crop.avoid.length > 0 &&
                crop.avoid.some((avoidCrop: string) => avoidCrop === otherId)
              )

              const companions = selectedCrops.filter(otherId =>
                otherId !== cropId &&
                crop.companions && crop.companions.length > 0 &&
                crop.companions.some((companionCrop: string) => companionCrop === otherId)
              )

              return (
                <div key={cropId} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{crop.name}</span>
                  <div className="flex gap-2">
                    {companions.length > 0 && (
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {companions.length} good companion{companions.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    {conflicts.length > 0 && (
                      <Badge variant="outline" className="text-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Conflicts with {conflicts.join(', ')}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Succession Planting Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Succession Planting Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {selectedCrops.map(cropId => {
              const crop = CROP_SCHEDULES[cropId as keyof typeof CROP_SCHEDULES]
              if (!crop || !crop.succession) return null

              return (
                <div key={cropId} className="flex items-center justify-between">
                  <span>{crop.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Plant every {crop.succession} weeks
                    </Badge>
                    <span className="text-xs text-gray-500">
                      for continuous harvest
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}