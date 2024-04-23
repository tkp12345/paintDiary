import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { toastOptions } from '../../../../lib/react-toastify/toastify-options'

export const useCanvasImgUpload = () => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null)

  const uploadImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null

      if (!file || !file.type.startsWith('image/')) {
        toast.error('이미지 파일을 선택해 주세요.', { ...toastOptions })
        return
      }

      createImageBitmap(file)
        .then((imageBitmap) => {
          if (imageCanvasRef.current) {
            const ctx = imageCanvasRef.current.getContext('2d')
            if (ctx) {
              ctx.clearRect(0, 0, imageCanvasRef.current.width, imageCanvasRef.current.height)
              ctx.drawImage(imageBitmap, 0, 0, imageCanvasRef.current.width, imageCanvasRef.current.height)
              // ImageBitmap 사용 후 메모리 해제
              imageBitmap.close()
            }
          }
        })
        .catch((error) => {
          toast.error('이미지 업로드에 실해팼습니다.', { ...toastOptions })
          console.error('Failed to create image bitmap:', error)
        })
    },
    [imageCanvasRef],
  )

  return { imageCanvasRef, uploadImage }
}
