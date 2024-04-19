import { useCallback } from 'react'
import { INIT_BACKGROUND_CANVAS } from '../../../constants/constants-canvas'
import { toast } from 'react-toastify'
import { toastOptions } from '../../../../lib/react-toastify/toastify-options'
import debounce from '../../../utils/utils'

/*
  캔버스 저장,초기화 버튼 관리 훅스
 */
export const useCanvasConfirm = (
  ctx: CanvasRenderingContext2D | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  //캔버스 초기화
  const initCanvas = useCallback(
    debounce(() => {
      if (ctx && canvasRef.current) {
        ctx.fillStyle = INIT_BACKGROUND_CANVAS
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        toast.success('캔버스가 초기화 됬습니다.', { ...toastOptions })
      }
    }, 200),
    [ctx, canvasRef],
  )

  //캔버스 저장(다운로드)
  const saveCanvas = useCallback(
    debounce(() => {
      if (!canvasRef.current) return toast.error('저장할 요소가 없습니다')

      try {
        const image = canvasRef.current.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        const link = document.createElement('a')
        link.download = 'today-diary.png'
        link.href = image

        //이미지 다운로드
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('이미지가 저장됬습니다.', { ...toastOptions })
      } catch (err) {
        toast.error('저장에 실패했습니다. 다시한번 시도해주세요.', { ...toastOptions })
      }
    }, 200),
    [canvasRef],
  )

  return { initCanvas, saveCanvas }
}
