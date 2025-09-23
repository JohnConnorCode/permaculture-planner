/**
 * Centralized Theme Configuration for Permaculture Planner
 * Based on permaculture principles and nature-inspired aesthetics
 */

export const theme = {
  // Color Palette - Nature-inspired colors
  colors: {
    // Primary greens - representing growth and life
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      DEFAULT: '#16a34a', // Forest green
    },
    // Earth tones - representing soil and ground
    earth: {
      50: '#fef3e2',
      100: '#fde2c4',
      200: '#fbc89f',
      300: '#f8a05e',
      400: '#f57c36',
      500: '#ed5f00',
      600: '#d14400',
      700: '#a13400',
      800: '#7a2900',
      900: '#5a1f00',
      DEFAULT: '#8b4513', // Soil brown
    },
    // Water blues - representing water systems
    water: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      DEFAULT: '#2563eb', // Stream blue
    },
    // Sun yellows - representing energy and light
    sun: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      DEFAULT: '#f59e0b', // Sunlight yellow
    },
    // Sky colors - representing air and atmosphere
    sky: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      DEFAULT: '#0ea5e9', // Sky blue
    },
  },

  // Typography
  fonts: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Consolas, monospace',
  },

  // Spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },

  // Border radius - organic, rounded shapes
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Shadows - soft, natural shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    nature: '0 4px 14px 0 rgba(34, 197, 94, 0.15)', // Green shadow
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slower: '500ms ease-in-out',
  },

  // Animation presets
  animations: {
    fadeIn: 'fadeIn 0.5s ease-out forwards',
    scaleIn: 'scaleIn 0.4s ease-out forwards',
    slideInLeft: 'slideInLeft 0.4s ease-out forwards',
    slideInRight: 'slideInRight 0.4s ease-out forwards',
    float: 'float 3s ease-in-out infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  // Gradients - nature-inspired gradients
  gradients: {
    forest: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    earth: 'linear-gradient(135deg, #8b4513 0%, #5a1f00 100%)',
    sky: 'linear-gradient(180deg, #38bdf8 0%, #e0f2fe 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
    water: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
    growth: 'linear-gradient(135deg, #84cc16 0%, #22c55e 50%, #16a34a 100%)',
    soil: 'linear-gradient(180deg, #8b4513 0%, #5a1f00 100%)',
  },

  // Patterns - SVG patterns for backgrounds
  patterns: {
    leaves: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z' fill='%2322c55e' fill-opacity='0.03'/%3E%3C/svg%3E")`,
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%2316a34a' fill-opacity='0.05'/%3E%3C/svg%3E")`,
    waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10c5-5 10-5 15 0s10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0' stroke='%232563eb' stroke-opacity='0.1' fill='none'/%3E%3C/svg%3E")`,
  },

  // Component styles
  components: {
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-250',
      secondary: 'bg-green-100 hover:bg-green-200 text-green-800 font-medium transition-all duration-250',
      outline: 'border-2 border-green-600 text-green-700 hover:bg-green-50 font-medium transition-all duration-250',
      ghost: 'text-green-700 hover:bg-green-50 font-medium transition-all duration-250',
      earth: 'bg-gradient-to-r from-earth-600 to-earth-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-250',
    },
    card: {
      base: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-250 border border-green-100',
      elevated: 'bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-250',
      nature: 'bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-250 border border-green-200',
    },
    input: {
      base: 'border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-250',
      error: 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },
}

// Helper functions for consistent styling
export const getButtonClass = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'earth' = 'primary') => {
  return theme.components.button[variant]
}

export const getCardClass = (variant: 'base' | 'elevated' | 'nature' = 'base') => {
  return theme.components.card[variant]
}

export const getInputClass = (error: boolean = false) => {
  return error ? theme.components.input.error : theme.components.input.base
}

// CSS variables for global use
export const getCSSVariables = () => {
  return `
    :root {
      --color-primary: ${theme.colors.primary.DEFAULT};
      --color-earth: ${theme.colors.earth.DEFAULT};
      --color-water: ${theme.colors.water.DEFAULT};
      --color-sun: ${theme.colors.sun.DEFAULT};
      --color-sky: ${theme.colors.sky.DEFAULT};

      --gradient-forest: ${theme.gradients.forest};
      --gradient-earth: ${theme.gradients.earth};
      --gradient-sky: ${theme.gradients.sky};
      --gradient-growth: ${theme.gradients.growth};

      --shadow-nature: ${theme.shadows.nature};
      --radius-lg: ${theme.radius.lg};
      --transition-base: ${theme.transitions.base};
    }
  `
}