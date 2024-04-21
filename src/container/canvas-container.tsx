import React from 'react'
import { CanvasProvider } from '../components/canvas/context/canvas-provider'
import { CanvasToolbar } from '../components/canvas/canvas-toolbar'
import { Canvas } from '../components/canvas/canvas'

export const CanvasContainer = () => {
  return (
    <CanvasProvider>
      <Canvas />
      <CanvasToolbar />
    </CanvasProvider>
  )
}
