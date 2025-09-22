'use client'

import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'

interface CropsStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

const CROP_OPTIONS = [
  { id: 'tomatoes', label: 'Tomatoes & Peppers', family: 'Solanaceae' },
  { id: 'lettuce', label: 'Salad Greens', family: 'Asteraceae' },
  { id: 'brassicas', label: 'Cabbage & Broccoli', family: 'Brassicaceae' },
  { id: 'roots', label: 'Carrots & Beets', family: 'Mixed' },
  { id: 'beans', label: 'Beans & Peas', family: 'Fabaceae' },
  { id: 'squash', label: 'Squash & Cucumbers', family: 'Cucurbitaceae' },
  { id: 'herbs', label: 'Herbs', family: 'Mixed' },
  { id: 'alliums', label: 'Onions & Garlic', family: 'Allium' },
]

export function CropsStep({ data, updateData }: CropsStepProps) {
  const handleCropToggle = (cropId: string) => {
    const current = data.crops.focus || []
    const updated = current.includes(cropId)
      ? current.filter(id => id !== cropId)
      : [...current, cropId]
    updateData('crops', { focus: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">What do you want to grow?</h2>
        <p className="text-gray-600 mb-6">
          Select your crop preferences and maintenance time.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Crop Focus</Label>
          <p className="text-sm text-gray-500 mb-4">
            Select all that interest you:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CROP_OPTIONS.map(crop => (
              <div key={crop.id} className="flex items-center space-x-2">
                <Checkbox
                  id={crop.id}
                  checked={data.crops.focus?.includes(crop.id) || false}
                  onCheckedChange={() => handleCropToggle(crop.id)}
                />
                <Label
                  htmlFor={crop.id}
                  className="cursor-pointer text-sm font-normal"
                >
                  {crop.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="time">Weekly Maintenance Time</Label>
          <p className="text-sm text-gray-500 mb-2">
            How many minutes per week can you dedicate to garden maintenance?
          </p>
          <Slider
            id="time"
            min={30}
            max={480}
            step={30}
            value={[data.crops.time_weekly_minutes]}
            onValueChange={([value]) => updateData('crops', { time_weekly_minutes: value })}
            className="mt-4"
          />
          <div className="text-center mt-2">
            {data.crops.time_weekly_minutes} minutes per week
            ({Math.round(data.crops.time_weekly_minutes / 60)} hours)
          </div>
        </div>

        <div>
          <Label>Avoid Any Families?</Label>
          <p className="text-sm text-gray-500 mb-4">
            Check any plant families to avoid (allergies, preferences, etc.):
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Solanaceae (nightshades)', 'Brassicaceae (cabbage family)', 'Allium (onions)'].map(family => (
              <div key={family} className="flex items-center space-x-2">
                <Checkbox
                  id={`avoid-${family}`}
                  checked={data.crops.avoid_families?.includes(family) || false}
                  onCheckedChange={(checked) => {
                    const current = data.crops.avoid_families || []
                    const updated = checked
                      ? [...current, family]
                      : current.filter(f => f !== family)
                    updateData('crops', { avoid_families: updated })
                  }}
                />
                <Label
                  htmlFor={`avoid-${family}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {family}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}