'use client'

import { useState } from 'react'
import { WizardData } from '@/app/wizard/page'
import { GARDEN_TEMPLATES, GardenTemplate } from '@/lib/templates/garden-templates'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Clock, Square, Droplets, Users, Target, Sparkles } from 'lucide-react'

interface TemplateStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

export function TemplateStep({ data, updateData }: TemplateStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    data.template?.id || 'custom'
  )
  const [filterTag, setFilterTag] = useState<string | null>(null)

  // Filter templates based on user's input
  const getRecommendedTemplates = () => {
    const userSqft = data.area.total_sqft * data.area.usable_fraction
    const userTime = data.crops.time_weekly_minutes

    return GARDEN_TEMPLATES.filter(template => {
      // Filter by tag if selected
      if (filterTag && !template.tags.includes(filterTag)) {
        return false
      }

      // Basic compatibility checks
      const spaceDiff = Math.abs(template.sqft - userSqft) / userSqft
      const timeDiff = Math.abs(template.timeEstimate.weeklyMinutes - userTime) / userTime

      // Show templates within reasonable range
      return spaceDiff < 0.5 && timeDiff < 0.5
    }).slice(0, 6) // Show top 6 matches
  }

  const recommendedTemplates = getRecommendedTemplates()
  const allTags = Array.from(new Set(GARDEN_TEMPLATES.flatMap(t => t.tags)))

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)

    if (templateId === 'custom') {
      updateData('template', { id: 'custom', name: 'Custom Design' })
    } else {
      const template = GARDEN_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        updateData('template', template)

        // Also update relevant wizard data based on template
        updateData('crops', {
          ...data.crops,
          focus: template.crops.focus
        })

        updateData('water', {
          ...data.water,
          source: template.config.irrigation === 'manual' ? 'none' : 'spigot',
          drip_allowed: template.config.irrigation === 'drip',
          sip_interest: template.config.beds.some(b => b.type === 'wicking')
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Choose Your Garden Style</h2>
        <p className="text-gray-600 mb-6">
          Select a template to get started quickly, or create a custom design from scratch.
          Templates are optimized for specific goals and can be modified later.
        </p>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filterTag === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterTag(null)}
        >
          All Templates
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={filterTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      <RadioGroup value={selectedTemplate} onValueChange={handleSelectTemplate}>
        {/* Custom Option */}
        <Card className="p-4 mb-4 cursor-pointer hover:shadow-lg transition-all">
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Custom Design</span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600">
                Start with a blank canvas and design your garden from scratch.
                Full control over every aspect.
              </p>
            </Label>
          </div>
        </Card>

        {/* Recommended Templates */}
        {recommendedTemplates.length > 0 && (
          <>
            <h3 className="font-medium text-gray-700 mb-3">
              Recommended for You
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {recommendedTemplates.map(template => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                    selectedTemplate === template.id ? 'ring-2 ring-green-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={template.id} id={template.id} />
                    <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-2xl mr-2">{template.icon}</span>
                          <span className="font-semibold">{template.name}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>

                      {/* Template Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Square className="h-3 w-3" />
                          <span>{template.sqft} sq ft</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{template.timeEstimate.weeklyMinutes} min/week</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{template.config.beds.length} beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          <span>{template.config.irrigation}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Features */}
                      {template.config.features.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500 mb-1">Includes:</p>
                          <p className="text-xs text-gray-600">
                            {template.config.features.slice(0, 3).join(', ')}
                            {template.config.features.length > 3 && ` +${template.config.features.length - 3} more`}
                          </p>
                        </div>
                      )}

                      {/* Crop Focus */}
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-1">Perfect for growing:</p>
                        <p className="text-xs text-gray-600">
                          {template.crops.focus.slice(0, 5).join(', ')}
                        </p>
                      </div>
                    </Label>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* All Templates */}
        <h3 className="font-medium text-gray-700 mb-3">
          {recommendedTemplates.length > 0 ? 'All Templates' : 'Available Templates'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {GARDEN_TEMPLATES
            .filter(t => !recommendedTemplates.includes(t))
            .filter(t => !filterTag || t.tags.includes(filterTag))
            .map(template => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                  selectedTemplate === template.id ? 'ring-2 ring-green-600' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={template.id} id={`all-${template.id}`} />
                  <Label htmlFor={`all-${template.id}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-xl mr-2">{template.icon}</span>
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{template.sqft} sq ft</span>
                    </div>

                    <p className="text-xs text-gray-600 mb-2">
                      {template.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.timeEstimate.weeklyMinutes}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {template.config.beds.length} beds
                      </span>
                    </div>
                  </Label>
                </div>
              </Card>
            ))}
        </div>
      </RadioGroup>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Templates are just starting points!
            </p>
            <p className="text-sm text-blue-700 mt-1">
              You can fully customize any template in the visual editor after creation.
              Add or remove beds, change layouts, adjust sizes, and modify plant selections.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}