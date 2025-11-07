/**
 * Progress Tracking Panel
 *
 * Document garden progress over time
 * Record observations, successes, and lessons learned
 * Track actual vs planned outcomes
 * Photo documentation placeholders
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Camera,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Image as ImageIcon,
  Sprout,
  Droplets,
  Bug,
  Thermometer,
  Award,
  BookOpen,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import { cn } from '@/lib/utils'

interface ProgressTrackingPanelProps {
  gardenBeds: GardenBed[]
}

interface ProgressEntry {
  id: string
  date: string
  category: 'observation' | 'success' | 'challenge' | 'harvest' | 'maintenance' | 'weather'
  title: string
  description: string
  photoCount: number
  plantIds?: string[]
  rating?: 'excellent' | 'good' | 'fair' | 'poor'
}

interface PlantPerformance {
  plantId: string
  plantName: string
  expectedGrowth: number
  actualGrowth: number
  health: 'thriving' | 'healthy' | 'struggling' | 'failed'
  notes: string
}

// Mock data - in a real app, this would come from a database
const MOCK_PROGRESS_ENTRIES: ProgressEntry[] = [
  {
    id: '1',
    date: '2025-11-01',
    category: 'success',
    title: 'Tomatoes producing heavily',
    description:
      'Cherry tomatoes are producing 2-3 lbs per week. Much earlier than expected! Companion planting with basil seems to be working.',
    photoCount: 3,
    plantIds: ['tomato-1'],
    rating: 'excellent',
  },
  {
    id: '2',
    date: '2025-10-28',
    category: 'challenge',
    title: 'Aphid pressure on kale',
    description:
      'Noticed aphid colony on kale leaves. Sprayed with neem oil. Should have planted more nasturtiums as trap crops.',
    photoCount: 2,
    plantIds: ['kale-1'],
    rating: 'fair',
  },
  {
    id: '3',
    date: '2025-10-15',
    category: 'observation',
    title: 'Soil moisture excellent in bed 2',
    description:
      'Mulch layer is working great. Soil staying moist even during hot days. Neighboring bed 3 without mulch drying out much faster.',
    photoCount: 1,
    rating: 'excellent',
  },
  {
    id: '4',
    date: '2025-10-01',
    category: 'harvest',
    title: 'First squash harvest',
    description:
      'Harvested 8 zucchini and 4 yellow squash. Total weight ~12 lbs. Planted May 15, so 138 days to first harvest.',
    photoCount: 4,
    plantIds: ['squash-1'],
    rating: 'good',
  },
  {
    id: '5',
    date: '2025-09-20',
    category: 'weather',
    title: 'Heat wave stress',
    description:
      'Week of 95°F+ temps. Lettuce bolted. Tomatoes showing blossom end rot. Increased watering schedule.',
    photoCount: 2,
    rating: 'poor',
  },
]

const MOCK_PLANT_PERFORMANCE: PlantPerformance[] = [
  {
    plantId: 'tomato-1',
    plantName: 'Cherry Tomatoes',
    expectedGrowth: 60,
    actualGrowth: 85,
    health: 'thriving',
    notes: 'Exceeded expectations. Companion planting with basil working well.',
  },
  {
    plantId: 'kale-1',
    plantName: 'Lacinato Kale',
    expectedGrowth: 70,
    actualGrowth: 55,
    health: 'struggling',
    notes: 'Aphid pressure. Need more beneficial insect habitat nearby.',
  },
  {
    plantId: 'squash-1',
    plantName: 'Summer Squash',
    expectedGrowth: 80,
    actualGrowth: 75,
    health: 'healthy',
    notes: 'Good production. Powdery mildew appearing late season - typical.',
  },
  {
    plantId: 'lettuce-1',
    plantName: 'Mixed Lettuce',
    expectedGrowth: 50,
    actualGrowth: 30,
    health: 'failed',
    notes: 'Bolted during heat wave. Need shade cloth for summer plantings.',
  },
]

export function ProgressTrackingPanel({ gardenBeds }: ProgressTrackingPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [newEntryOpen, setNewEntryOpen] = useState(false)

  // Filter entries by category
  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_PROGRESS_ENTRIES
    return MOCK_PROGRESS_ENTRIES.filter((entry) => entry.category === selectedCategory)
  }, [selectedCategory])

  // Calculate summary statistics
  const stats = useMemo(() => {
    const totalEntries = MOCK_PROGRESS_ENTRIES.length
    const successes = MOCK_PROGRESS_ENTRIES.filter((e) => e.category === 'success').length
    const challenges = MOCK_PROGRESS_ENTRIES.filter((e) => e.category === 'challenge').length
    const harvests = MOCK_PROGRESS_ENTRIES.filter((e) => e.category === 'harvest').length
    const totalPhotos = MOCK_PROGRESS_ENTRIES.reduce((sum, e) => sum + e.photoCount, 0)

    const excellentRatings = MOCK_PROGRESS_ENTRIES.filter((e) => e.rating === 'excellent').length
    const overallSuccess = Math.round((excellentRatings / totalEntries) * 100)

    return {
      totalEntries,
      successes,
      challenges,
      harvests,
      totalPhotos,
      overallSuccess,
    }
  }, [])

  // Plant performance summary
  const performanceSummary = useMemo(() => {
    const thriving = MOCK_PLANT_PERFORMANCE.filter((p) => p.health === 'thriving').length
    const healthy = MOCK_PLANT_PERFORMANCE.filter((p) => p.health === 'healthy').length
    const struggling = MOCK_PLANT_PERFORMANCE.filter((p) => p.health === 'struggling').length
    const failed = MOCK_PLANT_PERFORMANCE.filter((p) => p.health === 'failed').length
    const total = MOCK_PLANT_PERFORMANCE.length

    const avgExpected =
      MOCK_PLANT_PERFORMANCE.reduce((sum, p) => sum + p.expectedGrowth, 0) / total
    const avgActual = MOCK_PLANT_PERFORMANCE.reduce((sum, p) => sum + p.actualGrowth, 0) / total

    return {
      thriving,
      healthy,
      struggling,
      failed,
      total,
      avgExpected: Math.round(avgExpected),
      avgActual: Math.round(avgActual),
    }
  }, [])

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Progress Tracking</h2>
          <p className="text-muted-foreground">
            Document your garden's journey and learn from experience
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Journal Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.totalPhotos} photos documented
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.overallSuccess}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stats.successes} successes, {stats.challenges} challenges
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different tracking views */}
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="performance">Plant Performance</TabsTrigger>
            <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-4">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Filter:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="observation">Observations</SelectItem>
                  <SelectItem value="success">Successes</SelectItem>
                  <SelectItem value="challenge">Challenges</SelectItem>
                  <SelectItem value="harvest">Harvests</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="weather">Weather Events</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => setNewEntryOpen(!newEntryOpen)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>

            {/* New Entry Form */}
            {newEntryOpen && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-base">Add Progress Entry</CardTitle>
                  <CardDescription>Document what's happening in your garden</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry-date">Date</Label>
                      <Input
                        id="entry-date"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entry-category">Category</Label>
                      <Select defaultValue="observation">
                        <SelectTrigger id="entry-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="challenge">Challenge</SelectItem>
                          <SelectItem value="harvest">Harvest</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="weather">Weather Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-title">Title</Label>
                    <Input id="entry-title" placeholder="Brief summary..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-description">Description</Label>
                    <Textarea
                      id="entry-description"
                      placeholder="Detailed observations, measurements, or notes..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Photos</Label>
                    <Button variant="outline" size="sm" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photos (Coming Soon)
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Photo upload will be available in the next update
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Save Entry
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setNewEntryOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline entries */}
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const categoryConfig = {
                  observation: {
                    icon: AlertCircle,
                    color: 'text-blue-600',
                    bg: 'bg-blue-50 dark:bg-blue-950/20',
                  },
                  success: {
                    icon: CheckCircle2,
                    color: 'text-green-600',
                    bg: 'bg-green-50 dark:bg-green-950/20',
                  },
                  challenge: {
                    icon: XCircle,
                    color: 'text-red-600',
                    bg: 'bg-red-50 dark:bg-red-950/20',
                  },
                  harvest: {
                    icon: Sprout,
                    color: 'text-purple-600',
                    bg: 'bg-purple-50 dark:bg-purple-950/20',
                  },
                  maintenance: {
                    icon: CheckCircle2,
                    color: 'text-gray-600',
                    bg: 'bg-gray-50 dark:bg-gray-950/20',
                  },
                  weather: {
                    icon: Thermometer,
                    color: 'text-orange-600',
                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                  },
                }

                const config = categoryConfig[entry.category]
                const Icon = config.icon

                return (
                  <Card key={entry.id} className={config.bg}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'flex items-center justify-center w-10 h-10 rounded-full',
                              config.bg
                            )}
                          >
                            <Icon className={cn('h-5 w-5', config.color)} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{entry.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                              {entry.photoCount > 0 && (
                                <>
                                  <span className="text-muted-foreground">•</span>
                                  <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {entry.photoCount} photos
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {entry.rating && (
                          <Badge
                            variant="outline"
                            className={cn(
                              entry.rating === 'excellent' &&
                                'bg-green-100 text-green-800 border-green-300',
                              entry.rating === 'good' &&
                                'bg-blue-100 text-blue-800 border-blue-300',
                              entry.rating === 'fair' &&
                                'bg-yellow-100 text-yellow-800 border-yellow-300',
                              entry.rating === 'poor' && 'bg-red-100 text-red-800 border-red-300'
                            )}
                          >
                            {entry.rating}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Plant Performance View */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Overview</CardTitle>
                <CardDescription>How plants are doing vs expectations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {performanceSummary.thriving}
                    </div>
                    <div className="text-xs text-muted-foreground">Thriving</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {performanceSummary.healthy}
                    </div>
                    <div className="text-xs text-muted-foreground">Healthy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {performanceSummary.struggling}
                    </div>
                    <div className="text-xs text-muted-foreground">Struggling</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {performanceSummary.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <span className="text-sm text-muted-foreground">
                        {performanceSummary.avgActual}% vs {performanceSummary.avgExpected}%
                        expected
                      </span>
                    </div>
                    <Progress value={performanceSummary.avgActual} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual plant performance */}
            <div className="space-y-3">
              {MOCK_PLANT_PERFORMANCE.map((plant) => (
                <Card key={plant.plantId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{plant.plantName}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {plant.actualGrowth > plant.expectedGrowth && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                          {plant.actualGrowth < plant.expectedGrowth && (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          {plant.actualGrowth === plant.expectedGrowth && (
                            <Minus className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {plant.actualGrowth}% actual vs {plant.expectedGrowth}% expected
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          plant.health === 'thriving' &&
                            'bg-green-100 text-green-800 border-green-300',
                          plant.health === 'healthy' &&
                            'bg-blue-100 text-blue-800 border-blue-300',
                          plant.health === 'struggling' &&
                            'bg-yellow-100 text-yellow-800 border-yellow-300',
                          plant.health === 'failed' && 'bg-red-100 text-red-800 border-red-300'
                        )}
                      >
                        {plant.health}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={plant.actualGrowth} className="h-2" />
                    <p className="text-sm text-muted-foreground">{plant.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lessons Learned View */}
          <TabsContent value="lessons" className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  Key Lessons Learned
                </CardTitle>
                <CardDescription>Wisdom from your garden experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Success lessons */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    What Worked Well
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground">
                      • <strong>Companion planting:</strong> Tomatoes + basil partnership
                      exceeded expectations
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • <strong>Mulching:</strong> Heavy mulch kept soil moist during hot weather
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • <strong>Early planting:</strong> Spring-planted squash avoided pest
                      pressure
                    </li>
                  </ul>
                </div>

                {/* Challenge lessons */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground">
                      • <strong>Aphid control:</strong> Need more nasturtiums as trap crops
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • <strong>Summer lettuce:</strong> Requires shade cloth in hot climate
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • <strong>Watering schedule:</strong> Increase frequency during heat waves
                    </li>
                  </ul>
                </div>

                {/* Next season plans */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Sprout className="h-4 w-4" />
                    Plans for Next Season
                  </h3>
                  <ul className="space-y-2 ml-6">
                    <li className="text-sm text-muted-foreground">
                      • Add more beneficial insect habitat (yarrow, dill, fennel)
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • Install shade cloth system for summer greens
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • Increase mulch depth to 4-6 inches
                    </li>
                    <li className="text-sm text-muted-foreground">
                      • Try succession planting for continuous harvests
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Add lesson button */}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Lesson
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
