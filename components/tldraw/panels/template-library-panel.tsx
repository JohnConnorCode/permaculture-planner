/**
 * Template Library Panel
 *
 * Pre-designed garden templates
 * Proven permaculture patterns
 * Size and climate-specific designs
 * Load templates as starting points
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Layout,
  Sparkles,
  Download,
  Star,
  MapPin,
  Ruler,
  Leaf,
  Droplets,
  TreePine,
  CircleDot,
  Grid3x3,
  Waves,
  Sun,
  Home,
  Award,
  Users,
  BookOpen,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import { cn } from '@/lib/utils'

interface TemplateLibraryPanelProps {
  gardenBeds: GardenBed[]
  onLoadTemplate?: (template: DesignTemplate) => void
}

interface DesignTemplate {
  id: string
  name: string
  description: string
  category: 'pattern' | 'size-based' | 'climate-specific' | 'featured'
  size: 'small' | 'medium' | 'large' | 'any'
  climate: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: React.ElementType
  thumbnail: string
  features: string[]
  plantCount: number
  estimatedCost: string
  maintenanceLevel: 'low' | 'medium' | 'high'
  yields: string[]
  principles: string[]
  detailedDescription: string
}

const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'keyhole-garden',
    name: 'Keyhole Garden',
    description:
      'Circular raised bed with central compost basket. Maximum productivity in minimal space.',
    category: 'pattern',
    size: 'small',
    climate: ['all'],
    difficulty: 'beginner',
    icon: CircleDot,
    thumbnail: '🔑',
    features: [
      'Central compost basket',
      '360° planting access',
      'Self-fertilizing system',
      'Water-efficient',
      'Wheelchair accessible',
    ],
    plantCount: 20,
    estimatedCost: '$200-400',
    maintenanceLevel: 'low',
    yields: ['Mixed vegetables', 'Herbs', 'Salad greens'],
    principles: [
      'Principle 6: Produce No Waste',
      'Principle 8: Integrate Rather Than Segregate',
      'Principle 10: Use and Value Diversity',
    ],
    detailedDescription: `A keyhole garden is a 6-8 foot diameter circular raised bed with a composting basket in the center. The path creates a "keyhole" shape for easy access to the center.

**How it works:**
1. Kitchen scraps go into central basket
2. Nutrients leach into surrounding soil
3. Plants arranged in concentric circles
4. Tallest plants on edges, shortest in center
5. Continuous fertility from composting

**Best for:**
- Small urban spaces
- Accessible gardening
- Year-round composting
- Teaching gardens
- Community projects

**Plant placement:**
- Outer ring: Tall crops (tomatoes, peppers)
- Middle ring: Medium crops (kale, chard)
- Inner ring: Short crops (lettuce, herbs)
- Ground cover: Strawberries, nasturtiums

This African-inspired design is perfect for water conservation and maximizing productivity in small spaces.`,
  },
  {
    id: 'three-sisters',
    name: 'Three Sisters Guild',
    description: 'Traditional Native American polyculture: corn, beans, and squash together.',
    category: 'pattern',
    size: 'medium',
    climate: ['temperate', 'warm', 'hot'],
    difficulty: 'beginner',
    icon: Leaf,
    thumbnail: '🌽',
    features: [
      'Proven for centuries',
      'Nitrogen fixation',
      'Living mulch',
      'Companion planting',
      'Complete nutrition',
    ],
    plantCount: 15,
    estimatedCost: '$50-100',
    maintenanceLevel: 'low',
    yields: ['Corn', 'Beans', 'Squash'],
    principles: [
      'Principle 3: Obtain a Yield',
      'Principle 8: Integrate Rather Than Segregate',
      'Principle 10: Use and Value Diversity',
    ],
    detailedDescription: `The Three Sisters is a companion planting method used by indigenous peoples of North America for thousands of years.

**The Sisters:**
1. **Corn** - Provides vertical structure for beans to climb
2. **Beans** - Fix nitrogen in soil, feeding corn and squash
3. **Squash** - Large leaves shade soil, retain moisture, deter pests

**Planting method:**
1. Create mounds 4-5 feet apart
2. Plant 4 corn seeds per mound first
3. Wait until corn is 6" tall
4. Plant 4 bean seeds around corn
5. Plant 2-3 squash seeds on mound edges
6. Water well and mulch

**Why it works:**
- Corn provides structure (trellis)
- Beans provide fertility (nitrogen)
- Squash provides protection (living mulch)
- Together they're more productive than apart
- Nutritionally complete (protein, carbs, vitamins)

**Modern variations:**
- Add sunflowers for extra structure
- Include herbs for pest control
- Try different varieties for your climate

This is permaculture at its finest - elements supporting each other.`,
  },
  {
    id: 'mandala-garden',
    name: 'Mandala Garden',
    description: 'Circular design with central water feature. Beautiful, productive, and symbolic.',
    category: 'pattern',
    size: 'medium',
    climate: ['all'],
    difficulty: 'intermediate',
    icon: CircleDot,
    thumbnail: '⭕',
    features: [
      'Central water feature',
      'Keyhole bed access',
      'Aesthetic appeal',
      'Sacred geometry',
      'Microclimate creation',
    ],
    plantCount: 50,
    estimatedCost: '$800-1500',
    maintenanceLevel: 'medium',
    yields: ['Diverse vegetables', 'Herbs', 'Flowers', 'Berries'],
    principles: [
      'Principle 2: Catch and Store Energy',
      'Principle 10: Use and Value Diversity',
      'Principle 11: Use Edges and Value the Marginal',
    ],
    detailedDescription: `A mandala garden is a circular design with 4-8 keyhole beds radiating from a central water feature or observation point.

**Design elements:**
- **Center:** Pond, fountain, or seating area
- **Inner ring:** Herbs and high-value crops
- **Middle ring:** Main vegetables
- **Outer ring:** Perennials and flowers
- **Paths:** Mulched keyhole access
- **Edges:** Tall plants, trellises

**Benefits:**
1. Central water creates humidity
2. Circular shape maximizes edge
3. Keyhole paths reduce compaction
4. Beautiful and functional
5. Spiritual/meditative quality

**Plant zones:**
- Zone 1 (center): Daily herbs (basil, parsley)
- Zone 2 (middle): Vegetables (tomatoes, peppers)
- Zone 3 (outer): Perennials (berries, flowers)

**Water feature options:**
- Small pond with fish
- Fountain for sound
- Birdbath for wildlife
- Rain barrel on pedestal
- Simply a meditation spot

The mandala design is popular in permaculture for its aesthetics, functionality, and symbolic representation of wholeness and harmony.`,
  },
  {
    id: 'food-forest',
    name: 'Food Forest (7 Layers)',
    description:
      'Multi-story edible ecosystem mimicking natural forests. Maximum productivity per square foot.',
    category: 'pattern',
    size: 'large',
    climate: ['all'],
    difficulty: 'advanced',
    icon: TreePine,
    thumbnail: '🌳',
    features: [
      '7 vertical layers',
      'Perennial-focused',
      'Self-maintaining',
      'Year-round yields',
      'Wildlife habitat',
    ],
    plantCount: 100,
    estimatedCost: '$2000-5000',
    maintenanceLevel: 'low',
    yields: ['Fruits', 'Nuts', 'Berries', 'Greens', 'Mushrooms', 'Medicinals'],
    principles: [
      'Principle 3: Obtain a Yield',
      'Principle 9: Use Small and Slow Solutions',
      'Principle 10: Use and Value Diversity',
      'Principle 12: Creatively Use and Respond to Change',
    ],
    detailedDescription: `A food forest is a designed ecosystem that mimics the structure of a natural forest but with edible plants.

**The 7 Layers:**

1. **Canopy Layer (30+ feet)**
   - Large fruit/nut trees
   - Examples: Apple, pear, pecan, walnut
   - Produces: Fruit, nuts, shade, wildlife habitat

2. **Sub-canopy Layer (15-30 feet)**
   - Dwarf fruit trees
   - Examples: Cherry, plum, peach
   - Produces: Fruit, flowers, mulch

3. **Shrub Layer (6-15 feet)**
   - Berry bushes
   - Examples: Blueberry, currant, elderberry
   - Produces: Berries, medicine, flowers

4. **Herbaceous Layer (0-6 feet)**
   - Perennial vegetables and herbs
   - Examples: Asparagus, rhubarb, comfrey
   - Produces: Vegetables, mulch, medicine

5. **Ground Cover Layer (0-1 foot)**
   - Low-growing plants
   - Examples: Strawberry, clover, thyme
   - Produces: Fruit, nitrogen, living mulch

6. **Rhizosphere (underground)**
   - Root crops
   - Examples: Potatoes, carrots, ginger
   - Produces: Vegetables, tubers

7. **Vertical Layer (climbing)**
   - Vines and climbers
   - Examples: Grapes, kiwi, beans
   - Produces: Fruit, shade, screening

**Succession timeline:**
- Years 1-2: Establish trees, plant annuals between
- Years 3-5: Add shrubs, guilds forming
- Years 5-10: Forest maturing, reducing annuals
- Years 10+: Self-maintaining, abundant yields

**Benefits:**
- 3-5x productivity of traditional row crops
- Minimal maintenance after establishment
- Builds soil continuously
- Creates wildlife habitat
- Climate resilience
- Diverse yields year-round

A food forest is the pinnacle of permaculture design - a self-maintaining, abundant ecosystem that improves over time.`,
  },
  {
    id: 'small-urban',
    name: 'Small Urban Garden (100 sq ft)',
    description: 'Maximum productivity in tiny spaces. Perfect for balconies and small yards.',
    category: 'size-based',
    size: 'small',
    climate: ['all'],
    difficulty: 'beginner',
    icon: Home,
    thumbnail: '🏡',
    features: [
      'Vertical growing',
      'Container-friendly',
      'High-value crops',
      'Quick yields',
      'Aesthetic focus',
    ],
    plantCount: 25,
    estimatedCost: '$300-600',
    maintenanceLevel: 'medium',
    yields: ['Salad greens', 'Herbs', 'Cherry tomatoes', 'Strawberries'],
    principles: [
      'Principle 1: Observe and Interact',
      'Principle 3: Obtain a Yield',
      'Principle 9: Use Small and Slow Solutions',
    ],
    detailedDescription: `Small spaces can be incredibly productive with smart design!

**Layout for 10' × 10' space:**
- **Back wall:** Vertical trellis with climbing crops
- **Sides:** Hanging planters with herbs
- **Center:** 2-3 raised beds (3' × 3')
- **Edges:** Container plants

**Plant selection strategy:**
Focus on high-value, expensive-to-buy crops:
1. Fresh herbs (basil, cilantro, parsley) - $3/bunch at store!
2. Salad greens (lettuce, arugula, spinach) - continuous harvest
3. Cherry tomatoes - prolific, vertical-growing
4. Strawberries - perennial, compact
5. Peppers - productive in containers

**Vertical strategies:**
- Trellises for tomatoes, peas, cucumbers
- Wall-mounted planters
- Hanging baskets for strawberries
- Stacking containers
- Railing planters for balconies

**Succession planting:**
- Plant new lettuce every 2 weeks
- Replace spring crops with summer crops
- Continuous harvest, never empty

**Pro tips:**
- Choose compact/dwarf varieties
- Use every vertical inch
- Companion plant intensively
- Focus on cut-and-come-again crops
- Drip irrigation for consistency

Even 100 sq ft can produce $500-1000 of organic produce per year!`,
  },
  {
    id: 'hot-climate',
    name: 'Hot & Dry Climate Design',
    description: 'Water-efficient design for arid regions. Focus on conservation and shade.',
    category: 'climate-specific',
    size: 'medium',
    climate: ['hot', 'arid'],
    difficulty: 'intermediate',
    icon: Sun,
    thumbnail: '☀️',
    features: [
      'Water harvesting',
      'Shade structures',
      'Mulch-heavy',
      'Drought-tolerant',
      'Heat-adapted plants',
    ],
    plantCount: 40,
    estimatedCost: '$1000-2000',
    maintenanceLevel: 'medium',
    yields: ['Tomatoes', 'Peppers', 'Melons', 'Herbs', 'Dates/figs'],
    principles: [
      'Principle 2: Catch and Store Energy',
      'Principle 5: Use and Value Renewable Resources',
      'Principle 12: Creatively Use and Respond to Change',
    ],
    detailedDescription: `Gardening in hot, dry climates requires specific strategies to conserve water and provide shade.

**Water management (critical!):**
1. **Swales:** On-contour ditches to capture runoff
2. **Mulch:** 4-6" deep to reduce evaporation
3. **Shade cloth:** 30-50% shade for summer crops
4. **Drip irrigation:** Deliver water directly to roots
5. **Rain catchment:** Every drop counts

**Plant selection:**
- **Trees:** Date palm, fig, pomegranate, olive
- **Shrubs:** Rosemary, lavender, sage
- **Vegetables:** Tomatoes, peppers, eggplant, melons
- **Ground cover:** Purslane, strawberries
- **Avoid:** Leafy greens (bolt in heat), water-hungry plants

**Shade strategies:**
1. Orient beds east-west for north-side shade
2. Use taller plants to shade shorter ones
3. Install shade cloth in summer
4. Plant deciduous trees for seasonal shade
5. Create microclimates with structures

**Timing:**
- Spring: Cool season crops (lettuce, peas)
- Summer: Heat-lovers (tomatoes, peppers, melons)
- Fall: Second spring crop season
- Winter: Best growing season for greens

**Soil improvement:**
- Heavy mulching (wood chips, straw)
- Compost to improve water retention
- Cover crops in winter
- Never leave soil bare

**Pro tips:**
- Water deeply but infrequently (encourages deep roots)
- Morning watering (reduces evaporation)
- Group plants by water needs
- Embrace heat-loving varieties

Hot climate gardening is possible with proper design - it's about working WITH the climate, not against it.`,
  },
  {
    id: 'cold-climate',
    name: 'Cold Climate Design',
    description: 'Season extension and hardy plants for northern gardens.',
    category: 'climate-specific',
    size: 'medium',
    climate: ['cold', 'temperate'],
    difficulty: 'intermediate',
    icon: TreePine,
    thumbnail: '❄️',
    features: [
      'Season extension',
      'Cold frames',
      'Hardy perennials',
      'Microclimate creation',
      'Thermal mass',
    ],
    plantCount: 35,
    estimatedCost: '$800-1500',
    maintenanceLevel: 'medium',
    yields: ['Root crops', 'Brassicas', 'Hardy greens', 'Berries', 'Apples'],
    principles: [
      'Principle 1: Observe and Interact',
      'Principle 2: Catch and Store Energy',
      'Principle 11: Use Edges and Value the Marginal',
    ],
    detailedDescription: `Cold climate gardening extends the season and focuses on hardy, productive plants.

**Season extension techniques:**
1. **Cold frames:** Add 4-6 weeks spring and fall
2. **Row covers:** Protect from frost
3. **Hoop houses:** Unheated season extension
4. **South-facing walls:** Thermal mass and protection
5. **Mulch management:** Insulate roots in winter

**Microclimate strategies:**
- Place tender plants near south-facing walls
- Use evergreens as windbreaks
- Dark mulch to absorb heat in spring
- Thermal mass (rocks, water barrels) to moderate temps
- Sunken beds stay warmer

**Hardy plant selection:**
- **Trees:** Apple, pear, plum, cherry
- **Shrubs:** Blueberry, currant, jostaberry, aronia
- **Perennials:** Rhubarb, asparagus, sunchokes, sorrel
- **Vegetables:** Kale, carrots, beets, potatoes
- **Greens:** Spinach, mache, claytonia (survive winter!)

**Succession strategy:**
- Early spring: Under cover (lettuce, spinach, peas)
- Late spring: Direct sow (carrots, beets, beans)
- Summer: Heat lovers (tomatoes, peppers - use transplants)
- Fall: Second harvest (greens, brassicas)
- Winter: Storage crops (potatoes, squash, onions)

**Protecting plants:**
- Floating row covers (add 5°F protection)
- Mulch perennials after ground freezes
- Windbreaks prevent desiccation
- Snow is an insulator (don't remove it!)

**Year-round harvest:**
- Kale, spinach, mache survive under snow
- Cold frames allow winter greens
- Root cellars store harvests
- Fermentation and canning for preservation

**Pro tips:**
- Choose short-season varieties
- Use transplants to jump-start warm crops
- Focus on storage crops for winter
- Embrace the cold-hardy vegetables
- Plan for 4 seasons, not just summer

Cold climates can be incredibly productive - northern soils are often rich, and many crops prefer cool weather!`,
  },
]

export function TemplateLibraryPanel({
  gardenBeds,
  onLoadTemplate,
}: TemplateLibraryPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null)
  const [showLoadDialog, setShowLoadDialog] = useState(false)

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return DESIGN_TEMPLATES.filter((template) => {
      if (selectedCategory !== 'all' && template.category !== selectedCategory) return false
      if (selectedSize !== 'all' && template.size !== selectedSize && template.size !== 'any')
        return false
      return true
    })
  }, [selectedCategory, selectedSize])

  const handleLoadTemplate = (template: DesignTemplate) => {
    setSelectedTemplate(template)
    setShowLoadDialog(true)
  }

  const confirmLoadTemplate = () => {
    if (selectedTemplate && onLoadTemplate) {
      onLoadTemplate(selectedTemplate)
      setShowLoadDialog(false)
      setSelectedTemplate(null)
    }
  }

  // Detailed view
  if (selectedTemplate && !showLoadDialog) {
    const Icon = selectedTemplate.icon
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
            ← Back to Templates
          </Button>

          {/* Template header */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-3xl">
                {selectedTemplate.thumbnail}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold tracking-tight">{selectedTemplate.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                  <Badge variant="outline">{selectedTemplate.size} size</Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      selectedTemplate.difficulty === 'beginner' &&
                        'bg-green-100 text-green-800 border-green-300',
                      selectedTemplate.difficulty === 'intermediate' &&
                        'bg-yellow-100 text-yellow-800 border-yellow-300',
                      selectedTemplate.difficulty === 'advanced' &&
                        'bg-red-100 text-red-800 border-red-300'
                    )}
                  >
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Plant Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedTemplate.plantCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedTemplate.estimatedCost}</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                About This Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                style={{ whiteSpace: 'pre-line' }}
              >
                {selectedTemplate.detailedDescription}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2">
                {selectedTemplate.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Expected yields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expected Yields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.yields.map((yield_, index) => (
                  <Badge key={index} variant="secondary">
                    {yield_}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permaculture principles */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Permaculture Principles Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {selectedTemplate.principles.map((principle, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {principle}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Load button */}
          <Button className="w-full" size="lg" onClick={() => handleLoadTemplate(selectedTemplate)}>
            <Download className="h-5 w-5 mr-2" />
            Load This Template
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Library</h2>
          <p className="text-muted-foreground">
            Proven designs and patterns to inspire your garden
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pattern">Permaculture Patterns</SelectItem>
                <SelectItem value="size-based">By Size</SelectItem>
                <SelectItem value="climate-specific">By Climate</SelectItem>
                <SelectItem value="featured">Featured Designs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (&lt; 200 sq ft)</SelectItem>
                <SelectItem value="medium">Medium (200-1000 sq ft)</SelectItem>
                <SelectItem value="large">Large (&gt; 1000 sq ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured templates */}
        {selectedCategory === 'all' && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Popular Templates
              </CardTitle>
              <CardDescription>Most used by our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {DESIGN_TEMPLATES.filter((t) => ['keyhole-garden', 'three-sisters'].includes(t.id)).map((template) => {
                  const Icon = template.icon
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{template.thumbnail}</div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {template.description}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-300"
                          >
                            Popular
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = template.icon
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-2xl">
                      {template.thumbnail}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={cn(
                            template.difficulty === 'beginner' &&
                              'bg-green-100 text-green-800 border-green-300',
                            template.difficulty === 'intermediate' &&
                              'bg-yellow-100 text-yellow-800 border-yellow-300',
                            template.difficulty === 'advanced' &&
                              'bg-red-100 text-red-800 border-red-300'
                          )}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {template.plantCount} plants
                        </div>
                        <div className="flex items-center gap-1">
                          <Ruler className="h-3 w-3" />
                          {template.size}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {template.climate.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No templates found matching your filters
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load confirmation dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Template?</DialogTitle>
            <DialogDescription>
              This will replace your current design with the "{selectedTemplate?.name}" template.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLoadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Load Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
