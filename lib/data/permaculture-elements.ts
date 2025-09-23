// Permaculture Design Elements

export interface WaterElement {
  id: string
  name: string
  type: 'swale' | 'pond' | 'rain-garden' | 'greywater' | 'tank' | 'dam' | 'spring'
  description: string
  benefits: string[]
  considerations: string[]
  icon: string
}

export const WATER_HARVESTING_ELEMENTS: WaterElement[] = [
  {
    id: 'swale',
    name: 'Swale',
    type: 'swale',
    description: 'Level contour ditch that captures and infiltrates water',
    benefits: [
      'Recharges groundwater',
      'Prevents erosion',
      'Creates microclimates',
      'Builds soil moisture'
    ],
    considerations: [
      'Must be on contour',
      'Size based on catchment area',
      'Include overflow for heavy rain',
      'Mulch heavily'
    ],
    icon: '〰️'
  },
  {
    id: 'pond',
    name: 'Pond',
    type: 'pond',
    description: 'Water storage for irrigation, aquaculture, and wildlife',
    benefits: [
      'Thermal mass for microclimate',
      'Aquaculture potential',
      'Wildlife habitat',
      'Fire protection',
      'Recreation'
    ],
    considerations: [
      'Clay soil or liner needed',
      'Consider evaporation rates',
      'Plan overflow system',
      'Stock with beneficial species'
    ],
    icon: '🏞️'
  },
  {
    id: 'rain-garden',
    name: 'Rain Garden',
    type: 'rain-garden',
    description: 'Depressed area that collects and filters stormwater',
    benefits: [
      'Filters pollutants',
      'Reduces runoff',
      'Creates habitat',
      'Beautiful landscape feature'
    ],
    considerations: [
      'Native plants preferred',
      'Size for 24-48hr drainage',
      'Minimum 10ft from foundations',
      'Amend soil for drainage'
    ],
    icon: '🌺'
  },
  {
    id: 'greywater',
    name: 'Greywater System',
    type: 'greywater',
    description: 'Reuses water from sinks, showers, and laundry',
    benefits: [
      'Reduces water consumption',
      'Nutrients for plants',
      'Year-round irrigation',
      'Reduces septic load'
    ],
    considerations: [
      'Use biodegradable soaps',
      'Rotate application areas',
      'No root vegetables',
      'Check local regulations'
    ],
    icon: '♻️'
  }
]

export interface SoilElement {
  id: string
  name: string
  type: 'compost' | 'vermicompost' | 'biochar' | 'mulch' | 'cover-crop'
  description: string
  carbonNitrogen: string
  timeToReady: string
  icon: string
}

export const SOIL_BUILDING_ELEMENTS: SoilElement[] = [
  {
    id: 'hot-compost',
    name: 'Hot Composting',
    type: 'compost',
    description: 'Thermophilic composting reaches 140-160°F',
    carbonNitrogen: '30:1 C:N ratio',
    timeToReady: '6-8 weeks',
    icon: '🔥'
  },
  {
    id: 'vermicompost',
    name: 'Vermicomposting',
    type: 'vermicompost',
    description: 'Worm bins produce nutrient-rich castings',
    carbonNitrogen: '50:1 C:N ratio',
    timeToReady: '3-6 months',
    icon: '🪱'
  },
  {
    id: 'sheet-mulch',
    name: 'Sheet Mulching',
    type: 'mulch',
    description: 'Cardboard and organic matter suppress weeds and build soil',
    carbonNitrogen: 'Layer greens and browns',
    timeToReady: '6-12 months',
    icon: '📦'
  },
  {
    id: 'cover-crops',
    name: 'Cover Crops',
    type: 'cover-crop',
    description: 'Nitrogen-fixing and soil-building plants',
    carbonNitrogen: 'Varies by species',
    timeToReady: '2-4 months',
    icon: '🌾'
  }
]

export interface Sector {
  id: string
  name: string
  type: 'sun' | 'wind' | 'water' | 'fire' | 'frost' | 'noise' | 'view'
  description: string
  considerations: string[]
  icon: string
}

export const SECTOR_ANALYSIS: Sector[] = [
  {
    id: 'sun-sector',
    name: 'Sun Sector',
    type: 'sun',
    description: 'Track sun paths through seasons',
    considerations: [
      'Summer vs winter angles',
      'Shade from structures/trees',
      'Solar gain opportunities',
      'Crop placement by light needs'
    ],
    icon: '☀️'
  },
  {
    id: 'wind-sector',
    name: 'Wind Sector',
    type: 'wind',
    description: 'Map prevailing and storm winds',
    considerations: [
      'Windbreak placement',
      'Ventilation in summer',
      'Protection in winter',
      'Fire risk directions'
    ],
    icon: '💨'
  },
  {
    id: 'water-sector',
    name: 'Water Flow',
    type: 'water',
    description: 'Understand water movement on site',
    considerations: [
      'Natural drainage patterns',
      'Erosion risk areas',
      'Water harvesting points',
      'Flood zones'
    ],
    icon: '💧'
  },
  {
    id: 'frost-sector',
    name: 'Frost Pockets',
    type: 'frost',
    description: 'Identify cold air drainage',
    considerations: [
      'Avoid tender plants in frost pockets',
      'Use thermal mass strategically',
      'Plant selection by hardiness',
      'Season extension structures'
    ],
    icon: '❄️'
  }
]

export interface PermaculturePrinciple {
  id: number
  principle: string
  description: string
  applications: string[]
}

export const PERMACULTURE_PRINCIPLES: PermaculturePrinciple[] = [
  {
    id: 1,
    principle: 'Observe and Interact',
    description: 'Take time to engage with nature',
    applications: [
      'Site analysis before design',
      'Seasonal observation diary',
      'Learn from natural patterns',
      'Respond to feedback'
    ]
  },
  {
    id: 2,
    principle: 'Catch and Store Energy',
    description: 'Collect resources when abundant',
    applications: [
      'Rainwater harvesting',
      'Solar orientation',
      'Food preservation',
      'Seed saving'
    ]
  },
  {
    id: 3,
    principle: 'Obtain a Yield',
    description: 'Ensure you get truly useful rewards',
    applications: [
      'Plant productive species',
      'Stack functions',
      'Value all yields',
      'Share abundance'
    ]
  },
  {
    id: 4,
    principle: 'Apply Self-Regulation',
    description: 'Accept feedback and respond',
    applications: [
      'Composting cycles',
      'Integrated pest management',
      'Natural predator habitat',
      'Limit consumption'
    ]
  },
  {
    id: 5,
    principle: 'Use Renewable Resources',
    description: 'Make best use of natural abundance',
    applications: [
      'Solar and wind energy',
      'Biological pest control',
      'Natural building materials',
      'Perennial systems'
    ]
  },
  {
    id: 6,
    principle: 'Produce No Waste',
    description: 'Value and use all resources',
    applications: [
      'Composting systems',
      'Greywater reuse',
      'Upcycling materials',
      'Closed-loop systems'
    ]
  },
  {
    id: 7,
    principle: 'Design from Patterns',
    description: 'Step back to see the big picture',
    applications: [
      'Keyline design',
      'Spiral herb gardens',
      'Branching patterns',
      'Edge effect'
    ]
  },
  {
    id: 8,
    principle: 'Integrate Rather Than Segregate',
    description: 'Put the right things in the right place',
    applications: [
      'Guild planting',
      'Companion planting',
      'Multi-species grazing',
      'Stacking functions'
    ]
  },
  {
    id: 9,
    principle: 'Use Small and Slow Solutions',
    description: 'Small systems are easier to maintain',
    applications: [
      'Start with Zone 1',
      'Gradual expansion',
      'Local resources',
      'Human-scale systems'
    ]
  },
  {
    id: 10,
    principle: 'Use and Value Diversity',
    description: 'Diversity reduces vulnerability',
    applications: [
      'Polycultures',
      'Multiple income streams',
      'Genetic diversity',
      'Habitat variety'
    ]
  },
  {
    id: 11,
    principle: 'Use Edges and Value the Marginal',
    description: 'The edge is where the action is',
    applications: [
      'Maximize edge in ponds',
      'Ecotone planting',
      'Marginal land use',
      'Border productivity'
    ]
  },
  {
    id: 12,
    principle: 'Creatively Respond to Change',
    description: 'Vision is seeing things as they will be',
    applications: [
      'Climate adaptation',
      'Succession planting',
      'Flexible design',
      'Resilience planning'
    ]
  }
]