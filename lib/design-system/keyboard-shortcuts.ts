/**
 * Keyboard Shortcuts System
 *
 * Professional keyboard navigation and shortcuts
 * Makes the app feel fast and efficient
 */

export interface KeyboardShortcut {
  key: string
  label: string
  description: string
  action: () => void
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[]
  category: 'navigation' | 'editing' | 'view' | 'general'
}

/**
 * Keyboard shortcut groups
 */
export const ShortcutCategories = {
  navigation: 'Navigation',
  editing: 'Editing',
  view: 'View',
  general: 'General',
} as const

/**
 * Default keyboard shortcuts
 */
export const DefaultShortcuts = {
  // General
  save: {
    key: 's',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘S / Ctrl+S',
    description: 'Save plan',
    category: 'general' as const,
  },
  undo: {
    key: 'z',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘Z / Ctrl+Z',
    description: 'Undo',
    category: 'editing' as const,
  },
  redo: {
    key: 'y',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘Y / Ctrl+Y',
    description: 'Redo',
    category: 'editing' as const,
  },

  // View toggles
  toggleLeftPanel: {
    key: '[',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘[ / Ctrl+[',
    description: 'Toggle left panel',
    category: 'view' as const,
  },
  toggleRightPanel: {
    key: ']',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘] / Ctrl+]',
    description: 'Toggle right panel',
    category: 'view' as const,
  },

  // Cancel actions
  escape: {
    key: 'Escape',
    modifiers: [] as const,
    label: 'ESC',
    description: 'Cancel current action',
    category: 'general' as const,
  },

  // Panel navigation (Cmd+1-9)
  panelProperties: {
    key: '1',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘1 / Ctrl+1',
    description: 'Open Properties',
    category: 'navigation' as const,
  },
  panelZones: {
    key: '2',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘2 / Ctrl+2',
    description: 'Open Zones',
    category: 'navigation' as const,
  },
  panelCompanions: {
    key: '3',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘3 / Ctrl+3',
    description: 'Open Companions',
    category: 'navigation' as const,
  },
  panelTimeline: {
    key: '4',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘4 / Ctrl+4',
    description: 'Open Timeline',
    category: 'navigation' as const,
  },
  panelMaterials: {
    key: '5',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘5 / Ctrl+5',
    description: 'Open Materials',
    category: 'navigation' as const,
  },
  panelTasks: {
    key: '6',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘6 / Ctrl+6',
    description: 'Open Tasks',
    category: 'navigation' as const,
  },
  panelSun: {
    key: '7',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘7 / Ctrl+7',
    description: 'Open Sun Analysis',
    category: 'navigation' as const,
  },
  panelSectors: {
    key: '8',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘8 / Ctrl+8',
    description: 'Open Sectors',
    category: 'navigation' as const,
  },
  panelPermaculture: {
    key: '9',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘9 / Ctrl+9',
    description: 'Open Permaculture',
    category: 'navigation' as const,
  },
  panelAnalytics: {
    key: '0',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘0 / Ctrl+0',
    description: 'Open Analytics',
    category: 'navigation' as const,
  },

  // Tool selection
  selectTool: {
    key: 'v',
    modifiers: [] as const,
    label: 'V',
    description: 'Select tool',
    category: 'editing' as const,
  },
  bedTool: {
    key: 'b',
    modifiers: [] as const,
    label: 'B',
    description: 'Bed tool',
    category: 'editing' as const,
  },
  plantTool: {
    key: 'p',
    modifiers: [] as const,
    label: 'P',
    description: 'Plant tool',
    category: 'editing' as const,
  },

  // View controls
  zoomIn: {
    key: '+',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘+ / Ctrl++',
    description: 'Zoom in',
    category: 'view' as const,
  },
  zoomOut: {
    key: '-',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘- / Ctrl+-',
    description: 'Zoom out',
    category: 'view' as const,
  },
  zoomFit: {
    key: '0',
    modifiers: ['meta', 'ctrl'] as const,
    label: '⌘0 / Ctrl+0',
    description: 'Fit to screen',
    category: 'view' as const,
  },

  // Help
  helpDialog: {
    key: '?',
    modifiers: ['shift'] as const,
    label: '?',
    description: 'Show keyboard shortcuts',
    category: 'general' as const,
  },
} as const

/**
 * Check if keyboard event matches shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: typeof DefaultShortcuts[keyof typeof DefaultShortcuts]
): boolean {
  // Check key match
  if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) {
    return false
  }

  // Check modifiers
  const hasCtrl = shortcut.modifiers?.includes('ctrl') || shortcut.modifiers?.includes('meta')
  const hasShift = shortcut.modifiers?.includes('shift')
  const hasAlt = shortcut.modifiers?.includes('alt')

  // On Mac, use metaKey; on Windows/Linux, use ctrlKey
  const ctrlPressed = event.metaKey || event.ctrlKey

  if (hasCtrl && !ctrlPressed) return false
  if (!hasCtrl && ctrlPressed) return false
  if (hasShift && !event.shiftKey) return false
  if (!hasShift && event.shiftKey) return false
  if (hasAlt && !event.altKey) return false
  if (!hasAlt && event.altKey) return false

  return true
}

/**
 * Format shortcut for display
 */
export function formatShortcut(
  shortcut: typeof DefaultShortcuts[keyof typeof DefaultShortcuts]
): string {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC')

  const modifiers: string[] = []
  if (shortcut.modifiers?.includes('meta') || shortcut.modifiers?.includes('ctrl')) {
    modifiers.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.modifiers?.includes('shift')) {
    modifiers.push(isMac ? '⇧' : 'Shift')
  }
  if (shortcut.modifiers?.includes('alt')) {
    modifiers.push(isMac ? '⌥' : 'Alt')
  }

  const key = shortcut.key.toUpperCase()
  return [...modifiers, key].join(isMac ? '' : '+')
}

/**
 * Get all shortcuts grouped by category
 */
export function getShortcutsByCategory() {
  const grouped: Record<string, typeof DefaultShortcuts[keyof typeof DefaultShortcuts][]> = {
    general: [],
    navigation: [],
    editing: [],
    view: [],
  }

  Object.values(DefaultShortcuts).forEach((shortcut) => {
    grouped[shortcut.category].push(shortcut)
  })

  return grouped
}

/**
 * Keyboard shortcut hook for React components
 */
export function createKeyboardShortcutHandler(
  shortcuts: Record<string, () => void>
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Cmd+S even in inputs
      if (!(event.key === 's' && (event.metaKey || event.ctrlKey))) {
        return
      }
    }

    Object.entries(shortcuts).forEach(([shortcutKey, action]) => {
      const shortcut = DefaultShortcuts[shortcutKey as keyof typeof DefaultShortcuts]
      if (shortcut && matchesShortcut(event, shortcut)) {
        event.preventDefault()
        action()
      }
    })
  }
}
