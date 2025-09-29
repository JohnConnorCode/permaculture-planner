'use client'

import { PlantGroup, checkGroupCompatibility, calculateGroupWaterNeeds, calculateSunExposure } from '@/lib/plant-management'
import { PlantInfo } from '@/lib/data/plant-library'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Calendar, Droplets, Sun, Users, AlertTriangle, CheckCircle, Edit, Trash2, Copy } from 'lucide-react'
import { GardenBed } from '@/components/garden-designer-canvas'

interface PlantGroupPanelProps {
  groups: PlantGroup[]
  beds: GardenBed[]
  plantLibrary: PlantInfo[]
  selectedGroupId?: string
  onGroupSelect: (groupId: string) => void
  onGroupEdit: (group: PlantGroup) => void
  onGroupDelete: (groupId: string) => void
  onGroupDuplicate: (group: PlantGroup) => void
}

export function PlantGroupPanel({
  groups,
  beds,
  plantLibrary,
  selectedGroupId,
  onGroupSelect,
  onGroupEdit,
  onGroupDelete,
  onGroupDuplicate
}: PlantGroupPanelProps) {
  const selectedGroup = groups.find(g => g.id === selectedGroupId)

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <CardTitle>Plant Groups</CardTitle>
        <CardDescription>
          Manage grouped plants for efficient planning
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="list" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Groups ({groups.length})
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedGroup}>
              Details
            </TabsTrigger>
            <TabsTrigger value="schedule">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="p-4 space-y-2">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No plant groups yet. Select multiple plants and press Ctrl+G to create a group.
              </p>
            ) : (
              groups.map(group => {
                const bed = beds.find(b => b.id === group.bedId)
                const compatibility = checkGroupCompatibility(
                  group.plants.map(p =>
                    plantLibrary.find(pl => pl.id === p.plantId)!
                  ).filter(Boolean)
                )

                return (
                  <div
                    key={group.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedGroupId === group.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onGroupSelect(group.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {group.plants.length} plants in {bed?.name || 'Unknown bed'}
                        </div>
                        <div className="flex gap-2 mt-2">
                          {compatibility.compatible ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Compatible
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Issues
                            </Badge>
                          )}
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(group.plantingDate).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onGroupEdit(group)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onGroupDuplicate(group)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onGroupDelete(group.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="details" className="p-4">
            {selectedGroup && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Group Composition</h4>
                  <div className="space-y-2">
                    {selectedGroup.plants.map(plant => {
                      const info = plantLibrary.find(p => p.id === plant.plantId)
                      if (!info) return null
                      return (
                        <div key={plant.id} className="flex items-center gap-2 text-sm">
                          <span className="text-lg">{info.icon}</span>
                          <span>{info.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <div className="space-y-3">
                    {(() => {
                      const waterNeeds = calculateGroupWaterNeeds(selectedGroup.plants, plantLibrary)
                      const sunExposure = calculateSunExposure(selectedGroup, plantLibrary)

                      return (
                        <>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-1">
                                <Droplets className="h-4 w-4" />
                                Water Needs
                              </span>
                              <span className="font-medium">{waterNeeds.totalWaterNeeds}</span>
                            </div>
                            <Progress value={
                              waterNeeds.totalWaterNeeds === 'low' ? 33 :
                              waterNeeds.totalWaterNeeds === 'moderate' ? 66 : 100
                            } />
                            <p className="text-xs text-muted-foreground">
                              ~{waterNeeds.weeklyGallons} gallons/week
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-1">
                                <Sun className="h-4 w-4" />
                                Sun Requirements
                              </span>
                              <span className="font-medium">{sunExposure.requiredSun}</span>
                            </div>
                            {!sunExposure.compatible && (
                              <p className="text-xs text-orange-600">
                                Plants have different sun requirements
                              </p>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Compatibility</h4>
                  {(() => {
                    const compatibility = checkGroupCompatibility(
                      selectedGroup.plants.map(p =>
                        plantLibrary.find(pl => pl.id === p.plantId)!
                      ).filter(Boolean)
                    )

                    return (
                      <div className="space-y-2">
                        {compatibility.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                        {compatibility.warnings.map((warning, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="p-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Planting Schedule</h4>
              {groups.map(group => (
                <div key={group.id} className="border-l-2 border-primary pl-4 space-y-1">
                  <div className="font-medium text-sm">{group.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Plant: {new Date(group.plantingDate).toLocaleDateString()}
                  </div>
                  {group.harvestDate && (
                    <div className="text-xs text-muted-foreground">
                      Harvest: {new Date(group.harvestDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}