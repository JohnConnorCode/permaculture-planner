/**
 * Growth Simulation Engine
 *
 * Models garden evolution over time with accurate growth rates,
 * yield predictions, and environmental factors.
 */

import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY, PlantInfo } from '@/lib/data/plant-library'

export interface SimulationState {
  currentMonth: number // 0-120 (10 years in months)
  year: number
  month: number
  season: 'spring' | 'summer' | 'fall' | 'winter'
  plants: PlantSimulationState[]
  metrics: GardenMetrics
  events: SimulationEvent[]
}

export interface PlantSimulationState {
  id: string
  plantId: string
  plantInfo: PlantInfo
  bedId: string
  position: { x: number; y: number }
  ageInMonths: number
  maturityPercent: number // 0-100
  height: number // current height in inches
  canopyRadius: number // current canopy radius in feet
  isAlive: boolean
  health: 'excellent' | 'good' | 'fair' | 'poor'
  yieldToDate: number // lbs produced so far
  currentYield: number // lbs producing this month
  stage: 'germinating' | 'establishing' | 'growing' | 'producing' | 'declining'
}

export interface GardenMetrics {
  totalPlants: number
  alivePlants: number
  producingPlants: number
  totalYield: number // cumulative lbs
  currentMonthlyYield: number // lbs/month
  canopyCoverage: number // percentage of bed area covered
  biomass: number // total plant mass in lbs
  biodiversity: number // species count
}

export interface SimulationEvent {
  month: number
  type: 'planted' | 'first_harvest' | 'peak_production' | 'decline' | 'death' | 'milestone'
  plantId?: string
  description: string
}

export interface SimulationScenario {
  name: string
  waterAvailability: number // 0-100% (100 = optimal)
  temperature: 'cold' | 'normal' | 'hot'
  pestPressure: 'low' | 'medium' | 'high'
  maintenanceLevel: 'minimal' | 'regular' | 'intensive'
}

const DEFAULT_SCENARIO: SimulationScenario = {
  name: 'Optimal Conditions',
  waterAvailability: 100,
  temperature: 'normal',
  pestPressure: 'low',
  maintenanceLevel: 'regular',
}

/**
 * Initialize simulation from garden beds
 */
export function initializeSimulation(gardenBeds: GardenBed[]): SimulationState {
  const plants: PlantSimulationState[] = []

  gardenBeds.forEach((bed) => {
    bed.plants?.forEach((plant) => {
      const plantInfo = PLANT_LIBRARY.find((p) => p.id === plant.plantId)
      if (!plantInfo) return

      plants.push({
        id: plant.id,
        plantId: plant.plantId,
        plantInfo,
        bedId: bed.id,
        position: { x: plant.x, y: plant.y },
        ageInMonths: 0,
        maturityPercent: 0,
        height: 0,
        canopyRadius: 0,
        isAlive: true,
        health: 'excellent',
        yieldToDate: 0,
        currentYield: 0,
        stage: 'germinating',
      })
    })
  })

  return {
    currentMonth: 0,
    year: 0,
    month: 0,
    season: 'spring',
    plants,
    metrics: calculateMetrics(plants),
    events: [
      {
        month: 0,
        type: 'planted',
        description: `Garden planted with ${plants.length} plants`,
      },
    ],
  }
}

/**
 * Advance simulation by one month
 */
export function advanceMonth(
  state: SimulationState,
  scenario: SimulationScenario = DEFAULT_SCENARIO
): SimulationState {
  const newMonth = state.currentMonth + 1
  const year = Math.floor(newMonth / 12)
  const month = newMonth % 12
  const season = getSeasonFromMonth(month)

  const newPlants = state.plants.map((plant) =>
    simulatePlantGrowth(plant, scenario, season)
  )

  const newEvents = detectEvents(state.plants, newPlants, newMonth)

  return {
    currentMonth: newMonth,
    year,
    month,
    season,
    plants: newPlants,
    metrics: calculateMetrics(newPlants),
    events: [...state.events, ...newEvents],
  }
}

/**
 * Jump to specific month (for seeking)
 */
export function jumpToMonth(
  initialState: SimulationState,
  targetMonth: number,
  scenario: SimulationScenario = DEFAULT_SCENARIO
): SimulationState {
  let state = initialState
  while (state.currentMonth < targetMonth) {
    state = advanceMonth(state, scenario)
  }
  return state
}

/**
 * Simulate plant growth for one month
 */
function simulatePlantGrowth(
  plant: PlantSimulationState,
  scenario: SimulationScenario,
  season: string
): PlantSimulationState {
  if (!plant.isAlive) return plant

  const newAge = plant.ageInMonths + 1
  const plantType = plant.plantInfo.category

  // Calculate maturity time based on plant type
  const maturityMonths = getMaturityMonths(plantType)
  const maturityPercent = Math.min((newAge / maturityMonths) * 100, 100)

  // Calculate growth factors
  const waterFactor = scenario.waterAvailability / 100
  const tempFactor = getTemperatureFactor(plantType, scenario.temperature)
  const pestFactor = getPestFactor(scenario.pestPressure)
  const growthFactor = waterFactor * tempFactor * pestFactor

  // Calculate size
  const targetHeight = getTargetHeight(plant.plantInfo)
  const targetCanopy = getTargetCanopy(plant.plantInfo)
  const height = targetHeight * (maturityPercent / 100) * growthFactor
  const canopyRadius = targetCanopy * (maturityPercent / 100) * growthFactor

  // Calculate stage
  const stage = getGrowthStage(maturityPercent, newAge)

  // Calculate yield
  const { currentYield, yieldToDate } = calculateYield(
    plant,
    maturityPercent,
    season,
    growthFactor
  )

  // Calculate health
  const health = calculateHealth(growthFactor, newAge, maturityMonths)

  // Check if plant dies (very old plants)
  const lifespan = getLifespan(plantType)
  const isAlive = newAge < lifespan

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
  }
}

/**
 * Get plant maturity time in months
 */
function getMaturityMonths(type: string): number {
  switch (type) {
    case 'annual':
      return 3 // 3 months to maturity
    case 'herb':
      return 2 // 2 months to maturity
    case 'perennial':
      return 12 // 1 year to maturity
    case 'berry':
      return 24 // 2 years to maturity
    case 'shrub':
      return 36 // 3 years to maturity
    case 'tree':
      return 60 // 5 years to maturity
    default:
      return 12
  }
}

/**
 * Get target mature height in inches
 */
function getTargetHeight(plant: PlantInfo): number {
  switch (plant.category) {
    case 'tree':
      return 180 // 15 feet
    case 'shrub':
      return 72 // 6 feet
    case 'fruit':
      return 48 // 4 feet
    case 'herb':
      return 18 // 1.5 feet
    case 'flower':
      return 24 // 2 feet
    case 'vegetable':
      return 24 // 2 feet
    case 'groundcover':
      return 12 // 1 foot
    case 'vine':
      return 36 // 3 feet
    default:
      return 24
  }
}

/**
 * Get target canopy radius in feet
 */
function getTargetCanopy(plant: PlantInfo): number {
  switch (plant.category) {
    case 'tree':
      return 8
    case 'shrub':
      return 3
    case 'fruit':
      return 2
    case 'herb':
      return 0.75
    case 'flower':
      return 1
    case 'vegetable':
      return 1
    case 'groundcover':
      return 0.5
    case 'vine':
      return 1.5
    default:
      return 1
  }
}

/**
 * Get lifespan in months
 */
function getLifespan(type: string): number {
  switch (type) {
    case 'annual':
      return 6 // 6 months (one season)
    case 'herb':
      return 36 // 3 years
    case 'perennial':
      return 120 // 10 years
    case 'berry':
      return 180 // 15 years
    case 'shrub':
      return 300 // 25 years
    case 'tree':
      return 600 // 50 years
    default:
      return 120
  }
}

/**
 * Get growth stage
 */
function getGrowthStage(
  maturityPercent: number,
  age: number
): PlantSimulationState['stage'] {
  if (maturityPercent < 25) return 'germinating'
  if (maturityPercent < 50) return 'establishing'
  if (maturityPercent < 100) return 'growing'
  if (age < getLifespan('perennial') * 0.8) return 'producing'
  return 'declining'
}

/**
 * Calculate yield for current month
 */
function calculateYield(
  plant: PlantSimulationState,
  maturityPercent: number,
  season: string,
  growthFactor: number
): { currentYield: number; yieldToDate: number } {
  // Only produce yield when mature
  if (maturityPercent < 75 || !plant.isAlive) {
    return { currentYield: 0, yieldToDate: plant.yieldToDate }
  }

  // Base yield depends on plant category
  let baseYield = 0
  switch (plant.plantInfo.category) {
    case 'tree':
      baseYield = 10 // 10 lbs per month
      break
    case 'fruit':
      baseYield = 3 // 3 lbs per month
      break
    case 'vegetable':
      baseYield = 2 // 2 lbs per month
      break
    case 'herb':
      baseYield = 1 // 1 lb per month
      break
    default:
      baseYield = 1
  }

  // Seasonal modifier
  const seasonalModifier = getSeasonalYieldModifier(plant.plantInfo.category, season)

  // Calculate current month's yield
  const currentYield = baseYield * seasonalModifier * growthFactor * (maturityPercent / 100)

  return {
    currentYield,
    yieldToDate: plant.yieldToDate,
  }
}

/**
 * Get seasonal yield modifier
 */
function getSeasonalYieldModifier(type: string, season: string): number {
  if (type === 'tree' || type === 'berry') {
    // Fruit trees produce in summer/fall
    return season === 'summer' || season === 'fall' ? 1.5 : 0.1
  }
  if (type === 'annual') {
    // Annuals produce in growing season
    return season === 'spring' || season === 'summer' ? 1.2 : 0.3
  }
  return 1 // Perennials produce year-round at steady rate
}

/**
 * Get temperature factor
 */
function getTemperatureFactor(
  plantType: string,
  temperature: SimulationScenario['temperature']
): number {
  if (temperature === 'normal') return 1

  // Trees are resilient
  if (plantType === 'tree' || plantType === 'shrub') {
    return temperature === 'hot' ? 0.9 : 0.85
  }

  // Annuals are sensitive
  if (plantType === 'annual') {
    return temperature === 'hot' ? 0.7 : 0.6
  }

  return temperature === 'hot' ? 0.85 : 0.75
}

/**
 * Get pest pressure factor
 */
function getPestFactor(pressure: SimulationScenario['pestPressure']): number {
  switch (pressure) {
    case 'low':
      return 0.95
    case 'medium':
      return 0.85
    case 'high':
      return 0.7
  }
}

/**
 * Calculate plant health
 */
function calculateHealth(
  growthFactor: number,
  age: number,
  maturityMonths: number
): PlantSimulationState['health'] {
  const relativeAge = age / maturityMonths

  // Young plants and old plants have lower health
  if (relativeAge < 0.5 || relativeAge > 3) {
    if (growthFactor > 0.8) return 'good'
    return 'fair'
  }

  if (growthFactor > 0.9) return 'excellent'
  if (growthFactor > 0.7) return 'good'
  if (growthFactor > 0.5) return 'fair'
  return 'poor'
}

/**
 * Calculate garden metrics
 */
function calculateMetrics(plants: PlantSimulationState[]): GardenMetrics {
  const alivePlants = plants.filter((p) => p.isAlive)
  const producingPlants = alivePlants.filter((p) => p.currentYield > 0)

  return {
    totalPlants: plants.length,
    alivePlants: alivePlants.length,
    producingPlants: producingPlants.length,
    totalYield: plants.reduce((sum, p) => sum + p.yieldToDate, 0),
    currentMonthlyYield: plants.reduce((sum, p) => sum + p.currentYield, 0),
    canopyCoverage: calculateCanopyCoverage(alivePlants),
    biomass: alivePlants.reduce((sum, p) => sum + p.height * p.canopyRadius, 0),
    biodiversity: new Set(alivePlants.map((p) => p.plantId)).size,
  }
}

/**
 * Calculate canopy coverage percentage
 */
function calculateCanopyCoverage(plants: PlantSimulationState[]): number {
  const totalCanopyArea = plants.reduce((sum, p) => {
    return sum + Math.PI * p.canopyRadius * p.canopyRadius
  }, 0)
  // Assume 100 sq ft per bed on average
  const estimatedBedArea = 100
  return Math.min((totalCanopyArea / estimatedBedArea) * 100, 100)
}

/**
 * Detect simulation events
 */
function detectEvents(
  oldPlants: PlantSimulationState[],
  newPlants: PlantSimulationState[],
  month: number
): SimulationEvent[] {
  const events: SimulationEvent[] = []

  newPlants.forEach((newPlant, i) => {
    const oldPlant = oldPlants[i]

    // First harvest
    if (oldPlant.currentYield === 0 && newPlant.currentYield > 0) {
      events.push({
        month,
        type: 'first_harvest',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} produced first harvest!`,
      })
    }

    // Death
    if (oldPlant.isAlive && !newPlant.isAlive) {
      events.push({
        month,
        type: 'death',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} has died`,
      })
    }

    // Milestones
    if (
      Math.floor(oldPlant.maturityPercent / 25) < Math.floor(newPlant.maturityPercent / 25)
    ) {
      events.push({
        month,
        type: 'milestone',
        plantId: newPlant.id,
        description: `${newPlant.plantInfo.name} reached ${Math.floor(newPlant.maturityPercent)}% maturity`,
      })
    }
  })

  return events
}

/**
 * Get season from month (0-11)
 */
function getSeasonFromMonth(month: number): SimulationState['season'] {
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

/**
 * Compare two scenarios
 */
export function compareScenarios(
  initialState: SimulationState,
  scenario1: SimulationScenario,
  scenario2: SimulationScenario,
  months: number
): {
  scenario1: SimulationState
  scenario2: SimulationState
  differences: {
    yieldDifference: number
    healthDifference: number
    survivalDifference: number
  }
} {
  const state1 = jumpToMonth(initialState, months, scenario1)
  const state2 = jumpToMonth(initialState, months, scenario2)

  return {
    scenario1: state1,
    scenario2: state2,
    differences: {
      yieldDifference: state1.metrics.totalYield - state2.metrics.totalYield,
      healthDifference:
        state1.plants.filter((p) => p.health === 'excellent').length -
        state2.plants.filter((p) => p.health === 'excellent').length,
      survivalDifference: state1.metrics.alivePlants - state2.metrics.alivePlants,
    },
  }
}
