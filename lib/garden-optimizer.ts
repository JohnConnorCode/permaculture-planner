// Advanced garden optimization algorithms and yield predictions

import { Node, BedNode, PlantNode, isBedNode, isPlantNode } from '@/modules/scene/sceneTypes'

export interface OptimizationResult {
  score: number
  suggestions: Suggestion[]
  warnings: Warning[]
  yieldPrediction: YieldPrediction
  resourceEfficiency: ResourceMetrics
  biodiversityScore: number
}

export interface Suggestion {
  type: 'placement' | 'companion' | 'rotation' | 'spacing' | 'resource'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  impact: string
  implementation?: string[]
}

export interface Warning {
  type: 'conflict' | 'spacing' | 'resource' | 'climate'
  severity: 'info' | 'warning' | 'error'
  title: string
  description: string
  affectedElements: string[]
  solution?: string
}

export interface YieldPrediction {
  totalYieldLbs: number
  byPlant: PlantYield[]
  caloriesTotal: number
  nutritionScore: number
  harvestSchedule: HarvestEvent[]
  marketValue: number
}

export interface PlantYield {
  plantId: string
  name: string
  expectedYieldLbs: number
  yieldRangeMin: number
  yieldRangeMax: number
  harvestWindow: { start: Date; end: Date }
  nutritionalValue: NutritionData
}

export interface NutritionData {
  calories: number
  protein: number
  vitamins: string[]
  minerals: string[]
  antioxidants: number
}

export interface HarvestEvent {
  date: Date
  plant: string
  quantityLbs: number
  tasks: string[]
}

export interface ResourceMetrics {
  waterEfficiency: number // 0-100
  spaceUtilization: number // 0-100
  soilHealth: number // 0-100
  energyBalance: number // calories out / calories in
  laborHours: number
  costEfficiency: number // $ yield / $ invested
}

// Plant database with detailed yield data
const PLANT_YIELDS: Record<string, any> = {
  tomato: {
    yieldPerPlant: { min: 10, max: 30, average: 15 }, // lbs
    plantsPerSqFt: 0.25,
    caloriesPerLb: 82,
    marketValuePerLb: 3.50,
    harvestDuration: 60, // days
    waterNeeds: 2, // gallons/week
    nutrition: {
      vitamins: ['C', 'K', 'A'],
      minerals: ['potassium', 'manganese'],
      antioxidants: 85
    }
  },
  lettuce: {
    yieldPerPlant: { min: 0.5, max: 1.5, average: 1 },
    plantsPerSqFt: 4,
    caloriesPerLb: 63,
    marketValuePerLb: 4.00,
    harvestDuration: 21,
    waterNeeds: 1,
    nutrition: {
      vitamins: ['K', 'A', 'C'],
      minerals: ['iron', 'calcium'],
      antioxidants: 65
    }
  },
  carrot: {
    yieldPerPlant: { min: 0.15, max: 0.3, average: 0.2 },
    plantsPerSqFt: 16,
    caloriesPerLb: 186,
    marketValuePerLb: 2.00,
    harvestDuration: 14,
    waterNeeds: 1,
    nutrition: {
      vitamins: ['A', 'K', 'B6'],
      minerals: ['potassium', 'fiber'],
      antioxidants: 70
    }
  },
  beans: {
    yieldPerPlant: { min: 0.5, max: 1, average: 0.75 },
    plantsPerSqFt: 9,
    caloriesPerLb: 147,
    marketValuePerLb: 3.00,
    harvestDuration: 30,
    waterNeeds: 1.5,
    nitrogenFixing: true,
    nutrition: {
      vitamins: ['C', 'K', 'folate'],
      minerals: ['iron', 'magnesium'],
      antioxidants: 60
    }
  },
  squash: {
    yieldPerPlant: { min: 5, max: 20, average: 10 },
    plantsPerSqFt: 0.11,
    caloriesPerLb: 76,
    marketValuePerLb: 2.50,
    harvestDuration: 45,
    waterNeeds: 2.5,
    nutrition: {
      vitamins: ['A', 'C', 'B6'],
      minerals: ['potassium', 'manganese'],
      antioxidants: 55
    }
  }
}

// Companion planting matrix
const COMPANION_MATRIX: Record<string, { good: string[], bad: string[] }> = {
  tomato: {
    good: ['basil', 'carrot', 'parsley', 'marigold', 'nasturtium', 'chives'],
    bad: ['brassicas', 'fennel', 'corn', 'potato']
  },
  lettuce: {
    good: ['carrot', 'radish', 'strawberry', 'cucumber', 'beet'],
    bad: ['parsley', 'celery']
  },
  carrot: {
    good: ['lettuce', 'onion', 'pea', 'radish', 'tomato', 'chives'],
    bad: ['dill', 'parsnip']
  },
  beans: {
    good: ['corn', 'squash', 'cucumber', 'carrot', 'cauliflower'],
    bad: ['onion', 'garlic', 'fennel', 'sunflower']
  },
  squash: {
    good: ['corn', 'beans', 'nasturtium', 'radish', 'marigold'],
    bad: ['potato', 'brassicas']
  }
}

export class GardenOptimizer {
  private nodes: Node[]
  private hardinessZone: string
  private lastFrostDate: Date
  private firstFrostDate: Date

  constructor(
    nodes: Node[],
    hardinessZone: string = '7a',
    lastFrost?: Date,
    firstFrost?: Date
  ) {
    this.nodes = nodes
    this.hardinessZone = hardinessZone
    this.lastFrostDate = lastFrost || new Date(new Date().getFullYear(), 3, 15)
    this.firstFrostDate = firstFrost || new Date(new Date().getFullYear(), 10, 15)
  }

  analyze(): OptimizationResult {
    const suggestions: Suggestion[] = []
    const warnings: Warning[] = []

    // Analyze space utilization
    const spaceAnalysis = this.analyzeSpaceUtilization()
    suggestions.push(...spaceAnalysis.suggestions)
    warnings.push(...spaceAnalysis.warnings)

    // Analyze companion planting
    const companionAnalysis = this.analyzeCompanionPlanting()
    suggestions.push(...companionAnalysis.suggestions)
    warnings.push(...companionAnalysis.warnings)

    // Analyze sun exposure
    const sunAnalysis = this.analyzeSunExposure()
    suggestions.push(...sunAnalysis.suggestions)
    warnings.push(...sunAnalysis.warnings)

    // Calculate yield predictions
    const yieldPrediction = this.calculateYieldPrediction()

    // Calculate resource efficiency
    const resourceEfficiency = this.calculateResourceEfficiency()

    // Calculate biodiversity score
    const biodiversityScore = this.calculateBiodiversityScore()

    // Calculate overall optimization score
    const score = this.calculateOptimizationScore({
      spaceUtilization: resourceEfficiency.spaceUtilization,
      companionScore: companionAnalysis.score,
      biodiversityScore,
      resourceEfficiency: resourceEfficiency.waterEfficiency
    })

    return {
      score,
      suggestions: this.prioritizeSuggestions(suggestions),
      warnings: this.prioritizeWarnings(warnings),
      yieldPrediction,
      resourceEfficiency,
      biodiversityScore
    }
  }

  private analyzeSpaceUtilization(): { suggestions: Suggestion[], warnings: Warning[] } {
    const suggestions: Suggestion[] = []
    const warnings: Warning[] = []

    const beds = this.nodes.filter(isBedNode)
    const plants = this.nodes.filter(isPlantNode)

    // Calculate total bed area and planted area
    let totalBedArea = 0
    let plantedArea = 0

    beds.forEach(bed => {
      const area = (bed.size.widthIn * bed.size.heightIn) / 144 // sq ft
      totalBedArea += area

      // Find plants in this bed
      const plantsInBed = plants.filter(plant =>
        plant.parentBedId === bed.id
      )

      // Calculate planted area
      plantsInBed.forEach(plant => {
        const plantData = PLANT_YIELDS[plant.plant.plantId]
        if (plantData) {
          plantedArea += 1 / plantData.plantsPerSqFt
        }
      })
    })

    const utilizationPercent = totalBedArea > 0 ? (plantedArea / totalBedArea) * 100 : 0

    if (utilizationPercent < 60) {
      suggestions.push({
        type: 'spacing',
        priority: 'high',
        title: 'Underutilized Garden Space',
        description: `Only ${utilizationPercent.toFixed(0)}% of bed space is planted`,
        impact: `Could increase yield by ${((100 - utilizationPercent) * 0.7).toFixed(0)}%`,
        implementation: [
          'Use succession planting for continuous harvests',
          'Interplant quick-growing crops between slower ones',
          'Add vertical growing structures for vining plants'
        ]
      })
    }

    // Check for overcrowding
    plants.forEach(plant => {
      const nearbyPlants = plants.filter(other =>
        other.id !== plant.id &&
        Math.abs(other.transform.xIn - plant.transform.xIn) < 12 &&
        Math.abs(other.transform.yIn - plant.transform.yIn) < 12
      )

      if (nearbyPlants.length > 3) {
        warnings.push({
          type: 'spacing',
          severity: 'warning',
          title: 'Potential Overcrowding',
          description: `${plant.plant.commonName} may be too close to other plants`,
          affectedElements: [plant.id, ...nearbyPlants.map(p => p.id)],
          solution: 'Consider thinning or relocating some plants for better airflow'
        })
      }
    })

    return { suggestions, warnings }
  }

  private analyzeCompanionPlanting(): {
    suggestions: Suggestion[],
    warnings: Warning[],
    score: number
  } {
    const suggestions: Suggestion[] = []
    const warnings: Warning[] = []
    let goodPairings = 0
    let badPairings = 0

    const plants = this.nodes.filter(isPlantNode)

    plants.forEach(plant => {
      const plantType = plant.plant.plantId
      const companions = COMPANION_MATRIX[plantType]
      if (!companions) return

      // Find nearby plants (within 36 inches)
      const nearbyPlants = plants.filter(other =>
        other.id !== plant.id &&
        Math.abs(other.transform.xIn - plant.transform.xIn) < 36 &&
        Math.abs(other.transform.yIn - plant.transform.yIn) < 36
      )

      nearbyPlants.forEach(nearby => {
        const nearbyType = nearby.plant.plantId

        if (companions.bad.includes(nearbyType)) {
          badPairings++
          warnings.push({
            type: 'conflict',
            severity: 'warning',
            title: 'Incompatible Plants',
            description: `${plant.plant.commonName} and ${nearby.plant.commonName} should not be planted together`,
            affectedElements: [plant.id, nearby.id],
            solution: `Move one plant at least 4 feet away or add a barrier crop between them`
          })
        }

        if (companions.good.includes(nearbyType)) {
          goodPairings++
        }
      })

      // Suggest good companions that aren't present
      const missingCompanions = companions.good.filter(comp =>
        !nearbyPlants.some(p => p.plant.plantId === comp)
      )

      if (missingCompanions.length > 0 && Math.random() > 0.7) {
        suggestions.push({
          type: 'companion',
          priority: 'low',
          title: `Add Companion Plants for ${plant.plant.commonName}`,
          description: `Consider planting ${missingCompanions.slice(0, 3).join(', ')} nearby`,
          impact: 'Improves pest resistance and growth',
          implementation: [
            `Plant within 2-3 feet of ${plant.plant.commonName}`,
            'These companions can share nutrients and deter pests'
          ]
        })
      }
    })

    const score = goodPairings > 0 || badPairings > 0
      ? (goodPairings / (goodPairings + badPairings)) * 100
      : 50

    return { suggestions, warnings, score }
  }

  private analyzeSunExposure(): { suggestions: Suggestion[], warnings: Warning[] } {
    const suggestions: Suggestion[] = []
    const warnings: Warning[] = []

    const beds = this.nodes.filter(isBedNode)

    beds.forEach(bed => {
      // Check orientation for sun exposure
      if (bed.bed.orientation === 'EW') {
        suggestions.push({
          type: 'placement',
          priority: 'medium',
          title: 'Consider North-South Orientation',
          description: `Bed "${bed.bed.familyTag}" runs East-West`,
          impact: 'North-South orientation provides more even sun exposure',
          implementation: [
            'Rotate bed 90 degrees if possible',
            'Or plant taller crops on the north side'
          ]
        })
      }

      // Check for shade structures
      const nearbyStructures = this.nodes.filter(n =>
        n.type === 'Structure' &&
        Math.abs(n.transform.xIn - bed.transform.xIn) < 120 &&
        n.transform.yIn < bed.transform.yIn // Structure is to the south
      )

      if (nearbyStructures.length > 0) {
        warnings.push({
          type: 'climate',
          severity: 'info',
          title: 'Potential Shading',
          description: `Bed "${bed.bed.familyTag}" may receive shade from nearby structures`,
          affectedElements: [bed.id],
          solution: 'Plant shade-tolerant crops or relocate sun-loving plants'
        })
      }
    })

    return { suggestions, warnings }
  }

  private calculateYieldPrediction(): YieldPrediction {
    const plants = this.nodes.filter(isPlantNode)
    const byPlant: PlantYield[] = []
    let totalYieldLbs = 0
    let caloriesTotal = 0
    let marketValue = 0
    const harvestSchedule: HarvestEvent[] = []

    plants.forEach(plant => {
      const yieldData = PLANT_YIELDS[plant.plant.plantId]
      if (!yieldData) return

      const expectedYield = yieldData.yieldPerPlant.average
      const plantYield: PlantYield = {
        plantId: plant.id,
        name: plant.plant.commonName,
        expectedYieldLbs: expectedYield,
        yieldRangeMin: yieldData.yieldPerPlant.min,
        yieldRangeMax: yieldData.yieldPerPlant.max,
        harvestWindow: {
          start: new Date(this.lastFrostDate.getTime() + 60 * 24 * 60 * 60 * 1000),
          end: new Date(this.lastFrostDate.getTime() + (60 + yieldData.harvestDuration) * 24 * 60 * 60 * 1000)
        },
        nutritionalValue: {
          calories: yieldData.caloriesPerLb * expectedYield,
          protein: expectedYield * 2, // Simplified
          vitamins: yieldData.nutrition.vitamins,
          minerals: yieldData.nutrition.minerals,
          antioxidants: yieldData.nutrition.antioxidants
        }
      }

      byPlant.push(plantYield)
      totalYieldLbs += expectedYield
      caloriesTotal += yieldData.caloriesPerLb * expectedYield
      marketValue += yieldData.marketValuePerLb * expectedYield

      // Generate harvest events
      const harvestStart = plantYield.harvestWindow.start
      const harvestWeeks = Math.ceil(yieldData.harvestDuration / 7)

      for (let week = 0; week < harvestWeeks; week++) {
        harvestSchedule.push({
          date: new Date(harvestStart.getTime() + week * 7 * 24 * 60 * 60 * 1000),
          plant: plant.plant.commonName,
          quantityLbs: expectedYield / harvestWeeks,
          tasks: week === 0 ? ['First harvest', 'Check ripeness daily'] : ['Continue harvesting']
        })
      }
    })

    // Calculate nutrition score (0-100)
    const uniqueVitamins = new Set(byPlant.flatMap(p => p.nutritionalValue.vitamins))
    const uniqueMinerals = new Set(byPlant.flatMap(p => p.nutritionalValue.minerals))
    const avgAntioxidants = byPlant.reduce((sum, p) => sum + p.nutritionalValue.antioxidants, 0) / (byPlant.length || 1)

    const nutritionScore = Math.min(100,
      (uniqueVitamins.size * 5) +
      (uniqueMinerals.size * 5) +
      (avgAntioxidants * 0.5)
    )

    return {
      totalYieldLbs,
      byPlant,
      caloriesTotal,
      nutritionScore,
      harvestSchedule: harvestSchedule.sort((a, b) => a.date.getTime() - b.date.getTime()),
      marketValue
    }
  }

  private calculateResourceEfficiency(): ResourceMetrics {
    const beds = this.nodes.filter(isBedNode)
    const plants = this.nodes.filter(isPlantNode)

    // Calculate water efficiency
    let totalWaterNeeded = 0
    let totalWaterCapacity = 0

    plants.forEach(plant => {
      const yieldData = PLANT_YIELDS[plant.plant.plantId]
      if (yieldData) {
        totalWaterNeeded += yieldData.waterNeeds
      }
    })

    // Check for water-saving features
    const hasWickingBeds = beds.some(bed => bed.bed.wicking)
    const hasDripIrrigation = this.nodes.some(n => n.type === 'Irrigation' && n.irrigation.irrigationType === 'drip-line')
    const hasRainBarrel = this.nodes.some(n => n.type === 'Irrigation' && n.irrigation.irrigationType === 'rain-barrel')

    let waterEfficiency = 50
    if (hasWickingBeds) waterEfficiency += 20
    if (hasDripIrrigation) waterEfficiency += 15
    if (hasRainBarrel) waterEfficiency += 15

    // Calculate space utilization
    const totalBedArea = beds.reduce((sum, bed) =>
      sum + (bed.size.widthIn * bed.size.heightIn) / 144, 0
    )
    const plantedArea = plants.length * 2 // Simplified: 2 sq ft per plant average
    const spaceUtilization = totalBedArea > 0 ? Math.min(100, (plantedArea / totalBedArea) * 100) : 0

    // Calculate soil health based on diversity and practices
    const hasCompost = this.nodes.some(n => n.type === 'Compost')
    const hasNitrogenFixers = plants.some(p => PLANT_YIELDS[p.plant.plantId]?.nitrogenFixing)
    const cropDiversity = new Set(plants.map(p => p.plant.plantId)).size

    let soilHealth = 40
    if (hasCompost) soilHealth += 25
    if (hasNitrogenFixers) soilHealth += 15
    soilHealth += Math.min(20, cropDiversity * 4)

    // Calculate energy balance
    const yieldPrediction = this.calculateYieldPrediction()
    const laborHours = beds.length * 2 + plants.length * 0.5 // Simplified estimate
    const inputCalories = laborHours * 200 // Calories burned per hour gardening
    const energyBalance = inputCalories > 0 ? yieldPrediction.caloriesTotal / inputCalories : 0

    // Calculate cost efficiency
    const setupCost = beds.length * 50 + plants.length * 3 // Simplified costs
    const costEfficiency = setupCost > 0 ? yieldPrediction.marketValue / setupCost : 0

    return {
      waterEfficiency,
      spaceUtilization,
      soilHealth,
      energyBalance,
      laborHours,
      costEfficiency
    }
  }

  private calculateBiodiversityScore(): number {
    const plants = this.nodes.filter(isPlantNode)
    const uniqueSpecies = new Set(plants.map(p => p.plant.plantId)).size
    const hasNativePlants = plants.some(p => (p.meta?.tags as string[])?.includes('native'))
    const hasPollinatorPlants = plants.some(p =>
      (p.meta?.tags as string[])?.includes('pollinator') ||
      p.plant.plantId.includes('flower')
    )
    const hasPerennials = plants.some(p => (p.meta?.tags as string[])?.includes('perennial'))

    let score = Math.min(40, uniqueSpecies * 8)
    if (hasNativePlants) score += 20
    if (hasPollinatorPlants) score += 20
    if (hasPerennials) score += 20

    return Math.min(100, score)
  }

  private calculateOptimizationScore(metrics: {
    spaceUtilization: number
    companionScore: number
    biodiversityScore: number
    resourceEfficiency: number
  }): number {
    const weights = {
      spaceUtilization: 0.25,
      companionScore: 0.25,
      biodiversityScore: 0.25,
      resourceEfficiency: 0.25
    }

    return Object.entries(metrics).reduce((score, [key, value]) =>
      score + value * weights[key as keyof typeof weights], 0
    )
  }

  private prioritizeSuggestions(suggestions: Suggestion[]): Suggestion[] {
    const priority = { high: 3, medium: 2, low: 1 }
    return suggestions.sort((a, b) => priority[b.priority] - priority[a.priority])
  }

  private prioritizeWarnings(warnings: Warning[]): Warning[] {
    const severity = { error: 3, warning: 2, info: 1 }
    return warnings.sort((a, b) => severity[b.severity] - severity[a.severity])
  }

  // Generate personalized recommendations
  generateRecommendations(): string[] {
    const result = this.analyze()
    const recommendations: string[] = []

    // Space efficiency recommendations
    if (result.resourceEfficiency.spaceUtilization < 70) {
      recommendations.push(
        '🌱 **Maximize Space**: Use vertical growing, succession planting, and interplanting to increase yields by up to 40%'
      )
    }

    // Water efficiency recommendations
    if (result.resourceEfficiency.waterEfficiency < 60) {
      recommendations.push(
        '💧 **Improve Water Efficiency**: Add drip irrigation, mulching, and rain collection to reduce water use by 30-50%'
      )
    }

    // Biodiversity recommendations
    if (result.biodiversityScore < 50) {
      recommendations.push(
        '🦋 **Increase Biodiversity**: Add native plants, flowers for pollinators, and diverse crop varieties for a healthier ecosystem'
      )
    }

    // Yield optimization
    if (result.yieldPrediction.totalYieldLbs < 100) {
      recommendations.push(
        '🥕 **Boost Yields**: Focus on high-yield crops, improve soil health with compost, and optimize plant spacing'
      )
    }

    // Soil health
    if (result.resourceEfficiency.soilHealth < 60) {
      recommendations.push(
        '🌍 **Build Soil Health**: Add compost bins, plant nitrogen-fixing crops, and use crop rotation to improve fertility naturally'
      )
    }

    return recommendations
  }
}