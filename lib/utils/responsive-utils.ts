/**
 * Responsive Design Utilities
 * Centralized responsive helpers for consistent UX across devices
 */

export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth
  if (width < breakpoints.sm) return 'mobile'
  if (width < breakpoints.lg) return 'tablet'
  return 'desktop'
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

export function useMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false

  const [matches, setMatches] = React.useState(
    () => window.matchMedia(query).matches
  )

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

import * as React from 'react'

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`)
}

export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint | 'base', T>>
): T | undefined {
  const isXs = useBreakpoint('xs')
  const isSm = useBreakpoint('sm')
  const isMd = useBreakpoint('md')
  const isLg = useBreakpoint('lg')
  const isXl = useBreakpoint('xl')
  const is2xl = useBreakpoint('2xl')

  if (is2xl && values['2xl']) return values['2xl']
  if (isXl && values.xl) return values.xl
  if (isLg && values.lg) return values.lg
  if (isMd && values.md) return values.md
  if (isSm && values.sm) return values.sm
  if (isXs && values.xs) return values.xs
  return values.base
}

export function getResponsiveClasses(
  baseClasses: string,
  responsiveOverrides?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
): string {
  let classes = baseClasses

  if (responsiveOverrides) {
    Object.entries(responsiveOverrides).forEach(([breakpoint, overrideClasses]) => {
      if (overrideClasses) {
        classes += ` ${breakpoint}:${overrideClasses}`
      }
    })
  }

  return classes
}

export function getContainerPadding(device: 'mobile' | 'tablet' | 'desktop'): string {
  switch (device) {
    case 'mobile':
      return 'px-4'
    case 'tablet':
      return 'px-6'
    case 'desktop':
      return 'px-8'
  }
}

export function getGridCols(device: 'mobile' | 'tablet' | 'desktop', defaultCols = 3): number {
  switch (device) {
    case 'mobile':
      return 1
    case 'tablet':
      return Math.min(2, defaultCols)
    case 'desktop':
      return defaultCols
  }
}

export const responsiveText = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
} as const

export const responsiveSpacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const

/**
 * Get responsive font size classes
 */
export function getResponsiveTextSize(
  size: 'heading' | 'subheading' | 'body' | 'small'
): string {
  switch (size) {
    case 'heading':
      return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
    case 'subheading':
      return 'text-lg sm:text-xl md:text-2xl lg:text-3xl'
    case 'body':
      return 'text-sm sm:text-base md:text-lg'
    case 'small':
      return 'text-xs sm:text-sm'
  }
}

/**
 * Detect if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

/**
 * Get animation classes based on user preference
 */
export function getAnimationClasses(animationClass: string): string {
  if (prefersReducedMotion()) {
    return ''
  }
  return animationClass
}

/**
 * Responsive drag threshold for touch vs mouse
 */
export function getDragThreshold(): number {
  return isTouchDevice() ? 10 : 5
}

/**
 * Get optimal image size based on device
 */
export function getOptimalImageSize(device: 'mobile' | 'tablet' | 'desktop'): {
  width: number
  height: number
  quality: number
} {
  switch (device) {
    case 'mobile':
      return { width: 640, height: 480, quality: 85 }
    case 'tablet':
      return { width: 1024, height: 768, quality: 90 }
    case 'desktop':
      return { width: 1920, height: 1080, quality: 95 }
  }
}

/**
 * Handle scroll locking for modals on mobile
 */
export function lockBodyScroll(lock: boolean): void {
  if (typeof document === 'undefined') return

  if (lock) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  } else {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

/**
 * Get responsive modal dimensions
 */
export function getModalDimensions(device: 'mobile' | 'tablet' | 'desktop'): {
  width: string
  height: string
  padding: string
} {
  switch (device) {
    case 'mobile':
      return {
        width: 'w-full',
        height: 'h-full',
        padding: 'p-4'
      }
    case 'tablet':
      return {
        width: 'w-11/12 max-w-2xl',
        height: 'max-h-[90vh]',
        padding: 'p-6'
      }
    case 'desktop':
      return {
        width: 'w-full max-w-4xl',
        height: 'max-h-[80vh]',
        padding: 'p-8'
      }
  }
}