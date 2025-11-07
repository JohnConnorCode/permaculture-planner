/**
 * Sun/Shade Analysis with Real Solar Calculations
 *
 * Based on:
 * - Latitude/longitude for sun path
 * - Time of year for sun angle
 * - NOAA solar calculation algorithms
 * - Obstruction mapping (trees, buildings, fences)
 */

export interface Location {
  lat: number
  lng: number
  timezone?: string // e.g., "America/New_York"
}

export interface Obstruction {
  type: 'tree' | 'building' | 'fence' | 'other'
  height: number // feet
  position: { x: number; y: number } // relative to garden
  width: number // feet
}

export interface SunExposure {
  /** Total sun hours per day (average for growing season) */
  hoursPerDay: number
  /** Sun intensity 0-100% */
  intensity: number
  /** Sun category */
  category: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
  /** Hour-by-hour sun exposure (6am-8pm) */
  hourly: boolean[] // true = sun, false = shade
  /** Best hours for sun (peak photosynthesis) */
  peakHours: { start: number; end: number }
}

export interface SunPathData {
  /** Sun altitude in degrees */
  altitude: number
  /** Sun azimuth in degrees (0 = North, 90 = East, 180 = South, 270 = West) */
  azimuth: number
  /** Is sun above horizon */
  isVisible: boolean
}

/**
 * Calculate sun position for a given date, time, and location
 * Based on NOAA solar position algorithm
 */
export function calculateSunPosition(
  date: Date,
  location: Location
): SunPathData {
  const lat = location.lat * (Math.PI / 180) // Convert to radians
  const lng = location.lng

  // Julian day
  const jd = getJulianDay(date)

  // Julian century
  const jc = (jd - 2451545) / 36525

  // Sun's geometric mean longitude (degrees)
  const L0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360

  // Sun's geometric mean anomaly (degrees)
  const M = 357.52911 + jc * (35999.05029 - 0.0001537 * jc)

  // Eccentricity of Earth's orbit
  const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc)

  // Sun's equation of center
  const Mrad = M * (Math.PI / 180)
  const C =
    Math.sin(Mrad) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    Math.sin(2 * Mrad) * (0.019993 - 0.000101 * jc) +
    Math.sin(3 * Mrad) * 0.000289

  // Sun's true longitude
  const theta = L0 + C

  // Sun's apparent longitude
  const omega = 125.04 - 1934.136 * jc
  const lambda = theta - 0.00569 - 0.00478 * Math.sin(omega * (Math.PI / 180))

  // Obliquity of the ecliptic
  const epsilon0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60
  const epsilon = epsilon0 + 0.00256 * Math.cos(omega * (Math.PI / 180))

  // Sun's declination
  const epsilonRad = epsilon * (Math.PI / 180)
  const lambdaRad = lambda * (Math.PI / 180)
  const declination = Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad))

  // Equation of time
  const y = Math.tan(epsilonRad / 2) * Math.tan(epsilonRad / 2)
  const EoT =
    4 *
    (y * Math.sin(2 * L0 * (Math.PI / 180)) -
      2 * e * Math.sin(Mrad) +
      4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0 * (Math.PI / 180)) -
      0.5 * y * y * Math.sin(4 * L0 * (Math.PI / 180)) -
      1.25 * e * e * Math.sin(2 * Mrad)) *
    (180 / Math.PI)

  // Hour angle
  const timeOffset = EoT + 4 * lng // minutes
  const tst = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60 + timeOffset
  const hourAngle = ((tst / 4 - 180) * Math.PI) / 180

  // Solar altitude (elevation angle)
  const altitude =
    Math.asin(Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle)) *
    (180 / Math.PI)

  // Solar azimuth
  let azimuth =
    Math.acos(
      (Math.sin(declination) * Math.cos(lat) - Math.cos(declination) * Math.sin(lat) * Math.cos(hourAngle)) /
        Math.cos(altitude * (Math.PI / 180))
    ) *
    (180 / Math.PI)

  if (hourAngle > 0) {
    azimuth = 360 - azimuth
  }

  return {
    altitude,
    azimuth,
    isVisible: altitude > 0,
  }
}

/**
 * Calculate sun exposure for a location throughout a day
 */
export function calculateDailySunExposure(
  date: Date,
  location: Location,
  obstructions: Obstruction[] = []
): SunExposure {
  const hourly: boolean[] = []
  let totalSunHours = 0

  // Check each hour from 6am to 8pm
  for (let hour = 6; hour <= 20; hour++) {
    const testDate = new Date(date)
    testDate.setHours(hour, 0, 0, 0)

    const sunPos = calculateSunPosition(testDate, location)

    // Sun is visible if altitude > 0
    let hasSun = sunPos.isVisible

    // Check if any obstructions block the sun
    if (hasSun && obstructions.length > 0) {
      hasSun = !isBlockedByObstructions(sunPos, obstructions, location)
    }

    hourly.push(hasSun)
    if (hasSun) totalSunHours++
  }

  // Calculate intensity based on latitude and season
  const intensity = calculateSunIntensity(date, location)

  // Determine category
  let category: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
  if (totalSunHours >= 6) category = 'full_sun' // 6+ hours
  else if (totalSunHours >= 4) category = 'partial_sun' // 4-6 hours
  else if (totalSunHours >= 2) category = 'partial_shade' // 2-4 hours
  else category = 'full_shade' // <2 hours

  // Peak sun hours (typically 10am-4pm in growing season)
  const peakHours = { start: 10, end: 16 }

  return {
    hoursPerDay: totalSunHours,
    intensity,
    category,
    hourly,
    peakHours,
  }
}

/**
 * Calculate average sun exposure for growing season (May-Sept)
 */
export function calculateSeasonalSunExposure(
  location: Location,
  obstructions: Obstruction[] = []
): SunExposure {
  const year = new Date().getFullYear()
  const sampleDates = [
    new Date(year, 4, 15), // May 15
    new Date(year, 5, 15), // Jun 15
    new Date(year, 6, 15), // Jul 15
    new Date(year, 7, 15), // Aug 15
    new Date(year, 8, 15), // Sep 15
  ]

  let totalHours = 0
  let totalIntensity = 0
  const combinedHourly: number[] = new Array(15).fill(0) // 6am-8pm = 15 hours

  for (const date of sampleDates) {
    const exposure = calculateDailySunExposure(date, location, obstructions)
    totalHours += exposure.hoursPerDay
    totalIntensity += exposure.intensity

    exposure.hourly.forEach((hasSun, idx) => {
      if (hasSun) combinedHourly[idx]++
    })
  }

  const avgHours = totalHours / sampleDates.length
  const avgIntensity = totalIntensity / sampleDates.length

  // Convert combined hourly to boolean (sun if present in >50% of sample dates)
  const hourly = combinedHourly.map(count => count >= 3)

  let category: 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade'
  if (avgHours >= 6) category = 'full_sun'
  else if (avgHours >= 4) category = 'partial_sun'
  else if (avgHours >= 2) category = 'partial_shade'
  else category = 'full_shade'

  return {
    hoursPerDay: Math.round(avgHours * 10) / 10,
    intensity: Math.round(avgIntensity),
    category,
    hourly,
    peakHours: { start: 10, end: 16 },
  }
}

/**
 * Check if sun is blocked by obstructions
 */
function isBlockedByObstructions(
  sunPos: SunPathData,
  obstructions: Obstruction[],
  location: Location
): boolean {
  // Simplified obstruction check
  // In production, this would do ray-casting from observer to sun position
  for (const obstruction of obstructions) {
    // Calculate if obstruction is in the direction of the sun
    const obstructionAngle = Math.atan2(obstruction.position.y, obstruction.position.x) * (180 / Math.PI)
    const angleDiff = Math.abs(normalizeAngle(sunPos.azimuth - obstructionAngle))

    // If obstruction is within 15 degrees of sun azimuth
    if (angleDiff < 15) {
      // Calculate if obstruction is tall enough to block sun
      const distance = Math.sqrt(obstruction.position.x ** 2 + obstruction.position.y ** 2)
      const blockingAngle = Math.atan2(obstruction.height, distance) * (180 / Math.PI)

      if (blockingAngle > sunPos.altitude) {
        return true // Blocked!
      }
    }
  }

  return false
}

/**
 * Calculate sun intensity based on latitude and date
 */
function calculateSunIntensity(date: Date, location: Location): number {
  // Base intensity on latitude (equator = 100%, poles = 50%)
  const latIntensity = 100 - Math.abs(location.lat) * 0.5

  // Seasonal variation (summer = 100%, winter = 60%)
  const dayOfYear = getDayOfYear(date)
  const seasonalFactor = 0.8 + 0.2 * Math.cos(((dayOfYear - 172) * 2 * Math.PI) / 365) // Peak at summer solstice

  return Math.round(latIntensity * seasonalFactor)
}

/**
 * Recommend plants based on sun exposure
 */
export function recommendPlantsForSunExposure(
  exposure: SunExposure,
  plantLibrary: any[]
): any[] {
  const categoryMap: Record<string, ('full' | 'partial' | 'shade')[]> = {
    full_sun: ['full'],
    partial_sun: ['full', 'partial'],
    partial_shade: ['partial', 'shade'],
    full_shade: ['shade'],
  }

  const suitableSunLevels = categoryMap[exposure.category]

  return plantLibrary.filter(plant => suitableSunLevels.includes(plant.requirements.sun))
}

// Helper functions
function getJulianDay(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12)
  const y = date.getFullYear() + 4800 - a
  const m = date.getMonth() + 1 + 12 * a - 3

  return (
    date.getDate() +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045 +
    (date.getHours() - 12) / 24
  )
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function normalizeAngle(angle: number): number {
  while (angle > 180) angle -= 360
  while (angle < -180) angle += 360
  return angle
}
