'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocationStep } from '@/components/wizard/location-step'
import { AreaStep } from '@/components/wizard/area-step'
import { SurfaceStep } from '@/components/wizard/surface-step'
import { WaterStep } from '@/components/wizard/water-step'
import { CropsStep } from '@/components/wizard/crops-step'
import { TemplateStep } from '@/components/wizard/template-step'
import { ReviewStep } from '@/components/wizard/review-step'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft, ChevronRight, MapPin, Ruler,
  TreePine, Droplets, Carrot, CheckCircle,
  Sparkles, ArrowRight
} from 'lucide-react'

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
  template?: any
}

const steps = [
  { id: 1, name: 'Location', icon: MapPin, description: 'Set your growing zone' },
  { id: 2, name: 'Area', icon: Ruler, description: 'Define your space' },
  { id: 3, name: 'Surface', icon: TreePine, description: 'Describe conditions' },
  { id: 4, name: 'Water', icon: Droplets, description: 'Water access' },
  { id: 5, name: 'Crops', icon: Carrot, description: 'Choose what to grow' },
  { id: 6, name: 'Template', icon: Sparkles, description: 'Choose a style' },
  { id: 7, name: 'Review', icon: CheckCircle, description: 'Review your plan' }
]

export default function WizardPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const [data, setData] = useState<WizardData>({
    location: {},
    area: {
      total_sqft: 100,
      usable_fraction: 0.8,
      shape: 'rectangular'
    },
    surface: {
      type: 'soil',
      sun_hours: 6,
      slope: 0,
      accessibility_needs: false
    },
    water: {
      source: 'spigot',
      drip_allowed: true,
      sip_interest: false
    },
    crops: {
      focus: [],
      time_weekly_minutes: 60
    },
    materials: {},
    template: null
  })

  const updateData = (section: keyof WizardData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setDirection('forward')
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection('backward')
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleComplete = async () => {
    // TODO: Save to database
    router.push('/dashboard')
  }

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="glass border-b border-green-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Create Your Permaculture Garden</h1>
              <p className="text-sm text-gray-600 mt-1">
                Answer a few questions to get your personalized permaculture design
              </p>
            </div>
            <div className="text-sm text-gray-500 opacity-0 animate-fade-in"
                 style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              Step {currentStep} of {steps.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 opacity-0 animate-slide-in-left"
               style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <Progress value={progressValue} className="h-2 bg-green-100 rounded-lg">
              <div
                className="h-full gradient-understory rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${progressValue}%` }}
              />
            </Progress>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, idx) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center flex-1 opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${0.4 + idx * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="relative">
                    <div
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isActive ? 'gradient-understory text-white scale-110 shadow-lg animate-grow' : ''}
                        ${isCompleted ? 'bg-green-500 text-white shadow-md' : ''}
                        ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-30" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                  {isActive && (
                    <span className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`
          transition-all duration-300 transform
          ${isAnimating ? (direction === 'forward' ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0') : 'translate-x-0 opacity-100'}
        `}>
          {currentStep === 1 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <LocationStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <AreaStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <SurfaceStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 4 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <WaterStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 5 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <CropsStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 6 && (
            <div className="opacity-0 animate-slide-in-left" style={{ animationFillMode: 'forwards' }}>
              <TemplateStep
                data={data}
                updateData={updateData}
              />
            </div>
          )}
          {currentStep === 7 && (
            <div className="opacity-0 animate-scale-in" style={{ animationFillMode: 'forwards' }}>
              <ReviewStep data={data} updateData={updateData} />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 opacity-0 animate-fade-in"
             style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="hover-lift rounded-lg hover-nature border-green-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleComplete}
              className="gradient-understory text-white hover-lift group rounded-lg shadow-lg hover:shadow-xl"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My Garden Plan
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gradient-understory hover:opacity-90 hover-lift group rounded-lg shadow-md"
            >
              Next Step
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center opacity-0 animate-fade-in"
             style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <p className="text-sm text-gray-500">
            Need help? Each answer helps us create a garden that works for your unique space and climate.
          </p>
        </div>
      </div>
    </div>
  )
}