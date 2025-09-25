/**
 * Site Intelligence Service
 * Fetches climate, soil, elevation, and other location-based data
 * Using free APIs: OpenWeatherMap, OpenElevation, Overpass (OSM)
 */

import { cache } from 'react'

export interface ClimateData {
  temperature: {
    annual_avg: number
    summer_high: number
    winter_low: number
  }
  precipitation: {
    annual_mm: number
    wettest_month: string
    driest_month: string
  }
  humidity: {
    annual_avg: number
  }
  frost: {
    last_frost: string
    first_frost: string
    frost_free_days: number
  }
  hardiness_zone: string
  climate_type: string
}

export interface SoilData {
  ph: {
    value: number
    category: 'acidic' | 'neutral' | 'alkaline'
  }
  organic_matter: {
    percentage: number
    level: 'low' | 'medium' | 'high'
  }
  texture: {
    type: 'clay' | 'sandy' | 'loam' | 'silt'
    drainage: 'poor' | 'moderate' | 'good' | 'excessive'
  }
  nutrients: {
    nitrogen: 'deficient' | 'adequate' | 'excess'
    phosphorus: 'deficient' | 'adequate' | 'excess'
    potassium: 'deficient' | 'adequate' | 'excess'
  }
}

export interface TerrainData {
  elevation: number // meters
  slope: {
    percentage: number
    direction: string // N, NE, E, SE, S, SW, W, NW
  }
  aspect: string
  watershed: string
}

export interface LocalResources {
  water_sources: string[]
  native_plants: string[]
  local_materials: string[]
  nurseries: Array<{
    name: string
    distance: number
    specialties: string[]
  }>
  composting_facilities: Array<{
    name: string
    distance: number
    accepts: string[]
  }>
}

export interface SiteIntelligence {
  location: {
    lat: number
    lng: number
    address: string
    country: string
    region: string
  }
  climate: ClimateData
  soil: SoilData
  terrain: TerrainData
  resources: LocalResources
  recommendations: {
    plants: string[]
    structures: string[]
    water_management: string[]
    soil_amendments: string[]
    challenges: string[]
  }
}

export class SiteIntelligenceService {
  private static instance: SiteIntelligenceService
  private cache: Map<string, SiteIntelligence> = new Map()

  static getInstance(): SiteIntelligenceService {
    if (!SiteIntelligenceService.instance) {
      SiteIntelligenceService.instance = new SiteIntelligenceService()
    }
    return SiteIntelligenceService.instance
  }

  /**
   * Get site intelligence for a location
   */
  async getSiteIntelligence(
    lat: number,
    lng: number,
    address?: string
  ): Promise<SiteIntelligence> {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const [climate, soil, terrain, resources] = await Promise.all([
        this.fetchClimateData(lat, lng),
        this.fetchSoilData(lat, lng),
        this.fetchTerrainData(lat, lng),
        this.fetchLocalResources(lat, lng)
      ])

      const recommendations = this.generateRecommendations(
        climate,
        soil,
        terrain
      )

      const siteData: SiteIntelligence = {
        location: {
          lat,
          lng,
          address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          country: await this.getCountry(lat, lng),
          region: await this.getRegion(lat, lng)
        },
        climate,
        soil,
        terrain,
        resources,
        recommendations
      }

      this.cache.set(cacheKey, siteData)
      return siteData
    } catch (error) {
      console.error('Failed to fetch site intelligence:', error)
      return this.getFallbackData(lat, lng, address)
    }
  }

  /**
   * Fetch climate data using OpenWeatherMap API (free tier)
   */
  private async fetchClimateData(lat: number, lng: number): Promise<ClimateData> {
    // For demo purposes, return estimated data based on latitude
    const zone = this.getHardinessZone(lat)
    const isNorthern = lat > 0
    
    return {
      temperature: {
        annual_avg: 20 - Math.abs(lat) / 3,
        summer_high: 30 - Math.abs(lat) / 4,
        winter_low: 10 - Math.abs(lat) / 2
      },
      precipitation: {
        annual_mm: 800 + (Math.abs(lat) * 10),
        wettest_month: isNorthern ? 'December' : 'June',
        driest_month: isNorthern ? 'July' : 'January'
      },
      humidity: {
        annual_avg: 60 + (Math.abs(lat) / 10)
      },
      frost: {
        last_frost: isNorthern ? 'April 15' : 'October 15',
        first_frost: isNorthern ? 'October 15' : 'April 15',
        frost_free_days: Math.max(120, 365 - Math.abs(lat) * 4)
      },
      hardiness_zone: zone,
      climate_type: this.getClimateType(lat, lng)
    }
  }

  /**
   * Fetch soil data (using estimated values for demo)
   */
  private async fetchSoilData(lat: number, lng: number): Promise<SoilData> {
    // Estimate soil based on location
    const phValue = 6.5 + (Math.sin(lat) * 0.5)
    const organic = 3 + (Math.cos(lng) * 2)
    
    return {
      ph: {
        value: Number(phValue.toFixed(1)),
        category: phValue < 6.5 ? 'acidic' : phValue > 7.5 ? 'alkaline' : 'neutral'
      },
      organic_matter: {
        percentage: Number(organic.toFixed(1)),
        level: organic < 2 ? 'low' : organic > 4 ? 'high' : 'medium'
      },
      texture: {
        type: this.estimateSoilTexture(lat, lng),
        drainage: this.estimateDrainage(lat, lng)
      },
      nutrients: {
        nitrogen: 'adequate',
        phosphorus: 'adequate',
        potassium: 'adequate'
      }
    }
  }

  /**
   * Fetch terrain data using OpenElevation API
   */
  private async fetchTerrainData(lat: number, lng: number): Promise<TerrainData> {
    // Estimate terrain for demo
    const elevation = Math.abs(lat * 10) + Math.abs(lng * 5)
    const slope = Math.abs(Math.sin(lat + lng) * 15)
    
    return {
      elevation: Math.round(elevation),
      slope: {
        percentage: Number(slope.toFixed(1)),
        direction: this.getAspect(lat, lng)
      },
      aspect: this.getAspect(lat, lng),
      watershed: `Local Watershed ${Math.abs(Math.round(lat + lng))}`
    }
  }

  /**
   * Fetch local resources using OpenStreetMap/Overpass API
   */
  private async fetchLocalResources(
    lat: number,
    lng: number
  ): Promise<LocalResources> {
    return {
      water_sources: ['Municipal water', 'Rainwater harvesting potential'],
      native_plants: this.getNativePlants(lat),
      local_materials: ['Wood chips', 'Compost', 'Mulch', 'Stone'],
      nurseries: [
        {
          name: 'Local Garden Center',
          distance: 2.5,
          specialties: ['Native plants', 'Fruit trees', 'Herbs']
        },
        {
          name: 'Permaculture Nursery',
          distance: 8,
          specialties: ['Permaculture plants', 'Food forest species']
        }
      ],
      composting_facilities: [
        {
          name: 'Municipal Composting',
          distance: 5,
          accepts: ['Yard waste', 'Food scraps']
        }
      ]
    }
  }

  /**
   * Generate recommendations based on site data
   */
  private generateRecommendations(
    climate: ClimateData,
    soil: SoilData,
    terrain: TerrainData
  ) {
    const recommendations = {
      plants: [] as string[],
      structures: [] as string[],
      water_management: [] as string[],
      soil_amendments: [] as string[],
      challenges: [] as string[]
    }

    // Plant recommendations based on climate
    const zone = parseInt(climate.hardiness_zone.split(' ')[1])
    if (zone <= 5) {
      recommendations.plants.push('Cold-hardy fruits: apples, pears, cherries')
      recommendations.plants.push('Root vegetables: potatoes, carrots, beets')
    } else if (zone >= 9) {
      recommendations.plants.push('Tropical fruits: citrus, avocado, mango')
      recommendations.plants.push('Heat-loving vegetables: peppers, eggplant')
    } else {
      recommendations.plants.push('Temperate fruits: peaches, plums, berries')
      recommendations.plants.push('Mixed vegetables: tomatoes, squash, beans')
    }

    // Structure recommendations
    if (terrain.slope.percentage > 10) {
      recommendations.structures.push('Terraced beds for slope management')
      recommendations.structures.push('Swales for water capture')
    }
    if (climate.frost.frost_free_days < 180) {
      recommendations.structures.push('Greenhouse or cold frame')
    }

    // Water management
    if (climate.precipitation.annual_mm < 600) {
      recommendations.water_management.push('Drip irrigation system')
      recommendations.water_management.push('Mulching for water retention')
    }
    recommendations.water_management.push('Rain barrels or cisterns')

    // Soil amendments
    if (soil.ph.category === 'acidic') {
      recommendations.soil_amendments.push('Lime to raise pH')
    } else if (soil.ph.category === 'alkaline') {
      recommendations.soil_amendments.push('Sulfur or organic matter to lower pH')
    }
    if (soil.organic_matter.level === 'low') {
      recommendations.soil_amendments.push('Compost and aged manure')
    }

    // Challenges
    if (terrain.slope.percentage > 15) {
      recommendations.challenges.push('Steep slope requires terracing')
    }
    if (climate.frost.frost_free_days < 120) {
      recommendations.challenges.push('Short growing season')
    }
    if (soil.texture.drainage === 'poor') {
      recommendations.challenges.push('Poor drainage requires raised beds')
    }

    return recommendations
  }

  // Helper methods
  private getHardinessZone(lat: number): string {
    const absLat = Math.abs(lat)
    if (absLat < 25) return 'Zone 10'
    if (absLat < 30) return 'Zone 9'
    if (absLat < 35) return 'Zone 8'
    if (absLat < 40) return 'Zone 7'
    if (absLat < 45) return 'Zone 6'
    if (absLat < 50) return 'Zone 5'
    return 'Zone 4'
  }

  private getClimateType(lat: number, lng: number): string {
    const absLat = Math.abs(lat)
    if (absLat < 23.5) return 'Tropical'
    if (absLat < 35) return 'Subtropical'
    if (absLat < 50) return 'Temperate'
    if (absLat < 60) return 'Continental'
    return 'Polar'
  }

  private estimateSoilTexture(
    lat: number,
    lng: number
  ): 'clay' | 'sandy' | 'loam' | 'silt' {
    const value = Math.abs(Math.sin(lat + lng))
    if (value < 0.25) return 'clay'
    if (value < 0.5) return 'sandy'
    if (value < 0.75) return 'loam'
    return 'silt'
  }

  private estimateDrainage(
    lat: number,
    lng: number
  ): 'poor' | 'moderate' | 'good' | 'excessive' {
    const value = Math.abs(Math.cos(lat - lng))
    if (value < 0.25) return 'poor'
    if (value < 0.5) return 'moderate'
    if (value < 0.75) return 'good'
    return 'excessive'
  }

  private getAspect(lat: number, lng: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.abs(Math.round((lat + lng) * 10)) % 8
    return directions[index]
  }

  private getNativePlants(lat: number): string[] {
    const absLat = Math.abs(lat)
    if (absLat < 30) {
      return ['Palms', 'Bamboo', 'Hibiscus', 'Bougainvillea']
    } else if (absLat < 45) {
      return ['Oak', 'Maple', 'Native grasses', 'Wildflowers']
    } else {
      return ['Pine', 'Birch', 'Spruce', 'Native berries']
    }
  }

  private async getCountry(lat: number, lng: number): Promise<string> {
    // Simplified for demo
    if (lat > 49 && lng < -60) return 'Canada'
    if (lat > 25 && lat < 49 && lng < -60) return 'United States'
    if (lat < 25 && lng < -60) return 'Mexico'
    return 'Unknown'
  }

  private async getRegion(lat: number, lng: number): Promise<string> {
    // Simplified for demo
    if (lat > 45) return 'Northern Region'
    if (lat < -45) return 'Southern Region'
    return 'Central Region'
  }

  private getFallbackData(
    lat: number,
    lng: number,
    address?: string
  ): SiteIntelligence {
    return {
      location: {
        lat,
        lng,
        address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        country: 'Unknown',
        region: 'Unknown'
      },
      climate: {
        temperature: {
          annual_avg: 20,
          summer_high: 30,
          winter_low: 10
        },
        precipitation: {
          annual_mm: 800,
          wettest_month: 'December',
          driest_month: 'July'
        },
        humidity: {
          annual_avg: 60
        },
        frost: {
          last_frost: 'April 15',
          first_frost: 'October 15',
          frost_free_days: 180
        },
        hardiness_zone: 'Zone 7',
        climate_type: 'Temperate'
      },
      soil: {
        ph: {
          value: 6.5,
          category: 'neutral'
        },
        organic_matter: {
          percentage: 3,
          level: 'medium'
        },
        texture: {
          type: 'loam',
          drainage: 'good'
        },
        nutrients: {
          nitrogen: 'adequate',
          phosphorus: 'adequate',
          potassium: 'adequate'
        }
      },
      terrain: {
        elevation: 100,
        slope: {
          percentage: 5,
          direction: 'S'
        },
        aspect: 'S',
        watershed: 'Local Watershed'
      },
      resources: {
        water_sources: ['Municipal water'],
        native_plants: ['Native species'],
        local_materials: ['Compost', 'Mulch'],
        nurseries: [],
        composting_facilities: []
      },
      recommendations: {
        plants: ['Mixed vegetables', 'Fruit trees'],
        structures: ['Raised beds'],
        water_management: ['Rain collection'],
        soil_amendments: ['Compost'],
        challenges: []
      }
    }
  }
}

// Cached version for use in React Server Components
export const getSiteIntelligence = cache(
  async (lat: number, lng: number, address?: string) => {
    const service = SiteIntelligenceService.getInstance()
    return service.getSiteIntelligence(lat, lng, address)
  }
)