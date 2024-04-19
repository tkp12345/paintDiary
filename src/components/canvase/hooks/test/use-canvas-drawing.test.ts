import { renderHook, act } from '@testing-library/react-hooks'
import { useCanvasDrawing } from '../use-canvas-drawing'
import type { CanvasType } from '../../../types/cnavas-types'

describe('useCanvasDrawing', () => {
  let canvasElement: HTMLCanvasElement,
    ctxMock: CanvasRenderingContext2D,
    refMock: { current: HTMLCanvasElement | null }
  let setToolMock: jest.Mock, setColorMock: jest.Mock, setLineWidthMock: jest.Mock
  let initialProps: CanvasType // 여기서 선언

  beforeEach(() => {
    canvasElement = document.createElement('canvas')
    ctxMock = canvasElement.getContext('2d') as CanvasRenderingContext2D
    jest.spyOn(canvasElement, 'getContext').mockReturnValue(ctxMock)
    refMock = { current: canvasElement }

    // ctx 메소드들을 목 데이터 설정 .
    jest.spyOn(ctxMock, 'beginPath')
    jest.spyOn(ctxMock, 'moveTo')
    jest.spyOn(ctxMock, 'lineTo')
    jest.spyOn(ctxMock, 'stroke')
    // ctx 초기 속성 설정
    ctxMock.lineJoin = 'round'
    ctxMock.lineCap = 'round'
    ctxMock.lineWidth = 0
    ctxMock.strokeStyle = ''

    // Setter 메소드 모의
    setToolMock = jest.fn()
    setColorMock = jest.fn()
    setLineWidthMock = jest.fn()

    // 초기 속성 설정
    initialProps = {
      color: '#000000', // "black" 대신 HEX 코드 사용
      lineWidth: 5,
      tool: 'pen',
      setTool: setToolMock,
      setColor: setColorMock,
      setLineWidth: setLineWidthMock,
    }
  })

  it('드로잉 액션이 정확히 이루어지는지 ', () => {
    const { result } = renderHook(() => useCanvasDrawing(refMock, ctxMock, initialProps))

    // 드로잉
    act(() => {
      result.current.setIsDrawing(true)
      // 초기 점 목 데이터 추가.
      result.current.setPoints([{ x: 50, y: 50 }])
    })
    expect(result.current.isDrawing).toBe(true)

    // 마우스 이벤트 목 시뮬레이션
    const mouseEvent = {
      nativeEvent: {
        offsetX: 100,
        offsetY: 100,
      },
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }

    act(() => {
      result.current.draw(mouseEvent as any)
    })

    // 드로잉 메소드 호출
    expect(ctxMock.beginPath).toHaveBeenCalled()
    expect(ctxMock.moveTo).toHaveBeenCalled()
    expect(ctxMock.lineTo).toHaveBeenCalled()
    expect(ctxMock.stroke).toHaveBeenCalled()

    // 드로잉 상태, 스타일 속성 확인
    expect(ctxMock.lineJoin).toBe('round')
    expect(ctxMock.lineCap).toBe('round')
    expect(ctxMock.lineWidth).toBe(initialProps.lineWidth)
    expect(ctxMock.strokeStyle).toBe(initialProps.color)

    expect(setToolMock).not.toHaveBeenCalled()
    expect(setColorMock).not.toHaveBeenCalled()
    expect(setLineWidthMock).not.toHaveBeenCalled()
  })
})
