// Garden Plan Types
export interface GardenPlan {
  id?: string
  name: string
  dimensions: {
    width: number
    length: number
  }
  beds: Array<{
    id: string
    name: string
    x: number
    y: number
    width: number
    height: number
    shape: 'rectangle' | 'circle' | 'polygon'
    soil_type?: string
    sun_hours?: number
  }>
  plants?: Array<{
    id: string
    name: string
    x: number
    y: number
    bedId?: string
    variety?: string
    quantity?: number
  }>
  structures?: Array<{
    id: string
    name: string
    type: 'greenhouse' | 'shed' | 'trellis' | 'fence' | 'compost' | 'other'
    x: number
    y: number
    width: number
    height: number
  }>
  paths?: Array<{
    id: string
    name: string
    points: Array<{ x: number; y: number }>
    width: number
    material?: string
  }>
  created_at?: string
  updated_at?: string
  user_id?: string
}

// Re-export database types
export * from './database.types'