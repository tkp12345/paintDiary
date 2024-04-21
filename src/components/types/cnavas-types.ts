export interface CanvasType {
  color: string
  tool: string
  setTool: (tool: string) => void
  setColor: (color: string) => void
  lineWidth: number
  setLineWidth: (lineWidth: number) => void
}

export interface Point {
  x: number
  y: number
}
