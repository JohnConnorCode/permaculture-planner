'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Copy, Clipboard, Trash2, Edit, Layers, Lock, Unlock,
  Eye, EyeOff, Maximize2, Minimize2, RotateCw, FlipHorizontal,
  FlipVertical, Palette, Settings, Info, Undo, Redo,
  ChevronRight, Download, Upload, Share2
} from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon?: React.ComponentType<any>
  shortcut?: string
  action?: () => void
  separator?: boolean
  disabled?: boolean
  submenu?: MenuItem[]
}

interface ContextMenuProps {
  items: MenuItem[]
  onClose?: () => void
  className?: string
}

export function ContextMenu({ items, onClose, className }: ContextMenuProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()

      const x = e.clientX
      const y = e.clientY

      // Adjust position to prevent menu from going off screen
      const menuWidth = 200
      const menuHeight = items.length * 40

      const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x
      const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y

      setPosition({ x: adjustedX, y: adjustedY })
      setIsOpen(true)
    }

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [items])

  const handleClose = () => {
    setIsOpen(false)
    setActiveSubmenu(null)
    onClose?.()
  }

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled && !item.submenu) {
      item.action?.()
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Main Menu */}
      <div
        ref={menuRef}
        className={cn(
          'fixed z-50 min-w-[200px] bg-white rounded-lg shadow-2xl border border-gray-200',
          'py-1 animate-scale-in origin-top-left',
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        {items.map((item, index) => (
          <div key={item.id || index}>
            {item.separator ? (
              <div className="my-1 border-t border-gray-200" />
            ) : (
              <div
                className={cn(
                  'relative flex items-center px-3 py-2 text-sm cursor-pointer',
                  'hover:bg-gray-100 transition-colors',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.id)}
                onMouseLeave={() => item.submenu && setActiveSubmenu(null)}
              >
                {item.icon && (
                  <item.icon className="h-4 w-4 mr-3 text-gray-600" />
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="ml-4 text-xs text-gray-400">{item.shortcut}</span>
                )}
                {item.submenu && (
                  <ChevronRight className="h-3 w-3 ml-2 text-gray-400" />
                )}

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.id && (
                  <div
                    className={cn(
                      'absolute left-full top-0 ml-1 min-w-[180px]',
                      'bg-white rounded-lg shadow-2xl border border-gray-200 py-1'
                    )}
                  >
                    {item.submenu.map((subitem, subindex) => (
                      <div
                        key={subitem.id || subindex}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm cursor-pointer',
                          'hover:bg-gray-100 transition-colors',
                          subitem.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                        onClick={() => handleItemClick(subitem)}
                      >
                        {subitem.icon && (
                          <subitem.icon className="h-4 w-4 mr-3 text-gray-600" />
                        )}
                        <span className="flex-1">{subitem.label}</span>
                        {subitem.shortcut && (
                          <span className="ml-4 text-xs text-gray-400">{subitem.shortcut}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// Default context menu items for garden designer
export const gardenContextMenuItems: MenuItem[] = [
  {
    id: 'undo',
    label: 'Undo',
    icon: Undo,
    shortcut: '⌘Z',
    action: () => console.log('Undo')
  },
  {
    id: 'redo',
    label: 'Redo',
    icon: Redo,
    shortcut: '⌘⇧Z',
    action: () => console.log('Redo')
  },
  { separator: true },
  {
    id: 'copy',
    label: 'Copy',
    icon: Copy,
    shortcut: '⌘C',
    action: () => console.log('Copy')
  },
  {
    id: 'paste',
    label: 'Paste',
    icon: Clipboard,
    shortcut: '⌘V',
    action: () => console.log('Paste')
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    shortcut: 'Del',
    action: () => console.log('Delete')
  },
  { separator: true },
  {
    id: 'transform',
    label: 'Transform',
    icon: Maximize2,
    submenu: [
      {
        id: 'rotate',
        label: 'Rotate 90°',
        icon: RotateCw,
        action: () => console.log('Rotate')
      },
      {
        id: 'flip-h',
        label: 'Flip Horizontal',
        icon: FlipHorizontal,
        action: () => console.log('Flip H')
      },
      {
        id: 'flip-v',
        label: 'Flip Vertical',
        icon: FlipVertical,
        action: () => console.log('Flip V')
      }
    ]
  },
  {
    id: 'layer',
    label: 'Layer',
    icon: Layers,
    submenu: [
      {
        id: 'bring-front',
        label: 'Bring to Front',
        shortcut: '⌘]',
        action: () => console.log('Bring to Front')
      },
      {
        id: 'send-back',
        label: 'Send to Back',
        shortcut: '⌘[',
        action: () => console.log('Send to Back')
      },
      { separator: true },
      {
        id: 'lock',
        label: 'Lock Layer',
        icon: Lock,
        action: () => console.log('Lock')
      },
      {
        id: 'hide',
        label: 'Hide Layer',
        icon: EyeOff,
        action: () => console.log('Hide')
      }
    ]
  },
  { separator: true },
  {
    id: 'export',
    label: 'Export As...',
    icon: Download,
    submenu: [
      {
        id: 'export-png',
        label: 'PNG Image',
        action: () => console.log('Export PNG')
      },
      {
        id: 'export-svg',
        label: 'SVG Vector',
        action: () => console.log('Export SVG')
      },
      {
        id: 'export-pdf',
        label: 'PDF Document',
        action: () => console.log('Export PDF')
      }
    ]
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share2,
    action: () => console.log('Share')
  },
  { separator: true },
  {
    id: 'properties',
    label: 'Properties',
    icon: Settings,
    shortcut: '⌘I',
    action: () => console.log('Properties')
  }
]