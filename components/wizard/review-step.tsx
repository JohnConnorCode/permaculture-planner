'use client'

import { WizardData } from '@/app/wizard/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, MapPin, Square, Sun, Droplets, Leaf, Clock } from 'lucide-react'

interface ReviewStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

export function ReviewStep({ data }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Review Your Plan</h2>
        <p className="text-gray-600 mb-6">
          Here's a summary of your garden plan. Click "Generate Plan" to create your customized design.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <div>{data.location.city || 'Not specified'}</div>
            <div>Zone {data.location.usda_zone || 'Not specified'}</div>
            <div>Last frost: {data.location.last_frost || 'Not specified'}</div>
            <div>First frost: {data.location.first_frost || 'Not specified'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Square className="h-4 w-4 mr-2" />
              Space
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <div>{data.area.total_sqft} sq ft total</div>
            <div>{Math.round(data.area.total_sqft * data.area.usable_fraction)} sq ft usable</div>
            <div>{data.area.shape} layout</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Sun className="h-4 w-4 mr-2" />
              Growing Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <div>Surface: {data.surface.type === 'soil' ? 'Soil/Ground' : 'Hard surface'}</div>
            <div>Sun exposure: {data.surface.sun_hours} hours/day</div>
            <div>Slope: {data.surface.slope}%</div>
            {data.surface.accessibility_needs && <div>✓ Accessibility features</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Droplets className="h-4 w-4 mr-2" />
              Water & Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <div>Water: {data.water.source}</div>
            {data.water.drip_allowed && <div>✓ Drip irrigation</div>}
            {data.water.sip_interest && <div>✓ Wicking beds</div>}
            <div>Lumber: {data.materials?.lumber_type || 'cedar'}</div>
            <div>Budget: {data.materials?.budget_tier || 'standard'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              Crops
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <div>Focus: {data.crops.focus?.join(', ') || 'Not selected'}</div>
            <div>Time: {data.crops.time_weekly_minutes} min/week</div>
            {data.crops.avoid_families && data.crops.avoid_families.length > 0 && (
              <div>Avoiding: {data.crops.avoid_families.join(', ')}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-green-900">Ready to generate your plan!</p>
            <p className="text-green-700 mt-1">
              Your customized garden plan will include:
            </p>
            <ul className="list-disc list-inside text-green-700 mt-2 space-y-1">
              <li>Optimized bed layout for your space</li>
              <li>Complete materials list and cost estimate</li>
              <li>Crop rotation schedule for 3 seasons</li>
              <li>Irrigation plan and water requirements</li>
              <li>Monthly task calendar</li>
              <li>IPM recommendations and row cover guide</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}