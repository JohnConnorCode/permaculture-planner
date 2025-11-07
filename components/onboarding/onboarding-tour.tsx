/**
 * Onboarding Tour - Interactive product tour for new users
 *
 * Guides users through key features step-by-step
 * Shows keyboard shortcuts and workflows
 * Skippable and resumable
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Target,
  Sprout,
  Droplets,
  Sun,
  Compass,
  Repeat,
  Keyboard,
  MousePointer2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingTourProps {
  /** Whether to show the tour automatically on first visit */
  autoStart?: boolean
  /** Callback when tour is completed */
  onComplete?: () => void
  /** Callback when tour is skipped */
  onSkip?: () => void
}

interface TourStep {
  title: string
  description: string
  icon: React.ElementType
  tip?: string
  keyboardShortcut?: string
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Your Permaculture Planner!',
    description:
      'This professional tool helps you design regenerative gardens using real permaculture principles. Let's take a quick tour of the key features.',
    icon: Sparkles,
    tip: 'You can skip this tour anytime and restart it from the help menu',
  },
  {
    title: 'Left Panel: Plant & Element Library',
    description:
      'Browse and select from our curated plant library or add garden elements like beds, paths, and water features. Click any plant to add it to your canvas.',
    icon: Sprout,
    tip: 'Search for plants by name or filter by category for faster selection',
  },
  {
    title: 'Canvas: Your Design Workspace',
    description:
      'Drag and drop plants and elements onto the canvas. Use your mouse wheel to zoom, click and drag to pan. Select items to edit their properties.',
    icon: MousePointer2,
    keyboardShortcut: 'V',
    tip: 'Pro tip: Hold Shift while dragging to constrain movement to one axis',
  },
  {
    title: 'Right Panel: 12 Analysis Tabs',
    description:
      'Access powerful analysis tools: Properties, Zones, Companions, Timeline, Materials, Tasks, Sun, Sectors, Succession, Water, Permaculture, and Analytics.',
    icon: Target,
    keyboardShortcut: '⌘1-9',
    tip: 'Use keyboard shortcuts ⌘1 through ⌘0 to jump between tabs instantly',
  },
  {
    title: 'Companion Planting Intelligence',
    description:
      'Get real-time companion planting analysis. See which plants work well together and receive guild recommendations for synergistic polycultures.',
    icon: Sprout,
    keyboardShortcut: '⌘3',
    tip: 'Good companions create guilds - multi-functional plant communities',
  },
  {
    title: 'Sun Analysis (NOAA Algorithm)',
    description:
      'Analyze hour-by-hour sun exposure using professional NOAA solar calculations. Place sun-loving plants in full sun, shade-tolerant plants in shade.',
    icon: Sun,
    keyboardShortcut: '⌘7',
    tip: 'Sun exposure changes with seasons - plan for summer and winter paths',
  },
  {
    title: 'Sector Analysis (External Energies)',
    description:
      'Analyze how external forces affect your site: sun, wind, fire, wildlife, noise, and views. Work WITH these energies using permaculture sector analysis.',
    icon: Compass,
    keyboardShortcut: '⌘8',
    tip: 'Sectors help you place windbreaks, firebreaks, and wildlife corridors',
  },
  {
    title: 'Succession Planning (Multi-Year)',
    description:
      'Plan 3-5 year crop rotations for soil health. Transition from annuals to perennials over time. This is what sets permaculture apart from gardening!',
    icon: Repeat,
    keyboardShortcut: '⌘9',
    tip: 'Rotate: Nitrogen fixers → Heavy feeders → Light feeders',
  },
  {
    title: 'Water Management',
    description:
      'Calculate rainwater catchment potential, design swales and berms, plan greywater systems. Professional water design for climate resilience.',
    icon: Droplets,
    tip: 'Water is often the #1 limiting factor - design for capture and infiltration',
  },
  {
    title: 'Keyboard Shortcuts (Power User)',
    description:
      'Work faster with keyboard shortcuts:\n⌘S - Save\n⌘[ - Toggle left panel\n⌘] - Toggle right panel\n⌘1-9 - Switch tabs\nV - Select tool\nB - Bed tool\nP - Plant tool',
    icon: Keyboard,
    keyboardShortcut: 'Shift+?',
    tip: 'Press Shift+? anytime to see all keyboard shortcuts',
  },
  {
    title: 'You're Ready to Design!',
    description:
      'Start by adding a few beds, then populate them with plants. The analysis panels will guide you with real-time recommendations. Have fun creating your regenerative paradise!',
    icon: Sparkles,
    tip: 'Remember: Permaculture is about working with nature, not against it',
  },
]

export function OnboardingTour({ autoStart = false, onComplete, onSkip }: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  // Check if user has seen tour before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('permaculture-tour-completed')
      setHasSeenTour(!!seen)

      if (autoStart && !seen) {
        // Small delay to let the page load
        setTimeout(() => setIsOpen(true), 1000)
      }
    }
  }, [autoStart])

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
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

  const handleSkip = () => {
    setIsOpen(false)
    setCurrentStep(0)
    onSkip?.()
  }

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('permaculture-tour-completed', 'true')
    }
    setIsOpen(false)
    setCurrentStep(0)
    setHasSeenTour(true)
    onComplete?.()
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const step = TOUR_STEPS[currentStep]
  const StepIcon = step.icon
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  return (
    <>
      {/* Restart Tour Button (for users who've completed it) */}
      {hasSeenTour && !isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Restart Tour
        </Button>
      )}

      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSkip} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
              {step.title}
            </DialogTitle>
            {step.keyboardShortcut && (
              <div className="flex items-center gap-2 mt-2">
                <Keyboard className="h-4 w-4 text-muted-foreground" />
                <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  {step.keyboardShortcut}
                </code>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 py-4">
            <DialogDescription className="text-base leading-relaxed whitespace-pre-line">
              {step.description}
            </DialogDescription>

            {step.tip && (
              <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-amber-900 dark:text-amber-100">{step.tip}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip Tour
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <Button size="sm" onClick={handleNext}>
                {currentStep === TOUR_STEPS.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * Compact version for help menu
 */
export function RestartTourButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="w-full justify-start">
        <Sparkles className="h-4 w-4 mr-2" />
        Product Tour
      </Button>
      {isOpen && <OnboardingTour autoStart={false} onSkip={() => setIsOpen(false)} />}
    </>
  )
}
