/**
 * Nature-Themed Form Components
 * Enhanced form inputs with permaculture aesthetics
 */

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import {
  Search, Leaf, Droplets, Sun, TreePine,
  MapPin, Calendar, Clock, Info, Check
} from 'lucide-react'
import { HelpTooltip } from './feedback'

// Nature-themed Input
export const NatureInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    helper?: string
    error?: string
    icon?: React.ReactNode
    success?: boolean
  }
>(({ label, helper, error, icon, success, className, ...props }, ref) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          {icon && <span className="text-green-600">{icon}</span>}
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          className={cn(
            "transition-all duration-200",
            "border-green-300 focus:border-green-500",
            "focus:ring-2 focus:ring-green-200",
            "placeholder:text-gray-400",
            error && "border-red-400 focus:border-red-500 focus:ring-red-200",
            success && "border-green-500 bg-green-50/50",
            focused && "shadow-md",
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {success && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 animate-bounce-in" />
        )}
      </div>
      {helper && !error && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Info className="h-3 w-3" />
          {helper}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 animate-slide-in-left">
          {error}
        </p>
      )}
    </div>
  )
})
NatureInput.displayName = 'NatureInput'

// Search Input with Nature Theme
export const NatureSearch: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}> = ({ value, onChange, placeholder = "Search plants...", className }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pl-10",
          "border-green-300 focus:border-green-500",
          "focus:ring-2 focus:ring-green-200",
          "bg-white/80 backdrop-blur",
          className
        )}
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Leaf className="h-4 w-4 text-green-500 animate-sway" />
        </div>
      )}
    </div>
  )
}

// Nature-themed Textarea
export const NatureTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
    helper?: string
    error?: string
  }
>(({ label, helper, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <Textarea
        ref={ref}
        className={cn(
          "min-h-[100px] resize-none",
          "border-green-300 focus:border-green-500",
          "focus:ring-2 focus:ring-green-200",
          "bg-gradient-to-br from-white to-green-50/20",
          error && "border-red-400 focus:border-red-500 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {helper && !error && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
})
NatureTextarea.displayName = 'NatureTextarea'

// Zone Selector
export const ZoneSelector: React.FC<{
  value: string
  onChange: (value: string) => void
  label?: string
}> = ({ value, onChange, label }) => {
  const zones = [
    { value: '0', label: 'Zone 0 - Home', icon: '🏠', color: 'bg-red-100 border-red-300' },
    { value: '1', label: 'Zone 1 - Kitchen Garden', icon: '🥬', color: 'bg-orange-100 border-orange-300' },
    { value: '2', label: 'Zone 2 - Food Forest', icon: '🌳', color: 'bg-yellow-100 border-yellow-300' },
    { value: '3', label: 'Zone 3 - Main Crops', icon: '🌾', color: 'bg-lime-100 border-lime-300' },
    { value: '4', label: 'Zone 4 - Pasture/Orchard', icon: '🐄', color: 'bg-green-100 border-green-300' },
    { value: '5', label: 'Zone 5 - Wild/Natural', icon: '🦌', color: 'bg-emerald-100 border-emerald-300' },
  ]

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label}
          <HelpTooltip content="Permaculture zones organize your space by frequency of use and maintenance needs">
            <span />
          </HelpTooltip>
        </Label>
      )}
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {zones.map((zone) => (
            <label
              key={zone.value}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer",
                "transition-all duration-200 hover:shadow-md",
                value === zone.value ? zone.color : "bg-white border-gray-200",
                value === zone.value && "ring-2 ring-green-500 ring-offset-2"
              )}
            >
              <RadioGroupItem value={zone.value} className="sr-only" />
              <span className="text-2xl">{zone.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{zone.label.split(' - ')[0]}</div>
                <div className="text-xs text-gray-600">{zone.label.split(' - ')[1]}</div>
              </div>
            </label>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

// Water Needs Slider
export const WaterNeedsSlider: React.FC<{
  value: number[]
  onChange: (value: number[]) => void
  label?: string
}> = ({ value, onChange, label }) => {
  const waterLevels = ['Xeric', 'Low', 'Moderate', 'High', 'Aquatic']
  const currentLevel = waterLevels[value[0] - 1] || 'Moderate'

  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-600" />
          {label}
        </Label>
      )}
      <div className="px-2">
        <Slider
          value={value}
          onValueChange={onChange}
          min={1}
          max={5}
          step={1}
          className="cursor-pointer"
        />
        <div className="flex justify-between mt-2">
          {waterLevels.map((level, idx) => (
            <span
              key={level}
              className={cn(
                "text-xs transition-all duration-200",
                value[0] === idx + 1
                  ? "text-blue-600 font-semibold scale-110"
                  : "text-gray-400"
              )}
            >
              {level}
            </span>
          ))}
        </div>
      </div>
      <div className={cn(
        "text-center p-2 rounded-lg",
        "bg-gradient-to-r from-blue-50 to-cyan-50",
        "border border-blue-200"
      )}>
        <p className="text-sm text-blue-700">
          Selected: <strong>{currentLevel}</strong> water needs
        </p>
      </div>
    </div>
  )
}

// Sun Requirements Selector
export const SunSelector: React.FC<{
  value: string
  onChange: (value: string) => void
  label?: string
}> = ({ value, onChange, label }) => {
  const sunOptions = [
    { value: 'full-shade', label: 'Full Shade', icon: '🌑', hours: '< 3 hours' },
    { value: 'part-shade', label: 'Part Shade', icon: '⛅', hours: '3-6 hours' },
    { value: 'part-sun', label: 'Part Sun', icon: '🌤️', hours: '4-6 hours' },
    { value: 'full-sun', label: 'Full Sun', icon: '☀️', hours: '6+ hours' },
  ]

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-600" />
          {label}
        </Label>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sunOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-3 rounded-lg border-2 transition-all duration-200",
              "hover:shadow-md hover:scale-105",
              value === option.value
                ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400"
                : "bg-white border-gray-200 hover:border-yellow-300"
            )}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <div className="text-sm font-medium">{option.label}</div>
            <div className="text-xs text-gray-600">{option.hours}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Season Picker
export const SeasonPicker: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  multiple?: boolean
}> = ({ value, onChange, label, multiple = true }) => {
  const seasons = [
    { value: 'spring', label: 'Spring', icon: '🌸', color: 'from-green-100 to-pink-100' },
    { value: 'summer', label: 'Summer', icon: '☀️', color: 'from-yellow-100 to-orange-100' },
    { value: 'autumn', label: 'Autumn', icon: '🍂', color: 'from-orange-100 to-red-100' },
    { value: 'winter', label: 'Winter', icon: '❄️', color: 'from-blue-100 to-purple-100' },
  ]

  const handleClick = (season: string) => {
    if (multiple) {
      if (value.includes(season)) {
        onChange(value.filter(v => v !== season))
      } else {
        onChange([...value, season])
      }
    } else {
      onChange([season])
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-600" />
          {label}
        </Label>
      )}
      <div className="grid grid-cols-4 gap-3">
        {seasons.map((season) => (
          <button
            key={season.value}
            onClick={() => handleClick(season.value)}
            className={cn(
              "p-3 rounded-lg border-2 transition-all duration-200",
              "hover:shadow-md hover:scale-105",
              value.includes(season.value)
                ? `bg-gradient-to-br ${season.color} border-green-400 ring-2 ring-green-500 ring-offset-1`
                : "bg-white border-gray-200 hover:border-green-300"
            )}
          >
            <div className="text-2xl mb-1">{season.icon}</div>
            <div className="text-sm font-medium">{season.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default {
  NatureInput,
  NatureSearch,
  NatureTextarea,
  ZoneSelector,
  WaterNeedsSlider,
  SunSelector,
  SeasonPicker,
}