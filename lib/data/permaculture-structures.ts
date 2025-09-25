// Comprehensive Permaculture Structures and Elements

export type StructureCategory =
  | 'water'
  | 'soil'
  | 'energy'
  | 'shelter'
  | 'social'
  | 'animal'
  | 'storage'
  | 'processing'
  | 'boundary'

export type MaterialType =
  | 'wood'
  | 'metal'
  | 'stone'
  | 'plastic'
  | 'concrete'
  | 'natural'
  | 'recycled'

export interface PermacultureStructure {
  id: string
  name: string
  category: StructureCategory
  description: string
  icon: string

  dimensions: {
    defaultWidth: number // inches
    defaultHeight: number // inches
    defaultDepth?: number // inches
    customizable: boolean
  }

  placement: {
    zones: number[] // Permaculture zones 0-5
    orientation?: 'north' | 'south' | 'east' | 'west' | 'any'
    slopeRequirement?: 'flat' | 'slight' | 'moderate' | 'steep'
    sunRequirement?: 'full' | 'partial' | 'shade' | 'none'
  }

  functions: string[]
  materials: MaterialType[]

  capacity?: {
    amount: number
    unit: string
  }

  maintenance: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'annual'
    tasks: string[]
  }

  cost: {
    estimate: 'low' | 'medium' | 'high'
    diy: boolean
  }

  benefits: string[]
  considerations: string[]

  integrations?: string[] // IDs of other structures it works well with
}

export const PERMACULTURE_STRUCTURES: PermacultureStructure[] = [
  // WATER MANAGEMENT
  {
    id: 'rain-barrel',
    name: 'Rain Barrel',
    category: 'water',
    description: 'Collects and stores rainwater from roof runoff',
    icon: '🛢️',
    dimensions: {
      defaultWidth: 24,
      defaultHeight: 36,
      defaultDepth: 24,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2],
      orientation: 'any',
      slopeRequirement: 'flat'
    },
    functions: [
      'rainwater-harvesting',
      'irrigation-supply',
      'emergency-water'
    ],
    materials: ['plastic', 'wood', 'metal'],
    capacity: {
      amount: 55,
      unit: 'gallons'
    },
    maintenance: {
      frequency: 'seasonal',
      tasks: ['clean-gutters', 'check-mosquito-screen', 'winterize']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'reduces-water-bills',
      'provides-chlorine-free-water',
      'reduces-runoff'
    ],
    considerations: [
      'mosquito-prevention',
      'overflow-management',
      'first-flush-diverter'
    ],
    integrations: ['drip-irrigation', 'swale']
  },
  {
    id: 'pond',
    name: 'Pond',
    category: 'water',
    description: 'Water feature for aquaculture, wildlife, and microclimate',
    icon: '🏞️',
    dimensions: {
      defaultWidth: 120,
      defaultHeight: 36,
      customizable: true
    },
    placement: {
      zones: [2, 3, 4],
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'aquaculture',
      'wildlife-habitat',
      'thermal-mass',
      'irrigation',
      'fire-protection'
    ],
    materials: ['natural', 'plastic', 'concrete'],
    capacity: {
      amount: 1000,
      unit: 'gallons'
    },
    maintenance: {
      frequency: 'monthly',
      tasks: ['algae-control', 'pump-maintenance', 'wildlife-monitoring']
    },
    cost: {
      estimate: 'high',
      diy: true
    },
    benefits: [
      'biodiversity',
      'microclimate-moderation',
      'aesthetic-value',
      'fish-production'
    ],
    considerations: [
      'mosquito-control',
      'child-safety',
      'local-regulations'
    ]
  },
  {
    id: 'swale',
    name: 'Swale',
    category: 'water',
    description: 'Contour ditch for water infiltration and erosion control',
    icon: '〰️',
    dimensions: {
      defaultWidth: 36,
      defaultHeight: 12,
      customizable: true
    },
    placement: {
      zones: [2, 3, 4],
      slopeRequirement: 'slight',
      orientation: 'any'
    },
    functions: [
      'water-infiltration',
      'erosion-control',
      'groundwater-recharge'
    ],
    materials: ['natural'],
    maintenance: {
      frequency: 'annual',
      tasks: ['clear-debris', 'maintain-level', 'replant-as-needed']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'passive-irrigation',
      'soil-building',
      'drought-resilience'
    ],
    considerations: [
      'proper-leveling',
      'overflow-planning',
      'plant-selection'
    ],
    integrations: ['rain-garden', 'food-forest']
  },
  {
    id: 'greywater-system',
    name: 'Greywater System',
    category: 'water',
    description: 'Recycles household water for irrigation',
    icon: '♻️',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 24,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      slopeRequirement: 'slight'
    },
    functions: [
      'water-recycling',
      'irrigation',
      'nutrient-cycling'
    ],
    materials: ['plastic', 'concrete'],
    maintenance: {
      frequency: 'monthly',
      tasks: ['filter-cleaning', 'pipe-inspection', 'mulch-addition']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'water-conservation',
      'reduced-sewage',
      'nutrient-recovery'
    ],
    considerations: [
      'local-codes',
      'soap-selection',
      'plant-compatibility'
    ]
  },

  // SOIL & COMPOSTING
  {
    id: 'compost-bin',
    name: 'Compost Bin',
    category: 'soil',
    description: 'Three-bin system for continuous composting',
    icon: '♻️',
    dimensions: {
      defaultWidth: 108,
      defaultHeight: 36,
      defaultDepth: 36,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'waste-processing',
      'soil-creation',
      'nutrient-cycling'
    ],
    materials: ['wood', 'recycled'],
    capacity: {
      amount: 27,
      unit: 'cubic-feet'
    },
    maintenance: {
      frequency: 'weekly',
      tasks: ['turn-pile', 'add-materials', 'moisture-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'waste-reduction',
      'soil-improvement',
      'carbon-sequestration'
    ],
    considerations: [
      'carbon-nitrogen-ratio',
      'moisture-level',
      'pest-prevention'
    ],
    integrations: ['worm-bin', 'chicken-coop']
  },
  {
    id: 'worm-bin',
    name: 'Worm Bin',
    category: 'soil',
    description: 'Vermicomposting system for kitchen scraps',
    icon: '🪱',
    dimensions: {
      defaultWidth: 24,
      defaultHeight: 18,
      defaultDepth: 18,
      customizable: true
    },
    placement: {
      zones: [0, 1],
      sunRequirement: 'shade'
    },
    functions: [
      'vermicomposting',
      'worm-casting-production',
      'liquid-fertilizer'
    ],
    materials: ['plastic', 'wood'],
    capacity: {
      amount: 5,
      unit: 'gallons-per-week'
    },
    maintenance: {
      frequency: 'weekly',
      tasks: ['feed-worms', 'harvest-castings', 'moisture-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'high-quality-compost',
      'liquid-fertilizer',
      'indoor-option'
    ],
    considerations: [
      'temperature-control',
      'moisture-balance',
      'food-selection'
    ]
  },
  {
    id: 'hugel-bed',
    name: 'Hugelkultur Bed',
    category: 'soil',
    description: 'Raised bed with buried wood for water retention',
    icon: '🪵',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 36,
      customizable: true
    },
    placement: {
      zones: [1, 2, 3],
      slopeRequirement: undefined,
      sunRequirement: 'full'
    },
    functions: [
      'water-retention',
      'soil-building',
      'carbon-sequestration'
    ],
    materials: ['wood', 'natural'],
    maintenance: {
      frequency: 'annual',
      tasks: ['mulch-addition', 'planting', 'harvesting']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'drought-resistance',
      'no-till',
      'long-term-fertility'
    ],
    considerations: [
      'nitrogen-lock-up',
      'initial-settlement',
      'wood-selection'
    ]
  },

  // ENERGY & SHELTER
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    category: 'shelter',
    description: 'Season extension and climate control structure',
    icon: '🏡',
    dimensions: {
      defaultWidth: 96,
      defaultHeight: 84,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      orientation: 'south',
      slopeRequirement: 'flat',
      sunRequirement: 'full'
    },
    functions: [
      'season-extension',
      'seedling-production',
      'tropical-plants',
      'aquaponics'
    ],
    materials: ['metal', 'plastic', 'wood'],
    maintenance: {
      frequency: 'weekly',
      tasks: ['temperature-monitoring', 'ventilation', 'watering']
    },
    cost: {
      estimate: 'high',
      diy: true
    },
    benefits: [
      'year-round-growing',
      'pest-protection',
      'climate-control'
    ],
    considerations: [
      'ventilation-needs',
      'heating-costs',
      'humidity-control'
    ],
    integrations: ['rain-barrel', 'thermal-mass']
  },
  {
    id: 'cold-frame',
    name: 'Cold Frame',
    category: 'shelter',
    description: 'Mini greenhouse for season extension',
    icon: '📦',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 18,
      defaultDepth: 36,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      orientation: 'south',
      sunRequirement: 'full'
    },
    functions: [
      'season-extension',
      'hardening-off',
      'winter-greens'
    ],
    materials: ['wood', 'plastic'],
    maintenance: {
      frequency: 'daily',
      tasks: ['ventilation', 'watering', 'temperature-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'extends-season',
      'protects-plants',
      'passive-solar'
    ],
    considerations: [
      'overheating-risk',
      'manual-operation',
      'size-limitations'
    ]
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel Array',
    category: 'energy',
    description: 'Renewable electricity generation',
    icon: '☀️',
    dimensions: {
      defaultWidth: 120,
      defaultHeight: 60,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2],
      orientation: 'south',
      slopeRequirement: undefined,
      sunRequirement: 'full'
    },
    functions: [
      'electricity-generation',
      'battery-charging',
      'grid-tie'
    ],
    materials: ['metal', 'plastic'],
    capacity: {
      amount: 300,
      unit: 'watts'
    },
    maintenance: {
      frequency: 'seasonal',
      tasks: ['panel-cleaning', 'connection-check', 'battery-maintenance']
    },
    cost: {
      estimate: 'high',
      diy: false
    },
    benefits: [
      'renewable-energy',
      'reduced-bills',
      'backup-power'
    ],
    considerations: [
      'initial-cost',
      'roof-condition',
      'local-regulations'
    ]
  },
  {
    id: 'wind-turbine',
    name: 'Small Wind Turbine',
    category: 'energy',
    description: 'Wind power generation for off-grid or supplemental power',
    icon: '🌬️',
    dimensions: {
      defaultWidth: 36,
      defaultHeight: 180,
      customizable: true
    },
    placement: {
      zones: [3, 4, 5],
      slopeRequirement: undefined
    },
    functions: [
      'electricity-generation',
      'water-pumping',
      'battery-charging'
    ],
    materials: ['metal'],
    capacity: {
      amount: 400,
      unit: 'watts'
    },
    maintenance: {
      frequency: 'annual',
      tasks: ['bearing-check', 'blade-inspection', 'tower-maintenance']
    },
    cost: {
      estimate: 'high',
      diy: false
    },
    benefits: [
      'renewable-energy',
      '24-hour-potential',
      'complements-solar'
    ],
    considerations: [
      'wind-assessment',
      'noise-levels',
      'bird-safety'
    ]
  },

  // SOCIAL SPACES
  {
    id: 'bench',
    name: 'Garden Bench',
    category: 'social',
    description: 'Seating for rest and observation',
    icon: '🪑',
    dimensions: {
      defaultWidth: 60,
      defaultHeight: 36,
      defaultDepth: 24,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2, 3],
      orientation: 'any',
      sunRequirement: 'partial'
    },
    functions: [
      'seating',
      'observation',
      'social-gathering'
    ],
    materials: ['wood', 'stone', 'metal', 'recycled'],
    maintenance: {
      frequency: 'annual',
      tasks: ['weatherproofing', 'stability-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'rest-area',
      'observation-point',
      'social-space'
    ],
    considerations: [
      'weather-resistance',
      'view-orientation',
      'shade-provision'
    ]
  },
  {
    id: 'fire-pit',
    name: 'Fire Pit',
    category: 'social',
    description: 'Gathering space for warmth and cooking',
    icon: '🔥',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 18,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      slopeRequirement: 'flat',
      sunRequirement: 'none'
    },
    functions: [
      'social-gathering',
      'cooking',
      'warmth',
      'biochar-production'
    ],
    materials: ['stone', 'metal', 'concrete'],
    maintenance: {
      frequency: 'monthly',
      tasks: ['ash-removal', 'safety-check', 'area-clearing']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'community-building',
      'outdoor-cooking',
      'ash-for-garden'
    ],
    considerations: [
      'fire-safety',
      'local-regulations',
      'smoke-direction'
    ],
    integrations: ['seating-circle', 'outdoor-kitchen']
  },
  {
    id: 'pergola',
    name: 'Pergola',
    category: 'social',
    description: 'Shade structure for climbing plants and gathering',
    icon: '🏛️',
    dimensions: {
      defaultWidth: 120,
      defaultHeight: 96,
      customizable: true
    },
    placement: {
      zones: [0, 1],
      orientation: 'any',
      slopeRequirement: 'flat',
      sunRequirement: 'full'
    },
    functions: [
      'shade-provision',
      'plant-support',
      'social-space',
      'microclimate'
    ],
    materials: ['wood', 'metal'],
    maintenance: {
      frequency: 'annual',
      tasks: ['structural-check', 'plant-pruning', 'weatherproofing']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'vertical-growing',
      'shade-creation',
      'aesthetic-value'
    ],
    considerations: [
      'foundation-needs',
      'plant-selection',
      'wind-resistance'
    ],
    integrations: ['grape-vine', 'seating-area']
  },
  {
    id: 'picnic-table',
    name: 'Picnic Table',
    category: 'social',
    description: 'Outdoor dining and gathering space',
    icon: '🍽️',
    dimensions: {
      defaultWidth: 72,
      defaultHeight: 30,
      defaultDepth: 60,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2],
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'outdoor-dining',
      'food-processing',
      'social-gathering'
    ],
    materials: ['wood', 'metal', 'recycled'],
    maintenance: {
      frequency: 'seasonal',
      tasks: ['cleaning', 'weatherproofing', 'stability-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'outdoor-meals',
      'workspace',
      'community-gathering'
    ],
    considerations: [
      'level-ground',
      'weather-protection',
      'accessibility'
    ]
  },
  {
    id: 'playground',
    name: 'Natural Playground',
    category: 'social',
    description: 'Play area using natural materials',
    icon: '🛝',
    dimensions: {
      defaultWidth: 240,
      defaultHeight: 96,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'children-play',
      'physical-activity',
      'nature-connection'
    ],
    materials: ['wood', 'stone', 'natural'],
    maintenance: {
      frequency: 'monthly',
      tasks: ['safety-inspection', 'surface-maintenance', 'equipment-check']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'child-development',
      'outdoor-activity',
      'community-space'
    ],
    considerations: [
      'safety-surfacing',
      'age-appropriate',
      'supervision-sightlines'
    ]
  },

  // ANIMAL STRUCTURES
  {
    id: 'chicken-coop',
    name: 'Chicken Coop',
    category: 'animal',
    description: 'Housing for backyard chickens',
    icon: '🐔',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 48,
      defaultDepth: 48,
      customizable: true
    },
    placement: {
      zones: [2, 3],
      orientation: 'south',
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'egg-production',
      'meat-production',
      'pest-control',
      'fertilizer-production'
    ],
    materials: ['wood', 'metal'],
    capacity: {
      amount: 6,
      unit: 'chickens'
    },
    maintenance: {
      frequency: 'daily',
      tasks: ['feeding', 'watering', 'egg-collection', 'cleaning']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'fresh-eggs',
      'pest-management',
      'manure-production'
    ],
    considerations: [
      'predator-protection',
      'local-regulations',
      'noise-concerns'
    ],
    integrations: ['chicken-run', 'compost-bin']
  },
  {
    id: 'chicken-tractor',
    name: 'Chicken Tractor',
    category: 'animal',
    description: 'Mobile chicken housing for rotational grazing',
    icon: '🚜',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 36,
      defaultDepth: 96,
      customizable: true
    },
    placement: {
      zones: [2, 3, 4],
      slopeRequirement: 'flat',
      sunRequirement: undefined
    },
    functions: [
      'rotational-grazing',
      'soil-preparation',
      'pest-control',
      'fertilization'
    ],
    materials: ['wood', 'metal'],
    capacity: {
      amount: 4,
      unit: 'chickens'
    },
    maintenance: {
      frequency: 'daily',
      tasks: ['moving', 'feeding', 'watering']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'land-improvement',
      'integrated-management',
      'reduced-feed-costs'
    ],
    considerations: [
      'daily-moving',
      'ground-condition',
      'weather-protection'
    ]
  },
  {
    id: 'beehive',
    name: 'Beehive',
    category: 'animal',
    description: 'Home for honeybees',
    icon: '🐝',
    dimensions: {
      defaultWidth: 20,
      defaultHeight: 24,
      defaultDepth: 16,
      customizable: false
    },
    placement: {
      zones: [2, 3, 4],
      orientation: 'south',
      sunRequirement: 'full'
    },
    functions: [
      'pollination',
      'honey-production',
      'wax-production'
    ],
    materials: ['wood'],
    capacity: {
      amount: 60000,
      unit: 'bees'
    },
    maintenance: {
      frequency: 'monthly',
      tasks: ['inspection', 'disease-check', 'honey-harvest']
    },
    cost: {
      estimate: 'medium',
      diy: false
    },
    benefits: [
      'improved-pollination',
      'honey-harvest',
      'ecosystem-support'
    ],
    considerations: [
      'neighbor-concerns',
      'bee-knowledge',
      'water-source'
    ]
  },
  {
    id: 'rabbit-hutch',
    name: 'Rabbit Hutch',
    category: 'animal',
    description: 'Housing for rabbits',
    icon: '🐰',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 36,
      defaultDepth: 24,
      customizable: true
    },
    placement: {
      zones: [1, 2],
      sunRequirement: 'shade'
    },
    functions: [
      'meat-production',
      'fur-production',
      'manure-production'
    ],
    materials: ['wood', 'metal'],
    capacity: {
      amount: 2,
      unit: 'rabbits'
    },
    maintenance: {
      frequency: 'daily',
      tasks: ['feeding', 'watering', 'cleaning', 'health-check']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'quiet-livestock',
      'high-quality-manure',
      'small-space-suitable'
    ],
    considerations: [
      'temperature-control',
      'predator-protection',
      'breeding-management'
    ]
  },

  // STORAGE & PROCESSING
  {
    id: 'tool-shed',
    name: 'Tool Shed',
    category: 'storage',
    description: 'Storage for garden tools and supplies',
    icon: '🏚️',
    dimensions: {
      defaultWidth: 96,
      defaultHeight: 96,
      defaultDepth: 48,
      customizable: true
    },
    placement: {
      zones: [0, 1],
      slopeRequirement: 'flat'
    },
    functions: [
      'tool-storage',
      'supply-storage',
      'workspace'
    ],
    materials: ['wood', 'metal'],
    maintenance: {
      frequency: 'annual',
      tasks: ['organization', 'weatherproofing', 'pest-control']
    },
    cost: {
      estimate: 'medium',
      diy: true
    },
    benefits: [
      'organized-storage',
      'tool-protection',
      'workspace'
    ],
    considerations: [
      'security',
      'ventilation',
      'foundation-type'
    ]
  },
  {
    id: 'root-cellar',
    name: 'Root Cellar',
    category: 'storage',
    description: 'Underground storage for produce',
    icon: '🥔',
    dimensions: {
      defaultWidth: 96,
      defaultHeight: 84,
      defaultDepth: 96,
      customizable: true
    },
    placement: {
      zones: [0, 1],
      slopeRequirement: 'slight'
    },
    functions: [
      'food-storage',
      'temperature-control',
      'humidity-control'
    ],
    materials: ['concrete', 'stone', 'wood'],
    capacity: {
      amount: 500,
      unit: 'pounds'
    },
    maintenance: {
      frequency: 'seasonal',
      tasks: ['temperature-monitoring', 'humidity-control', 'ventilation-check']
    },
    cost: {
      estimate: 'high',
      diy: true
    },
    benefits: [
      'no-electricity-storage',
      'long-term-preservation',
      'temperature-stability'
    ],
    considerations: [
      'water-table',
      'drainage',
      'ventilation-design'
    ]
  },
  {
    id: 'outdoor-kitchen',
    name: 'Outdoor Kitchen',
    category: 'processing',
    description: 'Cooking and food preparation area',
    icon: '👨‍🍳',
    dimensions: {
      defaultWidth: 120,
      defaultHeight: 36,
      defaultDepth: 36,
      customizable: true
    },
    placement: {
      zones: [0, 1],
      slopeRequirement: 'flat',
      sunRequirement: 'partial'
    },
    functions: [
      'cooking',
      'food-processing',
      'canning',
      'social-gathering'
    ],
    materials: ['stone', 'metal', 'concrete'],
    maintenance: {
      frequency: 'weekly',
      tasks: ['cleaning', 'supply-check', 'equipment-maintenance']
    },
    cost: {
      estimate: 'high',
      diy: true
    },
    benefits: [
      'outdoor-cooking',
      'bulk-processing',
      'summer-heat-reduction'
    ],
    considerations: [
      'weather-protection',
      'utility-connections',
      'food-safety'
    ],
    integrations: ['herb-spiral', 'pizza-oven']
  },

  // BOUNDARIES & PATHS
  {
    id: 'living-fence',
    name: 'Living Fence',
    category: 'boundary',
    description: 'Hedge or fence made from living plants',
    icon: '🌳',
    dimensions: {
      defaultWidth: 12,
      defaultHeight: 72,
      customizable: true
    },
    placement: {
      zones: [3, 4, 5],
      slopeRequirement: undefined,
      sunRequirement: 'partial'
    },
    functions: [
      'boundary-marking',
      'windbreak',
      'privacy',
      'wildlife-habitat'
    ],
    materials: ['natural'],
    maintenance: {
      frequency: 'seasonal',
      tasks: ['pruning', 'training', 'gap-filling']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'wildlife-corridor',
      'food-production',
      'carbon-sequestration'
    ],
    considerations: [
      'growth-rate',
      'maintenance-needs',
      'species-selection'
    ]
  },
  {
    id: 'arbor',
    name: 'Arbor',
    category: 'boundary',
    description: 'Garden entrance with climbing plants',
    icon: '🏵️',
    dimensions: {
      defaultWidth: 48,
      defaultHeight: 84,
      defaultDepth: 24,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2],
      orientation: 'any',
      sunRequirement: 'partial'
    },
    functions: [
      'entrance-marking',
      'vertical-growing',
      'aesthetic'
    ],
    materials: ['wood', 'metal'],
    maintenance: {
      frequency: 'seasonal',
      tasks: ['plant-training', 'structural-check', 'pruning']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'defines-spaces',
      'vertical-production',
      'beauty'
    ],
    considerations: [
      'plant-weight',
      'foundation-needs',
      'pathway-width'
    ]
  },
  {
    id: 'stepping-stones',
    name: 'Stepping Stone Path',
    category: 'boundary',
    description: 'Natural pathway through garden',
    icon: '🪨',
    dimensions: {
      defaultWidth: 18,
      defaultHeight: 2,
      customizable: true
    },
    placement: {
      zones: [0, 1, 2, 3],
      slopeRequirement: undefined
    },
    functions: [
      'pathway',
      'soil-protection',
      'accessibility'
    ],
    materials: ['stone', 'concrete', 'recycled'],
    maintenance: {
      frequency: 'annual',
      tasks: ['leveling', 'weed-control', 'replacement']
    },
    cost: {
      estimate: 'low',
      diy: true
    },
    benefits: [
      'defines-paths',
      'reduces-compaction',
      'all-weather-access'
    ],
    considerations: [
      'spacing',
      'level-surface',
      'drainage'
    ]
  }
]

// Helper functions
export function getStructuresByCategory(category: StructureCategory): PermacultureStructure[] {
  return PERMACULTURE_STRUCTURES.filter(s => s.category === category)
}

export function getStructuresByZone(zone: number): PermacultureStructure[] {
  return PERMACULTURE_STRUCTURES.filter(s => s.placement.zones.includes(zone))
}

export function getStructuresByFunction(func: string): PermacultureStructure[] {
  return PERMACULTURE_STRUCTURES.filter(s => s.functions.includes(func))
}

export function getIntegratedStructures(structureId: string): PermacultureStructure[] {
  const structure = PERMACULTURE_STRUCTURES.find(s => s.id === structureId)
  if (!structure || !structure.integrations) return []

  return PERMACULTURE_STRUCTURES.filter(s =>
    structure.integrations!.includes(s.id)
  )
}