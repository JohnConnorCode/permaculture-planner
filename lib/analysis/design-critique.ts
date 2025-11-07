/**
 * Design Critique Engine
 *
 * Analyzes permaculture designs and provides professional recommendations
 * Like having an expert review your design
 *
 * Checks for:
 * - Permaculture principle application
 * - Common design mistakes
 * - Optimization opportunities
 * - Site-specific improvements
 * - Resource efficiency
 */

import { GardenBed } from '@/lib/garden/garden-types'
import { PLANT_LIBRARY } from '@/lib/data/plant-library'

export interface DesignIssue {
  severity: 'critical' | 'warning' | 'suggestion'
  category: 'spacing' | 'companion' | 'water' | 'sun' | 'succession' | 'biodiversity' | 'efficiency'
  title: string
  description: string
  recommendation: string
  affectedElements?: string[]
}

export interface DesignCritique {
  overallScore: number // 0-100
  issues: DesignIssue[]
  strengths: string[]
  quickWins: string[]
  longTermImprovements: string[]
}

/**
 * Analyze design and provide comprehensive critique
 */
export function analyzeDesign(beds: GardenBed[]): DesignCritique {
  const issues: DesignIssue[] = []
  const strengths: string[] = []
  const quickWins: string[] = []
  const longTermImprovements: string[] = []

  const allPlants = beds.flatMap(bed => bed.plants || [])
  const totalPlants = allPlants.length

  // Check 1: Biodiversity
  const uniqueSpecies = new Set(allPlants.map(p => p.plantId)).size
  const biodiversityRatio = totalPlants > 0 ? uniqueSpecies / totalPlants : 0

  if (biodiversityRatio < 0.3) {
    issues.push({
      severity: 'warning',
      category: 'biodiversity',
      title: 'Low Plant Diversity',
      description: `Only ${uniqueSpecies} different species planted. Monocultures are vulnerable to pests and disease.`,
      recommendation: 'Add at least 10 different plant species for resilience. Mix annuals and perennials.',
    })
    quickWins.push('Add 5-7 different companion plants to increase diversity')
  } else if (biodiversityRatio > 0.5) {
    strengths.push(`Excellent biodiversity with ${uniqueSpecies} species - this creates ecosystem resilience`)
  }

  // Check 2: Nitrogen Fixers
  const nitrogenFixers = allPlants.filter(p =>
    ['beans', 'peas', 'clover', 'alfalfa'].includes(p.plantId)
  ).length

  if (nitrogenFixers === 0 && totalPlants > 5) {
    issues.push({
      severity: 'warning',
      category: 'succession',
      title: 'No Nitrogen Fixers',
      description: 'Your design lacks nitrogen-fixing plants that build soil fertility.',
      recommendation: 'Add legumes (beans, peas, clover) to build soil nitrogen naturally. Aim for 20-30% nitrogen fixers.',
    })
    quickWins.push('Plant clover as ground cover or add peas/beans to beds')
  } else if (nitrogenFixers > 0) {
    strengths.push(`Good use of nitrogen fixers (${nitrogenFixers} plants) for soil building`)
  }

  // Check 3: Perennial vs Annual Balance
  const perennials = allPlants.filter(p =>
    ['berries', 'fruit_trees', 'nut_trees', 'asparagus', 'rhubarb'].includes(p.plantId)
  ).length
  const perennialRatio = totalPlants > 0 ? perennials / totalPlants : 0

  if (perennialRatio === 0 && totalPlants > 10) {
    issues.push({
      severity: 'suggestion',
      category: 'succession',
      title: 'All Annual Plants',
      description: 'Design relies entirely on annual crops requiring yearly replanting.',
      recommendation: 'Add perennials (fruit trees, berries, herbs) for long-term abundance with less work.',
    })
    longTermImprovements.push('Transition 30-40% of garden to perennials over 3-5 years')
  } else if (perennialRatio > 0.2) {
    strengths.push(`Strong perennial foundation (${Math.round(perennialRatio * 100)}%) reduces annual work`)
  }

  // Check 4: Plant Spacing (detect overcrowding)
  let overcrowdedBeds = 0
  beds.forEach(bed => {
    if (bed.plants && bed.plants.length > 0) {
      const bedArea = (bed.width || 48) * (bed.height || 96) // square inches
      const plantsPerSqFt = (bed.plants.length / bedArea) * 144

      if (plantsPerSqFt > 4) { // More than 4 plants per square foot
        overcrowdedBeds++
      }
    }
  })

  if (overcrowdedBeds > 0) {
    issues.push({
      severity: 'warning',
      category: 'spacing',
      title: 'Overcrowding Detected',
      description: `${overcrowdedBeds} bed(s) appear overcrowded. Plants need space for roots and airflow.`,
      recommendation: 'Follow spacing guidelines: small plants 6-12", medium 12-18", large 24-36" apart.',
      affectedElements: beds.filter((bed, idx) => idx < overcrowdedBeds).map(b => b.name),
    })
  }

  // Check 5: Water Efficiency
  const hasWaterElements = beds.some(bed =>
    bed.elementCategory === 'water_management' || bed.elementType === 'pond'
  )

  if (!hasWaterElements && beds.length > 3) {
    issues.push({
      severity: 'suggestion',
      category: 'water',
      title: 'No Water Features',
      description: 'Design lacks water catchment or storage elements.',
      recommendation: 'Add rain barrels, swales, or small pond for water resilience and habitat.',
    })
    longTermImprovements.push('Install rainwater catchment system (250+ gallon capacity)')
  }

  // Check 6: Edge Effects
  const pathBeds = beds.filter(bed =>
    bed.elementCategory === 'access' || bed.elementType === 'path'
  ).length

  if (pathBeds === 0 && beds.length > 4) {
    issues.push({
      severity: 'suggestion',
      category: 'efficiency',
      title: 'No Defined Paths',
      description: "Without paths, you'll compact soil and damage plants accessing beds.",
      recommendation: 'Add pathways between beds - mulched paths work well and suppress weeds.',
    })
    quickWins.push('Lay down cardboard + wood chips for instant pathways')
  }

  // Check 7: Pollinator Support
  const pollinatorPlants = allPlants.filter(p => {
    const plantInfo = PLANT_LIBRARY.find(lib => lib.id === p.plantId)
    // Consider flowers and herbs as pollinator plants
    return plantInfo?.category === 'flower' || plantInfo?.category === 'herb'
  }).length

  if (pollinatorPlants === 0 && totalPlants > 5) {
    issues.push({
      severity: 'warning',
      category: 'biodiversity',
      title: 'No Pollinator Plants',
      description: 'Many crops need pollinators. Attract them with flowers.',
      recommendation: 'Add pollinator-friendly plants: sunflowers, marigolds, herbs, native wildflowers.',
    })
    quickWins.push('Plant marigolds, nasturtiums, or herbs throughout garden')
  }

  // Check 8: Succession Planting
  // (Simplified - would need planting dates to truly check)
  if (totalPlants > 10 && uniqueSpecies < 5) {
    issues.push({
      severity: 'suggestion',
      category: 'succession',
      title: 'Limited Succession',
      description: 'Planting similar crops means harvest all at once, then nothing.',
      recommendation: 'Stagger plantings of same crop every 2 weeks for continuous harvest.',
    })
  }

  // Calculate overall score
  let score = 100
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 20
    else if (issue.severity === 'warning') score -= 10
    else score -= 5
  })

  // Bonus points for strengths
  score += Math.min(20, strengths.length * 5)
  score = Math.max(0, Math.min(100, score))

  // Default strengths if design is good
  if (strengths.length === 0 && issues.length === 0) {
    strengths.push('Solid design foundation - ready to implement!')
  }

  // Default quick wins if none found
  if (quickWins.length === 0) {
    quickWins.push('Add mulch around plants to retain moisture and suppress weeds')
    quickWins.push('Install drip irrigation for water efficiency')
  }

  return {
    overallScore: Math.round(score),
    issues,
    strengths,
    quickWins,
    longTermImprovements,
  }
}

/**
 * Get severity color for UI
 */
export function getSeverityColor(severity: DesignIssue['severity']): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200'
    case 'warning':
      return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200'
    case 'suggestion':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200'
  }
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: DesignIssue['category']): string {
  switch (category) {
    case 'spacing':
      return '📏'
    case 'companion':
      return '🤝'
    case 'water':
      return '💧'
    case 'sun':
      return '☀️'
    case 'succession':
      return '🔄'
    case 'biodiversity':
      return '🦋'
    case 'efficiency':
      return '⚡'
  }
}
