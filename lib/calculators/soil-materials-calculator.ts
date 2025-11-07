/**
 * Accurate soil volume and materials calculations
 *
 * Based on:
 * - Standard bed dimensions and volumes
 * - Common lumber sizes and board feet
 * - Soil amendment ratios
 * - Industry material costs
 */

import { GardenBed } from '@/lib/garden/garden-types'

export interface SoilCalculation {
  /** Total cubic feet of soil needed */
  cubicFeet: number
  /** Total cubic yards (for ordering) */
  cubicYards: number
  /** Number of standard 40lb bags (1.5 cu ft each) */
  bags40lb: number
  /** Recommended soil mix */
  soilMix: {
    topsoil: number // cubic yards
    compost: number // cubic yards
    peatMoss: number // cubic yards
    vermiculite: number // cubic yards
  }
  /** Estimated cost */
  estimatedCost: number
}

export interface LumberCalculation {
  /** Board feet of lumber needed */
  boardFeet: number
  /** Recommended lumber pieces */
  pieces: {
    size: string // e.g., "2x6x8"
    quantity: number
    boardFeet: number
  }[]
  /** Number of corner brackets */
  brackets: number
  /** Number of screws/fasteners */
  screws: number
  /** Estimated cost */
  estimatedCost: number
}

export interface MaterialsEstimate {
  soil: SoilCalculation
  lumber: LumberCalculation
  totalCost: number
  breakdown: {
    soil: number
    lumber: number
    hardware: number
  }
}

/**
 * Calculate soil volume for a raised bed
 *
 * Formula: Volume = Length × Width × Depth
 */
export function calculateSoilVolume(
  lengthInches: number,
  widthInches: number,
  depthInches: number = 12 // Default 12" depth
): SoilCalculation {
  // Convert to feet
  const lengthFt = lengthInches / 12
  const widthFt = widthInches / 12
  const depthFt = depthInches / 12

  // Calculate volume in cubic feet
  const cubicFeet = lengthFt * widthFt * depthFt

  // Convert to cubic yards (1 cubic yard = 27 cubic feet)
  const cubicYards = cubicFeet / 27

  // Calculate 40lb bags (each bag is ~1.5 cubic feet)
  const bags40lb = Math.ceil(cubicFeet / 1.5)

  // Recommended Mel's Mix (Square Foot Gardening):
  // 1/3 compost, 1/3 peat moss, 1/3 vermiculite
  const soilMix = {
    topsoil: cubicYards * 0.4, // 40% topsoil
    compost: cubicYards * 0.3, // 30% compost
    peatMoss: cubicYards * 0.2, // 20% peat moss
    vermiculite: cubicYards * 0.1, // 10% vermiculite/perlite
  }

  // Cost estimates (national averages 2024)
  const topsoilCost = soilMix.topsoil * 35 // $35/cubic yard
  const compostCost = soilMix.compost * 45 // $45/cubic yard
  const peatMossCost = soilMix.peatMoss * 55 // $55/cubic yard
  const vermiculiteCost = soilMix.vermiculite * 75 // $75/cubic yard

  const estimatedCost = topsoilCost + compostCost + peatMossCost + vermiculiteCost

  return {
    cubicFeet,
    cubicYards,
    bags40lb,
    soilMix,
    estimatedCost,
  }
}

/**
 * Calculate lumber needs for a raised bed
 *
 * Assumptions:
 * - 2x6 or 2x8 or 2x10 boards for sides
 * - 4x4 posts for corners (optional)
 * - Interior corner brackets
 */
export function calculateLumberNeeds(
  lengthInches: number,
  widthInches: number,
  depthInches: number = 12
): LumberCalculation {
  const lengthFt = lengthInches / 12
  const widthFt = widthInches / 12

  // Determine board size based on depth
  let boardHeight: number
  let boardSize: string
  if (depthInches <= 6) {
    boardHeight = 5.5 // 2x6 actual height
    boardSize = '2x6'
  } else if (depthInches <= 8) {
    boardHeight = 7.25 // 2x8 actual height
    boardSize = '2x8'
  } else {
    boardHeight = 9.25 // 2x10 actual height
    boardSize = '2x10'
  }

  // Calculate number of boards high
  const boardsHigh = Math.ceil(depthInches / boardHeight)

  // Calculate perimeter
  const perimeterFt = (lengthFt + widthFt) * 2

  // Calculate board feet needed
  // Board feet = (Thickness × Width × Length) / 12
  // 2x6 = (2 × 6 × length) / 12
  const boardFeetPerLinearFoot = (2 * parseInt(boardSize.split('x')[1])) / 12
  const totalBoardFeet = perimeterFt * boardsHigh * boardFeetPerLinearFoot

  // Calculate actual lumber pieces (8ft and 10ft boards)
  const pieces: { size: string; quantity: number; boardFeet: number }[] = []

  // Long sides
  const longSideBoards8ft = Math.floor(lengthFt / 8) * boardsHigh
  const longSideBoards10ft = Math.ceil((lengthFt % 8) / 10) * boardsHigh * 2

  // Short sides
  const shortSideBoards8ft = Math.floor(widthFt / 8) * boardsHigh
  const shortSideBoards10ft = Math.ceil((widthFt % 8) / 10) * boardsHigh * 2

  const total8ft = (longSideBoards8ft + shortSideBoards8ft) * 2
  const total10ft = longSideBoards10ft + shortSideBoards10ft

  if (total8ft > 0) {
    pieces.push({
      size: `${boardSize}x8`,
      quantity: total8ft,
      boardFeet: total8ft * 8 * boardFeetPerLinearFoot,
    })
  }

  if (total10ft > 0) {
    pieces.push({
      size: `${boardSize}x10`,
      quantity: total10ft,
      boardFeet: total10ft * 10 * boardFeetPerLinearFoot,
    })
  }

  // Hardware
  const brackets = 4 // Corner brackets
  const screwsPerBracket = 8
  const screwsPerJoint = 4
  const totalScrews = brackets * screwsPerBracket + (pieces.reduce((sum, p) => sum + p.quantity, 0) * screwsPerJoint)

  // Cost estimates
  const lumberCostPerBoardFoot = 1.25 // $1.25/board foot (2024 average)
  const bracketCost = 3.50 // $3.50 per bracket
  const screwBoxCost = 8.00 // $8 per box of 100 screws

  const lumberCost = totalBoardFeet * lumberCostPerBoardFoot
  const hardwareCost = brackets * bracketCost + Math.ceil(totalScrews / 100) * screwBoxCost

  return {
    boardFeet: totalBoardFeet,
    pieces,
    brackets,
    screws: totalScrews,
    estimatedCost: lumberCost + hardwareCost,
  }
}

/**
 * Calculate complete materials estimate for a bed
 */
export function calculateBedMaterials(bed: GardenBed, bedDepthInches: number = 12): MaterialsEstimate {
  const soil = calculateSoilVolume(bed.width || 48, bed.height || 48, bedDepthInches)
  const lumber = calculateLumberNeeds(bed.width || 48, bed.height || 48, bedDepthInches)

  return {
    soil,
    lumber,
    totalCost: soil.estimatedCost + lumber.estimatedCost,
    breakdown: {
      soil: soil.estimatedCost,
      lumber: lumber.estimatedCost,
      hardware: 0, // Included in lumber cost
    },
  }
}

/**
 * Calculate materials for entire garden plan
 */
export function calculateGardenMaterials(
  beds: GardenBed[],
  bedDepthInches: number = 12
): {
  beds: MaterialsEstimate[]
  total: {
    soil: SoilCalculation
    lumber: LumberCalculation
    totalCost: number
  }
} {
  const bedEstimates = beds.map(bed => calculateBedMaterials(bed, bedDepthInches))

  // Aggregate totals
  const totalSoil: SoilCalculation = {
    cubicFeet: bedEstimates.reduce((sum, est) => sum + est.soil.cubicFeet, 0),
    cubicYards: bedEstimates.reduce((sum, est) => sum + est.soil.cubicYards, 0),
    bags40lb: bedEstimates.reduce((sum, est) => sum + est.soil.bags40lb, 0),
    soilMix: {
      topsoil: bedEstimates.reduce((sum, est) => sum + est.soil.soilMix.topsoil, 0),
      compost: bedEstimates.reduce((sum, est) => sum + est.soil.soilMix.compost, 0),
      peatMoss: bedEstimates.reduce((sum, est) => sum + est.soil.soilMix.peatMoss, 0),
      vermiculite: bedEstimates.reduce((sum, est) => sum + est.soil.soilMix.vermiculite, 0),
    },
    estimatedCost: bedEstimates.reduce((sum, est) => sum + est.soil.estimatedCost, 0),
  }

  // Aggregate lumber (combine pieces of same size)
  const allPieces = bedEstimates.flatMap(est => est.lumber.pieces)
  const pieceMap = new Map<string, { quantity: number; boardFeet: number }>()

  allPieces.forEach(piece => {
    const existing = pieceMap.get(piece.size) || { quantity: 0, boardFeet: 0 }
    pieceMap.set(piece.size, {
      quantity: existing.quantity + piece.quantity,
      boardFeet: existing.boardFeet + piece.boardFeet,
    })
  })

  const totalLumber: LumberCalculation = {
    boardFeet: bedEstimates.reduce((sum, est) => sum + est.lumber.boardFeet, 0),
    pieces: Array.from(pieceMap.entries()).map(([size, data]) => ({
      size,
      quantity: data.quantity,
      boardFeet: data.boardFeet,
    })),
    brackets: bedEstimates.reduce((sum, est) => sum + est.lumber.brackets, 0),
    screws: bedEstimates.reduce((sum, est) => sum + est.lumber.screws, 0),
    estimatedCost: bedEstimates.reduce((sum, est) => sum + est.lumber.estimatedCost, 0),
  }

  const totalCost = totalSoil.estimatedCost + totalLumber.estimatedCost

  return {
    beds: bedEstimates,
    total: {
      soil: totalSoil,
      lumber: totalLumber,
      totalCost,
    },
  }
}

/**
 * Format cubic yards for display (handles fractions nicely)
 */
export function formatCubicYards(cubicYards: number): string {
  if (cubicYards < 0.1) {
    return `${Math.ceil(cubicYards * 27)} cu ft`
  }
  return `${cubicYards.toFixed(2)} cu yd`
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}
