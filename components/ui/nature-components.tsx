/**
 * Reusable Nature-Themed UI Components
 * Consistent permaculture-inspired design elements
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'organic' | 'soil' | 'water'
  pattern?: 'leaves' | 'dots' | 'waves' | 'none'
}

export const NatureCard = React.forwardRef<HTMLDivElement, NatureCardProps>(
  ({ className, variant = 'default', pattern = 'none', children, ...props }, ref) => {
    const variants = {
      default: 'card-nature',
      elevated: 'bg-white shadow-xl hover:shadow-2xl border-green-200',
      organic: 'bg-gradient-to-br from-green-50 via-emerald-50 to-white border-green-300 border-organic',
      soil: 'bg-gradient-to-b from-amber-50 to-orange-50 border-amber-300 soil-texture',
      water: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 water-flow',
    }

    const patterns = {
      leaves: 'leaf-pattern',
      dots: 'nature-pattern',
      waves: 'water-flow',
      none: '',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6 transition-all duration-300',
          variants[variant],
          patterns[pattern],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
NatureCard.displayName = 'NatureCard'

interface SeasonBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  season: 'spring' | 'summer' | 'autumn' | 'winter'
  size?: 'sm' | 'md' | 'lg'
}

export const SeasonBadge: React.FC<SeasonBadgeProps> = ({
  season,
  size = 'md',
  className,
  children,
  ...props
}) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        `season-${season}`,
        sizes[size],
        'text-white shadow-sm',
        className
      )}
      {...props}
    >
      {children || season.charAt(0).toUpperCase() + season.slice(1)}
    </div>
  )
}

interface ZoneIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  zone: 0 | 1 | 2 | 3 | 4 | 5
  label?: string
}

export const ZoneIndicator: React.FC<ZoneIndicatorProps> = ({
  zone,
  label,
  className,
  ...props
}) => {
  const zoneColors = {
    0: 'bg-red-100 text-red-800 border-red-300',
    1: 'bg-orange-100 text-orange-800 border-orange-300',
    2: 'bg-amber-100 text-amber-800 border-amber-300',
    3: 'bg-lime-100 text-lime-800 border-lime-300',
    4: 'bg-green-100 text-green-800 border-green-300',
    5: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border',
        zoneColors[zone],
        `zone-${zone}`,
        className
      )}
      {...props}
    >
      <span className="font-bold">Zone {zone}</span>
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

interface PlantIconProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'tree' | 'shrub' | 'herb' | 'vegetable' | 'flower' | 'vine' | 'grass'
  size?: 'sm' | 'md' | 'lg'
}

export const PlantIcon: React.FC<PlantIconProps> = ({
  type,
  size = 'md',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const icons = {
    tree: '🌳',
    shrub: '🌿',
    herb: '🌱',
    vegetable: '🥬',
    flower: '🌻',
    vine: '🍇',
    grass: '🌾',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-gradient-to-br from-green-100 to-emerald-100',
        'border-2 border-green-300',
        sizes[size],
        className
      )}
      {...props}
    >
      <span className={size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'}>
        {icons[type]}
      </span>
    </div>
  )
}

interface CompanionIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  relationship: 'good' | 'bad' | 'neutral'
  plants?: [string, string]
}

export const CompanionIndicator: React.FC<CompanionIndicatorProps> = ({
  relationship,
  plants,
  className,
  ...props
}) => {
  const styles = {
    good: 'bg-green-50 text-green-700 companion-good',
    bad: 'bg-red-50 text-red-700 companion-bad',
    neutral: 'bg-yellow-50 text-yellow-700 companion-neutral',
  }

  const symbols = {
    good: '✓',
    bad: '✗',
    neutral: '~',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg',
        styles[relationship],
        className
      )}
      {...props}
    >
      <span className="font-bold text-lg">{symbols[relationship]}</span>
      {plants && (
        <span className="text-sm">
          {plants[0]} & {plants[1]}
        </span>
      )}
    </div>
  )
}

interface NatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'leaf' | 'earth' | 'water' | 'sun' | 'forest'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
}

export const NatureButton = React.forwardRef<HTMLButtonElement, NatureButtonProps>(
  ({ className, variant = 'leaf', size = 'md', icon: Icon, children, ...props }, ref) => {
    const variants = {
      leaf: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-nature',
      earth: 'gradient-earth hover:opacity-90 text-white',
      water: 'gradient-water hover:opacity-90 text-white',
      sun: 'gradient-sun hover:opacity-90 text-gray-900',
      forest: 'gradient-canopy hover:opacity-90 text-white',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-300 hover-lift',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {Icon && <Icon className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />}
        {children}
      </button>
    )
  }
)
NatureButton.displayName = 'NatureButton'

interface GrowthProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  label?: string
}

export const GrowthProgress: React.FC<GrowthProgressProps> = ({
  value,
  max = 100,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-green-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-3 bg-green-100 rounded-full overflow-hidden border border-green-200">
        <div
          className="h-full gradient-growth transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface PermaculturePrincipleProps extends React.HTMLAttributes<HTMLDivElement> {
  number: number
  title: string
  description?: string
}

export const PermaculturePrinciple: React.FC<PermaculturePrincipleProps> = ({
  number,
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-lg',
        'bg-gradient-to-r from-green-50 to-emerald-50',
        'border border-green-200 hover:border-green-300',
        'transition-all duration-300 hover-lift',
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  )
}

// Export all components
export default {
  NatureCard,
  SeasonBadge,
  ZoneIndicator,
  PlantIcon,
  CompanionIndicator,
  NatureButton,
  GrowthProgress,
  PermaculturePrinciple,
}