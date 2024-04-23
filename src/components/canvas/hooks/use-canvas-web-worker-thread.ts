import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import type { CanvasToolType, Point } from '../../types/cnavas-types'
import { useCanvasContext } from '../context/canvas-provider'

/*
  web-worker 초기화 훅스
 */
export const useCanvasWebWorkerThread = () => {
  const { color, lineWidth } = useCanvasContext()
  //캔버스 참조
  const canvasRef = useRef<HTMLCanvasElement>(null)
  //web-worker 참조
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    if (workerRef.current) return
    workerRef.current = new Worker('../core/paintWorker.ts')

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current && workerRef.current) {
      const offscreen = canvasRef.current.transferControlToOffscreen()
      workerRef.current.postMessage({ type: 'setup', canvas: offscreen }, [offscreen])
    }
  }, [])

  // webWorker 스레드로 캔버스 이벤트 위임
  const sendToWorker = (
    workerRef: MutableRefObject<Worker | null>,
    type: CanvasToolType,
    start?: Point,
    end?: Point,
    offscreen?: OffscreenCanvas,
  ) => {
    if (type === 'draw' && start && end) {
      workerRef.current?.postMessage({ type, start, end, color, lineWidth })
    } else if (type === 'erase' && start && end) {
      workerRef.current?.postMessage({ type, start, end, lineWidth })
    } else if (type === 'reset') {
      workerRef.current?.postMessage({ type: 'reset', canvas: offscreen })
    } else {
      workerRef.current?.postMessage({ type, start, color, lineWidth })
    }
  }

  return { canvasRef, workerRef, sendToWorker }
}
