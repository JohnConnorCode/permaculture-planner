/**
 * Design System - Spacing & Layout
 *
 * Consistent spacing, typography, and layout patterns
 */

/**
 * Panel Layout Constants
 */
export const PanelLayout = {
  // Panel widths
  sidePanel: 'w-80', // 320px - comfortable reading width
  sidePanelCollapsed: 'w-0',

  // Header heights
  headerHeight: 'h-14', // 56px
  panelHeaderHeight: 'h-auto',

  // Paddings
  panelPadding: 'p-4',
  panelPaddingX: 'px-4',
  panelPaddingY: 'py-4',
  cardPadding: 'p-6',
  cardPaddingSm: 'p-4',

  // Gaps
  sectionGap: 'space-y-4',
  cardGap: 'space-y-3',
  itemGap: 'space-y-2',
  inlineGap: 'gap-2',

  // Borders
  panelBorder: 'border-b',
  cardBorder: 'border',
  divider: 'border-t',
} as const

/**
 * Typography Scale
 */
export const Typography = {
  // Headings
  h1: 'text-2xl font-bold tracking-tight',
  h2: 'text-xl font-semibold tracking-tight',
  h3: 'text-lg font-semibold',
  h4: 'text-base font-semibold',
  h5: 'text-sm font-semibold',
  h6: 'text-xs font-semibold uppercase tracking-wide',

  // Body text
  body: 'text-sm',
  bodyLarge: 'text-base',
  bodySmall: 'text-xs',

  // Special text
  label: 'text-sm font-medium',
  caption: 'text-xs text-muted-foreground',
  code: 'font-mono text-xs',

  // Emphasis
  muted: 'text-muted-foreground',
  emphasis: 'font-semibold',
  link: 'text-primary hover:underline',
} as const

/**
 * Interactive Element Sizes
 */
export const InteractiveSizes = {
  // Buttons
  buttonSm: 'h-8 px-3 text-xs',
  buttonMd: 'h-10 px-4 text-sm',
  buttonLg: 'h-12 px-6 text-base',

  // Icons
  iconXs: 'h-3 w-3',
  iconSm: 'h-4 w-4',
  iconMd: 'h-5 w-5',
  iconLg: 'h-6 w-6',
  iconXl: 'h-8 w-8',

  // Badges
  badgeSm: 'h-4 px-1 text-[10px]',
  badgeMd: 'h-5 px-2 text-xs',
  badgeLg: 'h-6 px-3 text-sm',

  // Inputs
  inputSm: 'h-8 text-xs',
  inputMd: 'h-10 text-sm',
  inputLg: 'h-12 text-base',
} as const

/**
 * Responsive Breakpoints (matches Tailwind defaults)
 */
export const Breakpoints = {
  sm: '640px',   // Mobile landscape, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops, small desktops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const

/**
 * Panel Responsive Behavior
 */
export const ResponsivePanels = {
  // Mobile: Stack panels vertically, show one at a time
  mobile: {
    leftPanel: 'fixed inset-0 z-50 transform transition-transform',
    rightPanel: 'fixed inset-0 z-50 transform transition-transform',
    canvas: 'h-[60vh]',
  },

  // Tablet: Side-by-side with collapsible panels
  tablet: {
    leftPanel: 'w-64',
    rightPanel: 'w-64',
    canvas: 'flex-1',
  },

  // Desktop: Full layout
  desktop: {
    leftPanel: 'w-80',
    rightPanel: 'w-80',
    canvas: 'flex-1',
  },
} as const

/**
 * Animation Timing
 */
export const Animations = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',

  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Common combinations
  panelSlide: 'transition-all duration-300 ease-in-out',
  fadeIn: 'transition-opacity duration-200 ease-in',
  scaleIn: 'transition-transform duration-200 ease-out',
} as const

/**
 * Z-Index Layers
 */
export const ZIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  overlay: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  toast: 'z-60',
  tooltip: 'z-70',
} as const

/**
 * Card Variants
 */
export const CardVariants = {
  default: 'bg-card border shadow-sm',
  elevated: 'bg-card border shadow-md',
  flat: 'bg-card/50 border-dashed',
  ghost: 'border-transparent',

  // Status cards
  success: 'bg-green-50 dark:bg-green-950/20 border-green-200',
  warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200',
  error: 'bg-red-50 dark:bg-red-950/20 border-red-200',
  info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200',
} as const

/**
 * Helper: Build responsive class string
 */
export function responsive(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile]
  if (tablet) classes.push(`md:${tablet}`)
  if (desktop) classes.push(`lg:${desktop}`)
  return classes.join(' ')
}

/**
 * Helper: Panel header with consistent styling
 */
export function panelHeader(title: string, subtitle?: string) {
  return {
    title: `${Typography.h2}`,
    subtitle: subtitle ? `${Typography.caption}` : undefined,
    container: `${PanelLayout.panelPadding} ${PanelLayout.panelBorder}`,
  }
}

/**
 * Helper: Consistent card spacing
 */
export function cardSpacing(size: 'sm' | 'md' | 'lg' = 'md') {
  const spacing = {
    sm: PanelLayout.cardPaddingSm,
    md: PanelLayout.cardPadding,
    lg: 'p-8',
  }
  return spacing[size]
}
