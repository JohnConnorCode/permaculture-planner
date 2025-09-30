import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wifi,
  WifiOff,
  Save,
  Download,
  ExternalLink
} from 'lucide-react'

interface ErrorAction {
  label: string
  action: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  icon?: React.ReactNode
}

interface ErrorHandlerProps {
  error: Error | string
  title?: string
  description?: string
  actions?: ErrorAction[]
  showRefresh?: boolean
  showHome?: boolean
  showBack?: boolean
  className?: string
  variant?: 'destructive' | 'warning' | 'default'
}

export function ErrorHandler({
  error,
  title,
  description,
  actions = [],
  showRefresh = true,
  showHome = false,
  showBack = false,
  className,
  variant = 'destructive'
}: ErrorHandlerProps) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      window.location.reload()
    } catch (err) {
      console.error('Failed to refresh:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleHome = () => {
    window.location.href = '/'
  }

  const handleBack = () => {
    window.history.back()
  }

  const defaultActions: ErrorAction[] = []

  if (showRefresh) {
    defaultActions.push({
      label: isRefreshing ? 'Refreshing...' : 'Try Again',
      action: handleRefresh,
      variant: 'default',
      icon: <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
    })
  }

  if (showBack) {
    defaultActions.push({
      label: 'Go Back',
      action: handleBack,
      variant: 'outline',
      icon: <ArrowLeft className="h-4 w-4" />
    })
  }

  if (showHome) {
    defaultActions.push({
      label: 'Home',
      action: handleHome,
      variant: 'secondary',
      icon: <Home className="h-4 w-4" />
    })
  }

  const allActions = [...actions, ...defaultActions]

  const alertVariant = variant === 'warning' ? 'destructive' : variant === 'default' ? 'default' : 'destructive'

  return (
    <Alert variant={alertVariant} className={cn('', className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || 'Something went wrong'}</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <div>
          {description && <p className="mb-2">{description}</p>}
          <p className="text-sm font-mono bg-muted p-2 rounded">
            {errorMessage}
          </p>
        </div>

        {allActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.action}
                disabled={isRefreshing}
                className="flex items-center space-x-1"
              >
                {action.icon}
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Specific error types with pre-configured actions
interface NetworkErrorProps {
  onRetry: () => void
  className?: string
}

export function NetworkError({ onRetry, className }: NetworkErrorProps) {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <ErrorHandler
      error="Network connection failed"
      title="Connection Problem"
      description={isOnline
        ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
        : "You appear to be offline. Please check your internet connection."
      }
      actions={[
        {
          label: 'Retry',
          action: onRetry,
          variant: 'default',
          icon: <RefreshCw className="h-4 w-4" />
        },
        {
          label: 'Work Offline',
          action: () => {/* Handle offline mode */},
          variant: 'outline',
          icon: isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
        }
      ]}
      showRefresh={false}
      className={className}
      variant="warning"
    />
  )
}

interface SaveErrorProps {
  onRetry: () => void
  onSaveLocally?: () => void
  className?: string
}

export function SaveError({ onRetry, onSaveLocally, className }: SaveErrorProps) {
  const actions: ErrorAction[] = [
    {
      label: 'Try Again',
      action: onRetry,
      variant: 'default',
      icon: <RefreshCw className="h-4 w-4" />
    }
  ]

  if (onSaveLocally) {
    actions.push({
      label: 'Save Locally',
      action: onSaveLocally,
      variant: 'outline',
      icon: <Save className="h-4 w-4" />
    })
  }

  return (
    <ErrorHandler
      error="Failed to save your changes"
      title="Save Failed"
      description="We couldn't save your changes to the server. Your work is still safe in your browser."
      actions={actions}
      showRefresh={false}
      className={className}
      variant="warning"
    />
  )
}

interface LoadErrorProps {
  onRetry: () => void
  onLoadLocal?: () => void
  className?: string
}

export function LoadError({ onRetry, onLoadLocal, className }: LoadErrorProps) {
  const actions: ErrorAction[] = [
    {
      label: 'Try Again',
      action: onRetry,
      variant: 'default',
      icon: <RefreshCw className="h-4 w-4" />
    }
  ]

  if (onLoadLocal) {
    actions.push({
      label: 'Load from Local Storage',
      action: onLoadLocal,
      variant: 'outline',
      icon: <Download className="h-4 w-4" />
    })
  }

  return (
    <ErrorHandler
      error="Failed to load data"
      title="Loading Failed"
      description="We couldn't load your data from the server. You can try again or load a local backup if available."
      actions={actions}
      showRefresh={false}
      className={className}
      variant="warning"
    />
  )
}

interface ValidationErrorProps {
  errors: string[]
  onFix?: () => void
  className?: string
}

export function ValidationError({ errors, onFix, className }: ValidationErrorProps) {
  const actions: ErrorAction[] = []

  if (onFix) {
    actions.push({
      label: 'Fix Issues',
      action: onFix,
      variant: 'default'
    })
  }

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Please fix the following issues:</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
          ))}
        </ul>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <ErrorHandler
            error={this.state.error}
            title="Application Error"
            description="Something went wrong with the application. You can try refreshing the page or go back to continue."
            actions={[
              {
                label: 'Reset',
                action: this.resetError,
                variant: 'default'
              }
            ]}
            showRefresh={true}
            showHome={true}
            className="max-w-md"
          />
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for managing error states
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | string | null>(null)
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleError = React.useCallback((error: Error | string) => {
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const retry = React.useCallback(async (retryFn: () => Promise<void> | void) => {
    setIsRetrying(true)
    try {
      await retryFn()
      clearError()
    } catch (err) {
      handleError(err instanceof Error ? err : String(err))
    } finally {
      setIsRetrying(false)
    }
  }, [handleError, clearError])

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry
  }
}

// Common error types
export const ERROR_TYPES = {
  NETWORK: 'NetworkError',
  VALIDATION: 'ValidationError',
  SAVE: 'SaveError',
  LOAD: 'LoadError',
  AUTH: 'AuthenticationError',
  PERMISSION: 'PermissionError'
} as const

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES]