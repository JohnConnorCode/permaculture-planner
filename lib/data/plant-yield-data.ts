/**
 * Accurate yield and resource data for plants
 *
 * Based on:
 * - USDA crop yield data
 * - University extension research
 * - Commercial growing standards
 * - Square foot gardening principles
 */

export interface PlantYieldData {
  /** Expected yield per plant in pounds (annual) */
  yieldPerPlant: {
    min: number
    max: number
    average: number
  }
  /** Market price per pound (USD) - retail replacement value */
  marketPrice: number
  /** Water needs in gallons per week during peak growing */
  waterPerWeek: {
    /** Base water needs */
    base: number
    /** Multiplier for hot/dry climates */
    dryClimateMultiplier: number
    /** Multiplier for cool/humid climates */
    humidClimateMultiplier: number
  }
  /** Harvest season duration in weeks */
  harvestDuration: number
  /** Days to maturity */
  daysToMaturity: number
}

/**
 * Comprehensive yield and resource data for all plants
 *
 * Sources:
 * - USDA National Agricultural Statistics Service
 * - Cornell University Extension
 * - UC Davis Agricultural Research
 * - Square Foot Gardening foundation
 */
export const PLANT_YIELD_DATABASE: Record<string, PlantYieldData> = {
  // VEGETABLES
  tomato: {
    yieldPerPlant: { min: 8, max: 25, average: 15 }, // Determinate: 8-15 lbs, Indeterminate: 15-25 lbs
    marketPrice: 3.50,
    waterPerWeek: {
      base: 1.5, // gallons/day during fruiting = 10.5/week
      dryClimateMultiplier: 1.5,
      humidClimateMultiplier: 0.7,
    },
    harvestDuration: 8, // 8-12 weeks
    daysToMaturity: 65,
  },

  lettuce: {
    yieldPerPlant: { min: 0.3, max: 0.8, average: 0.5 }, // Head lettuce ~0.5 lb
    marketPrice: 2.50,
    waterPerWeek: {
      base: 0.25, // 1.75/week - cool season crop needs less
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 4, // Can succession plant
    daysToMaturity: 45,
  },

  carrot: {
    yieldPerPlant: { min: 0.15, max: 0.3, average: 0.2 }, // ~3-4 oz per carrot
    marketPrice: 1.50,
    waterPerWeek: {
      base: 0.15, // 1 gal/week for root development
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 3,
    daysToMaturity: 70,
  },

  pepper: {
    yieldPerPlant: { min: 5, max: 12, average: 8 }, // Bell peppers
    marketPrice: 4.00,
    waterPerWeek: {
      base: 1.0, // 7 gal/week
      dryClimateMultiplier: 1.5,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 10,
    daysToMaturity: 70,
  },

  squash: {
    yieldPerPlant: { min: 10, max: 25, average: 15 }, // Summer squash is prolific
    marketPrice: 2.00,
    waterPerWeek: {
      base: 2.0, // 14 gal/week - large plant, large leaves
      dryClimateMultiplier: 1.6,
      humidClimateMultiplier: 0.7,
    },
    harvestDuration: 8,
    daysToMaturity: 50,
  },

  beans: {
    yieldPerPlant: { min: 0.5, max: 1.2, average: 0.75 }, // Bush beans per plant
    marketPrice: 3.00,
    waterPerWeek: {
      base: 0.5, // 3.5 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 6,
    daysToMaturity: 55,
  },

  corn: {
    yieldPerPlant: { min: 1.0, max: 2.0, average: 1.5 }, // 1-2 ears per stalk, ~0.75 lb/ear
    marketPrice: 1.00,
    waterPerWeek: {
      base: 1.5, // 10.5 gal/week - heavy water user
      dryClimateMultiplier: 1.8,
      humidClimateMultiplier: 0.7,
    },
    harvestDuration: 3,
    daysToMaturity: 75,
  },

  onion: {
    yieldPerPlant: { min: 0.25, max: 0.75, average: 0.5 }, // Storage onions
    marketPrice: 1.50,
    waterPerWeek: {
      base: 0.3, // 2 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 2,
    daysToMaturity: 100,
  },

  radish: {
    yieldPerPlant: { min: 0.05, max: 0.15, average: 0.08 }, // Quick crop, small yield
    marketPrice: 2.00,
    waterPerWeek: {
      base: 0.1, // 0.7 gal/week - short season
      dryClimateMultiplier: 1.2,
      humidClimateMultiplier: 1.0,
    },
    harvestDuration: 1,
    daysToMaturity: 25,
  },

  spinach: {
    yieldPerPlant: { min: 0.2, max: 0.5, average: 0.3 }, // Can harvest leaves multiple times
    marketPrice: 4.00,
    waterPerWeek: {
      base: 0.3, // 2 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 6,
    daysToMaturity: 40,
  },

  cabbage: {
    yieldPerPlant: { min: 2, max: 5, average: 3 }, // One head per plant
    marketPrice: 1.00,
    waterPerWeek: {
      base: 1.0, // 7 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 2,
    daysToMaturity: 85,
  },

  peas: {
    yieldPerPlant: { min: 0.3, max: 0.8, average: 0.5 }, // Per vine/plant
    marketPrice: 3.50,
    waterPerWeek: {
      base: 0.4, // 2.8 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 4,
    daysToMaturity: 60,
  },

  garlic: {
    yieldPerPlant: { min: 0.15, max: 0.4, average: 0.25 }, // One bulb per clove planted
    marketPrice: 8.00, // Garlic is expensive!
    waterPerWeek: {
      base: 0.2, // 1.4 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 1,
    daysToMaturity: 240, // Fall planted, summer harvested
  },

  cucumber: {
    yieldPerPlant: { min: 8, max: 15, average: 10 }, // Very productive vines
    marketPrice: 2.00,
    waterPerWeek: {
      base: 1.5, // 10.5 gal/week
      dryClimateMultiplier: 1.6,
      humidClimateMultiplier: 0.7,
    },
    harvestDuration: 8,
    daysToMaturity: 55,
  },

  // HERBS
  basil: {
    yieldPerPlant: { min: 0.5, max: 1.5, average: 1.0 }, // Fresh leaf harvest
    marketPrice: 15.00, // Fresh herbs are expensive per pound
    waterPerWeek: {
      base: 0.5, // 3.5 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 12,
    daysToMaturity: 30,
  },

  rosemary: {
    yieldPerPlant: { min: 0.3, max: 1.0, average: 0.6 }, // Perennial shrub
    marketPrice: 20.00,
    waterPerWeek: {
      base: 0.3, // 2 gal/week - drought tolerant
      dryClimateMultiplier: 1.2,
      humidClimateMultiplier: 1.0,
    },
    harvestDuration: 52, // Year-round
    daysToMaturity: 90,
  },

  mint: {
    yieldPerPlant: { min: 0.5, max: 2.0, average: 1.0 }, // Very prolific
    marketPrice: 18.00,
    waterPerWeek: {
      base: 1.0, // 7 gal/week - loves water
      dryClimateMultiplier: 1.5,
      humidClimateMultiplier: 0.7,
    },
    harvestDuration: 16,
    daysToMaturity: 40,
  },

  thyme: {
    yieldPerPlant: { min: 0.2, max: 0.6, average: 0.4 },
    marketPrice: 22.00,
    waterPerWeek: {
      base: 0.2, // 1.4 gal/week - drought tolerant
      dryClimateMultiplier: 1.1,
      humidClimateMultiplier: 1.0,
    },
    harvestDuration: 20,
    daysToMaturity: 30,
  },

  oregano: {
    yieldPerPlant: { min: 0.3, max: 0.8, average: 0.5 },
    marketPrice: 20.00,
    waterPerWeek: {
      base: 0.3, // 2 gal/week
      dryClimateMultiplier: 1.2,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 16,
    daysToMaturity: 45,
  },

  lavender: {
    yieldPerPlant: { min: 0.5, max: 1.5, average: 1.0 }, // Dried flowers
    marketPrice: 25.00, // Culinary/craft use
    waterPerWeek: {
      base: 0.2, // 1.4 gal/week - very drought tolerant
      dryClimateMultiplier: 1.1,
      humidClimateMultiplier: 1.0,
    },
    harvestDuration: 6,
    daysToMaturity: 90,
  },

  // FRUITS & BERRIES
  strawberry: {
    yieldPerPlant: { min: 0.5, max: 1.5, average: 1.0 }, // Per season
    marketPrice: 5.00,
    waterPerWeek: {
      base: 0.4, // 2.8 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 6,
    daysToMaturity: 120, // First year
  },

  blueberry: {
    yieldPerPlant: { min: 5, max: 20, average: 10 }, // Mature bush (3-5 years)
    marketPrice: 8.00,
    waterPerWeek: {
      base: 2.0, // 14 gal/week - shallow roots
      dryClimateMultiplier: 1.5,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 6,
    daysToMaturity: 365, // First year establishment
  },

  raspberry: {
    yieldPerPlant: { min: 3, max: 8, average: 5 }, // Per cane
    marketPrice: 7.00,
    waterPerWeek: {
      base: 1.5, // 10.5 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 5,
    daysToMaturity: 365,
  },

  grape: {
    yieldPerPlant: { min: 15, max: 30, average: 20 }, // Mature vine (3+ years)
    marketPrice: 3.00,
    waterPerWeek: {
      base: 2.5, // 17.5 gal/week - large vine
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 4,
    daysToMaturity: 1095, // 3 years to full production
  },

  // TREES (annual yield for mature trees)
  apple: {
    yieldPerPlant: { min: 40, max: 200, average: 100 }, // Dwarf: 40-80, Standard: 150-200
    marketPrice: 2.50,
    waterPerWeek: {
      base: 15, // 105 gal/week for mature tree
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 6,
    daysToMaturity: 1825, // 5 years to production
  },

  pear: {
    yieldPerPlant: { min: 50, max: 150, average: 100 },
    marketPrice: 2.00,
    waterPerWeek: {
      base: 12, // 84 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 5,
    daysToMaturity: 1460, // 4 years
  },

  cherry: {
    yieldPerPlant: { min: 30, max: 100, average: 60 },
    marketPrice: 5.00,
    waterPerWeek: {
      base: 10, // 70 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.8,
    },
    harvestDuration: 3,
    daysToMaturity: 1460,
  },

  // FLOWERS & ORNAMENTALS
  marigold: {
    yieldPerPlant: { min: 0.1, max: 0.3, average: 0.2 }, // Flower heads (dried)
    marketPrice: 10.00, // Companion planting value, not market crop
    waterPerWeek: {
      base: 0.3, // 2 gal/week
      dryClimateMultiplier: 1.3,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 12,
    daysToMaturity: 50,
  },

  sunflower: {
    yieldPerPlant: { min: 0.5, max: 2.0, average: 1.0 }, // Seeds per head
    marketPrice: 4.00,
    waterPerWeek: {
      base: 1.0, // 7 gal/week
      dryClimateMultiplier: 1.4,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 2,
    daysToMaturity: 80,
  },

  // GROUNDCOVERS
  clover: {
    yieldPerPlant: { min: 0, max: 0, average: 0 }, // Nitrogen fixer, not harvested
    marketPrice: 0,
    waterPerWeek: {
      base: 0.2, // 1.4 gal/week
      dryClimateMultiplier: 1.2,
      humidClimateMultiplier: 0.9,
    },
    harvestDuration: 0,
    daysToMaturity: 60,
  },
}

/**
 * Calculate water needs based on climate
 */
export function calculateWaterNeeds(
  plantId: string,
  climate: 'dry' | 'humid' | 'moderate' = 'moderate'
): number {
  const yieldData = PLANT_YIELD_DATABASE[plantId]
  if (!yieldData) return 1.0 // Default fallback

  const baseWater = yieldData.waterPerWeek.base

  if (climate === 'dry') {
    return baseWater * yieldData.waterPerWeek.dryClimateMultiplier
  } else if (climate === 'humid') {
    return baseWater * yieldData.waterPerWeek.humidClimateMultiplier
  }

  return baseWater
}

/**
 * Calculate expected yield based on plant maturity
 */
export function calculateExpectedYield(
  plantId: string,
  daysSincePlanting: number = 120, // Default: mature plant
  numberOfPlants: number = 1
): number {
  const yieldData = PLANT_YIELD_DATABASE[plantId]
  if (!yieldData) return 0

  // Maturity factor (0-1)
  const maturityFactor = Math.min(1, daysSincePlanting / yieldData.daysToMaturity)

  // Use average yield adjusted by maturity
  const yieldPerPlant = yieldData.yieldPerPlant.average * maturityFactor

  return yieldPerPlant * numberOfPlants
}

/**
 * Calculate market value
 */
export function calculateMarketValue(plantId: string, pounds: number): number {
  const yieldData = PLANT_YIELD_DATABASE[plantId]
  if (!yieldData) return pounds * 3.0 // Default $3/lb

  return pounds * yieldData.marketPrice
}
