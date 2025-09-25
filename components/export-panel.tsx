'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReportGenerator } from '@/lib/reports/report-generator'
import { sitePlanExporter } from '@/lib/export/site-plan-exporter'
import { GardenPlan } from '@/types'
import { 
  Download, 
  FileText, 
  Image, 
  Loader2, 
  MapPin,
  Settings,
  Eye,
  Save,
  Share2,
  Printer
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface ExportPanelProps {
  plan: GardenPlan
  onClose?: () => void
}

export function ExportPanel({ plan, onClose }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<'report' | 'sitePlan'>('report')
  
  // Report options
  const [reportFormat, setReportFormat] = useState<'pdf' | 'html'>('pdf')
  const [includeAI, setIncludeAI] = useState(true)
  const [includeSchedule, setIncludeSchedule] = useState(true)
  const [includeRisks, setIncludeRisks] = useState(true)
  
  // Site plan options
  const [planFormat, setPlanFormat] = useState<'svg' | 'png'>('png')
  const [planScale, setPlanScale] = useState(2)
  const [showGrid, setShowGrid] = useState(true)
  const [showDimensions, setShowDimensions] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [showNorthArrow, setShowNorthArrow] = useState(true)
  const [showScale, setShowScale] = useState(true)
  const [planQuality, setPlanQuality] = useState<'draft' | 'final'>('final')
  
  // Metadata
  const [title, setTitle] = useState(plan.name || 'Permaculture Garden Plan')
  const [designer, setDesigner] = useState('')
  const [notes, setNotes] = useState('')

  const handleExportReport = async () => {
    setIsExporting(true)
    try {
      // Convert GardenPlan to PlanData format expected by ReportGenerator
      const planData = {
        id: plan.id || 'demo-plan',
        name: plan.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft' as const,
        site: {
          location: { lat: 0, lng: 0 },
          climate: { zone: '6a', koppen: 'Cfa', avgTemp: 20, rainfall: 800 },
          soil: { type: 'loam', ph: 6.5, organic: 3, drainage: 'good' },
          elevation: { meters: 100, slope: 0, aspect: 'south' }
        },
        design: {
          beds: plan.beds || [],
          paths: plan.paths || [],
          structures: plan.structures || [],
          plants: plan.plants || []
        }
      }

      const generator = new ReportGenerator(planData)
      let blob: Blob

      if (reportFormat === 'pdf') {
        blob = await generator.generatePDF()
      } else {
        const html = generator.generateHTML()
        blob = new Blob([html], { type: 'text/html' })
      }
      
      // Download file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_report_${new Date().toISOString().split('T')[0]}.${reportFormat}`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Report Generated',
        description: `Your ${reportFormat.toUpperCase()} report has been downloaded successfully.`
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error generating your report. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportSitePlan = async () => {
    setIsExporting(true)
    try {
      const blob = await sitePlanExporter.export(plan, {
        format: planFormat,
        scale: planScale,
        showGrid,
        showDimensions,
        showLegend,
        showNorthArrow,
        showScale,
        title,
        designer,
        date: new Date().toLocaleDateString(),
        notes: notes.split('\n').filter(n => n.trim()),
        quality: planQuality
      })
      
      // Download file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = sitePlanExporter.generateFilename(title, planFormat, planQuality)
      a.click()
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Site Plan Exported',
        description: `Your ${planFormat.toUpperCase()} site plan has been downloaded successfully.`
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your site plan. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Export Garden Plan</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>

        <Tabs value={exportType} onValueChange={(v) => setExportType(v as 'report' | 'sitePlan')}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report
            </TabsTrigger>
            <TabsTrigger value="sitePlan" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Site Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Report Options</h3>
                
                <div>
                  <Label htmlFor="report-format">Format</Label>
                  <Select value={reportFormat} onValueChange={(v) => setReportFormat(v as 'pdf' | 'html')}>
                    <SelectTrigger id="report-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="html">HTML (Web)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-ai" className="text-sm">AI Recommendations</Label>
                    <Switch
                      id="include-ai"
                      checked={includeAI}
                      onCheckedChange={setIncludeAI}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-schedule" className="text-sm">Planting Schedule</Label>
                    <Switch
                      id="include-schedule"
                      checked={includeSchedule}
                      onCheckedChange={setIncludeSchedule}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-risks" className="text-sm">Risk Analysis</Label>
                    <Switch
                      id="include-risks"
                      checked={includeRisks}
                      onCheckedChange={setIncludeRisks}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Metadata</h3>
                
                <div>
                  <Label htmlFor="report-title">Title</Label>
                  <Input
                    id="report-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Garden Plan"
                  />
                </div>
                
                <div>
                  <Label htmlFor="report-designer">Designer</Label>
                  <Input
                    id="report-designer"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="report-notes">Notes</Label>
                  <Textarea
                    id="report-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes (one per line)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                disabled={isExporting}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={handleExportReport}
                disabled={isExporting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sitePlan" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Export Settings</h3>
                
                <div>
                  <Label htmlFor="plan-format">Format</Label>
                  <Select value={planFormat} onValueChange={(v) => setPlanFormat(v as 'svg' | 'png')}>
                    <SelectTrigger id="plan-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG Image</SelectItem>
                      <SelectItem value="svg">SVG Vector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="plan-quality">Quality</Label>
                  <Select value={planQuality} onValueChange={(v) => setPlanQuality(v as 'draft' | 'final')}>
                    <SelectTrigger id="plan-quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (with watermark)</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="plan-scale">Scale ({planScale}x)</Label>
                  <input
                    id="plan-scale"
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={planScale}
                    onChange={(e) => setPlanScale(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Display Options</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid" className="text-sm">Grid</Label>
                    <Switch
                      id="show-grid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-dimensions" className="text-sm">Dimensions</Label>
                    <Switch
                      id="show-dimensions"
                      checked={showDimensions}
                      onCheckedChange={setShowDimensions}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-legend" className="text-sm">Legend</Label>
                    <Switch
                      id="show-legend"
                      checked={showLegend}
                      onCheckedChange={setShowLegend}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-north" className="text-sm">North Arrow</Label>
                    <Switch
                      id="show-north"
                      checked={showNorthArrow}
                      onCheckedChange={setShowNorthArrow}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-scale" className="text-sm">Scale Bar</Label>
                    <Switch
                      id="show-scale"
                      checked={showScale}
                      onCheckedChange={setShowScale}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                disabled={isExporting}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                disabled={isExporting}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={handleExportSitePlan}
                disabled={isExporting}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export Site Plan
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}