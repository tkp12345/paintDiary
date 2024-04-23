import React, { useState } from 'react'
import { useCanvasWebWorkerThread } from './hooks/use-canvas-web-worker-thread'
import { useCanvasImgUpload } from './hooks/use-canvas-img-upload'
import { CanvasConfirm } from './canvas-confirm'
import type { Point } from '../types/cnavas-types'
import { getCanvasPosition } from './utils/canvas'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../constants/constants-canvas'
import { useCanvasConfirm } from './hooks/use-canvas-confirm'
import { useCanvasContext } from './context/canvas-provider'
import { useCanvasUndoRedo } from './hooks/use-canvas-undo-redo'

/*
  캔버스
 */
export const Canvas = () => {
  const { tool } = useCanvasContext()

  //web-worker
  const { canvasRef, workerRef, sendToWorker } = useCanvasWebWorkerThread()

  //paint 뒤로가기 , 앞으로가기
  const { takeSnapshot, undoDrawCanvas, redoDrawCanvas } = useCanvasUndoRedo(canvasRef, workerRef)
  //이미지 업로드
  const { imageCanvasRef, uploadImage } = useCanvasImgUpload()
  //초기화 , 이미지저장 conform
  const { initCanvas, saveCanvas } = useCanvasConfirm(canvasRef, imageCanvasRef, workerRef)

  const [lastPosition, setLastPosition] = useState<Point | null>(null) // 마지막 위치 상태 추가

  /*
   캔버스 마우스 이벤트
   */
  const canvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const position = getCanvasPosition(e)
    setLastPosition(position) // 마우스 다운 시 시작 위치 설정
    sendToWorker(workerRef, 'setup', position)
  }

  const canvasMouseUp = () => {
    takeSnapshot()
    sendToWorker(workerRef, 'end')
    setLastPosition(null) // 마우스를 떼면 마지막 위치 초기화
  }

  const canvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const newPosition = getCanvasPosition(e)

    if (lastPosition) {
      sendToWorker(workerRef, tool, lastPosition, newPosition)
      setLastPosition(newPosition) // 현재 위치를 마지막 위치로 업데이트
    }
  }

  const canvasMouseLeave = () => {
    if (!lastPosition) return
    sendToWorker(workerRef, 'end')
    setLastPosition(null)
  }

  return (
    <div className="flex flex-col p-4 bg-gray-light rounded-lg shadow ">
      <input type="file" accept="image/*" onChange={uploadImage} />
      <div style={{ position: 'relative', width: '800px', height: '600px', background: 'white' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={canvasMouseDown}
          onMouseMove={canvasMouseMove}
          onMouseUp={canvasMouseUp}
          onMouseLeave={canvasMouseLeave}
          className="rounded border-gray"
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }}
        />
        <canvas
          ref={imageCanvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}
        />
      </div>
      <CanvasConfirm undo={undoDrawCanvas} redo={redoDrawCanvas} init={initCanvas} save={saveCanvas} />
    </div>
  )
}
