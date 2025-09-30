import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Grip, X } from 'lucide-react'

interface TouchGestureEvent {
  type: 'swipe' | 'tap' | 'long-press' | 'pinch'
  direction?: 'left' | 'right' | 'up' | 'down'
  target: HTMLElement
  touches: number
  deltaX?: number
  deltaY?: number
  scale?: number
}

interface UseSwipeGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefaultTouchmove?: boolean
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventDefaultTouchmove = true
}: UseSwipeGestureProps) {
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (preventDefaultTouchmove) {
      e.preventDefault()
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > threshold
    const isRightSwipe = distanceX < -threshold
    const isUpSwipe = distanceY > threshold
    const isDownSwipe = distanceY < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }
    if (isUpSwipe && onSwipeUp) {
      onSwipeUp()
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

interface UseLongPressProps {
  onLongPress: () => void
  delay?: number
}

export function useLongPress({ onLongPress, delay = 500 }: UseLongPressProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const start = React.useCallback(() => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, delay)
  }, [onLongPress, delay])

  const stop = React.useCallback(() => {
    setIsPressed(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchCancel: stop,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    isPressed
  }
}

interface TouchFeedbackProps {
  children: React.ReactNode
  className?: string
  haptic?: boolean
  ripple?: boolean
}

export function TouchFeedback({ children, className, haptic = true, ripple = true }: TouchFeedbackProps) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

  const addRipple = (event: React.TouchEvent | React.MouseEvent) => {
    if (!ripple) return

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    // Haptic feedback on supported devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onTouchStart={addRipple}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms'
          }}
        />
      ))}
    </div>
  )
}

interface MobileOptimizedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  hapticFeedback?: boolean
}

export function MobileOptimizedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  hapticFeedback = true
}: MobileOptimizedButtonProps) {
  const handleClick = () => {
    if (disabled) return

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    onClick?.()
  }

  return (
    <TouchFeedback haptic={hapticFeedback}>
      <Button
        onClick={handleClick}
        variant={variant === 'outline' ? 'outline' : variant === 'secondary' ? 'secondary' : 'default'}
        size={size === 'md' ? 'default' : size}
        disabled={disabled}
        className={cn(
          // Enhanced touch targets (minimum 44px)
          'min-h-[44px] min-w-[44px] touch-manipulation',
          // Better visual feedback
          'active:scale-95 transition-transform duration-75',
          // Larger padding for easier tapping
          size === 'sm' && 'px-4 py-3',
          size === 'md' && 'px-6 py-4',
          size === 'lg' && 'px-8 py-5',
          className
        )}
      >
        {children}
      </Button>
    </TouchFeedback>
  )
}

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    icon: React.ReactNode
    label: string
    color: string
  }
  rightAction?: {
    icon: React.ReactNode
    label: string
    color: string
  }
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)

  const swipeGestures = useSwipeGesture({
    onSwipeLeft: onSwipeLeft,
    onSwipeRight: onSwipeRight,
    threshold: 100,
    preventDefaultTouchmove: false
  })

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const startX = parseFloat(cardRef.current?.dataset.startX || '0')
    const currentX = touch.clientX
    const offset = currentX - startX

    setSwipeOffset(Math.max(-150, Math.min(150, offset)))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    if (cardRef.current) {
      cardRef.current.dataset.startX = e.touches[0].clientX.toString()
    }
    swipeGestures.onTouchStart(e)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false)
    setSwipeOffset(0)
    swipeGestures.onTouchEnd()
  }

  return (
    <div className="relative overflow-hidden">
      {/* Action backgrounds */}
      {leftAction && (
        <div className={cn(
          'absolute inset-y-0 left-0 flex items-center justify-start pl-4 w-32',
          leftAction.color
        )}>
          {leftAction.icon}
          <span className="ml-2 text-sm font-medium text-white">
            {leftAction.label}
          </span>
        </div>
      )}
      {rightAction && (
        <div className={cn(
          'absolute inset-y-0 right-0 flex items-center justify-end pr-4 w-32',
          rightAction.color
        )}>
          <span className="mr-2 text-sm font-medium text-white">
            {rightAction.label}
          </span>
          {rightAction.icon}
        </div>
      )}

      {/* Main card */}
      <div
        ref={cardRef}
        className={cn(
          'relative bg-white transition-transform duration-200 ease-out',
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  height?: 'auto' | 'half' | 'full'
}

export function BottomSheet({ isOpen, onClose, children, title, height = 'auto' }: BottomSheetProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragY, setDragY] = React.useState(0)
  const sheetRef = React.useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    if (sheetRef.current) {
      sheetRef.current.dataset.startY = e.touches[0].clientY.toString()
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const startY = parseFloat(sheetRef.current?.dataset.startY || '0')
    const currentY = touch.clientY
    const deltaY = currentY - startY

    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    if (dragY > 100) {
      onClose()
    }

    setDragY(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl transition-transform duration-300 ease-out',
          height === 'full' && 'h-full',
          height === 'half' && 'h-1/2',
          height === 'auto' && 'max-h-[80vh]'
        )}
        style={{
          transform: `translateY(${dragY}px)`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'overflow-y-auto',
          height === 'auto' && 'max-h-[calc(80vh-80px)]'
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}

interface MobileNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  nextLabel?: string
  previousLabel?: string
}

export function MobileNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  nextLabel = 'Next',
  previousLabel = 'Previous'
}: MobileNavigationProps) {
  const swipeGestures = useSwipeGesture({
    onSwipeLeft: canGoNext ? onNext : undefined,
    onSwipeRight: canGoPrevious ? onPrevious : undefined,
    threshold: 50
  })

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
      <div className="flex items-center justify-between space-x-4">
        <MobileOptimizedButton
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {previousLabel}
        </MobileOptimizedButton>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentStep} of {totalSteps}
          </span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index + 1 === currentStep ? 'bg-green-600' : 'bg-gray-300'
                )}
              />
            ))}
          </div>
        </div>

        <MobileOptimizedButton
          onClick={onNext}
          disabled={!canGoNext}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4 ml-2" />
        </MobileOptimizedButton>
      </div>

      {/* Swipe gesture indicator */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-400">
          Swipe left or right to navigate
        </p>
      </div>

      {/* Hidden swipe area */}
      <div
        className="absolute inset-0 pointer-events-none touch-manipulation"
        {...swipeGestures}
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  )
}

// Hook for detecting mobile device
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  return isMobile
}

// Hook for managing mobile viewport height issues
export function useMobileViewport() {
  React.useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    return () => {
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])
}