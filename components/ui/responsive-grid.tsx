import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Responsive grid component that automatically adjusts columns
 * based on screen size
 */
export function ResponsiveGrid({
  children,
  className,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  const getGridClasses = () => {
    const classes: string[] = ['grid']

    if (cols.xs) classes.push(`grid-cols-${cols.xs}`)
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
    if (cols['2xl']) classes.push(`2xl:grid-cols-${cols['2xl']}`)

    return classes.join(' ')
  }

  return (
    <div
      className={cn(
        getGridClasses(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

interface GridItemProps {
  children: ReactNode
  className?: string
  span?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
}

/**
 * Grid item component with responsive span control
 */
export function GridItem({
  children,
  className,
  span = {}
}: GridItemProps) {
  const getSpanClasses = () => {
    const classes: string[] = []

    if (span.xs) classes.push(`col-span-${span.xs}`)
    if (span.sm) classes.push(`sm:col-span-${span.sm}`)
    if (span.md) classes.push(`md:col-span-${span.md}`)
    if (span.lg) classes.push(`lg:col-span-${span.lg}`)
    if (span.xl) classes.push(`xl:col-span-${span.xl}`)
    if (span['2xl']) classes.push(`2xl:col-span-${span['2xl']}`)

    return classes.join(' ')
  }

  return (
    <div className={cn(getSpanClasses(), className)}>
      {children}
    </div>
  )
}