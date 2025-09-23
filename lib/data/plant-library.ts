export interface PlantInfo {
  id: string
  name: string
  category: 'vegetable' | 'fruit' | 'herb' | 'flower' | 'tree' | 'shrub' | 'groundcover' | 'vine'
  icon: string // emoji or symbol
  color: string
  size: {
    mature_width: number // inches
    mature_height: number // inches
    spacing: number // inches
  }
  requirements: {
    sun: 'full' | 'partial' | 'shade'
    water: 'low' | 'medium' | 'high'
    soil: 'sandy' | 'loamy' | 'clay' | 'any'
    zone: string[] // USDA zones
  }
  companions: string[] // good companion plant IDs
  antagonists: string[] // plants to avoid nearby
  harvest_time: string
  planting_time: string
}

export const PLANT_LIBRARY: PlantInfo[] = [
  // Vegetables
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'vegetable',
    icon: '🍅',
    color: '#ef4444',
    size: { mature_width: 24, mature_height: 48, spacing: 24 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8', '9', '10'] },
    companions: ['basil', 'carrot', 'marigold', 'nasturtium'],
    antagonists: ['cabbage', 'fennel'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Spring'
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    category: 'vegetable',
    icon: '🥬',
    color: '#84cc16',
    size: { mature_width: 6, mature_height: 8, spacing: 6 },
    requirements: { sun: 'partial', water: 'medium', soil: 'loamy', zone: ['2', '3', '4', '5', '6', '7', '8', '9'] },
    companions: ['carrot', 'radish', 'strawberry', 'cucumber'],
    antagonists: [],
    harvest_time: 'Spring-Fall',
    planting_time: 'Early Spring'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'vegetable',
    icon: '🥕',
    color: '#f97316',
    size: { mature_width: 3, mature_height: 12, spacing: 3 },
    requirements: { sun: 'full', water: 'medium', soil: 'sandy', zone: ['3', '4', '5', '6', '7', '8', '9'] },
    companions: ['tomato', 'lettuce', 'onion', 'rosemary'],
    antagonists: ['dill'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Spring'
  },
  {
    id: 'pepper',
    name: 'Bell Pepper',
    category: 'vegetable',
    icon: '🌶️',
    color: '#dc2626',
    size: { mature_width: 18, mature_height: 24, spacing: 18 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['4', '5', '6', '7', '8', '9', '10', '11'] },
    companions: ['basil', 'tomato', 'carrot', 'onion'],
    antagonists: ['fennel', 'beans'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Late Spring'
  },
  {
    id: 'squash',
    name: 'Squash',
    category: 'vegetable',
    icon: '🎃',
    color: '#f59e0b',
    size: { mature_width: 48, mature_height: 24, spacing: 36 },
    requirements: { sun: 'full', water: 'high', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8', '9', '10'] },
    companions: ['corn', 'beans', 'nasturtium', 'radish'],
    antagonists: ['potato'],
    harvest_time: 'Fall',
    planting_time: 'Late Spring'
  },
  {
    id: 'beans',
    name: 'Green Beans',
    category: 'vegetable',
    icon: '🫘',
    color: '#22c55e',
    size: { mature_width: 6, mature_height: 24, spacing: 6 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8', '9', '10'] },
    companions: ['corn', 'squash', 'carrot', 'cucumber'],
    antagonists: ['onion', 'garlic', 'pepper'],
    harvest_time: 'Summer',
    planting_time: 'Late Spring'
  },
  {
    id: 'corn',
    name: 'Corn',
    category: 'vegetable',
    icon: '🌽',
    color: '#fbbf24',
    size: { mature_width: 12, mature_height: 72, spacing: 12 },
    requirements: { sun: 'full', water: 'high', soil: 'loamy', zone: ['4', '5', '6', '7', '8', '9'] },
    companions: ['beans', 'squash', 'cucumber', 'peas'],
    antagonists: ['tomato'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Late Spring'
  },

  // Herbs
  {
    id: 'basil',
    name: 'Basil',
    category: 'herb',
    icon: '🌿',
    color: '#16a34a',
    size: { mature_width: 12, mature_height: 18, spacing: 10 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['4', '5', '6', '7', '8', '9', '10'] },
    companions: ['tomato', 'pepper', 'oregano'],
    antagonists: ['rue'],
    harvest_time: 'Summer',
    planting_time: 'Late Spring'
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'herb',
    icon: '🌱',
    color: '#4ade80',
    size: { mature_width: 24, mature_height: 36, spacing: 18 },
    requirements: { sun: 'full', water: 'low', soil: 'sandy', zone: ['7', '8', '9', '10'] },
    companions: ['cabbage', 'beans', 'carrot', 'sage'],
    antagonists: [],
    harvest_time: 'Year-round',
    planting_time: 'Spring'
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'herb',
    icon: '🍃',
    color: '#10b981',
    size: { mature_width: 18, mature_height: 12, spacing: 18 },
    requirements: { sun: 'partial', water: 'high', soil: 'any', zone: ['3', '4', '5', '6', '7', '8', '9'] },
    companions: ['cabbage', 'tomato'],
    antagonists: ['parsley'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Spring'
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'herb',
    icon: '🌾',
    color: '#65a30d',
    size: { mature_width: 12, mature_height: 6, spacing: 8 },
    requirements: { sun: 'full', water: 'low', soil: 'sandy', zone: ['5', '6', '7', '8', '9'] },
    companions: ['cabbage', 'strawberry', 'tomato', 'eggplant'],
    antagonists: [],
    harvest_time: 'Summer',
    planting_time: 'Spring'
  },

  // Fruits
  {
    id: 'strawberry',
    name: 'Strawberry',
    category: 'fruit',
    icon: '🍓',
    color: '#dc2626',
    size: { mature_width: 12, mature_height: 6, spacing: 12 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8'] },
    companions: ['lettuce', 'spinach', 'thyme', 'beans'],
    antagonists: ['cabbage'],
    harvest_time: 'Early Summer',
    planting_time: 'Spring'
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    category: 'shrub',
    icon: '🫐',
    color: '#3b82f6',
    size: { mature_width: 48, mature_height: 72, spacing: 48 },
    requirements: { sun: 'full', water: 'medium', soil: 'sandy', zone: ['3', '4', '5', '6', '7'] },
    companions: ['strawberry', 'rhododendron', 'azalea'],
    antagonists: [],
    harvest_time: 'Summer',
    planting_time: 'Spring or Fall'
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    category: 'shrub',
    icon: '🫐',
    color: '#be185d',
    size: { mature_width: 36, mature_height: 60, spacing: 24 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8'] },
    companions: ['garlic', 'tansy', 'turnip'],
    antagonists: ['blackberry', 'potato'],
    harvest_time: 'Summer',
    planting_time: 'Spring'
  },

  // Trees
  {
    id: 'apple',
    name: 'Apple Tree',
    category: 'tree',
    icon: '🍎',
    color: '#dc2626',
    size: { mature_width: 240, mature_height: 300, spacing: 240 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8'] },
    companions: ['nasturtium', 'chives', 'garlic'],
    antagonists: ['walnut'],
    harvest_time: 'Fall',
    planting_time: 'Spring or Fall'
  },
  {
    id: 'pear',
    name: 'Pear Tree',
    category: 'tree',
    icon: '🍐',
    color: '#84cc16',
    size: { mature_width: 180, mature_height: 240, spacing: 180 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['4', '5', '6', '7', '8'] },
    companions: ['currant', 'apple'],
    antagonists: ['walnut'],
    harvest_time: 'Fall',
    planting_time: 'Spring'
  },
  {
    id: 'cherry',
    name: 'Cherry Tree',
    category: 'tree',
    icon: '🍒',
    color: '#dc2626',
    size: { mature_width: 180, mature_height: 200, spacing: 180 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['5', '6', '7', '8'] },
    companions: ['peach', 'plum'],
    antagonists: ['potato'],
    harvest_time: 'Early Summer',
    planting_time: 'Spring'
  },

  // Flowers
  {
    id: 'marigold',
    name: 'Marigold',
    category: 'flower',
    icon: '🌼',
    color: '#f59e0b',
    size: { mature_width: 8, mature_height: 12, spacing: 8 },
    requirements: { sun: 'full', water: 'low', soil: 'any', zone: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] },
    companions: ['tomato', 'pepper', 'cucumber'],
    antagonists: [],
    harvest_time: 'Summer-Fall',
    planting_time: 'Spring'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    category: 'flower',
    icon: '🌻',
    color: '#fbbf24',
    size: { mature_width: 24, mature_height: 96, spacing: 18 },
    requirements: { sun: 'full', water: 'medium', soil: 'any', zone: ['4', '5', '6', '7', '8', '9'] },
    companions: ['cucumber', 'corn'],
    antagonists: ['potato'],
    harvest_time: 'Fall',
    planting_time: 'Late Spring'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'herb',
    icon: '💜',
    color: '#9333ea',
    size: { mature_width: 24, mature_height: 24, spacing: 18 },
    requirements: { sun: 'full', water: 'low', soil: 'sandy', zone: ['5', '6', '7', '8', '9'] },
    companions: ['rosemary', 'thyme', 'sage'],
    antagonists: [],
    harvest_time: 'Summer',
    planting_time: 'Spring'
  },

  // Groundcovers
  {
    id: 'clover',
    name: 'White Clover',
    category: 'groundcover',
    icon: '☘️',
    color: '#bbf7d0',
    size: { mature_width: 6, mature_height: 4, spacing: 6 },
    requirements: { sun: 'partial', water: 'medium', soil: 'any', zone: ['3', '4', '5', '6', '7', '8', '9'] },
    companions: ['cabbage', 'strawberry'],
    antagonists: [],
    harvest_time: 'N/A',
    planting_time: 'Spring or Fall'
  },

  // Vines
  {
    id: 'grape',
    name: 'Grape Vine',
    category: 'vine',
    icon: '🍇',
    color: '#7c3aed',
    size: { mature_width: 96, mature_height: 72, spacing: 72 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['4', '5', '6', '7', '8', '9'] },
    companions: ['hyssop', 'blackberry', 'clover'],
    antagonists: ['cabbage', 'radish'],
    harvest_time: 'Fall',
    planting_time: 'Spring'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'vine',
    icon: '🥒',
    color: '#22c55e',
    size: { mature_width: 36, mature_height: 12, spacing: 12 },
    requirements: { sun: 'full', water: 'high', soil: 'loamy', zone: ['4', '5', '6', '7', '8', '9', '10'] },
    companions: ['beans', 'peas', 'radish', 'sunflower'],
    antagonists: ['aromatic herbs', 'potato'],
    harvest_time: 'Summer',
    planting_time: 'Late Spring'
  },

  // Additional plants
  {
    id: 'oregano',
    name: 'Oregano',
    category: 'herb',
    icon: '🌿',
    color: '#22c55e',
    size: { mature_width: 18, mature_height: 12, spacing: 12 },
    requirements: { sun: 'full', water: 'low', soil: 'sandy', zone: ['5', '6', '7', '8', '9', '10'] },
    companions: ['tomato', 'pepper', 'basil'],
    antagonists: [],
    harvest_time: 'Summer-Fall',
    planting_time: 'Spring'
  },
  {
    id: 'onion',
    name: 'Onion',
    category: 'vegetable',
    icon: '🧅',
    color: '#f3f4f6',
    size: { mature_width: 4, mature_height: 12, spacing: 4 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8', '9'] },
    companions: ['carrot', 'lettuce', 'tomato', 'cabbage'],
    antagonists: ['beans', 'peas'],
    harvest_time: 'Summer-Fall',
    planting_time: 'Early Spring'
  },
  {
    id: 'radish',
    name: 'Radish',
    category: 'vegetable',
    icon: '🌱',
    color: '#ef4444',
    size: { mature_width: 2, mature_height: 6, spacing: 2 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['2', '3', '4', '5', '6', '7', '8', '9', '10'] },
    companions: ['carrot', 'lettuce', 'peas', 'spinach'],
    antagonists: ['hyssop'],
    harvest_time: 'Spring-Fall',
    planting_time: 'Early Spring'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: 'vegetable',
    icon: '🥬',
    color: '#065f46',
    size: { mature_width: 6, mature_height: 8, spacing: 6 },
    requirements: { sun: 'partial', water: 'medium', soil: 'loamy', zone: ['2', '3', '4', '5', '6', '7', '8', '9'] },
    companions: ['strawberry', 'radish', 'cabbage'],
    antagonists: [],
    harvest_time: 'Spring-Fall',
    planting_time: 'Early Spring or Fall'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'vegetable',
    icon: '🥬',
    color: '#a7f3d0',
    size: { mature_width: 18, mature_height: 12, spacing: 18 },
    requirements: { sun: 'full', water: 'high', soil: 'loamy', zone: ['2', '3', '4', '5', '6', '7', '8', '9'] },
    companions: ['onion', 'mint', 'rosemary', 'thyme'],
    antagonists: ['strawberry', 'tomato', 'beans'],
    harvest_time: 'Fall',
    planting_time: 'Spring or Late Summer'
  },
  {
    id: 'peas',
    name: 'Peas',
    category: 'vegetable',
    icon: '🟢',
    color: '#84cc16',
    size: { mature_width: 6, mature_height: 48, spacing: 4 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['2', '3', '4', '5', '6', '7', '8'] },
    companions: ['carrot', 'cucumber', 'radish', 'corn'],
    antagonists: ['onion', 'garlic'],
    harvest_time: 'Spring-Summer',
    planting_time: 'Early Spring'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'vegetable',
    icon: '🧄',
    color: '#fef3c7',
    size: { mature_width: 4, mature_height: 18, spacing: 4 },
    requirements: { sun: 'full', water: 'medium', soil: 'loamy', zone: ['3', '4', '5', '6', '7', '8', '9'] },
    companions: ['tomato', 'pepper', 'carrot', 'cabbage'],
    antagonists: ['beans', 'peas'],
    harvest_time: 'Summer',
    planting_time: 'Fall'
  }
]

// Helper functions
export function getPlantById(id: string): PlantInfo | undefined {
  return PLANT_LIBRARY.find(plant => plant.id === id)
}

export function getPlantsByCategory(category: PlantInfo['category']): PlantInfo[] {
  return PLANT_LIBRARY.filter(plant => plant.category === category)
}

export function getCompanionPlants(plantId: string): PlantInfo[] {
  const plant = getPlantById(plantId)
  if (!plant) return []
  return plant.companions.map(id => getPlantById(id)).filter(Boolean) as PlantInfo[]
}

export function getAntagonistPlants(plantId: string): PlantInfo[] {
  const plant = getPlantById(plantId)
  if (!plant) return []
  return plant.antagonists.map(id => getPlantById(id)).filter(Boolean) as PlantInfo[]
}

export function checkCompatibility(plant1Id: string, plant2Id: string): 'good' | 'bad' | 'neutral' {
  const plant1 = getPlantById(plant1Id)
  const plant2 = getPlantById(plant2Id)

  if (!plant1 || !plant2) return 'neutral'

  if (plant1.companions.includes(plant2Id) || plant2.companions.includes(plant1Id)) {
    return 'good'
  }

  if (plant1.antagonists.includes(plant2Id) || plant2.antagonists.includes(plant1Id)) {
    return 'bad'
  }

  return 'neutral'
}