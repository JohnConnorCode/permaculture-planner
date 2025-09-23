export interface GardenElement {
  id: string
  type: 'bed' | 'zone' | 'water' | 'structure' | 'path' | 'tree' | 'shrub'
  shape: 'rect' | 'circle' | 'polygon' | 'curve' | 'keyhole' | 'spiral'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  points?: Array<{ x: number; y: number }>
  rotation?: number
  fill?: string
  stroke?: string
  opacity?: number
  label?: string
  plants?: string[]
  interactive?: boolean
}

// Realistic garden bed shapes
export const GARDEN_BED_SHAPES = {
  rectangular: {
    shape: 'rect' as const,
    defaultWidth: 120,
    defaultHeight: 40,
    description: 'Standard raised bed - 10ft x 4ft'
  },
  square: {
    shape: 'rect' as const,
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'Square foot garden - 4ft x 4ft'
  },
  keyhole: {
    shape: 'keyhole' as const,
    defaultRadius: 80,
    description: 'Keyhole garden with composting center'
  },
  circular: {
    shape: 'circle' as const,
    defaultRadius: 50,
    description: 'Circular herb spiral or mandala garden'
  },
  hugelkultur: {
    shape: 'polygon' as const,
    description: 'Mounded bed with wood core',
    defaultPoints: [
      { x: 0, y: 40 },
      { x: 30, y: 0 },
      { x: 90, y: 0 },
      { x: 120, y: 40 }
    ]
  },
  contour: {
    shape: 'curve' as const,
    description: 'Follows natural land contours',
    defaultPoints: [
      { x: 0, y: 20 },
      { x: 40, y: 15 },
      { x: 80, y: 25 },
      { x: 120, y: 20 }
    ]
  }
}

// Example realistic garden layout
export const DEMO_GARDEN_LAYOUT: GardenElement[] = [
  // House
  {
    id: 'house',
    type: 'structure',
    shape: 'rect',
    x: 250,
    y: 250,
    width: 100,
    height: 80,
    fill: '#6b7280',
    opacity: 0.9,
    label: 'House'
  },
  // Patio/Zone 0
  {
    id: 'patio',
    type: 'structure',
    shape: 'rect',
    x: 250,
    y: 330,
    width: 100,
    height: 40,
    fill: '#d1d5db',
    opacity: 0.7,
    label: 'Patio'
  },
  // Kitchen garden beds (Zone 1)
  {
    id: 'bed1',
    type: 'bed',
    shape: 'rect',
    x: 150,
    y: 380,
    width: 80,
    height: 30,
    fill: '#86efac',
    stroke: '#16a34a',
    label: 'Herbs',
    plants: ['basil', 'thyme', 'oregano'],
    interactive: true
  },
  {
    id: 'bed2',
    type: 'bed',
    shape: 'rect',
    x: 240,
    y: 380,
    width: 80,
    height: 30,
    fill: '#86efac',
    stroke: '#16a34a',
    label: 'Salads',
    plants: ['lettuce', 'spinach', 'arugula'],
    interactive: true
  },
  {
    id: 'bed3',
    type: 'bed',
    shape: 'rect',
    x: 330,
    y: 380,
    width: 80,
    height: 30,
    fill: '#86efac',
    stroke: '#16a34a',
    label: 'Tomatoes',
    plants: ['tomatoes', 'peppers', 'basil'],
    interactive: true
  },
  // Keyhole garden (Zone 1)
  {
    id: 'keyhole',
    type: 'bed',
    shape: 'polygon',
    x: 120,
    y: 280,
    points: [
      { x: 0, y: 30 },
      { x: 10, y: 10 },
      { x: 30, y: 0 },
      { x: 50, y: 0 },
      { x: 70, y: 10 },
      { x: 80, y: 30 },
      { x: 80, y: 50 },
      { x: 70, y: 70 },
      { x: 50, y: 80 },
      { x: 45, y: 75 },
      { x: 45, y: 45 },
      { x: 35, y: 45 },
      { x: 35, y: 75 },
      { x: 30, y: 80 },
      { x: 10, y: 70 },
      { x: 0, y: 50 }
    ],
    fill: '#bef264',
    stroke: '#65a30d',
    label: 'Keyhole',
    interactive: true
  },
  // Food forest area (Zone 2)
  {
    id: 'food-forest',
    type: 'zone',
    shape: 'polygon',
    x: 420,
    y: 200,
    points: [
      { x: 0, y: 40 },
      { x: 30, y: 0 },
      { x: 80, y: 0 },
      { x: 120, y: 20 },
      { x: 140, y: 60 },
      { x: 120, y: 100 },
      { x: 80, y: 120 },
      { x: 30, y: 120 },
      { x: 0, y: 80 }
    ],
    fill: '#bbf7d0',
    stroke: '#10b981',
    opacity: 0.3,
    label: 'Food Forest'
  },
  // Fruit trees
  {
    id: 'apple-tree',
    type: 'tree',
    shape: 'circle',
    x: 460,
    y: 240,
    radius: 20,
    fill: '#22c55e',
    stroke: '#15803d',
    label: 'Apple',
    interactive: true
  },
  {
    id: 'pear-tree',
    type: 'tree',
    shape: 'circle',
    x: 510,
    y: 260,
    radius: 20,
    fill: '#22c55e',
    stroke: '#15803d',
    label: 'Pear',
    interactive: true
  },
  // Pond
  {
    id: 'pond',
    type: 'water',
    shape: 'polygon',
    x: 380,
    y: 100,
    points: [
      { x: 0, y: 20 },
      { x: 15, y: 5 },
      { x: 35, y: 0 },
      { x: 55, y: 5 },
      { x: 70, y: 20 },
      { x: 65, y: 35 },
      { x: 45, y: 40 },
      { x: 25, y: 40 },
      { x: 5, y: 35 }
    ],
    fill: '#3b82f6',
    opacity: 0.6,
    label: 'Pond'
  },
  // Swale
  {
    id: 'swale',
    type: 'water',
    shape: 'curve',
    x: 100,
    y: 450,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 5 },
      { x: 200, y: 0 },
      { x: 300, y: 5 },
      { x: 400, y: 0 }
    ],
    fill: 'none',
    stroke: '#3b82f6',
    opacity: 0.7,
    label: 'Swale'
  },
  // Compost area
  {
    id: 'compost',
    type: 'structure',
    shape: 'rect',
    x: 150,
    y: 180,
    width: 40,
    height: 40,
    fill: '#92400e',
    opacity: 0.7,
    label: 'Compost',
    interactive: true
  },
  // Greenhouse
  {
    id: 'greenhouse',
    type: 'structure',
    shape: 'polygon',
    x: 350,
    y: 280,
    points: [
      { x: 0, y: 30 },
      { x: 0, y: 0 },
      { x: 20, y: -10 },
      { x: 40, y: 0 },
      { x: 40, y: 30 }
    ],
    fill: '#e0f2fe',
    stroke: '#0284c7',
    opacity: 0.8,
    label: 'Greenhouse'
  },
  // Pathways
  {
    id: 'main-path',
    type: 'path',
    shape: 'polygon',
    x: 290,
    y: 370,
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 20, y: 80 },
      { x: 0, y: 80 }
    ],
    fill: '#fbbf24',
    opacity: 0.4,
    label: ''
  }
]

// Plant placement templates
export const PLANT_PATTERNS = {
  grid: {
    name: 'Grid Pattern',
    description: 'Traditional row planting',
    spacing: 12
  },
  hexagonal: {
    name: 'Hexagonal Pattern',
    description: 'Maximum space efficiency',
    spacing: 10
  },
  polyculture: {
    name: 'Polyculture Mix',
    description: 'Mixed companion planting',
    spacing: 'variable'
  },
  guild: {
    name: 'Guild Cluster',
    description: 'Companion plant grouping',
    spacing: 'variable'
  }
}