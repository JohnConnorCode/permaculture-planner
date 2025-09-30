import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  HelpCircle,
  Info,
  Lightbulb,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  X
} from 'lucide-react'

interface HelpTip {
  title: string
  description: string
  type?: 'info' | 'tip' | 'warning' | 'success'
  learnMoreUrl?: string
}

interface QuickTooltipProps {
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
}

export function QuickTooltip({
  content,
  side = 'top',
  align = 'center',
  className,
  children
}: QuickTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={cn('max-w-xs', className)}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface HelpIconProps {
  tip: HelpTip
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'subtle'
  className?: string
}

export function HelpIcon({ tip, size = 'sm', variant = 'default', className }: HelpIconProps) {
  const getIcon = () => {
    switch (tip.type) {
      case 'tip':
        return <Lightbulb className={cn(
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5'
        )} />
      case 'warning':
        return <AlertTriangle className={cn(
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5'
        )} />
      case 'success':
        return <CheckCircle className={cn(
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5'
        )} />
      case 'info':
      default:
        return <HelpCircle className={cn(
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-4 w-4',
          size === 'lg' && 'h-5 w-5'
        )} />
    }
  }

  const getColors = () => {
    switch (tip.type) {
      case 'tip':
        return 'text-yellow-500 hover:text-yellow-600'
      case 'warning':
        return 'text-orange-500 hover:text-orange-600'
      case 'success':
        return 'text-green-500 hover:text-green-600'
      case 'info':
      default:
        return 'text-blue-500 hover:text-blue-600'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant === 'subtle' ? 'ghost' : 'outline'}
            size="sm"
            className={cn(
              'p-1 h-auto border-none',
              variant === 'default' && 'hover:bg-gray-100',
              variant === 'subtle' && 'bg-transparent hover:bg-transparent',
              getColors(),
              className
            )}
          >
            {getIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            <div className="font-medium">{tip.title}</div>
            <div className="text-sm">{tip.description}</div>
            {tip.learnMoreUrl && (
              <a
                href={tip.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-blue-500 hover:text-blue-600"
              >
                Learn more
                <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ExpandableHelpProps {
  tip: HelpTip
  defaultExpanded?: boolean
  className?: string
}

export function ExpandableHelp({ tip, defaultExpanded = false, className }: ExpandableHelpProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const getTypeStyles = () => {
    switch (tip.type) {
      case 'tip':
        return 'border-yellow-200 bg-yellow-50'
      case 'warning':
        return 'border-orange-200 bg-orange-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className={cn('border rounded-lg', getTypeStyles(), className)}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 text-left flex items-center justify-between hover:bg-opacity-70 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <HelpIcon tip={tip} variant="subtle" />
          <span className="font-medium text-sm">{tip.title}</span>
        </div>
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform',
            isExpanded && 'rotate-90'
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="pl-6 space-y-2">
            <p className="text-sm text-gray-700">{tip.description}</p>
            {tip.learnMoreUrl && (
              <a
                href={tip.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                Learn more
                <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface HelpPanelProps {
  tips: HelpTip[]
  title?: string
  className?: string
  maxHeight?: string
}

export function HelpPanel({ tips, title = 'Help & Tips', className, maxHeight = '400px' }: HelpPanelProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center space-x-1"
      >
        <BookOpen className="h-4 w-4" />
        <span>{title}</span>
      </Button>

      {isVisible && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3" style={{ maxHeight, overflowY: 'auto' }}>
            {tips.map((tip, index) => (
              <ExpandableHelp key={index} tip={tip} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface InlineHelpProps {
  tip: HelpTip
  className?: string
}

export function InlineHelp({ tip, className }: InlineHelpProps) {
  const getTypeStyles = () => {
    switch (tip.type) {
      case 'tip':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-800'
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  return (
    <div className={cn(
      'flex items-start space-x-2 p-3 border rounded-lg text-sm',
      getTypeStyles(),
      className
    )}>
      <div className="flex-shrink-0 mt-0.5">
        <HelpIcon tip={tip} variant="subtle" size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium mb-1">{tip.title}</div>
        <div>{tip.description}</div>
        {tip.learnMoreUrl && (
          <a
            href={tip.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 text-sm font-medium hover:underline"
          >
            Learn more
            <ChevronRight className="h-3 w-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  )
}

// Predefined help content for common permaculture concepts
export const permacultureHelpTips = {
  usdaZone: {
    title: 'USDA Hardiness Zone',
    description: 'This determines which plants can survive winter in your area. It\'s based on average minimum winter temperatures.',
    type: 'info' as const,
    learnMoreUrl: 'https://planthardiness.ars.usda.gov/'
  },

  companionPlanting: {
    title: 'Companion Planting',
    description: 'Growing certain plants together to benefit each other through pest control, nutrient sharing, or space optimization.',
    type: 'tip' as const,
    learnMoreUrl: 'https://www.almanac.com/companion-planting-guide'
  },

  polyculture: {
    title: 'Polyculture Design',
    description: 'Growing multiple crops together mimics natural ecosystems and increases biodiversity, pest resistance, and soil health.',
    type: 'tip' as const
  },

  waterRetention: {
    title: 'Water Retention',
    description: 'Techniques like mulching, swales, and soil amendments help retain moisture and reduce watering needs.',
    type: 'info' as const
  },

  soilHealth: {
    title: 'Soil Health',
    description: 'Healthy soil with good organic matter supports stronger plants and better water retention. Test your soil pH and add compost regularly.',
    type: 'success' as const
  },

  dripIrrigation: {
    title: 'Drip Irrigation',
    description: 'Efficient watering system that delivers water directly to plant roots, reducing waste and preventing leaf diseases.',
    type: 'tip' as const
  },

  seasonExtension: {
    title: 'Season Extension',
    description: 'Use techniques like row covers, cold frames, or greenhouses to grow food beyond your natural growing season.',
    type: 'tip' as const
  },

  cropRotation: {
    title: 'Crop Rotation',
    description: 'Rotating plant families in different areas each season prevents soil depletion and reduces pest and disease problems.',
    type: 'warning' as const
  }
}

// Hook for managing contextual help state
export function useContextualHelp() {
  const [activeHelp, setActiveHelp] = React.useState<string | null>(null)
  const [viewedTips, setViewedTips] = React.useState<Set<string>>(new Set())

  const showHelp = React.useCallback((tipId: string) => {
    setActiveHelp(tipId)
    setViewedTips(prev => new Set(Array.from(prev).concat(tipId)))
  }, [])

  const hideHelp = React.useCallback(() => {
    setActiveHelp(null)
  }, [])

  const markAsViewed = React.useCallback((tipId: string) => {
    setViewedTips(prev => new Set(Array.from(prev).concat(tipId)))
  }, [])

  return {
    activeHelp,
    viewedTips,
    showHelp,
    hideHelp,
    markAsViewed
  }
}