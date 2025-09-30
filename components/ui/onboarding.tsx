import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  MapPin,
  Lightbulb,
  Leaf,
  ArrowRight,
  CheckCircle,
  Play,
  X
} from 'lucide-react'
import { FocusTrap } from '@/components/ui/accessibility'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tip?: string
}

interface OnboardingTourProps {
  isVisible: boolean
  onClose: () => void
  onComplete: () => void
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Permaculture Planner',
    description: 'Create sustainable, food-producing gardens designed specifically for your climate and space.',
    icon: <Sparkles className="h-8 w-8 text-green-600" />,
    tip: 'This wizard will guide you through creating a personalized permaculture design.'
  },
  {
    id: 'location',
    title: 'Start with Your Location',
    description: 'We\'ll automatically detect your climate zone, soil conditions, and growing season.',
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    tip: 'Location determines which plants will thrive in your garden.'
  },
  {
    id: 'design',
    title: 'Design Your Space',
    description: 'Answer a few questions about your space, water access, and gardening goals.',
    icon: <Lightbulb className="h-8 w-8 text-yellow-600" />,
    tip: 'Each answer helps us create a more accurate design for your needs.'
  },
  {
    id: 'generate',
    title: 'Get Your Plan',
    description: 'Receive a detailed permaculture design with plant recommendations and layout.',
    icon: <Leaf className="h-8 w-8 text-green-600" />,
    tip: 'Your plan includes seasonal planting schedules and care instructions.'
  }
]

export function OnboardingTour({ isVisible, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = React.useState(0)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  if (!isVisible) return null

  const step = onboardingSteps[currentStep]

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <FocusTrap>
        <Card className="w-full max-w-md bg-white shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-center flex-1">
                <div className="flex justify-center mb-3">
                  {step.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="p-2 -mt-2 -mr-2"
                aria-label="Skip onboarding"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                {step.description}
              </p>
              {step.tip && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 flex items-start">
                    <Lightbulb className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                    {step.tip}
                  </p>
                </div>
              )}
            </div>

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    index <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                  )}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Get Started
                    <Play className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </FocusTrap>
    </div>
  )
}

interface WelcomeBannerProps {
  onStartTour: () => void
  onDismiss: () => void
  className?: string
}

export function WelcomeBanner({ onStartTour, onDismiss, className }: WelcomeBannerProps) {
  return (
    <Card className={cn('bg-gradient-to-r from-green-50 to-emerald-50 border-green-200', className)}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Permaculture Planner!
            </h3>
            <p className="text-gray-600 mb-4">
              New here? Take a quick tour to learn how to create your perfect sustainable garden.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onStartTour}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Tour
              </Button>
              <Button
                variant="outline"
                onClick={onDismiss}
                size="sm"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="p-2"
            aria-label="Dismiss welcome banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

interface FeatureHighlightProps {
  title: string
  description: string
  icon: React.ReactNode
  position: { top?: string; bottom?: string; left?: string; right?: string }
  onNext?: () => void
  onSkip?: () => void
  isVisible: boolean
}

export function FeatureHighlight({
  title,
  description,
  icon,
  position,
  onNext,
  onSkip,
  isVisible
}: FeatureHighlightProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Highlight card */}
      <div
        className="absolute pointer-events-auto"
        style={position}
      >
        <Card className="w-64 bg-white shadow-xl border-2 border-green-200">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              {icon}
              <h4 className="font-semibold text-gray-900">{title}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <div className="flex space-x-2">
              {onNext && (
                <Button size="sm" onClick={onNext} className="flex-1">
                  Got it!
                </Button>
              )}
              {onSkip && (
                <Button variant="outline" size="sm" onClick={onSkip}>
                  Skip
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Hook for managing onboarding state
export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState(true)
  const [showTour, setShowTour] = React.useState(false)
  const [showWelcome, setShowWelcome] = React.useState(false)

  React.useEffect(() => {
    const seen = localStorage.getItem('permaculture-onboarding-seen')
    if (!seen) {
      setHasSeenOnboarding(false)
      setShowWelcome(true)
    }
  }, [])

  const startTour = React.useCallback(() => {
    setShowWelcome(false)
    setShowTour(true)
  }, [])

  const completeTour = React.useCallback(() => {
    setShowTour(false)
    setHasSeenOnboarding(true)
    localStorage.setItem('permaculture-onboarding-seen', 'true')
  }, [])

  const dismissWelcome = React.useCallback(() => {
    setShowWelcome(false)
    setHasSeenOnboarding(true)
    localStorage.setItem('permaculture-onboarding-seen', 'true')
  }, [])

  const resetOnboarding = React.useCallback(() => {
    localStorage.removeItem('permaculture-onboarding-seen')
    setHasSeenOnboarding(false)
    setShowWelcome(true)
  }, [])

  return {
    hasSeenOnboarding,
    showTour,
    showWelcome,
    startTour,
    completeTour,
    dismissWelcome,
    resetOnboarding
  }
}