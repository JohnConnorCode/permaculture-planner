/**
 * Permaculture Knowledge Base Panel
 *
 * In-app education system
 * Learn permaculture principles, patterns, and techniques
 * Context-aware learning recommendations
 * Build expertise while designing
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BookOpen,
  Lightbulb,
  Sprout,
  Droplets,
  Compass,
  Users,
  Repeat,
  Leaf,
  Search,
  ExternalLink,
  Star,
  Award,
  Target,
  Layers,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import { cn } from '@/lib/utils'

interface KnowledgeBasePanelProps {
  gardenBeds: GardenBed[]
}

interface KnowledgeArticle {
  id: string
  title: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  icon: React.ElementType
  summary: string
  content: string
  keyTakeaways: string[]
  relatedTopics: string[]
}

const PERMACULTURE_PRINCIPLES = [
  {
    number: 1,
    title: 'Observe and Interact',
    description:
      "By taking time to engage with nature we can design solutions that suit our particular situation. Beauty is in the eye of the beholder.",
    icon: Target,
    color: 'text-blue-600',
    example:
      'Before designing, spend a year observing your site. Note sun patterns, water flow, wind, wildlife, and microclimates. Your observations will reveal the best locations for different elements.',
    inPractice: [
      'Track sun exposure throughout seasons',
      'Observe water movement during rain',
      'Note prevailing wind patterns',
      'Identify existing microclimates',
    ],
  },
  {
    number: 2,
    title: 'Catch and Store Energy',
    description:
      'By developing systems that collect resources at peak abundance, we can use them in times of need. Make hay while the sun shines.',
    icon: Droplets,
    color: 'text-orange-600',
    example:
      'Capture rainwater in tanks, ponds, or swales. Store solar energy through greenhouses. Preserve harvest abundance through canning, drying, and fermentation.',
    inPractice: [
      'Install rainwater catchment systems',
      'Build swales to slow and infiltrate water',
      'Create thermal mass in greenhouses',
      'Preserve abundant harvests',
    ],
  },
  {
    number: 3,
    title: 'Obtain a Yield',
    description:
      'Ensure that you are getting truly useful rewards as part of the work that you are doing. You can\'t work on an empty stomach.',
    icon: Sprout,
    color: 'text-green-600',
    example:
      "Every element should provide value: food, medicine, materials, beauty, or habitat. A fruit tree provides food, shade, mulch (leaves), and wildlife habitat.",
    inPractice: [
      'Choose multi-purpose plants and elements',
      'Design for continuous harvests',
      'Include quick yields (annuals) and long-term yields (perennials)',
      'Measure and celebrate your harvests',
    ],
  },
  {
    number: 4,
    title: 'Apply Self-Regulation and Accept Feedback',
    description:
      'We need to discourage inappropriate activity to ensure that systems can continue to function well. The sins of the fathers are visited upon the children of the seventh generation.',
    icon: Repeat,
    color: 'text-purple-600',
    example:
      "Monitor your garden's performance. If a technique isn't working, adapt. Learn from failures. Adjust based on what you observe rather than assumptions.",
    inPractice: [
      'Keep a garden journal',
      'Track what works and what fails',
      'Adjust designs based on results',
      'Learn from mistakes',
    ],
  },
  {
    number: 5,
    title: 'Use and Value Renewable Resources',
    description:
      'Make the best use of nature\'s abundance to reduce our consumptive behavior and dependence on non-renewable resources. Let nature take its course.',
    icon: Leaf,
    color: 'text-emerald-600',
    example:
      'Use solar energy, wind power, and human/animal labor. Compost organic waste. Mulch with leaves and grass clippings. Save seeds. Build soil naturally.',
    inPractice: [
      'Compost all organic matter',
      'Use natural mulches',
      'Save seeds from best performers',
      'Build soil with cover crops',
    ],
  },
  {
    number: 6,
    title: 'Produce No Waste',
    description:
      'By valuing and making use of all the resources that are available to us, nothing goes to waste. A stitch in time saves nine / Waste not, want not.',
    icon: Repeat,
    color: 'text-teal-600',
    example:
      "Everything is a resource for something else. 'Waste' from one element becomes food for another. Weeds become mulch. Kitchen scraps become compost. Prunings become hugelkultur.",
    inPractice: [
      'Compost all organic matter',
      'Use weeds as mulch',
      'Create closed-loop systems',
      'Find value in every output',
    ],
  },
  {
    number: 7,
    title: 'Design from Patterns to Details',
    description:
      'By stepping back, we can observe patterns in nature and society. These can form the backbone of our designs, with the details filled in as we go. Can\'t see the forest for the trees.',
    icon: Compass,
    color: 'text-indigo-600',
    example:
      'Start with the big picture: zones, sectors, water flow, access paths. Then add specific plants and details. Like a painter starting with composition, then adding details.',
    inPractice: [
      'Map zones based on frequency of use',
      'Analyze sectors (external energies)',
      'Plan water management infrastructure first',
      'Then select specific plants and varieties',
    ],
  },
  {
    number: 8,
    title: 'Integrate Rather Than Segregate',
    description:
      'By putting the right things in the right place, relationships develop between those things and they work together to support each other. Many hands make light work.',
    icon: Users,
    color: 'text-pink-600',
    example:
      'Build plant guilds where plants support each other. Place chickens under fruit trees to eat pests and fertilize. Connect systems so outputs feed inputs.',
    inPractice: [
      'Create plant guilds (not monocultures)',
      'Stack functions in the same space',
      'Connect animal and plant systems',
      'Design beneficial relationships',
    ],
  },
  {
    number: 9,
    title: 'Use Small and Slow Solutions',
    description:
      'Small and slow systems are easier to maintain than big ones, making better use of local resources and producing more sustainable outcomes. Slow and steady wins the race / The bigger they are, the harder they fall.',
    icon: Sprout,
    color: 'text-lime-600',
    example:
      'Start with a small garden and expand as you learn. Build soil gradually. Plant perennials that will mature over years. Phase implementation.',
    inPractice: [
      'Start small and expand',
      'Build soil over time',
      'Phase implementation',
      'Learn as you grow',
    ],
  },
  {
    number: 10,
    title: 'Use and Value Diversity',
    description:
      'Diversity reduces vulnerability to threats and makes full use of the environment. Don\'t put all your eggs in one basket.',
    icon: Layers,
    color: 'text-amber-600',
    example:
      'Diverse polycultures are more resilient than monocultures. Mix annuals and perennials. Include 7+ layers. Grow many varieties.',
    inPractice: [
      'Plant diverse polycultures',
      'Include all 7 layers',
      'Grow many varieties',
      'Diversify yields',
    ],
  },
  {
    number: 11,
    title: 'Use Edges and Value the Marginal',
    description:
      'The interface between things is where the most interesting events take place. These are often the most valuable, diverse and productive elements in the system. Don\'t think you are on the right track just because it\'s a well-beaten path.',
    icon: TrendingUp,
    color: 'text-cyan-600',
    example:
      'Forest edges have the most diversity and productivity. Pond edges support unique ecosystems. Garden bed edges allow for edge planting. Embrace the margins.',
    inPractice: [
      'Design curving edges (not straight lines)',
      'Plant pond edges densely',
      'Use bed edges for herbs',
      'Value marginal spaces',
    ],
  },
  {
    number: 12,
    title: 'Creatively Use and Respond to Change',
    description:
      'We can have a positive impact on inevitable change by carefully observing, and then intervening at the right time. Vision is not seeing things as they are but as they will be.',
    icon: Repeat,
    color: 'text-violet-600',
    example:
      'Gardens evolve. Annuals give way to perennials. Young trees mature and create shade. Respond creatively by adapting plantings to changing conditions.',
    inPractice: [
      'Plan for succession over years',
      'Adapt to changing conditions',
      'See challenges as opportunities',
      'Design for evolution',
    ],
  },
]

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'guild-design',
    title: 'Designing Plant Guilds',
    category: 'Techniques',
    difficulty: 'intermediate',
    readTime: 8,
    icon: Sprout,
    summary: 'Learn how to create synergistic plant communities that support each other',
    content: `A guild is a group of plants that work together, each supporting the others through complementary functions.

**Guild Structure:**
- **Central element** (usually a fruit/nut tree)
- **Nitrogen fixers** (legumes to build soil)
- **Dynamic accumulators** (mine nutrients from deep soil)
- **Insectary plants** (attract beneficial insects)
- **Mulch plants** (provide ground cover)
- **Pollinator attractors** (ensure fruit set)

**Classic Apple Guild Example:**
- Apple tree (central element, provides fruit)
- Clover/vetch (nitrogen fixers around base)
- Comfrey (dynamic accumulator, mines nutrients)
- Yarrow (insectary, attracts predatory wasps)
- Strawberries (living mulch, ground cover)
- Borage (pollinator attractor, bee favorite)
- Chives (pest deterrent, repels aphids)

**Design Tips:**
1. Start with the central element
2. Add support plants that fill different niches
3. Consider timing - not all plants active at once
4. Leave space for growth
5. Observe and adjust over seasons`,
    keyTakeaways: [
      'Guilds create self-supporting plant communities',
      'Include 5-7 different functional roles',
      'Start simple and add complexity over time',
      'Observe and adjust based on performance',
    ],
    relatedTopics: ['companion-planting', 'polyculture', 'stacking-functions'],
  },
  {
    id: 'zone-planning',
    title: 'Zone Planning for Efficiency',
    category: 'Design',
    difficulty: 'beginner',
    readTime: 6,
    icon: Target,
    summary: 'Organize your garden based on frequency of use and maintenance needs',
    content: `Zones are areas organized by how frequently you visit and interact with them.

**Zone 0:** Your home - the center of activity

**Zone 1:** High-maintenance, high-use (5-10 feet from door)
- Herbs used daily
- Salad greens
- Cherry tomatoes
- Frequent harvest crops
- Intensive care plants

**Zone 2:** Medium maintenance (10-50 feet)
- Main vegetable garden
- Soft fruits (berries)
- Espaliered fruit trees
- Compost bins
- Small livestock

**Zone 3:** Low maintenance (50-200 feet)
- Orchard
- Field crops (squash, corn)
- Grazing animals
- Large compost piles

**Zone 4:** Minimal management (200+ feet)
- Foraging areas
- Timber
- Wild harvests
- Wildlife habitat

**Zone 5:** Wild, unmanaged
- Nature preserve
- Observation
- Seed collection
- Learning from nature

**Key Principle:** Most-used areas closest to home. Work WITH human laziness, not against it!`,
    keyTakeaways: [
      'Place frequently used elements closest to home',
      'Reduce walking distance for daily tasks',
      'Match maintenance level to distance',
      'Design for human behavior, not ideal behavior',
    ],
    relatedTopics: ['sector-analysis', 'access-design', 'efficient-layouts'],
  },
  {
    id: 'water-management',
    title: 'Water Harvesting Strategies',
    category: 'Infrastructure',
    difficulty: 'intermediate',
    readTime: 10,
    icon: Droplets,
    summary: 'Capture, store, and infiltrate water for climate resilience',
    content: `Water is often the limiting factor in gardens. Design to capture every drop.

**Slow, Spread, Sink:**
1. **SLOW** water movement (reduce runoff)
2. **SPREAD** water across landscape (hydrate broadly)
3. **SINK** water into soil (build groundwater)

**Water Harvesting Techniques:**

**Rainwater Tanks**
- Catch roof runoff
- Store for dry periods
- 1000 sq ft roof + 1" rain = 600 gallons
- Use for drip irrigation

**Swales**
- Level ditches on contour
- Slow and infiltrate water
- Plant downhill berm
- Creates moist microclimate

**Berms**
- Raised planting areas
- Paired with swales
- Improved drainage
- Warm faster in spring

**Rain Gardens**
- Low spots that collect water
- Plant water-loving species
- Filter runoff
- Recharge groundwater

**Greywater Systems**
- Reuse shower/sink water
- Irrigate landscape
- Reduce water bills
- Close the loop

**Calculation Example:**
1000 sq ft roof × 30" annual rain = 18,750 gallons/year
If you capture 80% = 15,000 gallons free water!`,
    keyTakeaways: [
      'Capture water high in landscape',
      'Slow water down to increase infiltration',
      'Spread water across multiple elements',
      'Store water in soil and tanks',
    ],
    relatedTopics: ['swales', 'earthworks', 'greywater', 'irrigation'],
  },
  {
    id: 'succession-planning',
    title: 'Succession Planting Over Time',
    category: 'Techniques',
    difficulty: 'advanced',
    readTime: 12,
    icon: Repeat,
    summary: 'Design gardens that evolve from pioneer plants to climax communities',
    content: `Permaculture gardens mature over time, transitioning through stages like natural ecosystems.

**Year 1-2: Pioneer Stage**
- Fast-growing annuals
- Soil building
- Quick yields
- Heavy feeders (tomatoes, squash)
- Nitrogen fixers (beans, peas)
- Ground cover establishment

**Year 3-5: Succession Stage**
- Perennials establishing
- Berries producing
- Annual/perennial mix
- Guilds forming
- Soil fertility building
- Structure developing

**Year 5-10: Climax Stage**
- Trees producing
- Self-maintaining guilds
- Minimal inputs needed
- Maximum diversity
- Stable ecosystem
- Abundant yields

**Crop Rotation Within Succession:**

**Year 1:** Heavy feeders (tomatoes, brassicas)
- Deplete nutrients
- Require inputs

**Year 2:** Light feeders (root crops, alliums)
- Lower nutrient needs
- Clean up soil

**Year 3:** Nitrogen fixers (legumes)
- Build soil back up
- Add organic matter

**Year 4:** Return to heavy feeders
- Cycle continues
- Or transition to perennials

**Transitioning Strategy:**
- Start with 80% annuals, 20% perennials
- Year 3: 60% annuals, 40% perennials
- Year 5: 40% annuals, 60% perennials
- Year 10: 20% annuals, 80% perennials

**Why This Matters:**
Forests don't start as forests - they start as weeds, then shrubs, then trees. Design WITH natural succession rather than against it.`,
    keyTakeaways: [
      'Gardens mature through natural stages',
      'Start with annuals, transition to perennials',
      'Rotate crop families for soil health',
      'Design for 10+ year evolution',
    ],
    relatedTopics: ['crop-rotation', 'soil-building', 'polyculture', 'forest-gardens'],
  },
]

export function KnowledgeBasePanel({ gardenBeds }: KnowledgeBasePanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  // Filter articles by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return KNOWLEDGE_ARTICLES
    const query = searchQuery.toLowerCase()
    return KNOWLEDGE_ARTICLES.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Context-aware recommendations based on current design
  const recommendations = useMemo(() => {
    const totalPlants = gardenBeds.reduce((sum, bed) => sum + (bed.plants?.length || 0), 0)
    const bedCount = gardenBeds.length

    const recs = []

    if (bedCount === 0) {
      recs.push({
        title: 'Start with Zone Planning',
        reason: "You haven't created any beds yet",
        articleId: 'zone-planning',
      })
    }

    if (totalPlants === 0 && bedCount > 0) {
      recs.push({
        title: 'Learn About Plant Guilds',
        reason: 'Your beds are empty - time to plan plantings!',
        articleId: 'guild-design',
      })
    }

    if (totalPlants > 10) {
      recs.push({
        title: 'Succession Planning',
        reason: 'Your garden is established - plan for long-term evolution',
        articleId: 'succession-planning',
      })
    }

    recs.push({
      title: 'Water Harvesting',
      reason: 'Water is critical for all gardens',
      articleId: 'water-management',
    })

    return recs
  }, [gardenBeds])

  if (selectedArticle) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
            ← Back to Knowledge Base
          </Button>

          {/* Article header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{selectedArticle.category}</Badge>
              <Badge
                variant="outline"
                className={cn(
                  selectedArticle.difficulty === 'beginner' &&
                    'bg-green-100 text-green-800 border-green-300',
                  selectedArticle.difficulty === 'intermediate' &&
                    'bg-yellow-100 text-yellow-800 border-yellow-300',
                  selectedArticle.difficulty === 'advanced' &&
                    'bg-red-100 text-red-800 border-red-300'
                )}
              >
                {selectedArticle.difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {selectedArticle.readTime} min read
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{selectedArticle.title}</h2>
            <p className="text-muted-foreground mt-2">{selectedArticle.summary}</p>
          </div>

          {/* Article content */}
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                style={{ whiteSpace: 'pre-line' }}
              >
                {selectedArticle.content}
              </div>
            </CardContent>
          </Card>

          {/* Key takeaways */}
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedArticle.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Related topics */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {selectedArticle.relatedTopics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permaculture Knowledge Base</h2>
          <p className="text-muted-foreground">Learn principles, patterns, and techniques</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="recommended" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommended">For You</TabsTrigger>
            <TabsTrigger value="principles">Principles</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          {/* Recommended tab */}
          <TabsContent value="recommended" className="space-y-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Recommended for Your Design
                </CardTitle>
                <CardDescription>Based on your current garden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, index) => {
                  const article = KNOWLEDGE_ARTICLES.find((a) => a.id === rec.articleId)
                  if (!article) return null

                  const Icon = article.icon
                  return (
                    <Card
                      key={index}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                          </div>
                          <Badge variant="outline">{article.readTime} min</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Principles tab */}
          <TabsContent value="principles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  The 12 Principles of Permaculture
                </CardTitle>
                <CardDescription>
                  Design framework by David Holmgren - the foundation of all permaculture design
                </CardDescription>
              </CardHeader>
            </Card>

            <Accordion type="single" collapsible className="space-y-2">
              {PERMACULTURE_PRINCIPLES.map((principle) => {
                const Icon = principle.icon
                return (
                  <AccordionItem
                    key={principle.number}
                    value={`principle-${principle.number}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'
                          )}
                        >
                          <Icon className={cn('h-5 w-5', principle.color)} />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {principle.number}. {principle.title}
                          </div>
                          <div className="text-sm text-muted-foreground font-normal">
                            {principle.description}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2">
                      <div className="space-y-4 pl-13">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Example:</h4>
                          <p className="text-sm text-muted-foreground">{principle.example}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">In Practice:</h4>
                          <ul className="space-y-1">
                            {principle.inPractice.map((item, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>

          {/* Articles tab */}
          <TabsContent value="articles" className="space-y-3">
            {filteredArticles.map((article) => {
              const Icon = article.icon
              return (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setSelectedArticle(article)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-base">{article.title}</CardTitle>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardDescription>{article.summary}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              article.difficulty === 'beginner' &&
                                'bg-green-100 text-green-800 border-green-300',
                              article.difficulty === 'intermediate' &&
                                'bg-yellow-100 text-yellow-800 border-yellow-300',
                              article.difficulty === 'advanced' &&
                                'bg-red-100 text-red-800 border-red-300'
                            )}
                          >
                            {article.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {article.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}

            {filteredArticles.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No articles found matching "{searchQuery}"
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
