'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sun,
  Cloud,
  CloudRain,
  Sunrise,
  Sunset,
  MapPin,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import {
  calculateSeasonalSunExposure,
  Location,
} from '@/lib/analysis/sun-shade-calculator'
import { cn } from '@/lib/utils'
import { SiteData } from '@/lib/types/site-context'

interface SunAnalysisPanelProps {
  /** Current garden beds */
  gardenBeds: GardenBed[]
  /** Site data including location */
  siteData?: SiteData | null
}

/**
 * SunAnalysisPanel - Real sun exposure analysis using NOAA algorithms
 *
 * Features:
 * - Calculate sun hours per day (growing season average)
 * - Hour-by-hour sun exposure visualization
 * - Sun category (full sun / partial sun / shade)
 * - Plant recommendations based on sun requirements
 * - Peak sun hours identification
 */
export function SunAnalysisPanel({ gardenBeds, siteData }: SunAnalysisPanelProps) {
  // Calculate sun exposure if location is available
  const sunExposure = useMemo(() => {
    if (!siteData?.location) return null

    const location: Location = {
      lat: siteData.location.lat,
      lng: siteData.location.lng,
    }

    // Calculate seasonal average sun exposure
    return calculateSeasonalSunExposure(location, [])
  }, [siteData])

  const hasLocation = !!siteData?.location

  // Get recommendations based on sun exposure
  const recommendations = useMemo(() => {
    if (!sunExposure) return []

    const recs: string[] = []

    if (sunExposure.category === 'full_sun') {
      recs.push('Perfect for tomatoes, peppers, squash, and most vegetables')
      recs.push('Consider shade cloth for lettuce during peak summer')
      recs.push('Plant heat-loving crops in sunniest spots')
    } else if (sunExposure.category === 'partial_sun') {
      recs.push('Ideal for leafy greens, herbs, and root vegetables')
      recs.push('Avoid heavy-feeding sun lovers like tomatoes')
      recs.push('Perfect for salad garden and herb spirals')
    } else if (sunExposure.category === 'partial_shade') {
      recs.push('Focus on shade-tolerant crops: lettuce, spinach, kale')
      recs.push('Great for herbs like mint, parsley, chives')
      recs.push('Consider container gardening for mobility')
    } else {
      recs.push('Limited to shade-loving plants: lettuce, arugula')
      recs.push('Consider pruning trees to increase sun exposure')
      recs.push('Focus on perennial herbs that tolerate shade')
    }

    return recs
  }, [sunExposure])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-600" />
            Sun Analysis
          </h2>
          {sunExposure && (
            <Badge
              variant="outline"
              className="font-mono text-xs"
            >
              {sunExposure.hoursPerDay}h / day
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Real solar calculations using NOAA algorithms
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!hasLocation && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">
                  Location required for sun analysis
                </p>
                <p className="text-xs text-muted-foreground">
                  Complete the wizard and add your location to see accurate sun exposure calculations
                </p>
              </CardContent>
            </Card>
          )}

          {hasLocation && sunExposure && (
            <>
              {/* Sun Exposure Summary */}
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
                    <Sun className="h-5 w-5" />
                    Sun Exposure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      Growing Season Average
                    </span>
                    <Badge variant="secondary" className="font-mono text-lg">
                      {sunExposure.hoursPerDay} hours/day
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      Sun Category
                    </span>
                    <Badge
                      className={cn(
                        'font-medium',
                        sunExposure.category === 'full_sun' && 'bg-yellow-500 text-white',
                        sunExposure.category === 'partial_sun' && 'bg-yellow-400 text-yellow-900',
                        sunExposure.category === 'partial_shade' && 'bg-gray-400 text-white',
                        sunExposure.category === 'full_shade' && 'bg-gray-600 text-white'
                      )}
                    >
                      {sunExposure.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">
                      Peak Sun Hours
                    </span>
                    <span className="font-mono text-sm text-yellow-900 dark:text-yellow-100">
                      {sunExposure.peakHours.start}:00 - {sunExposure.peakHours.end}:00
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Sun Exposure */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sunrise className="h-4 w-4 text-orange-600" />
                    Hour-by-Hour Exposure
                  </CardTitle>
                  <CardDescription className="text-xs">
                    6am - 8pm during growing season
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-15 gap-1">
                    {sunExposure.hourly.map((hasSun, idx) => {
                      const hour = idx + 6 // Start at 6am
                      const isPeakHour =
                        hour >= sunExposure.peakHours.start &&
                        hour < sunExposure.peakHours.end

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className={cn(
                              'w-4 h-12 rounded transition-all',
                              hasSun
                                ? isPeakHour
                                  ? 'bg-yellow-500'
                                  : 'bg-yellow-300'
                                : 'bg-gray-200 dark:bg-gray-700'
                            )}
                            title={`${hour}:00 - ${hasSun ? 'Sun' : 'Shade'}`}
                          />
                          {(hour === 6 || hour === 12 || hour === 18) && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {hour}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-500" />
                      <span className="text-muted-foreground">Peak Sun</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-yellow-300" />
                      <span className="text-muted-foreground">Sun</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                      <span className="text-muted-foreground">Shade</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                    Planting Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span className="text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Location Info */}
              {siteData?.location && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-900 dark:text-blue-100">
                      <MapPin className="h-4 w-4" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Latitude:</span>
                      <span className="font-mono text-blue-900 dark:text-blue-100">
                        {siteData.location.lat.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Longitude:</span>
                      <span className="font-mono text-blue-900 dark:text-blue-100">
                        {siteData.location.lng.toFixed(4)}°
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-blue-700 dark:text-blue-300 text-[10px]">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Calculations based on May-September average
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Intensity Meter */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-600" />
                    Sun Intensity
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Adjusted for latitude and season
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Intensity</span>
                      <span className="font-medium">{sunExposure.intensity}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                        style={{ width: `${sunExposure.intensity}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {sunExposure.intensity >= 90 && 'Excellent growing conditions'}
                      {sunExposure.intensity >= 70 && sunExposure.intensity < 90 && 'Good sun exposure'}
                      {sunExposure.intensity >= 50 && sunExposure.intensity < 70 && 'Moderate conditions'}
                      {sunExposure.intensity < 50 && 'Limited sun exposure'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
