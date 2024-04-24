import React from 'react'
import { useCanvasContext } from './context/canvas-provider'
import { Button } from '../ui/button'

export const CanvasToolbar = () => {
  const { color, setColor, tool, lineWidth, setLineWidth, setTool } = useCanvasContext()

  return (
    <div style={styles.canvasToolBarWrap}>
      <div className="flex flex-col gap-2">
        <Button active={tool === 'draw'} onClick={() => setTool('draw')}>
          🖌️ Brush
        </Button>
        <Button active={tool === 'erase'} onClick={() => setTool('erase')}>
          🧽 Eraser
        </Button>
      </div>
      <div className="flex flex-col  gap-4 mt-4">
        <label className="flex items-center gap-2">
          <div style={styles.canvasToolBarSubMenuText}>색상 :</div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-6 border-2 border-gray rounded"
          />
        </label>
        <label className="flex items-center gap-2">
          <div style={styles.canvasToolBarSubMenuText}>선 두께:</div>
          <input
            type="range"
            min="1"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
            className="range range-primary w-full h-1 bg-blue rounded"
            style={{ backgroundSize: `${((lineWidth - 1) / 29) * 100}% 100%` }}
          />
        </label>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  canvasToolBarWrap: {
    width: '100%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: '#f0f0f0', // 밝은 회색 계열로 배경색 설정
    borderRadius: '12px', // 모서리 둥글게 처리
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 추가
    border: '1px solid #e0e0e0', // 경계선을 더 세련되게
  },
  canvasToolBarSubMenuText: {
    width: '60px',
    fontWeight: 600,
    color: '#6b7280',
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
