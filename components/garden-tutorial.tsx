'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

interface TutorialStep {
  title: string
  description: string
  target?: string
  action?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to the Garden Designer! 🌱",
    description: "Let's create your perfect garden layout. This quick tutorial will show you how to design garden beds and place plants.",
    position: 'center'
  },
  {
    title: "Step 1: Draw a Garden Bed",
    description: "Select the Rectangle tool or Custom Shape tool from the Drawing Tools panel to create your first garden bed.",
    target: 'drawing-tools',
    position: 'right'
  },
  {
    title: "Step 2: Choose Your Plants",
    description: "Browse through vegetables, herbs, and fruits in the Plant Library. Click on any plant to select it.",
    target: 'plant-library',
    position: 'right'
  },
  {
    title: "Step 3: Place Plants in Beds",
    description: "With a plant selected, click inside any garden bed to place it. The system will check spacing and companion compatibility!",
    target: 'canvas',
    position: 'left'
  },
  {
    title: "Step 4: View Layers",
    description: "Toggle the sun and water requirement layers to see what each plant needs. Use the grid for precise placement.",
    target: 'view-controls',
    position: 'bottom'
  },
  {
    title: "Step 5: Save Your Design",
    description: "Don't forget to save your garden design! You can load it later or share it with others.",
    target: 'save-button',
    position: 'bottom'
  },
  {
    title: "You're Ready to Garden! 🎉",
    description: "Start with the example garden or create your own from scratch. Happy planting!",
    position: 'center'
  }
]

interface GardenTutorialProps {
  onComplete: () => void
  isVisible: boolean
}

export function GardenTutorial({ onComplete, isVisible }: GardenTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0)
      setIsMinimized(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  const step = TUTORIAL_STEPS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          Resume Tutorial ({currentStep + 1}/{TUTORIAL_STEPS.length})
        </Button>
      </div>
    )
  }

  const getPositionClasses = () => {
    switch (step.position) {
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      case 'top':
        return 'top-20 left-1/2 transform -translate-x-1/2'
      case 'bottom':
        return 'bottom-20 left-1/2 transform -translate-x-1/2'
      case 'left':
        return 'top-1/2 left-20 transform -translate-y-1/2'
      case 'right':
        return 'top-1/2 right-20 transform -translate-y-1/2'
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    }
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMinimized(true)} />

      {/* Tutorial card */}
      <Card className={`fixed z-50 max-w-md shadow-2xl ${getPositionClasses()}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-500">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0"
              >
                —
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600 mb-6">{step.description}</p>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mb-4">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-green-600'
                    : index < currentStep
                    ? 'bg-green-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip tutorial
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {isLastStep ? 'Start Designing' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Target highlight (optional) */}
      {step.target && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        />
      )}
    </>
  )
}