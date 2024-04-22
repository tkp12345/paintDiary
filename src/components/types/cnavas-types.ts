export interface CanvasType {
  color: string
  tool: CanvasToolType
  setTool: (tool: CanvasToolType) => void
  setColor: (color: string) => void
  lineWidth: number
  setLineWidth: (lineWidth: number) => void
}

export interface Point {
  x: number
  y: number
}

export type CanvasToolType = 'setup' | 'draw' | 'erase' | 'end' | 'reset'
