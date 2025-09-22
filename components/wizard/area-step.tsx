'use client'

import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AreaStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

export function AreaStep({ data, updateData }: AreaStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">How much space do you have?</h2>
        <p className="text-gray-600 mb-6">
          Tell us about the size and shape of your growing area.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="total_area">Total Area</Label>
          <div className="mt-2 space-y-2">
            <Slider
              id="total_area"
              min={50}
              max={2000}
              step={50}
              value={[data.area.total_sqft]}
              onValueChange={([value]) => updateData('area', { total_sqft: value })}
              className="mt-4"
            />
            <div className="text-center text-lg font-semibold">
              {data.area.total_sqft} sq ft
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Balcony</span>
              <span>Small Yard</span>
              <span>Large Yard</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="usable">Usable Fraction</Label>
          <p className="text-sm text-gray-500 mb-2">
            What percentage of the total area can be used for beds?
          </p>
          <Slider
            id="usable"
            min={0.5}
            max={1}
            step={0.1}
            value={[data.area.usable_fraction]}
            onValueChange={([value]) => updateData('area', { usable_fraction: value })}
            className="mt-4"
          />
          <div className="text-center mt-2">
            {Math.round(data.area.usable_fraction * 100)}% ({Math.round(data.area.total_sqft * data.area.usable_fraction)} sq ft usable)
          </div>
        </div>

        <div>
          <Label htmlFor="shape">Area Shape</Label>
          <Select
            value={data.area.shape}
            onValueChange={(value) => updateData('area', { shape: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangular">Rectangular</SelectItem>
              <SelectItem value="L-shaped">L-Shaped</SelectItem>
              <SelectItem value="scattered">Scattered/Multiple Areas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}