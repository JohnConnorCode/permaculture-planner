/**
 * Plant Management System
 * Handles grouping, ungrouping, and managing plants within beds
 */

import { GardenBed, PlantedItem } from '@/components/garden-designer-canvas'
import { PlantInfo } from '@/lib/data/plant-library'

export interface PlantGroup {
  id: string
  name: string
  bedId: string
  plants: PlantedItem[]
  plantingDate: Date
  harvestDate?: Date
  rotation?: string // Next crop in rotation
  notes?: string
}

export interface PlantingPlan {
  id: string
  season: 'spring' | 'summer' | 'fall' | 'winter'
  year: number
  groups: PlantGroup[]
  successionPlantings: SuccessionPlanting[]
}

export interface SuccessionPlanting {
  plantId: string
  bedId: string
  sowingDates: Date[]
  interval: number // days between sowings
  quantity: number // plants per sowing
}

export interface CompanionMatrix {
  plant1: string
  plant2: string
  relationship: 'beneficial' | 'neutral' | 'antagonistic'
  notes?: string
}

export interface RotationPlan {
  bedId: string
  year1: PlantGroup[]
  year2: PlantGroup[]
  year3: PlantGroup[]
  year4: PlantGroup[]
  notes?: string
}

// Group plants within a bed
export function groupPlants(
  bed: GardenBed,
  plantIds: string[],
  groupName: string
): PlantGroup {
  const plantsInGroup = bed.plants.filter(p => plantIds.includes(p.id))

  return {
    id: `group-${Date.now()}`,
    name: groupName,
    bedId: bed.id,
    plants: plantsInGroup,
    plantingDate: new Date(),
    notes: `Grouped ${plantsInGroup.length} plants`
  }
}

// Ungroup plants
export function ungroupPlants(group: PlantGroup): PlantedItem[] {
  return group.plants.map(plant => ({
    ...plant,
    id: `plant-${Date.now()}-${Math.random()}`
  }))
}

// Calculate plant spacing based on requirements
export function calculateOptimalSpacing(
  plants: PlantInfo[],
  bedDimensions: { width: number; height: number }
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []
  let currentX = 20
  let currentY = 20

  plants.forEach(plant => {
    const spacing = plant.size.spacing || 12

    if (currentX + spacing > bedDimensions.width * 20) {
      currentX = 20
      currentY += spacing
    }

    positions.push({ x: currentX, y: currentY })
    currentX += spacing
  })

  return positions
}

// Check companion planting compatibility
export function checkGroupCompatibility(plants: PlantInfo[]): {
  compatible: boolean
  warnings: string[]
  benefits: string[]
} {
  const warnings: string[] = []
  const benefits: string[] = []
  let compatible = true

  for (let i = 0; i < plants.length; i++) {
    for (let j = i + 1; j < plants.length; j++) {
      const plant1 = plants[i]
      const plant2 = plants[j]

      // Check antagonists
      if (plant1.antagonists.includes(plant2.id)) {
        warnings.push(`${plant1.name} and ${plant2.name} should not be planted together`)
        compatible = false
      }

      // Check companions
      if (plant1.companions.includes(plant2.id)) {
        benefits.push(`${plant1.name} and ${plant2.name} are good companions`)
      }
    }
  }

  return { compatible, warnings, benefits }
}

// Generate succession planting schedule
export function generateSuccessionSchedule(
  plant: PlantInfo,
  startDate: Date,
  endDate: Date,
  interval: number
): Date[] {
  const sowingDates: Date[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    sowingDates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + interval)
  }

  return sowingDates
}

// Calculate water requirements for a group
export function calculateGroupWaterNeeds(plants: PlantedItem[], plantLibrary: PlantInfo[]): {
  totalWaterNeeds: 'low' | 'moderate' | 'high'
  weeklyGallons: number
} {
  let waterScore = 0
  let plantCount = 0

  plants.forEach(plant => {
    const info = plantLibrary.find(p => p.id === plant.plantId)
    if (info) {
      plantCount++
      switch (info.requirements.water) {
        case 'low':
          waterScore += 1
          break
        case 'moderate':
          waterScore += 2
          break
        case 'high':
          waterScore += 3
          break
      }
    }
  })

  const avgScore = waterScore / plantCount
  const totalWaterNeeds = avgScore <= 1.5 ? 'low' : avgScore <= 2.5 ? 'moderate' : 'high'
  const weeklyGallons = plantCount * (avgScore * 2) // Rough estimate

  return { totalWaterNeeds, weeklyGallons }
}

// Generate rotation plan based on plant families
export function generateRotationPlan(
  beds: GardenBed[],
  years: number = 4
): RotationPlan[] {
  const rotationPlans: RotationPlan[] = []

  // Plant families for rotation
  const families = {
    nightshade: ['tomato', 'pepper', 'eggplant', 'potato'],
    brassica: ['cabbage', 'broccoli', 'kale', 'cauliflower'],
    legume: ['beans', 'peas', 'lentils'],
    cucurbit: ['cucumber', 'squash', 'melon', 'pumpkin'],
    root: ['carrot', 'beet', 'radish', 'turnip'],
    allium: ['onion', 'garlic', 'leek', 'shallot']
  }

  beds.forEach(bed => {
    const plan: RotationPlan = {
      bedId: bed.id,
      year1: [],
      year2: [],
      year3: [],
      year4: [],
      notes: 'Rotate plant families to prevent soil depletion and pest buildup'
    }

    // Simple rotation: nightshade -> brassica -> legume -> root
    // This is a simplified example - real rotation would be more complex

    rotationPlans.push(plan)
  })

  return rotationPlans
}

// Calculate sun exposure for plant groups
export function calculateSunExposure(
  group: PlantGroup,
  plantLibrary: PlantInfo[]
): {
  requiredSun: 'full' | 'partial' | 'shade'
  compatible: boolean
} {
  const sunRequirements = group.plants.map(plant => {
    const info = plantLibrary.find(p => p.id === plant.plantId)
    return info?.requirements.sun || 'full'
  })

  // Check if all plants have compatible sun requirements
  const uniqueRequirements = [...new Set(sunRequirements)]
  const compatible = uniqueRequirements.length === 1

  // Return the most common requirement
  const counts = sunRequirements.reduce((acc, req) => {
    acc[req] = (acc[req] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const requiredSun = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)[0][0] as 'full' | 'partial' | 'shade'

  return { requiredSun, compatible }
}

// Export functions for timeline management
export function getPlantingTimeline(
  groups: PlantGroup[],
  year: number
): {
  month: number
  tasks: string[]
}[] {
  const timeline = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    tasks: [] as string[]
  }))

  groups.forEach(group => {
    const plantingMonth = group.plantingDate.getMonth()
    timeline[plantingMonth].tasks.push(`Plant ${group.name}`)

    if (group.harvestDate) {
      const harvestMonth = group.harvestDate.getMonth()
      timeline[harvestMonth].tasks.push(`Harvest ${group.name}`)
    }
  })

  return timeline
}

// Multi-select operations
export interface SelectionState {
  selectedPlants: string[]
  selectedBeds: string[]
  selectedGroups: string[]
  mode: 'single' | 'multi'
}

export function addToSelection(
  state: SelectionState,
  itemId: string,
  itemType: 'plant' | 'bed' | 'group'
): SelectionState {
  const newState = { ...state }

  if (state.mode === 'single') {
    // Clear other selections
    newState.selectedPlants = []
    newState.selectedBeds = []
    newState.selectedGroups = []
  }

  switch (itemType) {
    case 'plant':
      if (!newState.selectedPlants.includes(itemId)) {
        newState.selectedPlants.push(itemId)
      }
      break
    case 'bed':
      if (!newState.selectedBeds.includes(itemId)) {
        newState.selectedBeds.push(itemId)
      }
      break
    case 'group':
      if (!newState.selectedGroups.includes(itemId)) {
        newState.selectedGroups.push(itemId)
      }
      break
  }

  return newState
}

export function removeFromSelection(
  state: SelectionState,
  itemId: string,
  itemType: 'plant' | 'bed' | 'group'
): SelectionState {
  const newState = { ...state }

  switch (itemType) {
    case 'plant':
      newState.selectedPlants = newState.selectedPlants.filter(id => id !== itemId)
      break
    case 'bed':
      newState.selectedBeds = newState.selectedBeds.filter(id => id !== itemId)
      break
    case 'group':
      newState.selectedGroups = newState.selectedGroups.filter(id => id !== itemId)
      break
  }

  return newState
}

export function clearSelection(): SelectionState {
  return {
    selectedPlants: [],
    selectedBeds: [],
    selectedGroups: [],
    mode: 'single'
  }
}

// Batch operations
export function batchMovePlants(
  plants: PlantedItem[],
  offset: { x: number; y: number }
): PlantedItem[] {
  return plants.map(plant => ({
    ...plant,
    x: plant.x + offset.x,
    y: plant.y + offset.y
  }))
}

export function batchDeletePlants(
  bed: GardenBed,
  plantIds: string[]
): GardenBed {
  return {
    ...bed,
    plants: bed.plants.filter(p => !plantIds.includes(p.id))
  }
}

export function batchCopyPlants(
  plants: PlantedItem[],
  targetBedId: string
): PlantedItem[] {
  return plants.map(plant => ({
    ...plant,
    id: `plant-copy-${Date.now()}-${Math.random()}`,
    x: plant.x + 20, // Offset copies slightly
    y: plant.y + 20
  }))
}