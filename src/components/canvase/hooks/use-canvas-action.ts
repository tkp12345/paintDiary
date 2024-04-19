import type { MutableRefObject, RefObject } from 'react'
import { useCallback, useState } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'

export interface DrawCanvasAction {
  type: string
  color: string
  lineWidth: number
  paths: { x: number; y: number }[]
}

interface UseCanvasActionProps {
  canvasRef: RefObject<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D | null
  uploadedImgRef: MutableRefObject<string | null>
}

/*
  캔버스 실행취소,다시실행 액션 훅스 
 */
export const useCanvasAction = ({ canvasRef, ctx, uploadedImgRef }: UseCanvasActionProps) => {
  //실행 취소 상태 배열
  const [undoActions, setUndoActions] = useState<DrawCanvasAction[]>([])
  //다시 실행 상태 배열
  const [redoActions, setRedoActions] = useState<DrawCanvasAction[]>([])

  const initializeCanvasBackground = (callback?: () => void) => {
    if (!ctx) return

    // 배경 이미지 업로드시 초기화
    if (uploadedImgRef.current) {
      const img = new Image()
      img.onload = () => {
        if (canvasRef.current) {
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
          callback && callback()
        }
      }
      img.src = uploadedImgRef.current
    } else {
      // 배경 이미지가 없는 경우에만 기본 배경으로 초기화
      ctx.fillStyle = INIT_BACKGROUND_CANVAS
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      callback && callback()
    }
  }

  const applyAction = (action: DrawCanvasAction, revert: boolean) => {
    if (!ctx) return
    if (revert) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      // 배경 초기화후 이전 작업 다시 그리기
      initializeCanvasBackground(() => {
        undoActions.forEach((a) => applyAction(a, false))
      })
    } else {
      // 해당 작업만 다시 그리기
      ctx.beginPath()
      ctx.strokeStyle = action.color
      ctx.lineWidth = action.lineWidth
      ctx.moveTo(action.paths[0].x, action.paths[0].y)
      action.paths.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    }
  }

  /*
   실행 취소 : 실행취소 마지막 요소를 재거하고 다시실행 요소 에 추가한다
   */
  const undoCanvas = useCallback(() => {
    if (undoActions.length > 0) {
      const lastAction = undoActions.pop() // 마지막 작업 가져오기
      if (lastAction) {
        applyAction(lastAction, true)
        setRedoActions([lastAction, ...redoActions])
      }
      setUndoActions([...undoActions])
    }
  }, [undoActions, redoActions])

  /*
   다시 실행 : 실행취소 마지막 요소를 재거하고 다시실행 요소 에 추가한다
   */
  const redoCanvas = useCallback(() => {
    if (redoActions.length > 0) {
      const nextAction = redoActions.shift() // 다음 작업 가져오기
      if (nextAction) {
        applyAction(nextAction, false)
        setUndoActions([...undoActions, nextAction])
      }
      setRedoActions([...redoActions])
    }
  }, [undoActions, redoActions])

  const initCanvasAction = () => {
    setUndoActions([])
    setRedoActions([])
  }

  return {
    undoActions,
    redoActions,
    setUndoActions,
    setRedoActions,
    initCanvasAction,
    undoCanvas,
    redoCanvas,
    initializeCanvasBackground,
  }
}
