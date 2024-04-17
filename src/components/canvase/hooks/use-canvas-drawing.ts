import { forwardRef, RefObject, useCallback, useEffect, useState } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'
import { CanvasType } from '../../types/cnavas-types'

interface Point {
  x: number
  y: number
}

/*
 드로잉 액션 처리 훅스
 */
export const useCanvasDrawing = (ref: RefObject<HTMLCanvasElement>, props: CanvasType) => {
  const { color, lineWidth, tool } = props

  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [points, setPoints] = useState<Point[]>([])

  useEffect(() => {
    const canvas = ref.current

    if (canvas) {
      const renderCtx = canvas.getContext('2d')
      if (renderCtx) {
        renderCtx.fillStyle = INIT_BACKGROUND_CANVAS
        renderCtx.fillRect(0, 0, ref.current.width, ref.current.height)
        setCtx(renderCtx)
      }
    }
  }, [])

  const drawAction = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const newPoint: Point = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }
      setPoints((prev) => [...prev, newPoint])
      if (ctx) {
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        //두꼐
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = tool === 'eraser' ? '#FFF' : color
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        points.forEach((point) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.lineTo(newPoint.x, newPoint.y)
        ctx.stroke()
      }
    },
    [isDrawing, points, ctx, lineWidth, color, tool],
  )

  return { setCtx, setIsDrawing, draw: drawAction, setPoints, ctx, points, tool, color }
}
