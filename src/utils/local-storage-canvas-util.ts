import { _toast } from '../../lib/react-toastify/toastify-options'

export const CANVAS_STORAGE_KEY = 'canvasStorage'

/*
  스토리지 캔버스저장
 */
export const setCanvasStateToLocalStorage = (imageData: string) => {
  try {
    const timestamp = new Date().toISOString() // 현재 타임스탬프

    const savedCanvasImages = localStorage.getItem(CANVAS_STORAGE_KEY)
    const canvasImages = savedCanvasImages ? JSON.parse(savedCanvasImages) : []

    canvasImages.push({ timestamp, imageData }) // 새 이미지 데이터와 타임스탬프 추가
    localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(canvasImages))
    _toast.success('캔버스가 저장되었습니다.')

    window.dispatchEvent(new Event('localStorageUpdate'))
  } catch (err) {
    _toast.error('캔버스 저장에 실패했습니다.')
  }
}

/*
  스토리지 캔버스조회
 */
export const getCanvasStateToLocalStorage = () => {
  const canvasDiaryData = []
  const canvasStorage = localStorage.getItem(CANVAS_STORAGE_KEY)
  if (canvasStorage === null || canvasStorage === undefined) return [] // 로컬스토리지 정보가 없는 경우 반환
  try {
    canvasDiaryData.push(...JSON.parse(canvasStorage))
    return canvasDiaryData
  } catch (err) {
    _toast.success('캔버스 조회에 실패했스빈다.')
    return []
  }
}
