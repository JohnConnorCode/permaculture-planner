/**
 * Shared UI constants for consistency across the application
 */

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Consistent spacing values
export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
} as const

// Animation durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

// Z-index layers
export const Z_INDEX = {
  dropdown: 50,
  modal: 100,
  popover: 200,
  tooltip: 300,
  notification: 400,
} as const

// Common button styles
export const BUTTON_VARIANTS = {
  primary: 'bg-green-600 hover:bg-green-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-gray-100 text-gray-700',
} as const

// Tool categories with consistent colors
export const TOOL_CATEGORIES = {
  drawing: { color: '#22c55e', label: 'Drawing Tools' },
  selection: { color: '#3b82f6', label: 'Selection Tools' },
  planting: { color: '#84cc16', label: 'Planting Tools' },
  elements: { color: '#f59e0b', label: 'Garden Elements' },
  analysis: { color: '#8b5cf6', label: 'Analysis Tools' },
} as const

// Responsive grid configurations
export const GRID_CONFIGS = {
  mobile: 'grid-cols-2',
  tablet: 'sm:grid-cols-3 md:grid-cols-4',
  desktop: 'lg:grid-cols-5 xl:grid-cols-6',
} as const

// Common error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  auth: 'Please sign in to continue.',
  validation: 'Please check your input and try again.',
  notFound: 'The requested resource was not found.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  saved: 'Your changes have been saved.',
  created: 'Successfully created.',
  deleted: 'Successfully deleted.',
  updated: 'Successfully updated.',
} as const

// Accessibility labels
export const ARIA_LABELS = {
  close: 'Close',
  menu: 'Menu',
  navigation: 'Main navigation',
  search: 'Search',
  loading: 'Loading...',
  expand: 'Expand',
  collapse: 'Collapse',
} as const