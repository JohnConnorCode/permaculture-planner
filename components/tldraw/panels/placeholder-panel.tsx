'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Rocket, FileText } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface PlaceholderPanelProps {
  title: string
  description: string
  icon: LucideIcon
  features?: string[]
  status?: 'coming-soon' | 'in-development' | 'planned'
}

export function PlaceholderPanel({
  title,
  description,
  icon: Icon,
  features = [],
  status = 'planned'
}: PlaceholderPanelProps) {
  const statusConfig = {
    'coming-soon': {
      label: 'Coming Soon',
      color: 'bg-blue-100 text-blue-700',
      description: 'This feature is actively being developed and will be available soon.'
    },
    'in-development': {
      label: 'In Development',
      color: 'bg-purple-100 text-purple-700',
      description: 'Currently under development. Check back for updates!'
    },
    'planned': {
      label: 'Planned Feature',
      color: 'bg-gray-100 text-gray-700',
      description: 'This feature is on the roadmap for future development.'
    }
  }

  const config = statusConfig[status]

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
            <Icon className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Development Status
            </CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Planned Features */}
        {features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Planned Features
              </CardTitle>
              <CardDescription>What this panel will include when complete:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileText className="h-12 w-12 mx-auto text-green-600" />
              <div>
                <h3 className="font-semibold text-lg">Want This Feature?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Let us know! User feedback helps prioritize development.
                </p>
              </div>
              <Button variant="outline" className="border-green-300 hover:bg-green-100">
                Request Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meanwhile Section */}
        <div className="text-sm text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
          <p>
            Meanwhile, explore our{' '}
            <span className="font-semibold text-foreground">Analytics</span>,{' '}
            <span className="font-semibold text-foreground">Zone Management</span>, and{' '}
            <span className="font-semibold text-foreground">Companion Planting</span> panels
            for powerful permaculture design tools.
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}

// Specific panel configurations
export function SoilAnalysisPanel() {
  return (
    <PlaceholderPanel
      title="Soil Analysis"
      description="Comprehensive soil assessment and amendment planning"
      icon={require('lucide-react').Layers}
      status="coming-soon"
      features={[
        'Soil type classification (sand, silt, clay, loam)',
        'pH analysis and lime/sulfur recommendations',
        'Nutrient testing (N-P-K, micronutrients)',
        'Soil texture triangle visualization',
        'Organic matter content assessment',
        'Amendment calculator with quantities',
        'Drainage and compaction analysis',
        'Soil food web health indicators'
      ]}
    />
  )
}

export function TopographyPanel() {
  return (
    <PlaceholderPanel
      title="Topography & Grading"
      description="Slope analysis, contouring, and earthworks planning"
      icon={require('lucide-react').Mountain}
      status="in-development"
      features={[
        'Elevation contour mapping',
        'Slope percentage calculations',
        'Water flow direction analysis',
        'Swale and keyline design tools',
        'Terrace and retaining wall planning',
        'Cut/fill volume calculations',
        'Erosion risk assessment',
        'Pond and dam site selection'
      ]}
    />
  )
}

export function ClimatePanel() {
  return (
    <PlaceholderPanel
      title="Climate & Microclimate"
      description="Temperature zones and microclimate optimization"
      icon={require('lucide-react').Thermometer}
      status="planned"
      features={[
        'USDA hardiness zone mapping',
        'Frost pocket identification',
        'Heat island and cold sink analysis',
        'Microclimate creation strategies',
        'Growing season length calculator',
        'Temperature range tracking',
        'Wind shelter and sun trap planning',
        'Climate change adaptation scenarios'
      ]}
    />
  )
}

export function InfrastructurePanel() {
  return (
    <PlaceholderPanel
      title="Site Infrastructure"
      description="Buildings, paths, fences, and utility planning"
      icon={require('lucide-react').Home}
      status="coming-soon"
      features={[
        'Building placement and orientation',
        'Path and access route planning',
        'Fence and boundary design',
        'Utility line mapping (water, electric, gas)',
        'Storage shed and greenhouse placement',
        'Composting station locations',
        'Tool and equipment access',
        'Emergency access planning'
      ]}
    />
  )
}

export function BiodiversityPanel() {
  return (
    <PlaceholderPanel
      title="Biodiversity & Wildlife"
      description="Habitat corridors and ecological enhancement"
      icon={require('lucide-react').Bird}
      status="in-development"
      features={[
        'Wildlife corridor planning',
        'Pollinator habitat zones',
        'Beneficial insect attractants',
        'Bird nesting and feeding stations',
        'Native species recommendations',
        'Ecological niche optimization',
        'Predator/prey balance analysis',
        'Seasonal habitat availability'
      ]}
    />
  )
}

export function EnergyPanel() {
  return (
    <PlaceholderPanel
      title="Energy Systems"
      description="Renewable energy and passive design integration"
      icon={require('lucide-react').Zap}
      status="planned"
      features={[
        'Solar panel placement and sizing',
        'Passive solar building orientation',
        'Wind turbine site assessment',
        'Thermal mass calculations',
        'Natural heating and cooling',
        'Energy storage planning',
        'Energy audit and efficiency',
        'Off-grid system design'
      ]}
    />
  )
}

export function CommunityPanel() {
  return (
    <PlaceholderPanel
      title="Community Spaces"
      description="Shared gardens and educational areas"
      icon={require('lucide-react').Users}
      status="planned"
      features={[
        'Community garden plot layouts',
        'Educational demonstration areas',
        'Gathering and seating spaces',
        'Children\'s play and learning zones',
        'Workshop and tool-sharing areas',
        'Food forest walking paths',
        'Volunteer coordination zones',
        'Public access and privacy balance'
      ]}
    />
  )
}

export function EconomicsPanel() {
  return (
    <PlaceholderPanel
      title="Economics & Yields"
      description="Production tracking and market analysis"
      icon={require('lucide-react').DollarSign}
      status="in-development"
      features={[
        'Yield tracking by crop and bed',
        'Market price analysis',
        'ROI calculations per element',
        'CSA and farm stand planning',
        'Labor hour tracking',
        'Revenue vs. expense dashboards',
        'Value-added product planning',
        'Break-even analysis'
      ]}
    />
  )
}

export function ResiliencePanel() {
  return (
    <PlaceholderPanel
      title="Resilience & Food Security"
      description="Self-sufficiency and caloric production metrics"
      icon={require('lucide-react').TrendingUp}
      status="planned"
      features={[
        'Caloric production by crop',
        'Nutritional diversity analysis',
        'Food security timeline (days/months)',
        'Preservation and storage planning',
        'Seed saving and propagation',
        'Disaster resilience assessment',
        'Water security calculations',
        'Self-sufficiency percentage tracking'
      ]}
    />
  )
}
