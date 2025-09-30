import { Database } from '@/types/database.types'

// Database table types
export type Site = Database['public']['Tables']['sites']['Row']
export type SiteInsert = Database['public']['Tables']['sites']['Insert']
export type SiteUpdate = Database['public']['Tables']['sites']['Update']

export type Plan = Database['public']['Tables']['plans']['Row']
export type PlanInsert = Database['public']['Tables']['plans']['Insert']
export type PlanUpdate = Database['public']['Tables']['plans']['Update']

export type Bed = Database['public']['Tables']['beds']['Row']
export type BedInsert = Database['public']['Tables']['beds']['Insert']
export type BedUpdate = Database['public']['Tables']['beds']['Update']

export type Planting = Database['public']['Tables']['plantings']['Row']
export type PlantingInsert = Database['public']['Tables']['plantings']['Insert']
export type PlantingUpdate = Database['public']['Tables']['plantings']['Update']

// Canvas data types (from the frontend)
export interface GardenBed {
  id: string
  name: string
  points: { x: number; y: number }[]
  fill: string
  stroke: string
  plants: PlantedItem[]
  width?: number
  height?: number
  rotation?: number
  elementType?: string
  elementCategory?: 'bed' | 'water_management' | 'structure' | 'access' | 'energy' | 'animal' | 'waste'
  zone?: 0 | 1 | 2 | 3 | 4 | 5
  metadata?: Record<string, any>
}

export interface PlantedItem {
  id: string
  plantId: string
  x: number
  y: number
  plantedDate?: Date
}

// Garden design data structure (what gets saved/loaded)
export interface GardenData {
  site: SiteData
  plan: PlanData
  beds: GardenBed[]
  canvas: CanvasMetadata
}

export interface SiteData {
  id?: string
  name: string
  lat?: number
  lng?: number
  country_code?: string
  usda_zone?: string
  last_frost?: string
  first_frost?: string
  surface_type: 'soil' | 'hard'
  slope_pct?: number
  shade_notes?: string
  water_source: 'spigot' | 'none' | 'rain'
  constraints_json?: Record<string, any>
}

export interface PlanData {
  id?: string
  site_id?: string
  name: string
  version?: number
  status?: 'draft' | 'active' | 'archived'
}

export interface CanvasMetadata {
  zoom: number
  viewBox: { x: number; y: number; width: number; height: number }
  showGrid: boolean
  showLabels: boolean
  showSpacing: boolean
  showSunRequirements: boolean
  showWaterRequirements: boolean
  created_at?: string
  updated_at?: string
}

// Transformation utilities to convert between canvas and database formats
export class GardenDataTransformer {
  /**
   * Convert canvas garden beds to database beds
   */
  static canvasBedsToDbBeds(beds: GardenBed[], planId: string): BedInsert[] {
    return beds.map((bed, index) => {
      // Calculate dimensions from points
      const bounds = this.calculateBounds(bed.points)

      return {
        plan_id: planId,
        name: bed.name,
        shape: 'rect', // Simplified for now, could be enhanced
        length_ft: Math.round(bounds.width / 12), // Convert pixels to feet (rough conversion)
        width_ft: Math.round(bounds.height / 12),
        height_in: 8, // Default raised bed height
        orientation: bounds.width > bounds.height ? 'EW' : 'NS',
        surface: 'soil', // Default
        wicking: false,
        trellis: false,
        path_clearance_in: 24, // Default 2 feet
        notes: JSON.stringify({
          points: bed.points,
          fill: bed.fill,
          stroke: bed.stroke,
          elementType: bed.elementType,
          elementCategory: bed.elementCategory,
          zone: bed.zone,
          metadata: bed.metadata
        }),
        order_index: index
      }
    })
  }

  /**
   * Convert database beds back to canvas beds
   */
  static dbBedsToCanvasBeds(beds: Bed[], plantings: Planting[] = []): GardenBed[] {
    return beds.map(bed => {
      const notes = bed.notes ? JSON.parse(bed.notes) : {}
      const bedPlantings = plantings.filter(p => p.bed_id === bed.id)

      return {
        id: bed.id,
        name: bed.name,
        points: notes.points || this.generateRectanglePoints(bed.length_ft * 12, bed.width_ft * 12),
        fill: notes.fill || '#e0f2e0',
        stroke: notes.stroke || '#22c55e',
        plants: bedPlantings.map(p => ({
          id: p.id,
          plantId: p.crop_id || 'unknown',
          x: 100, // Would need to be stored in plantings table
          y: 100,
          plantedDate: new Date()
        })),
        width: bed.length_ft * 12,
        height: bed.width_ft * 12,
        rotation: 0,
        elementType: notes.elementType,
        elementCategory: notes.elementCategory,
        zone: notes.zone,
        metadata: notes.metadata
      }
    })
  }

  /**
   * Convert canvas plants to database plantings
   */
  static canvasPlantsToDbPlantings(beds: GardenBed[]): PlantingInsert[] {
    const plantings: PlantingInsert[] = []

    beds.forEach(bed => {
      bed.plants.forEach(plant => {
        plantings.push({
          bed_id: bed.id,
          season: 'spring', // Default, could be enhanced
          year: new Date().getFullYear(),
          crop_id: plant.plantId,
          variety: null,
          spacing_in: 12, // Default spacing
          family: 'Other', // Would need plant database lookup
          target_days_to_maturity: null,
          sowing_method: 'direct',
          successions_json: {
            position: { x: plant.x, y: plant.y },
            plantedDate: plant.plantedDate?.toISOString()
          }
        })
      })
    })

    return plantings
  }

  /**
   * Create a site from wizard data
   */
  static wizardDataToSite(wizardData: any, userId: string): SiteInsert {
    return {
      user_id: userId,
      name: wizardData.name || `Garden Site - ${new Date().toLocaleDateString()}`,
      lat: wizardData.location?.lat,
      lng: wizardData.location?.lng,
      country_code: null,
      usda_zone: wizardData.location?.usda_zone,
      last_frost: wizardData.location?.last_frost,
      first_frost: wizardData.location?.first_frost,
      surface_type: wizardData.surface?.type || 'soil',
      slope_pct: wizardData.surface?.slope,
      shade_notes: null,
      water_source: wizardData.water?.source || 'spigot',
      constraints_json: {
        area: wizardData.area,
        water: wizardData.water,
        crops: wizardData.crops,
        materials: wizardData.materials
      }
    }
  }

  /**
   * Create a plan from garden data
   */
  static gardenDataToPlan(gardenData: GardenData, siteId: string): PlanInsert {
    return {
      site_id: siteId,
      name: gardenData.plan.name,
      version: 1,
      status: 'draft'
    }
  }

  /**
   * Calculate bounds of a set of points
   */
  private static calculateBounds(points: { x: number; y: number }[]) {
    if (points.length === 0) return { x: 0, y: 0, width: 100, height: 100 }

    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  /**
   * Generate rectangle points for basic bed shapes
   */
  private static generateRectanglePoints(width: number, height: number, x = 100, y = 100) {
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ]
  }
}

// Garden save/load result types
export interface SaveGardenResult {
  success: boolean
  gardenId?: string
  siteId?: string
  planId?: string
  error?: string
}

export interface LoadGardenResult {
  success: boolean
  garden?: GardenData
  error?: string
}

export interface GardenListItem {
  id: string
  name: string
  site_name: string
  status: 'draft' | 'active' | 'archived'
  created_at: string
  updated_at: string
  bed_count: number
  plant_count: number
}

// Garden service configuration
export interface GardenServiceConfig {
  autoSaveInterval: number // milliseconds
  conflictResolution: 'client' | 'server' | 'prompt'
  enableOfflineMode: boolean
  maxRetries: number
}