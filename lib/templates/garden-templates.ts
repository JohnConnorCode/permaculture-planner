// Garden Template System - Optimized starter configurations

export interface GardenTemplate {
  id: string
  name: string
  description: string
  icon: string
  tags: string[]
  sqft: number
  config: {
    beds: BedConfig[]
    paths: PathConfig[]
    features: string[]
    irrigation: 'drip' | 'soaker' | 'manual' | 'wicking'
    accessibility: boolean
  }
  crops: {
    focus: string[]
    rotation: string[][]
    companions: Record<string, string[]>
  }
  timeEstimate: {
    setupHours: number
    weeklyMinutes: number
  }
}

interface BedConfig {
  width: number
  length: number
  height: number
  position: { x: number; y: number }
  orientation: 'NS' | 'EW'
  type: 'raised' | 'wicking' | 'hugelkultur' | 'keyhole'
  crops?: string[]
}

interface PathConfig {
  width: number
  material: 'mulch' | 'gravel' | 'pavers' | 'grass'
  accessible: boolean
}

export const GARDEN_TEMPLATES: GardenTemplate[] = [
  {
    id: 'beginner-salad',
    name: 'Beginner Salad Garden',
    description: 'Perfect starter garden for fresh salads and herbs. Low maintenance, high yield.',
    icon: '🥗',
    tags: ['beginner', 'small-space', 'quick-harvest'],
    sqft: 64,
    config: {
      beds: [
        { width: 4, length: 8, height: 12, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['lettuce', 'spinach', 'arugula', 'kale'] },
        { width: 4, length: 8, height: 12, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['basil', 'parsley', 'cilantro', 'chives'] }
      ],
      paths: [{ width: 2, material: 'mulch', accessible: false }],
      features: ['herb spiral', 'compost bin'],
      irrigation: 'drip',
      accessibility: false
    },
    crops: {
      focus: ['lettuce', 'herbs', 'quick greens'],
      rotation: [
        ['lettuce', 'spinach', 'arugula'],
        ['beans', 'peas', 'radishes'],
        ['kale', 'chard', 'mustard']
      ],
      companions: {
        'lettuce': ['chives', 'garlic', 'onions'],
        'spinach': ['strawberries', 'radishes'],
        'herbs': ['tomatoes', 'peppers']
      }
    },
    timeEstimate: {
      setupHours: 4,
      weeklyMinutes: 30
    }
  },

  {
    id: 'family-abundance',
    name: 'Family Food Forest',
    description: 'Diverse garden to feed a family of 4. Mix of annuals and perennials.',
    icon: '👨‍👩‍👧‍👦',
    tags: ['family', 'diverse', 'self-sufficient'],
    sqft: 400,
    config: {
      beds: [
        { width: 4, length: 12, height: 12, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['tomatoes', 'peppers', 'eggplant'] },
        { width: 4, length: 12, height: 12, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['corn', 'beans', 'squash'] },
        { width: 4, length: 12, height: 12, position: { x: 10, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['carrots', 'beets', 'onions'] },
        { width: 4, length: 12, height: 18, position: { x: 0, y: 14 }, orientation: 'EW', type: 'wicking',
          crops: ['strawberries', 'blueberries'] }
      ],
      paths: [{ width: 3, material: 'gravel', accessible: true }],
      features: ['greenhouse', 'rain barrel', 'tool shed', 'chicken coop'],
      irrigation: 'drip',
      accessibility: true
    },
    crops: {
      focus: ['tomatoes', 'corn', 'beans', 'squash', 'berries'],
      rotation: [
        ['nightshades', 'brassicas', 'legumes'],
        ['roots', 'greens', 'squash'],
        ['corn', 'cover crops', 'alliums']
      ],
      companions: {
        'tomatoes': ['basil', 'carrots', 'onions'],
        'corn': ['beans', 'squash', 'cucumbers'],
        'strawberries': ['borage', 'thyme']
      }
    },
    timeEstimate: {
      setupHours: 12,
      weeklyMinutes: 120
    }
  },

  {
    id: 'urban-maximizer',
    name: 'Urban Space Maximizer',
    description: 'Vertical growing for balconies and small yards. Maximum yield per square foot.',
    icon: '🏙️',
    tags: ['urban', 'vertical', 'small-space'],
    sqft: 32,
    config: {
      beds: [
        { width: 2, length: 4, height: 24, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['tomatoes', 'cucumbers'] },
        { width: 2, length: 4, height: 24, position: { x: 3, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['pole beans', 'peas'] },
        { width: 4, length: 2, height: 8, position: { x: 0, y: 5 }, orientation: 'EW', type: 'raised',
          crops: ['lettuce', 'herbs'] }
      ],
      paths: [{ width: 1.5, material: 'pavers', accessible: false }],
      features: ['trellis system', 'vertical planters', 'grow lights'],
      irrigation: 'drip',
      accessibility: false
    },
    crops: {
      focus: ['vertical crops', 'compact varieties', 'microgreens'],
      rotation: [
        ['climbers', 'greens', 'herbs'],
        ['dwarf tomatoes', 'lettuce', 'radishes']
      ],
      companions: {
        'tomatoes': ['basil', 'marigolds'],
        'beans': ['summer savory', 'rosemary']
      }
    },
    timeEstimate: {
      setupHours: 3,
      weeklyMinutes: 45
    }
  },

  {
    id: 'permaculture-paradise',
    name: 'Permaculture Paradise',
    description: 'Self-sustaining ecosystem with guilds, water harvesting, and perennials.',
    icon: '🌳',
    tags: ['permaculture', 'sustainable', 'low-maintenance'],
    sqft: 800,
    config: {
      beds: [
        { width: 6, length: 20, height: 18, position: { x: 0, y: 0 }, orientation: 'NS', type: 'hugelkultur',
          crops: ['fruit trees', 'berry bushes', 'perennial vegetables'] },
        { width: 8, length: 8, height: 24, position: { x: 8, y: 0 }, orientation: 'NS', type: 'keyhole',
          crops: ['kitchen herbs', 'salad greens'] },
        { width: 4, length: 16, height: 12, position: { x: 0, y: 22 }, orientation: 'EW', type: 'raised',
          crops: ['asparagus', 'artichokes', 'rhubarb'] }
      ],
      paths: [{ width: 3, material: 'mulch', accessible: true }],
      features: ['swale', 'pond', 'food forest', 'composting system', 'rainwater harvesting'],
      irrigation: 'manual',
      accessibility: true
    },
    crops: {
      focus: ['perennials', 'fruit trees', 'nitrogen fixers'],
      rotation: [
        ['ground cover', 'shrub layer', 'canopy'],
        ['dynamic accumulators', 'nitrogen fixers', 'pest deterrents']
      ],
      companions: {
        'fruit trees': ['comfrey', 'chives', 'nasturtiums'],
        'berries': ['tansy', 'yarrow', 'clover']
      }
    },
    timeEstimate: {
      setupHours: 24,
      weeklyMinutes: 60
    }
  },

  {
    id: 'medicinal-wellness',
    name: 'Medicinal & Wellness Garden',
    description: 'Healing herbs, medicinal plants, and aromatherapy species.',
    icon: '🌿',
    tags: ['medicinal', 'herbs', 'wellness'],
    sqft: 144,
    config: {
      beds: [
        { width: 4, length: 6, height: 12, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['echinacea', 'calendula', 'chamomile'] },
        { width: 4, length: 6, height: 12, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['lavender', 'rosemary', 'sage'] },
        { width: 4, length: 6, height: 12, position: { x: 0, y: 7 }, orientation: 'NS', type: 'raised',
          crops: ['peppermint', 'lemon balm', 'valerian'] }
      ],
      paths: [{ width: 2, material: 'gravel', accessible: false }],
      features: ['herb spiral', 'drying rack', 'meditation area'],
      irrigation: 'drip',
      accessibility: false
    },
    crops: {
      focus: ['medicinal herbs', 'aromatherapy plants', 'tea herbs'],
      rotation: [
        ['annuals', 'biennials', 'perennials'],
        ['roots', 'leaves', 'flowers']
      ],
      companions: {
        'lavender': ['rosemary', 'thyme'],
        'chamomile': ['mint', 'basil']
      }
    },
    timeEstimate: {
      setupHours: 6,
      weeklyMinutes: 40
    }
  },

  {
    id: 'pollinator-haven',
    name: 'Pollinator Haven',
    description: 'Native plants and flowers to support bees, butterflies, and beneficial insects.',
    icon: '🦋',
    tags: ['pollinator', 'native', 'ecological'],
    sqft: 200,
    config: {
      beds: [
        { width: 4, length: 10, height: 8, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['sunflowers', 'zinnias', 'cosmos'] },
        { width: 4, length: 10, height: 8, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['milkweed', 'coneflowers', 'black-eyed susans'] },
        { width: 6, length: 8, height: 6, position: { x: 0, y: 12 }, orientation: 'EW', type: 'raised',
          crops: ['wildflower mix', 'native grasses'] }
      ],
      paths: [{ width: 2.5, material: 'mulch', accessible: false }],
      features: ['bee hotel', 'butterfly puddling station', 'bird bath'],
      irrigation: 'manual',
      accessibility: false
    },
    crops: {
      focus: ['native flowers', 'pollinator plants', 'host plants'],
      rotation: [
        ['spring blooms', 'summer blooms', 'fall blooms'],
        ['annuals', 'perennials', 'self-seeders']
      ],
      companions: {
        'vegetables': ['marigolds', 'nasturtiums', 'alyssum'],
        'fruit': ['borage', 'phacelia', 'buckwheat']
      }
    },
    timeEstimate: {
      setupHours: 8,
      weeklyMinutes: 30
    }
  },

  {
    id: 'survival-prepper',
    name: 'Survival Garden',
    description: 'Calorie-dense crops for self-sufficiency. Focus on storage and preservation.',
    icon: '🥔',
    tags: ['survival', 'self-sufficient', 'storage'],
    sqft: 600,
    config: {
      beds: [
        { width: 4, length: 20, height: 12, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['potatoes', 'sweet potatoes'] },
        { width: 4, length: 20, height: 12, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['corn', 'beans', 'squash'] },
        { width: 4, length: 20, height: 12, position: { x: 10, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['cabbage', 'carrots', 'beets'] },
        { width: 6, length: 12, height: 8, position: { x: 0, y: 22 }, orientation: 'EW', type: 'raised',
          crops: ['grains', 'amaranth', 'quinoa'] }
      ],
      paths: [{ width: 3, material: 'mulch', accessible: true }],
      features: ['root cellar', 'grain storage', 'seed bank', 'solar dehydrator'],
      irrigation: 'manual',
      accessibility: true
    },
    crops: {
      focus: ['potatoes', 'beans', 'squash', 'corn', 'grains'],
      rotation: [
        ['potatoes', 'legumes', 'brassicas'],
        ['corn', 'roots', 'squash'],
        ['grains', 'cover crops', 'alliums']
      ],
      companions: {
        'potatoes': ['beans', 'marigolds', 'horseradish'],
        'corn': ['beans', 'squash', 'sunflowers']
      }
    },
    timeEstimate: {
      setupHours: 16,
      weeklyMinutes: 180
    }
  },

  {
    id: 'chef-kitchen',
    name: "Chef's Kitchen Garden",
    description: 'Gourmet vegetables, rare varieties, and culinary herbs for food enthusiasts.',
    icon: '👨‍🍳',
    tags: ['gourmet', 'culinary', 'diverse'],
    sqft: 256,
    config: {
      beds: [
        { width: 4, length: 8, height: 12, position: { x: 0, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['heirloom tomatoes', 'specialty peppers'] },
        { width: 4, length: 8, height: 12, position: { x: 5, y: 0 }, orientation: 'NS', type: 'raised',
          crops: ['french herbs', 'asian greens'] },
        { width: 4, length: 8, height: 12, position: { x: 0, y: 10 }, orientation: 'NS', type: 'raised',
          crops: ['microgreens', 'edible flowers'] },
        { width: 4, length: 8, height: 12, position: { x: 5, y: 10 }, orientation: 'NS', type: 'raised',
          crops: ['garlic', 'shallots', 'specialty onions'] }
      ],
      paths: [{ width: 2.5, material: 'pavers', accessible: false }],
      features: ['greenhouse', 'cold frame', 'herb drying area'],
      irrigation: 'drip',
      accessibility: false
    },
    crops: {
      focus: ['heirloom varieties', 'exotic herbs', 'edible flowers'],
      rotation: [
        ['nightshades', 'greens', 'herbs'],
        ['roots', 'legumes', 'alliums'],
        ['flowers', 'microgreens', 'specialty crops']
      ],
      companions: {
        'tomatoes': ['basil', 'oregano', 'parsley'],
        'peppers': ['marjoram', 'basil', 'onions']
      }
    },
    timeEstimate: {
      setupHours: 8,
      weeklyMinutes: 90
    }
  }
]

// Helper function to select template based on user criteria
export function selectTemplate(criteria: {
  experience?: 'beginner' | 'intermediate' | 'advanced'
  space?: number
  timeAvailable?: number
  goals?: string[]
}): GardenTemplate | undefined {
  let bestMatch: GardenTemplate | undefined
  let highestScore = 0

  for (const template of GARDEN_TEMPLATES) {
    let score = 0

    // Match space requirements
    if (criteria.space) {
      const spaceDiff = Math.abs(template.sqft - criteria.space)
      score += Math.max(0, 100 - spaceDiff)
    }

    // Match time availability
    if (criteria.timeAvailable) {
      const timeDiff = Math.abs(template.timeEstimate.weeklyMinutes - criteria.timeAvailable)
      score += Math.max(0, 100 - timeDiff)
    }

    // Match goals
    if (criteria.goals) {
      const matchingTags = template.tags.filter(tag =>
        criteria.goals?.some(goal => tag.includes(goal.toLowerCase()))
      )
      score += matchingTags.length * 50
    }

    // Experience level bonus
    if (criteria.experience === 'beginner' && template.tags.includes('beginner')) {
      score += 100
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = template
    }
  }

  return bestMatch
}

// Convert template to scene nodes for the visual editor
export function templateToScene(template: GardenTemplate) {
  const nodes: any[] = []

  // Convert beds to nodes
  template.config.beds.forEach((bed, index) => {
    nodes.push({
      id: `bed-${index}`,
      type: 'Bed',
      transform: {
        xIn: bed.position.x * 12,
        yIn: bed.position.y * 12,
        rotationDeg: bed.orientation === 'NS' ? 0 : 90
      },
      size: {
        widthIn: bed.width * 12,
        heightIn: bed.length * 12
      },
      bed: {
        heightIn: bed.height,
        orientation: bed.orientation,
        wicking: bed.type === 'wicking',
        trellisNorth: bed.crops?.some(c => ['tomatoes', 'beans', 'peas', 'cucumbers'].includes(c)),
        familyTag: bed.crops?.join(', ') || `Bed ${index + 1}`
      }
    })
  })

  // Add path nodes if needed
  template.config.paths.forEach((path, index) => {
    nodes.push({
      id: `path-${index}`,
      type: 'Path',
      path: {
        widthIn: path.width * 12,
        material: path.material,
        accessible: path.accessible
      }
    })
  })

  return {
    id: `scene-${template.id}`,
    name: template.name,
    size: {
      widthIn: Math.sqrt(template.sqft) * 12,
      heightIn: Math.sqrt(template.sqft) * 12
    },
    layers: [{
      id: 'main',
      name: template.name,
      visible: true,
      locked: false,
      order: 0,
      nodes
    }]
  }
}