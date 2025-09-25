import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export interface SiteData {
  location: {
    lat: number
    lng: number
    address?: string
    city?: string
    country?: string
  }
  climate: {
    zone: string
    koppen: string
    avgTemp: number
    rainfall: number
    frostDates?: {
      lastSpring: string
      firstFall: string
    }
  }
  soil: {
    type: string
    ph: number
    organic: number
    drainage: string
    recommendations?: string[]
  }
  elevation: {
    meters: number
    slope: number
    aspect: string
  }
}

export interface PlanData {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'reviewed' | 'final'
  site: SiteData
  design: {
    beds: any[]
    paths: any[]
    structures: any[]
    plants: any[]
  }
  materials?: {
    lumber?: any[]
    soil?: any[]
    amendments?: any[]
    irrigation?: any[]
  }
  costs?: {
    estimated: number
    breakdown: Record<string, number>
  }
}

export class ReportGenerator {
  private plan: PlanData

  constructor(plan: PlanData) {
    this.plan = plan
  }

  // Generate complete report as HTML
  generateHTML(): string {
    const sections = [
      this.generateHeader(),
      this.generateExecutiveSummary(),
      this.generateLayoutOverview(),
      this.generatePlantingPlan(),
      this.generateMaterials(),
      this.generateWaterPlan(),
      this.generateSoilAmendments(),
      this.generateSchedule(),
      this.generateRisksAndNext(),
      this.generateFooter()
    ]

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.plan.name} - Permaculture Plan Report</title>
        <style>
          @page { size: A4; margin: 2cm; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            border-bottom: 3px solid #16a34a;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          h1 { color: #16a34a; font-size: 2.5em; margin-bottom: 10px; }
          h2 {
            color: #15803d;
            font-size: 1.8em;
            margin-top: 40px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          h3 { color: #166534; font-size: 1.3em; margin-top: 25px; }
          .draft-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(22, 163, 74, 0.1);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .stat-card {
            background: #f0fdf4;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #16a34a;
          }
          .stat-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
          }
          .stat-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #16a34a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f0fdf4;
            color: #15803d;
            font-weight: 600;
          }
          .warning {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .pro-review-cta {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin: 40px 0;
          }
          .pro-review-cta h3 {
            color: white;
            margin-top: 0;
          }
          .btn {
            background: white;
            color: #16a34a;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin-top: 15px;
          }
          .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 0.9em;
          }
          @media print {
            .pro-review-cta { page-break-inside: avoid; }
            .warning { page-break-inside: avoid; }
            h2 { page-break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="draft-watermark">DRAFT</div>
        ${sections.join('')}
      </body>
      </html>
    `
  }

  // Generate PDF from HTML
  async generatePDF(): Promise<Blob> {
    const html = this.generateHTML()

    // Create temporary div to render HTML
    const container = document.createElement('div')
    container.innerHTML = html
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.width = '210mm' // A4 width
    document.body.appendChild(container)

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false
      })

      // Convert canvas to PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297 // A4 height in mm

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }

      // Return as blob
      return pdf.output('blob')
    } finally {
      document.body.removeChild(container)
    }
  }

  // Generate report sections
  private generateHeader(): string {
    const date = new Date().toLocaleDateString()
    return `
      <div class="header">
        <h1>${this.plan.name}</h1>
        <p><strong>Permaculture Design Plan - DRAFT</strong></p>
        <p>Generated: ${date} | Status: ${this.plan.status.toUpperCase()}</p>
        ${this.plan.site.location.address ? `<p>Location: ${this.plan.site.location.address}</p>` : ''}
      </div>
    `
  }

  private generateExecutiveSummary(): string {
    const bedCount = this.plan.design.beds?.length || 0
    const plantCount = this.plan.design.plants?.length || 0
    const structureCount = this.plan.design.structures?.length || 0

    return `
      <section>
        <h2>Executive Summary</h2>
        <p>This permaculture design plan provides a comprehensive layout for sustainable food production
        optimized for your specific site conditions and goals.</p>

        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-label">Climate Zone</div>
            <div class="stat-value">${this.plan.site.climate.zone}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Garden Beds</div>
            <div class="stat-value">${bedCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Plant Varieties</div>
            <div class="stat-value">${plantCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Structures</div>
            <div class="stat-value">${structureCount}</div>
          </div>
        </div>

        <h3>Site Characteristics</h3>
        <ul>
          <li><strong>Climate:</strong> ${this.plan.site.climate.koppen} - Average ${this.plan.site.climate.avgTemp}°C, ${this.plan.site.climate.rainfall}mm annual rainfall</li>
          <li><strong>Soil:</strong> ${this.plan.site.soil.type}, pH ${this.plan.site.soil.ph}, ${this.plan.site.soil.drainage} drainage</li>
          <li><strong>Elevation:</strong> ${this.plan.site.elevation.meters}m, ${this.plan.site.elevation.slope}° slope, ${this.plan.site.elevation.aspect} facing</li>
          ${this.plan.site.climate.frostDates ?
            `<li><strong>Frost Dates:</strong> Last spring: ${this.plan.site.climate.frostDates.lastSpring}, First fall: ${this.plan.site.climate.frostDates.firstFall}</li>` : ''}
        </ul>
      </section>
    `
  }

  private generateLayoutOverview(): string {
    return `
      <section>
        <h2>Layout Overview</h2>
        <p>The design incorporates permaculture principles including zones, sectors, and stacking functions.</p>

        <h3>Garden Beds</h3>
        <table>
          <thead>
            <tr>
              <th>Bed Name</th>
              <th>Dimensions</th>
              <th>Orientation</th>
              <th>Features</th>
            </tr>
          </thead>
          <tbody>
            ${this.plan.design.beds.map(bed => `
              <tr>
                <td>${bed.name || 'Unnamed Bed'}</td>
                <td>${bed.width}' × ${bed.length}'</td>
                <td>${bed.orientation || 'N/S'}</td>
                <td>${bed.features?.join(', ') || 'Standard'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${this.plan.design.structures.length > 0 ? `
          <h3>Structures & Features</h3>
          <ul>
            ${this.plan.design.structures.map(s =>
              `<li><strong>${s.name}:</strong> ${s.description || s.type}</li>`
            ).join('')}
          </ul>
        ` : ''}
      </section>
    `
  }

  private generatePlantingPlan(): string {
    // Group plants by type
    const vegetables = this.plan.design.plants.filter(p => p.category === 'vegetables')
    const herbs = this.plan.design.plants.filter(p => p.category === 'herbs')
    const fruits = this.plan.design.plants.filter(p => p.category === 'fruits')

    return `
      <section>
        <h2>Planting Plan</h2>

        ${vegetables.length > 0 ? `
          <h3>Vegetables (${vegetables.length} varieties)</h3>
          <table>
            <thead>
              <tr>
                <th>Plant</th>
                <th>Quantity</th>
                <th>Spacing</th>
                <th>Companions</th>
              </tr>
            </thead>
            <tbody>
              ${vegetables.map(plant => `
                <tr>
                  <td>${plant.name}</td>
                  <td>${plant.quantity || 1}</td>
                  <td>${plant.spacing || 'See packet'}</td>
                  <td>${plant.companions?.join(', ') || 'Any'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${herbs.length > 0 ? `
          <h3>Herbs (${herbs.length} varieties)</h3>
          <ul>
            ${herbs.map(herb =>
              `<li><strong>${herb.name}:</strong> ${herb.uses?.join(', ') || 'Culinary/medicinal'}</li>`
            ).join('')}
          </ul>
        ` : ''}

        ${fruits.length > 0 ? `
          <h3>Fruits & Perennials (${fruits.length} varieties)</h3>
          <ul>
            ${fruits.map(fruit =>
              `<li><strong>${fruit.name}:</strong> Zone ${fruit.zone || 'Check locally'}, ${fruit.yearsToFruit || '2-3'} years to fruit</li>`
            ).join('')}
          </ul>
        ` : ''}
      </section>
    `
  }

  private generateMaterials(): string {
    if (!this.plan.materials) return ''

    return `
      <section>
        <h2>Materials & Cost Estimates</h2>
        <div class="warning">
          <strong>Note:</strong> Costs are estimates only. Prices vary by location and supplier.
          Contact local suppliers for current pricing.
        </div>

        ${this.plan.materials.lumber ? `
          <h3>Lumber & Construction</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              ${this.plan.materials.lumber.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity} ${item.unit}</td>
                  <td>$${item.cost || 'TBD'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${this.plan.costs ? `
          <h3>Total Estimated Cost</h3>
          <div class="stat-card">
            <div class="stat-label">Budget Range</div>
            <div class="stat-value">$${this.plan.costs.estimated}</div>
          </div>
        ` : ''}
      </section>
    `
  }

  private generateWaterPlan(): string {
    return `
      <section>
        <h2>Water Management Plan</h2>

        <h3>Irrigation Strategy</h3>
        <p>Based on your climate (${this.plan.site.climate.rainfall}mm annual rainfall) and soil type
        (${this.plan.site.soil.drainage} drainage), we recommend:</p>
        <ul>
          <li>Primary: Drip irrigation for water efficiency</li>
          <li>Backup: Hand watering for seedlings and spot needs</li>
          ${this.plan.site.climate.rainfall < 500 ?
            '<li>Consider: Rainwater harvesting system</li>' : ''}
        </ul>

        <h3>Water Conservation</h3>
        <ul>
          <li>Mulch all beds 3-4" deep to reduce evaporation</li>
          <li>Group plants by water needs</li>
          <li>Install timers on irrigation systems</li>
          <li>Consider greywater for non-edibles (check local codes)</li>
        </ul>
      </section>
    `
  }

  private generateSoilAmendments(): string {
    const recommendations = this.plan.site.soil.recommendations || [
      'Add 2-3" compost annually',
      'Test soil every 2-3 years',
      'Adjust pH as needed for specific crops'
    ]

    return `
      <section>
        <h2>Soil & Amendments</h2>

        <h3>Current Soil Analysis</h3>
        <ul>
          <li>Type: ${this.plan.site.soil.type}</li>
          <li>pH: ${this.plan.site.soil.ph}</li>
          <li>Organic Matter: ${this.plan.site.soil.organic}%</li>
          <li>Drainage: ${this.plan.site.soil.drainage}</li>
        </ul>

        <h3>Recommended Amendments</h3>
        <ul>
          ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>

        <h3>Volume Calculations</h3>
        <p>Total bed area: ${this.calculateBedArea()} sq ft</p>
        <p>Compost needed (3" layer): ${Math.ceil(this.calculateBedArea() * 0.25)} cubic feet</p>
        <p>Mulch needed (4" layer): ${Math.ceil(this.calculateBedArea() * 0.33)} cubic feet</p>
      </section>
    `
  }

  private generateSchedule(): string {
    const tasks = this.generateTasks()

    return `
      <section>
        <h2>Implementation Schedule</h2>
        <p>Recommended tasks for the next 90 days:</p>

        <h3>Immediate (Week 1-2)</h3>
        <ul>
          ${tasks.immediate.map(task => `<li>${task}</li>`).join('')}
        </ul>

        <h3>Short-term (Week 3-4)</h3>
        <ul>
          ${tasks.shortTerm.map(task => `<li>${task}</li>`).join('')}
        </ul>

        <h3>Medium-term (Month 2-3)</h3>
        <ul>
          ${tasks.mediumTerm.map(task => `<li>${task}</li>`).join('')}
        </ul>
      </section>
    `
  }

  private generateRisksAndNext(): string {
    return `
      <section>
        <h2>Risks & Considerations</h2>

        <div class="warning">
          <h3>⚠️ Important Notes</h3>
          <ul>
            <li>This is a DRAFT plan - professional review recommended</li>
            <li>Check local building codes before constructing raised beds over 24"</li>
            <li>Verify plant hardiness for your specific microclimate</li>
            <li>Test soil before adding major amendments</li>
          </ul>
        </div>

        <h3>Climate Risks</h3>
        <ul>
          ${this.plan.site.climate.zone <= '6' ?
            '<li>Late frost risk - use row covers for early plantings</li>' : ''}
          ${this.plan.site.climate.rainfall < 400 ?
            '<li>Low rainfall - drought-resistant varieties recommended</li>' : ''}
          ${this.plan.site.elevation.slope > 10 ?
            '<li>Slope erosion risk - consider terracing or retaining walls</li>' : ''}
        </ul>

        <div class="pro-review-cta">
          <h3>Ready for Professional Input?</h3>
          <p>Get your plan reviewed by a certified permaculture designer.
          They can help optimize your design, suggest local varieties, and ensure success.</p>
          <a href="/consult" class="btn">Get Professional Review</a>
        </div>
      </section>
    `
  }

  private generateFooter(): string {
    return `
      <footer class="footer">
        <p><strong>Disclaimers:</strong></p>
        <ul>
          <li>This is a DRAFT plan for educational purposes</li>
          <li>Not for construction permits or legal compliance</li>
          <li>Consult local experts for site-specific advice</li>
          <li>Data sources: WorldClim, SoilGrids, NASA POWER, USDA</li>
        </ul>
        <p>© ${new Date().getFullYear()} Permaculture Planner - Free & Open Source</p>
      </footer>
    `
  }

  // Helper methods
  private calculateBedArea(): number {
    return this.plan.design.beds.reduce((total, bed) => {
      return total + (bed.width * bed.length)
    }, 0)
  }

  private generateTasks() {
    return {
      immediate: [
        'Order soil test kit',
        'Clear and level bed areas',
        'Source materials locally',
        'Set up compost system'
      ],
      shortTerm: [
        'Build raised beds',
        'Install irrigation lines',
        'Add soil and amendments',
        'Start seeds indoors'
      ],
      mediumTerm: [
        'Transplant seedlings',
        'Mulch all beds',
        'Install trellises',
        'Set up rainwater collection'
      ]
    }
  }

  // Export to JSON
  exportJSON(): string {
    return JSON.stringify(this.plan, null, 2)
  }
}