/**
 * Comprehensive garden calculation service
 * Provides accurate calculations for water needs, spacing optimization, and yield estimates
 */

// Type definitions - these would normally come from a central types file
interface PlantInfo {
  id: string
  name: string
  spacing?: number
  height?: number
  growthHabit?: string
  requirements: {
    water: 'low' | 'medium' | 'high'
    sun: 'full' | 'partial' | 'shade'
  }
}

// Constants for calculations
const WATER_CONSTANTS = {
  // Base water needs in gallons per square foot per week
  LOW: 0.25,      // Drought-tolerant plants
  MEDIUM: 0.62,   // Average plants
  HIGH: 1.0,      // Water-loving plants

  // Climate modifiers
  CLIMATE_MODIFIERS: {
    arid: 1.5,
    semi_arid: 1.3,
    temperate: 1.0,
    humid: 0.8,
    tropical: 0.9
  },

  // Seasonal modifiers
  SEASON_MODIFIERS: {
    spring: 0.9,
    summer: 1.2,
    fall: 0.8,
    winter: 0.5
  },

  // Soil type modifiers
  SOIL_MODIFIERS: {
    sandy: 1.3,    // Drains quickly, needs more water
    loamy: 1.0,    // Ideal, retains appropriate moisture
    clay: 0.8,     // Retains water well
    rocky: 1.2,    // Poor water retention
    amended: 0.9   // Improved with compost
  }
}

const SPACING_CONSTANTS = {
  // Minimum spacing multipliers based on growth habit
  GROWTH_MULTIPLIERS: {
    compact: 0.8,
    standard: 1.0,
    spreading: 1.5,
    vining: 2.0,
    dwarf: 0.6
  },

  // Companion planting spacing adjustments
  COMPANION_BONUS: 0.9,  // Can plant 10% closer when companions
  ANTAGONIST_PENALTY: 1.2, // Need 20% more space when antagonistic

  // Intensive gardening methods
  SQUARE_FOOT_EFFICIENCY: 0.75,
  BIOINTENSIVE_EFFICIENCY: 0.6,
  TRADITIONAL_EFFICIENCY: 1.0
}

const YIELD_CONSTANTS = {
  // Base yield multipliers
  OPTIMAL_CONDITIONS: 1.2,
  GOOD_CONDITIONS: 1.0,
  FAIR_CONDITIONS: 0.8,
  POOR_CONDITIONS: 0.5,

  // Experience level multipliers
  EXPERIENCE_MULTIPLIERS: {
    beginner: 0.7,
    intermediate: 0.9,
    experienced: 1.0,
    expert: 1.1
  },

  // Method multipliers
  METHOD_MULTIPLIERS: {
    traditional: 1.0,
    raised_bed: 1.2,
    square_foot: 1.3,
    biointensive: 1.5,
    permaculture: 1.4,
    hydroponic: 1.8
  }
}

export interface WaterCalculationInput {
  plants: Array<{
    type: string
    quantity: number
    squareFeet: number
    waterNeeds: 'low' | 'medium' | 'high'
  }>
  climate?: 'arid' | 'semi_arid' | 'temperate' | 'humid' | 'tropical'
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  soilType?: 'sandy' | 'loamy' | 'clay' | 'rocky' | 'amended'
  irrigationMethod?: 'drip' | 'sprinkler' | 'hand' | 'soaker'
}

export interface WaterCalculationResult {
  dailyGallons: number
  weeklyGallons: number
  monthlyGallons: number
  peakSummerGallons: number
  byPlant: Array<{
    plant: string
    dailyGallons: number
    weeklyGallons: number
  }>
  recommendations: string[]
  savingsTips: string[]
  irrigationSchedule: {
    frequency: string
    duration: string
    bestTime: string
  }
}

/**
 * Calculate comprehensive water requirements
 */
export function calculateWaterRequirements(input: WaterCalculationInput): WaterCalculationResult {
  const climate = input.climate || 'temperate'
  const season = input.season || 'summer'
  const soilType = input.soilType || 'loamy'
  const irrigationMethod = input.irrigationMethod || 'hand'

  let totalDailyGallons = 0
  const plantBreakdown: Array<{ plant: string; dailyGallons: number; weeklyGallons: number }> = []

  // Calculate for each plant type
  input.plants.forEach(plant => {
    // Base water need
    const baseWater = WATER_CONSTANTS[plant.waterNeeds.toUpperCase() as keyof typeof WATER_CONSTANTS] as number

    // Apply modifiers
    const climateModifier = WATER_CONSTANTS.CLIMATE_MODIFIERS[climate]
    const seasonModifier = WATER_CONSTANTS.SEASON_MODIFIERS[season]
    const soilModifier = WATER_CONSTANTS.SOIL_MODIFIERS[soilType]

    // Calculate actual water need per square foot
    const waterPerSqFt = baseWater * climateModifier * seasonModifier * soilModifier

    // Total for this plant type
    const dailyWater = (waterPerSqFt * plant.squareFeet) / 7 // Convert weekly to daily
    const weeklyWater = waterPerSqFt * plant.squareFeet

    totalDailyGallons += dailyWater
    plantBreakdown.push({
      plant: plant.type,
      dailyGallons: Math.round(dailyWater * 10) / 10,
      weeklyGallons: Math.round(weeklyWater * 10) / 10
    })
  })

  // Calculate totals
  const weeklyGallons = totalDailyGallons * 7
  const monthlyGallons = totalDailyGallons * 30
  const peakSummerGallons = weeklyGallons * 1.2 // Peak summer needs

  // Generate recommendations
  const recommendations = []
  if (climate === 'arid' || climate === 'semi_arid') {
    recommendations.push('Consider drought-tolerant varieties and mulching heavily')
  }
  if (soilType === 'sandy') {
    recommendations.push('Add organic matter to improve water retention')
  }
  if (irrigationMethod !== 'drip') {
    recommendations.push('Drip irrigation can reduce water usage by 30-50%')
  }

  // Water-saving tips
  const savingsTips = [
    'Mulch 2-3 inches deep to reduce evaporation',
    'Water early morning or evening to minimize loss',
    'Group plants with similar water needs together',
    'Install rain barrels to harvest rainwater',
    'Use soaker hoses or drip irrigation for efficiency'
  ]

  // Irrigation schedule based on climate and season
  const irrigationSchedule = {
    frequency: getIrrigationFrequency(climate, season),
    duration: `${Math.ceil(totalDailyGallons / 10)} minutes per zone`,
    bestTime: season === 'summer' ? '6-8 AM' : '7-9 AM'
  }

  return {
    dailyGallons: Math.round(totalDailyGallons * 10) / 10,
    weeklyGallons: Math.round(weeklyGallons * 10) / 10,
    monthlyGallons: Math.round(monthlyGallons),
    peakSummerGallons: Math.round(peakSummerGallons),
    byPlant: plantBreakdown,
    recommendations,
    savingsTips,
    irrigationSchedule
  }
}

function getIrrigationFrequency(climate: string, season: string): string {
  if (season === 'winter') return 'Once per week or less'
  if (climate === 'arid' || climate === 'semi_arid') {
    return season === 'summer' ? 'Daily or every other day' : '2-3 times per week'
  }
  if (climate === 'humid' || climate === 'tropical') {
    return season === 'summer' ? '2-3 times per week' : 'Once per week'
  }
  return season === 'summer' ? 'Every other day' : 'Twice per week'
}

export interface SpacingCalculationInput {
  plants: Array<{
    name: string
    mature_width: number  // in inches
    mature_height: number // in inches
    growth_habit: 'compact' | 'standard' | 'spreading' | 'vining' | 'dwarf'
    quantity: number
  }>
  bedDimensions: {
    width: number  // in feet
    length: number // in feet
  }
  method: 'traditional' | 'square_foot' | 'biointensive'
  companions?: Array<{ plant1: string; plant2: string; relationship: 'companion' | 'antagonist' }>
}

export interface SpacingCalculationResult {
  totalPlantsSupported: number
  squareFeetNeeded: number
  layout: Array<{
    plant: string
    spacing: number // inches between plants
    plantsPerSquareFoot: number
    totalArea: number // square feet
    pattern: 'grid' | 'offset' | 'single'
    quantity: number
  }>
  efficient: boolean
  warnings: string[]
  suggestions: string[]
  visualGrid?: number[][] // Optional grid representation
}

/**
 * Calculate optimal plant spacing
 */
export function calculateOptimalSpacing(input: SpacingCalculationInput): SpacingCalculationResult {
  const bedArea = input.bedDimensions.width * input.bedDimensions.length
  const methodEfficiency = SPACING_CONSTANTS[`${input.method.toUpperCase()}_EFFICIENCY` as keyof typeof SPACING_CONSTANTS] as number

  const layout: SpacingCalculationResult['layout'] = []
  let totalSquareFeetNeeded = 0
  let totalPlantsSupported = 0
  const warnings: string[] = []
  const suggestions: string[] = []

  input.plants.forEach(plant => {
    // Base spacing is mature width
    let spacing = plant.mature_width

    // Apply growth habit modifier
    const growthModifier = SPACING_CONSTANTS.GROWTH_MULTIPLIERS[plant.growth_habit]
    spacing *= growthModifier

    // Apply method efficiency
    spacing *= methodEfficiency

    // Check for companion/antagonist relationships
    if (input.companions) {
      const relationships = input.companions.filter(
        c => c.plant1 === plant.name || c.plant2 === plant.name
      )
      relationships.forEach(rel => {
        if (rel.relationship === 'companion') {
          spacing *= SPACING_CONSTANTS.COMPANION_BONUS
        } else {
          spacing *= SPACING_CONSTANTS.ANTAGONIST_PENALTY
          warnings.push(`${plant.name} may not grow well near antagonist plants`)
        }
      })
    }

    // Calculate plants per square foot
    const spacingInFeet = spacing / 12
    const plantsPerSquareFoot = spacingInFeet > 0 ? 1 / (spacingInFeet * spacingInFeet) : 1

    // Calculate total area needed for this plant
    const areaNeeded = plant.quantity / plantsPerSquareFoot
    totalSquareFeetNeeded += areaNeeded
    totalPlantsSupported += plant.quantity

    // Determine planting pattern
    let pattern: 'grid' | 'offset' | 'single' = 'grid'
    if (plant.growth_habit === 'vining') pattern = 'single'
    else if (plantsPerSquareFoot < 1) pattern = 'offset'

    layout.push({
      plant: plant.name,
      spacing: Math.round(spacing),
      plantsPerSquareFoot: Math.round(plantsPerSquareFoot * 10) / 10,
      totalArea: Math.round(areaNeeded * 10) / 10,
      pattern,
      quantity: plant.quantity
    })
  })

  // Check if bed is large enough
  const efficient = totalSquareFeetNeeded <= bedArea

  if (!efficient) {
    warnings.push(`Need ${Math.round(totalSquareFeetNeeded)} sq ft but only have ${bedArea} sq ft`)
    suggestions.push('Consider succession planting or vertical growing for vining plants')
  }

  // Add method-specific suggestions
  if (input.method === 'traditional') {
    suggestions.push('Consider square foot gardening for 20-30% space savings')
  }
  if (input.method === 'square_foot' && input.plants.some(p => p.growth_habit === 'vining')) {
    suggestions.push('Use trellises for vining plants to maximize space')
  }

  return {
    totalPlantsSupported,
    squareFeetNeeded: Math.round(totalSquareFeetNeeded * 10) / 10,
    layout,
    efficient,
    warnings,
    suggestions
  }
}

export interface YieldCalculationInput {
  plants: Array<{
    name: string
    type: 'tomato' | 'pepper' | 'lettuce' | 'carrot' | 'bean' | 'squash' | 'cucumber' | 'herb' | 'other'
    quantity: number
    variety?: string
    expectedYieldPerPlant?: number // Override if known
  }>
  conditions: {
    soil: 'poor' | 'fair' | 'good' | 'excellent'
    sun: 'full' | 'partial' | 'shade'
    water: 'insufficient' | 'adequate' | 'optimal'
  }
  experience: 'beginner' | 'intermediate' | 'experienced' | 'expert'
  method: 'traditional' | 'raised_bed' | 'square_foot' | 'biointensive' | 'permaculture' | 'hydroponic'
  season: 'spring' | 'summer' | 'fall' | 'winter'
}

export interface YieldCalculationResult {
  totalYieldPounds: number
  totalYieldKg: number
  byPlant: Array<{
    plant: string
    expectedYieldPounds: number
    yieldRange: { min: number; max: number }
    harvestPeriod: string
    storageLife: string
    marketValue: number
  }>
  nutritionalValue: {
    estimatedCalories: number
    servings: number
    varietyScore: number // 1-10 for nutritional diversity
  }
  recommendations: string[]
  succession: {
    possible: boolean
    additionalYield: number
    schedule: string[]
  }
}

// Yield data per plant in pounds
const YIELD_DATA: Record<string, { perPlant: number; harvestPeriod: string; storageLife: string; caloriesPerPound: number }> = {
  tomato: { perPlant: 10, harvestPeriod: '8-12 weeks', storageLife: '1-2 weeks fresh', caloriesPerPound: 80 },
  pepper: { perPlant: 5, harvestPeriod: '8-10 weeks', storageLife: '2-3 weeks fresh', caloriesPerPound: 120 },
  lettuce: { perPlant: 1, harvestPeriod: '4-6 weeks', storageLife: '1 week fresh', caloriesPerPound: 60 },
  carrot: { perPlant: 0.5, harvestPeriod: '10-12 weeks', storageLife: '4-6 months cold storage', caloriesPerPound: 180 },
  bean: { perPlant: 0.5, harvestPeriod: '6-8 weeks', storageLife: '1 week fresh, 1 year dried', caloriesPerPound: 150 },
  squash: { perPlant: 8, harvestPeriod: '8-12 weeks', storageLife: '2-6 months', caloriesPerPound: 90 },
  cucumber: { perPlant: 6, harvestPeriod: '6-8 weeks', storageLife: '1 week fresh', caloriesPerPound: 70 },
  herb: { perPlant: 0.25, harvestPeriod: 'Continuous', storageLife: '1 week fresh, 1 year dried', caloriesPerPound: 200 },
  other: { perPlant: 2, harvestPeriod: '8-10 weeks', storageLife: '2 weeks', caloriesPerPound: 100 }
}

/**
 * Calculate expected yield
 */
export function calculateExpectedYield(input: YieldCalculationInput): YieldCalculationResult {
  let totalYieldPounds = 0
  let totalCalories = 0
  const plantYields: YieldCalculationResult['byPlant'] = []

  // Calculate condition modifier
  let conditionModifier = 1.0
  if (input.conditions.soil === 'excellent' && input.conditions.sun === 'full' && input.conditions.water === 'optimal') {
    conditionModifier = YIELD_CONSTANTS.OPTIMAL_CONDITIONS
  } else if (input.conditions.soil === 'good' && input.conditions.water === 'adequate') {
    conditionModifier = YIELD_CONSTANTS.GOOD_CONDITIONS
  } else if (input.conditions.soil === 'fair' || input.conditions.water === 'adequate') {
    conditionModifier = YIELD_CONSTANTS.FAIR_CONDITIONS
  } else {
    conditionModifier = YIELD_CONSTANTS.POOR_CONDITIONS
  }

  // Apply experience and method modifiers
  const experienceModifier = YIELD_CONSTANTS.EXPERIENCE_MULTIPLIERS[input.experience]
  const methodModifier = YIELD_CONSTANTS.METHOD_MULTIPLIERS[input.method]

  // Calculate yield for each plant
  input.plants.forEach(plant => {
    const yieldInfo = YIELD_DATA[plant.type] || YIELD_DATA.other
    const baseYield = plant.expectedYieldPerPlant || yieldInfo.perPlant

    // Calculate expected yield with all modifiers
    const expectedYield = baseYield * plant.quantity * conditionModifier * experienceModifier * methodModifier

    // Calculate yield range (±20%)
    const minYield = expectedYield * 0.8
    const maxYield = expectedYield * 1.2

    // Estimate market value ($2-4 per pound for most vegetables)
    const marketValue = expectedYield * (plant.type === 'herb' ? 8 : 3)

    totalYieldPounds += expectedYield
    totalCalories += expectedYield * yieldInfo.caloriesPerPound

    plantYields.push({
      plant: plant.name,
      expectedYieldPounds: Math.round(expectedYield * 10) / 10,
      yieldRange: {
        min: Math.round(minYield * 10) / 10,
        max: Math.round(maxYield * 10) / 10
      },
      harvestPeriod: yieldInfo.harvestPeriod,
      storageLife: yieldInfo.storageLife,
      marketValue: Math.round(marketValue)
    })
  })

  // Calculate nutritional value
  const servings = Math.round(totalYieldPounds * 3) // Rough estimate: 3 servings per pound
  const varietyScore = Math.min(10, input.plants.length * 1.5) // More variety = better nutrition

  // Generate recommendations
  const recommendations = []
  if (input.conditions.soil !== 'excellent') {
    recommendations.push('Improve soil with compost for better yields')
  }
  if (input.experience === 'beginner') {
    recommendations.push('Start with easy-to-grow varieties and gradually expand')
  }
  if (input.method === 'traditional') {
    recommendations.push('Consider raised beds or square foot gardening for higher yields')
  }

  // Calculate succession planting potential
  const canSuccession = input.season !== 'winter' &&
    input.plants.some(p => ['lettuce', 'bean', 'cucumber'].includes(p.type))

  const successionSchedule = canSuccession ? [
    'First planting: Early ' + input.season,
    'Second planting: Mid ' + input.season,
    'Third planting: Late ' + input.season
  ] : []

  return {
    totalYieldPounds: Math.round(totalYieldPounds * 10) / 10,
    totalYieldKg: Math.round(totalYieldPounds * 0.453592 * 10) / 10,
    byPlant: plantYields,
    nutritionalValue: {
      estimatedCalories: Math.round(totalCalories),
      servings,
      varietyScore: Math.round(varietyScore * 10) / 10
    },
    recommendations,
    succession: {
      possible: canSuccession,
      additionalYield: canSuccession ? Math.round(totalYieldPounds * 0.5) : 0,
      schedule: successionSchedule
    }
  }
}

/**
 * Calculate return on investment for the garden
 */
export function calculateROI(
  setupCost: number,
  annualMaintenance: number,
  expectedYield: YieldCalculationResult
): {
  firstYearROI: number
  fiveYearROI: number
  breakEvenMonths: number
  annualSavings: number
} {
  const annualValue = expectedYield.byPlant.reduce((sum, plant) => sum + plant.marketValue, 0)
  const firstYearProfit = annualValue - setupCost - annualMaintenance
  const fiveYearProfit = (annualValue * 5) - setupCost - (annualMaintenance * 5)

  return {
    firstYearROI: Math.round((firstYearProfit / setupCost) * 100),
    fiveYearROI: Math.round((fiveYearProfit / setupCost) * 100),
    breakEvenMonths: Math.ceil((setupCost / (annualValue / 12))),
    annualSavings: Math.round(annualValue - annualMaintenance)
  }
}