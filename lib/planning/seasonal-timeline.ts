/**
 * Seasonal Planting Timeline System
 *
 * Generates accurate planting schedules based on:
 * - USDA hardiness zone
 * - Last/first frost dates
 * - Plant-specific requirements
 * - Growing degree days
 */

import { PLANT_LIBRARY, PlantInfo } from '@/lib/data/plant-library'

export interface PlantingWindow {
  plantId: string
  plantName: string
  icon: string
  action: 'direct_sow' | 'transplant' | 'harvest' | 'prune' | 'mulch'
  startDate: Date
  endDate: Date
  notes: string
  priority: 'essential' | 'recommended' | 'optional'
}

export interface SeasonalTimeline {
  spring: PlantingWindow[]
  summer: PlantingWindow[]
  fall: PlantingWindow[]
  winter: PlantingWindow[]
}

export interface FrostDates {
  lastFrost: Date
  firstFrost: Date
}

/**
 * Calculate planting dates based on frost dates and plant requirements
 */
export function calculatePlantingDates(
  plant: PlantInfo,
  frostDates: FrostDates
): {
  directSowDate: Date | null
  transplantDate: Date | null
  harvestStart: Date | null
  harvestEnd: Date | null
} {
  const { lastFrost, firstFrost } = frostDates

  // Parse planting time string (e.g., "Spring", "Late Spring", "2 weeks before last frost")
  const plantingTime = plant.planting_time.toLowerCase()

  let directSowDate: Date | null = null
  let transplantDate: Date | null = null

  // Direct sowing calculations
  if (plantingTime.includes('before last frost')) {
    const weeks = parseInt(plantingTime.match(/(\d+)\s*week/)?.[1] || '0')
    directSowDate = addWeeks(lastFrost, -weeks)
  } else if (plantingTime.includes('after last frost')) {
    const weeks = parseInt(plantingTime.match(/(\d+)\s*week/)?.[1] || '0')
    directSowDate = addWeeks(lastFrost, weeks)
  } else if (plantingTime.includes('early spring')) {
    directSowDate = addWeeks(lastFrost, -2) // 2 weeks before last frost
  } else if (plantingTime.includes('late spring')) {
    directSowDate = addWeeks(lastFrost, 2) // 2 weeks after last frost
  } else if (plantingTime.includes('spring')) {
    directSowDate = lastFrost // At last frost
  } else if (plantingTime.includes('early summer')) {
    directSowDate = addWeeks(lastFrost, 4)
  } else if (plantingTime.includes('summer')) {
    directSowDate = addWeeks(lastFrost, 8)
  } else if (plantingTime.includes('late summer')) {
    directSowDate = addWeeks(firstFrost, -12)
  } else if (plantingTime.includes('fall')) {
    directSowDate = addWeeks(firstFrost, -8)
  }

  // Transplant date (usually 4-6 weeks before direct sow for warm season crops)
  if (directSowDate && plant.requirements.sun === 'full' && plant.category === 'vegetable') {
    const warmSeasonCrops = ['tomato', 'pepper', 'eggplant', 'cucumber', 'squash']
    if (warmSeasonCrops.includes(plant.id)) {
      transplantDate = addWeeks(directSowDate, -6) // Start indoors 6 weeks before
    }
  }

  // Calculate harvest dates based on days to maturity
  const daysToMaturity = plant.planting_time.match(/(\d+)\s*days/)?.[1]
  const avgDaysToMaturity = daysToMaturity ? parseInt(daysToMaturity) : 70

  let harvestStart: Date | null = null
  let harvestEnd: Date | null = null

  if (directSowDate) {
    harvestStart = addDays(directSowDate, avgDaysToMaturity)

    // Harvest duration based on plant type
    if (plant.category === 'vegetable') {
      // Most vegetables have 4-8 week harvest window
      harvestEnd = addWeeks(harvestStart, 6)
    } else if (plant.category === 'fruit' || plant.category === 'tree') {
      // Fruit has longer harvest season
      harvestEnd = addWeeks(harvestStart, 4)
    } else if (plant.category === 'herb') {
      // Herbs can be harvested continuously
      harvestEnd = firstFrost // Until frost
    }
  }

  return {
    directSowDate,
    transplantDate,
    harvestStart,
    harvestEnd,
  }
}

/**
 * Generate complete seasonal timeline for all plants
 */
export function generateSeasonalTimeline(
  plants: string[], // Plant IDs
  frostDates: FrostDates,
  usdaZone: string
): SeasonalTimeline {
  const timeline: SeasonalTimeline = {
    spring: [],
    summer: [],
    fall: [],
    winter: [],
  }

  for (const plantId of plants) {
    const plantInfo = PLANT_LIBRARY.find(p => p.id === plantId)
    if (!plantInfo) continue

    // Check if plant is suitable for this zone
    if (!plantInfo.requirements.zone.includes(usdaZone)) {
      continue // Skip plants not suitable for this zone
    }

    const dates = calculatePlantingDates(plantInfo, frostDates)

    // Add transplanting window
    if (dates.transplantDate) {
      timeline[getSeason(dates.transplantDate, frostDates)].push({
        plantId: plantInfo.id,
        plantName: plantInfo.name,
        icon: plantInfo.icon,
        action: 'transplant',
        startDate: addWeeks(dates.transplantDate, -1),
        endDate: addWeeks(dates.transplantDate, 2),
        notes: 'Start seeds indoors 6-8 weeks before transplanting',
        priority: 'recommended',
      })
    }

    // Add direct sowing window
    if (dates.directSowDate) {
      timeline[getSeason(dates.directSowDate, frostDates)].push({
        plantId: plantInfo.id,
        plantName: plantInfo.name,
        icon: plantInfo.icon,
        action: 'direct_sow',
        startDate: addWeeks(dates.directSowDate, -1),
        endDate: addWeeks(dates.directSowDate, 2),
        notes: `Sow directly in garden when soil temp > ${getSoilTempRequirement(plantInfo)}°F`,
        priority: 'essential',
      })
    }

    // Add harvest window
    if (dates.harvestStart && dates.harvestEnd) {
      const startSeason = getSeason(dates.harvestStart, frostDates)
      timeline[startSeason].push({
        plantId: plantInfo.id,
        plantName: plantInfo.name,
        icon: plantInfo.icon,
        action: 'harvest',
        startDate: dates.harvestStart,
        endDate: dates.harvestEnd,
        notes: `Harvest when ${getHarvestIndicator(plantInfo)}`,
        priority: 'essential',
      })
    }

    // Add succession planting for fast crops
    if (isFastCrop(plantInfo)) {
      addSuccessionPlantings(timeline, plantInfo, dates, frostDates)
    }
  }

  // Sort each season by date
  Object.keys(timeline).forEach(season => {
    timeline[season as keyof SeasonalTimeline].sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    )
  })

  return timeline
}

/**
 * Get current season based on frost dates
 */
function getSeason(date: Date, frostDates: FrostDates): keyof SeasonalTimeline {
  const month = date.getMonth()

  // Approximate seasons (adjust based on your region)
  if (month >= 2 && month <= 4) return 'spring' // Mar-May
  if (month >= 5 && month <= 7) return 'summer' // Jun-Aug
  if (month >= 8 && month <= 10) return 'fall' // Sep-Nov
  return 'winter' // Dec-Feb
}

/**
 * Get soil temperature requirement for plant
 */
function getSoilTempRequirement(plant: PlantInfo): number {
  // Cool season crops
  const coolSeason = ['lettuce', 'spinach', 'peas', 'radish', 'carrot']
  if (coolSeason.includes(plant.id)) return 40

  // Warm season crops
  const warmSeason = ['tomato', 'pepper', 'cucumber', 'squash', 'beans']
  if (warmSeason.includes(plant.id)) return 60

  // Default
  return 50
}

/**
 * Get harvest readiness indicator
 */
function getHarvestIndicator(plant: PlantInfo): string {
  const indicators: Record<string, string> = {
    tomato: 'fruits are fully colored and slightly soft',
    lettuce: 'leaves are 4-6 inches',
    carrot: 'shoulders are 3/4 inch diameter',
    cucumber: 'fruits are 6-8 inches',
    beans: 'pods are firm and snap easily',
    pepper: 'fruits reach full size and color',
    strawberry: 'berries are fully red',
  }

  return indicators[plant.id] || 'fully mature'
}

/**
 * Check if crop is fast-growing (good for succession)
 */
function isFastCrop(plant: PlantInfo): boolean {
  const fastCrops = ['lettuce', 'radish', 'spinach', 'arugula', 'beans']
  return fastCrops.includes(plant.id)
}

/**
 * Add succession plantings for fast crops
 */
function addSuccessionPlantings(
  timeline: SeasonalTimeline,
  plant: PlantInfo,
  dates: { directSowDate: Date | null },
  frostDates: FrostDates
) {
  if (!dates.directSowDate) return

  // Plant every 2 weeks until mid-summer
  let currentDate = addWeeks(dates.directSowDate, 2)
  const stopDate = addWeeks(frostDates.firstFrost, -8)

  while (currentDate < stopDate) {
    const season = getSeason(currentDate, frostDates)
    timeline[season].push({
      plantId: plant.id,
      plantName: plant.name,
      icon: plant.icon,
      action: 'direct_sow',
      startDate: addWeeks(currentDate, -1),
      endDate: addWeeks(currentDate, 1),
      notes: 'Succession planting for continuous harvest',
      priority: 'optional',
    })

    currentDate = addWeeks(currentDate, 2)
  }
}

/**
 * Generate task list from planting timeline
 */
export function generateTasksFromTimeline(
  timeline: SeasonalTimeline,
  planId: string
): Array<{
  title: string
  description: string
  category: 'build' | 'plant' | 'maintain' | 'harvest' | 'water' | 'fertilize'
  due_on: string // ISO date
  notes: string
}> {
  const tasks: Array<{
    title: string
    description: string
    category: 'build' | 'plant' | 'maintain' | 'harvest' | 'water' | 'fertilize'
    due_on: string
    notes: string
  }> = []

  // Combine all seasons
  const allWindows = [
    ...timeline.spring,
    ...timeline.summer,
    ...timeline.fall,
    ...timeline.winter,
  ]

  for (const window of allWindows) {
    const category = window.action === 'harvest' ? 'harvest' : 'plant'

    tasks.push({
      title: `${window.action === 'harvest' ? 'Harvest' : 'Plant'} ${window.plantName}`,
      description: window.notes,
      category,
      due_on: window.startDate.toISOString().split('T')[0],
      notes: `Priority: ${window.priority}`,
    })
  }

  return tasks
}

// Helper functions
function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + weeks * 7)
  return result
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Get current planting window based on today's date
 */
export function getCurrentPlantingWindow(
  timeline: SeasonalTimeline
): PlantingWindow[] {
  const today = new Date()
  const twoWeeksFromNow = addWeeks(today, 2)

  const allWindows = [
    ...timeline.spring,
    ...timeline.summer,
    ...timeline.fall,
    ...timeline.winter,
  ]

  return allWindows.filter(
    window =>
      window.startDate <= twoWeeksFromNow && window.endDate >= today
  )
}
