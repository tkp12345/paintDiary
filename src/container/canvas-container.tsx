import React from 'react'
import { Canvas } from '../components/canvase/canvas'
import { CanvasProvider } from '../components/canvase/context/canvas-provider'
import { CanvasToolbar } from '../components/canvase/canvas-toolbar'

export const CanvasContainer = () => {
  return (
    <CanvasProvider>
      <Canvas />
      <CanvasToolbar />
    </CanvasProvider>
  )
}
