import React, { useEffect, useRef } from 'react'
import { useCanvasDrawing } from './hooks/use-canvas-drawing'
import { UseCanvasConfirm } from './hooks/use-canvas-confirm'
import { useCanvasContext } from './context/canvas-provider'

/*
  캔버스
 */
export const Canvas = () => {
  const { ...props } = useCanvasContext()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { setCtx, setIsDrawing, draw, setPoints, ctx, points, tool, color } = useCanvasDrawing(canvasRef, props)
  const { initCanvas, saveCanvas } = UseCanvasConfirm(ctx, canvasRef)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const startDrawing = (e: MouseEvent) => {
      setIsDrawing(true)
      setPoints([{ x: e.offsetX, y: e.offsetY }])
    }

    const endDrawing = () => {
      setIsDrawing(false)
      setPoints([])
    }

    /*
     마우스 down,up 시 Point 상태를 초기화 해줘야함
     */
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mouseup', endDrawing)

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', startDrawing)
        canvas.removeEventListener('mouseup', endDrawing)
      }
    }
  }, [ctx, points, tool, color, canvasRef])

  return (
    <div className="flex flex-col items-center justify-center p-4 space-x-2  bg-gray-light rounded-lg shadow">
      <canvas ref={canvasRef} width={800} height={600} onMouseMove={draw} className="border-1 border-gray" />
      <CanvasButton onClick={initCanvas}>초기화</CanvasButton>
      <CanvasButton onClick={saveCanvas}>이미지 저장</CanvasButton>
    </div>
  )
}

const CanvasButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="mt-4 py-2 px-4 bg-blue text-white rounded hover:bg-blue-dark">
    {children}
  </button>
)
