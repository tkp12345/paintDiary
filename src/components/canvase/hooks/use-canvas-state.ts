import { useEffect, useRef, useState } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'

export const useCanvasState = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (context) {
      context.fillStyle = INIT_BACKGROUND_CANVAS
      context.fillRect(0, 0, canvas.width, canvas.height)
      setCtx(context)
    }
  }, [])

  return { canvasRef, ctx }
}
