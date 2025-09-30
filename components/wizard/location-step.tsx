'use client'

import { useState, useEffect } from 'react'
import { WizardData } from '@/app/wizard/page'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SiteIntelligenceService } from '@/lib/services/site-intelligence'
import { MapPin, Loader2, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { HelpIcon, InlineHelp, HelpPanel, permacultureHelpTips } from '@/components/ui/contextual-help'
import { CardSkeleton } from '@/components/ui/progress-indicator'

interface LocationStepProps {
  data: WizardData
  updateData: (section: keyof WizardData, data: any) => void
}

interface LocationData {
  lat?: number
  lng?: number
  city?: string
  usda_zone?: string
  last_frost?: string
  first_frost?: string
  siteIntelligence?: any
}

const USDA_ZONES = [
  '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b',
  '7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b'
]

export function LocationStep({ data, updateData }: LocationStepProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoadingSiteData, setIsLoadingSiteData] = useState(false)
  const [siteIntelligence, setSiteIntelligence] = useState<any>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleGetLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        updateData('location', {
          lat: latitude,
          lng: longitude
        })

        // Fetch site intelligence
        await fetchSiteIntelligence(latitude, longitude)
        setIsLoadingLocation(false)
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enter manually.')
        setIsLoadingLocation(false)
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const fetchSiteIntelligence = async (lat: number, lng: number) => {
    setIsLoadingSiteData(true)
    try {
      const service = SiteIntelligenceService.getInstance()
      const data = await service.getSiteIntelligence(lat, lng)
      setSiteIntelligence(data)

      // Auto-populate fields from site intelligence
      updateData('location', {
        lat,
        lng,
        usda_zone: data.climate.hardiness_zone.replace('Zone ', ''),
        last_frost: data.climate.frost.last_frost,
        first_frost: data.climate.frost.first_frost,
        siteIntelligence: data
      })

      toast({
        title: 'Location Data Retrieved',
        description: `Found climate data for ${data.location.region}. Zone ${data.climate.hardiness_zone}`,
      })
    } catch (error) {
      console.error('Failed to fetch site intelligence:', error)
      toast({
        title: 'Site Data Unavailable',
        description: 'Could not fetch climate data. Please enter manually.',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingSiteData(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Where is your garden?</h2>
          <HelpPanel
            title="Location Help"
            tips={[
              permacultureHelpTips.usdaZone,
              {
                title: 'Why Location Matters',
                description: 'Your location determines climate, soil type, native plants, and seasonal patterns that affect your garden design.',
                type: 'info'
              },
              {
                title: 'Microclimates',
                description: 'Even within the same zone, your specific site may have unique conditions like wind patterns, elevation, or nearby structures.',
                type: 'tip'
              }
            ]}
          />
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          We'll use your location to automatically determine your growing zone, climate, and soil conditions.
        </p>
      </div>

      {/* Quick Location Detection */}
      <Card className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Auto-Detect Location</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              Allow us to detect your location for automatic climate and soil data
            </p>
            <Button
              onClick={handleGetLocation}
              disabled={isLoadingLocation || isLoadingSiteData}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto h-10 sm:h-9"
              size="sm"
            >
              {isLoadingLocation ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </>
              )}
            </Button>
            {locationError && (
              <p className="text-xs sm:text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                <span className="break-words">{locationError}</span>
              </p>
            )}
            {data.location.lat && data.location.lng && (
              <p className="text-xs sm:text-sm text-green-600 mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                <span className="break-all">Location detected: {data.location.lat.toFixed(4)}, {data.location.lng.toFixed(4)}</span>
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Site Intelligence Summary */}
      {siteIntelligence && (
        <Card className="p-4 border-green-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="h-5 w-5 text-green-600 mt-0.5" />
            <h3 className="font-semibold text-gray-900">Site Intelligence Retrieved</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-600">Climate Type:</span>
              <p className="font-medium">{siteIntelligence.climate.climate_type}</p>
            </div>
            <div>
              <span className="text-gray-600">Annual Rainfall:</span>
              <p className="font-medium">{siteIntelligence.climate.precipitation.annual_mm}mm</p>
            </div>
            <div>
              <span className="text-gray-600">Soil Type:</span>
              <p className="font-medium capitalize">{siteIntelligence.soil.texture.type}</p>
            </div>
            <div>
              <span className="text-gray-600">Soil pH:</span>
              <p className="font-medium">{siteIntelligence.soil.ph.value} ({siteIntelligence.soil.ph.category})</p>
            </div>
            <div>
              <span className="text-gray-600">Elevation:</span>
              <p className="font-medium">{siteIntelligence.terrain.elevation}m</p>
            </div>
            <div>
              <span className="text-gray-600">Frost-Free Days:</span>
              <p className="font-medium">{siteIntelligence.climate.frost.frost_free_days}</p>
            </div>
          </div>
          {siteIntelligence.recommendations.plants.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Recommended for your area:</p>
              <div className="flex flex-wrap gap-2">
                {siteIntelligence.recommendations.plants.slice(0, 3).map((plant: string, idx: number) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {plant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or enter manually</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="city" className="text-sm">City or Zip Code</Label>
          <Input
            id="city"
            type="text"
            placeholder="e.g., Portland, OR or 97201"
            value={data.location.city || ''}
            onChange={(e) => updateData('location', { city: e.target.value })}
            className="mt-2 h-10"
          />
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="zone" className="text-sm">USDA Hardiness Zone</Label>
            <HelpIcon tip={permacultureHelpTips.usdaZone} />
          </div>
          <Select
            value={data.location.usda_zone || ''}
            onValueChange={(value) => updateData('location', { usda_zone: value })}
          >
            <SelectTrigger className="mt-2 h-10" data-testid="usda-zone-select">
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
            Not sure? <a href="https://planthardiness.ars.usda.gov/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Find your zone</a>
          </p>
        </div>

        <div className="space-y-4">
          <InlineHelp
            tip={{
              title: 'Growing Season Dates',
              description: 'These dates help determine when to start seeds indoors, transplant outdoors, and when to expect your harvest season to end.',
              type: 'tip'
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="last_frost" className="text-sm">Average Last Frost</Label>
              <Input
                id="last_frost"
                type="date"
                value={data.location.last_frost || ''}
                onChange={(e) => updateData('location', { last_frost: e.target.value })}
                className="mt-2 h-10"
              />
            </div>
            <div>
              <Label htmlFor="first_frost" className="text-sm">Average First Frost</Label>
              <Input
                id="first_frost"
                type="date"
                value={data.location.first_frost || ''}
                onChange={(e) => updateData('location', { first_frost: e.target.value })}
                className="mt-2 h-10"
              />
            </div>
          </div>
        </div>

        {isLoadingSiteData && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-3 text-sm text-gray-600">Fetching climate and soil data...</span>
            </div>
            <CardSkeleton className="h-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton className="h-20" />
              <CardSkeleton className="h-20" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}