import { useCallback, useState } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'

export interface DrawCanvasAction {
  type: string
  color: string
  lineWidth: number
  paths: { x: number; y: number }[]
}
/*
  캔버스 실행취소,다시실행 액션 훅스 
 */
export const useCanvasAction = (ctx: CanvasRenderingContext2D | null) => {
  //실행 취소 상태 배열
  const [undoActions, setUndoActions] = useState<DrawCanvasAction[]>([])
  //다시 실행 상태 배열
  const [redoActions, setRedoActions] = useState<DrawCanvasAction[]>([])

  // 캔버스 초기화 (배경 설정)
  const initializeCanvasBackground = () => {
    if (!ctx) return
    ctx.fillStyle = INIT_BACKGROUND_CANVAS
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  // 캔버스 그리기 action
  const applyAction = (action: DrawCanvasAction) => {
    if (!ctx || action.paths.length === 0) return
    ctx.beginPath()
    ctx.strokeStyle = action.color
    ctx.lineWidth = action.lineWidth
    ctx.moveTo(action.paths[0].x, action.paths[0].y)
    action.paths.forEach((point) => {
      ctx.lineTo(point.x, point.y)
    })
    ctx.stroke()
  }

  /*
   실행 취소 : 실행취소 마지막 요소를 재거하고 다시실행 요소 에 추가한다
   */
  const undoCanvas = useCallback(() => {
    if (undoActions.length > 0) {
      const lastAction = undoActions.pop()
      setUndoActions([...undoActions])
      if (lastAction) {
        setRedoActions([lastAction, ...redoActions])
      }
      initializeCanvasBackground()
      undoActions.forEach((action) => applyAction(action)) // 모든 이전 작업을 재적용
    }
  }, [undoActions, ctx])

  /*
   실행 취소 : 실행취소 마지막 요소를 재거하고 다시실행 요소 에 추가한다
   */
  const redoCanvas = useCallback(() => {
    if (redoActions.length > 0) {
      const lastAction = redoActions.shift()
      setRedoActions([...redoActions])
      if (lastAction) {
        setUndoActions([...undoActions, lastAction])
        initializeCanvasBackground()
        ;[...undoActions, lastAction].forEach((action) => applyAction(action)) // 모든 작업을 재적용
      }
    }
  }, [redoActions, ctx])

  return { undoActions, setUndoActions, undoCanvas, redoCanvas }
}
