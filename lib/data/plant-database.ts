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

  // === MORE VEGETABLES ===
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
  },

  {
    id: 'pepper',
    commonName: 'Bell Pepper',
    scientificName: 'Capsicum annuum',
    category: 'vegetables',
    family: 'Nightshade',
    visual: {
      icon: '🫑',
      color: '#4CAF50',
      matureSize: { widthIn: 18, heightIn: 24, spreadIn: 18 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.2, max: 7.0 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 4, maxZone: 11 },
      spacing: { betweenPlants: 18, betweenRows: 24 }
    },
    companionship: {
      beneficial: ['basil', 'tomato', 'spinach', 'onion'],
      antagonistic: ['fennel', 'beans'],
      notes: 'Benefits from basil companion planting'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 60, max: 90 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 6, day: 30 },
      harvestStart: { month: 7, day: 15 },
      harvestEnd: { month: 10, day: 1 }
    },
    yield: {
      amount: { min: 5, max: 10 },
      unit: 'peppers',
      perPlant: true
    },
    benefits: [],
    tags: ['warm-season', 'colorful']
  },

  {
    id: 'cucumber',
    commonName: 'Cucumber',
    scientificName: 'Cucumis sativus',
    category: 'vegetables',
    family: 'Gourd',
    visual: {
      icon: '🥒',
      color: '#8BC34A',
      matureSize: { widthIn: 12, heightIn: 72, spreadIn: 36 },
      shape: 'vining'
    },
    requirements: {
      sun: 'full',
      water: 'high',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 4, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 48 }
    },
    companionship: {
      beneficial: ['beans', 'corn', 'peas', 'radishes', 'sunflowers'],
      antagonistic: ['aromatic herbs', 'potatoes'],
      notes: 'Can climb corn stalks or sunflowers'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 3, max: 10 },
      daysToMaturity: { min: 50, max: 70 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 7, day: 1 },
      harvestStart: { month: 7, day: 1 },
      harvestEnd: { month: 9, day: 15 }
    },
    yield: {
      amount: { min: 10, max: 20 },
      unit: 'cucumbers',
      perPlant: true
    },
    benefits: [],
    tags: ['vining', 'fast-growing', 'pickling']
  },

  {
    id: 'radish',
    commonName: 'Radish',
    scientificName: 'Raphanus sativus',
    category: 'vegetables',
    family: 'Brassica',
    visual: {
      icon: '🌶️',
      color: '#FF1744',
      matureSize: { widthIn: 2, heightIn: 6, spreadIn: 2 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 2, betweenRows: 6 }
    },
    companionship: {
      beneficial: ['carrot', 'lettuce', 'spinach', 'peas'],
      antagonistic: ['hyssop'],
      notes: 'Breaks up soil, marks rows for slower crops'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 3, max: 10 },
      daysToMaturity: { min: 22, max: 30 },
      harvestWindow: 7
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 9, day: 15 },
      harvestStart: { month: 4, day: 15 },
      harvestEnd: { month: 10, day: 15 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'bunches',
      perPlant: false
    },
    benefits: [],
    tags: ['fast-growing', 'cool-season', 'succession-planting']
  },

  {
    id: 'spinach',
    commonName: 'Spinach',
    scientificName: 'Spinacia oleracea',
    category: 'vegetables',
    family: 'Amaranth',
    visual: {
      icon: '🥬',
      color: '#2E7D32',
      matureSize: { widthIn: 6, heightIn: 8, spreadIn: 6 },
      shape: 'round'
    },
    requirements: {
      sun: 'partial',
      water: 'medium',
      soil: {
        pH: { min: 6.5, max: 7.0 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 9 },
      spacing: { betweenPlants: 4, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['strawberry', 'beans', 'peas', 'radish'],
      antagonistic: [],
      notes: 'Good understory crop'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 40, max: 50 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 9, day: 1 },
      harvestStart: { month: 4, day: 15 },
      harvestEnd: { month: 10, day: 15 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'lbs',
      perPlant: false
    },
    benefits: [],
    tags: ['cool-season', 'nutrient-dense', 'shade-tolerant']
  },

  {
    id: 'kale',
    commonName: 'Kale',
    scientificName: 'Brassica oleracea var. sabellica',
    category: 'vegetables',
    family: 'Brassica',
    visual: {
      icon: '🥬',
      color: '#388E3C',
      matureSize: { widthIn: 18, heightIn: 24, spreadIn: 18 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 9 },
      spacing: { betweenPlants: 18, betweenRows: 24 }
    },
    companionship: {
      beneficial: ['beet', 'celery', 'onion', 'potato'],
      antagonistic: ['tomato', 'strawberry'],
      notes: 'Frost improves flavor'
    },
    lifecycle: {
      type: 'biennial',
      plantingMethod: 'both',
      daysToGermination: { min: 5, max: 7 },
      daysToMaturity: { min: 55, max: 75 },
      harvestWindow: 120
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 8, day: 15 },
      harvestStart: { month: 5, day: 1 },
      harvestEnd: { month: 12, day: 1 }
    },
    yield: {
      amount: { min: 2, max: 3 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['cold-hardy', 'nutrient-dense', 'continuous-harvest']
  },

  {
    id: 'zucchini',
    commonName: 'Zucchini',
    scientificName: 'Cucurbita pepo',
    category: 'vegetables',
    family: 'Gourd',
    visual: {
      icon: '🥒',
      color: '#4CAF50',
      matureSize: { widthIn: 36, heightIn: 24, spreadIn: 48 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'full',
      water: 'high',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 11 },
      spacing: { betweenPlants: 36, betweenRows: 48 }
    },
    companionship: {
      beneficial: ['nasturtium', 'radish', 'corn'],
      antagonistic: ['potato'],
      notes: 'Nasturtiums trap aphids'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 45, max: 55 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 7, day: 1 },
      harvestStart: { month: 7, day: 1 },
      harvestEnd: { month: 9, day: 30 }
    },
    yield: {
      amount: { min: 6, max: 10 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['prolific', 'summer-squash', 'space-hungry']
  },

  // === FRUITS ===
  {
    id: 'strawberry',
    commonName: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    category: 'fruits',
    family: 'Rose',
    visual: {
      icon: '🍓',
      color: '#E91E63',
      matureSize: { widthIn: 12, heightIn: 8, spreadIn: 18 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 5.5, max: 6.8 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 10 },
      spacing: { betweenPlants: 18, betweenRows: 36 }
    },
    companionship: {
      beneficial: ['borage', 'lettuce', 'spinach', 'beans'],
      antagonistic: ['brassicas'],
      notes: 'Borage enhances growth and flavor'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 7, max: 42 },
      daysToMaturity: { min: 60, max: 90 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 4, day: 30 },
      harvestStart: { month: 5, day: 15 },
      harvestEnd: { month: 6, day: 30 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['perennial', 'ground-cover', 'sweet']
  },

  {
    id: 'blueberry',
    commonName: 'Blueberry',
    scientificName: 'Vaccinium cyanococcus',
    category: 'fruits',
    family: 'Heath',
    visual: {
      icon: '🫐',
      color: '#3F51B5',
      matureSize: { widthIn: 48, heightIn: 72, spreadIn: 48 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 4.5, max: 5.5 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 9 },
      spacing: { betweenPlants: 60, betweenRows: 96 }
    },
    companionship: {
      beneficial: ['strawberry', 'thyme'],
      antagonistic: [],
      notes: 'Requires acidic soil'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 30, max: 90 },
      daysToMaturity: { min: 730, max: 1095 },
      harvestWindow: 45
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 6, day: 15 },
      harvestEnd: { month: 8, day: 15 }
    },
    yield: {
      amount: { min: 5, max: 15 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['perennial', 'acid-loving', 'antioxidants']
  },

  {
    id: 'raspberry',
    commonName: 'Raspberry',
    scientificName: 'Rubus idaeus',
    category: 'fruits',
    family: 'Rose',
    visual: {
      icon: '🫐',
      color: '#C2185B',
      matureSize: { widthIn: 36, heightIn: 60, spreadIn: 36 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 5.6, max: 6.2 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 9 },
      spacing: { betweenPlants: 36, betweenRows: 72 }
    },
    companionship: {
      beneficial: ['garlic', 'tansy'],
      antagonistic: ['potato', 'tomato'],
      notes: 'Garlic deters pests'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 14, max: 30 },
      daysToMaturity: { min: 365, max: 450 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 5, day: 1 },
      harvestStart: { month: 6, day: 15 },
      harvestEnd: { month: 8, day: 1 }
    },
    yield: {
      amount: { min: 2, max: 5 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['perennial', 'bramble', 'thorny']
  },

  // === MORE HERBS ===
  {
    id: 'rosemary',
    commonName: 'Rosemary',
    scientificName: 'Rosmarinus officinalis',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#9CCC65',
      matureSize: { widthIn: 36, heightIn: 48, spreadIn: 36 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 8, maxZone: 10 },
      spacing: { betweenPlants: 36, betweenRows: 36 }
    },
    companionship: {
      beneficial: ['beans', 'cabbage', 'carrot'],
      antagonistic: [],
      notes: 'Deters cabbage moth and carrot fly'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 14, max: 21 },
      daysToMaturity: { min: 90, max: 180 },
      harvestWindow: 365
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 1, day: 1 },
      harvestEnd: { month: 12, day: 31 }
    },
    benefits: ['pest-deterrent'],
    tags: ['perennial', 'aromatic', 'drought-tolerant']
  },

  {
    id: 'thyme',
    commonName: 'Thyme',
    scientificName: 'Thymus vulgaris',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#8BC34A',
      matureSize: { widthIn: 12, heightIn: 8, spreadIn: 16 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 8.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 5, maxZone: 9 },
      spacing: { betweenPlants: 12, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['cabbage', 'tomato', 'eggplant'],
      antagonistic: [],
      notes: 'Repels cabbage worm'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'both',
      daysToGermination: { min: 14, max: 28 },
      daysToMaturity: { min: 75, max: 90 },
      harvestWindow: 180
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 5, day: 15 },
      harvestEnd: { month: 10, day: 31 }
    },
    benefits: ['pest-deterrent'],
    tags: ['perennial', 'ground-cover', 'drought-tolerant']
  },

  {
    id: 'oregano',
    commonName: 'Oregano',
    scientificName: 'Origanum vulgare',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#689F38',
      matureSize: { widthIn: 24, heightIn: 24, spreadIn: 18 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 8.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 5, maxZone: 10 },
      spacing: { betweenPlants: 18, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['pepper', 'tomato'],
      antagonistic: [],
      notes: 'Good general companion'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'both',
      daysToGermination: { min: 10, max: 15 },
      daysToMaturity: { min: 80, max: 90 },
      harvestWindow: 150
    },
    seasons: {
      plantingStart: { month: 4, day: 15 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 6, day: 1 },
      harvestEnd: { month: 10, day: 15 }
    },
    benefits: [],
    tags: ['perennial', 'aromatic', 'mediterranean']
  },

  {
    id: 'sage',
    commonName: 'Sage',
    scientificName: 'Salvia officinalis',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#9E9E9E',
      matureSize: { widthIn: 24, heightIn: 30, spreadIn: 24 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 5, maxZone: 9 },
      spacing: { betweenPlants: 24, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['rosemary', 'carrot', 'cabbage'],
      antagonistic: ['cucumber'],
      notes: 'Repels cabbage moth and carrot fly'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'both',
      daysToGermination: { min: 10, max: 21 },
      daysToMaturity: { min: 75, max: 90 },
      harvestWindow: 150
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 6, day: 1 },
      harvestEnd: { month: 10, day: 1 }
    },
    benefits: ['pest-deterrent'],
    tags: ['perennial', 'culinary', 'medicinal']
  },

  {
    id: 'mint',
    commonName: 'Mint',
    scientificName: 'Mentha spp.',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '🌿',
      color: '#66BB6A',
      matureSize: { widthIn: 24, heightIn: 24, spreadIn: 36 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'partial',
      water: 'high',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['loamy'],
        drainage: 'moist'
      },
      hardiness: { minZone: 3, maxZone: 11 },
      spacing: { betweenPlants: 24, betweenRows: 24 }
    },
    companionship: {
      beneficial: ['cabbage', 'tomato'],
      antagonistic: [],
      notes: 'Invasive - best grown in containers'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 12, max: 16 },
      daysToMaturity: { min: 90, max: 90 },
      harvestWindow: 120
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 6, day: 1 },
      harvestEnd: { month: 9, day: 30 }
    },
    benefits: ['pest-deterrent'],
    tags: ['perennial', 'invasive', 'aromatic']
  },

  {
    id: 'cilantro',
    commonName: 'Cilantro',
    scientificName: 'Coriandrum sativum',
    category: 'herbs',
    family: 'Carrot',
    visual: {
      icon: '🌿',
      color: '#7CB342',
      matureSize: { widthIn: 6, heightIn: 24, spreadIn: 6 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.2, max: 6.8 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 6, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['tomato', 'spinach'],
      antagonistic: ['fennel'],
      notes: 'Attracts beneficial insects'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 10 },
      daysToMaturity: { min: 45, max: 60 },
      harvestWindow: 21
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 9, day: 1 },
      harvestStart: { month: 5, day: 1 },
      harvestEnd: { month: 10, day: 15 }
    },
    benefits: ['pollinator'],
    tags: ['cool-season', 'fast-growing', 'succession-planting']
  },

  {
    id: 'parsley',
    commonName: 'Parsley',
    scientificName: 'Petroselinum crispum',
    category: 'herbs',
    family: 'Carrot',
    visual: {
      icon: '🌿',
      color: '#558B2F',
      matureSize: { widthIn: 12, heightIn: 12, spreadIn: 9 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'partial',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.0 },
        type: ['loamy'],
        drainage: 'moist'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 9, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['tomato', 'asparagus', 'rose'],
      antagonistic: [],
      notes: 'Attracts beneficial insects'
    },
    lifecycle: {
      type: 'biennial',
      plantingMethod: 'both',
      daysToGermination: { min: 14, max: 28 },
      daysToMaturity: { min: 70, max: 90 },
      harvestWindow: 90
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 5, day: 31 },
      harvestStart: { month: 5, day: 30 },
      harvestEnd: { month: 10, day: 31 }
    },
    benefits: ['pollinator'],
    tags: ['biennial', 'nutrient-dense', 'slow-germinating']
  },

  {
    id: 'dill',
    commonName: 'Dill',
    scientificName: 'Anethum graveolens',
    category: 'herbs',
    family: 'Carrot',
    visual: {
      icon: '🌿',
      color: '#9CCC65',
      matureSize: { widthIn: 12, heightIn: 36, spreadIn: 12 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 5.5, max: 6.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['cabbage', 'cucumber', 'lettuce'],
      antagonistic: ['carrot'],
      notes: 'Attracts beneficial wasps'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 10, max: 14 },
      daysToMaturity: { min: 40, max: 60 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 4, day: 15 },
      plantingEnd: { month: 7, day: 15 },
      harvestStart: { month: 6, day: 1 },
      harvestEnd: { month: 9, day: 1 }
    },
    benefits: ['pollinator'],
    tags: ['self-seeding', 'pickling', 'butterfly-host']
  },

  // === COMPANION PLANTS ===
  {
    id: 'nasturtium',
    commonName: 'Nasturtium',
    scientificName: 'Tropaeolum majus',
    category: 'flowers',
    family: 'Nasturtium',
    visual: {
      icon: '🌺',
      color: '#FF9800',
      matureSize: { widthIn: 12, heightIn: 12, spreadIn: 18 },
      shape: 'spreading'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.0, max: 8.0 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['cucumber', 'tomato', 'cabbage'],
      antagonistic: [],
      notes: 'Trap crop for aphids'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 35, max: 50 },
      harvestWindow: 90
    },
    seasons: {
      plantingStart: { month: 5, day: 1 },
      plantingEnd: { month: 6, day: 30 },
      bloomStart: { month: 6, day: 15 },
      bloomEnd: { month: 10, day: 1 }
    },
    benefits: ['pest-deterrent', 'edible-flowers'],
    tags: ['edible', 'trap-crop', 'climbing']
  },

  {
    id: 'sunflower',
    commonName: 'Sunflower',
    scientificName: 'Helianthus annuus',
    category: 'flowers',
    family: 'Daisy',
    visual: {
      icon: '🌻',
      color: '#FFEB3B',
      matureSize: { widthIn: 24, heightIn: 96, spreadIn: 18 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 18, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['corn', 'cucumber', 'melon'],
      antagonistic: ['potato'],
      notes: 'Provides support for climbing plants'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 80, max: 120 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 5, day: 1 },
      plantingEnd: { month: 6, day: 30 },
      bloomStart: { month: 7, day: 15 },
      bloomEnd: { month: 9, day: 30 }
    },
    benefits: ['pollinator', 'bird-food'],
    tags: ['tall', 'seeds', 'wildlife']
  },

  // === MORE VEGETABLES ===
  {
    id: 'onion',
    commonName: 'Onion',
    scientificName: 'Allium cepa',
    category: 'vegetables',
    family: 'Onion',
    visual: {
      icon: '🧅',
      color: '#9C27B0',
      matureSize: { widthIn: 4, heightIn: 18, spreadIn: 4 },
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
      hardiness: { minZone: 3, maxZone: 10 },
      spacing: { betweenPlants: 4, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['carrot', 'lettuce', 'beet', 'chamomile'],
      antagonistic: ['beans', 'peas'],
      notes: 'Deters many pests'
    },
    lifecycle: {
      type: 'biennial',
      plantingMethod: 'both',
      daysToGermination: { min: 7, max: 12 },
      daysToMaturity: { min: 90, max: 120 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 4, day: 30 },
      harvestStart: { month: 7, day: 15 },
      harvestEnd: { month: 9, day: 1 }
    },
    yield: {
      amount: { min: 1, max: 1 },
      unit: 'bulb',
      perPlant: true
    },
    benefits: ['pest-deterrent'],
    tags: ['storage-crop', 'long-season']
  },

  {
    id: 'garlic',
    commonName: 'Garlic',
    scientificName: 'Allium sativum',
    category: 'vegetables',
    family: 'Onion',
    visual: {
      icon: '🧄',
      color: '#E0E0E0',
      matureSize: { widthIn: 4, heightIn: 24, spreadIn: 4 },
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
      hardiness: { minZone: 3, maxZone: 9 },
      spacing: { betweenPlants: 6, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['rose', 'fruit trees', 'tomato'],
      antagonistic: ['beans', 'peas'],
      notes: 'Strong pest deterrent'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 240, max: 270 },
      harvestWindow: 14
    },
    seasons: {
      plantingStart: { month: 10, day: 15 },
      plantingEnd: { month: 11, day: 30 },
      harvestStart: { month: 6, day: 15 },
      harvestEnd: { month: 7, day: 31 }
    },
    yield: {
      amount: { min: 1, max: 1 },
      unit: 'head',
      perPlant: true
    },
    benefits: ['pest-deterrent'],
    tags: ['fall-planted', 'storage-crop', 'medicinal']
  },

  {
    id: 'potato',
    commonName: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'vegetables',
    family: 'Nightshade',
    visual: {
      icon: '🥔',
      color: '#795548',
      matureSize: { widthIn: 12, heightIn: 24, spreadIn: 12 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 5.0, max: 6.0 },
        type: ['loamy', 'sandy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 3, maxZone: 10 },
      spacing: { betweenPlants: 12, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['beans', 'corn', 'horseradish'],
      antagonistic: ['tomato', 'cucumber', 'squash'],
      notes: 'Horseradish protects from Colorado beetles'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 14, max: 21 },
      daysToMaturity: { min: 70, max: 120 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 5, day: 15 },
      harvestStart: { month: 7, day: 1 },
      harvestEnd: { month: 9, day: 30 }
    },
    yield: {
      amount: { min: 5, max: 10 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['calorie-crop', 'storage-crop', 'staple']
  },

  {
    id: 'beet',
    commonName: 'Beet',
    scientificName: 'Beta vulgaris',
    category: 'vegetables',
    family: 'Amaranth',
    visual: {
      icon: '🟣',
      color: '#880E4F',
      matureSize: { widthIn: 4, heightIn: 12, spreadIn: 4 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 4, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['lettuce', 'onion', 'cabbage'],
      antagonistic: ['pole beans'],
      notes: 'Good for succession planting'
    },
    lifecycle: {
      type: 'biennial',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 50, max: 70 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 4, day: 1 },
      plantingEnd: { month: 8, day: 1 },
      harvestStart: { month: 6, day: 1 },
      harvestEnd: { month: 10, day: 15 }
    },
    yield: {
      amount: { min: 2, max: 4 },
      unit: 'lbs',
      perPlant: false
    },
    benefits: [],
    tags: ['root-vegetable', 'dual-harvest', 'cool-season']
  },

  {
    id: 'squash_winter',
    commonName: 'Winter Squash',
    scientificName: 'Cucurbita maxima',
    category: 'vegetables',
    family: 'Gourd',
    visual: {
      icon: '🎃',
      color: '#FF9800',
      matureSize: { widthIn: 60, heightIn: 24, spreadIn: 96 },
      shape: 'spreading'
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
      spacing: { betweenPlants: 48, betweenRows: 72 }
    },
    companionship: {
      beneficial: ['corn', 'beans', 'nasturtium'],
      antagonistic: ['potato'],
      notes: 'Part of Three Sisters planting'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'both',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 85, max: 120 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 6, day: 15 },
      harvestStart: { month: 9, day: 1 },
      harvestEnd: { month: 10, day: 31 }
    },
    yield: {
      amount: { min: 2, max: 5 },
      unit: 'squash',
      perPlant: true
    },
    benefits: [],
    tags: ['storage-crop', 'space-hungry', 'three-sisters']
  },

  {
    id: 'peas',
    commonName: 'Peas',
    scientificName: 'Pisum sativum',
    category: 'vegetables',
    family: 'Legume',
    visual: {
      icon: '🟢',
      color: '#43A047',
      matureSize: { widthIn: 4, heightIn: 48, spreadIn: 4 },
      shape: 'vining'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 7.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 2, betweenRows: 18 }
    },
    companionship: {
      beneficial: ['carrot', 'radish', 'cucumber'],
      antagonistic: ['onion', 'garlic'],
      notes: 'Fixes nitrogen in soil'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 60, max: 70 },
      harvestWindow: 21
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 4, day: 15 },
      harvestStart: { month: 5, day: 15 },
      harvestEnd: { month: 6, day: 30 }
    },
    yield: {
      amount: { min: 0.25, max: 0.5 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: ['nitrogen-fixer'],
    tags: ['cool-season', 'climbing', 'sweet']
  },

  {
    id: 'corn',
    commonName: 'Corn',
    scientificName: 'Zea mays',
    category: 'vegetables',
    family: 'Grass',
    visual: {
      icon: '🌽',
      color: '#FFD54F',
      matureSize: { widthIn: 12, heightIn: 96, spreadIn: 12 },
      shape: 'upright'
    },
    requirements: {
      sun: 'full',
      water: 'high',
      soil: {
        pH: { min: 6.0, max: 6.8 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 4, maxZone: 11 },
      spacing: { betweenPlants: 12, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['beans', 'squash', 'peas', 'cucumber'],
      antagonistic: ['tomato'],
      notes: 'Central to Three Sisters planting'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'direct-seed',
      daysToGermination: { min: 7, max: 10 },
      daysToMaturity: { min: 75, max: 100 },
      harvestWindow: 14
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 6, day: 30 },
      harvestStart: { month: 7, day: 30 },
      harvestEnd: { month: 9, day: 15 }
    },
    yield: {
      amount: { min: 2, max: 3 },
      unit: 'ears',
      perPlant: true
    },
    benefits: [],
    tags: ['tall', 'wind-pollinated', 'three-sisters']
  },

  {
    id: 'broccoli',
    commonName: 'Broccoli',
    scientificName: 'Brassica oleracea var. italica',
    category: 'vegetables',
    family: 'Brassica',
    visual: {
      icon: '🥦',
      color: '#1B5E20',
      matureSize: { widthIn: 24, heightIn: 30, spreadIn: 18 },
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
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 18, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['beet', 'onion', 'potato', 'dill'],
      antagonistic: ['tomato', 'strawberry'],
      notes: 'Dill improves growth'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 5, max: 10 },
      daysToMaturity: { min: 65, max: 85 },
      harvestWindow: 14
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 8, day: 1 },
      harvestStart: { month: 5, day: 15 },
      harvestEnd: { month: 11, day: 1 }
    },
    yield: {
      amount: { min: 1, max: 2 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['cool-season', 'nutrient-dense', 'side-shoots']
  },

  {
    id: 'cabbage',
    commonName: 'Cabbage',
    scientificName: 'Brassica oleracea var. capitata',
    category: 'vegetables',
    family: 'Brassica',
    visual: {
      icon: '🥬',
      color: '#C5E1A5',
      matureSize: { widthIn: 18, heightIn: 12, spreadIn: 24 },
      shape: 'round'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 6.0, max: 6.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 2, maxZone: 11 },
      spacing: { betweenPlants: 18, betweenRows: 30 }
    },
    companionship: {
      beneficial: ['dill', 'onion', 'potato', 'chamomile'],
      antagonistic: ['strawberry', 'tomato'],
      notes: 'Dill and chamomile improve flavor'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 4, max: 10 },
      daysToMaturity: { min: 70, max: 120 },
      harvestWindow: 30
    },
    seasons: {
      plantingStart: { month: 3, day: 1 },
      plantingEnd: { month: 7, day: 31 },
      harvestStart: { month: 5, day: 15 },
      harvestEnd: { month: 11, day: 30 }
    },
    yield: {
      amount: { min: 2, max: 5 },
      unit: 'lbs',
      perPlant: true
    },
    benefits: [],
    tags: ['cool-season', 'storage-crop', 'heavy-feeder']
  },

  {
    id: 'eggplant',
    commonName: 'Eggplant',
    scientificName: 'Solanum melongena',
    category: 'vegetables',
    family: 'Nightshade',
    visual: {
      icon: '🍆',
      color: '#6A1B9A',
      matureSize: { widthIn: 24, heightIn: 36, spreadIn: 24 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'medium',
      soil: {
        pH: { min: 5.5, max: 6.5 },
        type: ['loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 4, maxZone: 11 },
      spacing: { betweenPlants: 24, betweenRows: 36 }
    },
    companionship: {
      beneficial: ['pepper', 'tomato', 'beans'],
      antagonistic: [],
      notes: 'Benefits from hot pepper companions'
    },
    lifecycle: {
      type: 'annual',
      plantingMethod: 'transplant',
      daysToGermination: { min: 7, max: 14 },
      daysToMaturity: { min: 80, max: 100 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 5, day: 15 },
      plantingEnd: { month: 6, day: 15 },
      harvestStart: { month: 7, day: 30 },
      harvestEnd: { month: 10, day: 1 }
    },
    yield: {
      amount: { min: 5, max: 10 },
      unit: 'eggplants',
      perPlant: true
    },
    benefits: [],
    tags: ['warm-season', 'ornamental', 'heavy-feeder']
  },

  // === MORE HERBS ===
  {
    id: 'lavender',
    commonName: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    category: 'herbs',
    family: 'Mint',
    visual: {
      icon: '💜',
      color: '#9C27B0',
      matureSize: { widthIn: 36, heightIn: 36, spreadIn: 36 },
      shape: 'bushy'
    },
    requirements: {
      sun: 'full',
      water: 'low',
      soil: {
        pH: { min: 6.5, max: 7.5 },
        type: ['sandy', 'loamy'],
        drainage: 'well-drained'
      },
      hardiness: { minZone: 5, maxZone: 9 },
      spacing: { betweenPlants: 36, betweenRows: 36 }
    },
    companionship: {
      beneficial: ['rose', 'cabbage'],
      antagonistic: [],
      notes: 'Repels moths and fleas'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'transplant',
      daysToGermination: { min: 14, max: 28 },
      daysToMaturity: { min: 90, max: 180 },
      harvestWindow: 60
    },
    seasons: {
      plantingStart: { month: 4, day: 15 },
      plantingEnd: { month: 5, day: 31 },
      bloomStart: { month: 6, day: 15 },
      bloomEnd: { month: 8, day: 31 }
    },
    benefits: ['pest-deterrent', 'pollinator'],
    tags: ['perennial', 'fragrant', 'drought-tolerant']
  },

  {
    id: 'chives',
    commonName: 'Chives',
    scientificName: 'Allium schoenoprasum',
    category: 'herbs',
    family: 'Onion',
    visual: {
      icon: '🌿',
      color: '#4CAF50',
      matureSize: { widthIn: 12, heightIn: 12, spreadIn: 12 },
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
      hardiness: { minZone: 3, maxZone: 9 },
      spacing: { betweenPlants: 12, betweenRows: 12 }
    },
    companionship: {
      beneficial: ['carrot', 'tomato', 'apple tree'],
      antagonistic: ['beans', 'peas'],
      notes: 'Improves flavor and growth of companions'
    },
    lifecycle: {
      type: 'perennial',
      plantingMethod: 'both',
      daysToGermination: { min: 14, max: 21 },
      daysToMaturity: { min: 90, max: 90 },
      harvestWindow: 180
    },
    seasons: {
      plantingStart: { month: 3, day: 15 },
      plantingEnd: { month: 9, day: 1 },
      harvestStart: { month: 5, day: 1 },
      harvestEnd: { month: 10, day: 31 }
    },
    benefits: ['pest-deterrent'],
    tags: ['perennial', 'edible-flowers', 'mild-onion']
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