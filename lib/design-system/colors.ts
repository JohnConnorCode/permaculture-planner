/**
 * Design System - Semantic Color Palette
 *
 * Professional color system with semantic meaning
 * Consistent across all panels and features
 */

/**
 * Panel Color System
 * Each panel has a distinct color for brand recognition
 */
export const PanelColors = {
  // Core editing
  properties: {
    primary: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30',
    border: 'border-gray-200 dark:border-gray-800',
    icon: 'text-gray-600',
  },

  // Permaculture zones
  zones: {
    primary: 'text-red-700 dark:text-red-300',
    bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600',
  },

  // Companion planting
  companions: {
    primary: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
    border: 'border-pink-200 dark:border-pink-800',
    icon: 'text-pink-600',
  },

  // Timeline/Calendar
  timeline: {
    primary: 'text-green-700 dark:text-green-300',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600',
  },

  // Materials
  materials: {
    primary: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600',
  },

  // Tasks
  tasks: {
    primary: 'text-cyan-700 dark:text-cyan-300',
    bg: 'bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30',
    border: 'border-cyan-200 dark:border-cyan-800',
    icon: 'text-cyan-600',
  },

  // Sun analysis
  sun: {
    primary: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600',
  },

  // Sector analysis
  sectors: {
    primary: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600',
  },

  // Permaculture principles
  permaculture: {
    primary: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600',
  },

  // Analytics
  analytics: {
    primary: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600',
  },
} as const

/**
 * Permaculture Zone Colors
 */
export const ZoneColors = {
  0: {
    name: 'Zone 0 (Home)',
    color: 'bg-red-500',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-500',
    ring: 'ring-red-500',
    light: 'bg-red-100 dark:bg-red-900/30',
  },
  1: {
    name: 'Zone 1 (Daily)',
    color: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-500',
    ring: 'ring-orange-500',
    light: 'bg-orange-100 dark:bg-orange-900/30',
  },
  2: {
    name: 'Zone 2 (Often)',
    color: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-500',
    ring: 'ring-yellow-500',
    light: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  3: {
    name: 'Zone 3 (Weekly)',
    color: 'bg-green-500',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-500',
    ring: 'ring-green-500',
    light: 'bg-green-100 dark:bg-green-900/30',
  },
  4: {
    name: 'Zone 4 (Monthly)',
    color: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500',
    ring: 'ring-blue-500',
    light: 'bg-blue-100 dark:bg-blue-900/30',
  },
  5: {
    name: 'Zone 5 (Wild)',
    color: 'bg-purple-500',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500',
    ring: 'ring-purple-500',
    light: 'bg-purple-100 dark:bg-purple-900/30',
  },
} as const

/**
 * Status Colors
 */
export const StatusColors = {
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600',
  },
  warning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600',
  },
  error: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600',
  },
  neutral: {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-800',
    icon: 'text-gray-600',
  },
} as const

/**
 * Element Category Colors
 */
export const ElementColors = {
  // Water features
  water: {
    bg: 'bg-blue-500',
    text: 'text-blue-700 dark:text-blue-300',
    light: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-500',
  },
  // Structures
  structure: {
    bg: 'bg-gray-500',
    text: 'text-gray-700 dark:text-gray-300',
    light: 'bg-gray-100 dark:bg-gray-900/30',
    border: 'border-gray-500',
  },
  // Paths
  path: {
    bg: 'bg-stone-500',
    text: 'text-stone-700 dark:text-stone-300',
    light: 'bg-stone-100 dark:bg-stone-900/30',
    border: 'border-stone-500',
  },
  // Garden beds
  bed: {
    bg: 'bg-green-500',
    text: 'text-green-700 dark:text-green-300',
    light: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-500',
  },
  // Trees/orchards
  tree: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-700 dark:text-emerald-300',
    light: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-600',
  },
} as const

/**
 * Priority/Risk Level Colors
 */
export const PriorityColors = {
  critical: {
    bg: 'bg-red-500',
    text: 'text-red-900 dark:text-red-100',
    light: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-500',
  },
  high: {
    bg: 'bg-orange-500',
    text: 'text-orange-900 dark:text-orange-100',
    light: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-500',
  },
  medium: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-900 dark:text-yellow-100',
    light: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-500',
  },
  low: {
    bg: 'bg-green-500',
    text: 'text-green-900 dark:text-green-100',
    light: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-500',
  },
} as const

/**
 * Helper function to get panel colors
 */
export function getPanelColors(panel: keyof typeof PanelColors) {
  return PanelColors[panel]
}

/**
 * Helper function to get zone colors
 */
export function getZoneColors(zone: number) {
  return ZoneColors[zone as keyof typeof ZoneColors] || ZoneColors[1]
}

/**
 * Helper function to get status colors
 */
export function getStatusColors(status: keyof typeof StatusColors) {
  return StatusColors[status]
}
