/**
 * Subscription Plans Configuration
 *
 * Defines the freemium pricing model and feature access
 */

export type PlanTier = 'free' | 'premium' | 'pro'

export interface PlanLimits {
  maxPlans: number
  maxBedsPerPlan: number
  maxPlantsPerBed: number
  availablePanels: string[]
  canExportPDF: boolean
  canUseTemplates: boolean
  canUseAICritique: boolean
  canTrackProgress: boolean
  canAccessKnowledgeBase: boolean
  canCollaborate: boolean
  prioritySupport: boolean
  customPlantLibrary: boolean
  apiAccess: boolean
}

export interface Plan {
  id: PlanTier
  name: string
  description: string
  price: {
    monthly: number
    annually: number
  }
  limits: PlanLimits
  features: string[]
  highlighted?: boolean
}

// Default panels available to all tiers
const CORE_PANELS = ['properties', 'zones', 'companions', 'timeline', 'analytics']

// Premium panels
const PREMIUM_PANELS = [
  'materials',
  'tasks',
  'sun',
  'sectors',
  'succession',
  'water',
  'permaculture',
]

// Pro-only panels
const PRO_PANELS = ['evolution', 'implementation', 'critique', 'progress', 'knowledge', 'templates', 'simulation']

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for exploring permaculture design',
    price: {
      monthly: 0,
      annually: 0,
    },
    limits: {
      maxPlans: 1,
      maxBedsPerPlan: 5,
      maxPlantsPerBed: 20,
      availablePanels: CORE_PANELS,
      canExportPDF: false,
      canUseTemplates: false,
      canUseAICritique: false,
      canTrackProgress: false,
      canAccessKnowledgeBase: true, // Everyone can learn!
      canCollaborate: false,
      prioritySupport: false,
      customPlantLibrary: false,
      apiAccess: false,
    },
    features: [
      '1 garden plan',
      'Up to 5 beds',
      'Basic plant library',
      '5 analysis panels',
      'Zone planning',
      'Companion planting guide',
      'Knowledge base access',
      'JSON export',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'For serious permaculture gardeners',
    price: {
      monthly: 15,
      annually: 144, // 20% discount
    },
    limits: {
      maxPlans: 10,
      maxBedsPerPlan: 50,
      maxPlantsPerBed: 100,
      availablePanels: [...CORE_PANELS, ...PREMIUM_PANELS],
      canExportPDF: true,
      canUseTemplates: true,
      canUseAICritique: false,
      canTrackProgress: false,
      canAccessKnowledgeBase: true,
      canCollaborate: false,
      prioritySupport: false,
      customPlantLibrary: false,
      apiAccess: false,
    },
    features: [
      '10 garden plans',
      'Up to 50 beds per plan',
      'Full plant library (500+ plants)',
      '12 analysis panels',
      'All core features',
      'Materials & task planning',
      'Sun & sector analysis',
      'Water management',
      'Succession planning',
      'Template library',
      'PDF export',
      'Priority email support',
    ],
    highlighted: true,
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    description: 'For professional designers & educators',
    price: {
      monthly: 39,
      annually: 390, // ~17% discount
    },
    limits: {
      maxPlans: 100,
      maxBedsPerPlan: 200,
      maxPlantsPerBed: 500,
      availablePanels: [...CORE_PANELS, ...PREMIUM_PANELS, ...PRO_PANELS],
      canExportPDF: true,
      canUseTemplates: true,
      canUseAICritique: true,
      canTrackProgress: true,
      canAccessKnowledgeBase: true,
      canCollaborate: true,
      prioritySupport: true,
      customPlantLibrary: true,
      apiAccess: true,
    },
    features: [
      'Unlimited garden plans',
      'Up to 200 beds per plan',
      'All 18 analysis panels',
      'AI-powered design critique',
      'Garden evolution timeline',
      'Implementation phasing',
      'Progress tracking',
      'Team collaboration',
      'Custom plant library',
      'White-label exports',
      'API access',
      'Priority support (24h response)',
      'Early access to new features',
    ],
  },
}

// Helper function to check if a feature is available for a plan
export function hasFeatureAccess(
  planTier: PlanTier,
  feature: keyof PlanLimits
): boolean {
  return PLANS[planTier].limits[feature] as boolean
}

// Helper function to check panel access
export function hasPanelAccess(planTier: PlanTier, panelId: string): boolean {
  return PLANS[planTier].limits.availablePanels.includes(panelId)
}

// Helper function to get plan limits
export function getPlanLimits(planTier: PlanTier): PlanLimits {
  return PLANS[planTier].limits
}

// Helper function to check if at limit
export function isAtLimit(
  planTier: PlanTier,
  limitType: 'plans' | 'beds' | 'plants',
  currentCount: number
): boolean {
  const limits = PLANS[planTier].limits
  switch (limitType) {
    case 'plans':
      return currentCount >= limits.maxPlans
    case 'beds':
      return currentCount >= limits.maxBedsPerPlan
    case 'plants':
      return currentCount >= limits.maxPlantsPerBed
    default:
      return false
  }
}

// Helper to get upgrade message
export function getUpgradeMessage(
  currentTier: PlanTier,
  feature: string
): string {
  if (currentTier === 'free') {
    return `Upgrade to Premium to unlock ${feature}`
  }
  if (currentTier === 'premium') {
    return `Upgrade to Professional to unlock ${feature}`
  }
  return ''
}
