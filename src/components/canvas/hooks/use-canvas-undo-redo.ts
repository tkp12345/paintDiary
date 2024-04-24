import { type MutableRefObject } from 'react'

export const useCanvasUndoRedo = (workerRef: MutableRefObject<Worker | null>) => {
  const undoDrawCanvas = () => {
    workerRef.current?.postMessage({ type: 'undo' })
  }

  const redoDrawCanvas = () => {
    workerRef.current?.postMessage({ type: 'redo' })
  }

  function takeSnapshot() {
    workerRef.current?.postMessage({ type: 'snapshot' })
  }

  return { takeSnapshot, undoDrawCanvas, redoDrawCanvas }
}
