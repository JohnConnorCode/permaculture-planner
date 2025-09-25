/**
 * Site Plan Exporter
 * Exports garden designs as high-quality SVG or PNG images
 * Includes legends, dimensions, and professional annotations
 */

import { GardenPlan } from '@/types'

export interface ExportOptions {
  format: 'svg' | 'png'
  scale: number
  showGrid: boolean
  showDimensions: boolean
  showLegend: boolean
  showNorthArrow: boolean
  showScale: boolean
  title?: string
  designer?: string
  date?: string
  notes?: string[]
  quality?: 'draft' | 'final'
}

export class SitePlanExporter {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private scale = 1
  private padding = 100
  private colors = {
    background: '#ffffff',
    grid: '#e0e0e0',
    border: '#333333',
    bed: '#8B4513',
    path: '#9E9E9E',
    water: '#4FC3F7',
    structure: '#795548',
    plant: {
      tree: '#2E7D32',
      shrub: '#558B2F',
      perennial: '#689F38',
      annual: '#8BC34A',
      herb: '#9CCC65',
      groundcover: '#AED581'
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
      label: '#424242'
    },
    annotation: '#FF5722'
  }

  /**
   * Export the garden plan as SVG or PNG
   */
  async export(
    plan: GardenPlan,
    options: ExportOptions
  ): Promise<Blob> {
    if (options.format === 'svg') {
      return this.exportSVG(plan, options)
    } else {
      return this.exportPNG(plan, options)
    }
  }

  /**
   * Export as SVG
   */
  private async exportSVG(
    plan: GardenPlan,
    options: ExportOptions
  ): Promise<Blob> {
    const svg = this.generateSVG(plan, options)
    return new Blob([svg], { type: 'image/svg+xml' })
  }

  /**
   * Export as PNG
   */
  private async exportPNG(
    plan: GardenPlan,
    options: ExportOptions
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const svg = this.generateSVG(plan, options)
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const scale = options.scale || 2
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        ctx.scale(scale, scale)
        ctx.fillStyle = this.colors.background
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert canvas to blob'))
          }
        }, 'image/png')
      }
      
      img.onerror = () => reject(new Error('Failed to load SVG image'))
      img.src = 'data:image/svg+xml;base64,' + btoa(svg)
    })
  }

  /**
   * Generate SVG string
   */
  private generateSVG(
    plan: GardenPlan,
    options: ExportOptions
  ): string {
    const width = plan.dimensions.width * 50 + this.padding * 2
    const height = plan.dimensions.length * 50 + this.padding * 2 + 200 // Extra for header/legend

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
`
    svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
`
    
    // Background
    svg += `  <rect width="${width}" height="${height}" fill="${this.colors.background}"/>
`
    
    // Title and metadata
    if (options.title || options.designer || options.date) {
      svg += this.generateHeader(options, width)
    }
    
    // Main drawing area
    svg += `  <g transform="translate(${this.padding}, ${this.padding + 50})">
`
    
    // Grid
    if (options.showGrid) {
      svg += this.generateGrid(plan.dimensions.width, plan.dimensions.length)
    }
    
    // Garden beds
    plan.beds.forEach((bed, index) => {
      svg += this.generateBed(bed, index)
    })
    
    // Plants
    plan.plants?.forEach((plant) => {
      svg += this.generatePlant(plant)
    })
    
    // Structures
    plan.structures?.forEach((structure) => {
      svg += this.generateStructure(structure)
    })
    
    // Paths
    plan.paths?.forEach((path) => {
      svg += this.generatePath(path)
    })
    
    // Dimensions
    if (options.showDimensions) {
      svg += this.generateDimensions(plan.dimensions)
    }
    
    svg += `  </g>
`
    
    // North arrow
    if (options.showNorthArrow) {
      svg += this.generateNorthArrow(width - 100, 100)
    }
    
    // Scale
    if (options.showScale) {
      svg += this.generateScale(this.padding, height - 80)
    }
    
    // Legend
    if (options.showLegend) {
      svg += this.generateLegend(plan, width - 250, height - 300)
    }
    
    // Notes
    if (options.notes && options.notes.length > 0) {
      svg += this.generateNotes(options.notes, this.padding, height - 150)
    }
    
    // Watermark for draft
    if (options.quality === 'draft') {
      svg += this.generateWatermark(width, height)
    }
    
    svg += `</svg>`
    return svg
  }

  private generateHeader(
    options: ExportOptions,
    width: number
  ): string {
    let svg = `  <g id="header">
`
    let y = 30
    
    if (options.title) {
      svg += `    <text x="${width / 2}" y="${y}" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${this.colors.text.primary}">${options.title}</text>
`
      y += 25
    }
    
    if (options.designer || options.date) {
      const metadata = []
      if (options.designer) metadata.push(`Designer: ${options.designer}`)
      if (options.date) metadata.push(`Date: ${options.date}`)
      svg += `    <text x="${width / 2}" y="${y}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="${this.colors.text.secondary}">${metadata.join(' | ')}</text>
`
    }
    
    svg += `  </g>
`
    return svg
  }

  private generateGrid(width: number, length: number): string {
    let svg = `    <g id="grid" opacity="0.3">
`
    const gridSize = 50
    
    // Vertical lines
    for (let x = 0; x <= width * gridSize; x += gridSize) {
      svg += `      <line x1="${x}" y1="0" x2="${x}" y2="${length * gridSize}" stroke="${this.colors.grid}" stroke-width="1"/>
`
    }
    
    // Horizontal lines
    for (let y = 0; y <= length * gridSize; y += gridSize) {
      svg += `      <line x1="0" y1="${y}" x2="${width * gridSize}" y2="${y}" stroke="${this.colors.grid}" stroke-width="1"/>
`
    }
    
    svg += `    </g>
`
    return svg
  }

  private generateBed(bed: any, index: number): string {
    const x = (bed.position?.x || 0) * 50
    const y = (bed.position?.y || 0) * 50
    const width = bed.width * 50
    const height = bed.length * 50
    
    let svg = `    <g id="bed-${index}">
`
    
    // Bed outline
    svg += `      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${this.colors.bed}" stroke-width="3" rx="5"/>
`
    
    // Bed fill with pattern
    svg += `      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${this.colors.bed}" opacity="0.1"/>
`
    
    // Bed label
    if (bed.name) {
      svg += `      <text x="${x + width / 2}" y="${y + height / 2}" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="${this.colors.text.label}">${bed.name}</text>
`
    }
    
    svg += `    </g>
`
    return svg
  }

  private generatePlant(plant: any): string {
    const x = (plant.position?.x || 0) * 50
    const y = (plant.position?.y || 0) * 50
    const radius = plant.size || 15
    const color = this.getPlantColor(plant.type)
    
    let svg = `    <g id="plant-${plant.id}">
`
    
    // Plant circle
    svg += `      <circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="0.7"/>
`
    
    // Plant symbol
    if (plant.type === 'tree') {
      svg += `      <path d="M${x - 10},${y} L${x},${y - 15} L${x + 10},${y} Z" fill="${color}"/>
`
    }
    
    // Plant label
    if (plant.name) {
      svg += `      <text x="${x}" y="${y + radius + 15}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="${this.colors.text.label}">${plant.name}</text>
`
    }
    
    svg += `    </g>
`
    return svg
  }

  private generateStructure(structure: any): string {
    const x = (structure.position?.x || 0) * 50
    const y = (structure.position?.y || 0) * 50
    const width = (structure.width || 2) * 50
    const height = (structure.height || 2) * 50
    
    let svg = `    <g id="structure-${structure.id}">
`
    
    // Structure shape
    if (structure.type === 'compost') {
      svg += `      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${this.colors.structure}" opacity="0.5" stroke="${this.colors.structure}" stroke-width="2"/>
`
      svg += `      <text x="${x + width / 2}" y="${y + height / 2}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">COMPOST</text>
`
    } else if (structure.type === 'water') {
      svg += `      <ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="${this.colors.water}" opacity="0.5" stroke="${this.colors.water}" stroke-width="2"/>
`
      svg += `      <text x="${x + width / 2}" y="${y + height / 2}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">WATER</text>
`
    } else {
      svg += `      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${this.colors.structure}" opacity="0.3" stroke="${this.colors.structure}" stroke-width="2" stroke-dasharray="5,5"/>
`
    }
    
    svg += `    </g>
`
    return svg
  }

  private generatePath(path: any): string {
    const points = path.points.map((p: any) => `${p.x * 50},${p.y * 50}`).join(' ')
    
    return `    <polyline points="${points}" fill="none" stroke="${this.colors.path}" stroke-width="${path.width * 50}" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
`
  }

  private generateDimensions(dimensions: any): string {
    let svg = `    <g id="dimensions" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.secondary}">
`
    const width = dimensions.width * 50
    const height = dimensions.length * 50
    
    // Width dimension
    svg += `      <line x1="0" y1="-20" x2="${width}" y2="-20" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <line x1="0" y1="-25" x2="0" y2="-15" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <line x1="${width}" y1="-25" x2="${width}" y2="-15" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <text x="${width / 2}" y="-25" text-anchor="middle">${dimensions.width}m</text>
`
    
    // Length dimension
    svg += `      <line x1="-20" y1="0" x2="-20" y2="${height}" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <line x1="-25" y1="0" x2="-15" y2="0" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <line x1="-25" y1="${height}" x2="-15" y2="${height}" stroke="${this.colors.text.secondary}" stroke-width="1"/>
`
    svg += `      <text x="-30" y="${height / 2}" text-anchor="middle" transform="rotate(-90, -30, ${height / 2})">${dimensions.length}m</text>
`
    
    svg += `    </g>
`
    return svg
  }

  private generateNorthArrow(x: number, y: number): string {
    return `
    <g id="north-arrow" transform="translate(${x}, ${y})">
      <circle cx="0" cy="0" r="30" fill="white" stroke="${this.colors.border}" stroke-width="2"/>
      <path d="M0,-25 L-10,10 L0,5 L10,10 Z" fill="${this.colors.text.primary}"/>
      <text x="0" y="-10" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="${this.colors.text.primary}">N</text>
    </g>
`
  }

  private generateScale(x: number, y: number): string {
    let svg = `    <g id="scale" transform="translate(${x}, ${y})">
`
    svg += `      <text x="0" y="-5" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.secondary}">Scale: 1m = 50px</text>
`
    svg += `      <rect x="0" y="0" width="50" height="10" fill="${this.colors.text.primary}"/>
`
    svg += `      <rect x="50" y="0" width="50" height="10" fill="white" stroke="${this.colors.text.primary}" stroke-width="1"/>
`
    svg += `      <text x="0" y="25" font-family="Arial, sans-serif" font-size="10" fill="${this.colors.text.secondary}">0</text>
`
    svg += `      <text x="50" y="25" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="${this.colors.text.secondary}">1m</text>
`
    svg += `      <text x="100" y="25" font-family="Arial, sans-serif" font-size="10" text-anchor="end" fill="${this.colors.text.secondary}">2m</text>
`
    svg += `    </g>
`
    return svg
  }

  private generateLegend(plan: any, x: number, y: number): string {
    let svg = `    <g id="legend" transform="translate(${x}, ${y})">
`
    svg += `      <rect x="-10" y="-10" width="240" height="280" fill="white" stroke="${this.colors.border}" stroke-width="1" rx="5"/>
`
    svg += `      <text x="0" y="10" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${this.colors.text.primary}">Legend</text>
`
    
    let yOffset = 35
    
    // Plant types
    const plantTypes = ['tree', 'shrub', 'perennial', 'annual', 'herb']
    plantTypes.forEach(type => {
      const color = this.getPlantColor(type)
      svg += `      <circle cx="10" cy="${yOffset}" r="8" fill="${color}" opacity="0.7"/>
`
      svg += `      <text x="25" y="${yOffset + 5}" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.primary}">${type.charAt(0).toUpperCase() + type.slice(1)}</text>
`
      yOffset += 25
    })
    
    // Structures
    svg += `      <rect x="2" y="${yOffset - 8}" width="16" height="16" fill="${this.colors.structure}" opacity="0.5"/>
`
    svg += `      <text x="25" y="${yOffset + 5}" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.primary}">Structure</text>
`
    yOffset += 25
    
    // Water
    svg += `      <ellipse cx="10" cy="${yOffset}" rx="8" ry="6" fill="${this.colors.water}" opacity="0.5"/>
`
    svg += `      <text x="25" y="${yOffset + 5}" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.primary}">Water Feature</text>
`
    yOffset += 25
    
    // Path
    svg += `      <rect x="2" y="${yOffset - 4}" width="16" height="8" fill="${this.colors.path}" opacity="0.5"/>
`
    svg += `      <text x="25" y="${yOffset + 5}" font-family="Arial, sans-serif" font-size="12" fill="${this.colors.text.primary}">Path/Walkway</text>
`
    
    svg += `    </g>
`
    return svg
  }

  private generateNotes(notes: string[], x: number, y: number): string {
    let svg = `    <g id="notes" transform="translate(${x}, ${y})">
`
    svg += `      <text x="0" y="0" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${this.colors.text.primary}">Notes:</text>
`
    
    notes.forEach((note, index) => {
      svg += `      <text x="0" y="${20 + index * 18}" font-family="Arial, sans-serif" font-size="11" fill="${this.colors.text.secondary}">• ${note}</text>
`
    })
    
    svg += `    </g>
`
    return svg
  }

  private generateWatermark(width: number, height: number): string {
    return `
    <g id="watermark" opacity="0.1">
      <text x="${width / 2}" y="${height / 2}" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="${this.colors.text.secondary}" transform="rotate(-45, ${width / 2}, ${height / 2})">DRAFT</text>
    </g>
`
  }

  private getPlantColor(type: string): string {
    return this.colors.plant[type as keyof typeof this.colors.plant] || this.colors.plant.perennial
  }

  /**
   * Generate filename for export
   */
  generateFilename(
    planName: string,
    format: 'svg' | 'png',
    quality: 'draft' | 'final'
  ): string {
    const date = new Date().toISOString().split('T')[0]
    const sanitizedName = planName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    return `${sanitizedName}_site_plan_${quality}_${date}.${format}`
  }
}

export const sitePlanExporter = new SitePlanExporter()