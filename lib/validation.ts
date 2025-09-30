import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Location validation
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  city: z.string().min(1).max(100).optional(),
  usda_zone: z.string().regex(/^\d{1,2}[ab]?$/).optional(),
  last_frost: z.string().optional(),
  first_frost: z.string().optional()
})

// Area validation
export const areaSchema = z.object({
  total_sqft: z.number().min(1).max(100000),
  usable_fraction: z.number().min(0.1).max(1),
  shape: z.enum(['rectangular', 'L-shaped', 'scattered'])
})

// Surface validation
export const surfaceSchema = z.object({
  type: z.enum(['soil', 'hard']),
  sun_hours: z.number().min(0).max(24),
  slope: z.number().min(0).max(45),
  accessibility_needs: z.boolean()
})

// Water validation
export const waterSchema = z.object({
  source: z.enum(['spigot', 'none', 'rain']),
  drip_allowed: z.boolean(),
  sip_interest: z.boolean()
})

// Crops validation
export const cropsSchema = z.object({
  focus: z.array(z.string()).min(1),
  avoid_families: z.array(z.string()).optional(),
  time_weekly_minutes: z.number().min(15).max(1440)
})

// Complete wizard data validation
export const wizardDataSchema = z.object({
  location: locationSchema,
  area: areaSchema,
  surface: surfaceSchema,
  water: waterSchema,
  crops: cropsSchema,
  materials: z.object({
    lumber_type: z.enum(['cedar', 'pine', 'treated']).optional(),
    budget_tier: z.enum(['budget', 'standard', 'premium']).optional()
  }),
  template: z.any().optional()
})

// Plan validation
export const planSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  site_id: z.string().uuid(),
  scene_json: z.any().optional()
})

// Bed validation
export const bedSchema = z.object({
  id: z.string(),
  plan_id: z.string().uuid(),
  name: z.string().min(1).max(50),
  length_ft: z.number().min(1).max(50),
  width_ft: z.number().min(1).max(8),
  height_in: z.number().min(6).max(36),
  orientation: z.enum(['NS', 'EW']),
  wicking: z.boolean(),
  trellis: z.boolean(),
  position_json: z.object({
    x: z.number(),
    y: z.number()
  })
})

// Scene node validation
export const sceneNodeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('Bed'),
    id: z.string(),
    transform: z.object({
      xIn: z.number(),
      yIn: z.number(),
      rotationDeg: z.number()
    }),
    size: z.object({
      widthIn: z.number().min(12).max(96),
      heightIn: z.number().min(12).max(600)
    }),
    bed: z.object({
      heightIn: z.number().min(6).max(36),
      orientation: z.enum(['NS', 'EW']),
      wicking: z.boolean(),
      trellisNorth: z.boolean(),
      familyTag: z.string().optional()
    })
  }),
  z.object({
    type: z.literal('Path'),
    id: z.string(),
    path: z.object({
      widthIn: z.number().min(12).max(48),
      material: z.enum(['mulch', 'gravel', 'pavers', 'grass']),
      accessible: z.boolean()
    })
  }),
  z.object({
    type: z.literal('Label'),
    id: z.string(),
    transform: z.object({
      xIn: z.number(),
      yIn: z.number(),
      rotationDeg: z.number()
    }),
    label: z.object({
      text: z.string().max(100),
      fontSize: z.number().min(8).max(72)
    })
  })
])

// Validation helpers
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function sanitizeInput(input: string): string {
  // Remove any potential XSS vectors
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim()

  // Remove javascript: protocol from href attributes
  sanitized = sanitized.replace(/href\s*=\s*["']\s*javascript:[^"']*["']/gi, 'href=""')

  // Remove event handlers (onclick, onmouseover, etc.) - improved regex
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')

  return sanitized
}

export function sanitizeNumber(
  value: unknown,
  min: number,
  max: number,
  defaultValue: number
): number {
  if (value === null || value === undefined) return defaultValue
  const num = Number(value)
  if (isNaN(num)) return defaultValue
  return Math.min(Math.max(num, min), max)
}

export function sanitizeBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return defaultValue
}

// Form validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: unknown): data is T => {
    const result = validateData(schema, data)
    if (result.success) {
      setErrors({})
      return true
    } else {
      const newErrors: Record<string, string> = {}
      result.errors.issues.forEach(error => {
        const path = error.path.join('.')
        newErrors[path] = error.message
      })
      setErrors(newErrors)
      return false
    }
  }

  const validateField = (field: string, value: unknown) => {
    try {
      // For object schemas, try to parse just the field
      if (schema instanceof z.ZodObject) {
        const fieldSchema = (schema as any).shape[field]
        if (fieldSchema) {
          fieldSchema.parse(value)
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.issues[0].message
        }))
      }
    }
  }

  const clearErrors = () => setErrors({})

  return { errors, validate, validateField, clearErrors }
}

// Constraints validation
export function validateBedConstraints(bed: any): string[] {
  const errors: string[] = []

  if (bed.size.widthIn > 48) {
    errors.push('Bed width cannot exceed 4 feet for reachability')
  }

  if (bed.size.heightIn > 600) {
    errors.push('Bed length cannot exceed 50 feet')
  }

  if (bed.bed.heightIn < 6) {
    errors.push('Bed height must be at least 6 inches')
  }

  if (bed.bed.heightIn > 36) {
    errors.push('Bed height cannot exceed 36 inches')
  }

  return errors
}

export function validatePathConstraints(path: any, accessible: boolean): string[] {
  const errors: string[] = []
  const minWidth = accessible ? 36 : 18

  if (path.path.widthIn < minWidth) {
    errors.push(
      accessible
        ? 'Accessible paths must be at least 36 inches wide'
        : 'Paths must be at least 18 inches wide'
    )
  }

  return errors
}

export function validateOverlap(
  nodes: any[],
  newNode: any,
  tolerance = 2
): boolean {
  for (const node of nodes) {
    if (node.id === newNode.id) continue
    if (node.type !== 'Bed' || newNode.type !== 'Bed') continue

    // Calculate the center-to-center distance
    const dx = Math.abs(node.transform.xIn - newNode.transform.xIn)
    const dy = Math.abs(node.transform.yIn - newNode.transform.yIn)

    // Calculate the minimum center-to-center distance needed for the required tolerance
    const minDistanceX = (node.size.widthIn + newNode.size.widthIn) / 2 + tolerance
    const minDistanceY = (node.size.heightIn + newNode.size.heightIn) / 2 + tolerance

    // Check if beds are too close (within the tolerance distance)
    if (dx < minDistanceX && dy < minDistanceY) {
      return false // Too close - validation fails
    }
  }
  return true // Far enough apart - validation passes
}

import { useState } from 'react'