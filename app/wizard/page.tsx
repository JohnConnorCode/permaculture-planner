'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LocationStep } from '@/components/wizard/location-step'
import { AreaStep } from '@/components/wizard/area-step'
import { SurfaceStep } from '@/components/wizard/surface-step'
import { WaterStep } from '@/components/wizard/water-step'
import { CropsStep } from '@/components/wizard/crops-step'
import { ReviewStep } from '@/components/wizard/review-step'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface WizardData {
  location: {
    lat?: number
    lng?: number
    city?: string
    usda_zone?: string
    last_frost?: string
    first_frost?: string
  }
  area: {
    total_sqft: number
    usable_fraction: number
    shape: 'rectangular' | 'L-shaped' | 'scattered'
  }
  surface: {
    type: 'soil' | 'hard'
    sun_hours: number
    slope: number
    accessibility_needs: boolean
  }
  water: {
    source: 'spigot' | 'none' | 'rain'
    drip_allowed: boolean
    sip_interest: boolean
  }
  crops: {
    focus: string[]
    avoid_families?: string[]
    time_weekly_minutes: number
  }
  materials: {
    lumber_type?: 'cedar' | 'pine' | 'treated'
    budget_tier?: 'budget' | 'standard' | 'premium'
  }
}

const STEPS = [
  { id: 'location', title: 'Location', component: LocationStep },
  { id: 'area', title: 'Area & Shape', component: AreaStep },
  { id: 'surface', title: 'Surface & Sun', component: SurfaceStep },
  { id: 'water', title: 'Water & Materials', component: WaterStep },
  { id: 'crops', title: 'Crop Focus', component: CropsStep },
  { id: 'review', title: 'Review', component: ReviewStep },
]

export default function WizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<WizardData>({
    location: {},
    area: {
      total_sqft: 200,
      usable_fraction: 0.8,
      shape: 'rectangular',
    },
    surface: {
      type: 'soil',
      sun_hours: 6,
      slope: 0,
      accessibility_needs: false,
    },
    water: {
      source: 'spigot',
      drip_allowed: true,
      sip_interest: false,
    },
    crops: {
      focus: [],
      time_weekly_minutes: 120,
    },
    materials: {
      lumber_type: 'cedar',
      budget_tier: 'standard',
    },
  })

  const updateData = (section: keyof WizardData, data: any) => {
    setWizardData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      })
      
      if (response.ok) {
        const { planId } = await response.json()
        router.push(`/plans/${planId}`)
      }
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  const CurrentStepComponent = STEPS[currentStep].component
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-garden-green mb-2">
            Create Your Garden Plan
          </h1>
          <p className="text-gray-600">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </p>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <CurrentStepComponent
            data={wizardData}
            updateData={updateData}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-garden-green hover:bg-green-700"
            >
              Generate Plan
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}