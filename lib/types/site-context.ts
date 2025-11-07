/**
 * Site Context - Complete site data model for permaculture planning
 *
 * Centralizes all site-specific information from wizard and analysis
 * Used across all panels for context-aware recommendations
 */

import { ClimateType } from '@/lib/climate/climate-utils'

/**
 * Geographic location
 */
export interface Location {
  lat: number
  lng: number
  address?: string
  elevation?: number // meters above sea level
}

/**
 * USDA frost date information
 */
export interface FrostDates {
  lastFrost: Date // Last spring frost
  firstFrost: Date // First fall frost
  growingSeasonDays: number // Days between frosts
}

/**
 * Soil characteristics
 */
export interface SoilData {
  type: 'clay' | 'sandy' | 'loam' | 'rocky' | 'unknown'
  pH?: number // 0-14 scale
  fertility?: 'low' | 'medium' | 'high'
  drainage?: 'poor' | 'medium' | 'good' | 'excessive'
  depth?: 'shallow' | 'medium' | 'deep' // Inches of topsoil
  organicMatter?: 'low' | 'medium' | 'high' // Percentage range
}

/**
 * Topography and site conditions
 */
export interface TopographyData {
  slope?: 'flat' | 'gentle' | 'moderate' | 'steep' // Degrees or percentage
  aspect?: 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' // Direction slope faces
  surfaceType: 'grass' | 'hard' | 'soil' | 'mulch' | 'mixed'
  drainagePattern?: 'good' | 'poor' | 'seasonal_wet'
}

/**
 * Water resources and management
 */
export interface WaterData {
  source: 'municipal' | 'well' | 'rain' | 'pond' | 'stream' | 'greywater' | 'multiple'
  availability: 'abundant' | 'adequate' | 'limited' | 'scarce'
  quality?: 'excellent' | 'good' | 'fair' | 'poor'
  harvesting?: {
    hasRainBarrels: boolean
    hasCistern: boolean
    roofArea?: number // sq ft for catchment calculation
  }
  irrigation?: {
    type: 'drip' | 'sprinkler' | 'flood' | 'soaker' | 'hand' | 'none'
    automationLevel: 'manual' | 'timer' | 'smart'
  }
}

/**
 * Sector analysis - external energies affecting site
 */
export interface SectorData {
  sun?: {
    summerPath: string // Description or angle
    winterPath: string
    shadeSources?: string[] // Trees, buildings, etc.
  }
  wind?: {
    prevailingDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
    intensity: 'calm' | 'moderate' | 'strong' | 'extreme'
    seasonalVariation?: boolean
  }
  fire?: {
    riskLevel: 'low' | 'moderate' | 'high' | 'extreme'
    firebreakNeeded: boolean
  }
  wildlife?: {
    deer: boolean
    rabbits: boolean
    birds: boolean
    pollinators: 'low' | 'medium' | 'high'
    pests?: string[]
  }
  noise?: {
    sources?: string[] // Road, neighbors, etc.
    bufferingNeeded: boolean
  }
  views?: {
    desirable?: string[] // Mountain, garden, etc.
    undesirable?: string[] // Neighbor's yard, road, etc.
  }
}

/**
 * Property and access information
 */
export interface PropertyData {
  size: number // Total acres or sq ft
  unit: 'acres' | 'sqft' | 'sqm'
  zone: 'rural' | 'suburban' | 'urban'
  ownership: 'owned' | 'rented' | 'community'
  restrictions?: string[] // HOA, zoning, easements
  existingFeatures?: {
    buildings?: string[]
    trees?: number
    water?: string[] // Pond, stream, etc.
    hardscape?: string[] // Paths, patios, etc.
  }
}

/**
 * User goals and design priorities
 */
export interface DesignGoals {
  primary: 'food' | 'beauty' | 'wildlife' | 'education' | 'therapy' | 'production'
  production?: {
    targetYield?: number // lbs/year
    dietPercentage?: number // % of diet from garden
    commercialIntent: boolean
  }
  aesthetics?: {
    style?: 'formal' | 'cottage' | 'wild' | 'edible_landscape' | 'permaculture'
    colorPreferences?: string[]
  }
  wildlife?: {
    pollinators: boolean
    birds: boolean
    beneficial_insects: boolean
    habitat_creation: boolean
  }
  sustainability?: {
    organic: boolean
    waterConservation: boolean
    soilBuilding: boolean
    biodiversity: boolean
    wasteReduction: boolean
  }
}

/**
 * Complete site context for permaculture planning
 */
export interface CompleteSiteContext {
  // Basic identification
  planId: string
  planName?: string
  createdAt?: Date
  updatedAt?: Date

  // Geographic and climate
  location: Location
  usdaZone: string // e.g., "7a"
  climate: ClimateType
  frostDates?: FrostDates

  // Site characteristics
  soil: SoilData
  topography: TopographyData
  water: WaterData
  sectors?: SectorData
  property: PropertyData

  // Design approach
  goals?: DesignGoals

  // Calculated/derived data
  derivedData?: {
    growingSeasonLength?: number // days
    averageRainfall?: number // inches/year
    sunExposure?: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
    microclimate?: string // Description
  }
}

/**
 * Simplified site data for panels (backwards compatible)
 */
export interface SiteData {
  location?: {
    lat: number
    lng: number
  } | null
  usdaZone?: string
  climate?: ClimateType
  frostDates?: {
    lastFrost: Date
    firstFrost: Date
  } | null
  waterSource?: 'municipal' | 'well' | 'rain' | 'pond' | 'stream' | 'greywater' | 'multiple'
  surfaceType?: 'grass' | 'hard' | 'soil' | 'mulch' | 'mixed'
}

/**
 * Convert complete context to simplified site data (for backwards compatibility)
 */
export function toSiteData(context: CompleteSiteContext): SiteData {
  return {
    location: {
      lat: context.location.lat,
      lng: context.location.lng,
    },
    usdaZone: context.usdaZone,
    climate: context.climate,
    frostDates: context.frostDates,
    waterSource: context.water.source,
    surfaceType: context.topography.surfaceType,
  }
}

/**
 * Create default site context with minimal data
 */
export function createDefaultSiteContext(
  planId: string,
  location: Location,
  usdaZone: string,
  climate: ClimateType
): CompleteSiteContext {
  return {
    planId,
    location,
    usdaZone,
    climate,
    soil: {
      type: 'unknown',
      drainage: 'medium',
    },
    topography: {
      surfaceType: 'grass',
      slope: 'flat',
    },
    water: {
      source: 'municipal',
      availability: 'adequate',
    },
    property: {
      size: 1000,
      unit: 'sqft',
      zone: 'suburban',
      ownership: 'owned',
    },
  }
}
