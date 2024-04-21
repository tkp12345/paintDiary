/*
 canvas paint worker  :OffscreenCanvas를 사용, Worker를 도입 캔버스 paint 로직 스레드 분리
 */

;(function () {
  type PaintWorkerMessage = {
    type: 'setup' | 'draw' | 'end' | 'reset'
    canvas?: OffscreenCanvas
    start?: Coordinate
    end?: Coordinate
    color: string
    lineWidth: 5
  }

  interface Coordinate {
    x: number
    y: number
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

  function drawLineCanvas(start: Coordinate, end: Coordinate, color: string = 'black', lineWidth: number = 5) {
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

  function leaveCanvas() {}

  function resetCanvas(canvas: OffscreenCanvas | null, ctx: OffscreenCanvasRenderingContext2D | null) {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height) // 캔버스 전체 클리어
    }
  }
})()
