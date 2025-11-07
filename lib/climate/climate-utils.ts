/**
 * Climate Utilities
 *
 * Derive climate classification from lat/lng
 * Simplified Köppen climate classification
 */

export type ClimateType = 'dry' | 'humid' | 'moderate'

/**
 * Derive climate type from latitude and longitude
 *
 * Simplified classification based on latitude zones:
 * - Tropical (0-23°): Generally humid
 * - Subtropical (23-35°): Can be dry or moderate
 * - Temperate (35-60°): Generally moderate
 * - Polar (60-90°): Dry (cold desert)
 *
 * This is a simplified approximation. Actual climate depends on:
 * - Proximity to oceans
 * - Elevation
 * - Wind patterns
 * - Regional precipitation patterns
 */
export function deriveClimateFromLocation(lat: number, lng: number): ClimateType {
  const absLat = Math.abs(lat)

  // Tropical zone (0-23° latitude)
  if (absLat < 23) {
    // Check longitude for continental vs coastal
    // Simplified: assume humid near equator
    return 'humid'
  }

  // Subtropical zone (23-35° latitude)
  if (absLat >= 23 && absLat < 35) {
    // This is where major deserts occur (30° latitude)
    // Simplified: check distance from major water bodies
    // For now, use longitude to approximate
    const lngAbs = Math.abs(lng)

    // Continental interiors (away from coasts) tend to be drier
    if (lngAbs > 20 && lngAbs < 140) {
      return 'dry' // Continental subtropical
    }

    return 'moderate' // Coastal subtropical
  }

  // Temperate zone (35-50° latitude)
  if (absLat >= 35 && absLat < 50) {
    return 'moderate' // Generally moderate climate
  }

  // Cool temperate / Polar (50-90° latitude)
  if (absLat >= 50) {
    return 'dry' // Cold, less evaporation
  }

  // Default fallback
  return 'moderate'
}

/**
 * Get climate description for display
 */
export function getClimateDescription(climate: ClimateType): string {
  const descriptions: Record<ClimateType, string> = {
    dry: 'Dry climate - Low humidity, higher water needs',
    humid: 'Humid climate - High humidity, moderate water needs',
    moderate: 'Moderate climate - Balanced conditions',
  }

  return descriptions[climate] || 'Unknown climate'
}

/**
 * Get climate-specific watering advice
 */
export function getClimateWateringAdvice(climate: ClimateType): string[] {
  const advice: Record<ClimateType, string[]> = {
    dry: [
      'Mulch heavily to retain moisture (3-4 inches)',
      'Water deeply and less frequently',
      'Use drip irrigation to minimize evaporation',
      'Consider drought-tolerant varieties',
      'Plant during cooler months when possible',
    ],
    humid: [
      'Ensure good drainage to prevent root rot',
      'Watch for fungal diseases in wet conditions',
      'Space plants for airflow',
      'Water in morning to allow foliage to dry',
      'Mulch moderately (2-3 inches)',
    ],
    moderate: [
      "Water consistently but don't overwater",
      'Mulch 2-3 inches to maintain moisture',
      'Adjust watering based on rainfall',
      'Monitor soil moisture regularly',
      'Group plants by water needs',
    ],
  }

  return advice[climate] || []
}

/**
 * Climate multipliers for various calculations
 */
export function getClimateMultipliers(climate: ClimateType): {
  waterMultiplier: number
  evaporationMultiplier: number
  growthMultiplier: number
} {
  const multipliers: Record<ClimateType, { waterMultiplier: number; evaporationMultiplier: number; growthMultiplier: number }> = {
    dry: {
      waterMultiplier: 1.5, // Need 50% more water
      evaporationMultiplier: 1.8, // Much higher evaporation
      growthMultiplier: 0.9, // Slightly slower growth
    },
    humid: {
      waterMultiplier: 0.7, // Need 30% less water
      evaporationMultiplier: 0.5, // Lower evaporation
      growthMultiplier: 1.1, // Slightly faster growth
    },
    moderate: {
      waterMultiplier: 1.0, // Baseline
      evaporationMultiplier: 1.0, // Baseline
      growthMultiplier: 1.0, // Baseline
    },
  }

  return multipliers[climate] || multipliers.moderate
}
