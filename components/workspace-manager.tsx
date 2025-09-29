'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Monitor, Smartphone, Tablet, Layout, Grid3x3, Maximize2,
  Moon, Sun, Palette, Settings, ChevronRight, Check,
  Sparkles, Zap, Leaf, Flower
} from 'lucide-react'

interface Theme {
  id: string
  name: string
  icon: React.ComponentType<any>
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  description: string
}

interface WorkspacePreset {
  id: string
  name: string
  icon: React.ComponentType<any>
  layout: {
    sidebar: 'left' | 'right' | 'hidden'
    toolbar: 'top' | 'bottom' | 'floating'
    panels: string[]
  }
  description: string
}

const themes: Theme[] = [
  {
    id: 'garden-light',
    name: 'Garden Light',
    icon: Sun,
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: '#ffffff',
      foreground: '#0f172a'
    },
    description: 'Fresh and vibrant garden theme'
  },
  {
    id: 'garden-dark',
    name: 'Garden Dark',
    icon: Moon,
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: '#0f172a',
      foreground: '#f1f5f9'
    },
    description: 'Dark mode for evening planning'
  },
  {
    id: 'earth-tones',
    name: 'Earth Tones',
    icon: Leaf,
    colors: {
      primary: '#92400e',
      secondary: '#78350f',
      accent: '#a16207',
      background: '#fef3c7',
      foreground: '#451a03'
    },
    description: 'Warm, natural earth colors'
  },
  {
    id: 'botanical',
    name: 'Botanical',
    icon: Flower,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#f472b6',
      background: '#ecfdf5',
      foreground: '#064e3b'
    },
    description: 'Inspired by botanical illustrations'
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Sparkles,
    colors: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#8b5cf6',
      background: '#f8fafc',
      foreground: '#1e293b'
    },
    description: 'Clean and professional'
  }
]

const workspacePresets: WorkspacePreset[] = [
  {
    id: 'designer',
    name: 'Designer',
    icon: Layout,
    layout: {
      sidebar: 'left',
      toolbar: 'top',
      panels: ['tools', 'plants', 'properties']
    },
    description: 'Optimized for garden design'
  },
  {
    id: 'planner',
    name: 'Planner',
    icon: Grid3x3,
    layout: {
      sidebar: 'right',
      toolbar: 'top',
      panels: ['calendar', 'tasks', 'notes']
    },
    description: 'Focus on planning and scheduling'
  },
  {
    id: 'analyzer',
    name: 'Analyzer',
    icon: Zap,
    layout: {
      sidebar: 'left',
      toolbar: 'bottom',
      panels: ['stats', 'charts', 'reports']
    },
    description: 'Data analysis and insights'
  },
  {
    id: 'presenter',
    name: 'Presenter',
    icon: Monitor,
    layout: {
      sidebar: 'hidden',
      toolbar: 'floating',
      panels: ['canvas']
    },
    description: 'Clean view for presentations'
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: Smartphone,
    layout: {
      sidebar: 'hidden',
      toolbar: 'bottom',
      panels: ['canvas', 'quick-tools']
    },
    description: 'Optimized for touch devices'
  }
]

interface WorkspaceManagerProps {
  currentTheme?: string
  currentPreset?: string
  onThemeChange?: (theme: Theme) => void
  onPresetChange?: (preset: WorkspacePreset) => void
  className?: string
}

export function WorkspaceManager({
  currentTheme = 'garden-light',
  currentPreset = 'designer',
  onThemeChange,
  onPresetChange,
  className
}: WorkspaceManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'themes' | 'presets'>('themes')
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [selectedPreset, setSelectedPreset] = useState(currentPreset)
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme.id)
    onThemeChange?.(theme)
    applyTheme(theme)
  }

  const handlePresetSelect = (preset: WorkspacePreset) => {
    setSelectedPreset(preset.id)
    onPresetChange?.(preset)
  }

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
  }

  return (
    <>
      {/* Workspace Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={cn('gap-2', className)}
      >
        <Palette className="h-4 w-4" />
        Workspace
      </Button>

      {/* Workspace Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Workspace Manager</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Customize your workspace with themes and layouts
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="rounded-full"
              >
                ×
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('themes')}
                className={cn(
                  'flex-1 py-3 px-6 text-sm font-medium transition-colors',
                  activeTab === 'themes'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Themes
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={cn(
                  'flex-1 py-3 px-6 text-sm font-medium transition-colors',
                  activeTab === 'presets'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Layout Presets
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              {activeTab === 'themes' ? (
                <div className="space-y-6">
                  {/* Theme Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeSelect(theme)}
                        className={cn(
                          'relative p-4 rounded-xl border-2 transition-all',
                          'hover:scale-105 hover:shadow-lg',
                          selectedTheme === theme.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {/* Selected indicator */}
                        {selectedTheme === theme.id && (
                          <div className="absolute top-2 right-2">
                            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Theme Preview */}
                        <div className="space-y-3">
                          <theme.icon className="h-8 w-8 mx-auto" style={{ color: theme.colors.primary }} />
                          <h3 className="font-semibold">{theme.name}</h3>
                          <p className="text-xs text-gray-600">{theme.description}</p>

                          {/* Color swatches */}
                          <div className="flex gap-1 justify-center">
                            {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="h-6 w-6 rounded border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Live Preview */}
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold mb-3">Live Preview</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg p-6" style={{
                          borderColor: themes.find(t => t.id === selectedTheme)?.colors.primary
                        }}>
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className="h-12 w-12 rounded-lg"
                              style={{
                                backgroundColor: themes.find(t => t.id === selectedTheme)?.colors.primary
                              }}
                            />
                            <div>
                              <h4 className="font-semibold">Garden Bed</h4>
                              <p className="text-sm text-gray-600">3 × 6 feet</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {['🍅', '🥬', '🥕'].map((emoji, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg text-center"
                                style={{
                                  backgroundColor: themes.find(t => t.id === selectedTheme)?.colors.accent + '20'
                                }}
                              >
                                <div className="text-2xl mb-1">{emoji}</div>
                                <div className="text-xs">Plant {i + 1}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Device Preview Selector */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant={devicePreview === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDevicePreview('desktop')}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Desktop
                    </Button>
                    <Button
                      variant={devicePreview === 'tablet' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDevicePreview('tablet')}
                    >
                      <Tablet className="h-4 w-4 mr-2" />
                      Tablet
                    </Button>
                    <Button
                      variant={devicePreview === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDevicePreview('mobile')}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                  </div>

                  {/* Preset Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workspacePresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={cn(
                          'relative p-6 rounded-xl border-2 transition-all text-left',
                          'hover:scale-105 hover:shadow-lg',
                          selectedPreset === preset.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {selectedPreset === preset.id && (
                          <div className="absolute top-4 right-4">
                            <Check className="h-5 w-5 text-blue-600" />
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <preset.icon className="h-8 w-8 text-gray-600" />
                          <div>
                            <h3 className="font-semibold mb-1">{preset.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{preset.description}</p>

                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Sidebar:</span>
                                <span className="font-medium">{preset.layout.sidebar}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Toolbar:</span>
                                <span className="font-medium">{preset.layout.toolbar}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Panels:</span>
                                <span className="font-medium">{preset.layout.panels.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                }}
                className="gradient-understory"
              >
                Apply Changes
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}