import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, Loader2, Clock, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Step {
  id: string
  label: string
  description?: string
  status: 'pending' | 'loading' | 'completed' | 'error'
  errorMessage?: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep?: string
  showDescription?: boolean
  className?: string
  variant?: 'horizontal' | 'vertical' | 'minimal'
}

export function ProgressIndicator({
  steps,
  currentStep,
  showDescription = true,
  className,
  variant = 'horizontal'
}: ProgressIndicatorProps) {
  const currentIndex = currentStep ? steps.findIndex(step => step.id === currentStep) : -1
  const completedSteps = steps.filter(step => step.status === 'completed').length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  if (variant === 'minimal') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentIndex + 1} of {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        {currentStep && (
          <div className="flex items-center space-x-2">
            <StepIcon status={steps[currentIndex]?.status || 'pending'} />
            <span className="text-sm font-medium">
              {steps[currentIndex]?.label}
            </span>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  step.status === 'completed' && 'bg-green-100',
                  step.status === 'loading' && 'bg-blue-100',
                  step.status === 'error' && 'bg-red-100',
                  step.status === 'pending' && 'bg-gray-100'
                )}
              >
                <StepIcon status={step.status} />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-px h-8 mt-2',
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  step.status === 'completed' && 'text-green-700',
                  step.status === 'loading' && 'text-blue-700',
                  step.status === 'error' && 'text-red-700',
                  step.status === 'pending' && 'text-gray-500'
                )}
              >
                {step.label}
              </p>
              {showDescription && step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
              {step.status === 'error' && step.errorMessage && (
                <p className="text-xs text-red-600 mt-1">
                  {step.errorMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Horizontal variant (default)
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  step.status === 'completed' && 'bg-green-100',
                  step.status === 'loading' && 'bg-blue-100',
                  step.status === 'error' && 'bg-red-100',
                  step.status === 'pending' && 'bg-gray-100'
                )}
              >
                <StepIcon status={step.status} />
              </div>
              <div className="text-center max-w-20">
                <p
                  className={cn(
                    'text-xs font-medium',
                    step.status === 'completed' && 'text-green-700',
                    step.status === 'loading' && 'text-blue-700',
                    step.status === 'error' && 'text-red-700',
                    step.status === 'pending' && 'text-gray-500'
                  )}
                >
                  {step.label}
                </p>
                {step.status === 'error' && step.errorMessage && (
                  <p className="text-xs text-red-600 mt-1">
                    {step.errorMessage}
                  </p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-px mx-4',
                  step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}

function StepIcon({ status }: { status: Step['status'] }) {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />
    case 'loading':
      return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-600" />
    case 'pending':
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

// Loading states for specific operations
interface LoadingProgressProps {
  operation: string
  steps: string[]
  currentStep: number
  className?: string
}

export function LoadingProgress({
  operation,
  steps,
  currentStep,
  className
}: LoadingProgressProps) {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={cn('space-y-4 p-6 text-center', className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{operation}</h3>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-muted-foreground">
            {steps[currentStep]}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="space-y-1">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              'text-xs px-2 py-1 rounded text-left',
              index < currentStep && 'text-green-600 bg-green-50',
              index === currentStep && 'text-blue-600 bg-blue-50 font-medium',
              index > currentStep && 'text-gray-400'
            )}
          >
            {index < currentStep && '✓ '}
            {index === currentStep && '• '}
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton loaders for different content types
interface SkeletonProps {
  className?: string
}

export function FormSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
      <div className="flex space-x-2">
        <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('p-4 border rounded-lg space-y-3', className)}>
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

export function ListSkeleton({ items = 5, className }: SkeletonProps & { items?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Utility hook for managing multi-step operations
export function useProgressSteps(initialSteps: Omit<Step, 'status'>[]) {
  const [steps, setSteps] = React.useState<Step[]>(
    initialSteps.map(step => ({ ...step, status: 'pending' as const }))
  )
  const [currentStep, setCurrentStep] = React.useState<string | null>(null)

  const startStep = React.useCallback((stepId: string) => {
    setCurrentStep(stepId)
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, status: 'loading' as const }
        : step
    ))
  }, [])

  const completeStep = React.useCallback((stepId: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, status: 'completed' as const }
        : step
    ))
  }, [])

  const errorStep = React.useCallback((stepId: string, errorMessage: string) => {
    setSteps(prev => prev.map(step =>
      step.id === stepId
        ? { ...step, status: 'error' as const, errorMessage }
        : step
    ))
  }, [])

  const resetSteps = React.useCallback(() => {
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })))
    setCurrentStep(null)
  }, [])

  return {
    steps,
    currentStep,
    startStep,
    completeStep,
    errorStep,
    resetSteps
  }
}