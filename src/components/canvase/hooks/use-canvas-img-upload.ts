import type { MutableRefObject, RefObject } from 'react'
import { useRef } from 'react'
import type React from 'react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { toastOptions } from '../../../../lib/react-toastify/toastify-options'

interface useCanvasImgUploadProps {
  canvasRef: RefObject<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D | null
  uploadedImgRef: MutableRefObject<string | null>
  initCanvasAction: () => void
}
export const useCanvasImgUpload = ({ canvasRef, ctx, uploadedImgRef, initCanvasAction }: useCanvasImgUploadProps) => {
  const imgInputRef = useRef<HTMLInputElement>(null)

  const canvasImgUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일을 선택해 주세요.', { ...toastOptions })
        return
      }

      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image()
        const target = e.target as FileReader // 타입 단언을 사용

        img.onload = () => {
          //캔버스 이미지 추가
          if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
            uploadedImgRef.current = target.result as string
            initCanvasAction()
          }
        }
        img.onerror = () => {
          toast.error('이미지 업로드에 실해팼습니다.', { ...toastOptions })
        }
        img.src = e.target?.result as string
      }

      reader.onerror = () => {
        toast.error('잘못된 파일입니다.', { ...toastOptions })
      }
      reader.readAsDataURL(file)
    },
    [canvasRef, ctx],
  )

  const initImgUpload = useCallback(() => {
    if (imgInputRef.current) {
      imgInputRef.current.value = '' // 입력된 파일 초기화
    }
    uploadedImgRef.current = null
  }, [])

  return { canvasImgUpload, imgInputRef, initImgUpload }
}
