'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkipToMain } from '@/components/ui/accessibility'
import { HelpIcon, HelpPanel, permacultureHelpTips } from '@/components/ui/contextual-help'
import { MobileOptimizedButton, useIsMobile } from '@/components/ui/mobile-touch'
import {
  CheckCircle, Star, Zap, Shield, Users,
  Cpu, Cloud, Smartphone, Globe, BarChart3, BookOpen,
  Palette, Timer, Award, Heart, Leaf, Droplets,
  Sun, Moon, Wind, Thermometer, Calendar, Map,
  Camera, Bell, Mail, MessageCircle, Share2, Lock,
  TrendingUp, Package, Truck, ShoppingCart,
  FileJson, Database, GitBranch, Activity, Search, Filter,
  Layout, Layers, Grid3x3, Move, ZoomIn, Ruler,
  Beaker, Microscope, Calculator, PieChart, LineChart, BarChart,
  Video, Headphones, HelpCircle, FileText, Download, Upload,
  Wifi, WifiOff, RefreshCw, Save, Settings, Wrench,
  Sparkles, Brain, TreePine, Home, Building, Fish,
  Bug, Flower, Bird, Rabbit, Egg, Wheat, Apple,
  Carrot, Coffee, Cherry, Grape, Salad, Soup
} from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: React.ElementType
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
    id: 'intelligent-design',
    name: 'Garden Design Tools',
    description: 'Create optimized permaculture designs with smart planning features',
    icon: Palette,
    features: [
      {
        title: 'Garden Wizard',
        description: 'Step-by-step guided garden creation',
        icon: Sparkles,
        status: 'available',
        details: [
          'Location-based climate data integration',
          'Automatic USDA zone detection',
          'Frost date calculations',
          'Customizable area and shape options',
          'Surface type optimization (soil vs hardscape)',
          'Water source planning',
          'Accessibility-focused designs',
          'Time commitment matching'
        ]
      },
      {
        title: 'Interactive Design Canvas',
        description: 'Visual garden editor with drag-and-drop functionality',
        icon: Palette,
        status: 'available',
        details: [
          'Real-time garden visualization',
          'Custom bed shapes and sizes',
          'Plant placement with spacing guides',
          'Path and structure planning',
          'Multi-layer design (canopy, shrub, ground)',
          'Zoom and pan controls',
          'Grid snapping for precision',
          'Undo/redo functionality'
        ]
      }
    ]
  },
  {
    id: 'permaculture-features',
    name: 'Permaculture Design Systems',
    description: 'Complete toolkit for sustainable food production',
    icon: TreePine,
    features: [
      {
        title: 'Comprehensive Plant Database',
        description: 'Over 50+ plants with detailed permaculture data',
        icon: Leaf,
        status: 'available',
        details: [
          'Vegetables, herbs, fruits, and flowers',
          'Native and adapted varieties',
          'Companion planting relationships',
          'Nitrogen fixers and dynamic accumulators',
          'Growth requirements and zones',
          'Days to maturity tracking',
          'Spacing and yield data',
          'Medicinal and culinary uses'
        ]
      },
      {
        title: 'Permaculture Structures Library',
        description: 'Pre-designed structures for complete food systems',
        icon: Building,
        status: 'available',
        details: [
          'Rainwater harvesting systems',
          'Composting bins and worm farms',
          'Greenhouse and cold frames',
          'Chicken coops and rabbit hutches',
          'Beehives and insect hotels',
          'Aquaponics and pond systems',
          'Tool sheds and storage',
          'Social spaces (benches, pergolas)'
        ]
      },
      {
        title: 'Water Management Module',
        description: 'Calculate and optimize water usage',
        icon: Droplets,
        status: 'available',
        details: [
          'Rainwater collection calculations',
          'Roof area and runoff estimates',
          'Storage tank sizing',
          'Greywater system planning',
          'Drip irrigation design',
          'Swales and berms placement',
          'Water conservation strategies',
          'Drought resilience planning'
        ]
      },
      {
        title: 'Crop Rotation Engine',
        description: 'Multi-year rotation planning for soil health',
        icon: RefreshCw,
        status: 'available',
        details: [
          'Automatic family grouping',
          'Nitrogen cycle optimization',
          'Disease prevention strategies',
          'Cover crop integration',
          'Succession planting schedules',
          '3-4 year rotation plans',
          'Soil amendment recommendations',
          'Fallow period management'
        ]
      },
      {
        title: 'Food Forest Designer',
        description: 'Create multi-layer productive ecosystems',
        icon: TreePine,
        status: 'available',
        details: [
          '7-layer forest garden planning',
          'Guild creation tools',
          'Canopy tree selection',
          'Understory plant placement',
          'Nitrogen-fixing species integration',
          'Ground cover recommendations',
          'Vertical layer optimization',
          'Wildlife habitat creation'
        ]
      }
    ]
  },
  {
    id: 'planning-tools',
    name: 'Planning & Documentation',
    description: 'Professional reports and export capabilities',
    icon: FileText,
    features: [
      {
        title: 'PDF Report Generation',
        description: 'Professional garden plans with complete details',
        icon: FileText,
        status: 'available',
        details: [
          'Executive summary with key metrics',
          'Detailed plant lists and schedules',
          'Materials and cost estimates',
          'Planting calendars and timelines',
          'Maintenance schedules',
          'Harvest predictions',
          'Implementation roadmap',
          'Custom branding options'
        ]
      },
      {
        title: '2D Site Plan Export',
        description: 'Professional site plans in multiple formats',
        icon: Map,
        status: 'available',
        details: [
          'SVG vector graphics export',
          'High-resolution PNG images',
          'CAD-compatible formats',
          'Scale-accurate drawings',
          'Dimension annotations',
          'Plant legends and keys',
          'North arrow and scale bar',
          'Grid overlay options'
        ]
      },
      {
        title: 'Materials Calculator',
        description: 'Accurate estimates for all garden materials',
        icon: Calculator,
        status: 'available',
        details: [
          'Lumber requirements and cuts',
          'Soil and amendment volumes',
          'Mulch and compost needs',
          'Hardware and fasteners list',
          'Irrigation components',
          'Cost estimates by vendor',
          'Shopping lists by store',
          'Bulk order optimization'
        ]
      },
      {
        title: 'Task Management System',
        description: 'Automated task generation and tracking',
        icon: CheckCircle,
        status: 'available',
        details: [
          'Build phase tasks',
          'Planting schedules',
          'Maintenance reminders',
          'Harvest windows',
          'Seasonal checklists',
          'Weather-based adjustments',
          'Team task assignment',
          'Progress tracking'
        ]
      }
    ]
  },
  {
    id: 'site-intelligence',
    name: 'Site Intelligence & Data',
    description: 'Location-specific insights for optimal growing',
    icon: Globe,
    features: [
      {
        title: 'Climate Zone Detection',
        description: 'Automatic climate data for any location',
        icon: Thermometer,
        status: 'available',
        details: [
          'USDA hardiness zones',
          'Frost date predictions',
          'Growing season length',
          'Average temperatures',
          'Rainfall patterns',
          'Humidity levels',
          'Wind patterns',
          'Microclimate factors'
        ]
      },
      {
        title: 'Soil Analysis Integration',
        description: 'Connect soil test results for tailored recommendations',
        icon: Beaker,
        status: 'available',
        details: [
          'pH optimization strategies',
          'Nutrient deficiency solutions',
          'Organic matter improvement',
          'Drainage recommendations',
          'Amendment calculations',
          'Soil life enhancement',
          'Heavy metal remediation',
          'Contamination testing'
        ]
      },
      {
        title: 'Sun Exposure Mapping',
        description: 'Calculate optimal placement based on sun patterns',
        icon: Sun,
        status: 'available',
        details: [
          'Hour-by-hour sun tracking',
          'Seasonal variation modeling',
          'Shade pattern analysis',
          'Solar panel potential',
          'Greenhouse placement',
          'Heat sink identification',
          'Reflective surface planning',
          'Passive solar design'
        ]
      },
      {
        title: 'Local Resource Finder',
        description: 'Connect with local suppliers and resources',
        icon: Map,
        status: 'beta',
        details: [
          'Native plant nurseries',
          'Compost suppliers',
          'Mulch sources',
          'Tool libraries',
          'Seed swaps',
          'Community gardens',
          'Extension offices',
          'Master gardener programs'
        ]
      }
    ]
  },
  {
    id: 'ecosystem-integration',
    name: 'Ecosystem & Wildlife Support',
    description: 'Design gardens that support entire ecosystems',
    icon: Bird,
    features: [
      {
        title: 'Pollinator Garden Planning',
        description: 'Create habitats for bees, butterflies, and birds',
        icon: Flower,
        status: 'available',
        details: [
          'Native pollinator plants',
          'Bloom succession planning',
          'Nesting site design',
          'Water feature integration',
          'Pesticide-free zones',
          'Butterfly waystation certification',
          'Bee hotel placement',
          'Hummingbird gardens'
        ]
      },
      {
        title: 'Integrated Pest Management',
        description: 'Natural pest control through design',
        icon: Bug,
        status: 'available',
        details: [
          'Beneficial insect attraction',
          'Trap crop placement',
          'Companion planting for pest control',
          'Physical barrier planning',
          'Natural predator habitats',
          'Disease-resistant varieties',
          'Crop timing strategies',
          'Organic spray schedules'
        ]
      },
      {
        title: 'Small Livestock Integration',
        description: 'Incorporate chickens, rabbits, and more',
        icon: Egg,
        status: 'available',
        details: [
          'Chicken tractor routes',
          'Rabbit colony design',
          'Duck pond systems',
          'Rotational grazing plans',
          'Manure management',
          'Feed production areas',
          'Shelter requirements',
          'Zoning compliance'
        ]
      },
      {
        title: 'Aquaponics & Fish Systems',
        description: 'Integrate fish farming with vegetable production',
        icon: Fish,
        status: 'beta',
        details: [
          'System sizing calculators',
          'Fish stocking rates',
          'Biofilter design',
          'Grow bed planning',
          'Water quality management',
          'Species selection',
          'Backup system planning',
          'Energy requirements'
        ]
      }
    ]
  },
  {
    id: 'community-marketplace',
    name: 'Community & Learning',
    description: 'Connect with the permaculture community',
    icon: Users,
    features: [
      {
        title: 'Garden Sharing Platform',
        description: 'Share and discover garden designs',
        icon: Share2,
        status: 'available',
        details: [
          'Public design gallery',
          'Template marketplace',
          'Success story sharing',
          'Before/after showcases',
          'Regional adaptations',
          'Rating and reviews',
          'Fork and customize designs',
          'Collaborative planning'
        ]
      },
      {
        title: 'Expert Consultation Network',
        description: 'Connect with permaculture designers',
        icon: Headphones,
        status: 'coming-soon',
        details: [
          'Certified designer directory',
          'Video consultations',
          'Design review services',
          'Site analysis help',
          'Problem troubleshooting',
          'Implementation support',
          'Mentorship programs',
          'Group workshops'
        ]
      },
      {
        title: 'Knowledge Base & Tutorials',
        description: 'Comprehensive learning resources',
        icon: BookOpen,
        status: 'available',
        details: [
          'Permaculture principles guide',
          'Video tutorials library',
          'Seasonal guides',
          'Troubleshooting database',
          'Case studies',
          'Research papers',
          'Glossary of terms',
          'FAQ section'
        ]
      },
      {
        title: 'Local Community Features',
        description: 'Connect with nearby gardeners',
        icon: Map,
        status: 'beta',
        details: [
          'Local garden tours',
          'Seed swap events',
          'Tool sharing network',
          'Bulk buying groups',
          'Volunteer opportunities',
          'Skill sharing workshops',
          'Harvest sharing',
          'Community projects'
        ]
      }
    ]
  },
  {
    id: 'analytics-tracking',
    name: 'Analytics & Progress Tracking',
    description: 'Data-driven insights for continuous improvement',
    icon: BarChart3,
    features: [
      {
        title: 'Garden Dashboard',
        description: 'Real-time overview of your garden\'s performance',
        icon: PieChart,
        status: 'available',
        details: [
          'Active plant inventory',
          'Task completion rates',
          'Upcoming harvests',
          'Space utilization metrics',
          'Water usage tracking',
          'Cost per harvest analysis',
          'Success rate monitoring',
          'Problem area identification'
        ]
      },
      {
        title: 'Harvest Analytics',
        description: 'Track and optimize your yields',
        icon: TrendingUp,
        status: 'available',
        details: [
          'Weight and count logging',
          'Variety performance comparison',
          'Year-over-year analysis',
          'Peak harvest timing',
          'Storage tracking',
          'Preservation records',
          'Market value estimates',
          'Nutrition calculations'
        ]
      },
      {
        title: 'Environmental Impact Metrics',
        description: 'Measure your ecological footprint',
        icon: Globe,
        status: 'beta',
        details: [
          'Carbon sequestration estimates',
          'Water conservation metrics',
          'Biodiversity scoring',
          'Pollinator support index',
          'Food miles saved',
          'Compost diversion tracking',
          'Chemical reduction metrics',
          'Soil health improvements'
        ]
      },
      {
        title: 'Financial Tracking',
        description: 'Understand the economics of your garden',
        icon: Calculator,
        status: 'available',
        details: [
          'Setup cost tracking',
          'Ongoing expense logging',
          'Harvest value calculations',
          'ROI analysis',
          'Cost per meal estimates',
          'Savings vs store prices',
          'Time investment tracking',
          'Break-even analysis'
        ]
      }
    ]
  },
  {
    id: 'mobile-integration',
    name: 'Mobile & Accessibility',
    description: 'Garden management from anywhere',
    icon: Smartphone,
    features: [
      {
        title: 'Fully Responsive Design',
        description: 'Works perfectly on all devices',
        icon: Smartphone,
        status: 'available',
        details: [
          'Mobile-optimized interface',
          'Touch-friendly controls',
          'Offline mode support',
          'Progressive web app',
          'Fast loading times',
          'Data sync across devices',
          'Low bandwidth mode',
          'Accessibility features'
        ]
      },
      {
        title: 'Photo Documentation',
        description: 'Visual garden journal and progress tracking',
        icon: Camera,
        status: 'available',
        details: [
          'Progress photo timelines',
          'Plant health documentation',
          'Pest/disease identification',
          'Harvest galleries',
          'Before/after comparisons',
          'Seasonal changes',
          'Problem documentation',
          'Success celebrations'
        ]
      },
      {
        title: 'Quick Logging Tools',
        description: 'Fast data entry for busy gardeners',
        icon: Zap,
        status: 'available',
        details: [
          'Voice note recording',
          'Quick task completion',
          'Rapid harvest logging',
          'Weather observations',
          'Problem reporting',
          'Photo annotations',
          'Batch operations',
          'Smart suggestions'
        ]
      },
      {
        title: 'Notification System',
        description: 'Never miss important garden tasks',
        icon: Bell,
        status: 'available',
        details: [
          'Task reminders',
          'Weather alerts',
          'Harvest windows',
          'Frost warnings',
          'Watering reminders',
          'Pest outbreak alerts',
          'Community events',
          'System updates'
        ]
      }
    ]
  }
]

const statusColors = {
  available: 'bg-green-100 text-green-800',
  beta: 'bg-yellow-100 text-yellow-800',
  'coming-soon': 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  available: 'Available Now',
  beta: 'Beta',
  'coming-soon': 'Coming Soon'
}

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState('intelligent-design')
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentCategory = FEATURE_CATEGORIES.find(cat => cat.id === selectedCategory)

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
      <SkipToMain />

      {/* Header */}
      <section id="main-content" className="py-12 px-4 border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <Badge className="mb-4 opacity-0 animate-fade-in bg-green-100 text-green-800" variant="secondary"
                   style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              Free & Open Source • {featureStats.total} Powerful Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 opacity-0 animate-fade-in"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Everything You Need for Permaculture Success
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in"
               style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Design tools, comprehensive plant database, water management,
              crop rotation, and professional reporting - all completely free.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{featureStats.available}</div>
                <div className="text-sm text-gray-600">Available Now</div>
              </CardContent>
            </Card>
            <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">{featureStats.beta}</div>
                <div className="text-sm text-gray-600">In Beta</div>
              </CardContent>
            </Card>
            <Card className="opacity-0 animate-scale-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">50+</div>
                <div className="text-sm text-gray-600">Plants</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-6 px-4 bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 mr-2">Jump to:</span>
              <div className="flex gap-2 overflow-x-auto">
                {FEATURE_CATEGORIES.slice(0, 4).map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? 'bg-green-50 border-green-500' : ''}
                  >
                    {cat.name.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <HelpPanel
                tips={[
                  permacultureHelpTips.companionPlanting,
                  permacultureHelpTips.soilHealth,
                  permacultureHelpTips.waterRetention,
                  {
                    title: "Feature Status Guide",
                    description: "Available features are ready to use now. Beta features are functional but may receive updates. Coming Soon features are in development.",
                    type: "info" as const
                  }
                ]}
                title="Feature Guide"
                className="mr-2"
              />
              {isMobile ? (
                <MobileOptimizedButton variant="outline" size="sm" asChild>
                  <Link href="/demo">
                    Try Demo
                  </Link>
                </MobileOptimizedButton>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/demo">
                    Try Demo
                  </Link>
                </Button>
              )}
              {isMobile ? (
                <MobileOptimizedButton size="sm" className="bg-green-600 hover:bg-green-700" hapticFeedback asChild>
                  <Link href="/wizard">
                    Start Free
                  </Link>
                </MobileOptimizedButton>
              ) : (
                <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/wizard">
                    Start Free
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[300px,1fr] gap-6">
            {/* Category Sidebar */}
            <div className="space-y-2">
              {FEATURE_CATEGORIES.map((category, index) => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all opacity-0 animate-fade-in ${
                      isActive
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-white hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.05}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        isActive ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {category.features.length} features
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
                  <div className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
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
                          className="hover:shadow-lg transition-shadow cursor-pointer opacity-0 animate-scale-in"
                          style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: 'forwards' }}
                          onClick={() => setExpandedFeature(
                            isExpanded ? null : `${currentCategory.id}-${index}`
                          )}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <Icon className="h-8 w-8 text-green-600" />
                              <Badge className={statusColors[feature.status]} variant="secondary">
                                {statusLabels[feature.status]}
                              </Badge>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 px-4 bg-white border-t">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Permaculture Planner?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">True Permaculture Focus</h3>
              <p className="text-gray-600">
                Beyond simple gardening - design complete food systems with water
                harvesting, livestock integration, and regenerative practices.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">100% Free & Open Source</h3>
              <p className="text-gray-600">
                No subscriptions, no hidden fees, no premium tiers. Every feature is
                available to everyone, forever.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visual Design Tools</h3>
              <p className="text-gray-600">
                Intuitive drag-and-drop canvas for designing your garden with real-time
                visualization and smart planning features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Permaculture Journey Today
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Create sustainable food systems with free, comprehensive permaculture planning tools.
          </p>
          <div className="flex gap-4 justify-center">
            {isMobile ? (
              <MobileOptimizedButton size="lg" className="bg-white text-green-600 hover:bg-gray-100" hapticFeedback asChild>
                <Link href="/wizard">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your Garden Plan
                </Link>
              </MobileOptimizedButton>
            ) : (
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
                <Link href="/wizard">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your Garden Plan
                </Link>
              </Button>
            )}
            {isMobile ? (
              <MobileOptimizedButton size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/demo">
                  Explore Interactive Demo
                </Link>
              </MobileOptimizedButton>
            ) : (
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/demo">
                  Explore Interactive Demo
                </Link>
              </Button>
            )}
          </div>
          <p className="text-sm text-green-100 mt-6">
            No credit card required • Instant access • Community support
          </p>
        </div>
      </section>
    </div>
  )
}