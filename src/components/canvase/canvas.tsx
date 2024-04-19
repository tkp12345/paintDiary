import React, { useCallback, useRef, useState } from 'react'
import { useCanvasDrawing } from './hooks/use-canvas-drawing'
import { useCanvasConfirm } from './hooks/use-canvas-confirm'
import { useCanvasState } from './hooks/use-canvas-state'
import { useCanvasAction } from './hooks/use-canvas-action'
import { useCanvasContext } from './context/canvas-provider'
import { CanvasConfirm } from './canvas-confirm'
import { useCanvasImgUpload } from './hooks/use-canvas-img-upload'

interface Point {
  x: number
  y: number
}

/*
  캔버스
 */
export const Canvas = () => {
  const { ...props } = useCanvasContext()
  // 드로잉 상태 추적 state
  const [currentPath, setCurrentPath] = useState<Point[]>([])
  // 업로드된 이미지
  const uploadedImgRef = useRef<string | null>(null)

  //캔버스 렌더링 state
  const { canvasRef, ctx } = useCanvasState()
  const { isDrawing, setIsDrawing, tool, color } = useCanvasDrawing(canvasRef, ctx, {
    ...props,
  })
  //canvas confirm
  const { initCanvas, saveCanvas } = useCanvasConfirm(ctx, canvasRef)
  //canvas 실행취소 , 다시실행
  const { setUndoActions, initCanvasAction, undoCanvas, redoCanvas } = useCanvasAction({
    canvasRef,
    ctx,
    uploadedImgRef,
  })

  const { canvasImgUpload, imgInputRef, initImgUpload } = useCanvasImgUpload({
    canvasRef,
    ctx,
    uploadedImgRef,
    initCanvasAction,
  })

  /*
    캔버스 초기화
     */
  const handleInitCanvas = () => {
    initCanvas()
    initCanvasAction()
    initImgUpload()
  }

  const canvasMouseDown = useCallback(
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

  const canvasMouseUp = useCallback(() => {
    if (!isDrawing) return
    setIsDrawing(false)

    setUndoActions((prevActions) => [
      ...prevActions,
      { type: tool, color, lineWidth: props.lineWidth, paths: [...currentPath] },
    ])

    setCurrentPath([])
  }, [isDrawing, setIsDrawing, setUndoActions, tool, color, props.lineWidth, currentPath])

  const canvasMouseMove = useCallback(
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

  const canvasMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false)
      setUndoActions((prevActions) => [
        ...prevActions,
        { type: tool, color, lineWidth: props.lineWidth, paths: [...currentPath] },
      ])
      setCurrentPath([]) // 현재 경로 초기화
    }
  }

  return (
    <div className="flex flex-col p-4 bg-gray-light rounded-lg shadow">
      <input type="file" accept="image/*" onChange={canvasImgUpload} ref={imgInputRef} />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={canvasMouseDown}
        onMouseMove={canvasMouseMove}
        onMouseUp={canvasMouseUp}
        onMouseLeave={canvasMouseLeave}
        className="rounded border-gray"
      />
      <CanvasConfirm undo={undoCanvas} redo={redoCanvas} init={handleInitCanvas} save={saveCanvas} />
    </div>
  )
}
