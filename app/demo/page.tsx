'use client'

import { PermacultureEditorIntegrated } from '@/components/tldraw/permaculture-editor-integrated'
import { GardenBed } from '@/lib/garden/garden-types'

// Example starter garden layout
const STARTER_GARDEN: GardenBed[] = [
  {
    id: 'herb-bed',
    name: 'Herb Garden',
    points: [
      { x: 100, y: 100 },
      { x: 300, y: 100 },
      { x: 300, y: 200 },
      { x: 100, y: 200 }
    ],
    fill: '#e0f2e0',
    stroke: '#22c55e',
    plants: [
      { id: 'p1', plantId: 'basil', x: 140, y: 140 },
      { id: 'p2', plantId: 'thyme', x: 200, y: 140 },
      { id: 'p3', plantId: 'rosemary', x: 260, y: 140 }
    ]
  },
  {
    id: 'veggie-bed',
    name: 'Vegetable Bed',
    points: [
      { x: 400, y: 100 },
      { x: 600, y: 100 },
      { x: 600, y: 200 },
      { x: 400, y: 200 }
    ],
    fill: '#fef3c7',
    stroke: '#f59e0b',
    plants: [
      { id: 'p4', plantId: 'tomato', x: 450, y: 140 },
      { id: 'p5', plantId: 'lettuce', x: 520, y: 140 },
      { id: 'p6', plantId: 'peppers', x: 580, y: 140 }
    ]
  }
]

export default function DemoPage() {
  return (
    <div className="w-full h-screen">
      <PermacultureEditorIntegrated
        initialData={STARTER_GARDEN}
        showHeader={true}
      />
    </div>
  )
}
