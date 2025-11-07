/**
 * Responsive Design Hook
 *
 * Provides responsive breakpoint detection for mobile/tablet/desktop
 */

'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  breakpoint: Breakpoint
  width: number
}

/**
 * Hook to detect current responsive breakpoint
 *
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1024px
 * - Desktop: >= 1024px
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: 'desktop',
    width: 1024, // Default to desktop for SSR
  })

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth

      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024

      setState({
        isMobile,
        isTablet,
        isDesktop,
        breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
        width,
      })
    }

    // Set initial state
    handleResize()

    // Listen for resize events
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return state
}

/**
 * Hook to detect if viewport is at or above a specific breakpoint
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    function handleChange() {
      setMatches(media.matches)
    }

    // Set initial state
    handleChange()

    // Listen for changes
    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

/**
 * Predefined breakpoint queries
 */
export const breakpoints = {
  sm: '(min-width: 640px)',   // Small devices
  md: '(min-width: 768px)',   // Tablets
  lg: '(min-width: 1024px)',  // Laptops
  xl: '(min-width: 1280px)',  // Desktops
  '2xl': '(min-width: 1536px)', // Large desktops
} as const

/**
 * Convenience hooks for common breakpoints
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(breakpoints.lg)
}

export function useIsTablet(): boolean {
  return useMediaQuery(breakpoints.md) && !useMediaQuery(breakpoints.lg)
}

export function useIsMobile(): boolean {
  return !useMediaQuery(breakpoints.md)
}
