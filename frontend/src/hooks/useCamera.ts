import { useState } from 'react'

export const useCamera = async () =>
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 720, height: 720, facingMode: 'environment' },
  })
