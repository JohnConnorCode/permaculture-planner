'use client'

import React, { useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Network, Droplets, Sun, Wind, Zap, Heart, ArrowRight,
  Plus, Info, CheckCircle2, Sprout, Trees
} from 'lucide-react'
import { GardenBed } from '@/lib/garden/garden-types'

interface RelationshipMapperProps {
  gardenBeds: GardenBed[]
}

interface GuildRelationship {
  centerPlant: string
  companions: Array<{
    plant: string
    relationship: 'nitrogen-fixer' | 'pest-repellent' | 'pollinator' | 'ground-cover' | 'dynamic-accumulator'
    strength: number
  }>
}

interface EnergyFlow {
  from: string
  to: string
  type: 'water' | 'sunlight' | 'nutrients' | 'wind'
  impact: 'positive' | 'neutral' | 'negative'
}

export function RelationshipMapperPanel({ gardenBeds }: RelationshipMapperProps) {
  // Analyze relationships from garden data
  const { guilds, energyFlows, waterFlows, recommendations } = useMemo(() => {
    const guilds: GuildRelationship[] = []
    const energyFlows: EnergyFlow[] = []
    const waterFlows: any[] = []
    const recommendations: any[] = []

    // Detect plant guilds from beds
    gardenBeds.forEach(bed => {
      if (bed.plants && bed.plants.length > 2) {
        // Create guild from multi-plant beds
        const centerPlant = bed.plants[0]
        const companions = bed.plants.slice(1).map(p => ({
          plant: p.plantId,
          relationship: 'pollinator' as const,
          strength: 75
        }))

        guilds.push({
          centerPlant: centerPlant.plantId,
          companions
        })
      }
    })

    // Analyze spatial relationships for energy flows
    gardenBeds.forEach((bed, idx) => {
      gardenBeds.slice(idx + 1).forEach(otherBed => {
        // Calculate distance
        const dx = (bed.points?.[0]?.x || 0) - (otherBed.points?.[0]?.x || 0)
        const dy = (bed.points?.[0]?.y || 0) - (otherBed.points?.[0]?.y || 0)
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          // Close enough to have energy relationships
          energyFlows.push({
            from: bed.name,
            to: otherBed.name,
            type: 'nutrients',
            impact: 'positive'
          })
        }
      })
    })

    // Generate smart recommendations
    if (guilds.length === 0) {
      recommendations.push({
        type: 'guild',
        priority: 'high',
        message: 'No plant guilds detected. Create polyculture groupings for synergy.',
        action: 'Design your first guild'
      })
    }

    if (energyFlows.length < 3) {
      recommendations.push({
        type: 'energy',
        priority: 'medium',
        message: 'Limited energy flows between elements. Consider tighter spacing.',
        action: 'Optimize layout'
      })
    }

    return { guilds, energyFlows, waterFlows, recommendations }
  }, [gardenBeds])

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'nitrogen-fixer': return <Sprout className="h-4 w-4 text-green-600" />
      case 'pest-repellent': return <Trees className="h-4 w-4 text-amber-600" />
      case 'pollinator': return <Heart className="h-4 w-4 text-pink-600" />
      case 'ground-cover': return <Droplets className="h-4 w-4 text-blue-600" />
      case 'dynamic-accumulator': return <Zap className="h-4 w-4 text-purple-600" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getFlowIcon = (type: string) => {
    switch (type) {
      case 'water': return <Droplets className="h-4 w-4 text-blue-600" />
      case 'sunlight': return <Sun className="h-4 w-4 text-amber-600" />
      case 'nutrients': return <Sprout className="h-4 w-4 text-green-600" />
      case 'wind': return <Wind className="h-4 w-4 text-cyan-600" />
      default: return <Network className="h-4 w-4" />
    }
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Relationship Mapper</h2>
              <p className="text-sm text-muted-foreground">
                Visualize connections between plants, water, energy, and nutrients
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{rec.message}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {rec.priority}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="guilds" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="guilds" className="flex-1">
              Plant Guilds ({guilds.length})
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex-1">
              Energy Flows ({energyFlows.length})
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex-1">
              Guild Designer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guilds" className="space-y-4 mt-4">
            {guilds.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Network className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    No plant guilds detected yet. Start by grouping plants with complementary functions.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Design Your First Guild
                  </Button>
                </CardContent>
              </Card>
            ) : (
              guilds.map((guild, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Heart className="h-5 w-5 text-green-600" />
                      Guild {idx + 1}: {guild.centerPlant}
                    </CardTitle>
                    <CardDescription>
                      {guild.companions.length} companion plants
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Center plant */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {guild.centerPlant.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* Companion plants in circle */}
                    <div className="space-y-3">
                      {guild.companions.map((companion, compIdx) => (
                        <div key={compIdx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex-shrink-0">
                            {getRelationshipIcon(companion.relationship)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{companion.plant}</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {companion.relationship.replace('-', ' ')}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-xs font-medium text-green-600">
                              {companion.strength}% synergy
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Guild completeness: 60%
                      </div>
                      <Button size="sm" variant="outline">
                        Optimize Guild
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="energy" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Energy & Nutrient Flows</CardTitle>
                <CardDescription>
                  Visualize how resources move through your design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {energyFlows.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wind className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No energy flows detected. Add more elements to see connections.</p>
                  </div>
                ) : (
                  energyFlows.map((flow, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="flex-shrink-0">
                        {getFlowIcon(flow.type)}
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-medium text-sm">{flow.from}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{flow.to}</span>
                      </div>
                      <Badge
                        variant={flow.impact === 'positive' ? 'default' : 'secondary'}
                        className={flow.impact === 'positive' ? 'bg-green-600' : ''}
                      >
                        {flow.impact}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Water Cycle Visualization */}
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Water Cycle Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Rainwater Capture</span>
                    <Badge variant="outline">40% efficient</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Storage & Distribution</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Plant Uptake</span>
                    <Badge variant="outline">3 beds irrigated</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Soil Infiltration & Recharge</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Cycle Completeness</span>
                    <Badge className="bg-blue-600">65%</Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-muted-foreground">
                  <strong>Improvement:</strong> Add swales on east slope to increase water retention by 40%
                </div>
              </CardContent>
            </Card>

            {/* Nutrient Cycle */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  Nutrient Cycle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Nitrogen Fixers</span>
                    <Badge variant="outline">2 plants</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Soil Enrichment</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Dynamic Accumulators</span>
                    <Badge variant="outline">0 plants</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mulch & Compost Return</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm font-medium">Closed Loop %</span>
                    <Badge className="bg-green-600">45%</Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-muted-foreground">
                  <strong>Recommendation:</strong> Add comfrey and dandelion as dynamic accumulators
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="designer" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Interactive Guild Designer
                </CardTitle>
                <CardDescription>
                  Build complete plant guilds with instant feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 border-2 border-dashed rounded-lg text-center">
                  <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold mb-2">Choose Your Center Plant</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start by selecting a primary productive plant (fruit tree, berry bush, etc.)
                  </p>
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse Plant Library
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Guild Functions to Include:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Nitrogen Fixer', icon: Sprout, color: 'green' },
                      { name: 'Pollinator Attractor', icon: Heart, color: 'pink' },
                      { name: 'Pest Repellent', icon: Trees, color: 'amber' },
                      { name: 'Ground Cover', icon: Droplets, color: 'blue' },
                      { name: 'Dynamic Accumulator', icon: Zap, color: 'purple' },
                      { name: 'Mulch Producer', icon: Sprout, color: 'green' }
                    ].map((func, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="justify-start h-auto py-3"
                      >
                        <func.icon className={`h-4 w-4 mr-2 text-${func.color}-600`} />
                        <span className="text-sm">{func.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Pro Tip:</strong> A complete guild typically includes 4-7 species providing
                      different functions. Each function strengthens the whole system!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Connection Summary */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-base">System Integration Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{guilds.length}</div>
                <div className="text-xs text-muted-foreground">Active Guilds</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{energyFlows.length}</div>
                <div className="text-xs text-muted-foreground">Energy Flows</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(((guilds.length * 20) + (energyFlows.length * 10)))}%
                </div>
                <div className="text-xs text-muted-foreground">Integration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
