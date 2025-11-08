import {
  Settings, Target, Heart, Calendar, ShoppingCart, ListTodo,
  Sun, Compass, Repeat, Droplets, Clock, Hammer, Award,
  BookOpen, Lightbulb, Layout, Activity, Sparkles, BarChart3,
  Mountain, Layers, Home, Thermometer, Bird, Users, DollarSign,
  Zap, Trees, Fence, TrendingUp, Globe, Sprout
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface PanelDefinition {
  id: string
  name: string
  description: string
  icon: LucideIcon
  category: 'essentials' | 'site' | 'permaculture' | 'planning' | 'advanced' | 'community' | 'resources'
  tier: 'free' | 'premium' | 'pro'
  keywords: string[]
}

export const PANEL_CATEGORIES = {
  essentials: {
    name: 'Essentials',
    description: 'Core editing and design tools',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  site: {
    name: 'Site Analysis',
    description: 'Soil, topography, climate, and infrastructure',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  permaculture: {
    name: 'Permaculture Design',
    description: 'Zones, guilds, sectors, and ecological patterns',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  planning: {
    name: 'Planning & Implementation',
    description: 'Timeline, tasks, materials, and phasing',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  advanced: {
    name: 'Advanced Tools',
    description: 'Simulations, AI analysis, and long-term projections',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  community: {
    name: 'Community & Economics',
    description: 'Social permaculture, collaboration, and yields',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200'
  },
  resources: {
    name: 'Resources & Learning',
    description: 'Templates, knowledge base, and guides',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  }
} as const

export const PANEL_REGISTRY: PanelDefinition[] = [
  // ========== ESSENTIALS ==========
  {
    id: 'holistic',
    name: 'Holistic Dashboard',
    description: 'Integrated analysis with cross-panel insights and smart recommendations',
    icon: Sparkles,
    category: 'essentials',
    tier: 'free',
    keywords: ['holistic', 'dashboard', 'integrated', 'intelligence', 'recommendations', 'analysis', 'comprehensive']
  },
  {
    id: 'properties',
    name: 'Properties',
    description: 'Edit selected elements and configure settings',
    icon: Settings,
    category: 'essentials',
    tier: 'free',
    keywords: ['properties', 'settings', 'edit', 'configure', 'attributes']
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Overview with key metrics, stats, and insights',
    icon: BarChart3,
    category: 'essentials',
    tier: 'free',
    keywords: ['analytics', 'dashboard', 'metrics', 'stats', 'overview', 'summary']
  },

  // ========== SITE ANALYSIS ==========
  {
    id: 'soil',
    name: 'Soil Analysis',
    description: 'Analyze soil type, pH, composition, and amendments needed',
    icon: Layers,
    category: 'site',
    tier: 'premium',
    keywords: ['soil', 'earth', 'ph', 'composition', 'amendments', 'texture', 'fertility']
  },
  {
    id: 'topography',
    name: 'Topography & Grading',
    description: 'Map slopes, contours, terracing, swales, and water flow',
    icon: Mountain,
    category: 'site',
    tier: 'premium',
    keywords: ['topography', 'slopes', 'contours', 'grading', 'elevation', 'swales', 'keyline']
  },
  {
    id: 'climate',
    name: 'Climate & Microclimate',
    description: 'Temperature zones, frost pockets, and microclimates',
    icon: Thermometer,
    category: 'site',
    tier: 'premium',
    keywords: ['climate', 'microclimate', 'temperature', 'frost', 'hardiness', 'weather']
  },
  {
    id: 'infrastructure',
    name: 'Site Infrastructure',
    description: 'Buildings, paths, fences, access points, and utilities',
    icon: Home,
    category: 'site',
    tier: 'free',
    keywords: ['infrastructure', 'buildings', 'paths', 'fences', 'access', 'utilities', 'structures']
  },
  {
    id: 'sun',
    name: 'Sun & Shade Analysis',
    description: 'Map sun exposure patterns throughout day and seasons',
    icon: Sun,
    category: 'site',
    tier: 'premium',
    keywords: ['sun', 'shade', 'light', 'exposure', 'solar', 'seasonal', 'shadows']
  },
  {
    id: 'water',
    name: 'Water Management',
    description: 'Rainwater harvesting, irrigation, drainage, and ponds',
    icon: Droplets,
    category: 'site',
    tier: 'premium',
    keywords: ['water', 'irrigation', 'rainwater', 'hydrology', 'drainage', 'ponds', 'swales']
  },

  // ========== PERMACULTURE DESIGN ==========
  {
    id: 'zones',
    name: 'Permaculture Zones',
    description: 'Organize by zones 0-5 based on use frequency',
    icon: Target,
    category: 'permaculture',
    tier: 'free',
    keywords: ['zones', 'permaculture', 'organization', 'layout', 'proximity', '0-5']
  },
  {
    id: 'sectors',
    name: 'Sector Analysis',
    description: 'Map external energies: wind, sun, fire, wildlife, views',
    icon: Compass,
    category: 'permaculture',
    tier: 'premium',
    keywords: ['sectors', 'energy', 'wind', 'fire', 'wildlife', 'external', 'flows']
  },
  {
    id: 'companions',
    name: 'Companion Planting & Guilds',
    description: 'Plant relationships, guilds, and beneficial polycultures',
    icon: Heart,
    category: 'permaculture',
    tier: 'free',
    keywords: ['companion', 'guilds', 'relationships', 'polyculture', 'beneficial', 'synergy']
  },
  {
    id: 'biodiversity',
    name: 'Biodiversity & Wildlife',
    description: 'Habitat corridors, beneficial species, and ecological niches',
    icon: Bird,
    category: 'permaculture',
    tier: 'premium',
    keywords: ['biodiversity', 'wildlife', 'habitat', 'corridors', 'ecosystem', 'native', 'pollinators']
  },
  {
    id: 'succession',
    name: 'Ecological Succession',
    description: 'Multi-year succession from pioneer to climax species',
    icon: Trees,
    category: 'permaculture',
    tier: 'premium',
    keywords: ['succession', 'rotation', 'crop rotation', 'sequence', 'multi-year', 'pioneer', 'climax']
  },
  {
    id: 'permaculture',
    name: 'Permaculture Principles',
    description: 'Ethics, principles, patterns, and design methodology',
    icon: Sparkles,
    category: 'permaculture',
    tier: 'premium',
    keywords: ['permaculture', 'principles', 'ethics', 'patterns', 'design', 'methodology']
  },
  {
    id: 'energy',
    name: 'Energy Systems',
    description: 'Renewable energy, passive solar, heating, and cooling',
    icon: Zap,
    category: 'permaculture',
    tier: 'pro',
    keywords: ['energy', 'solar', 'renewable', 'passive', 'heating', 'cooling', 'electricity']
  },

  // ========== PLANNING & IMPLEMENTATION ==========
  {
    id: 'timeline',
    name: 'Seasonal Timeline',
    description: 'Planting and harvest calendar by season and zone',
    icon: Calendar,
    category: 'planning',
    tier: 'free',
    keywords: ['timeline', 'calendar', 'seasonal', 'planting', 'harvest', 'schedule', 'phenology']
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'Track tasks with deadlines, priorities, and maintenance cycles',
    icon: ListTodo,
    category: 'planning',
    tier: 'premium',
    keywords: ['tasks', 'todo', 'deadlines', 'checklist', 'maintenance', 'schedule']
  },
  {
    id: 'materials',
    name: 'Materials & Costs',
    description: 'Calculate materials, quantities, and budget estimates',
    icon: ShoppingCart,
    category: 'planning',
    tier: 'premium',
    keywords: ['materials', 'cost', 'budget', 'shopping', 'supplies', 'lumber', 'pricing']
  },
  {
    id: 'implementation',
    name: 'Implementation Phases',
    description: 'Break project into phases with budgets and timelines',
    icon: Hammer,
    category: 'planning',
    tier: 'pro',
    keywords: ['implementation', 'phases', 'budget', 'timeline', 'construction', 'build', 'stages']
  },

  // ========== ADVANCED TOOLS ==========
  {
    id: 'simulation',
    name: 'Growth Simulation',
    description: 'Animated 10-year evolution with realistic growth modeling',
    icon: Activity,
    category: 'advanced',
    tier: 'pro',
    keywords: ['simulation', 'growth', 'animation', 'modeling', 'future', 'projection', '10-year']
  },
  {
    id: 'evolution',
    name: 'Garden Evolution Timeline',
    description: 'Maturation visualization with yield and milestone tracking',
    icon: Clock,
    category: 'advanced',
    tier: 'pro',
    keywords: ['evolution', 'maturation', 'yield', 'long-term', 'projection', 'timeline', 'milestones']
  },
  {
    id: 'critique',
    name: 'AI Design Critique',
    description: 'Professional design analysis with automated scoring',
    icon: Award,
    category: 'advanced',
    tier: 'pro',
    keywords: ['critique', 'ai', 'score', 'recommendations', 'analysis', 'review', 'feedback']
  },
  {
    id: 'progress',
    name: 'Progress Tracking',
    description: 'Photo journal with observations and performance metrics',
    icon: BookOpen,
    category: 'advanced',
    tier: 'pro',
    keywords: ['progress', 'tracking', 'photos', 'observations', 'journal', 'documentation', 'diary']
  },

  // ========== COMMUNITY & ECONOMICS ==========
  {
    id: 'community',
    name: 'Community Spaces',
    description: 'Shared gardens, education areas, and collaboration zones',
    icon: Users,
    category: 'community',
    tier: 'premium',
    keywords: ['community', 'social', 'shared', 'education', 'collaboration', 'gathering', 'teaching']
  },
  {
    id: 'economics',
    name: 'Economics & Yields',
    description: 'Production tracking, ROI calculations, and market analysis',
    icon: DollarSign,
    category: 'community',
    tier: 'pro',
    keywords: ['economics', 'yields', 'production', 'roi', 'market', 'income', 'profit', 'csa']
  },
  {
    id: 'resilience',
    name: 'Resilience & Food Security',
    description: 'Caloric production, food security, and self-sufficiency metrics',
    icon: TrendingUp,
    category: 'community',
    tier: 'pro',
    keywords: ['resilience', 'food security', 'self-sufficiency', 'calories', 'nutrition', 'sovereignty']
  },

  // ========== RESOURCES & LEARNING ==========
  {
    id: 'knowledge',
    name: 'Knowledge Base',
    description: 'Permaculture guides, plant profiles, and best practices',
    icon: Lightbulb,
    category: 'resources',
    tier: 'free',
    keywords: ['knowledge', 'guides', 'learn', 'education', 'help', 'documentation', 'wiki']
  },
  {
    id: 'templates',
    name: 'Template Library',
    description: 'Proven permaculture designs and pattern library',
    icon: Layout,
    category: 'resources',
    tier: 'pro',
    keywords: ['templates', 'patterns', 'designs', 'examples', 'library', 'presets', 'blueprints']
  }
]

// Helper functions
export function getPanelById(id: string): PanelDefinition | undefined {
  return PANEL_REGISTRY.find(panel => panel.id === id)
}

export function getPanelsByCategory(category: PanelDefinition['category']): PanelDefinition[] {
  return PANEL_REGISTRY.filter(panel => panel.category === category)
}

export function searchPanels(query: string): PanelDefinition[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return PANEL_REGISTRY

  return PANEL_REGISTRY.filter(panel => {
    return (
      panel.name.toLowerCase().includes(lowerQuery) ||
      panel.description.toLowerCase().includes(lowerQuery) ||
      panel.keywords.some(keyword => keyword.includes(lowerQuery))
    )
  })
}

export function getFreePanels(): PanelDefinition[] {
  return PANEL_REGISTRY.filter(panel => panel.tier === 'free')
}

export function getPremiumPanels(): PanelDefinition[] {
  return PANEL_REGISTRY.filter(panel => panel.tier === 'premium')
}

export function getProPanels(): PanelDefinition[] {
  return PANEL_REGISTRY.filter(panel => panel.tier === 'pro')
}
