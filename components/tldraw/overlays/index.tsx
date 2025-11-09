'use client'

import { CompanionHighlightOverlay } from './companion-highlight-overlay'
import { CompanionLinesOverlay } from './companion-lines-overlay'
import { ElementImpactZonesOverlay } from './element-impact-zones-overlay'
import { CompanionTooltipOverlay } from './companion-tooltip-overlay'
import { EnvironmentalZonesOverlay, EnvironmentalMode } from './environmental-zones-overlay'

/**
 * OverlaysContainer
 *
 * Combines all canvas overlays into a single component that can be rendered
 * inside the tldraw editor via the components prop
 *
 * Overlays included:
 * - CompanionHighlightOverlay: Real-time highlighting during plant placement (always active)
 * - CompanionTooltipOverlay: Detailed hover tooltips (toggleable)
 * - CompanionLinesOverlay: Visual relationship lines between plants (toggleable)
 * - ElementImpactZonesOverlay: Service areas for water, structures, etc. (toggleable)
 * - EnvironmentalZonesOverlay: Sun/water/nutrient zones (toggleable with modes)
 */
export function OverlaysContainer({
  showCompanionLines = false,
  showImpactZones = false,
  showEnvironmentalZones = false,
  showTooltips = true,
  environmentalMode = 'sun' as EnvironmentalMode,
  lineOpacity = 60,
  zoneOpacity = 15,
  maxDisplayDistance = 300,
}: {
  showCompanionLines?: boolean
  showImpactZones?: boolean
  showEnvironmentalZones?: boolean
  showTooltips?: boolean
  environmentalMode?: EnvironmentalMode
  lineOpacity?: number
  zoneOpacity?: number
  maxDisplayDistance?: number
}) {
  return (
    <>
      {/* Always show companion highlighting during plant placement */}
      <CompanionHighlightOverlay />

      {/* Detailed tooltips on hover */}
      {showTooltips && <CompanionTooltipOverlay />}

      {/* Toggleable overlays */}
      {showCompanionLines && (
        <CompanionLinesOverlay
          visible={showCompanionLines}
          opacity={lineOpacity}
          maxDistance={maxDisplayDistance}
        />
      )}

      {showImpactZones && (
        <ElementImpactZonesOverlay visible={showImpactZones} opacity={zoneOpacity} />
      )}

      {showEnvironmentalZones && (
        <EnvironmentalZonesOverlay
          visible={showEnvironmentalZones}
          mode={environmentalMode}
        />
      )}
    </>
  )
}
