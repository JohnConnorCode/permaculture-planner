'use client'

import React, { useMemo } from 'react'
import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY, PlantInfo } from '@/lib/data/plant-library'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, TrendingUp } from 'lucide-react'

interface SmartSuggestionsProps {
  gardenData: GardenBed[]
  onPlantSelect: (plant: PlantInfo) => void
  selectedPlantId?: string
}

interface Suggestion {
  plant: PlantInfo
  reason: string
  score: number
  companionFor: string[]
}

/**
 * SmartSuggestions
 *
 * Analyzes existing garden design and suggests optimal companion plants
 *
 * Scoring algorithm:
 * - +3 points per companion match
 * - +2 points for compatible sun/water requirements
 * - +1 point for diversity (different plant family)
 * - -5 points if antagonistic to any existing plant
 */
export function SmartSuggestions({
  gardenData,
  onPlantSelect,
  selectedPlantId,
}: SmartSuggestionsProps) {
  const suggestions = useMemo(() => {
    // Get all planted plant IDs
    const plantedIds = new Set<string>()
    gardenData.forEach(bed => {
      bed.plants?.forEach(plant => {
        plantedIds.add(plant.plantId)
      })
    })

    // If no plants yet, show beginner-friendly options
    if (plantedIds.size === 0) {
      const beginnerPlants = [
        'tomato',
        'basil',
        'lettuce',
        'radish',
        'mint',
        'strawberry',
      ].map(id => {
        const plant = PLANT_LIBRARY.find(p => p.id === id)!
        return {
          plant,
          reason: 'Easy to grow for beginners',
          score: 10,
          companionFor: [],
        }
      })
      return beginnerPlants
    }

    // Score each unplanted plant
    const scored: Suggestion[] = []

    PLANT_LIBRARY.forEach(plant => {
      // Skip already planted
      if (plantedIds.has(plant.id)) return

      let score = 0
      const companionFor: string[] = []
      const reasons: string[] = []

      // Check compatibility with each planted plant
      plantedIds.forEach(plantedId => {
        const plantedInfo = PLANT_LIBRARY.find(p => p.id === plantedId)
        if (!plantedInfo) return

        // Check if this plant is a companion
        if (plantedInfo.companions.includes(plant.id)) {
          score += 3
          companionFor.push(plantedInfo.name)
        }

        // Check if antagonistic
        if (plantedInfo.antagonists.includes(plant.id)) {
          score -= 5
        }

        // Bonus for similar requirements (grows well in same conditions)
        if (plantedInfo.requirements.sun === plant.requirements.sun) {
          score += 1
        }
        if (plantedInfo.requirements.water === plant.requirements.water) {
          score += 1
        }
      })

      // Bonus for diversity (different category)
      const plantedCategories = Array.from(plantedIds).map(id => {
        const p = PLANT_LIBRARY.find(p => p.id === id)
        return p?.category
      })
      if (!plantedCategories.includes(plant.category)) {
        score += 1
        reasons.push('Adds diversity')
      }

      // Only suggest if positive score
      if (score > 0) {
        let reason = ''
        if (companionFor.length > 0) {
          reason = `Good companion for ${companionFor.slice(0, 2).join(', ')}`
          if (companionFor.length > 2) {
            reason += ` +${companionFor.length - 2} more`
          }
        } else if (reasons.length > 0) {
          reason = reasons[0]
        } else {
          reason = 'Compatible with your design'
        }

        scored.push({
          plant,
          reason,
          score,
          companionFor,
        })
      }
    })

    // Sort by score (highest first) and return top 8
    return scored.sort((a, b) => b.score - a.score).slice(0, 8)
  }, [gardenData])

  if (suggestions.length === 0) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Suggested Companions
          <Badge variant="secondary" className="ml-auto">
            <TrendingUp className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {suggestions.map(({ plant, reason, score }) => (
              <button
                key={plant.id}
                onClick={() => onPlantSelect(plant)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md hover:scale-[1.02] ${
                  selectedPlantId === plant.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{plant.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{plant.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {reason}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor:
                        score >= 6
                          ? '#22c55e'
                          : score >= 3
                          ? '#f59e0b'
                          : '#64748b',
                      color:
                        score >= 6
                          ? '#22c55e'
                          : score >= 3
                          ? '#f59e0b'
                          : '#64748b',
                    }}
                  >
                    {score >= 6 ? 'Excellent' : score >= 3 ? 'Good' : 'Compatible'}
                  </Badge>
                </div>

                <div className="flex gap-1 mt-2">
                  {plant.requirements.sun === 'full' && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      ☀️ Full Sun
                    </Badge>
                  )}
                  {plant.requirements.sun === 'partial' && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      ⛅ Partial
                    </Badge>
                  )}
                  {plant.requirements.water === 'high' && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      💧 High
                    </Badge>
                  )}
                  {plant.requirements.water === 'low' && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      🏜️ Low
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
