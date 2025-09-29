/**
 * Permaculture Zone Management System
 * Based on Justin RobertShaw's consulting methodology
 */

export interface Zone {
  id: 0 | 1 | 2 | 3 | 4 | 5
  name: string
  description: string
  visitFrequency: string
  typicalElements: string[]
  maintenanceLevel: 'intensive' | 'moderate' | 'low' | 'minimal' | 'none'
  waterRequirement: 'high' | 'moderate' | 'low' | 'none'
  color: string // For visualization
}

export const PERMACULTURE_ZONES: Zone[] = [
  {
    id: 0,
    name: 'Zone 0: Home',
    description: 'The house and indoor living spaces',
    visitFrequency: 'Multiple times daily',
    typicalElements: [
      'Kitchen',
      'Indoor herb gardens',
      'Sprouting jars',
      'Windowsill plants',
      'Seed starting area',
      'Food storage'
    ],
    maintenanceLevel: 'intensive',
    waterRequirement: 'high',
    color: '#8B4513' // Brown
  },
  {
    id: 1,
    name: 'Zone 1: Intensive',
    description: 'Areas visited daily, highest maintenance',
    visitFrequency: 'Daily',
    typicalElements: [
      'Kitchen garden',
      'Herb spiral',
      'Salad beds',
      'Greenhouse',
      'Compost bins',
      'Rainwater tanks',
      'Chicken coop',
      'Nursery beds'
    ],
    maintenanceLevel: 'intensive',
    waterRequirement: 'high',
    color: '#228B22' // Forest Green
  },
  {
    id: 2,
    name: 'Zone 2: Semi-intensive',
    description: 'Areas visited every few days',
    visitFrequency: '2-3 times per week',
    typicalElements: [
      'Main vegetable beds',
      'Small orchard',
      'Berry bushes',
      'Beehives',
      'Small ponds',
      'Tool shed',
      'Larger chicken run',
      'Food forest edge'
    ],
    maintenanceLevel: 'moderate',
    waterRequirement: 'moderate',
    color: '#32CD32' // Lime Green
  },
  {
    id: 3,
    name: 'Zone 3: Occasional',
    description: 'Areas visited weekly or less',
    visitFrequency: 'Weekly',
    typicalElements: [
      'Main crops',
      'Large orchard',
      'Grazing pastures',
      'Large ponds/dams',
      'Windbreaks',
      'Bulk storage crops',
      'Larger livestock',
      'Commercial crops'
    ],
    maintenanceLevel: 'low',
    waterRequirement: 'low',
    color: '#90EE90' // Light Green
  },
  {
    id: 4,
    name: 'Zone 4: Minimal',
    description: 'Semi-wild, visited occasionally',
    visitFrequency: 'Monthly or seasonally',
    typicalElements: [
      'Timber trees',
      'Forage area',
      'Wild harvest',
      'Rough grazing',
      'Wildlife habitat',
      'Firewood',
      'Hunting/fishing'
    ],
    maintenanceLevel: 'minimal',
    waterRequirement: 'none',
    color: '#8FBC8F' // Dark Sea Green
  },
  {
    id: 5,
    name: 'Zone 5: Wild',
    description: 'Wilderness, observation only',
    visitFrequency: 'Rarely/Never',
    typicalElements: [
      'Native forest',
      'Wildlife corridor',
      'Wilderness area',
      'Natural ecosystem',
      'Biodiversity reserve',
      'Watershed protection'
    ],
    maintenanceLevel: 'none',
    waterRequirement: 'none',
    color: '#654321' // Dark Brown
  }
]

export interface ZoneAnalysis {
  siteArea: number // square meters
  zoneAllocations: {
    zone: Zone
    area: number // square meters
    percentage: number
    currentElements: string[]
    recommendedElements: string[]
  }[]
  efficiency: number // 0-100
  recommendations: string[]
}

export interface ElementPlacement {
  elementId: string
  elementType: string
  currentZone: number
  recommendedZone: number
  reason: string
  priority: 'high' | 'medium' | 'low'
}

// Analyze site and recommend zone allocations
export function analyzeSiteZones(
  siteArea: number,
  siteType: 'urban' | 'suburban' | 'rural',
  climateZone: string
): ZoneAnalysis {
  const zoneAllocations = PERMACULTURE_ZONES.map(zone => {
    // Calculate recommended percentages based on site type
    let percentage = 0

    switch (siteType) {
      case 'urban':
        // Urban sites focus on zones 0-2
        switch (zone.id) {
          case 0: percentage = 40; break
          case 1: percentage = 35; break
          case 2: percentage = 20; break
          case 3: percentage = 5; break
          case 4: percentage = 0; break
          case 5: percentage = 0; break
        }
        break

      case 'suburban':
        // Suburban sites have balanced zones 0-3
        switch (zone.id) {
          case 0: percentage = 20; break
          case 1: percentage = 25; break
          case 2: percentage = 25; break
          case 3: percentage = 20; break
          case 4: percentage = 8; break
          case 5: percentage = 2; break
        }
        break

      case 'rural':
        // Rural sites utilize all zones
        switch (zone.id) {
          case 0: percentage = 5; break
          case 1: percentage = 10; break
          case 2: percentage = 15; break
          case 3: percentage = 25; break
          case 4: percentage = 25; break
          case 5: percentage = 20; break
        }
        break
    }

    return {
      zone,
      area: (siteArea * percentage) / 100,
      percentage,
      currentElements: [],
      recommendedElements: getRecommendedElements(zone.id, siteType, climateZone)
    }
  })

  const efficiency = calculateZoneEfficiency(zoneAllocations)
  const recommendations = generateZoneRecommendations(zoneAllocations, siteType)

  return {
    siteArea,
    zoneAllocations,
    efficiency,
    recommendations
  }
}

// Get recommended elements for a zone
function getRecommendedElements(
  zoneId: number,
  siteType: 'urban' | 'suburban' | 'rural',
  climateZone: string
): string[] {
  const zone = PERMACULTURE_ZONES.find(z => z.id === zoneId)
  if (!zone) return []

  // Filter typical elements based on site constraints
  let elements = [...zone.typicalElements]

  if (siteType === 'urban') {
    // Remove large-scale elements
    elements = elements.filter(e =>
      !e.includes('Large') &&
      !e.includes('pasture') &&
      !e.includes('livestock')
    )
  }

  // Add climate-specific elements
  if (climateZone.includes('tropical')) {
    if (zoneId === 1) elements.push('Shade house')
    if (zoneId === 2) elements.push('Banana circle')
  } else if (climateZone.includes('arid')) {
    if (zoneId === 1) elements.push('Shade cloth')
    if (zoneId === 2) elements.push('Desert garden')
  }

  return elements
}

// Calculate zone efficiency
function calculateZoneEfficiency(
  zoneAllocations: ZoneAnalysis['zoneAllocations']
): number {
  let score = 100

  // Check for proper zone progression
  for (let i = 0; i < zoneAllocations.length - 1; i++) {
    if (zoneAllocations[i].percentage === 0 && zoneAllocations[i + 1].percentage > 10) {
      score -= 20 // Penalty for skipping zones
    }
  }

  // Check for balance
  const zone1and2 = zoneAllocations[1].percentage + zoneAllocations[2].percentage
  if (zone1and2 < 20) {
    score -= 15 // Not enough intensive zones
  }

  return Math.max(0, score)
}

// Generate recommendations
function generateZoneRecommendations(
  zoneAllocations: ZoneAnalysis['zoneAllocations'],
  siteType: 'urban' | 'suburban' | 'rural'
): string[] {
  const recommendations: string[] = []

  // Check Zone 1 allocation
  if (zoneAllocations[1].percentage < 10) {
    recommendations.push('Increase Zone 1 area for daily harvest items and herbs')
  }

  // Check water placement
  if (zoneAllocations[1].currentElements.filter(e => e.includes('water')).length === 0) {
    recommendations.push('Add water storage to Zone 1 for easy access')
  }

  // Urban specific
  if (siteType === 'urban') {
    recommendations.push('Focus on vertical growing in Zones 1-2')
    recommendations.push('Consider container gardens for flexibility')
  }

  // Rural specific
  if (siteType === 'rural') {
    recommendations.push('Establish windbreaks in Zone 3')
    recommendations.push('Preserve Zone 5 for wildlife habitat')
  }

  return recommendations
}

// Check if element is in correct zone
export function validateElementPlacement(
  elementType: string,
  zoneId: number
): {
  valid: boolean
  recommendedZone: number
  reason: string
} {
  // Map element types to recommended zones
  const elementZoneMap: Record<string, number[]> = {
    'herb_spiral': [1],
    'kitchen_garden': [1],
    'greenhouse': [1, 2],
    'chicken_coop': [1, 2],
    'compost_bin': [1],
    'water_tank': [1, 2],
    'vegetable_bed': [1, 2],
    'orchard': [2, 3],
    'beehive': [2, 3],
    'pond': [2, 3, 4],
    'pasture': [3, 4],
    'food_forest': [2, 3],
    'windbreak': [3, 4],
    'timber': [4],
    'wildlife_area': [4, 5]
  }

  const recommendedZones = elementZoneMap[elementType] || [2, 3]
  const valid = recommendedZones.includes(zoneId)
  const recommendedZone = recommendedZones[0]

  let reason = valid
    ? `${elementType} is well-placed in Zone ${zoneId}`
    : `${elementType} is typically better in Zone ${recommendedZone} for optimal management`

  return { valid, recommendedZone, reason }
}

// Calculate distance from house (Zone 0)
export function calculateZoneDistance(
  point: { x: number; y: number },
  houseLocation: { x: number; y: number }
): number {
  const dx = point.x - houseLocation.x
  const dy = point.y - houseLocation.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Suggest zone based on distance
export function suggestZoneByDistance(
  distance: number,
  siteRadius: number
): number {
  const ratio = distance / siteRadius

  if (ratio < 0.1) return 1
  if (ratio < 0.25) return 2
  if (ratio < 0.5) return 3
  if (ratio < 0.75) return 4
  return 5
}

// Zone-based maintenance schedule
export interface MaintenanceTask {
  zone: number
  task: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'seasonal'
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  duration: number // minutes
  priority: 'high' | 'medium' | 'low'
}

export function generateMaintenanceSchedule(
  zoneElements: Map<number, string[]>
): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = []

  zoneElements.forEach((elements, zoneId) => {
    elements.forEach(element => {
      const elementTasks = getElementTasks(element, zoneId)
      tasks.push(...elementTasks)
    })
  })

  return tasks.sort((a, b) => {
    // Sort by zone then priority
    if (a.zone !== b.zone) return a.zone - b.zone
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

function getElementTasks(element: string, zone: number): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = []

  // Example task mappings
  switch (element.toLowerCase()) {
    case 'kitchen_garden':
      tasks.push({
        zone,
        task: 'Water and harvest',
        frequency: 'daily',
        duration: 15,
        priority: 'high'
      })
      break

    case 'greenhouse':
      tasks.push({
        zone,
        task: 'Check temperature and ventilation',
        frequency: 'daily',
        duration: 10,
        priority: 'high'
      })
      break

    case 'chicken_coop':
      tasks.push({
        zone,
        task: 'Feed chickens and collect eggs',
        frequency: 'daily',
        duration: 20,
        priority: 'high'
      })
      break

    case 'orchard':
      tasks.push({
        zone,
        task: 'Prune and check for pests',
        frequency: 'seasonal',
        season: 'winter',
        duration: 120,
        priority: 'medium'
      })
      break
  }

  return tasks
}

// Export zone overlay for visualization
export function getZoneOverlay(
  canvasSize: { width: number; height: number },
  houseLocation: { x: number; y: number }
): {
  zone: number
  path: string
  fill: string
  opacity: number
}[] {
  const overlays: {
    zone: number
    path: string
    fill: string
    opacity: number
  }[] = []
  const maxRadius = Math.max(canvasSize.width, canvasSize.height) / 2

  PERMACULTURE_ZONES.forEach(zone => {
    if (zone.id === 0) return // Skip house zone

    const innerRadius = (zone.id - 1) * (maxRadius / 5)
    const outerRadius = zone.id * (maxRadius / 5)

    // Create concentric circle paths
    const path = `
      M ${houseLocation.x + innerRadius} ${houseLocation.y}
      A ${innerRadius} ${innerRadius} 0 0 1 ${houseLocation.x - innerRadius} ${houseLocation.y}
      A ${innerRadius} ${innerRadius} 0 0 1 ${houseLocation.x + innerRadius} ${houseLocation.y}
      M ${houseLocation.x + outerRadius} ${houseLocation.y}
      A ${outerRadius} ${outerRadius} 0 0 0 ${houseLocation.x - outerRadius} ${houseLocation.y}
      A ${outerRadius} ${outerRadius} 0 0 0 ${houseLocation.x + outerRadius} ${houseLocation.y}
    `

    overlays.push({
      zone: zone.id,
      path,
      fill: zone.color,
      opacity: 0.2
    })
  })

  return overlays
}