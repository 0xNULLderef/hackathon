import { useEffect } from 'react'

function App() {
  useEffect(() => {
    ;(async () => {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { width: 640, height: 480 },
      })

      console.log(cameraStream)
    })()
  }, [])

  return <></>
}

export default App
