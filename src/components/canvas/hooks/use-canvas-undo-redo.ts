import { type MutableRefObject, type RefObject, useEffect } from 'react'

export const useCanvasUndoRedo = (
  canvasRef: RefObject<HTMLCanvasElement>,
  workerRef: MutableRefObject<Worker | null>,
) => {
  const undoDrawCanvas = () => {
    workerRef.current?.postMessage({ type: 'undo' })
  }

  const redoDrawCanvas = () => {
    workerRef.current?.postMessage({ type: 'redo' })
  }

  function takeSnapshot() {
    workerRef.current?.postMessage({ type: 'snapshot' })
  }

  const restoreCanvas = (imageData: ImageData) => {
    if (!canvasRef.current) return
    console.log('restore:', canvasRef.current)
    console.log('imageData:', imageData)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && imageData) {
      console.log('/???')
      // 캔버스를 클리어하고
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 이미지 데이터로 캔버스를 복원
      ctx.putImageData(imageData, 0, 0)
    }
  }

  // const takeSnapshot = () => {
  //   console.log('canvasRef.current:', canvasRef.current)
  //   if (!workerRef.current) return
  //   workerRef.current?.postMessage({ type: 'snapshot' })
  // }

  // useEffect(() => {
  //   // 워커 초기화
  //   if (!workerRef.current) return
  //   // 워커로부터 메시지를 받는 리스너
  //   workerRef.current.onmessage = (event) => {
  //     if (event.data.type === 'restore') {
  //       console.log('restore-응답')
  //       restoreCanvas(event.data.imageData)
  //     }
  //   }
  //
  //   return () => {
  //     // 컴포넌트 언마운트 시 워커 종료
  //     workerRef.current?.terminate()
  //   }
  // }, [workerRef])

  return { takeSnapshot, undoDrawCanvas, redoDrawCanvas }
}
