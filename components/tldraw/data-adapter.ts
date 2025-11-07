import { createShapeId, TLShape } from 'tldraw'
import { GardenBed, PlantedItem } from '@/lib/garden/garden-types'
import { BedShape } from './shapes/bed-shape'
import { PlantShape } from './shapes/plant-shape'

/**
 * Data adapter to convert between legacy GardenBed format and tldraw shapes
 */
export class DataAdapter {
  /**
   * Convert GardenBed array to tldraw shapes
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
          points: bed.points && bed.points.length > 2 ? this.normalizePoints(bed.points) : undefined,
          elementType: bed.elementType,
          elementCategory: bed.elementCategory,
          zone: bed.zone,
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
            plantedDate: plantShape.props.plantedDate ? new Date(plantShape.props.plantedDate) : undefined,
          })
        }
      }

      // Convert back to GardenBed
      const bed: GardenBed = {
        id: bedShape.id,
        name: bedShape.props.name,
        points: bedShape.props.points || this.rectToPoints(bedShape.props.w, bedShape.props.h),
        fill: (bedShape.meta as any)?.originalFill || '#e0f2e0',
        stroke: bedShape.props.color,
        plants: bedPlants,
        width: bedShape.props.w,
        height: bedShape.props.h,
        rotation: bedShape.rotation,
        elementType: bedShape.props.elementType,
        elementCategory: bedShape.props.elementCategory,
        zone: bedShape.props.zone,
        metadata: (bedShape.meta as any)?.metadata,
      }

      beds.push(bed)
    }

    return beds
  }

  // ========== Helper Methods ==========

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
        plantName: plant.plantId, // TODO: Look up actual plant name
        emoji: this.getPlantEmoji(plant.plantId),
        color: '#22c55e',
        companions: [],
        antagonists: [],
        spacing: 12,
        plantedDate: plant.plantedDate?.toISOString(),
      },
      meta: {},
      parentId: 'page:page' as any,
      index: 'a1' as any,
      typeName: 'shape',
    }
  }

  private getBedX(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 0
    return Math.min(...points.map(p => p.x))
  }

  private getBedY(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 0
    return Math.min(...points.map(p => p.y))
  }

  private calculateWidth(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 200
    const xs = points.map(p => p.x)
    return Math.max(...xs) - Math.min(...xs)
  }

  private calculateHeight(points: { x: number; y: number }[]): number {
    if (!points || points.length === 0) return 100
    const ys = points.map(p => p.y)
    return Math.max(...ys) - Math.min(...ys)
  }

  /**
   * Normalize points to be relative to shape's origin (0, 0)
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
   * Get emoji for plant (placeholder - should lookup from plant database)
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
    }

    const lowerPlantId = plantId.toLowerCase()
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerPlantId.includes(key)) {
        return emoji
      }
    }

    return '🌱' // Default emoji
  }
}

// Export singleton instance
export const dataAdapter = new DataAdapter()
