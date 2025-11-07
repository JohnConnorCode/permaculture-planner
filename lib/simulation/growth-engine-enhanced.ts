/**
 * Enhanced Growth Simulation Engine
 *
 * Realistic garden evolution modeling with:
 * - Seasonal planting windows and frost dates
 * - Companion planting effects
 * - Plant spacing and competition
 * - Sun/water requirements integration
 * - Economic analysis (costs, ROI, yield value)
 * - Monthly harvest calendars
 * - Task scheduling
 * - Succession planting
 */

import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY, PlantInfo, checkCompatibility } from '@/lib/data/plant-library'

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface EnhancedSimulationState {
  currentMonth: number // 0-120 (10 years in months)
  year: number
  month: number // 0-11 (calendar month)
  season: 'spring' | 'summer' | 'fall' | 'winter'
  plants: EnhancedPlantState[]
  metrics: EnhancedGardenMetrics
  events: SimulationEvent[]
  economics: EconomicMetrics
  harvestCalendar: MonthlyHarvest[]
  tasks: GardenTask[]
  climate: ClimateSettings
}

export interface EnhancedPlantState {
  id: string
  plantId: string
  plantInfo: PlantInfo
  bedId: string
  position: { x: number; y: number }
  plantedMonth: number // when planted
  ageInMonths: number
  maturityPercent: number // 0-100
  height: number // current height in inches
  canopyRadius: number // current canopy radius in feet
  isAlive: boolean
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'dying'
  yieldToDate: number // lbs produced so far
  currentYield: number // lbs producing this month
  stage: 'seed' | 'germinating' | 'establishing' | 'growing' | 'mature' | 'producing' | 'declining' | 'dormant'
  companionBonus: number // -0.3 to +0.3 growth modifier
  spacingPenalty: number // 0 to -0.5 crowding penalty
  sunExposure: number // 0-100% (from sun analysis)
  waterAvailability: number // 0-100% (from water zones)
  frostDamage: number // accumulated frost damage
  totalCost: number // investment in this plant
  marketValue: number // current value of yield produced
}

export interface EnhancedGardenMetrics {
  totalPlants: number
  alivePlants: number
  producingPlants: number
  dormantPlants: number
  totalYield: number // cumulative lbs
  currentMonthlyYield: number // lbs/month
  canopyCoverage: number // percentage
  biomass: number // total plant mass
  biodiversity: number // species count
  companionPlantings: number // count of beneficial pairings
  crowdedPlants: number // count of overcrowded plants
  healthScore: number // 0-100 overall garden health
}

export interface EconomicMetrics {
  totalInvestment: number // seeds, plants, materials
  totalYieldValue: number // market value of harvest
  roi: number // return on investment %
  breakEvenMonth: number | null // when ROI becomes positive
  monthlyBreakdown: MonthlyEconomics[]
}

export interface MonthlyEconomics {
  month: number
  costs: number
  yieldValue: number
  netProfit: number
  cumulativeProfit: number
}

export interface MonthlyHarvest {
  month: number
  monthName: string
  season: string
  harvestableItems: HarvestItem[]
  totalYield: number
  totalValue: number
}

export interface HarvestItem {
  plantId: string
  plantName: string
  quantity: number // lbs
  value: number // dollars
  icon: string
}

export interface GardenTask {
  month: number
  type: 'plant' | 'harvest' | 'prune' | 'fertilize' | 'water' | 'pest_control' | 'succession_plant'
  priority: 'low' | 'medium' | 'high' | 'critical'
  plantId?: string
  description: string
  estimatedTime: number // minutes
  cost?: number
}

export interface SimulationEvent {
  month: number
  type: 'planted' | 'germinated' | 'first_harvest' | 'peak_production' | 'frost_damage' | 'death' | 'succession_planted' | 'milestone' | 'warning'
  severity?: 'info' | 'warning' | 'error'
  plantId?: string
  description: string
}

export interface ClimateSettings {
  zone: string // USDA hardiness zone
  firstFrostMonth: number // 0-11
  lastFrostMonth: number // 0-11
  averageRainfall: number // inches per month
  temperatureModifier: 'cold' | 'normal' | 'hot'
}

export interface EnhancedScenario {
  name: string
  climate: ClimateSettings
  budget: number // dollars available
  maintenanceLevel: 'minimal' | 'regular' | 'intensive'
  useSuccessionPlanting: boolean
  targetYield: number // lbs per year
}

// ============================================================================
// PLANT COSTS AND VALUES
// ============================================================================

const PLANT_ECONOMICS: Record<string, { seedCost: number; valuePerLb: number }> = {
  // Vegetables
  tomato: { seedCost: 3, valuePerLb: 4 },
  lettuce: { seedCost: 2, valuePerLb: 6 },
  carrot: { seedCost: 2, valuePerLb: 3 },
  pepper: { seedCost: 3, valuePerLb: 5 },
  squash: { seedCost: 3, valuePerLb: 2.5 },
  beans: { seedCost: 2, valuePerLb: 4 },
  corn: { seedCost: 2, valuePerLb: 3 },
  onion: { seedCost: 2, valuePerLb: 2 },
  radish: { seedCost: 1.5, valuePerLb: 4 },
  spinach: { seedCost: 2, valuePerLb: 7 },
  cabbage: { seedCost: 2.5, valuePerLb: 2.5 },
  peas: { seedCost: 2, valuePerLb: 5 },
  garlic: { seedCost: 5, valuePerLb: 8 },
  cucumber: { seedCost: 2.5, valuePerLb: 3 },

  // Herbs
  basil: { seedCost: 2, valuePerLb: 15 },
  rosemary: { seedCost: 5, valuePerLb: 20 },
  mint: { seedCost: 3, valuePerLb: 18 },
  thyme: { seedCost: 3, valuePerLb: 25 },
  oregano: { seedCost: 2.5, valuePerLb: 20 },
  lavender: { seedCost: 4, valuePerLb: 30 },

  // Fruits
  strawberry: { seedCost: 8, valuePerLb: 6 },
  blueberry: { seedCost: 25, valuePerLb: 8 },
  raspberry: { seedCost: 15, valuePerLb: 7 },
  grape: { seedCost: 20, valuePerLb: 4 },

  // Trees
  apple: { seedCost: 40, valuePerLb: 3 },
  pear: { seedCost: 40, valuePerLb: 3.5 },
  cherry: { seedCost: 45, valuePerLb: 5 },

  // Flowers/other
  marigold: { seedCost: 1.5, valuePerLb: 0 },
  sunflower: { seedCost: 2, valuePerLb: 2 },
  clover: { seedCost: 1, valuePerLb: 0 },
}

// ============================================================================
// REALISTIC PLANTING WINDOWS
// ============================================================================

interface PlantingWindow {
  earliestMonth: number // 0-11
  latestMonth: number // 0-11
  minSoilTemp: number // Fahrenheit
}

const PLANTING_WINDOWS: Record<string, PlantingWindow> = {
  // Early spring (frost-tolerant)
  lettuce: { earliestMonth: 2, latestMonth: 9, minSoilTemp: 40 },
  spinach: { earliestMonth: 2, latestMonth: 9, minSoilTemp: 40 },
  peas: { earliestMonth: 2, latestMonth: 4, minSoilTemp: 45 },
  radish: { earliestMonth: 2, latestMonth: 9, minSoilTemp: 40 },
  onion: { earliestMonth: 2, latestMonth: 4, minSoilTemp: 40 },

  // Spring (after last frost)
  carrot: { earliestMonth: 3, latestMonth: 7, minSoilTemp: 50 },
  cabbage: { earliestMonth: 3, latestMonth: 8, minSoilTemp: 45 },

  // Late spring/early summer (heat-loving)
  tomato: { earliestMonth: 4, latestMonth: 6, minSoilTemp: 60 },
  pepper: { earliestMonth: 4, latestMonth: 6, minSoilTemp: 65 },
  basil: { earliestMonth: 4, latestMonth: 6, minSoilTemp: 60 },
  squash: { earliestMonth: 4, latestMonth: 6, minSoilTemp: 60 },
  beans: { earliestMonth: 4, latestMonth: 7, minSoilTemp: 60 },
  corn: { earliestMonth: 4, latestMonth: 6, minSoilTemp: 60 },
  cucumber: { earliestMonth: 4, latestMonth: 7, minSoilTemp: 60 },

  // Fall planting
  garlic: { earliestMonth: 9, latestMonth: 10, minSoilTemp: 50 },

  // Perennials (spring or fall)
  strawberry: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 50 },
  blueberry: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 50 },
  raspberry: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 50 },

  // Trees (spring)
  apple: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 45 },
  pear: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 45 },
  cherry: { earliestMonth: 3, latestMonth: 5, minSoilTemp: 45 },
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializeEnhancedSimulation(
  gardenBeds: GardenBed[],
  scenario: EnhancedScenario
): EnhancedSimulationState {
  const plants: EnhancedPlantState[] = []
  const currentMonth = 0 // Start in January (month 0)

  gardenBeds.forEach((bed) => {
    bed.plants?.forEach((plant) => {
      const plantInfo = PLANT_LIBRARY.find((p) => p.id === plant.plantId)
      if (!plantInfo) return

      const economics = PLANT_ECONOMICS[plant.plantId] || { seedCost: 5, valuePerLb: 3 }

      plants.push({
        id: plant.id,
        plantId: plant.plantId,
        plantInfo,
        bedId: bed.id,
        position: { x: plant.x, y: plant.y },
        plantedMonth: currentMonth,
        ageInMonths: 0,
        maturityPercent: 0,
        height: 0,
        canopyRadius: 0,
        isAlive: true,
        health: 'excellent',
        yieldToDate: 0,
        currentYield: 0,
        stage: 'seed',
        companionBonus: 0,
        spacingPenalty: 0,
        sunExposure: 100, // Default, would integrate with sun panel
        waterAvailability: 100, // Default, would integrate with water panel
        frostDamage: 0,
        totalCost: economics.seedCost,
        marketValue: 0,
      })
    })
  })

  // Calculate initial companion bonuses
  plants.forEach((plant) => {
    plant.companionBonus = calculateCompanionBonus(plant, plants)
    plant.spacingPenalty = calculateSpacingPenalty(plant, plants)
  })

  const initialMetrics = calculateEnhancedMetrics(plants)
  const economics: EconomicMetrics = {
    totalInvestment: plants.reduce((sum, p) => sum + p.totalCost, 0),
    totalYieldValue: 0,
    roi: -100,
    breakEvenMonth: null,
    monthlyBreakdown: [{
      month: 0,
      costs: plants.reduce((sum, p) => sum + p.totalCost, 0),
      yieldValue: 0,
      netProfit: -plants.reduce((sum, p) => sum + p.totalCost, 0),
      cumulativeProfit: -plants.reduce((sum, p) => sum + p.totalCost, 0),
    }],
  }

  return {
    currentMonth,
    year: 0,
    month: 0,
    season: 'winter',
    plants,
    metrics: initialMetrics,
    events: [{
      month: 0,
      type: 'planted',
      severity: 'info',
      description: `Garden initialized with ${plants.length} plants (${initialMetrics.biodiversity} species)`,
    }],
    economics,
    harvestCalendar: [],
    tasks: generateInitialTasks(plants, scenario),
    climate: scenario.climate,
  }
}

// ============================================================================
// MONTH ADVANCEMENT
// ============================================================================

export function advanceEnhancedMonth(
  state: EnhancedSimulationState,
  scenario: EnhancedScenario
): EnhancedSimulationState {
  const newMonth = state.currentMonth + 1
  const year = Math.floor(newMonth / 12)
  const month = newMonth % 12
  const season = getSeasonFromMonth(month)

  // Simulate each plant
  let newPlants = state.plants.map((plant) =>
    simulateEnhancedPlantGrowth(plant, state, scenario, season, month)
  )

  // Recalculate companion/spacing effects
  newPlants = newPlants.map((plant) => ({
    ...plant,
    companionBonus: calculateCompanionBonus(plant, newPlants),
    spacingPenalty: calculateSpacingPenalty(plant, newPlants),
  }))

  // Detect events
  const newEvents = detectEnhancedEvents(state.plants, newPlants, newMonth, month, state.climate)

  // Handle succession planting
  if (scenario.useSuccessionPlanting) {
    const { plantsToAdd, successionEvents } = handleSuccessionPlanting(
      newPlants,
      newMonth,
      month,
      scenario
    )
    newPlants = [...newPlants, ...plantsToAdd]
    newEvents.push(...successionEvents)
  }

  // Calculate metrics
  const newMetrics = calculateEnhancedMetrics(newPlants)

  // Update economics
  const monthCosts = scenario.maintenanceLevel === 'intensive' ? 50 : scenario.maintenanceLevel === 'regular' ? 20 : 5
  const monthYieldValue = newPlants.reduce((sum, p) => {
    const economics = PLANT_ECONOMICS[p.plantId] || { seedCost: 5, valuePerLb: 3 }
    return sum + p.currentYield * economics.valuePerLb
  }, 0)

  const previousMonthlyBreakdown = state.economics.monthlyBreakdown[state.economics.monthlyBreakdown.length - 1]
  const cumulativeProfit = (previousMonthlyBreakdown?.cumulativeProfit || 0) + monthYieldValue - monthCosts

  const newEconomics: EconomicMetrics = {
    totalInvestment: state.economics.totalInvestment + monthCosts,
    totalYieldValue: state.economics.totalYieldValue + monthYieldValue,
    roi: ((state.economics.totalYieldValue + monthYieldValue - state.economics.totalInvestment - monthCosts) / (state.economics.totalInvestment + monthCosts)) * 100,
    breakEvenMonth: state.economics.breakEvenMonth || (cumulativeProfit >= 0 ? newMonth : null),
    monthlyBreakdown: [
      ...state.economics.monthlyBreakdown,
      {
        month: newMonth,
        costs: monthCosts,
        yieldValue: monthYieldValue,
        netProfit: monthYieldValue - monthCosts,
        cumulativeProfit,
      },
    ],
  }

  // Update market values
  newPlants = newPlants.map((p) => {
    const economics = PLANT_ECONOMICS[p.plantId] || { seedCost: 5, valuePerLb: 3 }
    return {
      ...p,
      marketValue: p.yieldToDate * economics.valuePerLb,
    }
  })

  // Generate harvest calendar
  const harvestCalendar = generateHarvestCalendar(newPlants, newMonth)

  // Generate tasks
  const tasks = generateMonthlyTasks(newPlants, newMonth, month, scenario)

  return {
    currentMonth: newMonth,
    year,
    month,
    season,
    plants: newPlants,
    metrics: newMetrics,
    events: [...state.events, ...newEvents],
    economics: newEconomics,
    harvestCalendar,
    tasks,
    climate: state.climate,
  }
}

// ============================================================================
// ENHANCED PLANT GROWTH SIMULATION
// ============================================================================

function simulateEnhancedPlantGrowth(
  plant: EnhancedPlantState,
  state: EnhancedSimulationState,
  scenario: EnhancedScenario,
  season: string,
  month: number
): EnhancedPlantState {
  if (!plant.isAlive) return plant

  const newAge = plant.ageInMonths + 1

  // Check frost damage for annuals/tender plants
  const frostRisk = checkFrostRisk(plant, month, state.climate)
  let newFrostDamage = plant.frostDamage + frostRisk

  // Annuals die from severe frost
  if (frostRisk > 0.7 && isAnnual(plant.plantInfo)) {
    return {
      ...plant,
      isAlive: false,
      health: 'dying',
      frostDamage: newFrostDamage,
      ageInMonths: newAge,
    }
  }

  // Check planting window violation
  const plantingWindow = PLANTING_WINDOWS[plant.plantId]
  if (plantingWindow && plant.ageInMonths === 0) {
    const isInWindow = isWithinPlantingWindow(month, plantingWindow)
    if (!isInWindow) {
      // Plant dies if planted outside window
      return {
        ...plant,
        isAlive: false,
        health: 'dying',
        ageInMonths: newAge,
      }
    }
  }

  // Calculate maturity based on plant category
  const maturityMonths = getMaturityMonthsByCategory(plant.plantInfo.category)
  let maturityPercent = Math.min((newAge / maturityMonths) * 100, 100)

  // Dormancy for perennials in winter
  let stage = plant.stage
  if (isPerennial(plant.plantInfo) && season === 'winter') {
    stage = 'dormant'
    maturityPercent = plant.maturityPercent // Don't grow in winter
  } else {
    stage = getDetailedGrowthStage(maturityPercent, newAge, maturityMonths)
  }

  // Calculate all growth factors
  const sunMatch = calculateSunMatch(plant.plantInfo, plant.sunExposure)
  const waterMatch = calculateWaterMatch(plant.plantInfo, plant.waterAvailability)
  const tempFactor = getTemperatureFactorByCategory(plant.plantInfo.category, scenario.climate.temperatureModifier, season)
  const companionBonus = plant.companionBonus
  const spacingPenalty = plant.spacingPenalty
  const frostPenalty = Math.max(0, 1 - plant.frostDamage)

  // Combined growth factor
  const growthFactor = Math.max(0.1, Math.min(2,
    sunMatch * waterMatch * tempFactor * (1 + companionBonus) * (1 + spacingPenalty) * frostPenalty
  ))

  // Calculate size
  const targetHeight = plant.plantInfo.size.mature_height
  const targetCanopy = plant.plantInfo.size.mature_width / 24 // Convert inches to feet
  const height = stage === 'dormant' ? plant.height : targetHeight * (maturityPercent / 100) * growthFactor
  const canopyRadius = stage === 'dormant' ? plant.canopyRadius : targetCanopy * (maturityPercent / 100) * growthFactor

  // Calculate yield
  const { currentYield, yieldToDate } = calculateRealisticYield(
    plant,
    maturityPercent,
    season,
    month,
    growthFactor,
    stage
  )

  // Calculate health
  const health = calculateDetailedHealth(growthFactor, newAge, maturityMonths, plant.frostDamage)

  // Check natural death
  const lifespan = getLifespanByCategory(plant.plantInfo.category)
  const isAlive = newAge < lifespan && health !== 'dying'

  return {
    ...plant,
    ageInMonths: newAge,
    maturityPercent,
    height,
    canopyRadius,
    isAlive,
    health,
    yieldToDate: yieldToDate + currentYield,
    currentYield,
    stage,
    frostDamage: newFrostDamage,
  }
}

// ============================================================================
// COMPANION PLANTING & SPACING
// ============================================================================

function calculateCompanionBonus(
  plant: EnhancedPlantState,
  allPlants: EnhancedPlantState[]
): number {
  let bonus = 0
  const maxDistance = 36 // 36 inches = 3 feet

  allPlants.forEach((other) => {
    if (other.id === plant.id || !other.isAlive || other.bedId !== plant.bedId) return

    const distance = Math.sqrt(
      Math.pow(plant.position.x - other.position.x, 2) +
      Math.pow(plant.position.y - other.position.y, 2)
    )

    if (distance <= maxDistance) {
      const compatibility = checkCompatibility(plant.plantId, other.plantId)
      if (compatibility === 'good') {
        bonus += 0.15 * (1 - distance / maxDistance) // Up to +15% boost
      } else if (compatibility === 'bad') {
        bonus -= 0.2 * (1 - distance / maxDistance) // Up to -20% penalty
      }
    }
  })

  return Math.max(-0.3, Math.min(0.3, bonus))
}

function calculateSpacingPenalty(
  plant: EnhancedPlantState,
  allPlants: EnhancedPlantState[]
): number {
  const requiredSpacing = plant.plantInfo.size.spacing
  let crowdingPenalty = 0

  allPlants.forEach((other) => {
    if (other.id === plant.id || !other.isAlive || other.bedId !== plant.bedId) return

    const distance = Math.sqrt(
      Math.pow(plant.position.x - other.position.x, 2) +
      Math.pow(plant.position.y - other.position.y, 2)
    )

    if (distance < requiredSpacing) {
      const crowdingRatio = distance / requiredSpacing
      crowdingPenalty -= 0.2 * (1 - crowdingRatio) // Up to -20% per crowding plant
    }
  })

  return Math.max(-0.5, crowdingPenalty) // Cap at -50%
}

// ============================================================================
// SUN & WATER MATCHING
// ============================================================================

function calculateSunMatch(plantInfo: PlantInfo, sunExposure: number): number {
  const requirement = plantInfo.requirements.sun

  if (requirement === 'full') {
    // Full sun needs 80-100%
    if (sunExposure >= 80) return 1.0
    if (sunExposure >= 60) return 0.8
    return 0.5
  } else if (requirement === 'partial') {
    // Partial shade wants 40-80%
    if (sunExposure >= 40 && sunExposure <= 80) return 1.0
    if (sunExposure < 40) return 0.6
    return 0.85
  } else {
    // Shade wants < 40%
    if (sunExposure < 40) return 1.0
    if (sunExposure < 60) return 0.8
    return 0.5
  }
}

function calculateWaterMatch(plantInfo: PlantInfo, waterAvailability: number): number {
  const requirement = plantInfo.requirements.water

  if (requirement === 'high') {
    // High water needs 70-100%
    if (waterAvailability >= 70) return 1.0
    if (waterAvailability >= 50) return 0.7
    return 0.4
  } else if (requirement === 'medium') {
    // Medium water wants 40-80%
    if (waterAvailability >= 40 && waterAvailability <= 80) return 1.0
    if (waterAvailability < 40) return 0.7
    return 0.9
  } else {
    // Low water wants 20-50%
    if (waterAvailability >= 20 && waterAvailability <= 50) return 1.0
    if (waterAvailability < 20) return 0.8
    return 0.7 // Still okay with more water
  }
}

// ============================================================================
// FROST & CLIMATE
// ============================================================================

function checkFrostRisk(
  plant: EnhancedPlantState,
  month: number,
  climate: ClimateSettings
): number {
  // Check if we're in frost season
  const isFrostSeason =
    month <= climate.lastFrostMonth ||
    month >= climate.firstFrostMonth

  if (!isFrostSeason) return 0

  // Perennials and trees are frost-hardy
  if (isPerennial(plant.plantInfo) || plant.plantInfo.category === 'tree') {
    return 0
  }

  // Annuals and tender plants suffer
  if (isAnnual(plant.plantInfo)) {
    return 0.8 // High frost risk
  }

  return 0.3 // Moderate risk
}

function isWithinPlantingWindow(month: number, window: PlantingWindow): boolean {
  if (window.earliestMonth <= window.latestMonth) {
    return month >= window.earliestMonth && month <= window.latestMonth
  } else {
    // Wraps around year (e.g., Oct-Apr)
    return month >= window.earliestMonth || month <= window.latestMonth
  }
}

// ============================================================================
// REALISTIC YIELD CALCULATIONS
// ============================================================================

function calculateRealisticYield(
  plant: EnhancedPlantState,
  maturityPercent: number,
  season: string,
  month: number,
  growthFactor: number,
  stage: string
): { currentYield: number; yieldToDate: number } {
  // No yield if dormant, dead, or immature
  if (stage === 'dormant' || stage === 'seed' || stage === 'germinating' || !plant.isAlive) {
    return { currentYield: 0, yieldToDate: plant.yieldToDate }
  }

  // Need to be at least 75% mature
  if (maturityPercent < 75) {
    return { currentYield: 0, yieldToDate: plant.yieldToDate }
  }

  // Check harvest season from plant library
  const harvestTime = plant.plantInfo.harvest_time.toLowerCase()
  const currentSeason = season.toLowerCase()

  let seasonalMultiplier = 0

  if (harvestTime.includes('year-round')) {
    seasonalMultiplier = 1.0
  } else if (harvestTime.includes(currentSeason)) {
    seasonalMultiplier = 1.5 // Peak season
  } else if (
    (harvestTime.includes('spring') && currentSeason === 'summer') ||
    (harvestTime.includes('summer') && currentSeason === 'fall') ||
    (harvestTime.includes('fall') && currentSeason === 'winter')
  ) {
    seasonalMultiplier = 0.3 // Shoulder season
  } else {
    seasonalMultiplier = 0 // Out of season
  }

  // Base yield by category
  let baseYield = 0
  const category = plant.plantInfo.category
  switch (category) {
    case 'vegetable':
      baseYield = 3 // 3 lbs/month peak
      break
    case 'herb':
      baseYield = 0.5 // 0.5 lbs/month
      break
    case 'fruit':
      baseYield = 4 // 4 lbs/month
      break
    case 'shrub':
      baseYield = 5 // 5 lbs/month (berries)
      break
    case 'tree':
      baseYield = 15 // 15 lbs/month
      break
    case 'vine':
      baseYield = 4 // 4 lbs/month
      break
    default:
      baseYield = 0
  }

  const currentYield = baseYield * seasonalMultiplier * growthFactor * (maturityPercent / 100)

  return {
    currentYield: Math.max(0, currentYield),
    yieldToDate: plant.yieldToDate,
  }
}

// ============================================================================
// SUCCESSION PLANTING
// ============================================================================

function handleSuccessionPlanting(
  plants: EnhancedPlantState[],
  currentMonth: number,
  month: number,
  scenario: EnhancedScenario
): { plantsToAdd: EnhancedPlantState[]; successionEvents: SimulationEvent[] } {
  const plantsToAdd: EnhancedPlantState[] = []
  const successionEvents: SimulationEvent[] = []

  // Find dead annuals that should be replanted
  plants.forEach((plant) => {
    if (!plant.isAlive && isAnnual(plant.plantInfo)) {
      const plantingWindow = PLANTING_WINDOWS[plant.plantId]

      if (plantingWindow && isWithinPlantingWindow(month, plantingWindow)) {
        const economics = PLANT_ECONOMICS[plant.plantId] || { seedCost: 5, valuePerLb: 3 }

        // Only replant if within budget
        if (scenario.budget >= economics.seedCost) {
          const newPlant: EnhancedPlantState = {
            ...plant,
            id: `${plant.id}-succession-${currentMonth}`,
            plantedMonth: currentMonth,
            ageInMonths: 0,
            maturityPercent: 0,
            height: 0,
            canopyRadius: 0,
            isAlive: true,
            health: 'excellent',
            yieldToDate: 0,
            currentYield: 0,
            stage: 'seed',
            frostDamage: 0,
            totalCost: economics.seedCost,
            marketValue: 0,
          }

          plantsToAdd.push(newPlant)
          successionEvents.push({
            month: currentMonth,
            type: 'succession_planted',
            severity: 'info',
            plantId: newPlant.id,
            description: `Succession planted ${newPlant.plantInfo.name}`,
          })
        }
      }
    }
  })

  return { plantsToAdd, successionEvents }
}

// ============================================================================
// HARVEST CALENDAR
// ============================================================================

function generateHarvestCalendar(
  plants: EnhancedPlantState[],
  currentMonth: number
): MonthlyHarvest[] {
  const calendar: MonthlyHarvest[] = []
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Generate calendar for next 12 months
  for (let i = 0; i < 12; i++) {
    const futureMonth = (currentMonth + i) % 12
    const season = getSeasonFromMonth(futureMonth)

    const harvestableItems: HarvestItem[] = []
    let totalYield = 0
    let totalValue = 0

    plants.forEach((plant) => {
      if (!plant.isAlive) return

      const harvestTime = plant.plantInfo.harvest_time.toLowerCase()
      const seasonName = season.toLowerCase()

      let canHarvest = false
      if (harvestTime.includes('year-round')) {
        canHarvest = true
      } else if (harvestTime.includes(seasonName)) {
        canHarvest = true
      }

      if (canHarvest && plant.maturityPercent >= 75) {
        const economics = PLANT_ECONOMICS[plant.plantId] || { seedCost: 5, valuePerLb: 3 }
        const estimatedYield = plant.currentYield > 0 ? plant.currentYield : 2 // Rough estimate

        harvestableItems.push({
          plantId: plant.plantId,
          plantName: plant.plantInfo.name,
          quantity: estimatedYield,
          value: estimatedYield * economics.valuePerLb,
          icon: plant.plantInfo.icon,
        })

        totalYield += estimatedYield
        totalValue += estimatedYield * economics.valuePerLb
      }
    })

    calendar.push({
      month: futureMonth,
      monthName: MONTH_NAMES[futureMonth],
      season,
      harvestableItems,
      totalYield,
      totalValue,
    })
  }

  return calendar
}

// ============================================================================
// TASK GENERATION
// ============================================================================

function generateInitialTasks(
  plants: EnhancedPlantState[],
  scenario: EnhancedScenario
): GardenTask[] {
  const tasks: GardenTask[] = []

  tasks.push({
    month: 0,
    type: 'plant',
    priority: 'high',
    description: `Plant ${plants.length} plants in their beds`,
    estimatedTime: plants.length * 15,
    cost: plants.reduce((sum, p) => sum + p.totalCost, 0),
  })

  return tasks
}

function generateMonthlyTasks(
  plants: EnhancedPlantState[],
  currentMonth: number,
  month: number,
  scenario: EnhancedScenario
): GardenTask[] {
  const tasks: GardenTask[] = []

  // Harvesting tasks
  plants.forEach((plant) => {
    if (plant.currentYield > 0) {
      tasks.push({
        month: currentMonth,
        type: 'harvest',
        priority: 'high',
        plantId: plant.id,
        description: `Harvest ${plant.plantInfo.name} (~${Math.round(plant.currentYield)} lbs)`,
        estimatedTime: 20,
      })
    }
  })

  // Watering tasks (if low water availability)
  const thirstyPlants = plants.filter(p =>
    p.isAlive &&
    p.plantInfo.requirements.water === 'high' &&
    p.waterAvailability < 70
  )
  if (thirstyPlants.length > 0) {
    tasks.push({
      month: currentMonth,
      type: 'water',
      priority: 'critical',
      description: `Water ${thirstyPlants.length} thirsty plants`,
      estimatedTime: thirstyPlants.length * 5,
    })
  }

  // Pest control (higher priority in summer)
  if (getSeasonFromMonth(month) === 'summer') {
    const unhealthyPlants = plants.filter(p => p.health === 'poor' || p.health === 'fair')
    if (unhealthyPlants.length > 0) {
      tasks.push({
        month: currentMonth,
        type: 'pest_control',
        priority: 'medium',
        description: `Check ${unhealthyPlants.length} struggling plants for pests`,
        estimatedTime: unhealthyPlants.length * 10,
        cost: 15,
      })
    }
  }

  // Pruning tasks (spring and fall)
  if (month === 3 || month === 9) {
    const perennials = plants.filter(p => p.isAlive && isPerennial(p.plantInfo))
    if (perennials.length > 0) {
      tasks.push({
        month: currentMonth,
        type: 'prune',
        priority: 'medium',
        description: `Prune ${perennials.length} perennial plants`,
        estimatedTime: perennials.length * 15,
      })
    }
  }

  // Fertilizing (spring)
  if (month === 3) {
    tasks.push({
      month: currentMonth,
      type: 'fertilize',
      priority: 'medium',
      description: `Fertilize all beds for spring growth`,
      estimatedTime: 60,
      cost: 40,
    })
  }

  return tasks
}

// ============================================================================
// EVENT DETECTION
// ============================================================================

function detectEnhancedEvents(
  oldPlants: EnhancedPlantState[],
  newPlants: EnhancedPlantState[],
  month: number,
  calendarMonth: number,
  climate: ClimateSettings
): SimulationEvent[] {
  const events: SimulationEvent[] = []

  newPlants.forEach((newPlant, i) => {
    const oldPlant = oldPlants[i]
    if (!oldPlant) return

    // Germination
    if (oldPlant.stage === 'seed' && newPlant.stage !== 'seed') {
      events.push({
        month,
        type: 'germinated',
        severity: 'info',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} germinated successfully`,
      })
    }

    // First harvest
    if (oldPlant.currentYield === 0 && newPlant.currentYield > 0) {
      events.push({
        month,
        type: 'first_harvest',
        severity: 'info',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} produced first harvest! (${Math.round(newPlant.currentYield)} lbs)`,
      })
    }

    // Frost damage
    if (newPlant.frostDamage > oldPlant.frostDamage && newPlant.frostDamage > 0.3) {
      events.push({
        month,
        type: 'frost_damage',
        severity: 'warning',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} suffered frost damage`,
      })
    }

    // Death
    if (oldPlant.isAlive && !newPlant.isAlive) {
      const reason = newPlant.frostDamage > 0.5 ? 'frost' :
                    newPlant.health === 'poor' ? 'poor health' :
                    'old age'
      events.push({
        month,
        type: 'death',
        severity: 'warning',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} died from ${reason}`,
      })
    }

    // Crowding warning
    if (newPlant.spacingPenalty < -0.3 && newPlant.isAlive) {
      events.push({
        month,
        type: 'warning',
        severity: 'warning',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} is overcrowded (${Math.round(Math.abs(newPlant.spacingPenalty) * 100)}% growth reduction)`,
      })
    }

    // Health milestones
    if (oldPlant.health !== 'excellent' && newPlant.health === 'excellent') {
      events.push({
        month,
        type: 'milestone',
        severity: 'info',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} achieved excellent health!`,
      })
    }
  })

  return events
}

// ============================================================================
// METRICS CALCULATION
// ============================================================================

function calculateEnhancedMetrics(plants: EnhancedPlantState[]): EnhancedGardenMetrics {
  const alivePlants = plants.filter((p) => p.isAlive)
  const producingPlants = alivePlants.filter((p) => p.currentYield > 0)
  const dormantPlants = alivePlants.filter((p) => p.stage === 'dormant')

  const companionPlantings = plants.filter((p) => p.isAlive && p.companionBonus > 0.05).length
  const crowdedPlants = plants.filter((p) => p.isAlive && p.spacingPenalty < -0.1).length

  const healthScores = alivePlants.map((p) => {
    switch (p.health) {
      case 'excellent': return 100
      case 'good': return 75
      case 'fair': return 50
      case 'poor': return 25
      case 'dying': return 10
      default: return 50
    }
  })
  const healthScore = healthScores.length > 0
    ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length
    : 0

  return {
    totalPlants: plants.length,
    alivePlants: alivePlants.length,
    producingPlants: producingPlants.length,
    dormantPlants: dormantPlants.length,
    totalYield: plants.reduce((sum, p) => sum + p.yieldToDate, 0),
    currentMonthlyYield: plants.reduce((sum, p) => sum + p.currentYield, 0),
    canopyCoverage: calculateCanopyCoverage(alivePlants),
    biomass: alivePlants.reduce((sum, p) => sum + p.height * p.canopyRadius, 0),
    biodiversity: new Set(alivePlants.map((p) => p.plantId)).size,
    companionPlantings,
    crowdedPlants,
    healthScore,
  }
}

function calculateCanopyCoverage(plants: EnhancedPlantState[]): number {
  const totalCanopyArea = plants.reduce((sum, p) => {
    return sum + Math.PI * p.canopyRadius * p.canopyRadius
  }, 0)
  const estimatedBedArea = 100
  return Math.min((totalCanopyArea / estimatedBedArea) * 100, 100)
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMaturityMonthsByCategory(category: string): number {
  switch (category) {
    case 'vegetable':
      return 3
    case 'herb':
      return 2
    case 'flower':
      return 2
    case 'groundcover':
      return 3
    case 'vine':
      return 4
    case 'fruit':
      return 12
    case 'shrub':
      return 24
    case 'tree':
      return 60
    default:
      return 12
  }
}

function getLifespanByCategory(category: string): number {
  switch (category) {
    case 'vegetable':
      return 6 // Most vegetables are annuals
    case 'herb':
      return 36 // 3 years
    case 'flower':
      return 12 // Many are annuals or biennials
    case 'groundcover':
      return 120 // 10 years
    case 'vine':
      return 60 // 5 years
    case 'fruit':
      return 120 // 10 years
    case 'shrub':
      return 180 // 15 years
    case 'tree':
      return 600 // 50 years
    default:
      return 120
  }
}

function getTemperatureFactorByCategory(
  category: string,
  temperature: 'cold' | 'normal' | 'hot',
  season: string
): number {
  if (temperature === 'normal') return 1

  // Trees and shrubs are resilient
  if (category === 'tree' || category === 'shrub') {
    return temperature === 'hot' ? 0.9 : 0.85
  }

  // Vegetables are temperature-sensitive
  if (category === 'vegetable') {
    if (temperature === 'hot' && (season === 'summer' || season === 'spring')) {
      return 0.7 // Too hot for cool-season crops
    }
    if (temperature === 'cold' && (season === 'winter' || season === 'fall')) {
      return 0.6
    }
  }

  return temperature === 'hot' ? 0.85 : 0.75
}

function getDetailedGrowthStage(
  maturityPercent: number,
  age: number,
  maturityMonths: number
): EnhancedPlantState['stage'] {
  if (maturityPercent < 10) return 'germinating'
  if (maturityPercent < 35) return 'establishing'
  if (maturityPercent < 75) return 'growing'
  if (maturityPercent < 100) return 'mature'
  if (age < maturityMonths * 3) return 'producing'
  return 'declining'
}

function calculateDetailedHealth(
  growthFactor: number,
  age: number,
  maturityMonths: number,
  frostDamage: number
): EnhancedPlantState['health'] {
  const relativeAge = age / maturityMonths

  // Severe frost damage
  if (frostDamage > 0.7) return 'dying'
  if (frostDamage > 0.4) return 'poor'

  // Very young or very old plants
  if (relativeAge < 0.3 || relativeAge > 5) {
    if (growthFactor > 0.8) return 'good'
    return 'fair'
  }

  if (growthFactor > 0.9) return 'excellent'
  if (growthFactor > 0.7) return 'good'
  if (growthFactor > 0.5) return 'fair'
  if (growthFactor > 0.3) return 'poor'
  return 'dying'
}

function getSeasonFromMonth(month: number): 'spring' | 'summer' | 'fall' | 'winter' {
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

function isAnnual(plantInfo: PlantInfo): boolean {
  return plantInfo.category === 'vegetable' || plantInfo.category === 'flower'
}

function isPerennial(plantInfo: PlantInfo): boolean {
  return plantInfo.category === 'herb' ||
         plantInfo.category === 'fruit' ||
         plantInfo.category === 'shrub' ||
         plantInfo.category === 'tree' ||
         plantInfo.category === 'groundcover'
}

// ============================================================================
// EXPORTS
// ============================================================================

export const DEFAULT_CLIMATE: ClimateSettings = {
  zone: '7a',
  firstFrostMonth: 10, // November
  lastFrostMonth: 3, // April
  averageRainfall: 3,
  temperatureModifier: 'normal',
}

export const DEFAULT_ENHANCED_SCENARIO: EnhancedScenario = {
  name: 'Realistic Garden',
  climate: DEFAULT_CLIMATE,
  budget: 500,
  maintenanceLevel: 'regular',
  useSuccessionPlanting: true,
  targetYield: 200, // lbs per year
}
