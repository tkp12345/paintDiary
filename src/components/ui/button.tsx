import type { PropsWithChildren } from 'react'
import React from 'react'

interface ButtonProps {
  active: boolean
  onClick: () => void
}
export const Button = ({ active, onClick, children }: PropsWithChildren<ButtonProps>) => (
  <button
    style={{ ...styles.canvasButton, backgroundColor: active ? '#007BFF' : 'rgb(161 161 170)' }}
    className={` text-white py-2 px-4 rounded  transition duration ease-in-out`}
    onClick={onClick}
  >
    {children}
  </button>
)

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
