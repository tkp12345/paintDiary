import React from 'react'

interface Props {
  undo: () => void
  redo: () => void
  init: () => void
  save: () => void
}
export const CanvasConfirm = ({ undo, redo, init, save }: Props) => {
  return (
    <div className="flex" style={{ justifyContent: 'space-between' }}>
      <div className="flex gap-2">
        <CanvasButton onClick={undo}>◀️</CanvasButton>
        <CanvasButton onClick={redo}>▶️</CanvasButton>
      </div>
      <div className="flex gap-2">
        <CanvasButton onClick={init}>초기화</CanvasButton>
        <CanvasButton onClick={save}>이미지 저장</CanvasButton>
      </div>
    </div>
  )
}

export const CanvasButton: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="mt-4 py-2 px-4 bg-blue text-white rounded ">
    {children}
  </button>
)
