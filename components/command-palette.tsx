'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import {
  Search,
  Plus,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Copy,
  Clipboard,
  Layers,
  Grid3x3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Settings,
  HelpCircle,
  Keyboard,
  Palette,
  Sparkles
} from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  shortcut?: string
  icon: React.ComponentType<any>
  action: () => void
  group: string
}

interface CommandPaletteProps {
  onAction?: (actionId: string) => void
  commands?: CommandItem[]
}

export function CommandPalette({ onAction, commands = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Default commands if none provided
  const defaultCommands: CommandItem[] = [
    {
      id: 'new-bed',
      label: 'Create New Bed',
      shortcut: 'N',
      icon: Plus,
      action: () => onAction?.('new-bed'),
      group: 'Create'
    },
    {
      id: 'save-design',
      label: 'Save Design',
      shortcut: '⌘S',
      icon: Save,
      action: () => onAction?.('save'),
      group: 'File'
    },
    {
      id: 'export-design',
      label: 'Export Design',
      shortcut: '⌘E',
      icon: Download,
      action: () => onAction?.('export'),
      group: 'File'
    },
    {
      id: 'import-design',
      label: 'Import Design',
      shortcut: '⌘I',
      icon: Upload,
      action: () => onAction?.('import'),
      group: 'File'
    },
    {
      id: 'undo',
      label: 'Undo',
      shortcut: '⌘Z',
      icon: Undo,
      action: () => onAction?.('undo'),
      group: 'Edit'
    },
    {
      id: 'redo',
      label: 'Redo',
      shortcut: '⌘⇧Z',
      icon: Redo,
      action: () => onAction?.('redo'),
      group: 'Edit'
    },
    {
      id: 'copy',
      label: 'Copy',
      shortcut: '⌘C',
      icon: Copy,
      action: () => onAction?.('copy'),
      group: 'Edit'
    },
    {
      id: 'paste',
      label: 'Paste',
      shortcut: '⌘V',
      icon: Clipboard,
      action: () => onAction?.('paste'),
      group: 'Edit'
    },
    {
      id: 'toggle-layers',
      label: 'Toggle Layers',
      shortcut: 'L',
      icon: Layers,
      action: () => onAction?.('toggle-layers'),
      group: 'View'
    },
    {
      id: 'toggle-grid',
      label: 'Toggle Grid',
      shortcut: 'G',
      icon: Grid3x3,
      action: () => onAction?.('toggle-grid'),
      group: 'View'
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      shortcut: '⌘+',
      icon: ZoomIn,
      action: () => onAction?.('zoom-in'),
      group: 'View'
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      shortcut: '⌘-',
      icon: ZoomOut,
      action: () => onAction?.('zoom-out'),
      group: 'View'
    },
    {
      id: 'fit-to-screen',
      label: 'Fit to Screen',
      shortcut: '⌘0',
      icon: Maximize2,
      action: () => onAction?.('fit-to-screen'),
      group: 'View'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      shortcut: '⌘,',
      icon: Settings,
      action: () => onAction?.('preferences'),
      group: 'Settings'
    },
    {
      id: 'help',
      label: 'Help & Documentation',
      shortcut: '?',
      icon: HelpCircle,
      action: () => onAction?.('help'),
      group: 'Help'
    },
    {
      id: 'shortcuts',
      label: 'Keyboard Shortcuts',
      shortcut: '⌘/',
      icon: Keyboard,
      action: () => onAction?.('shortcuts'),
      group: 'Help'
    }
  ]

  const allCommands = [...defaultCommands, ...commands]

  // Group commands
  const groupedCommands = allCommands.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }

      // ESC to close
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = useCallback((value: string) => {
    const command = allCommands.find(cmd => cmd.id === value)
    if (command) {
      command.action()
      setOpen(false)
      setSearch('')
    }
  }, [allCommands])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in">
        <Command className="relative">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 px-4">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 py-3 text-sm outline-none placeholder:text-gray-400"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>

          {/* Command List */}
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No commands found.
            </Command.Empty>

            {Object.entries(groupedCommands).map(([group, items]) => (
              <Command.Group key={group} heading={group} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group}
                </div>
                {items.map((command) => (
                  <Command.Item
                    key={command.id}
                    value={command.id}
                    onSelect={handleSelect}
                    className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-white transition-colors">
                        <command.icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{command.label}</span>
                    </div>
                    {command.shortcut && (
                      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                        {command.shortcut}
                      </kbd>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              <span>Pro tip: Use arrow keys to navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  )
}