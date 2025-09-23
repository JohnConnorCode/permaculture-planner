import { GardenBed } from '@/components/garden-designer-canvas'

export interface GardenTemplate {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  size: string
  beds: GardenBed[]
}

export const GARDEN_TEMPLATES: GardenTemplate[] = [
  {
    id: 'starter-veggie',
    name: 'Beginner Vegetable Garden',
    description: 'Easy-to-grow vegetables perfect for first-time gardeners',
    icon: '🥬',
    difficulty: 'beginner',
    size: '4x8 ft',
    beds: [
      {
        id: 'veggie-bed-1',
        name: 'Easy Vegetables',
        points: [
          { x: 100, y: 200 },
          { x: 300, y: 200 },
          { x: 300, y: 300 },
          { x: 100, y: 300 }
        ],
        fill: '#e0f2e0',
        stroke: '#22c55e',
        plants: [
          { id: 'p1', plantId: 'tomato', x: 150, y: 250 },
          { id: 'p2', plantId: 'lettuce', x: 200, y: 230 },
          { id: 'p3', plantId: 'lettuce', x: 200, y: 270 },
          { id: 'p4', plantId: 'basil', x: 250, y: 250 }
        ]
      }
    ]
  },
  {
    id: 'herb-spiral',
    name: 'Herb Spiral Garden',
    description: 'Compact spiral design maximizing space for herbs',
    icon: '🌿',
    difficulty: 'intermediate',
    size: '6x6 ft',
    beds: [
      {
        id: 'herb-spiral',
        name: 'Herb Spiral',
        points: [
          { x: 250, y: 200 },
          { x: 300, y: 210 },
          { x: 330, y: 250 },
          { x: 320, y: 300 },
          { x: 270, y: 330 },
          { x: 220, y: 320 },
          { x: 190, y: 280 },
          { x: 200, y: 230 }
        ],
        fill: '#f0fdf4',
        stroke: '#16a34a',
        plants: [
          { id: 'h1', plantId: 'rosemary', x: 250, y: 250 },
          { id: 'h2', plantId: 'thyme', x: 280, y: 230 },
          { id: 'h3', plantId: 'basil', x: 270, y: 280 },
          { id: 'h4', plantId: 'mint', x: 220, y: 260 },
          { id: 'h5', plantId: 'lavender', x: 300, y: 270 }
        ]
      }
    ]
  },
  {
    id: 'three-sisters',
    name: 'Three Sisters Garden',
    description: 'Traditional Native American companion planting',
    icon: '🌽',
    difficulty: 'beginner',
    size: '10x10 ft',
    beds: [
      {
        id: 'three-sisters-main',
        name: 'Three Sisters Mound',
        points: [
          { x: 200, y: 250 },
          { x: 250, y: 220 },
          { x: 300, y: 220 },
          { x: 350, y: 250 },
          { x: 350, y: 320 },
          { x: 300, y: 350 },
          { x: 250, y: 350 },
          { x: 200, y: 320 }
        ],
        fill: '#fff4e0',
        stroke: '#f59e0b',
        plants: [
          { id: 'ts1', plantId: 'corn', x: 275, y: 285 },
          { id: 'ts2', plantId: 'corn', x: 250, y: 260 },
          { id: 'ts3', plantId: 'corn', x: 300, y: 260 },
          { id: 'ts4', plantId: 'beans', x: 260, y: 285 },
          { id: 'ts5', plantId: 'beans', x: 290, y: 285 },
          { id: 'ts6', plantId: 'squash', x: 275, y: 320 },
          { id: 'ts7', plantId: 'squash', x: 230, y: 290 },
          { id: 'ts8', plantId: 'squash', x: 320, y: 290 }
        ]
      }
    ]
  },
  {
    id: 'salad-garden',
    name: 'Salad Garden',
    description: 'Fresh greens and vegetables for daily salads',
    icon: '🥗',
    difficulty: 'beginner',
    size: '4x6 ft',
    beds: [
      {
        id: 'salad-bed',
        name: 'Salad Greens',
        points: [
          { x: 150, y: 150 },
          { x: 350, y: 150 },
          { x: 350, y: 250 },
          { x: 150, y: 250 }
        ],
        fill: '#e0f2e0',
        stroke: '#22c55e',
        plants: [
          { id: 's1', plantId: 'lettuce', x: 180, y: 180 },
          { id: 's2', plantId: 'lettuce', x: 220, y: 180 },
          { id: 's3', plantId: 'lettuce', x: 260, y: 180 },
          { id: 's4', plantId: 'lettuce', x: 300, y: 180 },
          { id: 's5', plantId: 'carrot', x: 180, y: 220 },
          { id: 's6', plantId: 'carrot', x: 200, y: 220 },
          { id: 's7', plantId: 'carrot', x: 220, y: 220 },
          { id: 's8', plantId: 'cucumber', x: 300, y: 220 }
        ]
      }
    ]
  },
  {
    id: 'pizza-garden',
    name: 'Pizza Garden',
    description: 'Grow all the toppings for homemade pizza',
    icon: '🍕',
    difficulty: 'intermediate',
    size: '8x8 ft',
    beds: [
      {
        id: 'pizza-circle',
        name: 'Pizza Garden',
        points: Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 8
          return {
            x: 275 + Math.cos(angle) * 100,
            y: 275 + Math.sin(angle) * 100
          }
        }),
        fill: '#fef3c7',
        stroke: '#f59e0b',
        plants: [
          { id: 'pz1', plantId: 'tomato', x: 275, y: 275 },
          { id: 'pz2', plantId: 'pepper', x: 325, y: 250 },
          { id: 'pz3', plantId: 'basil', x: 225, y: 250 },
          { id: 'pz4', plantId: 'oregano', x: 300, y: 300 },
          { id: 'pz5', plantId: 'onion', x: 250, y: 300 }
        ]
      }
    ]
  },
  {
    id: 'pollinator',
    name: 'Pollinator Paradise',
    description: 'Attract bees and butterflies with these flowers',
    icon: '🦋',
    difficulty: 'beginner',
    size: '6x8 ft',
    beds: [
      {
        id: 'pollinator-bed',
        name: 'Pollinator Garden',
        points: [
          { x: 150, y: 200 },
          { x: 200, y: 180 },
          { x: 300, y: 180 },
          { x: 350, y: 200 },
          { x: 350, y: 300 },
          { x: 300, y: 320 },
          { x: 200, y: 320 },
          { x: 150, y: 300 }
        ],
        fill: '#fce7f3',
        stroke: '#ec4899',
        plants: [
          { id: 'pl1', plantId: 'sunflower', x: 250, y: 250 },
          { id: 'pl2', plantId: 'marigold', x: 200, y: 220 },
          { id: 'pl3', plantId: 'marigold', x: 300, y: 220 },
          { id: 'pl4', plantId: 'lavender', x: 220, y: 280 },
          { id: 'pl5', plantId: 'lavender', x: 280, y: 280 }
        ]
      }
    ]
  },
  {
    id: 'tea-garden',
    name: 'Tea Garden',
    description: 'Grow your own herbs for herbal teas',
    icon: '🍵',
    difficulty: 'intermediate',
    size: '5x5 ft',
    beds: [
      {
        id: 'tea-bed',
        name: 'Tea Herbs',
        points: [
          { x: 200, y: 200 },
          { x: 350, y: 200 },
          { x: 350, y: 350 },
          { x: 200, y: 350 }
        ],
        fill: '#ecfdf5',
        stroke: '#10b981',
        plants: [
          { id: 't1', plantId: 'mint', x: 250, y: 250 },
          { id: 't2', plantId: 'lavender', x: 300, y: 250 },
          { id: 't3', plantId: 'thyme', x: 250, y: 300 },
          { id: 't4', plantId: 'rosemary', x: 300, y: 300 }
        ]
      }
    ]
  },
  {
    id: 'berry-patch',
    name: 'Berry Patch',
    description: 'Small fruits for fresh eating and preserves',
    icon: '🫐',
    difficulty: 'advanced',
    size: '10x12 ft',
    beds: [
      {
        id: 'berry-bed-1',
        name: 'Berry Row 1',
        points: [
          { x: 100, y: 150 },
          { x: 200, y: 150 },
          { x: 200, y: 400 },
          { x: 100, y: 400 }
        ],
        fill: '#f3e8ff',
        stroke: '#9333ea',
        plants: [
          { id: 'b1', plantId: 'blueberry', x: 150, y: 200 },
          { id: 'b2', plantId: 'blueberry', x: 150, y: 280 },
          { id: 'b3', plantId: 'blueberry', x: 150, y: 360 }
        ]
      },
      {
        id: 'berry-bed-2',
        name: 'Berry Row 2',
        points: [
          { x: 250, y: 150 },
          { x: 350, y: 150 },
          { x: 350, y: 400 },
          { x: 250, y: 400 }
        ],
        fill: '#ffe4e6',
        stroke: '#be185d',
        plants: [
          { id: 'r1', plantId: 'raspberry', x: 300, y: 200 },
          { id: 'r2', plantId: 'raspberry', x: 300, y: 260 },
          { id: 'r3', plantId: 'raspberry', x: 300, y: 320 },
          { id: 'r4', plantId: 'strawberry', x: 300, y: 380 }
        ]
      }
    ]
  }
]

export function getTemplateById(id: string): GardenTemplate | undefined {
  return GARDEN_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByDifficulty(difficulty: GardenTemplate['difficulty']): GardenTemplate[] {
  return GARDEN_TEMPLATES.filter(template => template.difficulty === difficulty)
}