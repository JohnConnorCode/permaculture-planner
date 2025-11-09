import { GardenBed } from '@/lib/garden/garden-types'

/**
 * Template Loader - Converts template designs into GardenBed[] format
 */

export interface TemplateData {
  id: string
  name: string
  beds: GardenBed[]
}

// Keyhole Garden Template
const KEYHOLE_GARDEN: TemplateData = {
  id: 'keyhole-garden',
  name: 'Keyhole Garden',
  beds: [
    {
      id: 'keyhole-bed',
      name: 'Keyhole Garden Bed',
      // Circular shape with keyhole path
      points: [
        { x: 200, y: 200 }, // Circle approximation
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
        // Inner ring - herbs and small plants
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

// Template registry
export const TEMPLATE_REGISTRY: Record<string, TemplateData> = {
  'keyhole-garden': KEYHOLE_GARDEN,
  'three-sisters': THREE_SISTERS,
  'small-urban': SMALL_URBAN,
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
