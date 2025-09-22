// Comprehensive Plant Database for the Visual Editor

export type PlantCategory =
  | 'vegetables'
  | 'herbs'
  | 'fruits'
  | 'flowers'
  | 'trees'
  | 'shrubs'
  | 'groundcover'
  | 'vines'

export type SunRequirement = 'full' | 'partial' | 'shade'
export type WaterNeed = 'low' | 'medium' | 'high'
export type Season = 'spring' | 'summer' | 'fall' | 'winter'
export type PlantingMethod = 'direct-seed' | 'transplant' | 'both'

export interface PlantData {
  id: string
  commonName: string
  scientificName: string
  category: PlantCategory
  family: string

  visual: {
    icon: string // Emoji or icon class
    color: string // Primary color for visualization
    matureSize: {
      widthIn: number
      heightIn: number
      spreadIn: number // Root spread
    }
    shape: 'round' | 'spreading' | 'upright' | 'vining' | 'bushy'
  }

  requirements: {
    sun: SunRequirement
    water: WaterNeed
    soil: {
      pH: { min: number; max: number }
      type: ('loamy' | 'sandy' | 'clay' | 'rocky')[]
      drainage: 'well-drained' | 'moist' | 'wet'
    }
    hardiness: {
      minZone: number
      maxZone: number
    }
    spacing: {
      betweenPlants: number // inches
      betweenRows: number // inches
    }
  }

  companionship: {
    beneficial: string[] // Plant IDs
    antagonistic: string[] // Plant IDs
    notes?: string
  }

  lifecycle: {
    type: 'annual' | 'biennial' | 'perennial'
    plantingMethod: PlantingMethod
    daysToGermination?: { min: number; max: number }
    daysToMaturity: { min: number; max: number }
    harvestWindow: number // days
  }

  seasons: {
    plantingStart: { month: number; day: number }
    plantingEnd: { month: number; day: number }
    harvestStart?: { month: number; day: number }
    harvestEnd?: { month: number; day: number }
    bloomStart?: { month: number; day: number }
    bloomEnd?: { month: number; day: number }
  }

  yield?: {
    amount: { min: number; max: number }
    unit: string // 'lbs', 'bunches', 'heads', etc
    perPlant: boolean
  }

  benefits: string[] // 'nitrogen-fixer', 'pollinator', 'pest-deterrent', etc
  tags: string[] // Additional searchable tags
}

// Plant Database
export const PLANTS: PlantData[] = [
  // VEGETABLES
  {
    id: 'tomato',
    commonName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    family: 'Nightshade',
    visual: {
      icon: '🍅',
      color: '#FF6B6B',
      matureSize: { widthIn: 24, heightIn: 48, spreadIn: 24 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 6.8 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 11 },
      spacing: { betweenPlants: 24, betweenRows: 36 }
    },
    companionship: {
      beneficial: ['basil', 'carrot', 'marigold', 'nasturtium'],
      antagonistic: ['brassicas', 'fennel'],
      notes: 'Basil improves flavor and repels aphids'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 60, max: 85 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 6, day: 15 },
      harvestStart: { month: 7, day: 15 },
      harvestEnd: { month: 10, day: 1 }
    },
    yield: {
      amount: { min: 10, max: 20 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['summer-crop', 'heavy-feeder', 'vine']
  },

  {
    id: 'basil',
    commonName: 'Basil',
    scientificName: 'Ocimum basilicum',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#4ECDC4',
      matureSize: { widthIn: 12, heightIn: 18, spreadIn: 12 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 10, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['tomato', 'pepper', 'oregano'],
      antagonistic: ['rue'],
      notes: 'Repels aphids, mosquitoes, and tomato hornworms'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 60, max: 90 },
      harvestWindow: 120
    },
    seasons: {
      plantingStart: { month: 5, day: 20 },
      plantingEnd: { month: 7, day: 1 },
      harvestStart: { month: 6, day: 20 },
      harvestEnd: { month: 9, day: 30 }
    },
    benefits: ['pest-deterrent', 'pollinator'],
    tags: ['aromatic', 'culinary', 'medicinal']
  },

  {
    id: 'carrot',
    commonName: 'Carrot',
    scientificName: 'Daucus carota',
    category: 'vegetables',
    family: 'Carrot',
    visual: {
      icon: '🥕',
      color: '#FF8C42',
      matureSize: { widthIn: 3, heightIn: 12, spreadIn: 3 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 6.8 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 10 },
      spacing: { betweenPlants: 3, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['tomato', 'lettuce', 'onion', 'leek', 'rosemary', 'sage'],
      antagonistic: ['dill', 'parsnip'],
      notes: 'Loosens soil for tomato roots'
    },
    lifecycle: {
      type: 'biennial',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 10, max: 20 },
      daysToMaturity: { min: 70, max: 80 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 7, day: 15 },
      harvestStart: { month: 6, day: 15 },
      harvestEnd: { month: 10, day: 15 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'lbs',
      perPlant: false
    },
    benefits: [],
    tags: ['root-vegetable', 'cool-season', 'succession-planting']
  },

  {
    id: 'lettuce',
    commonName: 'Lettuce',
    scientificName: 'Lactuca sativa',
    category: 'vegetables',
    family: 'Daisy',
    visual: {
      icon: '🥬',
      color: '#95E77E',
      matureSize: { widthIn: 6, heightIn: 8, spreadIn: 6 },
      shape: 'round'
    },
    requirements: {
      sun: 'partial',
      water: 'high',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['loamy'],
        drainage: 'moist'
      },
      hardiness: { minZone: 4, maxZone: 9 },
      spacing: { betweenPlants: 6, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['carrot', 'radish', 'strawberry', 'cucumber'],
      antagonistic: [],
      notes: 'Benefits from shade of taller plants in summer'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 45, max: 60 },
      harvestWindow: 21
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 9, day: 1 },
      harvestStart: { month: 5, day: 1 },
      harvestEnd: { month: 10, day: 15 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'heads',
      perPlant: true
    },
    benefits: [],
    tags: ['cool-season', 'fast-growing', 'shade-tolerant']
  },

  {
    id: 'marigold',
    commonName: 'Marigold',
    scientificName: 'Tagetes spp.',
    category: 'flowers',
    family: 'Daisy',
    visual: {
      icon: '🌼',
      color: '#FFB347',
      matureSize: { widthIn: 12, heightIn: 18, spreadIn: 12 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy', 'sandy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['tomato', 'pepper', 'eggplant', 'potato'],
      antagonistic: [],
      notes: 'Repels aphids, whiteflies, and tomato hornworms'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 5, max: 7 },
      daysToMaturity: { min: 50, max: 60 },
      harvestWindow: 120
    },
    seasons: {
      plantingStart: { month: 5, day: 1 },
      plantingEnd: { month: 6, day: 15 },
      bloomStart: { month: 6, day: 15 },
      bloomEnd: { month: 10, day: 15 }
    },
    benefits: ['pest-deterrent', 'pollinator'],
    tags: ['companion-plant', 'ornamental', 'easy-grow']
  },

  // Add more plants...
  {
    id: 'beans',
    commonName: 'Green Beans',
    scientificName: 'Phaseolus vulgaris',
    category: 'vegetables',
    family: 'Legume',
    visual: {
      icon: '🫘',
      color: '#4A7C59',
      matureSize: { widthIn: 6, heightIn: 24, spreadIn: 6 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 10 },
      spacing: { betweenPlants: 6, betweenRows: 24 }
    },
    companionship: {
      beneficial: ['corn', 'squash', 'strawberry', 'cucumber'],
      antagonistic: ['onion', 'garlic'],
      notes: 'Part of Three Sisters planting, fixes nitrogen'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 8, max: 10 },
      daysToMaturity: { min: 50, max: 60 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 7, day: 15 },
      harvestStart: { month: 7, day: 15 },
      harvestEnd: { month: 9, day: 15 }
    },
    yield: {
      amount: { min: 0.5, max: 1 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: ['nitrogen-fixer'],
    tags: ['summer-crop', 'climbing', 'three-sisters']
  }
]

// Helper functions
export function getPlantById(id: string): PlantData | undefined {
  return PLANTS.find(p => p.id === id)
}

export function getPlantsByCategory(category: PlantCategory): PlantData[] {
  return PLANTS.filter(p => p.category === category)
}

export function getCompanionPlants(plantId: string): {
  beneficial: PlantData[]
  antagonistic: PlantData[]
} {
  const plant = getPlantById(plantId)
  if (!plant) return { beneficial: [], antagonistic: [] }

  return {
    beneficial: plant.companionship.beneficial
      .map(id => getPlantById(id))
      .filter(Boolean) as PlantData[],
    antagonistic: plant.companionship.antagonistic
      .map(id => getPlantById(id))
      .filter(Boolean) as PlantData[]
  }
}

export function searchPlants(query: string): PlantData[] {
  const lowQuery = query.toLowerCase()
  return PLANTS.filter(p =>
    p.commonName.toLowerCase().includes(lowQuery) ||
    p.scientificName.toLowerCase().includes(lowQuery) ||
    p.family.toLowerCase().includes(lowQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowQuery))
  )
}

export function filterPlants(filters: {
  category?: PlantCategory
  sun?: SunRequirement
  water?: WaterNeed
  lifecycle?: 'annual' | 'biennial' | 'perennial'
}): PlantData[] {
  return PLANTS.filter(p => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.sun && p.requirements.sun !== filters.sun) return false
    if (filters.water && p.requirements.water !== filters.water) return false
    if (filters.lifecycle && p.lifecycle.type !== filters.lifecycle) return false
    return true
  })
}