/**
 * PanelWrapper - Provides error boundaries, loading states, and empty states for panels
 *
 * Features:
 * - Error boundaries with retry
 * - Loading skeletons
 * - Empty states with actions
 * - Consistent panel structure
 */

'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PanelWrapperProps {
  children: React.ReactNode
  /** Error state */
  error?: Error | string | null
  /** Loading state */
  loading?: boolean
  /** Empty state - shown when no error, not loading, but hasContent is false */
  empty?: boolean
  /** Custom empty state component */
  emptyState?: React.ReactNode
  /** Retry callback for errors */
  onRetry?: () => void
  /** Optional className */
  className?: string
}

export function PanelWrapper({
  children,
  error,
  loading,
  empty,
  emptyState,
  onRetry,
  className,
}: PanelWrapperProps) {
  // Error state
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message
    return (
      <div className={cn('p-4', className)}>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                  Something went wrong
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
              {onRetry && (
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className={cn('p-4 space-y-4', className)}>
        <PanelSkeleton />
      </div>
    )
  }

  // Empty state
  if (empty) {
    return (
      <div className={cn('p-4', className)}>
        {emptyState || <DefaultEmptyState />}
      </div>
    )
  }

  // Content
  return <div className={className}>{children}</div>
}

/**
 * Loading skeleton for panels
 */
export function PanelSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

/**
 * Default empty state
 */
function DefaultEmptyState() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mb-2">No data available</p>
        <p className="text-xs text-muted-foreground">
          Add plants and beds to see analysis
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Error boundary component (class component required for error boundaries)
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class PanelErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode; onReset?: () => void },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Panel error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <PanelWrapper
          error={this.state.error || 'An unexpected error occurred'}
          onRetry={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}
