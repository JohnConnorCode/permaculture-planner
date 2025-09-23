'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle, Circle, Star, Zap, Shield, Users,
  Cpu, Cloud, Smartphone, Globe, BarChart3, BookOpen,
  Palette, Timer, Award, Heart, Leaf, Droplets,
  Sun, Moon, Wind, Thermometer, Calendar, Map,
  Camera, Bell, Mail, MessageCircle, Share2, Lock,
  CreditCard, TrendingUp, Package, Truck, ShoppingCart,
  FileJson, Database, GitBranch, Activity, Search, Filter,
  Layout, Layers, Grid3x3, Move, ZoomIn, Ruler,
  Beaker, Microscope, Calculator, PieChart, LineChart, BarChart,
  Video, Headphones, HelpCircle, FileText, Download, Upload,
  Wifi, WifiOff, RefreshCw, Save, Settings, Wrench
} from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: React.ElementType
  tier: 'free' | 'pro' | 'enterprise'
  status: 'available' | 'beta' | 'coming-soon'
  details?: string[]
}

interface FeatureCategory {
  id: string
  name: string
  description: string
  icon: React.ElementType
  features: Feature[]
}

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'garden-design',
    name: 'Garden Design & Planning',
    description: 'Professional tools for creating your perfect garden layout',
    icon: Layout,
    features: [
      {
        title: 'Interactive Garden Canvas',
        description: 'Draw custom garden beds with any shape',
        icon: Palette,
        tier: 'free',
        status: 'available',
        details: [
          'Freehand drawing tools',
          'Rectangle and polygon shapes',
          'Grid snapping for precision',
          'Zoom and pan controls',
          'Multiple bed support'
        ]
      },
      {
        title: 'Plant Library',
        description: 'Comprehensive database of 500+ plants',
        icon: Leaf,
        tier: 'free',
        status: 'available',
        details: [
          'Vegetables, herbs, fruits, flowers',
          'Native and exotic species',
          'Detailed growing requirements',
          'Companion planting data',
          'Search and filter options'
        ]
      },
      {
        title: '3D Garden Visualization',
        description: 'See your garden in realistic 3D',
        icon: Grid3x3,
        tier: 'pro',
        status: 'coming-soon',
        details: [
          'Realistic plant models',
          'Seasonal changes',
          'Shadow simulation',
          'Walk-through mode',
          'VR support'
        ]
      },
      {
        title: 'Garden Templates',
        description: 'Pre-designed gardens for quick starts',
        icon: BookOpen,
        tier: 'free',
        status: 'available',
        details: [
          '50+ curated templates',
          'Beginner to advanced',
          'Theme gardens (Pizza, Tea, etc.)',
          'Climate-specific designs',
          'Customizable layouts'
        ]
      },
      {
        title: 'Multi-Layer Design',
        description: 'Plan canopy, shrub, and ground layers',
        icon: Layers,
        tier: 'pro',
        status: 'available',
        details: [
          'Forest garden planning',
          'Vertical gardening',
          'Guild design',
          'Polyculture systems',
          'Succession planting'
        ]
      }
    ]
  },
  {
    id: 'plant-intelligence',
    name: 'Plant Intelligence & Recommendations',
    description: 'AI-powered insights for optimal plant selection and placement',
    icon: Cpu,
    features: [
      {
        title: 'Companion Planting AI',
        description: 'Smart suggestions for plant combinations',
        icon: Users,
        tier: 'free',
        status: 'available',
        details: [
          'Compatibility checking',
          'Beneficial relationships',
          'Pest deterrent combinations',
          'Nutrient sharing analysis',
          'Space optimization'
        ]
      },
      {
        title: 'Climate Zone Analysis',
        description: 'Automatic plant selection for your zone',
        icon: Thermometer,
        tier: 'pro',
        status: 'available',
        details: [
          'USDA hardiness zones',
          'Heat zone mapping',
          'Microclimate detection',
          'Frost date predictions',
          'Climate change adaptations'
        ]
      },
      {
        title: 'Soil Matching',
        description: 'Match plants to your soil conditions',
        icon: Beaker,
        tier: 'pro',
        status: 'beta',
        details: [
          'pH requirements',
          'Nutrient needs',
          'Drainage preferences',
          'Soil amendment suggestions',
          'Testing kit integration'
        ]
      },
      {
        title: 'Disease & Pest Prediction',
        description: 'Proactive pest and disease management',
        icon: Shield,
        tier: 'enterprise',
        status: 'beta',
        details: [
          'Risk assessment',
          'Early warning system',
          'Organic solutions',
          'IPM strategies',
          'Regional pest calendars'
        ]
      },
      {
        title: 'Yield Optimization',
        description: 'Maximize your harvest potential',
        icon: TrendingUp,
        tier: 'pro',
        status: 'available',
        details: [
          'Spacing optimization',
          'Succession planting',
          'Intercropping strategies',
          'Harvest predictions',
          'ROI calculations'
        ]
      }
    ]
  },
  {
    id: 'seasonal-planning',
    name: 'Seasonal Planning & Scheduling',
    description: 'Never miss the perfect planting window again',
    icon: Calendar,
    features: [
      {
        title: 'Planting Calendar',
        description: 'Personalized planting schedules',
        icon: Calendar,
        tier: 'free',
        status: 'available',
        details: [
          'Custom to your location',
          'Indoor/outdoor timing',
          'Transplant reminders',
          'Succession planting',
          'Moon phase planting'
        ]
      },
      {
        title: 'Task Management',
        description: 'Automated garden to-do lists',
        icon: CheckCircle,
        tier: 'free',
        status: 'available',
        details: [
          'Daily/weekly tasks',
          'Seasonal checklists',
          'Custom reminders',
          'Team assignments',
          'Progress tracking'
        ]
      },
      {
        title: 'Weather Integration',
        description: 'Real-time weather monitoring',
        icon: Cloud,
        tier: 'pro',
        status: 'available',
        details: [
          '10-day forecasts',
          'Frost warnings',
          'Rain tracking',
          'Wind alerts',
          'UV index monitoring'
        ]
      },
      {
        title: 'Harvest Tracking',
        description: 'Log and analyze your yields',
        icon: Package,
        tier: 'free',
        status: 'available',
        details: [
          'Weight/count logging',
          'Photo documentation',
          'Quality ratings',
          'Storage tracking',
          'Preservation planning'
        ]
      },
      {
        title: 'Crop Rotation Planner',
        description: 'Multi-year rotation schedules',
        icon: RefreshCw,
        tier: 'pro',
        status: 'available',
        details: [
          '4-year planning',
          'Family grouping',
          'Nutrient balancing',
          'Cover crop integration',
          'Fallow period management'
        ]
      }
    ]
  },
  {
    id: 'water-management',
    name: 'Water & Resource Management',
    description: 'Optimize water usage and resource efficiency',
    icon: Droplets,
    features: [
      {
        title: 'Irrigation Planning',
        description: 'Design efficient watering systems',
        icon: Droplets,
        tier: 'pro',
        status: 'available',
        details: [
          'Drip system design',
          'Zone planning',
          'Timer scheduling',
          'Water usage calculation',
          'Drought management'
        ]
      },
      {
        title: 'Rainwater Harvesting',
        description: 'Calculate collection potential',
        icon: Cloud,
        tier: 'pro',
        status: 'beta',
        details: [
          'Roof area calculation',
          'Storage sizing',
          'First flush diverters',
          'Overflow planning',
          'Usage tracking'
        ]
      },
      {
        title: 'Greywater Systems',
        description: 'Reuse household water safely',
        icon: RefreshCw,
        tier: 'enterprise',
        status: 'coming-soon',
        details: [
          'System design',
          'Plant compatibility',
          'Legal compliance',
          'Filtration planning',
          'Maintenance schedules'
        ]
      },
      {
        title: 'Composting Calculator',
        description: 'Balance your compost perfectly',
        icon: Leaf,
        tier: 'free',
        status: 'available',
        details: [
          'C:N ratio calculator',
          'Material database',
          'Volume estimation',
          'Turn reminders',
          'Troubleshooting guide'
        ]
      },
      {
        title: 'Energy Tracking',
        description: 'Monitor resource consumption',
        icon: Zap,
        tier: 'enterprise',
        status: 'coming-soon',
        details: [
          'Solar potential',
          'Greenhouse heating',
          'Pump efficiency',
          'Carbon footprint',
          'Cost analysis'
        ]
      }
    ]
  },
  {
    id: 'community',
    name: 'Community & Collaboration',
    description: 'Connect with gardeners worldwide',
    icon: Users,
    features: [
      {
        title: 'Garden Sharing',
        description: 'Share designs with the community',
        icon: Share2,
        tier: 'free',
        status: 'available',
        details: [
          'Public garden gallery',
          'Design templates',
          'Rating system',
          'Comments and feedback',
          'Fork and customize'
        ]
      },
      {
        title: 'Expert Consultations',
        description: 'Connect with master gardeners',
        icon: Headphones,
        tier: 'enterprise',
        status: 'beta',
        details: [
          'Video consultations',
          'Design reviews',
          'Problem diagnosis',
          'Personalized advice',
          'Follow-up support'
        ]
      },
      {
        title: 'Local Groups',
        description: 'Find gardeners near you',
        icon: Map,
        tier: 'free',
        status: 'available',
        details: [
          'Neighborhood groups',
          'Seed swaps',
          'Tool sharing',
          'Bulk buying clubs',
          'Workshop events'
        ]
      },
      {
        title: 'Knowledge Base',
        description: 'Comprehensive growing guides',
        icon: BookOpen,
        tier: 'free',
        status: 'available',
        details: [
          '1000+ articles',
          'Video tutorials',
          'Troubleshooting guides',
          'Research papers',
          'Community wiki'
        ]
      },
      {
        title: 'Marketplace',
        description: 'Buy, sell, and trade',
        icon: ShoppingCart,
        tier: 'pro',
        status: 'coming-soon',
        details: [
          'Seeds and plants',
          'Garden supplies',
          'Fresh produce',
          'Handmade products',
          'Services exchange'
        ]
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    description: 'Data-driven gardening decisions',
    icon: BarChart3,
    features: [
      {
        title: 'Garden Dashboard',
        description: 'Complete garden overview',
        icon: PieChart,
        tier: 'free',
        status: 'available',
        details: [
          'Plant inventory',
          'Task progress',
          'Harvest summary',
          'Space utilization',
          'Health indicators'
        ]
      },
      {
        title: 'Yield Analytics',
        description: 'Track productivity over time',
        icon: LineChart,
        tier: 'pro',
        status: 'available',
        details: [
          'Harvest trends',
          'Variety comparison',
          'Cost per yield',
          'Space efficiency',
          'Year-over-year analysis'
        ]
      },
      {
        title: 'Financial Tracking',
        description: 'Garden economics and ROI',
        icon: CreditCard,
        tier: 'pro',
        status: 'beta',
        details: [
          'Expense tracking',
          'Market value estimation',
          'Savings calculation',
          'Budget planning',
          'Tax deductions'
        ]
      },
      {
        title: 'Environmental Impact',
        description: 'Measure your green footprint',
        icon: Globe,
        tier: 'enterprise',
        status: 'coming-soon',
        details: [
          'Carbon sequestration',
          'Water conservation',
          'Biodiversity score',
          'Pollinator support',
          'Soil health metrics'
        ]
      },
      {
        title: 'AI Predictions',
        description: 'Future performance forecasting',
        icon: Activity,
        tier: 'enterprise',
        status: 'coming-soon',
        details: [
          'Yield predictions',
          'Problem forecasting',
          'Optimal timing',
          'Market predictions',
          'Climate adaptation'
        ]
      }
    ]
  },
  {
    id: 'mobile-integration',
    name: 'Mobile & Device Integration',
    description: 'Garden management on any device',
    icon: Smartphone,
    features: [
      {
        title: 'Mobile App',
        description: 'Full-featured iOS/Android apps',
        icon: Smartphone,
        tier: 'free',
        status: 'available',
        details: [
          'Offline mode',
          'Photo capture',
          'Quick logging',
          'Push notifications',
          'Garden maps'
        ]
      },
      {
        title: 'Smart Sensor Integration',
        description: 'Connect IoT garden sensors',
        icon: Wifi,
        tier: 'enterprise',
        status: 'beta',
        details: [
          'Soil moisture sensors',
          'Temperature monitoring',
          'Light meters',
          'pH sensors',
          'Weather stations'
        ]
      },
      {
        title: 'Voice Commands',
        description: 'Hands-free garden management',
        icon: Headphones,
        tier: 'pro',
        status: 'coming-soon',
        details: [
          'Alexa integration',
          'Google Assistant',
          'Siri shortcuts',
          'Custom commands',
          'Audio reports'
        ]
      },
      {
        title: 'AR Plant Identification',
        description: 'Identify plants with your camera',
        icon: Camera,
        tier: 'pro',
        status: 'beta',
        details: [
          'Instant identification',
          'Disease detection',
          'Pest identification',
          'Maturity assessment',
          'AR overlays'
        ]
      },
      {
        title: 'Wearable Integration',
        description: 'Garden alerts on your wrist',
        icon: Timer,
        tier: 'enterprise',
        status: 'coming-soon',
        details: [
          'Apple Watch app',
          'Fitness tracking',
          'Task reminders',
          'Weather alerts',
          'Quick logging'
        ]
      }
    ]
  },
  {
    id: 'data-management',
    name: 'Data & Export Features',
    description: 'Complete control over your garden data',
    icon: Database,
    features: [
      {
        title: 'Cloud Backup',
        description: 'Automatic data synchronization',
        icon: Cloud,
        tier: 'free',
        status: 'available',
        details: [
          'Real-time sync',
          'Version history',
          'Automatic backup',
          'Multi-device access',
          'Data recovery'
        ]
      },
      {
        title: 'Export Options',
        description: 'Export data in multiple formats',
        icon: Download,
        tier: 'pro',
        status: 'available',
        details: [
          'PDF reports',
          'Excel spreadsheets',
          'JSON data',
          'CAD drawings',
          'Print layouts'
        ]
      },
      {
        title: 'API Access',
        description: 'Integrate with other tools',
        icon: GitBranch,
        tier: 'enterprise',
        status: 'available',
        details: [
          'REST API',
          'GraphQL endpoint',
          'Webhooks',
          'Custom integrations',
          'Rate limiting'
        ]
      },
      {
        title: 'Data Privacy',
        description: 'Complete control over your data',
        icon: Lock,
        tier: 'free',
        status: 'available',
        details: [
          'GDPR compliant',
          'Data encryption',
          'Private gardens',
          'Selective sharing',
          'Data deletion'
        ]
      },
      {
        title: 'Offline Mode',
        description: 'Work without internet',
        icon: WifiOff,
        tier: 'pro',
        status: 'available',
        details: [
          'Full offline access',
          'Local data storage',
          'Sync when connected',
          'Conflict resolution',
          'Offline maps'
        ]
      }
    ]
  }
]

const tierColors = {
  free: 'bg-green-100 text-green-800',
  pro: 'bg-blue-100 text-blue-800',
  enterprise: 'bg-purple-100 text-purple-800'
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  beta: 'bg-yellow-100 text-yellow-800',
  'coming-soon': 'bg-gray-100 text-gray-800'
}

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('garden-design')
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'pro' | 'enterprise'>('all')
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const filteredCategories = FEATURE_CATEGORIES.map(category => ({
    ...category,
    features: category.features.filter(
      feature => selectedTier === 'all' || feature.tier === selectedTier
    )
  }))

  const currentCategory = filteredCategories.find(cat => cat.id === selectedCategory)

  const featureStats = {
    total: FEATURE_CATEGORIES.reduce((sum, cat) => sum + cat.features.length, 0),
    available: FEATURE_CATEGORIES.reduce((sum, cat) =>
      sum + cat.features.filter(f => f.status === 'available').length, 0
    ),
    beta: FEATURE_CATEGORIES.reduce((sum, cat) =>
      sum + cat.features.filter(f => f.status === 'beta').length, 0
    ),
    coming: FEATURE_CATEGORIES.reduce((sum, cat) =>
      sum + cat.features.filter(f => f.status === 'coming-soon').length, 0
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/30 to-white">
      {/* Header */}
      <section className="py-12 px-4 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4" variant="secondary">
              {featureStats.total} Features & Counting
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From beginner-friendly tools to advanced analytics, our platform provides
              comprehensive features for every aspect of permaculture gardening.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{featureStats.available}</div>
                <div className="text-sm text-gray-600">Available Now</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">{featureStats.beta}</div>
                <div className="text-sm text-gray-600">In Beta</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-gray-600">{featureStats.coming}</div>
                <div className="text-sm text-gray-600">Coming Soon</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Categories</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tier Filter */}
      <section className="py-6 px-4 bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={selectedTier === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier('all')}
              >
                All Features
              </Button>
              <Button
                variant={selectedTier === 'free' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier('free')}
                className={selectedTier === 'free' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Free
              </Button>
              <Button
                variant={selectedTier === 'pro' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier('pro')}
                className={selectedTier === 'pro' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Pro
              </Button>
              <Button
                variant={selectedTier === 'enterprise' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTier('enterprise')}
                className={selectedTier === 'enterprise' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Enterprise
              </Button>
            </div>
            <div className="flex gap-2">
              <Link href="/demo">
                <Button variant="outline" size="sm">
                  Try Demo
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[280px,1fr] gap-6">
            {/* Category Sidebar */}
            <div className="space-y-2">
              {FEATURE_CATEGORIES.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                const featureCount = category.features.filter(
                  f => selectedTier === 'all' || f.tier === selectedTier
                ).length

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-white hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        isActive ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {featureCount} features
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Features Grid */}
            <div>
              {currentCategory && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{currentCategory.name}</h2>
                    <p className="text-gray-600">{currentCategory.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {currentCategory.features.map((feature, index) => {
                      const Icon = feature.icon
                      const isExpanded = expandedFeature === `${currentCategory.id}-${index}`

                      return (
                        <Card
                          key={index}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => setExpandedFeature(
                            isExpanded ? null : `${currentCategory.id}-${index}`
                          )}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <Icon className="h-8 w-8 text-green-600" />
                              <div className="flex gap-2">
                                <Badge className={tierColors[feature.tier]} variant="secondary">
                                  {feature.tier}
                                </Badge>
                                <Badge className={statusColors[feature.status]} variant="secondary">
                                  {feature.status.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </CardHeader>

                          {isExpanded && feature.details && (
                            <CardContent>
                              <div className="border-t pt-4">
                                <h4 className="font-semibold text-sm mb-2">Features Include:</h4>
                                <ul className="space-y-1">
                                  {feature.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>

                  {currentCategory.features.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No features match the selected tier filter.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of gardeners using our platform to grow more food with less effort.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}