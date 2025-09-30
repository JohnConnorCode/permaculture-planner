'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight, ArrowLeft, CheckCircle,
  Leaf, Grid3x3, Droplets, Sun, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action?: {
    label: string
    onClick: () => void
  }
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Permaculture Planner',
    description: 'Design your perfect garden with AI-powered tools and permaculture principles. Let\'s get started!',
    icon: Leaf,
  },
  {
    id: 'canvas',
    title: 'Draw Your Garden Layout',
    description: 'Click and drag to create garden beds. Use the shape tools for different bed designs.',
    icon: Grid3x3,
  },
  {
    id: 'plants',
    title: 'Add Plants & Elements',
    description: 'Choose from our plant library. We\'ll suggest companions and calculate spacing automatically.',
    icon: Leaf,
  },
  {
    id: 'analysis',
    title: 'Optimize Your Design',
    description: 'View sun exposure, water needs, and rotation plans. Get AI suggestions for improvements.',
    icon: Sun,
  },
  {
    id: 'save',
    title: 'Save and Share',
    description: 'Save your designs, export PDFs, and share with the community for feedback.',
    icon: CheckCircle,
  },
]

interface OnboardingFlowProps {
  onComplete?: () => void
  className?: string
}

export function OnboardingFlow({ onComplete, className }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed')
    if (hasCompletedOnboarding) {
      setIsVisible(false)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setCompleted(true)
    localStorage.setItem('onboarding_completed', 'true')
    setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 500)
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  const step = ONBOARDING_STEPS[currentStep]
  const Icon = step.icon
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4',
        'animate-in fade-in duration-300',
        completed && 'animate-out fade-out duration-300',
        className
      )}
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-green-600" />
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="text-2xl">{step.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Visual hint for current step */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                {currentStep === 0 && 'Tip: You can always access help from the menu'}
                {currentStep === 1 && 'Tip: Hold Shift to draw perfect squares'}
                {currentStep === 2 && 'Tip: Click on a plant for detailed information'}
                {currentStep === 3 && 'Tip: Use zones to organize by maintenance needs'}
                {currentStep === 4 && 'Tip: Join our community for expert advice'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {step.action ? (
              <Button
                onClick={step.action.onClick}
                className="gap-2"
              >
                {step.action.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-1 pt-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === currentStep
                    ? 'w-8 bg-green-600'
                    : index < currentStep
                    ? 'w-1.5 bg-green-400'
                    : 'w-1.5 bg-gray-300'
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mini onboarding tooltip for specific features
interface FeatureTipProps {
  title: string
  description: string
  targetRef?: React.RefObject<HTMLElement>
  isVisible?: boolean
  onDismiss?: () => void
}

export function FeatureTip({
  title,
  description,
  targetRef,
  isVisible = false,
  onDismiss
}: FeatureTipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (targetRef?.current && isVisible) {
      const rect = targetRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      })
    }
  }, [targetRef, isVisible])

  if (!isVisible) return null

  return (
    <div
      className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-300"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <Card className="shadow-lg border-green-200 max-w-xs">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={onDismiss}
            >
              ×
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}