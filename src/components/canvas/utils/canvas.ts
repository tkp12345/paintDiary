import type React from 'react'
import type { Point } from '../../types/cnavas-types'

export const getCanvasPosition = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
  const { offsetX, offsetY } = e.nativeEvent
  return { x: offsetX, y: offsetY }
}
