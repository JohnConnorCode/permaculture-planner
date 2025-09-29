/**
 * Comprehensive Permaculture Elements Library
 * Based on professional permaculture consulting methodology
 */

export type ElementCategory =
  | 'water_management'
  | 'structures'
  | 'animals'
  | 'food_production'
  | 'energy'
  | 'waste_processing'
  | 'access'
  | 'soil_building'
  | 'climate_control'
  | 'habitat'

export type PermacultureZone = 0 | 1 | 2 | 3 | 4 | 5

export interface ElementRequirements {
  space: {
    width: number  // feet
    height: number // feet
    depth?: number // feet for 3D elements
  }
  sun: 'full' | 'partial' | 'shade' | 'any'
  water: number // gallons per day
  soil: {
    type?: 'clay' | 'sand' | 'loam' | 'any'
    pH?: { min: number, max: number }
    drainage: 'poor' | 'moderate' | 'good' | 'excellent' | 'any'
  }
  climate: {
    zones?: number[] // USDA zones
    minTemp?: number // Fahrenheit
    maxTemp?: number
  }
  maintenance: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'annual'
  zone: PermacultureZone[] // Recommended zones
}

export interface ElementOutputs {
  yield?: {
    type: string
    amount: number
    unit: string
    frequency: 'daily' | 'weekly' | 'seasonal' | 'annual'
  }
  services?: string[] // shade, windbreak, nitrogen-fixing, etc.
  byproducts?: string[] // mulch, compost, firewood, etc.
}

export interface ElementConnections {
  inputs: string[]  // What this element needs
  outputs: string[] // What this element produces
  guilds: string[]  // Compatible elements
  incompatible?: string[] // Elements to avoid
}

export interface PermacultureElement {
  id: string
  category: ElementCategory
  name: string
  description: string
  icon: string // Emoji or icon identifier

  requirements: ElementRequirements
  outputs?: ElementOutputs
  connections?: ElementConnections

  timeline: {
    establishment: number // months to establish
    productive?: number   // months to first yield
    lifespan: number     // years of productivity
  }

  cost: {
    initial: number // USD
    annual: number  // USD maintenance
  }

  shape?: 'rect' | 'circle' | 'polygon' | 'line' | 'custom'
  color?: {
    fill: string
    stroke: string
  }
}

// Water Management Elements
export const WATER_ELEMENTS: PermacultureElement[] = [
  {
    id: 'rainwater_tank',
    category: 'water_management',
    name: 'Rainwater Tank',
    description: 'Stores rainwater from roof catchment',
    icon: '💧',
    requirements: {
      space: { width: 8, height: 8 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'seasonal',
      zone: [0, 1]
    },
    outputs: {
      services: ['water_storage', 'irrigation_supply'],
      byproducts: ['overflow_water']
    },
    timeline: {
      establishment: 0.25,
      lifespan: 20
    },
    cost: {
      initial: 2000,
      annual: 50
    },
    shape: 'circle',
    color: { fill: '#e0f2fe', stroke: '#0284c7' }
  },
  {
    id: 'swale',
    category: 'water_management',
    name: 'Swale',
    description: 'Contour earthwork for water harvesting',
    icon: '〰️',
    requirements: {
      space: { width: 100, height: 6 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'moderate' },
      climate: {},
      maintenance: 'annual',
      zone: [2, 3, 4]
    },
    outputs: {
      services: ['water_infiltration', 'erosion_control', 'microclimate'],
      byproducts: ['mulch_catchment']
    },
    timeline: {
      establishment: 1,
      lifespan: 50
    },
    cost: {
      initial: 500,
      annual: 20
    },
    shape: 'line',
    color: { fill: '#dbeafe', stroke: '#3b82f6' }
  },
  {
    id: 'pond',
    category: 'water_management',
    name: 'Pond',
    description: 'Natural water storage and aquaculture',
    icon: '🏞️',
    requirements: {
      space: { width: 30, height: 30 },
      sun: 'partial',
      water: 100,
      soil: { type: 'clay', drainage: 'poor' },
      climate: {},
      maintenance: 'monthly',
      zone: [2, 3]
    },
    outputs: {
      yield: {
        type: 'fish',
        amount: 100,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['water_storage', 'microclimate', 'habitat', 'fire_protection'],
      byproducts: ['aquatic_plants', 'duck_habitat']
    },
    timeline: {
      establishment: 6,
      productive: 12,
      lifespan: 100
    },
    cost: {
      initial: 5000,
      annual: 200
    },
    shape: 'circle',
    color: { fill: '#1e40af', stroke: '#1e3a8a' }
  },
  {
    id: 'greywater_system',
    category: 'water_management',
    name: 'Greywater System',
    description: 'Recycles household water for irrigation',
    icon: '♻️',
    requirements: {
      space: { width: 20, height: 20 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'good' },
      climate: {},
      maintenance: 'monthly',
      zone: [1, 2]
    },
    outputs: {
      services: ['water_recycling', 'irrigation'],
      byproducts: ['nutrient_water']
    },
    timeline: {
      establishment: 1,
      lifespan: 15
    },
    cost: {
      initial: 3000,
      annual: 100
    },
    shape: 'rect',
    color: { fill: '#e5e7eb', stroke: '#6b7280' }
  }
]

// Structure Elements
export const STRUCTURE_ELEMENTS: PermacultureElement[] = [
  {
    id: 'greenhouse',
    category: 'structures',
    name: 'Greenhouse',
    description: 'Protected growing environment',
    icon: '🏠',
    requirements: {
      space: { width: 12, height: 20 },
      sun: 'full',
      water: 50,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'daily',
      zone: [1]
    },
    outputs: {
      yield: {
        type: 'vegetables',
        amount: 500,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['season_extension', 'microclimate', 'nursery'],
      byproducts: ['seedlings']
    },
    timeline: {
      establishment: 1,
      productive: 1,
      lifespan: 20
    },
    cost: {
      initial: 5000,
      annual: 300
    },
    shape: 'rect',
    color: { fill: '#f0fdf4', stroke: '#16a34a' }
  },
  {
    id: 'trellis',
    category: 'structures',
    name: 'Trellis',
    description: 'Vertical growing support',
    icon: '🪜',
    requirements: {
      space: { width: 8, height: 2 },
      sun: 'full',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'seasonal',
      zone: [1, 2]
    },
    outputs: {
      services: ['vertical_growing', 'shade', 'privacy'],
      byproducts: ['prunings']
    },
    timeline: {
      establishment: 0.25,
      lifespan: 10
    },
    cost: {
      initial: 200,
      annual: 20
    },
    shape: 'line',
    color: { fill: '#92400e', stroke: '#7c2d12' }
  },
  {
    id: 'arbor',
    category: 'structures',
    name: 'Arbor',
    description: 'Garden archway for climbing plants',
    icon: '🌸',
    requirements: {
      space: { width: 8, height: 4 },
      sun: 'partial',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1, 2]
    },
    outputs: {
      services: ['vertical_growing', 'shade', 'aesthetic', 'entrance'],
      byproducts: ['prunings']
    },
    timeline: {
      establishment: 0.25,
      lifespan: 15
    },
    cost: {
      initial: 500,
      annual: 30
    },
    shape: 'rect',
    color: { fill: '#fef3c7', stroke: '#d97706' }
  },
  {
    id: 'shed',
    category: 'structures',
    name: 'Tool Shed',
    description: 'Storage for garden tools and supplies',
    icon: '🏚️',
    requirements: {
      space: { width: 10, height: 12 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1]
    },
    outputs: {
      services: ['storage', 'workspace'],
      byproducts: []
    },
    timeline: {
      establishment: 0.5,
      lifespan: 30
    },
    cost: {
      initial: 3000,
      annual: 50
    },
    shape: 'rect',
    color: { fill: '#f3f4f6', stroke: '#4b5563' }
  },
  {
    id: 'pergola',
    category: 'structures',
    name: 'Pergola',
    description: 'Open structure for shade and vines',
    icon: '⛩️',
    requirements: {
      space: { width: 12, height: 12 },
      sun: 'partial',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1]
    },
    outputs: {
      services: ['shade', 'vertical_growing', 'outdoor_room'],
      byproducts: ['prunings']
    },
    timeline: {
      establishment: 0.5,
      lifespan: 25
    },
    cost: {
      initial: 2000,
      annual: 40
    },
    shape: 'rect',
    color: { fill: '#fef3c7', stroke: '#92400e' }
  }
]

// Food Production Elements
export const FOOD_PRODUCTION_ELEMENTS: PermacultureElement[] = [
  {
    id: 'raised_bed',
    category: 'food_production',
    name: 'Raised Garden Bed',
    description: 'Elevated growing area for vegetables',
    icon: '🥬',
    requirements: {
      space: { width: 4, height: 8 },
      sun: 'full',
      water: 20,
      soil: { type: 'loam', drainage: 'good' },
      climate: {},
      maintenance: 'daily',
      zone: [1]
    },
    outputs: {
      yield: {
        type: 'vegetables',
        amount: 100,
        unit: 'pounds',
        frequency: 'seasonal'
      },
      services: ['food_production'],
      byproducts: ['compost_material']
    },
    timeline: {
      establishment: 0.25,
      productive: 2,
      lifespan: 10
    },
    cost: {
      initial: 300,
      annual: 100
    },
    shape: 'rect',
    color: { fill: '#d4f4dd', stroke: '#22c55e' }
  },
  {
    id: 'orchard',
    category: 'food_production',
    name: 'Fruit Tree Orchard',
    description: 'Collection of fruit trees',
    icon: '🍎',
    requirements: {
      space: { width: 50, height: 50 },
      sun: 'full',
      water: 30,
      soil: { type: 'loam', drainage: 'good' },
      climate: {},
      maintenance: 'monthly',
      zone: [2, 3]
    },
    outputs: {
      yield: {
        type: 'fruit',
        amount: 500,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['food_production', 'shade', 'windbreak'],
      byproducts: ['prunings', 'mulch']
    },
    timeline: {
      establishment: 12,
      productive: 36,
      lifespan: 50
    },
    cost: {
      initial: 2000,
      annual: 200
    },
    shape: 'polygon',
    color: { fill: '#fee2e2', stroke: '#dc2626' }
  },
  {
    id: 'food_forest',
    category: 'food_production',
    name: 'Food Forest',
    description: 'Multi-layer perennial food system',
    icon: '🌳',
    requirements: {
      space: { width: 100, height: 100 },
      sun: 'partial',
      water: 40,
      soil: { type: 'any', drainage: 'moderate' },
      climate: {},
      maintenance: 'seasonal',
      zone: [2, 3, 4]
    },
    outputs: {
      yield: {
        type: 'mixed_produce',
        amount: 1000,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['food_production', 'habitat', 'carbon_sequestration', 'microclimate'],
      byproducts: ['mulch', 'timber', 'medicine']
    },
    timeline: {
      establishment: 24,
      productive: 36,
      lifespan: 100
    },
    cost: {
      initial: 5000,
      annual: 300
    },
    shape: 'polygon',
    color: { fill: '#ecfdf5', stroke: '#065f46' }
  },
  {
    id: 'berry_patch',
    category: 'food_production',
    name: 'Berry Patch',
    description: 'Perennial berry production',
    icon: '🫐',
    requirements: {
      space: { width: 20, height: 10 },
      sun: 'full',
      water: 15,
      soil: { pH: { min: 5.5, max: 7 }, drainage: 'good' },
      climate: {},
      maintenance: 'weekly',
      zone: [1, 2]
    },
    outputs: {
      yield: {
        type: 'berries',
        amount: 50,
        unit: 'pounds',
        frequency: 'seasonal'
      },
      services: ['food_production', 'pollinator_habitat'],
      byproducts: ['prunings']
    },
    timeline: {
      establishment: 6,
      productive: 12,
      lifespan: 15
    },
    cost: {
      initial: 500,
      annual: 50
    },
    shape: 'rect',
    color: { fill: '#ede9fe', stroke: '#7c3aed' }
  }
]

// Access Elements
export const ACCESS_ELEMENTS: PermacultureElement[] = [
  {
    id: 'path_gravel',
    category: 'access',
    name: 'Gravel Path',
    description: 'Permeable walkway',
    icon: '🚶',
    requirements: {
      space: { width: 3, height: 20 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'good' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1, 2, 3]
    },
    outputs: {
      services: ['access', 'water_infiltration'],
      byproducts: []
    },
    timeline: {
      establishment: 0.25,
      lifespan: 10
    },
    cost: {
      initial: 200,
      annual: 20
    },
    shape: 'line',
    color: { fill: '#d6d3d1', stroke: '#78716c' }
  },
  {
    id: 'fence_wood',
    category: 'access',
    name: 'Wooden Fence',
    description: 'Property boundary and animal control',
    icon: '🪵',
    requirements: {
      space: { width: 1, height: 100 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1, 2, 3, 4, 5]
    },
    outputs: {
      services: ['boundary', 'privacy', 'animal_control', 'vertical_growing'],
      byproducts: []
    },
    timeline: {
      establishment: 0.5,
      lifespan: 15
    },
    cost: {
      initial: 3000,
      annual: 100
    },
    shape: 'line',
    color: { fill: '#92400e', stroke: '#78350f' }
  },
  {
    id: 'gate',
    category: 'access',
    name: 'Garden Gate',
    description: 'Controlled access point',
    icon: '🚪',
    requirements: {
      space: { width: 4, height: 1 },
      sun: 'any',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0, 1, 2]
    },
    outputs: {
      services: ['access_control', 'aesthetic'],
      byproducts: []
    },
    timeline: {
      establishment: 0.1,
      lifespan: 20
    },
    cost: {
      initial: 500,
      annual: 20
    },
    shape: 'rect',
    color: { fill: '#a8a29e', stroke: '#57534e' }
  }
]

// Animal Systems
export const ANIMAL_ELEMENTS: PermacultureElement[] = [
  {
    id: 'chicken_coop',
    category: 'animals',
    name: 'Chicken Coop & Run',
    description: 'Housing for backyard chickens',
    icon: '🐔',
    requirements: {
      space: { width: 20, height: 10 },
      sun: 'partial',
      water: 5,
      soil: { drainage: 'good' },
      climate: {},
      maintenance: 'daily',
      zone: [2]
    },
    outputs: {
      yield: {
        type: 'eggs',
        amount: 300,
        unit: 'dozen',
        frequency: 'annual'
      },
      services: ['pest_control', 'soil_improvement'],
      byproducts: ['manure', 'feathers']
    },
    timeline: {
      establishment: 1,
      productive: 6,
      lifespan: 10
    },
    cost: {
      initial: 1500,
      annual: 500
    },
    shape: 'rect',
    color: { fill: '#fef3c7', stroke: '#d97706' }
  },
  {
    id: 'beehive',
    category: 'animals',
    name: 'Beehive',
    description: 'Honeybee habitat',
    icon: '🐝',
    requirements: {
      space: { width: 4, height: 4 },
      sun: 'full',
      water: 1,
      soil: { drainage: 'any' },
      climate: { minTemp: 50 },
      maintenance: 'monthly',
      zone: [2, 3]
    },
    outputs: {
      yield: {
        type: 'honey',
        amount: 60,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['pollination'],
      byproducts: ['wax', 'propolis']
    },
    timeline: {
      establishment: 3,
      productive: 12,
      lifespan: 20
    },
    cost: {
      initial: 500,
      annual: 100
    },
    shape: 'rect',
    color: { fill: '#fbbf24', stroke: '#f59e0b' }
  },
  {
    id: 'worm_farm',
    category: 'animals',
    name: 'Worm Farm',
    description: 'Vermicomposting system',
    icon: '🪱',
    requirements: {
      space: { width: 3, height: 3 },
      sun: 'shade',
      water: 2,
      soil: { drainage: 'any' },
      climate: { minTemp: 40, maxTemp: 85 },
      maintenance: 'weekly',
      zone: [1]
    },
    outputs: {
      yield: {
        type: 'worm_castings',
        amount: 100,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['waste_processing'],
      byproducts: ['worm_tea']
    },
    timeline: {
      establishment: 1,
      productive: 2,
      lifespan: 10
    },
    cost: {
      initial: 200,
      annual: 50
    },
    shape: 'rect',
    color: { fill: '#7c2d12', stroke: '#451a03' }
  }
]

// Energy Elements
export const ENERGY_ELEMENTS: PermacultureElement[] = [
  {
    id: 'solar_panel',
    category: 'energy',
    name: 'Solar Panel Array',
    description: 'Photovoltaic energy generation',
    icon: '☀️',
    requirements: {
      space: { width: 20, height: 15 },
      sun: 'full',
      water: 0,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'annual',
      zone: [0]
    },
    outputs: {
      yield: {
        type: 'electricity',
        amount: 5000,
        unit: 'kWh',
        frequency: 'annual'
      },
      services: ['renewable_energy'],
      byproducts: []
    },
    timeline: {
      establishment: 0.5,
      productive: 0.5,
      lifespan: 25
    },
    cost: {
      initial: 15000,
      annual: 200
    },
    shape: 'rect',
    color: { fill: '#1e3a8a', stroke: '#1e293b' }
  },
  {
    id: 'windbreak',
    category: 'energy',
    name: 'Windbreak',
    description: 'Trees or shrubs for wind protection',
    icon: '🌬️',
    requirements: {
      space: { width: 100, height: 10 },
      sun: 'full',
      water: 20,
      soil: { drainage: 'moderate' },
      climate: {},
      maintenance: 'annual',
      zone: [3, 4]
    },
    outputs: {
      services: ['wind_protection', 'microclimate', 'privacy'],
      byproducts: ['mulch', 'timber']
    },
    timeline: {
      establishment: 24,
      lifespan: 50
    },
    cost: {
      initial: 1000,
      annual: 50
    },
    shape: 'line',
    color: { fill: '#14532d', stroke: '#052e16' }
  }
]

// Waste Processing Elements
export const WASTE_ELEMENTS: PermacultureElement[] = [
  {
    id: 'compost_bin',
    category: 'waste_processing',
    name: 'Compost System',
    description: 'Organic waste decomposition',
    icon: '♻️',
    requirements: {
      space: { width: 6, height: 6 },
      sun: 'partial',
      water: 5,
      soil: { drainage: 'any' },
      climate: {},
      maintenance: 'weekly',
      zone: [1, 2]
    },
    outputs: {
      yield: {
        type: 'compost',
        amount: 500,
        unit: 'pounds',
        frequency: 'annual'
      },
      services: ['waste_processing', 'soil_improvement'],
      byproducts: []
    },
    timeline: {
      establishment: 0.25,
      productive: 3,
      lifespan: 20
    },
    cost: {
      initial: 200,
      annual: 20
    },
    shape: 'rect',
    color: { fill: '#65a30d', stroke: '#365314' }
  },
  {
    id: 'biogas_digester',
    category: 'waste_processing',
    name: 'Biogas Digester',
    description: 'Methane generation from organic waste',
    icon: '⚡',
    requirements: {
      space: { width: 10, height: 10 },
      sun: 'any',
      water: 10,
      soil: { drainage: 'any' },
      climate: { minTemp: 60 },
      maintenance: 'weekly',
      zone: [1]
    },
    outputs: {
      yield: {
        type: 'biogas',
        amount: 1000,
        unit: 'cubic_feet',
        frequency: 'annual'
      },
      services: ['waste_processing', 'energy_generation'],
      byproducts: ['liquid_fertilizer']
    },
    timeline: {
      establishment: 1,
      productive: 1,
      lifespan: 15
    },
    cost: {
      initial: 3000,
      annual: 100
    },
    shape: 'circle',
    color: { fill: '#fde047', stroke: '#a16207' }
  }
]

// Compile all elements
export const ALL_PERMACULTURE_ELEMENTS: PermacultureElement[] = [
  ...WATER_ELEMENTS,
  ...STRUCTURE_ELEMENTS,
  ...FOOD_PRODUCTION_ELEMENTS,
  ...ACCESS_ELEMENTS,
  ...ANIMAL_ELEMENTS,
  ...ENERGY_ELEMENTS,
  ...WASTE_ELEMENTS
]

// Helper functions
export function getElementsByCategory(category: ElementCategory): PermacultureElement[] {
  return ALL_PERMACULTURE_ELEMENTS.filter(el => el.category === category)
}

export function getElementsByZone(zone: PermacultureZone): PermacultureElement[] {
  return ALL_PERMACULTURE_ELEMENTS.filter(el => el.requirements.zone.includes(zone))
}

export function getCompatibleElements(elementId: string): PermacultureElement[] {
  const element = ALL_PERMACULTURE_ELEMENTS.find(el => el.id === elementId)
  if (!element || !element.connections?.guilds) return []

  return ALL_PERMACULTURE_ELEMENTS.filter(el =>
    element.connections!.guilds.includes(el.id)
  )
}

export function calculateWaterRequirement(elements: PermacultureElement[]): number {
  return elements.reduce((total, el) => total + el.requirements.water, 0)
}

export function calculateMaintenanceHours(elements: PermacultureElement[]): number {
  const hoursMap = {
    'daily': 365,
    'weekly': 52,
    'monthly': 12,
    'seasonal': 4,
    'annual': 1
  }

  return elements.reduce((total, el) => {
    return total + (hoursMap[el.requirements.maintenance] || 0)
  }, 0)
}