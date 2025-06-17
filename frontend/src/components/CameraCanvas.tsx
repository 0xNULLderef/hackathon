import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGL } from '../hooks/useGL'
import 'rvfc-polyfill'
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision'
import { useCamera } from '../hooks/useCamera'

interface GLTexture {
  texture: WebGLTexture
  width: number
  height: number
}

interface GLContext {
  gl: WebGL2RenderingContext
  textures: {
    camera: GLTexture
  }
  delta: number
}

interface GLProgram {
  program: WebGLProgram
  uniforms: { [key: string]: WebGLUniformLocation }
}

const vertex = `
#version 300 es

out vec2 vTextureCoord;

void main(void) {
   vec2 p = vec2(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1));
   vTextureCoord = p * 0.5;
   gl_Position = vec4(p - vec2(1.0), 0, 1);
}
`.trim()

const fragment = `
#version 300 es
precision highp float;

uniform sampler2D uVideoSampler;
uniform sampler2D uImageSampler;

uniform vec2 uVideoShift;
uniform vec2 uVideoScale;

in vec2 vTextureCoord;

layout(location = 0) out vec4 oColor;

void main(void) {
  vec3 videoColor = texture(uVideoSampler, (vTextureCoord + uVideoShift) * uVideoScale).rgb;
  vec3 imageColor = texture(uImageSampler, vTextureCoord * vec2(1.0, -1.0)).rgb;
  oColor = vec4(videoColor * 0.5 + max(videoColor * 0.5, imageColor * 0.5), 1.0);
  // oColor = vec4(imageColor, 1.0);
}
`.trim()

const compileShader = (
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('failed to create shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const shaderInfoLog = gl.getShaderInfoLog(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    throw new Error(
      `Failed to compile ${type == gl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader: ${shaderInfoLog}`
    )
  }

  if (shaderInfoLog && shaderInfoLog.length > 0) {
    console.warn(`Warning compiling shader: ${shaderInfoLog}`)
  }

  return shader
}

const compileProgram = (
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): GLProgram => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  const program = gl.createProgram()
  if (!program) throw new Error('failed to create program')

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  const programInfoLog = gl.getProgramInfoLog(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    throw new Error(`Failed to link program: ${programInfoLog}`)
  }

  if (programInfoLog && programInfoLog.length > 0) {
    console.warn(`Warning linking program: ${programInfoLog}`)
  }

  const uniforms: { [key: string]: WebGLUniformLocation } = {}
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

  for (let uniformIndex = 0; uniformIndex < uniformCount; uniformIndex++) {
    const uniform = gl.getActiveUniform(program, uniformIndex)
    if (!uniform) continue

    const uniformLocation = gl.getUniformLocation(program, uniform.name)
    if (!uniformLocation)
      throw new Error(`uniform ${uniform.name} has no location`)

    uniforms[uniform.name] = uniformLocation
  }

  return { program, uniforms }
}

const calculateVideoTransform = (video: HTMLVideoElement) => {
  const aspect = video.videoWidth / video.videoHeight
  if (aspect > 1.0) {
    return {
      shift: [(aspect - 1.0) / 2.0, 0.0],
      scale: [1.0 / aspect, -1.0],
    }
  } else {
    return {
      shift: [0.0, (1.0 / aspect - 1.0) / 2.0],
      scale: [1.0, -aspect],
    }
  }
}

const setup = async (
  gl: WebGL2RenderingContext,
  image: HTMLImageElement,
  video: HTMLVideoElement,
  callback: (x: any) => void
) => {
  const filesetResolver = await FilesetResolver.forVisionTasks('/wasm')
  const imageEmbedder = await ImageEmbedder.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: '/models/mobilenet_v3_small.tflite',
    },
    runningMode: 'IMAGE',
  })

  const targetEmbedding = imageEmbedder.embed(image).embeddings[0]

  imageEmbedder.setOptions({ runningMode: 'VIDEO' })

  const imageTexture = gl.createTexture()
  if (!imageTexture) throw new Error('failed to create image texture')
  gl.bindTexture(gl.TEXTURE_2D, imageTexture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)

  const videoTexture = gl.createTexture()
  if (!videoTexture) throw new Error('failed to create video texture')
  gl.bindTexture(gl.TEXTURE_2D, videoTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  )
  gl.generateMipmap(gl.TEXTURE_2D)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array([0, 1, 2]),
    gl.STATIC_DRAW
  )

  const program = compileProgram(gl, vertex, fragment)
  let framecnt = 0

  let videoTransform = null

  const frame = async () => {
    videoTransform ??= calculateVideoTransform(video)

    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.uniform1i(program.uniforms['uVideoSampler'], 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    gl.uniform1i(program.uniforms['uImageSampler'], 1)

    gl.uniform2f(
      program.uniforms['uVideoShift'],
      videoTransform.shift[0],
      videoTransform.shift[1]
    )

    gl.uniform2f(
      program.uniforms['uVideoScale'],
      videoTransform.scale[0],
      videoTransform.scale[1]
    )

    gl.useProgram(program.program)
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0)

    if (framecnt++ == 60) {
      framecnt = 0
      ;(async () => {
        const currentEmbedding = imageEmbedder.embedForVideo(
          gl.canvas,
          performance.now()
        ).embeddings[0]

        const similarity = ImageEmbedder.cosineSimilarity(
          targetEmbedding,
          currentEmbedding
        )

        callback(similarity)
      })()
    }

    requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

const CameraCanvas = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const gl = useGL({ canvasRef })

  const [embedding, setEmbedding] = useState<string>('')

  const target = 'target.png'

  useEffect(() => {
    const image = imageRef.current
    const video = videoRef.current
    if (gl && image && video) {
      ;(async () => {
        const camera = await useCamera()
        console.log(video)
        video.srcObject = camera
        video.playsInline = true
        video.muted = true
        video.play()

        setup(gl, image, video, (e) => setEmbedding(e))
      })()
    }
  }, [gl, imageRef, videoRef])

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <img ref={imageRef} src={target} />
        <video controls ref={videoRef} />
      </div>
      <canvas width={512} height={512} ref={canvasRef} />
      <p>{embedding}</p>
    </>
  )
}

export default CameraCanvas
