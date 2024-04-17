import { useCallback } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'

/*
  캔버스 저장,초기화 버튼 관리 훅스
 */
export const UseCanvasConfirm = (
  ctx: CanvasRenderingContext2D | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  //캔버스 초기화
  const initCanvas = useCallback(() => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = INIT_BACKGROUND_CANVAS
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [ctx, canvasRef])

  //캔버스 저장(다운로드)
  const saveCanvas = useCallback(() => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const link = document.createElement('a')
      link.download = 'today-diary.png'
      link.href = image
      link.click()
    }
  }, [canvasRef])

  return { initCanvas, saveCanvas }
}
