'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Trash2,
  BookOpen,
  FileJson,
  Bot,
  HelpCircle
} from 'lucide-react'

interface MobileMenuProps {
  onSave: () => void
  onExport: () => void
  onImport: () => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onTemplates: () => void
  onHelp: () => void
  onAI: () => void
  canUndo: boolean
  canRedo: boolean
  showAI: boolean
  className?: string
}

export function MobileMenu({
  onSave,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onClear,
  onTemplates,
  onHelp,
  onAI,
  canUndo,
  canRedo,
  showAI,
  className
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className={cn("md:hidden", className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-16 right-4 w-72 bg-white rounded-xl shadow-2xl p-4 animate-slide-in-right">
            <div className="space-y-2">
              {/* Undo/Redo */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { onUndo(); setIsOpen(false) }}
                  disabled={!canUndo}
                >
                  <Undo className="h-4 w-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { onRedo(); setIsOpen(false) }}
                  disabled={!canRedo}
                >
                  <Redo className="h-4 w-4 mr-2" />
                  Redo
                </Button>
              </div>

              {/* Main Actions */}
              <Button
                className="w-full gradient-understory"
                onClick={() => { onSave(); setIsOpen(false) }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Design
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => { onTemplates(); setIsOpen(false) }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Templates
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => { onExport(); setIsOpen(false) }}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export JSON
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => { onImport(); setIsOpen(false) }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => { onClear(); setIsOpen(false) }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Garden
              </Button>

              <Button
                variant="outline"
                className={cn(
                  "w-full border-purple-500 text-purple-600",
                  showAI && "bg-purple-50"
                )}
                onClick={() => { onAI(); setIsOpen(false) }}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600"
                onClick={() => { onHelp(); setIsOpen(false) }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Tutorial
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}