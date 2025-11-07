'use client'

import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Heart,
  AlertTriangle,
  Info,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'
import {
  analyzeCompanionPlanting,
  findApplicableGuilds,
  PLANT_GUILDS,
  Guild,
  CompanionWarning,
  CompanionRecommendation,
} from '@/lib/algorithms/companion-planting-engine'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'
import { cn } from '@/lib/utils'

interface CompanionPlantingPanelProps {
  /** Current garden beds */
  gardenBeds: GardenBed[]
  /** Callback to show companion lines on canvas */
  onShowLines?: (show: boolean) => void
  /** Callback when user wants to implement a guild */
  onImplementGuild?: (guild: Guild) => void
}

/**
 * CompanionPlantingPanel - Companion planting analysis and recommendations
 *
 * Features:
 * - Compatibility analysis with scores
 * - Warnings for antagonistic plants
 * - Recommendations for beneficial companions
 * - Pre-defined plant guilds
 * - Visual relationship display
 */
export function CompanionPlantingPanel({
  gardenBeds,
  onShowLines,
  onImplementGuild,
}: CompanionPlantingPanelProps) {
  // Analyze companion planting
  const analysis = useMemo(() => {
    return analyzeCompanionPlanting(gardenBeds)
  }, [gardenBeds])

  // Find applicable guilds
  const { implemented, possible } = useMemo(() => {
    return findApplicableGuilds(gardenBeds)
  }, [gardenBeds])

  const hasPlants = gardenBeds.some(bed => (bed.plants?.length || 0) > 0)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Companion Planting
          </h2>
          <Badge
            variant="outline"
            className={cn(
              analysis.score >= 80 ? 'border-green-500 text-green-700' :
              analysis.score >= 60 ? 'border-yellow-500 text-yellow-700' :
              'border-red-500 text-red-700'
            )}
          >
            Score: {analysis.score}/100
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Optimize plant relationships for better yields
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {!hasPlants && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Add plants to your garden to see companion planting analysis
                </p>
              </CardContent>
            </Card>
          )}

          {hasPlants && (
            <>
              {/* Overall Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Compatibility Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Score</span>
                      <span className="font-semibold">{analysis.score}%</span>
                    </div>
                    <Progress
                      value={analysis.score}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-3 w-3 text-green-500" />
                        <span className="text-2xl font-bold text-green-600">
                          {analysis.stats.goodPairs}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Good Pairs</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-2xl font-bold text-red-600">
                          {analysis.stats.badPairs}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Bad Pairs</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-2xl font-bold text-gray-600">
                        {analysis.stats.neutralPairs}
                      </span>
                      <p className="text-xs text-muted-foreground">Neutral</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Warnings ({analysis.warnings.length})
                  </h3>
                  {analysis.warnings.map((warning, idx) => (
                    <WarningCard key={idx} warning={warning} />
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Recommendations ({analysis.recommendations.length})
                  </h3>
                  {analysis.recommendations.map((rec, idx) => (
                    <RecommendationCard key={idx} recommendation={rec} />
                  ))}
                </div>
              )}

              {/* Implemented Guilds */}
              {implemented.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Implemented Guilds
                  </h3>
                  {implemented.map((guild, idx) => (
                    <GuildCard key={idx} guild={guild} status="implemented" />
                  ))}
                </div>
              )}

              {/* Possible Guilds */}
              {possible.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Suggested Guilds
                  </h3>
                  {possible.slice(0, 3).map((guild, idx) => (
                    <GuildCard
                      key={idx}
                      guild={guild}
                      status="possible"
                      onImplement={onImplementGuild}
                    />
                  ))}
                </div>
              )}

              {/* All Guilds Reference */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Guild Library
                </h3>
                {PLANT_GUILDS.map((guild, idx) => (
                  <GuildCard key={idx} guild={guild} status="reference" />
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function WarningCard({ warning }: { warning: CompanionWarning }) {
  const plant1 = PLANT_LIBRARY.find(p => p.id === warning.plant1Id)
  const plant2 = PLANT_LIBRARY.find(p => p.id === warning.plant2Id)

  return (
    <Card className={cn(
      'border-l-4',
      warning.severity === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
      warning.severity === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
      'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
    )}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">
              {plant1?.icon} {warning.plant1Name} ⚠️ {plant2?.icon} {warning.plant2Name}
            </p>
            <p className="text-xs text-muted-foreground">
              In: {warning.bedName}
            </p>
            <p className="text-xs">{warning.message}</p>
            <p className="text-xs text-muted-foreground italic">
              💡 {warning.suggestion}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationCard({ recommendation }: { recommendation: CompanionRecommendation }) {
  const plant = PLANT_LIBRARY.find(p => p.id === recommendation.plantId)

  return (
    <Card className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {plant?.icon} {recommendation.plantName}
              </p>
              <Badge variant="outline" className="text-xs">
                {recommendation.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              In: {recommendation.bedName}
            </p>
            <p className="text-xs">{recommendation.message}</p>
            {recommendation.suggestedCompanions && (
              <div className="flex flex-wrap gap-1 mt-2">
                {recommendation.suggestedCompanions.map(companionId => {
                  const companion = PLANT_LIBRARY.find(p => p.id === companionId)
                  return companion ? (
                    <Badge key={companionId} variant="secondary" className="text-xs">
                      {companion.icon} {companion.name}
                    </Badge>
                  ) : null
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface GuildCardProps {
  guild: Guild
  status: 'implemented' | 'possible' | 'reference'
  onImplement?: (guild: Guild) => void
}

function GuildCard({ guild, status, onImplement }: GuildCardProps) {
  return (
    <Card className={cn(
      status === 'implemented' && 'bg-green-50 dark:bg-green-950/20 border-green-200',
      status === 'possible' && 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm flex items-center gap-2">
              {guild.name}
              {status === 'implemented' && (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              )}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {guild.description}
            </CardDescription>
          </div>
          {status === 'possible' && onImplement && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onImplement(guild)}
            >
              Add Guild
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium mb-1">Core Plants:</p>
          <div className="flex flex-wrap gap-1">
            {guild.coreSpecies.map(plantId => {
              const plant = PLANT_LIBRARY.find(p => p.id === plantId)
              return plant ? (
                <Badge key={plantId} variant="default" className="text-xs">
                  {plant.icon} {plant.name}
                </Badge>
              ) : (
                <Badge key={plantId} variant="outline" className="text-xs">
                  {plantId}
                </Badge>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-1">Support Plants:</p>
          <div className="flex flex-wrap gap-1">
            {guild.supportSpecies.map(plantId => {
              const plant = PLANT_LIBRARY.find(p => p.id === plantId)
              return plant ? (
                <Badge key={plantId} variant="secondary" className="text-xs">
                  {plant.icon} {plant.name}
                </Badge>
              ) : (
                <Badge key={plantId} variant="outline" className="text-xs">
                  {plantId}
                </Badge>
              )
            })}
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-xs font-medium mb-1">Benefits:</p>
          <ul className="space-y-0.5 text-xs text-muted-foreground list-disc list-inside">
            {guild.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="p-2 bg-muted/50 rounded text-xs">
          <p className="font-medium mb-1">Layout:</p>
          <p className="text-muted-foreground">{guild.layout}</p>
        </div>
      </CardContent>
    </Card>
  )
}
