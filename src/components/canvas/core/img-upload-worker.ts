self.onmessage = function (e) {
  const { type, file } = e.data
  switch (type) {
    case 'loadImage':
      createImageBitmap(file)
        .then((imageBitmap) => {
          self.postMessage({ type: 'drawImage', imageBitmap })
        })
        .catch((error) => {
          console.error('Image loading failed:', error)
        })
      break
  }
}
