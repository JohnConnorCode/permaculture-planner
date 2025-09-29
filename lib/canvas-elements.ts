// Canvas element types that extend beyond just garden beds

export type ElementCategory =
  | 'bed'
  | 'water_management'
  | 'structure'
  | 'access'
  | 'energy'
  | 'animal'
  | 'waste'

export type ElementSubtype =
  // Beds
  | 'raised_bed' | 'in_ground' | 'container' | 'hugelkultur' | 'keyhole'
  // Water
  | 'water_tank' | 'pond' | 'swale' | 'rain_garden' | 'greywater'
  // Structures
  | 'greenhouse' | 'shed' | 'trellis' | 'arbor' | 'pergola' | 'cold_frame'
  // Access
  | 'path' | 'fence' | 'gate' | 'stairs' | 'ramp'
  // Energy
  | 'solar_panel' | 'wind_turbine' | 'battery'
  // Animals
  | 'chicken_coop' | 'beehive' | 'rabbit_hutch' | 'duck_pond'
  // Waste
  | 'compost_bin' | 'worm_farm' | 'biodigester'

export interface CanvasElement {
  id: string
  category: ElementCategory
  subtype: ElementSubtype
  name: string
  points: { x: number; y: number }[]
  fill: string
  stroke: string
  strokeWidth?: number
  rotation?: number
  zone?: 0 | 1 | 2 | 3 | 4 | 5
  width?: number
  height?: number
  radius?: number
  // Element-specific properties
  capacity?: number // For water tanks, compost bins, etc.
  material?: string // For structures
  flowDirection?: 'north' | 'south' | 'east' | 'west' // For swales, paths
  connected?: string[] // IDs of connected elements
  metadata?: Record<string, any>
  icon?: string // Icon name for visual representation
  pattern?: string // Fill pattern for different materials
}

// Visual properties for each element type
export const ELEMENT_STYLES: Record<ElementSubtype, {
  defaultFill: string
  defaultStroke: string
  defaultStrokeWidth: number
  defaultShape: 'rect' | 'circle' | 'polygon' | 'path' | 'custom'
  icon?: string
  pattern?: string
  minWidth?: number
  minHeight?: number
  aspectRatio?: number
}> = {
  // Beds
  raised_bed: {
    defaultFill: '#d4f4dd',
    defaultStroke: '#22c55e',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    minWidth: 40,
    minHeight: 40
  },
  in_ground: {
    defaultFill: '#f3f4f6',
    defaultStroke: '#6b7280',
    defaultStrokeWidth: 1,
    defaultShape: 'rect',
    pattern: 'soil'
  },
  container: {
    defaultFill: '#fef3c7',
    defaultStroke: '#92400e',
    defaultStrokeWidth: 3,
    defaultShape: 'circle'
  },
  hugelkultur: {
    defaultFill: '#dc2626',
    defaultStroke: '#7c2d12',
    defaultStrokeWidth: 2,
    defaultShape: 'custom',
    pattern: 'wood'
  },
  keyhole: {
    defaultFill: '#e0e7ff',
    defaultStroke: '#4338ca',
    defaultStrokeWidth: 2,
    defaultShape: 'custom'
  },

  // Water Management
  water_tank: {
    defaultFill: '#dbeafe',
    defaultStroke: '#1e40af',
    defaultStrokeWidth: 3,
    defaultShape: 'circle',
    icon: 'droplet',
    minWidth: 30,
    minHeight: 30
  },
  pond: {
    defaultFill: '#93c5fd',
    defaultStroke: '#2563eb',
    defaultStrokeWidth: 2,
    defaultShape: 'custom',
    pattern: 'water'
  },
  swale: {
    defaultFill: '#bfdbfe',
    defaultStroke: '#3b82f6',
    defaultStrokeWidth: 1,
    defaultShape: 'path',
    pattern: 'swale'
  },
  rain_garden: {
    defaultFill: '#a5f3fc',
    defaultStroke: '#0891b2',
    defaultStrokeWidth: 2,
    defaultShape: 'custom',
    pattern: 'rocks'
  },
  greywater: {
    defaultFill: '#e0e7ff',
    defaultStroke: '#6366f1',
    defaultStrokeWidth: 2,
    defaultShape: 'path',
    icon: 'filter'
  },

  // Structures
  greenhouse: {
    defaultFill: '#f0fdf4',
    defaultStroke: '#16a34a',
    defaultStrokeWidth: 3,
    defaultShape: 'rect',
    icon: 'greenhouse',
    minWidth: 60,
    minHeight: 80,
    aspectRatio: 0.75
  },
  shed: {
    defaultFill: '#fef3c7',
    defaultStroke: '#a16207',
    defaultStrokeWidth: 3,
    defaultShape: 'rect',
    icon: 'home',
    minWidth: 50,
    minHeight: 50
  },
  trellis: {
    defaultFill: 'none',
    defaultStroke: '#92400e',
    defaultStrokeWidth: 2,
    defaultShape: 'path',
    pattern: 'grid',
    minWidth: 10,
    minHeight: 60
  },
  arbor: {
    defaultFill: 'none',
    defaultStroke: '#7c2d12',
    defaultStrokeWidth: 3,
    defaultShape: 'custom',
    icon: 'arch'
  },
  pergola: {
    defaultFill: 'none',
    defaultStroke: '#78716c',
    defaultStrokeWidth: 4,
    defaultShape: 'rect',
    pattern: 'beams'
  },
  cold_frame: {
    defaultFill: '#f0f9ff',
    defaultStroke: '#0284c7',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    icon: 'box'
  },

  // Access
  path: {
    defaultFill: '#fbbf24',
    defaultStroke: '#b45309',
    defaultStrokeWidth: 1,
    defaultShape: 'path',
    pattern: 'gravel',
    minWidth: 20
  },
  fence: {
    defaultFill: 'none',
    defaultStroke: '#525252',
    defaultStrokeWidth: 2,
    defaultShape: 'path',
    pattern: 'fence'
  },
  gate: {
    defaultFill: '#f3f4f6',
    defaultStroke: '#374151',
    defaultStrokeWidth: 3,
    defaultShape: 'rect',
    icon: 'door',
    minWidth: 30,
    minHeight: 10
  },
  stairs: {
    defaultFill: '#e5e7eb',
    defaultStroke: '#4b5563',
    defaultStrokeWidth: 2,
    defaultShape: 'custom',
    pattern: 'steps'
  },
  ramp: {
    defaultFill: '#f9fafb',
    defaultStroke: '#6b7280',
    defaultStrokeWidth: 2,
    defaultShape: 'polygon'
  },

  // Energy
  solar_panel: {
    defaultFill: '#1e293b',
    defaultStroke: '#0f172a',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    pattern: 'solar',
    aspectRatio: 1.5
  },
  wind_turbine: {
    defaultFill: '#f1f5f9',
    defaultStroke: '#475569',
    defaultStrokeWidth: 3,
    defaultShape: 'custom',
    icon: 'wind'
  },
  battery: {
    defaultFill: '#84cc16',
    defaultStroke: '#365314',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    icon: 'battery'
  },

  // Animals
  chicken_coop: {
    defaultFill: '#fed7aa',
    defaultStroke: '#c2410c',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    icon: 'egg',
    minWidth: 40,
    minHeight: 40
  },
  beehive: {
    defaultFill: '#fde047',
    defaultStroke: '#a16207',
    defaultStrokeWidth: 2,
    defaultShape: 'hexagon',
    icon: 'hexagon',
    minWidth: 20,
    minHeight: 20
  },
  rabbit_hutch: {
    defaultFill: '#fce7f3',
    defaultStroke: '#be185d',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    icon: 'rabbit'
  },
  duck_pond: {
    defaultFill: '#bfdbfe',
    defaultStroke: '#1d4ed8',
    defaultStrokeWidth: 2,
    defaultShape: 'circle',
    pattern: 'water'
  },

  // Waste
  compost_bin: {
    defaultFill: '#a3a3a3',
    defaultStroke: '#404040',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    icon: 'recycle',
    minWidth: 30,
    minHeight: 30
  },
  worm_farm: {
    defaultFill: '#ea580c',
    defaultStroke: '#7c2d12',
    defaultStrokeWidth: 2,
    defaultShape: 'rect',
    pattern: 'layers'
  },
  biodigester: {
    defaultFill: '#65a30d',
    defaultStroke: '#365314',
    defaultStrokeWidth: 3,
    defaultShape: 'circle',
    icon: 'zap'
  }
}

// Helper to create element shapes based on type
export function createElementShape(
  subtype: ElementSubtype,
  centerX: number,
  centerY: number,
  width?: number,
  height?: number
): { x: number; y: number }[] {
  const style = ELEMENT_STYLES[subtype]
  const w = width || style.minWidth || 50
  const h = height || style.minHeight || 50

  switch (style.defaultShape) {
    case 'rect':
      return [
        { x: centerX - w/2, y: centerY - h/2 },
        { x: centerX + w/2, y: centerY - h/2 },
        { x: centerX + w/2, y: centerY + h/2 },
        { x: centerX - w/2, y: centerY + h/2 }
      ]

    case 'circle':
      // Create octagon for circle approximation
      const r = Math.min(w, h) / 2
      return Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 8
        return {
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle)
        }
      })

    case 'hexagon':
      const hr = Math.min(w, h) / 2
      return Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 6
        return {
          x: centerX + hr * Math.cos(angle),
          y: centerY + hr * Math.sin(angle)
        }
      })

    case 'path':
      // Simple line/path shape
      return [
        { x: centerX - w/2, y: centerY },
        { x: centerX + w/2, y: centerY }
      ]

    case 'custom':
      // Custom shapes for specific elements
      switch (subtype) {
        case 'keyhole':
          // Keyhole garden shape
          return [
            { x: centerX - w/2, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY + h/2 },
            { x: centerX + w/4, y: centerY + h/2 },
            { x: centerX + w/4, y: centerY },
            { x: centerX - w/4, y: centerY },
            { x: centerX - w/4, y: centerY + h/2 },
            { x: centerX - w/2, y: centerY + h/2 }
          ]

        case 'hugelkultur':
          // Mound shape
          return [
            { x: centerX - w/2, y: centerY + h/2 },
            { x: centerX - w/3, y: centerY - h/2 },
            { x: centerX + w/3, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY + h/2 }
          ]

        case 'arbor':
          // Arch shape
          return [
            { x: centerX - w/2, y: centerY + h/2 },
            { x: centerX - w/2, y: centerY - h/3 },
            { x: centerX - w/3, y: centerY - h/2 },
            { x: centerX + w/3, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY - h/3 },
            { x: centerX + w/2, y: centerY + h/2 }
          ]

        default:
          // Fallback to rectangle
          return [
            { x: centerX - w/2, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY - h/2 },
            { x: centerX + w/2, y: centerY + h/2 },
            { x: centerX - w/2, y: centerY + h/2 }
          ]
      }

    default:
      // Default rectangle
      return [
        { x: centerX - w/2, y: centerY - h/2 },
        { x: centerX + w/2, y: centerY - h/2 },
        { x: centerX + w/2, y: centerY + h/2 },
        { x: centerX - w/2, y: centerY + h/2 }
      ]
  }
}

// Convert old GardenBed to CanvasElement
export function bedToElement(bed: any): CanvasElement {
  return {
    id: bed.id,
    category: 'bed',
    subtype: 'raised_bed',
    name: bed.name || 'Garden Bed',
    points: bed.points,
    fill: bed.fill,
    stroke: bed.stroke,
    strokeWidth: 2,
    rotation: bed.rotation || 0,
    width: bed.width,
    height: bed.height,
    metadata: {
      plants: bed.plants || []
    }
  }
}