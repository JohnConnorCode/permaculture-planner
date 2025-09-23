/**
 * User Feedback Components
 * Consistent, nature-themed feedback elements for better UX
 */

import React from 'react'
import { cn } from '@/lib/utils'
import {
  AlertCircle, CheckCircle, Info, XCircle,
  Leaf, TreePine, Droplets, Sun, Sprout,
  HelpCircle, Lightbulb, AlertTriangle
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Success Messages
export const SuccessMessage: React.FC<{
  title?: string
  message: string
  icon?: 'default' | 'plant' | 'water' | 'sun'
  className?: string
}> = ({ title, message, icon = 'default', className }) => {
  const icons = {
    default: CheckCircle,
    plant: Leaf,
    water: Droplets,
    sun: Sun
  }
  const Icon = icons[icon]

  return (
    <Alert className={cn(
      "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50",
      "animate-slide-in-left shadow-md border-organic",
      className
    )}>
      <Icon className="h-5 w-5 text-green-600 animate-bounce-in" />
      {title && <AlertTitle className="text-green-800">{title}</AlertTitle>}
      <AlertDescription className="text-green-700">
        {message}
      </AlertDescription>
    </Alert>
  )
}

// Error Messages
export const ErrorMessage: React.FC<{
  title?: string
  message: string
  className?: string
}> = ({ title, message, className }) => {
  return (
    <Alert className={cn(
      "border-red-300 bg-gradient-to-r from-red-50 to-pink-50",
      "animate-shake shadow-md",
      className
    )}>
      <XCircle className="h-5 w-5 text-red-600" />
      {title && <AlertTitle className="text-red-800">{title}</AlertTitle>}
      <AlertDescription className="text-red-700">
        {message}
      </AlertDescription>
    </Alert>
  )
}

// Warning Messages
export const WarningMessage: React.FC<{
  title?: string
  message: string
  className?: string
}> = ({ title, message, className }) => {
  return (
    <Alert className={cn(
      "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50",
      "animate-fade-in shadow-md",
      className
    )}>
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      {title && <AlertTitle className="text-amber-800">{title}</AlertTitle>}
      <AlertDescription className="text-amber-700">
        {message}
      </AlertDescription>
    </Alert>
  )
}

// Info Messages
export const InfoMessage: React.FC<{
  title?: string
  message: string
  tip?: string
  className?: string
}> = ({ title, message, tip, className }) => {
  return (
    <Alert className={cn(
      "border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50",
      "animate-fade-in shadow-md border-organic",
      className
    )}>
      <Info className="h-5 w-5 text-blue-600" />
      {title && <AlertTitle className="text-blue-800">{title}</AlertTitle>}
      <AlertDescription className="text-blue-700">
        {message}
        {tip && (
          <div className="mt-2 p-2 bg-blue-100/50 rounded-lg border-organic">
            <Lightbulb className="inline h-3 w-3 mr-1 text-blue-600" />
            <span className="text-xs">{tip}</span>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Permaculture Tips
export const PermacultureTip: React.FC<{
  principle?: string
  tip: string
  className?: string
}> = ({ principle, tip, className }) => {
  return (
    <div className={cn(
      "p-4 bg-gradient-to-br from-green-50 to-emerald-50",
      "border border-green-300 border-organic shadow-sm",
      "hover:shadow-md transition-shadow animate-fade-in",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-100 rounded-full animate-grow">
          <Sprout className="h-5 w-5 text-green-700" />
        </div>
        <div className="flex-1">
          {principle && (
            <h4 className="font-semibold text-green-800 text-sm mb-1">
              {principle}
            </h4>
          )}
          <p className="text-sm text-green-700">{tip}</p>
        </div>
      </div>
    </div>
  )
}

// Help Tooltip
export const HelpTooltip: React.FC<{
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}> = ({ content, children, side = 'top' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3 w-3 text-gray-400 hover:text-green-600 transition-colors" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-xs bg-white/95 backdrop-blur border-green-200 shadow-lg"
        >
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Plant Info Tooltip
export const PlantTooltip: React.FC<{
  name: string
  latinName?: string
  zone?: string
  waterNeeds?: string
  sunNeeds?: string
  children: React.ReactNode
}> = ({ name, latinName, zone, waterNeeds, sunNeeds, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-white/95 backdrop-blur border-green-200 shadow-xl p-3">
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-green-800">{name}</h4>
              {latinName && (
                <p className="text-xs italic text-gray-600">{latinName}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {zone && (
                <div className="text-center p-1 bg-green-50 rounded">
                  <TreePine className="h-3 w-3 mx-auto text-green-600" />
                  <span className="text-gray-700">Zone {zone}</span>
                </div>
              )}
              {waterNeeds && (
                <div className="text-center p-1 bg-blue-50 rounded">
                  <Droplets className="h-3 w-3 mx-auto text-blue-600" />
                  <span className="text-gray-700">{waterNeeds}</span>
                </div>
              )}
              {sunNeeds && (
                <div className="text-center p-1 bg-yellow-50 rounded">
                  <Sun className="h-3 w-3 mx-auto text-yellow-600" />
                  <span className="text-gray-700">{sunNeeds}</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Loading Feedback
export const LoadingFeedback: React.FC<{
  message?: string
  className?: string
}> = ({ message = "Growing...", className }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-2",
      "bg-green-50 border border-green-200 rounded-full",
      "animate-pulse",
      className
    )}>
      <Leaf className="h-4 w-4 text-green-600 animate-sway" />
      <span className="text-sm text-green-700">{message}</span>
    </div>
  )
}

// Progress Feedback
export const ProgressFeedback: React.FC<{
  stage: string
  progress: number
  className?: string
}> = ({ stage, progress, className }) => {
  return (
    <div className={cn(
      "p-4 bg-white border border-green-200 rounded-lg shadow-sm",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{stage}</span>
        <span className="text-sm text-green-600">{progress}%</span>
      </div>
      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Empty State
export const EmptyState: React.FC<{
  title: string
  message: string
  action?: React.ReactNode
  icon?: 'plant' | 'water' | 'sun' | 'garden'
  className?: string
}> = ({ title, message, action, icon = 'plant', className }) => {
  const icons = {
    plant: Leaf,
    water: Droplets,
    sun: Sun,
    garden: TreePine
  }
  const Icon = icons[icon]

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12",
      "text-center",
      className
    )}>
      <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4 animate-bounce-in">
        <Icon className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>
      {action}
    </div>
  )
}

// Shake animation for errors
const shakeKeyframes = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
`

// Add shake animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = shakeKeyframes + `
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
  `
  document.head.appendChild(style)
}

export default {
  SuccessMessage,
  ErrorMessage,
  WarningMessage,
  InfoMessage,
  PermacultureTip,
  HelpTooltip,
  PlantTooltip,
  LoadingFeedback,
  ProgressFeedback,
  EmptyState,
}