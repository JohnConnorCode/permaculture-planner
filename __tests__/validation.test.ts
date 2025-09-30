import { describe, expect, test } from '@jest/globals'
import {
  emailSchema,
  passwordSchema,
  locationSchema,
  areaSchema,
  surfaceSchema,
  waterSchema,
  cropsSchema,
  wizardDataSchema,
  validateData,
  sanitizeInput,
  sanitizeNumber,
  sanitizeBoolean,
  validateBedConstraints,
  validatePathConstraints,
  validateOverlap
} from '@/lib/validation'

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    test('validates correct email format', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
      expect(emailSchema.parse('test.user+tag@domain.co.uk')).toBe('test.user+tag@domain.co.uk')
    })

    test('rejects invalid email format', () => {
      expect(() => emailSchema.parse('invalid')).toThrow()
      expect(() => emailSchema.parse('@example.com')).toThrow()
      expect(() => emailSchema.parse('user@')).toThrow()
    })
  })

  describe('passwordSchema', () => {
    test('validates strong passwords', () => {
      expect(passwordSchema.parse('StrongP@ss123')).toBe('StrongP@ss123')
      expect(passwordSchema.parse('MySecure2024')).toBe('MySecure2024')
    })

    test('rejects weak passwords', () => {
      expect(() => passwordSchema.parse('short')).toThrow() // Too short
      expect(() => passwordSchema.parse('lowercase123')).toThrow() // No uppercase
      expect(() => passwordSchema.parse('UPPERCASE123')).toThrow() // No lowercase
      expect(() => passwordSchema.parse('NoNumbers')).toThrow() // No numbers
    })
  })

  describe('locationSchema', () => {
    test('validates location data', () => {
      const valid = {
        lat: 47.6062,
        lng: -122.3321,
        city: 'Seattle',
        usda_zone: '8b',
        last_frost: '2024-03-15',
        first_frost: '2024-11-15'
      }
      expect(locationSchema.parse(valid)).toEqual(valid)
    })

    test('validates USDA zones', () => {
      expect(locationSchema.parse({ usda_zone: '5a' })).toHaveProperty('usda_zone', '5a')
      expect(locationSchema.parse({ usda_zone: '10b' })).toHaveProperty('usda_zone', '10b')
      expect(locationSchema.parse({ usda_zone: '7' })).toHaveProperty('usda_zone', '7')
    })

    test('rejects invalid coordinates', () => {
      expect(() => locationSchema.parse({ lat: 91 })).toThrow()
      expect(() => locationSchema.parse({ lng: -181 })).toThrow()
    })
  })

  describe('areaSchema', () => {
    test('validates area configuration', () => {
      const valid = {
        total_sqft: 500,
        usable_fraction: 0.8,
        shape: 'rectangular' as const
      }
      expect(areaSchema.parse(valid)).toEqual(valid)
    })

    test('validates shape options', () => {
      expect(areaSchema.parse({
        total_sqft: 100,
        usable_fraction: 0.5,
        shape: 'L-shaped' as const
      })).toHaveProperty('shape', 'L-shaped')
    })

    test('rejects invalid values', () => {
      expect(() => areaSchema.parse({
        total_sqft: 0,
        usable_fraction: 0.5,
        shape: 'rectangular'
      })).toThrow()

      expect(() => areaSchema.parse({
        total_sqft: 100,
        usable_fraction: 1.1,
        shape: 'rectangular'
      })).toThrow()
    })
  })
})

describe('Validation Helpers', () => {
  describe('validateData', () => {
    test('returns success for valid data', () => {
      const result = validateData(emailSchema, 'test@example.com')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    test('returns error for invalid data', () => {
      const result = validateData(emailSchema, 'invalid-email')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.issues).toBeDefined()
        expect(result.errors.issues.length).toBeGreaterThan(0)
      }
    })
  })

  describe('sanitizeInput', () => {
    test('removes script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World'
      expect(sanitizeInput(input)).toBe('Hello  World')
    })

    test('removes iframe tags', () => {
      const input = '<iframe src="evil.com"></iframe>Content'
      expect(sanitizeInput(input)).toBe('Content')
    })

    test('removes javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">Click</a>'
      expect(sanitizeInput(input)).toBe('<a href="">Click</a>')
    })

    test('removes event handlers', () => {
      const input = '<div onclick="alert(1)">Content</div>'
      expect(sanitizeInput(input)).toBe('<div>Content</div>')
    })

    test('preserves safe content', () => {
      const input = 'Normal text with <strong>emphasis</strong>'
      expect(sanitizeInput(input)).toBe('Normal text with <strong>emphasis</strong>')
    })
  })

  describe('sanitizeNumber', () => {
    test('returns valid numbers within range', () => {
      expect(sanitizeNumber(5, 0, 10, 0)).toBe(5)
      expect(sanitizeNumber('7', 0, 10, 0)).toBe(7)
    })

    test('clamps to min value', () => {
      expect(sanitizeNumber(-5, 0, 10, 5)).toBe(0)
    })

    test('clamps to max value', () => {
      expect(sanitizeNumber(15, 0, 10, 5)).toBe(10)
    })

    test('returns default for invalid input', () => {
      expect(sanitizeNumber('invalid', 0, 10, 5)).toBe(5)
      expect(sanitizeNumber(undefined, 0, 10, 5)).toBe(5)
      expect(sanitizeNumber(null, 0, 10, 5)).toBe(5)
    })
  })

  describe('sanitizeBoolean', () => {
    test('returns boolean for boolean input', () => {
      expect(sanitizeBoolean(true)).toBe(true)
      expect(sanitizeBoolean(false)).toBe(false)
    })

    test('parses string boolean values', () => {
      expect(sanitizeBoolean('true')).toBe(true)
      expect(sanitizeBoolean('false')).toBe(false)
    })

    test('returns default for invalid input', () => {
      expect(sanitizeBoolean('yes')).toBe(false)
      expect(sanitizeBoolean(1)).toBe(false)
      expect(sanitizeBoolean(null, true)).toBe(true)
    })
  })
})

describe('Constraint Validators', () => {
  describe('validateBedConstraints', () => {
    test('accepts valid bed dimensions', () => {
      const validBed = {
        size: { widthIn: 48, heightIn: 96 },
        bed: { heightIn: 12 }
      }
      expect(validateBedConstraints(validBed)).toHaveLength(0)
    })

    test('rejects excessive width', () => {
      const wideBed = {
        size: { widthIn: 60, heightIn: 96 },
        bed: { heightIn: 12 }
      }
      const errors = validateBedConstraints(wideBed)
      expect(errors).toContain('Bed width cannot exceed 4 feet for reachability')
    })

    test('rejects excessive length', () => {
      const longBed = {
        size: { widthIn: 48, heightIn: 700 },
        bed: { heightIn: 12 }
      }
      const errors = validateBedConstraints(longBed)
      expect(errors).toContain('Bed length cannot exceed 50 feet')
    })

    test('validates bed height constraints', () => {
      const shortBed = {
        size: { widthIn: 48, heightIn: 96 },
        bed: { heightIn: 4 }
      }
      const errors = validateBedConstraints(shortBed)
      expect(errors).toContain('Bed height must be at least 6 inches')

      const tallBed = {
        size: { widthIn: 48, heightIn: 96 },
        bed: { heightIn: 40 }
      }
      const errors2 = validateBedConstraints(tallBed)
      expect(errors2).toContain('Bed height cannot exceed 36 inches')
    })
  })

  describe('validatePathConstraints', () => {
    test('accepts valid path widths', () => {
      const normalPath = { path: { widthIn: 24 } }
      expect(validatePathConstraints(normalPath, false)).toHaveLength(0)

      const accessiblePath = { path: { widthIn: 36 } }
      expect(validatePathConstraints(accessiblePath, true)).toHaveLength(0)
    })

    test('enforces minimum path width', () => {
      const narrowPath = { path: { widthIn: 12 } }
      const errors = validatePathConstraints(narrowPath, false)
      expect(errors).toContain('Paths must be at least 18 inches wide')
    })

    test('enforces accessible path width', () => {
      const narrowAccessiblePath = { path: { widthIn: 24 } }
      const errors = validatePathConstraints(narrowAccessiblePath, true)
      expect(errors).toContain('Accessible paths must be at least 36 inches wide')
    })
  })

  describe('validateOverlap', () => {
    const bed1 = {
      id: '1',
      type: 'Bed',
      transform: { xIn: 0, yIn: 0 },
      size: { widthIn: 48, heightIn: 96 }
    }

    const bed2 = {
      id: '2',
      type: 'Bed',
      transform: { xIn: 100, yIn: 0 },
      size: { widthIn: 48, heightIn: 96 }
    }

    test('detects no overlap for distant beds', () => {
      expect(validateOverlap([bed1], bed2)).toBe(true)
    })

    test('detects overlap for overlapping beds', () => {
      const overlappingBed = {
        id: '3',
        type: 'Bed',
        transform: { xIn: 40, yIn: 40 },
        size: { widthIn: 48, heightIn: 96 }
      }
      expect(validateOverlap([bed1], overlappingBed)).toBe(false)
    })

    test('ignores same bed ID', () => {
      expect(validateOverlap([bed1], bed1)).toBe(true)
    })

    test('ignores non-bed nodes', () => {
      const path = {
        id: '4',
        type: 'Path',
        transform: { xIn: 0, yIn: 0 }
      }
      expect(validateOverlap([path], bed1)).toBe(true)
    })

    test('respects tolerance parameter', () => {
      const adjacentBed = {
        id: '5',
        type: 'Bed',
        transform: { xIn: 49, yIn: 0 },
        size: { widthIn: 48, heightIn: 96 }
      }
      expect(validateOverlap([bed1], adjacentBed, 0)).toBe(true)
      expect(validateOverlap([bed1], adjacentBed, 5)).toBe(false)
    })
  })
})