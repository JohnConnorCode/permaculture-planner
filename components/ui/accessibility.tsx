import * as React from 'react'
import { cn } from '@/lib/utils'

// Skip to main content link for screen readers
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}

// Screen reader only text
interface ScreenReaderOnlyProps {
  children: React.ReactNode
}

export function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return <span className="sr-only">{children}</span>
}

// Focus trap for modals and overlays
interface FocusTrapProps {
  children: React.ReactNode
  enabled?: boolean
  className?: string
}

export function FocusTrap({ children, enabled = true, className }: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!enabled) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Find all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element
    if (firstElement) {
      firstElement.focus()
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Return focus to the previously focused element
        previousActiveElement.current?.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleTab)
      document.removeEventListener('keydown', handleEscape)
      // Return focus when component unmounts
      previousActiveElement.current?.focus()
    }
  }, [enabled])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Live region for announcing dynamic content changes
interface LiveRegionProps {
  children: React.ReactNode
  level?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
}

export function LiveRegion({ children, level = 'polite', atomic = false }: LiveRegionProps) {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Status announcer for screen readers
export function useAnnouncer() {
  const [announcement, setAnnouncement] = React.useState('')

  const announce = React.useCallback((message: string, level: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    // Brief delay to ensure screen readers pick up the change
    setTimeout(() => setAnnouncement(message), 10)
  }, [])

  const AnnouncerComponent = React.useMemo(() => {
    return () => (
      <LiveRegion level="polite">
        {announcement}
      </LiveRegion>
    )
  }, [announcement])

  return { announce, Announcer: AnnouncerComponent }
}

// Enhanced button with better accessibility
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  description?: string
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  description,
  className,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const buttonId = React.useId()
  const descriptionId = description ? `${buttonId}-description` : undefined

  return (
    <>
      <button
        id={buttonId}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
          variant === 'ghost' && 'hover:bg-gray-100',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        disabled={disabled || isLoading}
        aria-describedby={descriptionId}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
            <span aria-hidden="true">{loadingText}</span>
          </>
        ) : (
          children
        )}
      </button>
      {description && (
        <div id={descriptionId} className="sr-only">
          {description}
        </div>
      )}
    </>
  )
}

// Form field with enhanced accessibility
interface AccessibleFieldProps {
  children: React.ReactNode
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

export function AccessibleField({
  children,
  label,
  error,
  hint,
  required,
  className
}: AccessibleFieldProps) {
  const fieldId = React.useId()
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
          'aria-invalid': !!error,
          'aria-required': required
        } as any)}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced heading with proper hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
}

export function AccessibleHeading({ level, children, className, id }: AccessibleHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return (
    <Tag
      id={id}
      className={cn(
        'font-semibold text-gray-900',
        level === 1 && 'text-3xl',
        level === 2 && 'text-2xl',
        level === 3 && 'text-xl',
        level === 4 && 'text-lg',
        level === 5 && 'text-base',
        level === 6 && 'text-sm',
        className
      )}
    >
      {children}
    </Tag>
  )
}

// Progress indicator with accessibility
interface AccessibleProgressProps {
  value: number
  max?: number
  label?: string
  description?: string
  className?: string
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  description,
  className
}: AccessibleProgressProps) {
  const progressId = React.useId()
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <label htmlFor={progressId} className="text-sm font-medium">
            {label}
          </label>
          <span className="text-sm text-gray-500" aria-hidden="true">
            {percentage}%
          </span>
        </div>
      )}

      <div
        id={progressId}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        aria-describedby={description ? `${progressId}-description` : undefined}
        className="w-full bg-gray-200 rounded-full h-2"
      >
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        <ScreenReaderOnly>
          {percentage}% complete
        </ScreenReaderOnly>
      </div>

      {description && (
        <p id={`${progressId}-description`} className="text-sm text-gray-500">
          {description}
        </p>
      )}
    </div>
  )
}

// Keyboard navigation helpers
export function useKeyboardNavigation() {
  const handleKeyDown = React.useCallback((
    event: React.KeyboardEvent,
    options: {
      onEnter?: () => void
      onSpace?: () => void
      onEscape?: () => void
      onArrowUp?: () => void
      onArrowDown?: () => void
      onArrowLeft?: () => void
      onArrowRight?: () => void
    }
  ) => {
    switch (event.key) {
      case 'Enter':
        options.onEnter?.()
        break
      case ' ':
        event.preventDefault()
        options.onSpace?.()
        break
      case 'Escape':
        options.onEscape?.()
        break
      case 'ArrowUp':
        event.preventDefault()
        options.onArrowUp?.()
        break
      case 'ArrowDown':
        event.preventDefault()
        options.onArrowDown?.()
        break
      case 'ArrowLeft':
        options.onArrowLeft?.()
        break
      case 'ArrowRight':
        options.onArrowRight?.()
        break
    }
  }, [])

  return { handleKeyDown }
}

// Focus management hook
export function useFocusManagement() {
  const focusRef = React.useRef<HTMLElement | null>(null)

  const setFocus = React.useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus()
      focusRef.current = element
    }
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }, [])

  const moveFocusToNext = React.useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element)
    const nextIndex = (currentIndex + 1) % focusableElements.length
    const nextElement = focusableElements[nextIndex] as HTMLElement

    if (nextElement) {
      nextElement.focus()
    }
  }, [])

  const moveFocusToPrevious = React.useCallback(() => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as Element)
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1
    const previousElement = focusableElements[previousIndex] as HTMLElement

    if (previousElement) {
      previousElement.focus()
    }
  }, [])

  return {
    setFocus,
    restoreFocus,
    moveFocusToNext,
    moveFocusToPrevious
  }
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')

    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isHighContrast
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}