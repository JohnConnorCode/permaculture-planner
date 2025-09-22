'use client'

import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LocationStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

const USDA_ZONES = [
  '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b',
  '7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b'
]

export function LocationStep({ data, updateData }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Where is your garden?</h2>
        <p className="text-gray-600 mb-6">
          We'll use your location to determine your growing zone and frost dates.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="city">City or Zip Code</Label>
          <Input
            id="city"
            type="text"
            placeholder="e.g., Portland, OR or 97201"
            value={data.location.city || ''}
            onChange={(e) => updateData('location', { city: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="zone">USDA Hardiness Zone</Label>
          <Select
            value={data.location.usda_zone || ''}
            onValueChange={(value) => updateData('location', { usda_zone: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your zone" />
            </SelectTrigger>
            <SelectContent>
              {USDA_ZONES.map(zone => (
                <SelectItem key={zone} value={zone}>
                  Zone {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Not sure? <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Find your zone</a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="last_frost">Average Last Frost</Label>
            <Input
              id="last_frost"
              type="date"
              value={data.location.last_frost || ''}
              onChange={(e) => updateData('location', { last_frost: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="first_frost">Average First Frost</Label>
            <Input
              id="first_frost"
              type="date"
              value={data.location.first_frost || ''}
              onChange={(e) => updateData('location', { first_frost: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}