import { BaseTool } from '../tools/BaseTool'
import { PointerEvent as ScenePointerEvent } from '../scene/sceneTypes'

export interface InputManagerOptions {
  element: HTMLElement
  worldToScreen: (point: { xIn: number; yIn: number }) => { x: number; y: number }
  screenToWorld: (point: { x: number; y: number }) => { xIn: number; yIn: number }
}

export class InputManager {
  private element: HTMLElement
  private currentTool: BaseTool | null = null
  private shortcuts: Map<string, () => void> = new Map()
  private worldToScreen: InputManagerOptions['worldToScreen']
  private screenToWorld: InputManagerOptions['screenToWorld']
  
  constructor(options: InputManagerOptions) {
    this.element = options.element
    this.worldToScreen = options.worldToScreen
    this.screenToWorld = options.screenToWorld
    
    this.setupEventListeners()
    this.setupDefaultShortcuts()
  }
  
  setActiveTool(tool: BaseTool | null): void {
    if (this.currentTool) {
      this.currentTool.deactivate()
    }
    
    this.currentTool = tool
    
    if (this.currentTool) {
      this.currentTool.activate()
      this.element.style.cursor = this.currentTool.cursor
    } else {
      this.element.style.cursor = 'default'
    }
  }
  
  registerShortcut(key: string, callback: () => void): void {
    this.shortcuts.set(key, callback)
  }
  
  private setupEventListeners(): void {
    // Pointer events
    this.element.addEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.element.addEventListener('pointermove', this.handlePointerMove.bind(this))
    this.element.addEventListener('pointerup', this.handlePointerUp.bind(this))
    this.element.addEventListener('pointercancel', this.handlePointerUp.bind(this))
    
    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
    
    // Wheel events for zoom
    this.element.addEventListener('wheel', this.handleWheel.bind(this), { passive: false })
    
    // Context menu
    this.element.addEventListener('contextmenu', (e) => e.preventDefault())
  }
  
  private setupDefaultShortcuts(): void {
    // Tool shortcuts
    this.registerShortcut('v', () => this.onToolChange?.('select'))
    this.registerShortcut('b', () => this.onToolChange?.('draw-bed'))
    this.registerShortcut('p', () => this.onToolChange?.('draw-path'))
    this.registerShortcut('t', () => this.onToolChange?.('text'))
    this.registerShortcut('m', () => this.onToolChange?.('measure'))
    
    // View shortcuts
    this.registerShortcut('cmd+0', () => this.onZoomReset?.())
    this.registerShortcut('ctrl+0', () => this.onZoomReset?.())
    this.registerShortcut('cmd+=', () => this.onZoomIn?.())
    this.registerShortcut('ctrl+=', () => this.onZoomIn?.())
    this.registerShortcut('cmd+-', () => this.onZoomOut?.())
    this.registerShortcut('ctrl+-', () => this.onZoomOut?.())
    
    // Edit shortcuts
    this.registerShortcut('cmd+z', () => this.onUndo?.())
    this.registerShortcut('ctrl+z', () => this.onUndo?.())
    this.registerShortcut('cmd+shift+z', () => this.onRedo?.())
    this.registerShortcut('ctrl+shift+z', () => this.onRedo?.())
    this.registerShortcut('cmd+y', () => this.onRedo?.())
    this.registerShortcut('ctrl+y', () => this.onRedo?.())
    
    // File shortcuts
    this.registerShortcut('cmd+s', () => this.onSave?.())
    this.registerShortcut('ctrl+s', () => this.onSave?.())
    this.registerShortcut('cmd+o', () => this.onOpen?.())
    this.registerShortcut('ctrl+o', () => this.onOpen?.())
    this.registerShortcut('cmd+e', () => this.onExport?.())
    this.registerShortcut('ctrl+e', () => this.onExport?.())
  }
  
  private handlePointerDown(event: PointerEvent): void {
    if (!this.currentTool) return
    
    const rect = this.element.getBoundingClientRect()
    const screenPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    
    const worldPoint = this.screenToWorld(screenPoint)
    
    const sceneEvent: ScenePointerEvent = {
      pointerId: event.pointerId,
      pointerType: event.pointerType as 'mouse' | 'touch' | 'pen',
      screenX: screenPoint.x,
      screenY: screenPoint.y,
      worldX: worldPoint.xIn,
      worldY: worldPoint.yIn,
      pressure: event.pressure,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey
    }
    
    this.currentTool.onPointerDown(sceneEvent)
  }
  
  private handlePointerMove(event: PointerEvent): void {
    if (!this.currentTool) return
    
    const rect = this.element.getBoundingClientRect()
    const screenPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    
    const worldPoint = this.screenToWorld(screenPoint)
    
    const sceneEvent: ScenePointerEvent = {
      pointerId: event.pointerId,
      pointerType: event.pointerType as 'mouse' | 'touch' | 'pen',
      screenX: screenPoint.x,
      screenY: screenPoint.y,
      worldX: worldPoint.xIn,
      worldY: worldPoint.yIn,
      pressure: event.pressure,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey
    }
    
    this.currentTool.onPointerMove(sceneEvent)
  }
  
  private handlePointerUp(event: PointerEvent): void {
    if (!this.currentTool) return
    
    const rect = this.element.getBoundingClientRect()
    const screenPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    
    const worldPoint = this.screenToWorld(screenPoint)
    
    const sceneEvent: ScenePointerEvent = {
      pointerId: event.pointerId,
      pointerType: event.pointerType as 'mouse' | 'touch' | 'pen',
      screenX: screenPoint.x,
      screenY: screenPoint.y,
      worldX: worldPoint.xIn,
      worldY: worldPoint.yIn,
      pressure: event.pressure,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey
    }
    
    this.currentTool.onPointerUp(sceneEvent)
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    // Build shortcut string
    const parts: string[] = []
    if (event.metaKey) parts.push('cmd')
    if (event.ctrlKey && !event.metaKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')
    parts.push(event.key.toLowerCase())
    
    const shortcut = parts.join('+')
    
    // Check for registered shortcut
    const handler = this.shortcuts.get(shortcut)
    if (handler) {
      event.preventDefault()
      handler()
      return
    }
    
    // Pass to current tool
    if (this.currentTool) {
      this.currentTool.onKeyDown(event)
    }
  }
  
  private handleKeyUp(event: KeyboardEvent): void {
    if (this.currentTool) {
      this.currentTool.onKeyUp(event)
    }
  }
  
  private handleWheel(event: WheelEvent): void {
    event.preventDefault()
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1
    this.onZoom?.(delta, {
      x: event.clientX,
      y: event.clientY
    })
  }
  
  // Event callbacks
  onToolChange?: (toolId: string) => void
  onZoom?: (delta: number, center: { x: number; y: number }) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  onOpen?: () => void
  onExport?: () => void
  
  destroy(): void {
    this.element.removeEventListener('pointerdown', this.handlePointerDown.bind(this))
    this.element.removeEventListener('pointermove', this.handlePointerMove.bind(this))
    this.element.removeEventListener('pointerup', this.handlePointerUp.bind(this))
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    document.removeEventListener('keyup', this.handleKeyUp.bind(this))
  }
}