import type { MutableRefObject, RefObject } from 'react'
import { useCallback, useEffect } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../../constants/constants-canvas'
import { _toast } from '../../../../lib/react-toastify/toastify-options'
import debounce from '../../../utils/utils'

/*
  캔버스 저장,초기화 버튼 관리 훅스
 */
export const useCanvasConfirm = (
  canvasRef: RefObject<HTMLCanvasElement>,
  imageCanvasRef: RefObject<HTMLCanvasElement>,
  workerRef: MutableRefObject<Worker | null>,
) => {
  //캔버스 초기화
  const initCanvas = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'reset' })
    }
  }

  //캔버스 저장(다운로드)
  const saveCanvas = useCallback(
    debounce(() => {
      if (!canvasRef.current) return _toast.error('저장할 요소가 없습니다')

      try {
        //배경 캔버스 , 드로잉 캔버스 병합 요소 생성
        const mergedCanvas = document.createElement('canvas')
        mergedCanvas.width = CANVAS_WIDTH // 병합 캔버스의 너비 설정
        mergedCanvas.height = CANVAS_HEIGHT // 병합 캔버스의 높이 설정
        const ctx = mergedCanvas.getContext('2d')

        //캔버스 병합
        if (ctx) {
          //imageCanvasRef 레이어가 먼저 실행 되어야 합니다
          imageCanvasRef.current && ctx.drawImage(imageCanvasRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
          ctx.drawImage(canvasRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        }

        const image = mergedCanvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'upload-img.png'
        link.href = image

        //이미지 다운로드
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        _toast.success('이미지가 저장됬습니다.')
      } catch (err) {
        _toast.error('저장에 실패했습니다. 다시한번 시도해주세요.')
      }
    }, 300),
    [canvasRef],
  )

  /*
     worker 응답 메시지
     */
  useEffect(() => {
    const handleWorkerMessage = (e: MessageEvent) => {
      if (e.data.type === 'resetComplete') {
        _toast.success('캔버스가 초기화 되었습니다.')
      }
    }

    if (workerRef.current) {
      workerRef.current.addEventListener('message', handleWorkerMessage)
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener('message', handleWorkerMessage)
      }
    }
  }, [workerRef])

  return { initCanvas, saveCanvas }
}
