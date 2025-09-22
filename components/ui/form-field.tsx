import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface BaseFieldProps {
  name: string
  label?: string
  error?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  min?: number
  max?: number
  step?: number
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
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
}

type FormFieldProps =
  | TextFieldProps
  | TextareaFieldProps
  | SelectFieldProps
  | SwitchFieldProps
  | SliderFieldProps

export function FormField(props: FormFieldProps) {
  const { name, label, error, description, required, disabled, className } = props

  const fieldId = React.useId()

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <Input
            id={fieldId}
            name={name}
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            required={required}
            min={props.min}
            max={props.max}
            step={props.step}
            className={cn(error && 'border-red-500', className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            name={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            disabled={disabled}
            required={required}
            rows={props.rows}
            className={cn(error && 'border-red-500', className)}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
          />
        )

      case 'select':
        return (
          <Select
            name={name}
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger
              id={fieldId}
              className={cn(error && 'border-red-500', className)}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            >
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              name={name}
              checked={props.value}
              onCheckedChange={props.onChange}
              disabled={disabled}
              required={required}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : undefined}
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
                <span className="text-sm text-muted-foreground">
                  {props.value[0]}
                </span>
              </div>
            )}
            <Slider
              id={fieldId}
              name={name}
              value={props.value}
              onValueChange={props.onChange}
              disabled={disabled}
              min={props.min}
              max={props.max}
              step={props.step}
              className={className}
              aria-invalid={!!error}
              aria-describedby={error ? `${fieldId}-error` : undefined}
            />
          </div>
        )
    }
  }

  if (props.type === 'switch' || props.type === 'slider') {
    return (
      <div className="space-y-2">
        {renderField()}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={`${fieldId}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={fieldId}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

// Form wrapper component
export function Form({
  children,
  onSubmit,
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit?.(e)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
      {...props}
    >
      {children}
    </form>
  )
}

// Field group for related fields
export function FieldGroup({
  children,
  title,
  description,
  className
}: {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}