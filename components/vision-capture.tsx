'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  Target, Users, Briefcase, GraduationCap, Home,
  DollarSign, Heart, Leaf, BookOpen, Calendar,
  ChevronRight, ChevronLeft, Check, Sparkles
} from 'lucide-react'

interface VisionData {
  projectType: 'personal' | 'community' | 'commercial' | 'educational'
  goals: {
    primary: string[]
    secondary: string[]
    constraints: string[]
  }
  motivations: {
    environmental: boolean
    economic: boolean
    social: boolean
    educational: boolean
    other: string[]
  }
  useCases: {
    familyFood: boolean
    business: boolean
    guestExperiences: boolean
    communitySupport: boolean
    wealthGeneration: string[]
  }
  timeline: {
    startDate: string
    completionTarget: string
    budget: string
  }
  description: string
}

interface VisionCaptureProps {
  onComplete: (vision: VisionData) => void
  onSave?: (vision: Partial<VisionData>) => void
  initialData?: Partial<VisionData>
  className?: string
}

const PROJECT_TYPES = [
  { id: 'personal', label: 'Personal/Family', icon: Home, description: 'Food for your household' },
  { id: 'community', label: 'Community', icon: Users, description: 'Shared community space' },
  { id: 'commercial', label: 'Commercial', icon: Briefcase, description: 'Business or farm' },
  { id: 'educational', label: 'Educational', icon: GraduationCap, description: 'Teaching & demonstration' }
]

const MOTIVATION_OPTIONS = [
  { id: 'environmental', label: 'Environmental Impact', icon: Leaf },
  { id: 'economic', label: 'Economic Benefits', icon: DollarSign },
  { id: 'social', label: 'Social Connection', icon: Heart },
  { id: 'educational', label: 'Learning & Teaching', icon: BookOpen }
]

export function VisionCapture({
  onComplete,
  onSave,
  initialData = {},
  className
}: VisionCaptureProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 6

  const [vision, setVision] = useState<Partial<VisionData>>({
    projectType: initialData.projectType || 'personal',
    goals: initialData.goals || { primary: [], secondary: [], constraints: [] },
    motivations: initialData.motivations || {
      environmental: false,
      economic: false,
      social: false,
      educational: false,
      other: []
    },
    useCases: initialData.useCases || {
      familyFood: false,
      business: false,
      guestExperiences: false,
      communitySupport: false,
      wealthGeneration: []
    },
    timeline: initialData.timeline || {
      startDate: '',
      completionTarget: '',
      budget: ''
    },
    description: initialData.description || ''
  })

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
      onSave?.(vision)
    } else {
      onComplete(vision as VisionData)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const progress = (step / totalSteps) * 100

  return (
    <Card className={cn('w-full max-w-3xl mx-auto', className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <CardTitle>Vision Capture</CardTitle>
          </div>
          <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <CardDescription className="mt-4">
          Let's understand your permaculture vision and goals
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Project Type */}
        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What type of project is this?</Label>
            <RadioGroup
              value={vision.projectType}
              onValueChange={(value) => setVision({ ...vision, projectType: value as any })}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type.id}
                    htmlFor={type.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      vision.projectType === type.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Primary Goals */}
        {step === 2 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What are your primary goals?</Label>
            <p className="text-sm text-gray-600">List your main objectives for this project</p>
            <Textarea
              placeholder="Example: Provide fresh vegetables for my family year-round..."
              value={vision.goals?.primary.join('\n') || ''}
              onChange={(e) => setVision({
                ...vision,
                goals: {
                  ...vision.goals!,
                  primary: e.target.value.split('\n').filter(Boolean)
                }
              })}
              rows={6}
              className="resize-none"
            />

            <Label className="text-lg font-semibold mt-6">Any constraints or concerns?</Label>
            <Textarea
              placeholder="Example: Limited water access, steep slope, budget constraints..."
              value={vision.goals?.constraints.join('\n') || ''}
              onChange={(e) => setVision({
                ...vision,
                goals: {
                  ...vision.goals!,
                  constraints: e.target.value.split('\n').filter(Boolean)
                }
              })}
              rows={4}
              className="resize-none"
            />
          </div>
        )}

        {/* Step 3: Motivations */}
        {step === 3 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What motivates this project?</Label>
            <p className="text-sm text-gray-600">Select all that apply</p>
            <div className="space-y-3">
              {MOTIVATION_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    vision.motivations?.[option.id as keyof typeof vision.motivations]
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Checkbox
                    checked={vision.motivations?.[option.id as keyof typeof vision.motivations] as boolean || false}
                    onCheckedChange={(checked) => setVision({
                      ...vision,
                      motivations: {
                        ...vision.motivations!,
                        [option.id]: checked
                      }
                    })}
                  />
                  <option.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Use Cases */}
        {step === 4 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">How will you use this space?</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <Checkbox
                  checked={vision.useCases?.familyFood || false}
                  onCheckedChange={(checked) => setVision({
                    ...vision,
                    useCases: { ...vision.useCases!, familyFood: checked as boolean }
                  })}
                />
                <span>Grow food for my family</span>
              </label>

              <label className="flex items-center gap-3">
                <Checkbox
                  checked={vision.useCases?.business || false}
                  onCheckedChange={(checked) => setVision({
                    ...vision,
                    useCases: { ...vision.useCases!, business: checked as boolean }
                  })}
                />
                <span>Run a business (farm, nursery, etc.)</span>
              </label>

              <label className="flex items-center gap-3">
                <Checkbox
                  checked={vision.useCases?.guestExperiences || false}
                  onCheckedChange={(checked) => setVision({
                    ...vision,
                    useCases: { ...vision.useCases!, guestExperiences: checked as boolean }
                  })}
                />
                <span>Create guest experiences (tours, workshops)</span>
              </label>

              <label className="flex items-center gap-3">
                <Checkbox
                  checked={vision.useCases?.communitySupport || false}
                  onCheckedChange={(checked) => setVision({
                    ...vision,
                    useCases: { ...vision.useCases!, communitySupport: checked as boolean }
                  })}
                />
                <span>Support community (food bank, education)</span>
              </label>
            </div>

            <Label className="mt-6">Wealth generation strategies (if any)</Label>
            <Textarea
              placeholder="Example: Sell produce at farmers market, offer permaculture courses..."
              value={vision.useCases?.wealthGeneration.join('\n') || ''}
              onChange={(e) => setVision({
                ...vision,
                useCases: {
                  ...vision.useCases!,
                  wealthGeneration: e.target.value.split('\n').filter(Boolean)
                }
              })}
              rows={3}
            />
          </div>
        )}

        {/* Step 5: Timeline & Budget */}
        {step === 5 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Project Timeline</Label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={vision.timeline?.startDate || ''}
                  onChange={(e) => setVision({
                    ...vision,
                    timeline: { ...vision.timeline!, startDate: e.target.value }
                  })}
                />
              </div>

              <div>
                <Label>Target Completion</Label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  value={vision.timeline?.completionTarget || ''}
                  onChange={(e) => setVision({
                    ...vision,
                    timeline: { ...vision.timeline!, completionTarget: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <Label>Estimated Budget</Label>
              <input
                type="text"
                placeholder="e.g., $5,000 - $10,000"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                value={vision.timeline?.budget || ''}
                onChange={(e) => setVision({
                  ...vision,
                  timeline: { ...vision.timeline!, budget: e.target.value }
                })}
              />
            </div>
          </div>
        )}

        {/* Step 6: Vision Statement */}
        {step === 6 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Describe your vision</Label>
            <p className="text-sm text-gray-600">
              Paint a picture of what success looks like for this project
            </p>
            <Textarea
              placeholder="In 5 years, I envision this space as..."
              value={vision.description || ''}
              onChange={(e) => setVision({ ...vision, description: e.target.value })}
              rows={8}
              className="resize-none"
            />

            {/* Vision Summary */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Vision Summary
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Project Type: {vision.projectType}</li>
                <li>• Primary Goals: {vision.goals?.primary.length} defined</li>
                <li>• Timeline: {vision.timeline?.startDate} to {vision.timeline?.completionTarget}</li>
                <li>• Budget: {vision.timeline?.budget}</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="gradient-understory"
          >
            {step === totalSteps ? 'Complete' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}