'use client'

import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

interface WaterStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

export function WaterStep({ data, updateData }: WaterStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Water & Materials</h2>
        <p className="text-gray-600 mb-6">
          How will you water your garden and what materials do you have access to?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="water_source">Water Source</Label>
          <Select
            value={data.water.source}
            onValueChange={(value) => updateData('water', { source: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select water source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spigot">Hose spigot/Municipal water</SelectItem>
              <SelectItem value="rain">Rain barrels/Catchment</SelectItem>
              <SelectItem value="none">Hand watering only</SelectItem>
            </SelectContent>
          </Select>
          {data.water.source === 'rain' && (
            <p className="text-sm text-amber-600 mt-2">
              Note: Check local regulations on using rain barrel water for edibles.
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="drip"
            checked={data.water.drip_allowed}
            onCheckedChange={(checked) => updateData('water', { drip_allowed: checked })}
          />
          <Label htmlFor="drip" className="cursor-pointer">
            Install drip irrigation system
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sip"
            checked={data.water.sip_interest}
            onCheckedChange={(checked) => updateData('water', { sip_interest: checked })}
          />
          <Label htmlFor="sip" className="cursor-pointer">
            Interested in wicking/sub-irrigated beds (water-efficient)
          </Label>
        </div>

        <div>
          <Label htmlFor="lumber">Lumber Type</Label>
          <Select
            value={data.materials?.lumber_type || 'cedar'}
            onValueChange={(value) => updateData('materials', { lumber_type: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select lumber" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cedar">Cedar (naturally rot-resistant)</SelectItem>
              <SelectItem value="pine">Pine (economical, needs treatment)</SelectItem>
              <SelectItem value="treated">ACQ/CA treated lumber</SelectItem>
            </SelectContent>
          </Select>
          {data.materials?.lumber_type === 'treated' && (
            <p className="text-sm text-blue-600 mt-2">
              Modern treated lumber (ACQ/CA) is generally considered safe. We'll include liner options.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Budget Level</Label>
          <Select
            value={data.materials?.budget_tier || 'standard'}
            onValueChange={(value) => updateData('materials', { budget_tier: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget (DIY, economical materials)</SelectItem>
              <SelectItem value="standard">Standard (quality materials, some DIY)</SelectItem>
              <SelectItem value="premium">Premium (best materials, professional grade)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}