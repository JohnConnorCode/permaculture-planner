import { GardenBed } from '@/lib/garden/garden-types'

/**
 * Template Loader - Converts template designs into GardenBed[] format
 */

export interface TemplateMetadata {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  size: string // e.g., "100 sq ft", "500 sq ft"
  climate: string[] // e.g., ["temperate", "hot", "cold"]
  focus: string[] // e.g., ["food production", "pollinator", "water conservation"]
  icon: string
  plants: number
  beds: number
}

export interface TemplateData {
  id: string
  name: string
  beds: GardenBed[]
  metadata: TemplateMetadata
}

// Keyhole Garden Template
const KEYHOLE_GARDEN: TemplateData = {
  id: 'keyhole-garden',
  name: 'Keyhole Garden',
  metadata: {
    id: 'keyhole-garden',
    name: 'Keyhole Garden',
    description: 'A circular raised bed with central compost basket. Perfect for small spaces with maximum productivity. Water-efficient and easy to maintain.',
    difficulty: 'beginner',
    size: '8 ft diameter',
    climate: ['temperate', 'hot', 'cold'],
    focus: ['food production', 'water conservation', 'small space'],
    icon: '🔑',
    plants: 16,
    beds: 2,
  },
  beds: [
    {
      id: 'keyhole-bed',
      name: 'Keyhole Garden Bed',
      // Circular shape with keyhole path
      points: [
        { x: 200, y: 200 },
        { x: 300, y: 180 },
        { x: 380, y: 200 },
        { x: 440, y: 260 },
        { x: 460, y: 340 },
        { x: 440, y: 420 },
        { x: 380, y: 480 },
        { x: 300, y: 500 },
        { x: 220, y: 490 },
        { x: 160, y: 440 },
        { x: 130, y: 360 },
        { x: 140, y: 280 },
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        // Outer ring - tall plants
        { id: 'p1', plantId: 'tomato', x: 200, y: 220 },
        { id: 'p2', plantId: 'tomato', x: 380, y: 220 },
        { id: 'p3', plantId: 'peppers', x: 420, y: 340 },
        { id: 'p4', plantId: 'peppers', x: 380, y: 460 },
        { id: 'p5', plantId: 'tomato', x: 220, y: 460 },
        { id: 'p6', plantId: 'peppers', x: 160, y: 340 },
        // Middle ring - medium plants
        { id: 'p7', plantId: 'kale', x: 250, y: 260 },
        { id: 'p8', plantId: 'chard', x: 340, y: 260 },
        { id: 'p9', plantId: 'kale', x: 380, y: 340 },
        { id: 'p10', plantId: 'chard', x: 340, y: 420 },
        { id: 'p11', plantId: 'kale', x: 250, y: 420 },
        { id: 'p12', plantId: 'chard', x: 200, y: 340 },
        // Inner ring - herbs
        { id: 'p13', plantId: 'basil', x: 280, y: 300 },
        { id: 'p14', plantId: 'parsley', x: 320, y: 300 },
        { id: 'p15', plantId: 'cilantro', x: 320, y: 360 },
        { id: 'p16', plantId: 'basil', x: 280, y: 360 },
      ],
    },
    {
      id: 'compost-basket',
      name: 'Central Compost Basket',
      points: [
        { x: 280, y: 310 },
        { x: 320, y: 310 },
        { x: 320, y: 350 },
        { x: 280, y: 350 },
      ],
      fill: '#92400e',
      stroke: '#78350f',
      plants: [],
    },
  ],
}

// Three Sisters Template
const THREE_SISTERS: TemplateData = {
  id: 'three-sisters',
  name: 'Three Sisters Guild',
  metadata: {
    id: 'three-sisters',
    name: 'Three Sisters Guild',
    description: 'Traditional Native American companion planting: corn, beans, and squash working together. Nitrogen-fixing beans support climbing vines, while squash provides ground cover.',
    difficulty: 'beginner',
    size: '300 sq ft',
    climate: ['temperate', 'hot'],
    focus: ['companion planting', 'traditional methods', 'food production'],
    icon: '🌽',
    plants: 30,
    beds: 3,
  },
  beds: [
    // Mound 1
    {
      id: 'mound-1',
      name: 'Sisters Mound 1',
      points: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p1', plantId: 'corn', x: 150, y: 130 },
        { id: 'p2', plantId: 'corn', x: 170, y: 130 },
        { id: 'p3', plantId: 'corn', x: 150, y: 150 },
        { id: 'p4', plantId: 'corn', x: 170, y: 150 },
        { id: 'p5', plantId: 'beans', x: 140, y: 140 },
        { id: 'p6', plantId: 'beans', x: 180, y: 140 },
        { id: 'p7', plantId: 'beans', x: 140, y: 160 },
        { id: 'p8', plantId: 'beans', x: 180, y: 160 },
        { id: 'p9', plantId: 'squash', x: 120, y: 150 },
        { id: 'p10', plantId: 'squash', x: 180, y: 150 },
      ],
    },
    // Mound 2
    {
      id: 'mound-2',
      name: 'Sisters Mound 2',
      points: [
        { x: 250, y: 100 },
        { x: 350, y: 100 },
        { x: 350, y: 200 },
        { x: 250, y: 200 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p11', plantId: 'corn', x: 300, y: 130 },
        { id: 'p12', plantId: 'corn', x: 320, y: 130 },
        { id: 'p13', plantId: 'corn', x: 300, y: 150 },
        { id: 'p14', plantId: 'corn', x: 320, y: 150 },
        { id: 'p15', plantId: 'beans', x: 290, y: 140 },
        { id: 'p16', plantId: 'beans', x: 330, y: 140 },
        { id: 'p17', plantId: 'beans', x: 290, y: 160 },
        { id: 'p18', plantId: 'beans', x: 330, y: 160 },
        { id: 'p19', plantId: 'squash', x: 270, y: 150 },
        { id: 'p20', plantId: 'squash', x: 330, y: 150 },
      ],
    },
    // Mound 3
    {
      id: 'mound-3',
      name: 'Sisters Mound 3',
      points: [
        { x: 400, y: 100 },
        { x: 500, y: 100 },
        { x: 500, y: 200 },
        { x: 400, y: 200 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p21', plantId: 'corn', x: 450, y: 130 },
        { id: 'p22', plantId: 'corn', x: 470, y: 130 },
        { id: 'p23', plantId: 'corn', x: 450, y: 150 },
        { id: 'p24', plantId: 'corn', x: 470, y: 150 },
        { id: 'p25', plantId: 'beans', x: 440, y: 140 },
        { id: 'p26', plantId: 'beans', x: 480, y: 140 },
        { id: 'p27', plantId: 'beans', x: 440, y: 160 },
        { id: 'p28', plantId: 'beans', x: 480, y: 160 },
        { id: 'p29', plantId: 'squash', x: 420, y: 150 },
        { id: 'p30', plantId: 'squash', x: 480, y: 150 },
      ],
    },
  ],
}

// Small Urban Garden Template
const SMALL_URBAN: TemplateData = {
  id: 'small-urban',
  name: 'Small Urban Garden',
  metadata: {
    id: 'small-urban',
    name: 'Small Urban Garden',
    description: 'Intensive 100 sq ft design maximizing vertical space. Perfect for balconies, patios, or small yards. Focuses on high-yield vegetables and herbs.',
    difficulty: 'beginner',
    size: '100 sq ft',
    climate: ['temperate', 'urban'],
    focus: ['small space', 'intensive', 'vertical growing'],
    icon: '🏡',
    plants: 20,
    beds: 3,
  },
  beds: [
    // Raised bed 1 - Herbs
    {
      id: 'herb-bed',
      name: 'Herb Garden',
      points: [
        { x: 50, y: 50 },
        { x: 250, y: 50 },
        { x: 250, y: 150 },
        { x: 50, y: 150 },
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        { id: 'p1', plantId: 'basil', x: 90, y: 80 },
        { id: 'p2', plantId: 'basil', x: 130, y: 80 },
        { id: 'p3', plantId: 'parsley', x: 170, y: 80 },
        { id: 'p4', plantId: 'cilantro', x: 210, y: 80 },
        { id: 'p5', plantId: 'rosemary', x: 90, y: 120 },
        { id: 'p6', plantId: 'thyme', x: 130, y: 120 },
        { id: 'p7', plantId: 'oregano', x: 170, y: 120 },
        { id: 'p8', plantId: 'chives', x: 210, y: 120 },
      ],
    },
    // Raised bed 2 - Salad greens
    {
      id: 'salad-bed',
      name: 'Salad Greens',
      points: [
        { x: 50, y: 180 },
        { x: 250, y: 180 },
        { x: 250, y: 280 },
        { x: 50, y: 280 },
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        { id: 'p9', plantId: 'lettuce', x: 80, y: 210 },
        { id: 'p10', plantId: 'lettuce', x: 120, y: 210 },
        { id: 'p11', plantId: 'lettuce', x: 160, y: 210 },
        { id: 'p12', plantId: 'lettuce', x: 200, y: 210 },
        { id: 'p13', plantId: 'arugula', x: 80, y: 240 },
        { id: 'p14', plantId: 'arugula', x: 120, y: 240 },
        { id: 'p15', plantId: 'spinach', x: 160, y: 240 },
        { id: 'p16', plantId: 'spinach', x: 200, y: 240 },
      ],
    },
    // Container - Tomatoes (vertical)
    {
      id: 'tomato-container',
      name: 'Cherry Tomatoes',
      points: [
        { x: 300, y: 50 },
        { x: 380, y: 50 },
        { x: 380, y: 280 },
        { x: 300, y: 280 },
      ],
      fill: '#fee2e2',
      stroke: '#dc2626',
      plants: [
        { id: 'p17', plantId: 'tomato', x: 320, y: 100 },
        { id: 'p18', plantId: 'tomato', x: 360, y: 100 },
        { id: 'p19', plantId: 'tomato', x: 320, y: 180 },
        { id: 'p20', plantId: 'tomato', x: 360, y: 180 },
      ],
    },
  ],
}

// Food Forest Template (NEW)
const FOOD_FOREST: TemplateData = {
  id: 'food-forest',
  name: 'Mini Food Forest',
  metadata: {
    id: 'food-forest',
    name: 'Mini Food Forest',
    description: 'Seven-layer food forest design mimicking natural ecosystems. Includes canopy, shrubs, herbs, ground cover, and root vegetables for maximum diversity and resilience.',
    difficulty: 'intermediate',
    size: '500 sq ft',
    climate: ['temperate'],
    focus: ['permaculture', 'biodiversity', 'long-term sustainability'],
    icon: '🌳',
    plants: 25,
    beds: 4,
  },
  beds: [
    // Main forest bed
    {
      id: 'forest-main',
      name: 'Food Forest Main Area',
      points: [
        { x: 100, y: 100 },
        { x: 500, y: 100 },
        { x: 500, y: 400 },
        { x: 100, y: 400 },
      ],
      fill: '#f0fdf4',
      stroke: '#16a34a',
      plants: [
        // Canopy layer (represented by tall plants)
        { id: 'p1', plantId: 'corn', x: 200, y: 150 },
        { id: 'p2', plantId: 'corn', x: 400, y: 150 },
        // Shrub layer
        { id: 'p3', plantId: 'peppers', x: 150, y: 200 },
        { id: 'p4', plantId: 'tomato', x: 300, y: 200 },
        { id: 'p5', plantId: 'peppers', x: 450, y: 200 },
        // Herbaceous layer
        { id: 'p6', plantId: 'kale', x: 180, y: 260 },
        { id: 'p7', plantId: 'chard', x: 250, y: 260 },
        { id: 'p8', plantId: 'kale', x: 350, y: 260 },
        { id: 'p9', plantId: 'chard', x: 420, y: 260 },
        // Ground cover layer
        { id: 'p10', plantId: 'squash', x: 140, y: 320 },
        { id: 'p11', plantId: 'squash', x: 280, y: 320 },
        { id: 'p12', plantId: 'squash', x: 420, y: 320 },
        // Herb/aromatic layer
        { id: 'p13', plantId: 'basil', x: 160, y: 230 },
        { id: 'p14', plantId: 'thyme', x: 220, y: 230 },
        { id: 'p15', plantId: 'rosemary', x: 280, y: 230 },
        { id: 'p16', plantId: 'oregano', x: 340, y: 230 },
        { id: 'p17', plantId: 'parsley', x: 400, y: 230 },
      ],
    },
    // Nitrogen fixers bed
    {
      id: 'nitrogen-bed',
      name: 'Nitrogen Fixers',
      points: [
        { x: 520, y: 100 },
        { x: 650, y: 100 },
        { x: 650, y: 250 },
        { x: 520, y: 250 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p18', plantId: 'beans', x: 560, y: 140 },
        { id: 'p19', plantId: 'beans', x: 610, y: 140 },
        { id: 'p20', plantId: 'beans', x: 560, y: 190 },
        { id: 'p21', plantId: 'beans', x: 610, y: 190 },
      ],
    },
    // Pollinator attractor bed
    {
      id: 'pollinator-bed',
      name: 'Pollinator Attractors',
      points: [
        { x: 520, y: 270 },
        { x: 650, y: 270 },
        { x: 650, y: 400 },
        { x: 520, y: 400 },
      ],
      fill: '#fce7f3',
      stroke: '#ec4899',
      plants: [
        { id: 'p22', plantId: 'basil', x: 560, y: 310 },
        { id: 'p23', plantId: 'cilantro', x: 610, y: 310 },
        { id: 'p24', plantId: 'chives', x: 560, y: 350 },
        { id: 'p25', plantId: 'parsley', x: 610, y: 350 },
      ],
    },
  ],
}

// Pollinator Paradise Template (NEW)
const POLLINATOR_PARADISE: TemplateData = {
  id: 'pollinator-paradise',
  name: 'Pollinator Paradise',
  metadata: {
    id: 'pollinator-paradise',
    name: 'Pollinator Paradise',
    description: 'Bee and butterfly-friendly garden with continuous blooms. Supports local pollinators while providing herbs and edible flowers. Great for ecological balance.',
    difficulty: 'beginner',
    size: '200 sq ft',
    climate: ['temperate', 'hot'],
    focus: ['pollinators', 'biodiversity', 'ecological'],
    icon: '🦋',
    plants: 24,
    beds: 3,
  },
  beds: [
    // Early season bloomers
    {
      id: 'early-bloom',
      name: 'Spring Bloomers',
      points: [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 300, y: 220 },
        { x: 100, y: 220 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p1', plantId: 'chives', x: 140, y: 140 },
        { id: 'p2', plantId: 'chives', x: 200, y: 140 },
        { id: 'p3', plantId: 'chives', x: 260, y: 140 },
        { id: 'p4', plantId: 'arugula', x: 140, y: 180 },
        { id: 'p5', plantId: 'arugula', x: 200, y: 180 },
        { id: 'p6', plantId: 'arugula', x: 260, y: 180 },
      ],
    },
    // Mid-season herbs
    {
      id: 'mid-bloom',
      name: 'Summer Herbs',
      points: [
        { x: 320, y: 100 },
        { x: 520, y: 100 },
        { x: 520, y: 220 },
        { x: 320, y: 220 },
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        { id: 'p7', plantId: 'basil', x: 360, y: 130 },
        { id: 'p8', plantId: 'basil', x: 420, y: 130 },
        { id: 'p9', plantId: 'basil', x: 480, y: 130 },
        { id: 'p10', plantId: 'cilantro', x: 360, y: 170 },
        { id: 'p11', plantId: 'cilantro', x: 420, y: 170 },
        { id: 'p12', plantId: 'cilantro', x: 480, y: 170 },
        { id: 'p13', plantId: 'parsley', x: 360, y: 200 },
        { id: 'p14', plantId: 'parsley', x: 420, y: 200 },
        { id: 'p15', plantId: 'parsley', x: 480, y: 200 },
      ],
    },
    // Late season perennials
    {
      id: 'late-bloom',
      name: 'Fall Perennials',
      points: [
        { x: 100, y: 240 },
        { x: 520, y: 240 },
        { x: 520, y: 360 },
        { x: 100, y: 360 },
      ],
      fill: '#fce7f3',
      stroke: '#ec4899',
      plants: [
        { id: 'p16', plantId: 'rosemary', x: 150, y: 280 },
        { id: 'p17', plantId: 'thyme', x: 220, y: 280 },
        { id: 'p18', plantId: 'oregano', x: 290, y: 280 },
        { id: 'p19', plantId: 'rosemary', x: 360, y: 280 },
        { id: 'p20', plantId: 'thyme', x: 430, y: 280 },
        { id: 'p21', plantId: 'oregano', x: 150, y: 320 },
        { id: 'p22', plantId: 'chives', x: 290, y: 320 },
        { id: 'p23', plantId: 'parsley', x: 430, y: 320 },
        { id: 'p24', plantId: 'basil', x: 290, y: 340 },
      ],
    },
  ],
}

// Hot Climate Garden Template (NEW)
const HOT_CLIMATE: TemplateData = {
  id: 'hot-climate',
  name: 'Hot Climate Garden',
  metadata: {
    id: 'hot-climate',
    name: 'Hot Climate Garden',
    description: 'Drought-tolerant design for hot, arid climates. Features heat-loving plants, water-conserving layout, and shade strategies. Minimal water requirements.',
    difficulty: 'intermediate',
    size: '250 sq ft',
    climate: ['hot', 'arid', 'mediterranean'],
    focus: ['water conservation', 'heat-tolerant', 'drought-resistant'],
    icon: '🌵',
    plants: 22,
    beds: 4,
  },
  beds: [
    // Heat-lovers bed
    {
      id: 'heat-bed',
      name: 'Heat-Loving Vegetables',
      points: [
        { x: 100, y: 100 },
        { x: 350, y: 100 },
        { x: 350, y: 250 },
        { x: 100, y: 250 },
      ],
      fill: '#fee2e2',
      stroke: '#dc2626',
      plants: [
        { id: 'p1', plantId: 'tomato', x: 140, y: 140 },
        { id: 'p2', plantId: 'tomato', x: 220, y: 140 },
        { id: 'p3', plantId: 'tomato', x: 300, y: 140 },
        { id: 'p4', plantId: 'peppers', x: 140, y: 190 },
        { id: 'p5', plantId: 'peppers', x: 220, y: 190 },
        { id: 'p6', plantId: 'peppers', x: 300, y: 190 },
      ],
    },
    // Drought-tolerant herbs
    {
      id: 'drought-herbs',
      name: 'Mediterranean Herbs',
      points: [
        { x: 370, y: 100 },
        { x: 550, y: 100 },
        { x: 550, y: 250 },
        { x: 370, y: 250 },
      ],
      fill: '#e0f2e0',
      stroke: '#22c55e',
      plants: [
        { id: 'p7', plantId: 'rosemary', x: 410, y: 130 },
        { id: 'p8', plantId: 'rosemary', x: 480, y: 130 },
        { id: 'p9', plantId: 'thyme', x: 410, y: 175 },
        { id: 'p10', plantId: 'thyme', x: 480, y: 175 },
        { id: 'p11', plantId: 'oregano', x: 410, y: 220 },
        { id: 'p12', plantId: 'oregano', x: 480, y: 220 },
      ],
    },
    // Squash ground cover (living mulch)
    {
      id: 'ground-cover',
      name: 'Living Mulch',
      points: [
        { x: 100, y: 270 },
        { x: 350, y: 270 },
        { x: 350, y: 400 },
        { x: 100, y: 400 },
      ],
      fill: '#fef3c7',
      stroke: '#f59e0b',
      plants: [
        { id: 'p13', plantId: 'squash', x: 150, y: 310 },
        { id: 'p14', plantId: 'squash', x: 250, y: 310 },
        { id: 'p15', plantId: 'squash', x: 150, y: 360 },
        { id: 'p16', plantId: 'squash', x: 250, y: 360 },
      ],
    },
    // Shade-providing bed
    {
      id: 'shade-bed',
      name: 'Shade Crops',
      points: [
        { x: 370, y: 270 },
        { x: 550, y: 270 },
        { x: 550, y: 400 },
        { x: 370, y: 400 },
      ],
      fill: '#dbeafe',
      stroke: '#3b82f6',
      plants: [
        { id: 'p17', plantId: 'lettuce', x: 410, y: 300 },
        { id: 'p18', plantId: 'lettuce', x: 480, y: 300 },
        { id: 'p19', plantId: 'spinach', x: 410, y: 340 },
        { id: 'p20', plantId: 'spinach', x: 480, y: 340 },
        { id: 'p21', plantId: 'arugula', x: 410, y: 380 },
        { id: 'p22', plantId: 'arugula', x: 480, y: 380 },
      ],
    },
  ],
}

// Template registry
export const TEMPLATE_REGISTRY: Record<string, TemplateData> = {
  'keyhole-garden': KEYHOLE_GARDEN,
  'three-sisters': THREE_SISTERS,
  'small-urban': SMALL_URBAN,
  'food-forest': FOOD_FOREST,
  'pollinator-paradise': POLLINATOR_PARADISE,
  'hot-climate': HOT_CLIMATE,
}

// Template categories for better organization
export const TEMPLATE_CATEGORIES = {
  beginner: {
    name: 'Beginner Friendly',
    templates: ['keyhole-garden', 'three-sisters', 'small-urban', 'pollinator-paradise'],
  },
  productive: {
    name: 'Maximum Food Production',
    templates: ['keyhole-garden', 'small-urban', 'food-forest'],
  },
  ecological: {
    name: 'Ecological & Sustainable',
    templates: ['food-forest', 'pollinator-paradise', 'three-sisters'],
  },
  climate: {
    name: 'Climate-Specific',
    templates: ['hot-climate'],
  },
}

/**
 * Load a template by ID
 */
export function loadTemplate(templateId: string): GardenBed[] | null {
  const template = TEMPLATE_REGISTRY[templateId]
  if (!template) {
    console.error(`Template ${templateId} not found`)
    return null
  }

  return template.beds
}

/**
 * Get all available template IDs
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_REGISTRY)
}

/**
 * Get all templates with metadata
 */
export function getAllTemplates(): TemplateData[] {
  return Object.values(TEMPLATE_REGISTRY)
}

/**
 * Get template metadata without bed data
 */
export function getTemplateMetadata(templateId: string): TemplateMetadata | null {
  const template = TEMPLATE_REGISTRY[templateId]
  return template ? template.metadata : null
}

/**
 * Filter templates by criteria
 */
export function filterTemplates(filters: {
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  climate?: string
  focus?: string
  maxSize?: number
}): TemplateData[] {
  return getAllTemplates().filter(template => {
    if (filters.difficulty && template.metadata.difficulty !== filters.difficulty) {
      return false
    }
    if (filters.climate && !template.metadata.climate.includes(filters.climate)) {
      return false
    }
    if (filters.focus && !template.metadata.focus.some(f => f.includes(filters.focus!))) {
      return false
    }
    return true
  })
}
