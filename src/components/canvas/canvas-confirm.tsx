import React from 'react'
import downloadIcon from '../../icons/downloadIcon.png'

interface Props {
  undo: () => void
  redo: () => void
  init: () => void
  save: () => void
  saveImg: () => void
}
export const CanvasConfirm = ({ undo, redo, init, save, saveImg }: Props) => {
  return (
    <div className="flex" style={{ justifyContent: 'space-between', padding: '10px' }}>
      <div className="flex gap-2">
        <CanvasButton onClick={undo}>◀️</CanvasButton>
        <CanvasButton onClick={redo}>▶️</CanvasButton>
      </div>
      <div className="flex gap-2">
        <CanvasButton onClick={init}>모두 지우기</CanvasButton>
        <CanvasButton onClick={save}>일기 저장</CanvasButton>
        <CanvasButton onClick={saveImg}>
          <img src={downloadIcon} alt="Convert" style={styles.conversionImage} />
        </CanvasButton>
      </div>
    </div>
  )
}

export const CanvasButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} style={styles.canvasButton}>
    {children}
  </button>
)

const styles: { [key: string]: React.CSSProperties } = {
  conversionImage: {
    height: '1.5rem',
    width: '1.5rem',
  },
  canvasButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.4)',
    transition: 'background-color 0.3s',
    outline: 'none',
  },
}
