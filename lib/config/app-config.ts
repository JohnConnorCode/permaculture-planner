import {
  Leaf, Grid3x3, Droplets, Calendar, BarChart3, Bot,
  TreePine, Flower2, Sprout, CheckCircle, TrendingUp,
  Globe, Zap, Shield, Sun, Cloud, Wind, Home, Building,
  Trees, Heart, Layers, Apple, Mountain, MousePointer,
  Square, Circle, Pencil, Move, ZoomIn, ZoomOut, RotateCw,
  Save, Share2, Download, Settings, Thermometer, MapPin,
  Users, BookOpen, LayoutDashboard, Sparkles, LogIn, UserPlus,
  Compass
} from 'lucide-react'

// Navigation Configuration
export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/features', label: 'Features', icon: Sparkles },
  { href: '/tools', label: 'Tools', icon: Settings },
  { href: '/demo', label: 'Demo', icon: Layers },
  { href: '/wizard', label: 'Wizard', icon: Sparkles },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/docs', label: 'Learn', icon: BookOpen },
] as const

export const AUTH_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
] as const

// Design Tools Configuration
export const DESIGN_TOOLS = [
  { id: 'select', icon: MousePointer, name: 'Select', description: 'Select and move elements' },
  { id: 'zone', icon: Circle, name: 'Zone', description: 'Create permaculture zones (0-5)' },
  { id: 'sector', icon: Compass, name: 'Sector', description: 'Map sun, wind, water, views' },
  { id: 'water', icon: Droplets, name: 'Water', description: 'Swales, ponds, catchment' },
  { id: 'plant', icon: Trees, name: 'Plant', description: 'Food forest layers & guilds' },
  { id: 'soil', icon: Layers, name: 'Soil', description: 'Composting & soil building' },
  { id: 'structure', icon: Home, name: 'Structure', description: 'Buildings & infrastructure' },
  { id: 'path', icon: Square, name: 'Access', description: 'Paths, roads & circulation' },
  { id: 'energy', icon: Zap, name: 'Energy', description: 'Solar, wind, thermal mass' },
] as const

// Permaculture Zones Configuration
export const PERMACULTURE_ZONES = [
  {
    id: 0,
    name: 'Zone 0',
    description: 'The home or settlement',
    color: '#374151',
    radius: 0,
    frequency: 'Constant',
    examples: ['House', 'Living spaces', 'Core infrastructure']
  },
  {
    id: 1,
    name: 'Zone 1',
    description: 'Elements needing frequent attention',
    color: '#10b981',
    radius: 100,
    frequency: 'Daily',
    examples: ['Kitchen garden', 'Herb spiral', 'Greenhouse', 'Compost']
  },
  {
    id: 2,
    name: 'Zone 2',
    description: 'Elements needing regular attention',
    color: '#3b82f6',
    radius: 150,
    frequency: 'Weekly',
    examples: ['Food forest', 'Small livestock', 'Perennial beds']
  },
  {
    id: 3,
    name: 'Zone 3',
    description: 'Elements needing occasional attention',
    color: '#f59e0b',
    radius: 200,
    frequency: 'Monthly',
    examples: ['Main crops', 'Large livestock', 'Orchards']
  },
  {
    id: 4,
    name: 'Zone 4',
    description: 'Semi-wild, minimal management',
    color: '#8b5cf6',
    radius: 250,
    frequency: 'Seasonal',
    examples: ['Timber', 'Foraging', 'Grazing pasture']
  },
  {
    id: 5,
    name: 'Zone 5',
    description: 'Wild, unmanaged area',
    color: '#22c55e',
    radius: 300,
    frequency: 'Observation only',
    examples: ['Wildlife habitat', 'Native forest', 'Watershed']
  }
] as const

// Feature Cards Configuration
export const PLATFORM_FEATURES = [
  {
    title: 'Smart Zone Planning',
    description: 'AI-optimized placement based on permaculture principles',
    icon: Layers,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    stat: '5 Zones',
    progress: 80
  },
  {
    title: 'Plant Guilds',
    description: 'Companion planting with automated warnings',
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    stat: '12 Guilds',
    progress: 65
  },
  {
    title: 'Water Systems',
    description: 'Swales, ponds, and irrigation planning',
    icon: Droplets,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    stat: '95% Efficient',
    progress: 95
  },
  {
    title: 'Yield Predictions',
    description: 'Data-driven harvest estimates',
    icon: BarChart3,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    stat: '450kg/year',
    progress: 75
  },
  {
    title: 'Climate Analysis',
    description: 'Microclimate mapping and sun tracking',
    icon: Sun,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    stat: 'Zone 7a',
    progress: 90
  },
  {
    title: 'Community Sharing',
    description: 'Share designs and learn from others',
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    stat: '2.5k Users',
    progress: 100
  }
] as const

// Seasonal Tasks Configuration
export const SEASONAL_TASKS = {
  spring: [
    { month: 'March', task: 'Start seeds indoors', icon: Leaf },
    { month: 'April', task: 'Prepare beds', icon: Mountain },
    { month: 'May', task: 'Transplant seedlings', icon: Trees },
  ],
  summer: [
    { month: 'June', task: 'Mulch and water', icon: Droplets },
    { month: 'July', task: 'First harvest', icon: Apple },
    { month: 'August', task: 'Succession planting', icon: Sprout },
  ],
  fall: [
    { month: 'September', task: 'Main harvest', icon: Apple },
    { month: 'October', task: 'Plant cover crops', icon: Leaf },
    { month: 'November', task: 'Prepare for winter', icon: Shield },
  ],
  winter: [
    { month: 'December', task: 'Plan next year', icon: Calendar },
    { month: 'January', task: 'Order seeds', icon: Grid3x3 },
    { month: 'February', task: 'Prune trees', icon: TreePine },
  ]
} as const

// Canvas Configuration
export const CANVAS_CONFIG = {
  width: 600,
  height: 600,
  gridSize: 20,
  minZoom: 50,
  maxZoom: 200,
  zoomStep: 10,
  defaultZoom: 100,
}

// Layer Configuration
export const CANVAS_LAYERS = [
  { id: 'zones', name: 'Zones', visible: true },
  { id: 'plants', name: 'Plants', visible: true },
  { id: 'water', name: 'Water', visible: true },
  { id: 'structures', name: 'Structures', visible: true },
  { id: 'paths', name: 'Paths', visible: true },
]

// Analytics Metrics
export const ANALYTICS_METRICS = [
  {
    id: 'yield',
    label: 'Annual Yield',
    icon: Apple,
    unit: 'kg',
    color: 'text-green-600',
    iconColor: 'text-red-500'
  },
  {
    id: 'water',
    label: 'Water Efficiency',
    icon: Droplets,
    unit: '%',
    color: 'text-blue-600',
    iconColor: 'text-blue-500'
  },
  {
    id: 'biodiversity',
    label: 'Biodiversity',
    icon: Leaf,
    unit: 'species',
    color: 'text-green-600',
    iconColor: 'text-green-500'
  },
  {
    id: 'carbon',
    label: 'Carbon Sequestered',
    icon: Cloud,
    unit: 'tons/year',
    color: 'text-gray-600',
    iconColor: 'text-gray-500'
  }
] as const

// Animation Delays for Sequential Loading
export const ANIMATION_DELAYS = {
  immediate: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
} as const

// Breakpoints for Responsive Design
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Color Palette
export const COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  zones: {
    0: '#374151', // gray-700
    1: '#10b981', // emerald-500
    2: '#3b82f6', // blue-500
    3: '#f59e0b', // amber-500
    4: '#8b5cf6', // violet-500
    5: '#22c55e', // green-500
  }
} as const