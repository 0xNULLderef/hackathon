import { useLayoutEffect, useState, type RefObject } from 'react'

interface Props {
  canvasRef: RefObject<HTMLCanvasElement | null>
  options?: WebGLContextAttributes
}

const OPTIONS_DEFAULT: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: true,
  desynchronized: true,
  failIfMajorPerformanceCaveat: undefined,
  powerPreference: 'default',
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  stencil: false,
}

export const useGL = ({
  canvasRef,
  options,
}: Props): WebGL2RenderingContext | null => {
  const [gl, setGL] = useState<WebGL2RenderingContext | null>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) throw new Error('no canvas ref')

    setGL(canvas.getContext('webgl2', { ...OPTIONS_DEFAULT, ...options }))
  }, [canvasRef, options])

  if (!gl) console.warn('useGL returned null')

  return gl
}
