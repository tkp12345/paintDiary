import React from 'react'
import { useCanvasContext } from './context/canvas-provider'
import { Button } from '../ui/button'

export const CanvasToolbar = () => {
  const { color, setColor, tool, lineWidth, setLineWidth, setTool } = useCanvasContext()

  return (
    <div className="toolbar space-x-2 p-4 bg-gray-light rounded-lg shadow">
      <div className="flex flex-col gap-2">
        <Button active={tool === 'draw'} onClick={() => setTool('draw')}>
          🖌️ Brush
        </Button>
        <Button active={tool === 'erase'} onClick={() => setTool('erase')}>
          🧽 Eraser
        </Button>
      </div>
      <div className="flex flex-col  gap-4 mt-4">
        <label className="flex items-center gap-2">
          <span>색상:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-6 border-2 border-gray rounded"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>선 두께:</span>
          <input
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
            className="range range-primary w-full h-1 bg-blue rounded"
            style={{ backgroundSize: `${((lineWidth - 1) / 29) * 100}% 100%` }}
          />
        </label>
      </div>
    </div>
  )
}
