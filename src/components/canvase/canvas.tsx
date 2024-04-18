import React, { useCallback, useState } from 'react'
import { useCanvasDrawing } from './hooks/use-canvas-drawing'
import { UseCanvasConfirm } from './hooks/use-canvas-confirm'
import { useCanvasState } from './hooks/use-canvas-state'
import { useCanvasAction } from './hooks/use-canvas-action'
import { useCanvasContext } from './context/canvas-provider'
interface Point {
  x: number
  y: number
}
/*
  캔버스
 */
export const Canvas = () => {
  const { ...props } = useCanvasContext()
  const { canvasRef, ctx } = useCanvasState()
  const { isDrawing, setIsDrawing, draw, setPoints, points, tool, color } = useCanvasDrawing(canvasRef, ctx, {
    ...props,
  })
  const { initCanvas, saveCanvas } = UseCanvasConfirm(ctx, canvasRef)
  const { setUndoActions, undoCanvas, redoCanvas } = useCanvasAction(ctx)
  // 드로잉 상태 추적 state
  const [currentPath, setCurrentPath] = useState<Point[]>([])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setIsDrawing(true)
      setCurrentPath([{ x, y }])
    },
    [setIsDrawing, setCurrentPath],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)

    setUndoActions((prevActions) => [
      ...prevActions,
      { type: tool, color, lineWidth: props.lineWidth, paths: [...currentPath] },
    ])

    setCurrentPath([])
  }, [isDrawing, setIsDrawing, setUndoActions, tool, color, props.lineWidth, currentPath])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCurrentPath((currentPath) => [...currentPath, { x, y }])

      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(currentPath[0].x, currentPath[0].y)
        currentPath.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.lineTo(x, y)
        ctx.strokeStyle = tool === 'eraser' ? '#FFF' : color
        ctx.lineWidth = props.lineWidth
        ctx.stroke()
        ctx.closePath()
      }
    },
    [isDrawing, currentPath, ctx, tool, color, props.lineWidth],
  )

  return (
    <div className="flex flex-col p-4 bg-gray-light rounded-lg shadow">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="rounded border-gray"
      />
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div className="flex gap-2">
          <CanvasButton onClick={undoCanvas}>◀️</CanvasButton>
          <CanvasButton onClick={redoCanvas}>▶️</CanvasButton>
        </div>
        <div className="flex gap-2">
          <CanvasButton onClick={initCanvas}>초기화</CanvasButton>
          <CanvasButton onClick={saveCanvas}>이미지 저장</CanvasButton>
        </div>
      </div>
    </div>
  )
}

const CanvasButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="mt-4 py-2 px-4 bg-blue text-white rounded ">
    {children}
  </button>
)
