'use client'

import { CompanionHighlightOverlay } from './companion-highlight-overlay'
import { CompanionLinesOverlay } from './companion-lines-overlay'
import { ElementImpactZonesOverlay } from './element-impact-zones-overlay'

/**
 * OverlaysContainer
 *
 * Combines all canvas overlays into a single component that can be rendered
 * inside the tldraw editor via the components prop
 *
 * Overlays included:
 * - CompanionHighlightOverlay: Real-time highlighting during plant placement
 * - CompanionLinesOverlay: Visual relationship lines between plants
 * - ElementImpactZonesOverlay: Service areas for water, structures, etc.
 */
export function OverlaysContainer({
  showCompanionLines = false,
  showImpactZones = false,
}: {
  showCompanionLines?: boolean
  showImpactZones?: boolean
}) {
  return (
    <>
      {/* Always show companion highlighting during plant placement */}
      <CompanionHighlightOverlay />

      {/* Toggleable overlays */}
      {showCompanionLines && <CompanionLinesOverlay visible={showCompanionLines} />}
      {showImpactZones && <ElementImpactZonesOverlay visible={showImpactZones} />}
    </>
  )
}
