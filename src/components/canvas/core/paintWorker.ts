/*
 canvas paint worker  :OffscreenCanvas를 사용, Worker를 도입 캔버스 paint 로직 스레드 분리
 */
import type { CanvasToolType, Point } from '../../types/cnavas-types'
;(function () {
  type PaintWorkerMessage = {
    type: CanvasToolType
    canvas?: OffscreenCanvas
    start?: Point
    end?: Point
    color: string
    lineWidth: 5
    imageData: ImageData
  }

  let canvas: OffscreenCanvas | null = null
  let ctx: OffscreenCanvasRenderingContext2D | null = null

  const snapShotStack: ImageData[] = []
  let currentIndex: number = -1
  const maxHistorySize: number = 30

  onmessage = function (e: MessageEvent<PaintWorkerMessage>) {
    switch (e.data.type) {
      case 'setup':
        setUpCanvas(e)
        break
      case 'draw':
        if (e.data.start && e.data.end) {
          drawCanvas(e.data.start, e.data.end, e.data.color, e.data.lineWidth)
        }
        break
      case 'erase':
        if (e.data.start && e.data.end) {
          eraseCanvas(e.data.start, e.data.end, e.data.lineWidth)
        }
        break
      case 'end':
        leaveCanvas()
        break
      case 'reset':
        resetCanvas()
        break
      case 'snapshot':
        snapshotCanvas()
        break
      case 'undo':
        undoCanvas()
        break
      case 'redo':
        redoCanvas()
        break
    }
  }

  function setUpCanvas(e: MessageEvent<PaintWorkerMessage>) {
    canvas = e.data.canvas!
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  }

  function drawCanvas(start: Point, end: Point, color: string = 'black', lineWidth: number = 5) {
    if (!ctx) return

    ctx.lineJoin = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.closePath()

    ctx.stroke()
  }

  function eraseCanvas(start: Point, end: Point, lineWidth: number) {
    if (!ctx) return
    // 현재 설정 저장
    const previousOperation = ctx.globalCompositeOperation
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = lineWidth
    ctx.beginPath() // 시작 경로
    ctx.moveTo(start.x, start.y) // 지우기 시작 위치
    ctx.lineTo(end.x, end.y) // 지우기 종료 위치
    ctx.stroke() // 경로 그리기 (지우기)
    ctx.globalCompositeOperation = previousOperation
  }

  function leaveCanvas() {}

  function resetCanvas() {
    snapShotStack.splice(0, snapShotStack.length)
    currentIndex = -1
    if (ctx) {
      ctx.clearRect(0, 0, 800, 600) // 캔버스 전체 클리어
      postMessage({ type: 'resetComplete' }) // 작업 완료 메시지 전송
    }
  }

  function snapshotCanvas() {
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, 800, 600)
      if (snapShotStack.length === maxHistorySize) {
        snapShotStack.shift() // 가장 오래된 스냅샷 제거
        currentIndex-- // 모든 인덱스를 하나씩 감소
      }
      snapShotStack.push(imageData) // 스냅샷 저장
      currentIndex = snapShotStack.length - 1 // 현재 인덱스 업데이트
    }
  }

  function undoCanvas() {
    if (!ctx || currentIndex < 0) return
    ctx.clearRect(0, 0, 800, 600)
    ctx.putImageData(snapShotStack[currentIndex - 1], 0, 0)
    currentIndex--
  }

  function redoCanvas() {
    if (!ctx || currentIndex > snapShotStack.length - 1) return // ctx가 없거나, currentIndex가 최대 길이보다 크면 실행 취소

    const imageData = snapShotStack[currentIndex] // 다음 이미지 데이터 가져오기
    ctx.clearRect(0, 0, 800, 600) // 캔버스 클리어
    ctx.putImageData(imageData, 0, 0) // 다음 이미지 데이터로 캔버스 복원
    self.postMessage({ type: 'restored' }) // 복원 완료 메시지 전송
    currentIndex++
  }
})()
