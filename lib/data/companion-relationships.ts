/**
 * Enhanced Companion Planting Relationships
 *
 * Detailed companion data with reasons, benefits, and mechanisms
 * Based on permaculture research and traditional knowledge
 */

export type CompanionBenefit =
  | 'pest_control'
  | 'pollinator_attraction'
  | 'nitrogen_fixation'
  | 'soil_improvement'
  | 'structural_support'
  | 'weed_suppression'
  | 'moisture_retention'
  | 'flavor_enhancement'
  | 'growth_acceleration'
  | 'disease_prevention'
  | 'shade_provision'
  | 'wind_protection'
  | 'nutrient_accumulation'
  | 'trap_cropping'

export type CompanionStrength = 'weak' | 'moderate' | 'strong' | 'essential'

export type AntagonismReason =
  | 'nutrient_competition'
  | 'allelopathy' // Chemical inhibition
  | 'disease_sharing'
  | 'pest_attraction'
  | 'space_competition'
  | 'root_competition'
  | 'light_competition'
  | 'water_competition'

export interface DetailedCompanionRelationship {
  plant1: string // Plant ID
  plant2: string // Plant ID
  relationship: 'beneficial' | 'antagonistic' | 'neutral'
  strength: CompanionStrength

  // For beneficial relationships
  benefits?: CompanionBenefit[]
  mechanism?: string // How it works
  optimalDistance?: { min: number; max: number } // In inches

  // For antagonistic relationships
  antagonismReasons?: AntagonismReason[]
  minimumSeparation?: number // Minimum distance in inches

  // Conditional factors
  conditions?: {
    climates?: string[] // Works best in these climates
    seasons?: string[] // Seasonal dependencies
    growthStages?: string[] // Specific growth stages
    soilTypes?: string[]
  }

  // Research backing
  source?: string
  notes?: string
}

/**
 * Comprehensive companion planting database
 */
export const COMPANION_RELATIONSHIPS: DetailedCompanionRelationship[] = [
  // TOMATO relationships
  {
    plant1: 'tomato',
    plant2: 'basil',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'flavor_enhancement', 'growth_acceleration'],
    mechanism: 'Basil repels aphids, whiteflies, and hornworms. Volatile oils may improve tomato flavor.',
    optimalDistance: { min: 12, max: 24 },
    source: 'Louise Riotte - Carrots Love Tomatoes',
    notes: 'One of the most famous companion pairs. Plant basil between tomato plants.'
  },
  {
    plant1: 'tomato',
    plant2: 'carrot',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['pest_control', 'soil_improvement'],
    mechanism: 'Carrots aerate soil around tomato roots. Tomatoes repel carrot flies.',
    optimalDistance: { min: 18, max: 36 },
    notes: 'Carrots can grow well in the shade of tomato plants.'
  },
  {
    plant1: 'tomato',
    plant2: 'marigold',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'disease_prevention', 'trap_cropping'],
    mechanism: 'Marigolds (Tagetes) produce thiopene, which deters nematodes. Attracts aphids away from tomatoes.',
    optimalDistance: { min: 12, max: 24 },
    source: 'Scientific research - Journal of Chemical Ecology',
    notes: 'French marigolds (Tagetes patula) are most effective. Plant as border.'
  },
  {
    plant1: 'tomato',
    plant2: 'nasturtium',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['pest_control', 'trap_cropping'],
    mechanism: 'Acts as trap crop for aphids. Deters whiteflies and beetles.',
    optimalDistance: { min: 24, max: 48 },
    notes: 'Nasturtiums sprawl, so give them space. Can be planted as living mulch.'
  },
  {
    plant1: 'tomato',
    plant2: 'cabbage',
    relationship: 'antagonistic',
    strength: 'strong',
    antagonismReasons: ['nutrient_competition', 'growth_inhibition'],
    minimumSeparation: 48,
    mechanism: 'Both are heavy feeders. Tomatoes may stunt brassica growth.',
    source: 'Traditional knowledge, multiple sources',
    notes: 'Keep separated by at least 4 feet.'
  },
  {
    plant1: 'tomato',
    plant2: 'fennel',
    relationship: 'antagonistic',
    strength: 'essential', // Avoid at all costs
    antagonismReasons: ['allelopathy'],
    minimumSeparation: 120, // 10 feet
    mechanism: 'Fennel releases allelopathic chemicals that inhibit most plants.',
    notes: 'Fennel should be isolated from most garden plants.'
  },

  // THREE SISTERS - Corn, Beans, Squash
  {
    plant1: 'corn',
    plant2: 'beans',
    relationship: 'beneficial',
    strength: 'essential',
    benefits: ['structural_support', 'nitrogen_fixation'],
    mechanism: 'Beans fix atmospheric nitrogen for corn. Corn provides climbing structure for pole beans.',
    optimalDistance: { min: 6, max: 12 },
    source: 'Traditional Native American polyculture - 1000+ years',
    notes: 'Plant corn first, add beans when corn is 6" tall. Use pole beans, not bush beans.'
  },
  {
    plant1: 'corn',
    plant2: 'squash',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['weed_suppression', 'moisture_retention', 'pest_control'],
    mechanism: 'Squash leaves shade soil, retain moisture, deter raccoons with spiny stems.',
    optimalDistance: { min: 24, max: 48 },
    notes: 'Plant squash around perimeter of corn/bean patch.'
  },
  {
    plant1: 'beans',
    plant2: 'squash',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['nitrogen_fixation', 'complementary_growth'],
    mechanism: 'Beans provide nitrogen for squash. Different root depths avoid competition.',
    optimalDistance: { min: 18, max: 36 },
  },

  // LETTUCE relationships
  {
    plant1: 'lettuce',
    plant2: 'carrot',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['space_optimization', 'shade_provision'],
    mechanism: 'Lettuce provides light shade for carrot seedlings. Different root depths.',
    optimalDistance: { min: 6, max: 12 },
    notes: 'Interplant rows. Lettuce is harvested before carrots need full space.'
  },
  {
    plant1: 'lettuce',
    plant2: 'radish',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['space_optimization', 'pest_control'],
    mechanism: 'Radishes mark rows for lettuce. Harvest radishes early, leaving space for lettuce.',
    optimalDistance: { min: 4, max: 8 },
    notes: 'Classic intercropping. Radishes mature in 25 days, lettuce in 50-60.'
  },
  {
    plant1: 'lettuce',
    plant2: 'strawberry',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['weed_suppression', 'complementary_growth'],
    mechanism: 'Strawberries act as living mulch. Both prefer similar conditions.',
    optimalDistance: { min: 12, max: 18 },
  },

  // ONION family relationships
  {
    plant1: 'onion',
    plant2: 'carrot',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control'],
    mechanism: 'Onions repel carrot flies with strong scent. Carrots repel onion flies.',
    optimalDistance: { min: 6, max: 12 },
    source: 'Louise Riotte - Carrots Love Tomatoes',
    notes: 'Alternate rows of carrots and onions.'
  },
  {
    plant1: 'onion',
    plant2: 'beans',
    relationship: 'antagonistic',
    strength: 'moderate',
    antagonismReasons: ['growth_inhibition', 'allelopathy'],
    minimumSeparation: 24,
    mechanism: 'Alliums can inhibit bean growth through root exudates.',
    notes: 'Keep separated. Beans and alliums are poor companions.'
  },

  // BRASSICA (Cabbage family) relationships
  {
    plant1: 'cabbage',
    plant2: 'rosemary',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control'],
    mechanism: 'Rosemary scent deters cabbage moths and cabbage butterflies.',
    optimalDistance: { min: 18, max: 36 },
    notes: 'Plant rosemary as border around brassicas.'
  },
  {
    plant1: 'cabbage',
    plant2: 'thyme',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['pest_control'],
    mechanism: 'Thyme attracts beneficial insects and deters cabbage worms.',
    optimalDistance: { min: 12, max: 24 },
  },
  {
    plant1: 'cabbage',
    plant2: 'mint',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['pest_control'],
    mechanism: 'Mint deters flea beetles and aphids.',
    optimalDistance: { min: 24, max: 48 },
    notes: 'Plant mint in containers to prevent spreading.'
  },

  // PEPPER relationships
  {
    plant1: 'pepper',
    plant2: 'basil',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'flavor_enhancement'],
    mechanism: 'Basil repels aphids, spider mites, and mosquitoes.',
    optimalDistance: { min: 12, max: 18 },
  },
  {
    plant1: 'pepper',
    plant2: 'onion',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['pest_control'],
    mechanism: 'Onions deter aphids and other pests.',
    optimalDistance: { min: 12, max: 24 },
  },

  // CUCUMBER relationships
  {
    plant1: 'cucumber',
    plant2: 'nasturtium',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'pollinator_attraction'],
    mechanism: 'Nasturtium deters cucumber beetles and aphids. Flowers attract pollinators.',
    optimalDistance: { min: 18, max: 36 },
  },
  {
    plant1: 'cucumber',
    plant2: 'lettuce',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['weed_suppression', 'shade_provision'],
    mechanism: 'Cucumber vines shade soil. Lettuce acts as living mulch early in season.',
    optimalDistance: { min: 12, max: 24 },
  },

  // POTATO relationships
  {
    plant1: 'potato',
    plant2: 'squash',
    relationship: 'antagonistic',
    strength: 'strong',
    antagonismReasons: ['disease_sharing', 'space_competition'],
    minimumSeparation: 48,
    mechanism: 'Both susceptible to similar diseases. Compete for space.',
  },
  {
    plant1: 'potato',
    plant2: 'tomato',
    relationship: 'antagonistic',
    strength: 'essential',
    antagonismReasons: ['disease_sharing'],
    minimumSeparation: 60,
    mechanism: 'Both in Solanaceae family. Share diseases like late blight.',
    notes: 'Never plant together. Can devastate both crops.'
  },

  // HERB combinations
  {
    plant1: 'rosemary',
    plant2: 'thyme',
    relationship: 'beneficial',
    strength: 'moderate',
    benefits: ['complementary_growth'],
    mechanism: 'Similar growing requirements. Both Mediterranean herbs prefer dry conditions.',
    optimalDistance: { min: 12, max: 24 },
    conditions: {
      climates: ['mediterranean', 'hot', 'temperate'],
      soilTypes: ['well-drained', 'sandy']
    }
  },
  {
    plant1: 'mint',
    plant2: 'basil',
    relationship: 'antagonistic',
    strength: 'moderate',
    antagonismReasons: ['space_competition', 'moisture_competition'],
    minimumSeparation: 36,
    mechanism: 'Mint is invasive and aggressive. Will overtake basil.',
    notes: 'Always plant mint in containers.'
  },

  // FRUIT relationships
  {
    plant1: 'strawberry',
    plant2: 'thyme',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'weed_suppression'],
    mechanism: 'Thyme deters slugs and worms. Creates aromatic groundcover.',
    optimalDistance: { min: 6, max: 12 },
  },
  {
    plant1: 'strawberry',
    plant2: 'garlic',
    relationship: 'beneficial',
    strength: 'strong',
    benefits: ['pest_control', 'disease_prevention'],
    mechanism: 'Garlic deters aphids and prevents fungal diseases.',
    optimalDistance: { min: 8, max: 16 },
    source: 'Research - Sulfur compounds in garlic have antifungal properties',
  },

  // ROOT VEGETABLE relationships
  {
    plant1: 'carrot',
    plant2: 'dill',
    relationship: 'antagonistic',
    strength: 'weak',
    antagonismReasons: ['allelopathy'],
    minimumSeparation: 24,
    mechanism: 'Dill may stunt carrot growth when mature.',
    notes: 'Young dill is fine, but remove before it flowers.'
  },
]

/**
 * Get detailed relationship between two plants
 */
export function getDetailedRelationship(
  plant1Id: string,
  plant2Id: string
): DetailedCompanionRelationship | null {
  // Check both directions
  return COMPANION_RELATIONSHIPS.find(
    rel =>
      (rel.plant1 === plant1Id && rel.plant2 === plant2Id) ||
      (rel.plant1 === plant2Id && rel.plant2 === plant1Id)
  ) || null
}

/**
 * Get all beneficial relationships for a plant
 */
export function getBeneficialCompanions(plantId: string): DetailedCompanionRelationship[] {
  return COMPANION_RELATIONSHIPS.filter(
    rel =>
      (rel.plant1 === plantId || rel.plant2 === plantId) &&
      rel.relationship === 'beneficial'
  )
}

/**
 * Get all antagonistic relationships for a plant
 */
export function getAntagonisticPlants(plantId: string): DetailedCompanionRelationship[] {
  return COMPANION_RELATIONSHIPS.filter(
    rel =>
      (rel.plant1 === plantId || rel.plant2 === plantId) &&
      rel.relationship === 'antagonistic'
  )
}

/**
 * Get formatted benefit description
 */
export function formatBenefit(benefit: CompanionBenefit): string {
  const benefitMap: Record<CompanionBenefit, string> = {
    pest_control: '🐛 Pest Control',
    pollinator_attraction: '🐝 Pollinator Attraction',
    nitrogen_fixation: '🌱 Nitrogen Fixation',
    soil_improvement: '🌍 Soil Improvement',
    structural_support: '🏗️ Structural Support',
    weed_suppression: '🌿 Weed Suppression',
    moisture_retention: '💧 Moisture Retention',
    flavor_enhancement: '😋 Flavor Enhancement',
    growth_acceleration: '⚡ Growth Boost',
    disease_prevention: '🛡️ Disease Prevention',
    shade_provision: '⛱️ Shade Provision',
    wind_protection: '💨 Wind Protection',
    nutrient_accumulation: '🔬 Nutrient Accumulation',
    trap_cropping: '🎯 Trap Cropping'
  }
  return benefitMap[benefit] || benefit
}

/**
 * Get formatted antagonism reason
 */
export function formatAntagonismReason(reason: AntagonismReason): string {
  const reasonMap: Record<AntagonismReason, string> = {
    nutrient_competition: '⚠️ Compete for Nutrients',
    allelopathy: '🧪 Chemical Inhibition',
    disease_sharing: '🦠 Share Diseases',
    pest_attraction: '🐛 Attract Same Pests',
    space_competition: '📏 Compete for Space',
    root_competition: '🌿 Root Competition',
    light_competition: '☀️ Compete for Light',
    water_competition: '💧 Compete for Water'
  }
  return reasonMap[reason] || reason
}
