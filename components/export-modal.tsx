'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  X, Download, FileImage, FileJson, FileText, Share2,
  Loader2, CheckCircle, Copy, Mail, MessageSquare
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  canvasRef?: React.RefObject<HTMLElement>
  gardenData?: any
  className?: string
}

export function ExportModal({
  isOpen,
  onClose,
  canvasRef,
  gardenData,
  className
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf' | 'json'>('png')
  const [quality, setQuality] = useState([90])
  const [includeGrid, setIncludeGrid] = useState(true)
  const [includeLabels, setIncludeLabels] = useState(true)
  const [includePlants, setIncludePlants] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  // Generate preview when modal opens
  useEffect(() => {
    if (isOpen && canvasRef?.current) {
      generatePreview()
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [isOpen, exportFormat, quality, includeGrid, includeLabels, includePlants])

  const generatePreview = async () => {
    if (!canvasRef?.current) return

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false
      })

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', quality[0] / 100)
      })

      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const handleExport = async () => {
    if (!canvasRef?.current) return

    setIsExporting(true)
    setExportSuccess(false)

    try {
      switch (exportFormat) {
        case 'png':
        case 'jpg':
          await exportImage(exportFormat)
          break
        case 'svg':
          await exportSVG()
          break
        case 'pdf':
          await exportPDF()
          break
        case 'json':
          exportJSON()
          break
      }
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportImage = async (format: 'png' | 'jpg') => {
    if (!canvasRef?.current) return

    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: format === 'jpg' ? '#ffffff' : null,
      scale: 2,
      logging: false
    })

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), `image/${format === 'jpg' ? 'jpeg' : 'png'}`, quality[0] / 100)
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `garden-design-${Date.now()}.${format}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportSVG = async () => {
    // Get the SVG element directly
    const svg = canvasRef?.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `garden-design-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportPDF = async () => {
    if (!canvasRef?.current) return

    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`garden-design-${Date.now()}.pdf`)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(gardenData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `garden-design-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async (method: 'link' | 'email' | 'social') => {
    // Generate shareable link
    const shareData = btoa(JSON.stringify(gardenData))
    const url = `${window.location.origin}/share?design=${shareData}`

    setShareUrl(url)

    switch (method) {
      case 'link':
        await navigator.clipboard.writeText(url)
        break
      case 'email':
        window.location.href = `mailto:?subject=Check out my garden design&body=${encodeURIComponent(url)}`
        break
      case 'social':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my garden design!')}&url=${encodeURIComponent(url)}`, '_blank')
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "absolute inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
        "w-auto md:w-[900px] md:max-h-[80vh] bg-white rounded-2xl shadow-2xl",
        "animate-scale-in overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Export Garden Design</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="space-y-4">
              <Label>Preview</Label>
              <Card className="overflow-hidden bg-gray-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Garden preview"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </Card>

              {/* Export Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Format:</span>
                  <span className="ml-2 font-medium">{exportFormat.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Quality:</span>
                  <span className="ml-2 font-medium">{quality[0]}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <span className="ml-2 font-medium">~2.4 MB</span>
                </div>
                <div>
                  <span className="text-gray-500">Resolution:</span>
                  <span className="ml-2 font-medium">1920×1080</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <Tabs value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="png">PNG</TabsTrigger>
                  <TabsTrigger value="jpg">JPG</TabsTrigger>
                  <TabsTrigger value="svg">SVG</TabsTrigger>
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>

                <TabsContent value="png" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">Higher quality = larger file size</span>
                  </div>
                </TabsContent>

                <TabsContent value="jpg" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={10}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">JPG format with white background</span>
                  </div>
                </TabsContent>

                <TabsContent value="svg" className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Vector format - scalable without quality loss
                  </p>
                </TabsContent>

                <TabsContent value="pdf" className="space-y-4">
                  <p className="text-sm text-gray-600">
                    PDF document ready for printing
                  </p>
                </TabsContent>

                <TabsContent value="json" className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Raw data format for importing later
                  </p>
                </TabsContent>
              </Tabs>

              {/* Export Options */}
              <div className="space-y-3">
                <Label>Include in Export</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid" className="text-sm font-normal">Grid lines</Label>
                    <Switch
                      id="grid"
                      checked={includeGrid}
                      onCheckedChange={setIncludeGrid}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="labels" className="text-sm font-normal">Bed labels</Label>
                    <Switch
                      id="labels"
                      checked={includeLabels}
                      onCheckedChange={setIncludeLabels}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="plants" className="text-sm font-normal">Plant details</Label>
                    <Switch
                      id="plants"
                      checked={includePlants}
                      onCheckedChange={setIncludePlants}
                    />
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <Label>Share Design</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('link')}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('email')}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('social')}
                    className="w-full"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Social
                  </Button>
                </div>
                {shareUrl && (
                  <div className="p-2 bg-green-50 rounded-lg text-xs text-green-600">
                    Link copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            {exportSuccess && (
              <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Export successful!</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="gradient-understory min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}