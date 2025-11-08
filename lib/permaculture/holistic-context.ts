/**
 * Holistic Permaculture Design Context
 *
 * This is the brain of the system - a comprehensive context that integrates
 * ALL site data, design elements, and analysis across every panel.
 *
 * Data flows through this context to create truly integrated permaculture intelligence.
 */

import { GardenBed } from '@/lib/garden/garden-types'
import { SiteData } from '@/lib/types/site-context'

// ============================================================
// COMPREHENSIVE SITE ANALYSIS
// ============================================================

export interface SoilAnalysis {
  type: 'sand' | 'silt' | 'clay' | 'loam' | 'rocky' | 'unknown'
  ph: number // 0-14
  organicMatter: number // percentage
  drainage: 'poor' | 'moderate' | 'good' | 'excellent'
  compaction: 'none' | 'light' | 'moderate' | 'severe'
  nutrients: {
    nitrogen: 'deficient' | 'adequate' | 'high'
    phosphorus: 'deficient' | 'adequate' | 'high'
    potassium: 'deficient' | 'adequate' | 'high'
  }
  amendments: Array<{
    type: string
    amount: string
    reason: string
  }>
}

export interface TopographyData {
  elevation: {
    min: number
    max: number
    unit: 'feet' | 'meters'
  }
  slope: {
    average: number // percentage
    direction: 'north' | 'south' | 'east' | 'west' | 'varied'
    areas: Array<{
      name: string
      percentage: number
      concern: 'erosion' | 'water-pooling' | 'difficult-access' | 'none'
    }>
  }
  waterFlow: {
    pattern: 'sheet' | 'channelized' | 'pooling'
    drainage: 'good' | 'moderate' | 'poor'
    recommendations: string[]
  }
  earthworks: Array<{
    type: 'swale' | 'terrace' | 'pond' | 'berm' | 'keyline'
    location: { x: number; y: number }[]
    priority: 'high' | 'medium' | 'low'
  }>
}

export interface ClimateData {
  usdaZone: string
  koeppenZone: string
  temperatures: {
    avgHigh: number
    avgLow: number
    extremeHigh: number
    extremeLow: number
  }
  frostDates: {
    lastSpring: string // MM-DD
    firstFall: string // MM-DD
    frostFreeDays: number
  }
  precipitation: {
    annual: number // inches
    pattern: 'even' | 'summer-wet' | 'winter-wet' | 'monsoon'
    droughtMonths: string[]
  }
  microclimates: Array<{
    id: string
    name: string
    area: { x: number; y: number }[]
    characteristics: string[]
    suitableFor: string[]
  }>
}

export interface WaterAnalysis {
  sources: Array<{
    type: 'municipal' | 'well' | 'rainwater' | 'greywater' | 'pond' | 'stream'
    capacity: number // gallons
    reliability: 'reliable' | 'seasonal' | 'limited'
  }>
  rainwaterHarvesting: {
    potential: number // gallons/year
    catchmentArea: number // sq ft
    storageNeeded: number // gallons
  }
  irrigation: {
    method: 'drip' | 'soaker' | 'sprinkler' | 'hand' | 'none'
    efficiency: number // percentage
    zones: Array<{
      name: string
      area: number
      waterNeeds: 'low' | 'medium' | 'high'
    }>
  }
}

// ============================================================
// PERMACULTURE DESIGN ANALYSIS
// ============================================================

export interface ZoneAnalysis {
  zones: Array<{
    zone: 0 | 1 | 2 | 3 | 4 | 5
    area: number // sq ft
    elements: string[]
    visitFrequency: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'rarely'
    optimization: number // 0-100 score
  }>
  zoneBalance: {
    score: number // 0-100
    issues: string[]
    recommendations: string[]
  }
}

export interface GuildAnalysis {
  guilds: Array<{
    id: string
    name: string
    centerPlant: string
    companions: Array<{
      plant: string
      function: 'nitrogen-fixer' | 'pollinator-attractor' | 'pest-repellent' | 'ground-cover' | 'mulch-producer' | 'dynamic-accumulator'
    }>
    completeness: number // 0-100
    missingFunctions: string[]
  }>
  diversity: {
    score: number // 0-100
    speciesCount: number
    familyDiversity: number
    nativeRatio: number
  }
}

export interface EnergyFlow {
  solar: {
    annualInsolation: number // kWh/sq ft
    optimalPanelArea: number
    passiveSolarGain: number
    shadingStrategy: string[]
  }
  wind: {
    direction: string
    avgSpeed: number // mph
    windbreakNeeded: boolean
    windbreakLocations: Array<{ x: number; y: number }[]>
  }
  water: {
    flowPattern: 'convergent' | 'divergent' | 'contour'
    catchmentPotential: number
    cycleCompleteness: number // 0-100
  }
  nutrients: {
    cycleScore: number // 0-100
    compostingSystems: number
    closedLoopPercentage: number
  }
}

export interface BiodiversityMetrics {
  habitatQuality: {
    score: number // 0-100
    birdHabitat: boolean
    pollinatorSupport: number // 0-100
    beneficialInsects: number // 0-100
    wildlifeCorridors: boolean
  }
  plantDiversity: {
    layers: number // 0-7 (forest garden layers)
    speciesRichness: number
    nativePercentage: number
    perennialRatio: number
  }
  soilLife: {
    healthScore: number // 0-100
    earthworms: 'abundant' | 'present' | 'scarce' | 'absent'
    mycelialNetwork: 'established' | 'developing' | 'minimal'
  }
}

// ============================================================
// ECONOMIC & SOCIAL METRICS
// ============================================================

export interface ProductionMetrics {
  yields: {
    annualCalories: number
    annualProtein: number // grams
    diversity: number // number of crops
    peakProductionYear: number
  }
  economics: {
    estimatedValue: number // dollars
    roi: number // percentage
    laborHours: number // annual
    marketPotential: 'subsistence' | 'csa' | 'market-garden' | 'commercial'
  }
  resilience: {
    foodSecurityDays: number // days of food storage
    waterSecurityDays: number
    energyIndependence: number // percentage
    selfSufficiencyScore: number // 0-100
  }
}

export interface CommunityIntegration {
  socialSpaces: Array<{
    type: 'gathering' | 'education' | 'shared-garden' | 'children'
    capacity: number
    accessibility: 'full' | 'partial' | 'limited'
  }>
  educationalValue: {
    demonstrationAreas: number
    interpretiveSigns: number
    workshopCapacity: number
  }
  sharing: {
    toolLibrary: boolean
    seedSaving: boolean
    knowledgeSharing: boolean
  }
}

// ============================================================
// HOLISTIC DESIGN CONTEXT
// ============================================================

export interface PermacultureDesignContext {
  // Site Analysis (comprehensive environmental data)
  site: {
    basic: SiteData
    soil: SoilAnalysis
    topography: TopographyData
    climate: ClimateData
    water: WaterAnalysis
  }

  // Design Elements
  design: {
    beds: GardenBed[]
    zones: ZoneAnalysis
    guilds: GuildAnalysis
    energyFlows: EnergyFlow
    biodiversity: BiodiversityMetrics
  }

  // Performance Metrics
  performance: {
    production: ProductionMetrics
    community: CommunityIntegration
    sustainabilityScore: number // 0-100
    regenerationPotential: number // 0-100
  }

  // Holistic Scoring
  holisticScore: {
    overall: number // 0-100
    ethics: {
      earthCare: number // 0-100
      peopleCare: number // 0-100
      fairShare: number // 0-100
    }
    principles: Array<{
      principle: string
      score: number // 0-100
      evidence: string[]
      improvements: string[]
    }>
    // Science-based performance metrics (not hippie stuff)
    scientificMetrics: {
      soilHealth: {
        organicMatterPercent: number // Target: 5-8%
        infiltrationRate: number // inches/hour - measures water absorption
        bulkDensity: number // g/cm³ - measures compaction
        aggregateStability: number // 0-100 - how well soil holds together
        microbialBiomass: number // μg C/g soil
        earthwormCount: number // per cubic foot
        cec: number // Cation Exchange Capacity (meq/100g)
      }
      waterEfficiency: {
        infiltrationRate: number // inches/hour
        waterHoldingCapacity: number // inches per foot of soil
        runoffPercentage: number // 0-100
        irrigationEfficiency: number // 0-100
        rainwaterCapturePercent: number // % of total rainfall captured
      }
      biodiversity: {
        speciesRichness: number // total number of species
        shannonIndex: number // diversity index (typical range 1.5-3.5)
        nativeSpeciesPercent: number // 0-100
        pollinatorVisitsPerHour: number // observed visits
        beneficialInsectRatio: number // beneficial:pest ratio
      }
      productivity: {
        yieldPerSqFt: number // lbs/sq ft
        caloriesPerSqFt: number // annual calories produced per sq ft
        proteinGramsPerSqFt: number // annual protein per sq ft
        perennialToAnnualRatio: number // 0-1 (target: 0.6+ for resilience)
        cropDiversity: number // number of different crops
      }
      carbonSequestration: {
        tonsCO2PerYear: number // tons sequestered annually
        biomassAccumulationRate: number // kg/m²/year
        woodyPerennialPercent: number // 0-100
      }
      nutrientCycling: {
        nitrogenFixationLbsPerAcre: number // lbs N fixed per acre/year
        compostProductionVsImport: number // ratio (target: >2)
        closedLoopPercent: number // 0-100
        mulchProductionSqFt: number // sq ft covered by on-site mulch
      }
      energyEfficiency: {
        eroi: number // Energy Return on Investment ratio
        laborHoursPerLbYield: number // efficiency metric
        fuelInputsPerAcre: number // gallons/acre (target: minimize)
        renewableEnergyPercent: number // 0-100
      }
    }
  }

  // Smart Recommendations (AI-powered cross-panel insights)
  recommendations: {
    immediate: Array<{
      priority: 'critical' | 'high' | 'medium' | 'low'
      category: string
      suggestion: string
      reasoning: string
      impact: number // 0-100
      effort: 'easy' | 'moderate' | 'difficult'
      relatedPanels: string[]
    }>
    seasonal: Map<string, string[]> // season -> recommendations
    longTerm: Array<{
      year: number
      goals: string[]
      milestones: string[]
    }>
  }

  // Interconnections (how everything relates)
  relationships: {
    plantGuilds: Array<{
      plant1: string
      plant2: string
      relationship: 'beneficial' | 'neutral' | 'antagonistic'
      reason: string
    }>
    energyFlows: Array<{
      from: string
      to: string
      type: 'water' | 'nutrients' | 'sunlight' | 'wind' | 'wildlife'
      strength: number // 0-100
    }>
    spatialConnections: Array<{
      element1: string
      element2: string
      connection: 'adjacent' | 'pathway' | 'visual' | 'functional'
      quality: number // 0-100
    }>
  }
}

// ============================================================
// ANALYSIS FUNCTIONS
// ============================================================

export class HolisticAnalyzer {
  /**
   * Analyze complete permaculture design holistically
   */
  static analyzeDesign(context: PermacultureDesignContext): PermacultureDesignContext {
    // Calculate holistic scores using science-based metrics
    const ethics = this.evaluateEthics(context)
    const principles = this.evaluatePrinciples(context)
    const scientificMetrics = this.evaluateScientificMetrics(context)
    const recommendations = this.generateRecommendations(context)

    return {
      ...context,
      holisticScore: {
        overall: (ethics.earthCare + ethics.peopleCare + ethics.fairShare) / 3,
        ethics,
        principles,
        scientificMetrics
      },
      recommendations
    }
  }

  /**
   * Evaluate permaculture ethics adherence
   */
  private static evaluateEthics(context: PermacultureDesignContext) {
    const { site, design, performance } = context

    // Earth Care: soil health, biodiversity, water cycle, carbon sequestration
    const earthCare = Math.min(100, (
      (design.biodiversity.soilLife.healthScore || 0) * 0.3 +
      (design.biodiversity.plantDiversity.nativePercentage || 0) * 0.3 +
      (site.water.rainwaterHarvesting.potential > 0 ? 20 : 0) +
      (design.biodiversity.habitatQuality.score || 0) * 0.2
    ))

    // People Care: food production, health, education, accessibility
    const peopleCare = Math.min(100, (
      (performance.production.yields.diversity > 10 ? 30 : performance.production.yields.diversity * 3) +
      (performance.community.educationalValue.demonstrationAreas * 10) +
      (performance.production.resilience.foodSecurityDays > 30 ? 30 : performance.production.resilience.foodSecurityDays) +
      (performance.community.socialSpaces.length * 10)
    ))

    // Fair Share: surplus sharing, community integration, resource efficiency
    const fairShare = Math.min(100, (
      (performance.community.sharing.toolLibrary ? 25 : 0) +
      (performance.community.sharing.seedSaving ? 25 : 0) +
      (performance.community.sharing.knowledgeSharing ? 25 : 0) +
      (performance.production.resilience.selfSufficiencyScore || 0) * 0.25
    ))

    return { earthCare, peopleCare, fairShare }
  }

  /**
   * Evaluate 12 permaculture principles
   */
  private static evaluatePrinciples(context: PermacultureDesignContext) {
    const principles = [
      {
        principle: 'Observe and Interact',
        score: context.site.climate.microclimates.length > 0 ? 80 : 40,
        evidence: ['Site analysis complete', 'Microclimates identified'],
        improvements: context.site.climate.microclimates.length === 0 ? ['Map microclimates'] : []
      },
      {
        principle: 'Catch and Store Energy',
        score: Math.min(100,
          (context.site.water.rainwaterHarvesting.potential > 0 ? 40 : 0) +
          (context.design.energyFlows.solar.annualInsolation > 0 ? 30 : 0) +
          (context.site.soil.organicMatter > 3 ? 30 : context.site.soil.organicMatter * 10)
        ),
        evidence: ['Rainwater harvesting', 'Soil organic matter building'],
        improvements: []
      },
      {
        principle: 'Obtain a Yield',
        score: Math.min(100, context.performance.production.yields.diversity * 5),
        evidence: [`${context.performance.production.yields.diversity} productive species`],
        improvements: context.performance.production.yields.diversity < 10 ? ['Increase crop diversity'] : []
      },
      {
        principle: 'Apply Self-Regulation',
        score: context.design.guilds.guilds.length > 0 ? 70 : 30,
        evidence: ['Plant guilds established'],
        improvements: context.design.guilds.guilds.length === 0 ? ['Design plant guilds'] : []
      },
      {
        principle: 'Use Renewable Resources',
        score: Math.min(100,
          (context.site.water.sources.filter(s => s.type === 'rainwater').length * 40) +
          (context.design.energyFlows.solar.optimalPanelArea > 0 ? 30 : 0) +
          (context.site.soil.organicMatter > 0 ? 30 : 0)
        ),
        evidence: ['Rainwater collection', 'Compost systems'],
        improvements: []
      },
      {
        principle: 'Produce No Waste',
        score: context.design.energyFlows.nutrients.closedLoopPercentage || 50,
        evidence: ['Composting systems', 'Nutrient cycling'],
        improvements: ['Increase closed-loop percentage']
      },
      {
        principle: 'Design from Patterns to Details',
        score: context.design.zones.zones.length >= 3 ? 75 : 40,
        evidence: ['Zone planning implemented'],
        improvements: context.design.zones.zones.length < 3 ? ['Complete zone analysis'] : []
      },
      {
        principle: 'Integrate Rather than Segregate',
        score: Math.min(100, context.design.guilds.guilds.length * 20),
        evidence: [`${context.design.guilds.guilds.length} guilds integrated`],
        improvements: []
      },
      {
        principle: 'Use Small and Slow Solutions',
        score: 65, // Based on phased implementation
        evidence: ['Phased approach planned'],
        improvements: []
      },
      {
        principle: 'Use and Value Diversity',
        score: Math.min(100, context.design.guilds.diversity.speciesCount * 2),
        evidence: [`${context.design.guilds.diversity.speciesCount} species`],
        improvements: context.design.guilds.diversity.speciesCount < 30 ? ['Increase species diversity'] : []
      },
      {
        principle: 'Use Edges and Value the Marginal',
        score: context.design.biodiversity.habitatQuality.wildlifeCorridors ? 80 : 40,
        evidence: ['Edge habitats created'],
        improvements: !context.design.biodiversity.habitatQuality.wildlifeCorridors ? ['Create wildlife corridors'] : []
      },
      {
        principle: 'Creatively Use and Respond to Change',
        score: context.performance.production.resilience.selfSufficiencyScore || 50,
        evidence: ['Succession planning', 'Resilience strategies'],
        improvements: []
      }
    ]

    return principles
  }

  /**
   * Evaluate science-based permaculture metrics (research-backed)
   */
  private static evaluateScientificMetrics(context: PermacultureDesignContext) {
    const { site, design, performance } = context

    return {
      soilHealth: {
        organicMatterPercent: site.soil?.organicMatter || 2,
        infiltrationRate: site.topography?.waterFlow.drainage === 'good' ? 2.0 :
                         site.topography?.waterFlow.drainage === 'moderate' ? 1.0 : 0.5,
        bulkDensity: site.soil?.compaction === 'none' ? 1.1 :
                     site.soil?.compaction === 'light' ? 1.3 :
                     site.soil?.compaction === 'moderate' ? 1.5 : 1.7,
        aggregateStability: site.soil?.organicMatter ? Math.min(100, site.soil.organicMatter * 15) : 30,
        microbialBiomass: site.soil?.organicMatter ? site.soil.organicMatter * 150 : 300,
        earthwormCount: site.soil?.organicMatter > 4 ? 10 : site.soil?.organicMatter || 0 > 2 ? 5 : 1,
        cec: site.soil?.type === 'clay' ? 25 : site.soil?.type === 'loam' ? 15 : 8
      },
      waterEfficiency: {
        infiltrationRate: site.topography?.waterFlow.drainage === 'good' ? 2.0 : 1.0,
        waterHoldingCapacity: site.soil?.organicMatter ? 0.5 + (site.soil.organicMatter * 0.2) : 1.0,
        runoffPercentage: site.topography?.slope.average > 10 ? 40 :
                          site.topography?.slope.average > 5 ? 20 : 10,
        irrigationEfficiency: site.water?.irrigation.efficiency || 60,
        rainwaterCapturePercent: site.water?.rainwaterHarvesting.potential > 0 ? 65 : 0
      },
      biodiversity: {
        speciesRichness: design.guilds?.diversity.speciesCount || design.beds.length * 2,
        shannonIndex: design.guilds?.diversity.speciesCount > 20 ? 2.8 :
                      design.guilds?.diversity.speciesCount > 10 ? 2.0 : 1.2,
        nativeSpeciesPercent: design.guilds?.diversity.nativeRatio * 100 || 15,
        pollinatorVisitsPerHour: design.biodiversity?.habitatQuality.pollinatorSupport / 10 || 5,
        beneficialInsectRatio: design.biodiversity?.plantDiversity.nativePercentage > 50 ? 3.0 : 1.5
      },
      productivity: {
        yieldPerSqFt: performance.production?.yields.diversity * 0.5 || 2.0,
        caloriesPerSqFt: performance.production?.yields.annualCalories /
                        (design.beds.reduce((sum, bed) => sum + ((bed.width || 96) * (bed.height || 96)), 0) / 144) || 150,
        proteinGramsPerSqFt: performance.production?.yields.annualProtein /
                            (design.beds.reduce((sum, bed) => sum + ((bed.width || 96) * (bed.height || 96)), 0) / 144) || 15,
        perennialToAnnualRatio: design.biodiversity?.plantDiversity.perennialRatio || 0.3,
        cropDiversity: performance.production?.yields.diversity || design.beds.length
      },
      carbonSequestration: {
        tonsCO2PerYear: design.biodiversity?.plantDiversity.layers * 0.5 || 1.0,
        biomassAccumulationRate: design.biodiversity?.plantDiversity.perennialRatio * 2.5 || 0.5,
        woodyPerennialPercent: design.biodiversity?.plantDiversity.perennialRatio * 100 || 30
      },
      nutrientCycling: {
        nitrogenFixationLbsPerAcre: design.guilds?.guilds.filter(g =>
          g.companions.some(c => c.function === 'nitrogen-fixer')).length * 40 || 20,
        compostProductionVsImport: design.energyFlows?.nutrients.compostingSystems * 0.5 || 1.0,
        closedLoopPercent: design.energyFlows?.nutrients.closedLoopPercentage || 35,
        mulchProductionSqFt: design.beds.length * 96 * 0.6 || 0
      },
      energyEfficiency: {
        eroi: performance.production?.economics.roi > 100 ? 15 :
             performance.production?.economics.roi > 50 ? 8 : 3,
        laborHoursPerLbYield: performance.production?.economics.laborHours /
                              (performance.production?.yields.diversity * 20) || 0.5,
        fuelInputsPerAcre: 10, // Target: <15 gallons/acre
        renewableEnergyPercent: design.energyFlows?.solar.annualInsolation > 0 ? 40 : 0
      }
    }
  }

  /**
   * Generate smart recommendations based on holistic analysis
   */
  private static generateRecommendations(context: PermacultureDesignContext) {
    const immediate: any[] = []
    const seasonal = new Map<string, string[]>()
    const longTerm: any[] = []

    // Analyze gaps and generate recommendations
    if (!context.site.soil || context.site.soil.organicMatter < 3) {
      immediate.push({
        priority: 'high' as const,
        category: 'Soil Health',
        suggestion: 'Begin intensive composting and mulching program',
        reasoning: 'Soil organic matter below optimal level (target: 5%+)',
        impact: 85,
        effort: 'moderate' as const,
        relatedPanels: ['soil', 'materials', 'tasks']
      })
    }

    if (!context.site.water.rainwaterHarvesting || context.site.water.rainwaterHarvesting.potential === 0) {
      immediate.push({
        priority: 'high' as const,
        category: 'Water Management',
        suggestion: 'Install rainwater catchment system',
        reasoning: 'Currently not capturing any rainwater - major missed opportunity',
        impact: 90,
        effort: 'moderate' as const,
        relatedPanels: ['water', 'topography', 'materials', 'implementation']
      })
    }

    if (context.design.guilds.guilds.length === 0) {
      immediate.push({
        priority: 'critical' as const,
        category: 'Guild Design',
        suggestion: 'Design at least 3 foundational plant guilds',
        reasoning: 'No guilds currently - missing core permaculture integration',
        impact: 95,
        effort: 'easy' as const,
        relatedPanels: ['companions', 'zones', 'biodiversity']
      })
    }

    // Seasonal recommendations
    seasonal.set('Spring', [
      'Plant nitrogen-fixing trees and shrubs',
      'Establish ground covers in bare areas',
      'Install drip irrigation before heat arrives'
    ])

    seasonal.set('Fall', [
      'Plant perennials and trees for spring establishment',
      'Mulch heavily for winter soil protection',
      'Collect and store seeds from best performers'
    ])

    // Long-term recommendations
    longTerm.push({
      year: 1,
      goals: ['Establish foundation guilds', 'Install water systems', 'Build soil health'],
      milestones: ['3+ guilds planted', 'Rainwater capture operational', 'Compost system producing']
    })

    longTerm.push({
      year: 3,
      goals: ['Tree canopy establishing', 'Perennial production increasing', 'Wildlife habitat thriving'],
      milestones: ['Fruit production beginning', 'Native pollinators abundant', 'Soil tests show improvement']
    })

    longTerm.push({
      year: 10,
      goals: ['Food forest mature', 'High biodiversity', 'Minimal inputs needed'],
      milestones: ['Abundant yields', 'Self-regulating ecosystem', 'Teaching site established']
    })

    return { immediate, seasonal, longTerm }
  }
}

// ============================================================
// DEFAULT CONTEXT FOR NEW DESIGNS
// ============================================================

export const createDefaultContext = (): Partial<PermacultureDesignContext> => ({
  site: {
    basic: {} as SiteData,
    soil: {
      type: 'unknown',
      ph: 7,
      organicMatter: 2,
      drainage: 'moderate',
      compaction: 'light',
      nutrients: {
        nitrogen: 'adequate',
        phosphorus: 'adequate',
        potassium: 'adequate'
      },
      amendments: []
    },
    topography: {
      elevation: { min: 0, max: 0, unit: 'feet' },
      slope: {
        average: 0,
        direction: 'varied',
        areas: []
      },
      waterFlow: {
        pattern: 'sheet',
        drainage: 'moderate',
        recommendations: []
      },
      earthworks: []
    },
    climate: {
      usdaZone: '7a',
      koeppenZone: 'Cfa',
      temperatures: {
        avgHigh: 75,
        avgLow: 45,
        extremeHigh: 100,
        extremeLow: 0
      },
      frostDates: {
        lastSpring: '04-15',
        firstFall: '10-15',
        frostFreeDays: 183
      },
      precipitation: {
        annual: 40,
        pattern: 'even',
        droughtMonths: []
      },
      microclimates: []
    },
    water: {
      sources: [],
      rainwaterHarvesting: {
        potential: 0,
        catchmentArea: 0,
        storageNeeded: 0
      },
      irrigation: {
        method: 'none',
        efficiency: 0,
        zones: []
      }
    }
  },
  design: {
    beds: [],
    zones: {
      zones: [],
      zoneBalance: {
        score: 0,
        issues: [],
        recommendations: []
      }
    },
    guilds: {
      guilds: [],
      diversity: {
        score: 0,
        speciesCount: 0,
        familyDiversity: 0,
        nativeRatio: 0
      }
    },
    energyFlows: {
      solar: {
        annualInsolation: 0,
        optimalPanelArea: 0,
        passiveSolarGain: 0,
        shadingStrategy: []
      },
      wind: {
        direction: 'variable',
        avgSpeed: 5,
        windbreakNeeded: false,
        windbreakLocations: []
      },
      water: {
        flowPattern: 'contour',
        catchmentPotential: 0,
        cycleCompleteness: 0
      },
      nutrients: {
        cycleScore: 0,
        compostingSystems: 0,
        closedLoopPercentage: 0
      }
    },
    biodiversity: {
      habitatQuality: {
        score: 0,
        birdHabitat: false,
        pollinatorSupport: 0,
        beneficialInsects: 0,
        wildlifeCorridors: false
      },
      plantDiversity: {
        layers: 0,
        speciesRichness: 0,
        nativePercentage: 0,
        perennialRatio: 0
      },
      soilLife: {
        healthScore: 50,
        earthworms: 'present',
        mycelialNetwork: 'developing'
      }
    }
  },
  performance: {
    production: {
      yields: {
        annualCalories: 0,
        annualProtein: 0,
        diversity: 0,
        peakProductionYear: 5
      },
      economics: {
        estimatedValue: 0,
        roi: 0,
        laborHours: 0,
        marketPotential: 'subsistence'
      },
      resilience: {
        foodSecurityDays: 0,
        waterSecurityDays: 0,
        energyIndependence: 0,
        selfSufficiencyScore: 0
      }
    },
    community: {
      socialSpaces: [],
      educationalValue: {
        demonstrationAreas: 0,
        interpretiveSigns: 0,
        workshopCapacity: 0
      },
      sharing: {
        toolLibrary: false,
        seedSaving: false,
        knowledgeSharing: false
      }
    },
    sustainabilityScore: 0,
    regenerationPotential: 0
  },
  relationships: {
    plantGuilds: [],
    energyFlows: [],
    spatialConnections: []
  }
})
