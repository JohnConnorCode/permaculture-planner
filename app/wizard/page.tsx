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
  Sparkles, ArrowRight, LogIn, UserPlus, X
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { wizardService } from '@/lib/wizard/wizard-service'
import { useFeedback } from '@/components/ui/action-feedback'

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
  const { user, loading: authLoading } = useAuth()
  const feedback = useFeedback()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
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

  // Load saved wizard progress on mount
  useEffect(() => {
    const savedProgress = wizardService.getSavedWizardData()
    if (savedProgress) {
      setData(prev => ({
        ...prev,
        ...savedProgress
      }))
      feedback.info('Restored your previous wizard progress')
    }
  }, [feedback])

  const updateData = (section: keyof WizardData, updates: any) => {
    const newData = {
      ...data,
      [section]: { ...data[section], ...updates }
    }
    setData(newData)

    // Auto-save progress
    wizardService.saveWizardProgress(newData)
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
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    setIsCompleting(true)

    try {
      // Add a name to the wizard data
      const wizardDataWithName = {
        ...data,
        name: `Garden Plan - ${new Date().toLocaleDateString()}`
      }

      // Save wizard data and create garden plan
      const result = await wizardService.saveWizardData(wizardDataWithName)

      if (result.success && result.planId) {
        // Clear wizard progress
        wizardService.clearWizardProgress()

        // Navigate to the demo page with the new plan
        router.push(`/demo?planId=${result.planId}`)
      } else {
        feedback.error(result.error || 'Failed to create garden plan')
      }
    } catch (error) {
      console.error('Error creating garden plan:', error)
      feedback.error('Failed to create garden plan')
    } finally {
      setIsCompleting(false)
    }
  }

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="glass border-b border-green-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
            <div className="opacity-0 animate-fade-in mb-2 sm:mb-0" style={{ animationFillMode: 'forwards' }}>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Create Your Permaculture Garden</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Answer a few questions to get your personalized permaculture design
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 opacity-0 animate-fade-in self-start sm:self-auto"
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
          <div className="flex justify-between items-center overflow-x-auto pb-2">
            {steps.map((step, idx) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center flex-1 min-w-0 px-1 opacity-0 animate-fade-in`}
                  style={{ animationDelay: `${0.4 + idx * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="relative">
                    <div
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300
                        ${isActive ? 'gradient-understory text-white scale-110 shadow-lg animate-grow' : ''}
                        ${isCompleted ? 'bg-green-500 text-white shadow-md' : ''}
                        ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''}
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5" />
                      ) : (
                        <StepIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-30" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 sm:mt-2 font-medium text-center truncate w-full ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                  {isActive && (
                    <span className="text-xs text-gray-500 mt-1 text-center leading-tight hidden sm:block">
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
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
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
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mt-8 sm:mt-12 opacity-0 animate-fade-in"
             style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="hover-lift rounded-lg hover-nature border-green-300 h-12 sm:h-10 text-sm sm:text-base min-w-[120px] order-2 sm:order-1"
            size="lg"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              className="gradient-understory text-white hover-lift group rounded-lg shadow-lg hover:shadow-xl h-12 sm:h-10 text-sm sm:text-base min-w-[180px] order-1 sm:order-2"
              size="lg"
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate My Garden Plan
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gradient-understory hover:opacity-90 hover-lift group rounded-lg shadow-md h-12 sm:h-10 text-sm sm:text-base min-w-[120px] order-1 sm:order-2"
              size="lg"
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

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoginPrompt(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-6 m-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sign In Required</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginPrompt(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Sign in to create and save your personalized garden plan. Your wizard progress will be preserved!
                </p>

                <div className="space-y-2">
                  <Button
                    className="w-full gradient-understory"
                    onClick={() => {
                      setShowLoginPrompt(false)
                      window.location.href = '/auth/login'
                    }}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowLoginPrompt(false)
                      window.location.href = '/auth/signup'
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </div>

                <div className="text-sm text-gray-500 text-center">
                  Your wizard progress is saved locally and will be available after signing in
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}