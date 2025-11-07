import { createShapeId, TLShape } from 'tldraw'
import { GardenBed, PlantedItem } from '@/lib/garden/garden-types'
import { BedShape } from './shapes/bed-shape'
import { PlantShape } from './shapes/plant-shape'

/**
 * DataAdapter converts between legacy GardenBed format and tldraw shapes
 *
 * This adapter ensures backward compatibility with existing garden data
 * while leveraging tldraw's high-performance shape system.
 */
export class DataAdapter {
  /**
   * Convert GardenBed array to tldraw shapes
   *
   * @param beds Array of garden beds from legacy format
   * @returns Array of tldraw shapes (BedShape and PlantShape)
   */
  gardenBedsToShapes(beds: GardenBed[]): TLShape[] {
    const shapes: TLShape[] = []

    for (const bed of beds) {
      // Create bed shape
      const bedShape: BedShape = {
        id: createShapeId(bed.id),
        type: 'bed',
        x: this.getBedX(bed.points),
        y: this.getBedY(bed.points),
        rotation: bed.rotation || 0,
        isLocked: false,
        opacity: 1,
        props: {
          w: bed.width || this.calculateWidth(bed.points),
          h: bed.height || this.calculateHeight(bed.points),
          name: bed.name,
          color: bed.stroke,
          // Serialize points as JSON string for tldraw compatibility
          pointsJson: bed.points && bed.points.length > 2
            ? JSON.stringify(this.normalizePoints(bed.points))
            : '[]',
          elementType: bed.elementType || '',
          elementCategory: bed.elementCategory || 'bed',
          zone: bed.zone ?? -1, // -1 means no zone
        },
        meta: {
          originalFill: bed.fill,
          metadata: bed.metadata,
        },
        parentId: 'page:page' as any,
        index: 'a1' as any,
        typeName: 'shape',
      }

      shapes.push(bedShape)

      // Create plant shapes for plants in this bed
      if (bed.plants && bed.plants.length > 0) {
        for (const plant of bed.plants) {
          const plantShape = this.plantToShape(plant, bed)
          shapes.push(plantShape)
        }
      }
    }

    return shapes
  }

  /**
   * Convert tldraw shapes back to GardenBed array
   *
   * @param shapes Array of tldraw shapes
   * @returns Array of garden beds in legacy format
   */
  shapesToGardenBeds(shapes: TLShape[]): GardenBed[] {
    const beds: GardenBed[] = []

    // Get all bed shapes
    const bedShapes = shapes.filter(s => s.type === 'bed') as BedShape[]
    const plantShapes = shapes.filter(s => s.type === 'plant') as PlantShape[]

    for (const bedShape of bedShapes) {
      // Find plants that belong to this bed (by spatial containment)
      const bedBounds = this.getShapeBounds(bedShape)
      const bedPlants: PlantedItem[] = []

      for (const plantShape of plantShapes) {
        if (this.isPlantInBed(plantShape, bedBounds)) {
          bedPlants.push({
            id: plantShape.id,
            plantId: plantShape.props.plantId,
            x: plantShape.x - bedBounds.x,
            y: plantShape.y - bedBounds.y,
            plantedDate: plantShape.props.plantedDate
              ? new Date(plantShape.props.plantedDate)
              : undefined,
          })
        }
      }

      // Parse points from JSON
      const pointsJson = bedShape.props.pointsJson
      const points = this.parsePoints(pointsJson)

      // Convert back to GardenBed
      const bed: GardenBed = {
        id: bedShape.id,
        name: bedShape.props.name,
        points: points.length > 0 ? points : this.rectToPoints(bedShape.props.w, bedShape.props.h),
        fill: (bedShape.meta as any)?.originalFill || '#e0f2e0',
        stroke: bedShape.props.color,
        plants: bedPlants,
        width: bedShape.props.w,
        height: bedShape.props.h,
        rotation: bedShape.rotation,
        elementType: bedShape.props.elementType || undefined,
        elementCategory: (bedShape.props.elementCategory as any) || undefined,
        zone: bedShape.props.zone >= 0 ? (bedShape.props.zone as any) : undefined,
        metadata: (bedShape.meta as any)?.metadata,
      }

      beds.push(bed)
    }

    return beds
  }

  // ========== Helper Methods ==========

  /**
   * Parse points from JSON string
   */
  private parsePoints(pointsJson: string): { x: number; y: number }[] {
    try {
      const points = JSON.parse(pointsJson)
      return Array.isArray(points) ? points : []
    } catch {
      return []
    }
  }

  /**
   * Convert plant item to tldraw PlantShape
   */
  private plantToShape(plant: PlantedItem, bed: GardenBed): PlantShape {
    return {
      id: createShapeId(plant.id),
      type: 'plant',
      x: this.getBedX(bed.points) + plant.x,
      y: this.getBedY(bed.points) + plant.y,
      rotation: 0,
      isLocked: false,
      opacity: 1,
      props: {
        radius: 20,
        plantId: plant.plantId,
        plantName: this.getPlantName(plant.plantId),
        emoji: this.getPlantEmoji(plant.plantId),
        color: '#22c55e',
        companionsJson: '[]', // TODO: Look up from plant database
        antagonistsJson: '[]', // TODO: Look up from plant database
        spacing: 12,
        plantedDate: plant.plantedDate?.toISOString() || '',
      },
      meta: {},
      parentId: 'page:page' as any,
      index: 'a1' as any,
      typeName: 'shape',
    }
  }

  /**
   * Get the minimum X coordinate from points
   */
  private getBedX(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 0
    return Math.min(...points.map(p => p.x))
  }

  /**
   * Get the minimum Y coordinate from points
   */
  private getBedY(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 0
    return Math.min(...points.map(p => p.y))
  }

  /**
   * Calculate width from points array
   */
  private calculateWidth(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 200
    const xs = points.map(p => p.x)
    return Math.max(...xs) - Math.min(...xs)
  }

  /**
   * Calculate height from points array
   */
  private calculateHeight(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 100
    const ys = points.map(p => p.y)
    return Math.max(...ys) - Math.min(...ys)
  }

  /**
   * Normalize points to be relative to shape's origin (0, 0)
   * This is required for tldraw's coordinate system
   */
  private normalizePoints(points: { x: number; y: number }[]): { x: number; y: number }[] {
    const minX = Math.min(...points.map(p => p.x))
    const minY = Math.min(...points.map(p => p.y))

    return points.map(p => ({
      x: p.x - minX,
      y: p.y - minY,
    }))
  }

  /**
   * Convert rectangle dimensions to points array
   */
  private rectToPoints(w: number, h: number): { x: number; y: number }[] {
    return [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ]
  }

  /**
   * Get bounding box of a bed shape
   */
  private getShapeBounds(shape: BedShape) {
    return {
      x: shape.x,
      y: shape.y,
      width: shape.props.w,
      height: shape.props.h,
    }
  }

  /**
   * Check if plant is spatially within bed bounds
   */
  private isPlantInBed(
    plant: PlantShape,
    bedBounds: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      plant.x >= bedBounds.x &&
      plant.x <= bedBounds.x + bedBounds.width &&
      plant.y >= bedBounds.y &&
      plant.y <= bedBounds.y + bedBounds.height
    )
  }

  /**
   * Get human-readable plant name from ID
   * TODO: Replace with actual plant database lookup
   */
  private getPlantName(plantId: string): string {
    // Capitalize and format plant ID as name
    return plantId
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Get emoji for plant based on ID
   * TODO: Replace with actual plant database lookup
   */
  private getPlantEmoji(plantId: string): string {
    const emojiMap: Record<string, string> = {
      tomato: '🍅',
      carrot: '🥕',
      lettuce: '🥬',
      pepper: '🌶️',
      cucumber: '🥒',
      basil: '🌿',
      mint: '🌿',
      rosemary: '🌿',
      strawberry: '🍓',
      corn: '🌽',
      pumpkin: '🎃',
      bean: '🫘',
      pea: '🫛',
      onion: '🧅',
      garlic: '🧄',
      potato: '🥔',
      eggplant: '🍆',
      broccoli: '🥦',
      cabbage: '🥬',
      spinach: '🥬',
    }

    const lowerPlantId = plantId.toLowerCase()
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerPlantId.includes(key)) {
        return emoji
      }
    }

    return '🌱' // Default plant emoji
  }
}

/**
 * Singleton instance for easy importing
 *
 * Usage:
 * ```ts
 * import { dataAdapter } from '@/components/tldraw/data-adapter'
 *
 * const shapes = dataAdapter.gardenBedsToShapes(myBeds)
 * const beds = dataAdapter.shapesToGardenBeds(myShapes)
 * ```
 */
export const dataAdapter = new DataAdapter()
