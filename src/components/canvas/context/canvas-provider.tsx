import type { PropsWithChildren } from 'react'
import React, { createContext, useContext, useState } from 'react'
import { INIT_COLOR_CANVAS, INIT_LINE_WIDTH_CANVAS } from '../../../constants/constants-canvas'
import type { CanvasType } from '../../types/cnavas-types'

const CanvasContext = createContext<CanvasType | null>(null)

export const useCanvasContext = (): CanvasType => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used in CanvasProvider')
  }
  return context
}

export const CanvasProvider = ({ children }: PropsWithChildren) => {
  const [color, setColor] = useState<string>(INIT_COLOR_CANVAS)
  const [lineWidth, setLineWidth] = useState<number>(INIT_LINE_WIDTH_CANVAS)
  const [tool, setTool] = useState<string>('brush')

  return (
    <CanvasContext.Provider value={{ color, setColor, lineWidth, setLineWidth, tool, setTool }}>
      <div className="p-5 flex gap-2">{children}</div>
    </CanvasContext.Provider>
  )
}
