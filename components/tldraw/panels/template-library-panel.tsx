/**
 * Template Library Panel - IMPROVED
 *
 * 6 FREE professional templates with rich metadata
 * Category organization and filtering
 * Detailed template information
 * One-click loading
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
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
  Star,
  MapPin,
  Ruler,
  Leaf,
  Search,
  Info,
} from 'lucide-react'
import type { GardenBed } from '@/lib/garden/garden-types'
import { getAllTemplates, TEMPLATE_CATEGORIES, type TemplateData } from '@/lib/templates/template-loader'
import { cn } from '@/lib/utils'

interface TemplateLibraryPanelProps {
  gardenBeds: GardenBed[]
  onLoadTemplate?: (template: TemplateData) => void
}

export function TemplateLibraryPanel({ gardenBeds, onLoadTemplate }: TemplateLibraryPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const templates = getAllTemplates()

  // Filter templates based on search
  const filteredTemplates = templates.filter(template => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      template.metadata.name.toLowerCase().includes(search) ||
      template.metadata.description.toLowerCase().includes(search) ||
      template.metadata.focus.some(f => f.toLowerCase().includes(search)) ||
      template.metadata.climate.some(c => c.toLowerCase().includes(search))
    )
  })

  const handleLoadTemplate = (template: TemplateData) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const confirmLoad = () => {
    if (selectedTemplate && onLoadTemplate) {
      onLoadTemplate(selectedTemplate)
      setShowPreview(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Template Library</h2>
            <p className="text-xs text-muted-foreground">
              {templates.length} FREE professional designs
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Featured Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold">Beginner Friendly</h3>
            </div>
            <div className="grid gap-3">
              {filteredTemplates
                .filter(t => t.metadata.difficulty === 'beginner')
                .map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onLoad={handleLoadTemplate}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))}
            </div>
          </div>

          {/* Intermediate Section */}
          {filteredTemplates.some(t => t.metadata.difficulty === 'intermediate') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">Advanced Designs</h3>
              </div>
              <div className="grid gap-3">
                {filteredTemplates
                  .filter(t => t.metadata.difficulty === 'intermediate')
                  .map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onLoad={handleLoadTemplate}
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">{selectedTemplate.metadata.icon}</div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedTemplate.metadata.name}</DialogTitle>
                    <DialogDescription>{selectedTemplate.metadata.size}</DialogDescription>
                  </div>
                  <Badge className={getDifficultyColor(selectedTemplate.metadata.difficulty)}>
                    {selectedTemplate.metadata.difficulty}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTemplate.metadata.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">{selectedTemplate.metadata.plants} Plants</div>
                      <div className="text-xs text-muted-foreground">Total plants</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">{selectedTemplate.metadata.beds} Beds</div>
                      <div className="text-xs text-muted-foreground">Garden beds</div>
                    </div>
                  </div>
                </div>

                {/* Climate & Focus */}
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Climate Suitability
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.metadata.climate.map(climate => (
                        <Badge key={climate} variant="secondary" className="capitalize">
                          {climate}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Focus Areas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.metadata.focus.map(focus => (
                        <Badge key={focus} variant="outline" className="capitalize">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Warning if not empty */}
                {gardenBeds.length > 0 && (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Your canvas has existing items</p>
                        <p className="text-amber-800">
                          Loading this template will add {selectedTemplate.metadata.beds} new beds to your current design.
                          Consider clearing your canvas first if you want to start fresh.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmLoad}>
                  <Layout className="h-4 w-4 mr-2" />
                  Load This Template
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface TemplateCardProps {
  template: TemplateData
  onLoad: (template: TemplateData) => void
  getDifficultyColor: (difficulty: string) => string
}

function TemplateCard({ template, onLoad, getDifficultyColor }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => onLoad(template)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
            {template.metadata.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm leading-tight">{template.metadata.name}</h4>
              <Badge variant="outline" className={cn("text-xs", getDifficultyColor(template.metadata.difficulty))}>
                {template.metadata.difficulty}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {template.metadata.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                {template.metadata.plants} plants
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {template.metadata.size}
              </div>
            </div>

            {/* Focus Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {template.metadata.focus.slice(0, 2).map(focus => (
                <Badge key={focus} variant="secondary" className="text-xs capitalize">
                  {focus}
                </Badge>
              ))}
              {template.metadata.focus.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.metadata.focus.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
