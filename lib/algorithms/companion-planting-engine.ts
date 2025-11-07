import { PLANT_LIBRARY, PlantInfo, checkCompatibility } from '../data/plant-library'
import { GardenBed } from '../garden/garden-types'

/**
 * Companion Planting Analysis Engine
 *
 * Analyzes plant relationships and provides recommendations
 * for optimal companion planting strategies.
 */

export interface CompanionRelationship {
  plant1Id: string
  plant2Id: string
  plant1Name: string
  plant2Name: string
  relationship: 'good' | 'bad' | 'neutral'
  distance: number // Distance in inches
  bedId: string
  reason?: string
}

export interface CompanionAnalysis {
  relationships: CompanionRelationship[]
  warnings: CompanionWarning[]
  recommendations: CompanionRecommendation[]
  score: number // 0-100
  stats: {
    totalPairs: number
    goodPairs: number
    badPairs: number
    neutralPairs: number
  }
}

export interface CompanionWarning {
  severity: 'error' | 'warning' | 'info'
  bedId: string
  bedName: string
  plant1Id: string
  plant2Id: string
  plant1Name: string
  plant2Name: string
  message: string
  suggestion: string
}

export interface CompanionRecommendation {
  type: 'add_companion' | 'remove_antagonist' | 'create_guild' | 'spacing_adjustment'
  bedId: string
  bedName: string
  plantId: string
  plantName: string
  message: string
  suggestedCompanions?: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface Guild {
  name: string
  description: string
  coreSpecies: string[]
  supportSpecies: string[]
  benefits: string[]
  layout: string
}

/**
 * Calculate distance between two points
 */
function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * Analyze companion planting relationships in garden beds
 */
export function analyzeCompanionPlanting(beds: GardenBed[]): CompanionAnalysis {
  const relationships: CompanionRelationship[] = []
  const warnings: CompanionWarning[] = []
  const recommendations: CompanionRecommendation[] = []

  let goodPairs = 0
  let badPairs = 0
  let neutralPairs = 0

  // Analyze each bed
  beds.forEach(bed => {
    if (!bed.plants || bed.plants.length < 2) return

    // Check all plant pairs in the bed
    for (let i = 0; i < bed.plants.length; i++) {
      for (let j = i + 1; j < bed.plants.length; j++) {
        const plant1 = bed.plants[i]
        const plant2 = bed.plants[j]

        const plant1Info = PLANT_LIBRARY.find(p => p.id === plant1.plantId)
        const plant2Info = PLANT_LIBRARY.find(p => p.id === plant2.plantId)

        if (!plant1Info || !plant2Info) continue

        // Calculate distance between plants
        const distance = calculateDistance(plant1.x, plant1.y, plant2.x, plant2.y)

        // Check compatibility
        const compatibility = checkCompatibility(plant1.plantId, plant2.plantId)

        const relationship: CompanionRelationship = {
          plant1Id: plant1.plantId,
          plant2Id: plant2.plantId,
          plant1Name: plant1Info.name,
          plant2Name: plant2Info.name,
          relationship: compatibility,
          distance,
          bedId: bed.id,
        }

        relationships.push(relationship)

        // Update stats
        if (compatibility === 'good') goodPairs++
        else if (compatibility === 'bad') badPairs++
        else neutralPairs++

        // Generate warnings for antagonistic plants that are too close
        if (compatibility === 'bad' && distance < 48) { // Within 4 feet
          warnings.push({
            severity: distance < 24 ? 'error' : 'warning',
            bedId: bed.id,
            bedName: bed.name || 'Unnamed Bed',
            plant1Id: plant1.plantId,
            plant2Id: plant2.plantId,
            plant1Name: plant1Info.name,
            plant2Name: plant2Info.name,
            message: `${plant1Info.name} and ${plant2Info.name} are antagonistic`,
            suggestion: distance < 24
              ? `Move plants further apart (currently ${Math.round(distance)}" apart, recommend 48"+ separation)`
              : `Consider separating these plants or moving one to a different bed`,
          })
        }

        // Generate recommendations for good companions that are missing
        if (compatibility === 'good' && distance > 60) {
          recommendations.push({
            type: 'spacing_adjustment',
            bedId: bed.id,
            bedName: bed.name || 'Unnamed Bed',
            plantId: plant1.plantId,
            plantName: plant1Info.name,
            message: `${plant1Info.name} and ${plant2Info.name} are good companions but far apart`,
            priority: 'low',
          })
        }
      }

      // Check for missing companions
      const plant = bed.plants[i]
      const plantInfo = PLANT_LIBRARY.find(p => p.id === plant.plantId)

      if (plantInfo && plantInfo.companions.length > 0) {
        const presentCompanions = bed.plants
          .filter(p => p.id !== plant.id)
          .map(p => p.plantId)

        const missingCompanions = plantInfo.companions.filter(
          companionId => !presentCompanions.includes(companionId)
        )

        if (missingCompanions.length > 0) {
          recommendations.push({
            type: 'add_companion',
            bedId: bed.id,
            bedName: bed.name || 'Unnamed Bed',
            plantId: plant.plantId,
            plantName: plantInfo.name,
            message: `${plantInfo.name} would benefit from companion plants`,
            suggestedCompanions: missingCompanions.slice(0, 3),
            priority: missingCompanions.length >= 3 ? 'high' : 'medium',
          })
        }
      }
    }
  })

  // Calculate overall score
  const totalPairs = relationships.length
  const score = totalPairs === 0 ? 100 : Math.round(
    ((goodPairs * 1.0 + neutralPairs * 0.5 - badPairs * 1.5) / totalPairs) * 100
  )

  return {
    relationships,
    warnings,
    recommendations: recommendations.slice(0, 10), // Top 10
    score: Math.max(0, Math.min(100, score)),
    stats: {
      totalPairs,
      goodPairs,
      badPairs,
      neutralPairs,
    },
  }
}

/**
 * Pre-defined plant guilds for companion planting
 */
export const PLANT_GUILDS: Guild[] = [
  {
    name: 'Three Sisters',
    description: 'Traditional Native American polyculture',
    coreSpecies: ['corn', 'beans', 'squash'],
    supportSpecies: ['sunflower'],
    benefits: [
      'Corn provides structure for beans to climb',
      'Beans fix nitrogen in soil for corn',
      'Squash shades soil, retains moisture, deters pests',
      'Diverse heights create microclimate'
    ],
    layout: 'Plant corn first, beans when corn is 6" tall, squash around perimeter'
  },
  {
    name: 'Tomato Guild',
    description: 'Pest protection and nutrient enhancement',
    coreSpecies: ['tomato'],
    supportSpecies: ['basil', 'carrot', 'marigold', 'nasturtium'],
    benefits: [
      'Basil improves tomato flavor and repels aphids',
      'Carrots aerate soil',
      'Marigolds deter nematodes and whiteflies',
      'Nasturtiums trap aphids'
    ],
    layout: 'Tomatoes in center, basil and marigolds around base, carrots between'
  },
  {
    name: 'Herb Spiral',
    description: 'Vertical herb garden for kitchen access',
    coreSpecies: ['rosemary', 'thyme', 'oregano', 'basil', 'mint'],
    supportSpecies: ['lavender'],
    benefits: [
      'Vertical design maximizes space',
      'Creates multiple microclimates',
      'Drought-tolerant herbs at top',
      'Moisture-loving herbs at bottom'
    ],
    layout: 'Spiral mound 1m tall, Mediterranean herbs at sunny top, mint at base'
  },
  {
    name: 'Brassica Guild',
    description: 'Cabbage family with companion aromatics',
    coreSpecies: ['cabbage'],
    supportSpecies: ['onion', 'rosemary', 'thyme', 'mint'],
    benefits: [
      'Onions repel cabbage moths',
      'Rosemary and thyme deter cabbage butterflies',
      'Mint deters flea beetles',
      'Aromatics mask brassica scent from pests'
    ],
    layout: 'Brassicas in rows with alliums and herbs interspersed'
  },
  {
    name: 'Berry Patch',
    description: 'Fruit production with pest management',
    coreSpecies: ['strawberry', 'raspberry', 'blueberry'],
    supportSpecies: ['garlic', 'thyme'],
    benefits: [
      'Garlic deters aphids and fungal diseases',
      'Thyme attracts beneficial insects',
      'Strawberries as groundcover',
      'Multiple harvest times'
    ],
    layout: 'Berries in blocks with garlic and thyme borders'
  },
  {
    name: 'Salad Bowl',
    description: 'Quick-growing salad greens',
    coreSpecies: ['lettuce', 'radish', 'spinach'],
    supportSpecies: ['carrot', 'strawberry'],
    benefits: [
      'Lettuce shades radish roots',
      'Radishes break up soil',
      'Multiple harvest cycles',
      'Strawberries as perennial anchor'
    ],
    layout: 'Lettuce and spinach in center, radishes around edge, strawberries as border'
  }
]

/**
 * Find applicable guilds based on plants in garden
 */
export function findApplicableGuilds(beds: GardenBed[]): {
  implemented: Guild[]
  possible: Guild[]
} {
  const allPlantIds = new Set<string>()
  beds.forEach(bed => {
    bed.plants?.forEach(plant => {
      allPlantIds.add(plant.plantId)
    })
  })

  const implemented: Guild[] = []
  const possible: Guild[] = []

  PLANT_GUILDS.forEach(guild => {
    const corePresent = guild.coreSpecies.every(plantId => allPlantIds.has(plantId))
    const supportPresent = guild.supportSpecies.some(plantId => allPlantIds.has(plantId))

    if (corePresent && supportPresent) {
      implemented.push(guild)
    } else if (corePresent || allPlantIds.has(guild.coreSpecies[0])) {
      possible.push(guild)
    }
  })

  return { implemented, possible }
}

/**
 * Generate companion planting lines for visualization
 */
export function generateCompanionLines(
  beds: GardenBed[],
  maxDistance: number = 48 // Only show relationships within 4 feet
): Array<{
  startX: number
  startY: number
  endX: number
  endY: number
  relationship: 'good' | 'bad' | 'neutral'
  plant1Id: string
  plant2Id: string
  plant1Name: string
  plant2Name: string
}> {
  const lines: Array<any> = []

  beds.forEach(bed => {
    if (!bed.plants || bed.plants.length < 2) return

    // Get bed offset
    const bedOffsetX = bed.points?.[0]?.x || 0
    const bedOffsetY = bed.points?.[0]?.y || 0

    for (let i = 0; i < bed.plants.length; i++) {
      for (let j = i + 1; j < bed.plants.length; j++) {
        const plant1 = bed.plants[i]
        const plant2 = bed.plants[j]

        const plant1Info = PLANT_LIBRARY.find(p => p.id === plant1.plantId)
        const plant2Info = PLANT_LIBRARY.find(p => p.id === plant2.plantId)

        if (!plant1Info || !plant2Info) continue

        const distance = calculateDistance(plant1.x, plant1.y, plant2.x, plant2.y)

        // Only show relationships within max distance
        if (distance > maxDistance) continue

        const compatibility = checkCompatibility(plant1.plantId, plant2.plantId)

        // Only show good and bad relationships (skip neutral)
        if (compatibility === 'neutral') continue

        lines.push({
          startX: bedOffsetX + plant1.x,
          startY: bedOffsetY + plant1.y,
          endX: bedOffsetX + plant2.x,
          endY: bedOffsetY + plant2.y,
          relationship: compatibility,
          plant1Id: plant1.plantId,
          plant2Id: plant2.plantId,
          plant1Name: plant1Info.name,
          plant2Name: plant2Info.name,
        })
      }
    }
  })

  return lines
}
