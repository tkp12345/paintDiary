import React, { useEffect, useState } from 'react'
import { CANVAS_STORAGE_KEY } from '../utils/local-storage-canvas-util'

interface Image {
  timestamp: string
  imageData: string
}
interface GroupedImages {
  [key: string]: Image[]
}
export const CanvasDayList = () => {
  const [groupedImages, setGroupedImages] = useState<GroupedImages>({})
  const getImgFromLocalStorage = () => {
    const savedImages = localStorage.getItem(CANVAS_STORAGE_KEY)
    if (!savedImages) return

    const images: Image[] = JSON.parse(savedImages)

    // 날짜별로 그룹핑
    const grouped: GroupedImages = images.reduce((acc: GroupedImages, image: Image) => {
      const date = image.timestamp.split('T')[0]
      if (!acc[date]) acc[date] = []
      acc[date].push(image)
      return acc
    }, {})

    setGroupedImages(grouped)
  }

  useEffect(() => {
    getImgFromLocalStorage()

    window.addEventListener('localStorageUpdate', getImgFromLocalStorage)

    return () => {
      window.removeEventListener('localStorageUpdate', getImgFromLocalStorage)
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      {Object.keys(groupedImages).map((date) => (
        <div key={date} style={{ marginBottom: '20px' }}>
          <h2 style={styles.canvasDailyTitle}>{date}</h2>
          <div style={{ display: 'flex', gap: '10px', flexFlow: 'wrap' }}>
            {groupedImages[date].map((img, index) => (
              <div style={styles.canvasImgWrap}>
                <img
                  key={`${index}-${img}-${date}`}
                  src={img.imageData}
                  alt={`Canvas image - ${date}`}
                  style={{ width: '100%', maxWidth: '200px' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  canvasDailyTitle: {
    fontWeight: '700',
    fontSize: '1.5rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  canvasImgWrap: {
    width: 'fit-content',
    padding: '16px',
    backgroundColor: '#f0f0f0', // 밝은 회색 계열로 배경색 설정
    borderRadius: '12px', // 모서리 둥글게 처리
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자 추가
    border: '1px solid #e0e0e0', // 경계선을 더 세련되게
  },
}
