import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { CanvasContainer } from './container/canvas-container'
import { ToastContainer } from 'react-toastify'
import { toastDefaultOptions } from '../lib/react-toastify/toastify-options'
import { CanvasDayList } from './container/canvas-day-list'

const App: React.FC = () => {
  return (
    <div style={styles.containerWrap}>
      <div style={styles.title}>Paint Diary</div>
      <CanvasContainer />
      <CanvasDayList />
      <ToastContainer {...toastDefaultOptions} />
    </div>
  )
}
export default App

const styles: { [key: string]: React.CSSProperties } = {
  containerWrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '9rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: '3rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  // containerWrap: {
  //   fontWeight: '700',
  //   fontSize: '1.5rem',
  //   color: '#6b7280',
  //   marginBottom: '0.5rem',
  // },
  canvasImgWrap: {
    width: 'fit-content',
    padding: '16px',
    backgroundColor: '#f0f0f0', // 밝은 회색 계열로 배경색 설정
    borderRadius: '12px', // 모서리 둥글게 처리
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 추가
    border: '1px solid #e0e0e0', // 경계선을 더 세련되게
  },
}
