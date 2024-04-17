import React from 'react'
import { CanvasContainer } from './container/canvas-container'
import { ToastContainer } from 'react-toastify'
import { toastDefaultOptions } from '../lib/react-toastify/toastify-options'
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <div className="p-2">
      <h1>그림일기</h1>
      <CanvasContainer />
      <ToastContainer {...toastDefaultOptions} />
    </div>
  )
}
export default App
