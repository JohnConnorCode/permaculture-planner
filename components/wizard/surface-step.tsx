'use client'

import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

interface SurfaceStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

export function SurfaceStep({ data, updateData }: SurfaceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Surface & Sun Exposure</h2>
        <p className="text-gray-600 mb-6">
          Tell us about your growing conditions.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="surface">Surface Type</Label>
          <Select
            value={data.surface.type}
            onValueChange={(value) => updateData('surface', { type: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soil">Soil/Ground</SelectItem>
              <SelectItem value="hard">Concrete/Patio/Rooftop</SelectItem>
            </SelectContent>
          </Select>
          {data.surface.type === 'hard' && (
            <p className="text-sm text-blue-600 mt-2">
              We'll recommend wicking beds for better water efficiency on hard surfaces.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="sun">Daily Sun Hours</Label>
          <p className="text-sm text-gray-500 mb-2">
            How many hours of direct sunlight does the area receive?
          </p>
          <Slider
            id="sun"
            min={2}
            max={12}
            step={1}
            value={[data.surface.sun_hours]}
            onValueChange={([value]) => updateData('surface', { sun_hours: value })}
            className="mt-4"
          />
          <div className="text-center mt-2">
            {data.surface.sun_hours} hours
            {data.surface.sun_hours < 4 && ' (Shade - Limited options)'}  
            {data.surface.sun_hours >= 4 && data.surface.sun_hours < 6 && ' (Partial shade - Leafy greens)'}
            {data.surface.sun_hours >= 6 && ' (Full sun - All vegetables)'}
          </div>
        </div>

        <div>
          <Label htmlFor="slope">Ground Slope</Label>
          <Slider
            id="slope"
            min={0}
            max={15}
            step={1}
            value={[data.surface.slope]}
            onValueChange={([value]) => updateData('surface', { slope: value })}
            className="mt-4"
          />
          <div className="text-center mt-2">
            {data.surface.slope}% slope
            {data.surface.slope > 5 && ' (May need terracing)'}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="accessibility"
            checked={data.surface.accessibility_needs}
            onCheckedChange={(checked) => updateData('surface', { accessibility_needs: checked })}
          />
          <Label htmlFor="accessibility" className="cursor-pointer">
            Accessibility needs (wider paths, lower beds)
          </Label>
        </div>
      </div>
    </div>
  )
}