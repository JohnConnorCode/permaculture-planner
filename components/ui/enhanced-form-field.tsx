import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Check, X, HelpCircle, AlertCircle, Loader2 } from 'lucide-react'

type ValidationStatus = 'valid' | 'invalid' | 'warning' | 'validating' | 'idle'

interface ValidationRule {
  validate: (value: any) => boolean | Promise<boolean>
  message: string
  type?: 'error' | 'warning'
}

interface BaseFieldProps {
  name: string
  label?: string
  error?: string
  description?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  className?: string
  validationRules?: ValidationRule[]
  validateOnBlur?: boolean
  validateOnChange?: boolean
  showValidationIcon?: boolean
  onValidationChange?: (isValid: boolean, message?: string) => void
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
  suggestions?: string[]
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  placeholder?: string
  searchable?: boolean
}

interface SwitchFieldProps extends BaseFieldProps {
  type: 'switch'
  value: boolean
  onChange: (value: boolean) => void
}

interface SliderFieldProps extends BaseFieldProps {
  type: 'slider'
  value: number[]
  onChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  formatValue?: (value: number) => string
}

type EnhancedFormFieldProps =
  | TextFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | SwitchFieldProps
  | SliderFieldProps

export function EnhancedFormField(props: EnhancedFormFieldProps) {
  const {
    name,
    label,
    error,
    description,
    helpText,
    required,
    disabled,
    className,
    validationRules = [],
    validateOnBlur = true,
    validateOnChange = false,
    showValidationIcon = true,
    onValidationChange
  } = props

  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>('idle')
  const [validationMessage, setValidationMessage] = React.useState<string>('')
  const [isValidating, setIsValidating] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const fieldId = React.useId()

  // Real-time validation
  const validateField = React.useCallback(async (value: any) => {
    if (!validationRules.length) return

    setIsValidating(true)
    setValidationStatus('validating')

    try {
      for (const rule of validationRules) {
        const isValid = await rule.validate(value)
        if (!isValid) {
          setValidationStatus(rule.type === 'warning' ? 'warning' : 'invalid')
          setValidationMessage(rule.message)
          onValidationChange?.(false, rule.message)
          setIsValidating(false)
          return
        }
      }

      setValidationStatus('valid')
      setValidationMessage('')
      onValidationChange?.(true)
    } catch (error) {
      setValidationStatus('invalid')
      setValidationMessage('Validation error occurred')
      onValidationChange?.(false, 'Validation error occurred')
    }

    setIsValidating(false)
  }, [validationRules, onValidationChange])

  // Handle value changes
  const handleChange = React.useCallback((value: any) => {
    if (props.type === 'text' || props.type === 'email' || props.type === 'password' ||
        props.type === 'number' || props.type === 'tel' || props.type === 'url') {
      props.onChange(value)

      // Show suggestions for text fields
      if (props.suggestions && value) {
        const filtered = props.suggestions.filter(s =>
          s.toLowerCase().includes(value.toLowerCase())
        )
        setSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
      }
    } else if (props.type === 'textarea') {
      props.onChange(value)
    } else if (props.type === 'select') {
      props.onChange(value)
    } else if (props.type === 'switch') {
      props.onChange(value)
    } else if (props.type === 'slider') {
      props.onChange(value)
    }

    if (validateOnChange) {
      validateField(value)
    }
  }, [props, validateOnChange, validateField])

  // Handle blur events
  const handleBlur = React.useCallback(() => {
    setShowSuggestions(false)
    if (validateOnBlur) {
      const value = props.type === 'switch' ? props.value :
                   props.type === 'slider' ? props.value :
                   props.value
      validateField(value)
    }
  }, [validateOnBlur, validateField, props])

  // Validation icon
  const ValidationIcon = () => {
    if (!showValidationIcon) return null

    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'valid':
        return <Check className="h-4 w-4 text-green-500" />
      case 'invalid':
        return <X className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  // Help tooltip
  const HelpTooltip = () => {
    if (!helpText) return null

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{helpText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Enhanced input with validation styling
  const getInputClassName = () => {
    const baseClass = className || ''

    switch (validationStatus) {
      case 'valid':
        return cn('border-green-500 focus:ring-green-500', baseClass)
      case 'invalid':
        return cn('border-red-500 focus:ring-red-500', baseClass)
      case 'warning':
        return cn('border-yellow-500 focus:ring-yellow-500', baseClass)
      default:
        return cn(error && 'border-red-500', baseClass)
    }
  }

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <div className="relative">
            <Input
              id={fieldId}
              name={name}
              type={props.type}
              value={props.value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder={props.placeholder}
              disabled={disabled}
              required={required}
              min={props.min}
              max={props.max}
              step={props.step}
              className={getInputClassName()}
              aria-invalid={!!error || validationStatus === 'invalid'}
              aria-describedby={error || validationMessage ? `${fieldId}-error` : undefined}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ValidationIcon />
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                    onClick={() => {
                      handleChange(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                id={fieldId}
                name={name}
                value={props.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder={props.placeholder}
                disabled={disabled}
                required={required}
                rows={props.rows}
                maxLength={props.maxLength}
                className={getInputClassName()}
                aria-invalid={!!error || validationStatus === 'invalid'}
                aria-describedby={error || validationMessage ? `${fieldId}-error` : undefined}
              />
              <div className="absolute top-3 right-3">
                <ValidationIcon />
              </div>
            </div>
            {props.showCharCount && props.maxLength && (
              <div className="text-xs text-muted-foreground text-right">
                {props.value.length} / {props.maxLength}
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="relative">
            <Select
              name={name}
              value={props.value}
              onValueChange={handleChange}
              disabled={disabled}
              required={required}
            >
              <SelectTrigger
                id={fieldId}
                className={getInputClassName()}
                aria-invalid={!!error || validationStatus === 'invalid'}
                aria-describedby={error || validationMessage ? `${fieldId}-error` : undefined}
              >
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {props.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute inset-y-0 right-8 flex items-center pr-3">
              <ValidationIcon />
            </div>
          </div>
        )

      case 'switch':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id={fieldId}
                name={name}
                checked={props.value}
                onCheckedChange={handleChange}
                disabled={disabled}
                required={required}
                aria-invalid={!!error || validationStatus === 'invalid'}
                aria-describedby={error || validationMessage ? `${fieldId}-error` : undefined}
              />
              {label && (
                <Label
                  htmlFor={fieldId}
                  className={cn('cursor-pointer', disabled && 'opacity-50')}
                >
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
            </div>
            <ValidationIcon />
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-2">
            {label && (
              <div className="flex items-center justify-between">
                <Label htmlFor={fieldId}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {props.formatValue ? props.formatValue(props.value[0]) : props.value[0]}
                  </span>
                  <ValidationIcon />
                </div>
              </div>
            )}
            <Slider
              id={fieldId}
              name={name}
              value={props.value}
              onValueChange={handleChange}
              disabled={disabled}
              min={props.min}
              max={props.max}
              step={props.step}
              className={className}
              aria-invalid={!!error || validationStatus === 'invalid'}
              aria-describedby={error || validationMessage ? `${fieldId}-error` : undefined}
            />
          </div>
        )
    }
  }

  const currentError = error || validationMessage
  const isError = !!error || validationStatus === 'invalid'
  const isWarning = validationStatus === 'warning'

  if (props.type === 'switch' || props.type === 'slider') {
    return (
      <div className="space-y-2">
        {renderField()}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {currentError && (
          <p
            id={`${fieldId}-error`}
            className={cn(
              'text-sm flex items-center space-x-1',
              isError ? 'text-red-500' : isWarning ? 'text-yellow-500' : ''
            )}
          >
            {isError && <X className="h-3 w-3" />}
            {isWarning && <AlertCircle className="h-3 w-3" />}
            <span>{currentError}</span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center space-x-2">
          <Label htmlFor={fieldId}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <HelpTooltip />
        </div>
      )}
      {renderField()}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {currentError && (
        <p
          id={`${fieldId}-error`}
          className={cn(
            'text-sm flex items-center space-x-1',
            isError ? 'text-red-500' : isWarning ? 'text-yellow-500' : ''
          )}
        >
          {isError && <X className="h-3 w-3" />}
          {isWarning && <AlertCircle className="h-3 w-3" />}
          <span>{currentError}</span>
        </p>
      )}
    </div>
  )
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (typeof value === 'number') return !isNaN(value)
      if (typeof value === 'boolean') return true
      return !!value
    },
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length >= min,
    message: message || `Must be at least ${min} characters`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length <= max,
    message: message || `Must be no more than ${max} characters`
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => regex.test(value),
    message
  }),

  numeric: (message = 'Please enter a valid number'): ValidationRule => ({
    validate: (value) => !isNaN(Number(value)),
    message
  }),

  range: (min: number, max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      const num = Number(value)
      return !isNaN(num) && num >= min && num <= max
    },
    message: message || `Must be between ${min} and ${max}`
  }),

  zipCode: (message = 'Please enter a valid zip code'): ValidationRule => ({
    validate: (value) => {
      const zipRegex = /^\d{5}(-\d{4})?$/
      return zipRegex.test(value)
    },
    message
  }),

  usPhoneNumber: (message = 'Please enter a valid US phone number'): ValidationRule => ({
    validate: (value) => {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      return phoneRegex.test(value)
    },
    message
  })
}