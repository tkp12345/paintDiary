/*
 canvas paint worker  :OffscreenCanvas를 사용, Worker를 도입 캔버스 paint 로직 스레드 분리
 */
import type { Point } from '../../types/cnavas-types'
;(function () {
  type PaintWorkerMessage = {
    type: 'setup' | 'draw' | 'erase' | 'end' | 'reset'
    canvas?: OffscreenCanvas
    start?: Point
    end?: Point
    color: string
    lineWidth: 5
  }

  let canvas: OffscreenCanvas | null = null
  let ctx: OffscreenCanvasRenderingContext2D | null = null

  onmessage = function (e: MessageEvent<PaintWorkerMessage>) {
    switch (e.data.type) {
      case 'setup':
        setUpCanvas(e)
        break
      case 'draw':
        if (e.data.start && e.data.end) {
          drawLineCanvas(e.data.start, e.data.end, e.data.color, e.data.lineWidth)
        }
        break
      case 'erase':
        if (e.data.start && e.data.end) {
          console.log('worker-erase')
          eraseLineCanvas(e.data.start, e.data.end, e.data.lineWidth)
        }
        break
      case 'end':
        leaveCanvas()
        break
      case 'reset':
        resetCanvas(canvas, ctx)
        break
    }
  }

  function setUpCanvas(e: MessageEvent<PaintWorkerMessage>) {
    canvas = e.data.canvas!
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  }

  function drawLineCanvas(start: Point, end: Point, color: string = 'black', lineWidth: number = 5) {
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

  function eraseLineCanvas(start: Point, end: Point, lineWidth: number) {
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out' // Set erase mode
    ctx.lineWidth = lineWidth
    ctx.beginPath() // 시작 경로
    ctx.moveTo(start.x, start.y) // 지우기 시작 위치
    ctx.lineTo(end.x, end.y) // 지우기 종료 위치
    ctx.stroke() // 경로 그리기 (지우기)
    ctx.globalCompositeOperation = 'source-over' // Reset to default drawing mode
  }

  function leaveCanvas() {}

  function resetCanvas(canvas: OffscreenCanvas | null, ctx: OffscreenCanvasRenderingContext2D | null) {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // 캔버스 전체 클리어
      postMessage({ type: 'resetComplete' }) // 작업 완료 메시지 전송
    }
  }
})()
