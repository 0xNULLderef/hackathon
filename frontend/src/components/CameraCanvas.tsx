import { useEffect, useRef, useState, type HTMLProps } from 'react'
import { useGL } from '../hooks/useGL'
import { FilesetResolver, ImageEmbedder } from '@mediapipe/tasks-vision'
import { useCamera } from '../hooks/useCamera'

interface Props extends HTMLProps<HTMLDivElement> {
  targetURL: string
  onSimilarityUpdate: (similarity: number) => void
  onCheckShouldStop: (similarity: number) => boolean
}

interface GLProgram {
  program: WebGLProgram
  uniforms: { [key: string]: WebGLUniformLocation }
}

const screenSpaceTriangleVertex = `
#version 300 es

out vec2 vTextureCoord;

void main(void) {
   vec2 p = vec2(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1));
   vTextureCoord = p * 0.5;
   gl_Position = vec4(p - vec2(1.0), 0, 1);
}
`.trim()

// https://www.shadertoy.com/view/Xdf3Rf
const imageProcessFragment = `
#version 300 es
precision highp float;

uniform sampler2D uImageSampler;

in vec2 vTextureCoord;

layout(location = 0) out vec4 oColor;

float intensity(in vec4 color){
  return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

void main(void) {
  vec2 center = vTextureCoord;
  
  // HACK
  float stepx = 1.0/512.0;
  float stepy = 1.0/512.0;

  float tleft = intensity(texture(uImageSampler,center + vec2(-stepx,stepy)));
  float left = intensity(texture(uImageSampler,center + vec2(-stepx,0)));
  float bleft = intensity(texture(uImageSampler,center + vec2(-stepx,-stepy)));
  float top = intensity(texture(uImageSampler,center + vec2(0,stepy)));
  float bottom = intensity(texture(uImageSampler,center + vec2(0,-stepy)));
  float tright = intensity(texture(uImageSampler,center + vec2(stepx,stepy)));
  float right = intensity(texture(uImageSampler,center + vec2(stepx,0)));
  float bright = intensity(texture(uImageSampler,center + vec2(stepx,-stepy)));
  float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
  float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
  float color = sqrt((x*x) + (y*y));

  oColor = vec4(vec3(color), 1.0);
}
`.trim()

const cameraRescaleFragment = `
#version 300 es
precision highp float;

uniform sampler2D uVideoSampler;

uniform vec2 uVideoShift;
uniform vec2 uVideoScale;

in vec2 vTextureCoord;

layout(location = 0) out vec4 oColor;

void main(void) {
  vec3 videoColor = texture(uVideoSampler, (vTextureCoord + uVideoShift) * uVideoScale).rgb;
  oColor = vec4(videoColor, 1.0);
}
`.trim()

const cameraOverlayFragment = `
#version 300 es
precision highp float;

uniform sampler2D uVideoSampler;
uniform sampler2D uImageSampler;

uniform vec2 uVideoShift;
uniform vec2 uVideoScale;

uniform float uTimeLoop;

in vec2 vTextureCoord;

layout(location = 0) out vec4 oColor;

void main(void) {
  // vec3 videoColor = vec3(1.0, 0.0, 1.0);
  float d = length(vTextureCoord * 2.0 - vec2(1.0));
  float df = min(abs((uTimeLoop - 0.5) * 4.0 - d) + 0.6, 1.0);
  vec3 videoColor = texture(uVideoSampler, (vTextureCoord + uVideoShift) * uVideoScale).rgb;
  vec3 imageColor = texture(uImageSampler, vTextureCoord * vec2(1.0, -1.0)).rgb * df;
  oColor = vec4(max(videoColor, imageColor), 1.0);
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

const run = async ({
  gl,
  renderCanvas,
  embeddingCanvas,
  targetImage,
  cameraVideo,
  similarityCallback,
  checkShouldStopCallback,
}: {
  gl: WebGL2RenderingContext
  renderCanvas: HTMLCanvasElement
  embeddingCanvas: HTMLCanvasElement
  targetImage: HTMLImageElement
  cameraVideo: HTMLVideoElement
  similarityCallback: (similarity: number) => void
  checkShouldStopCallback: (similarity: number) => boolean
}) => {
  const embeddingCanvas2DContext = embeddingCanvas.getContext('2d')
  if (!embeddingCanvas2DContext) throw new Error('damn')

  const filesetResolver = await FilesetResolver.forVisionTasks('/wasm')
  const imageEmbedder = await ImageEmbedder.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: '/models/mobilenet_v3_small.tflite',
    },
    runningMode: 'IMAGE',
  })

  const targetEmbedding = imageEmbedder.embed(targetImage).embeddings[0]

  imageEmbedder.setOptions({ runningMode: 'VIDEO' })

  const imageProcessProgram = compileProgram(
    gl,
    screenSpaceTriangleVertex,
    imageProcessFragment
  )
  const cameraRescaleProgram = compileProgram(
    gl,
    screenSpaceTriangleVertex,
    cameraRescaleFragment
  )
  const cameraOverlayProgram = compileProgram(
    gl,
    screenSpaceTriangleVertex,
    cameraOverlayFragment
  )

  // dummy ibo for screenspace tris
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint8Array([0, 1, 2]),
    gl.STATIC_DRAW
  )

  const imageTexture = gl.createTexture()
  if (!imageTexture) throw new Error('failed to create image texture')
  gl.bindTexture(gl.TEXTURE_2D, imageTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    targetImage
  )
  // don't need mips
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const imageProcessedTexture = gl.createTexture()
  if (!imageProcessedTexture)
    throw new Error('failed to create processed image texture')
  gl.bindTexture(gl.TEXTURE_2D, imageProcessedTexture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    512,
    512,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  )
  const imageProcessedFramebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, imageProcessedFramebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    imageProcessedTexture,
    0
  )

  gl.useProgram(imageProcessProgram.program)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, imageTexture)
  gl.uniform1i(imageProcessProgram.uniforms['uImageSampler'], 0)

  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0)

  gl.deleteFramebuffer(imageProcessedFramebuffer)

  gl.bindTexture(gl.TEXTURE_2D, imageProcessedTexture)
  gl.generateMipmap(gl.TEXTURE_2D)

  // restore fb
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

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

  let framecnt = 0
  const FRAMECNT_RUN_MODEL = 10
  let similaritySave = 0

  let videoTransform = null

  const frame = async (now: number) => {
    videoTransform ??= calculateVideoTransform(cameraVideo)

    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      cameraVideo
    )
    gl.generateMipmap(gl.TEXTURE_2D)

    gl.useProgram(cameraRescaleProgram.program)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.uniform1i(cameraRescaleProgram.uniforms['uVideoSampler'], 0)

    gl.uniform2f(
      cameraRescaleProgram.uniforms['uVideoShift'],
      videoTransform.shift[0],
      videoTransform.shift[1]
    )

    gl.uniform2f(
      cameraRescaleProgram.uniforms['uVideoScale'],
      videoTransform.scale[0],
      videoTransform.scale[1]
    )

    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0)

    if (framecnt == FRAMECNT_RUN_MODEL) {
      embeddingCanvas2DContext.drawImage(renderCanvas, 0, 0)
    }

    gl.useProgram(cameraOverlayProgram.program)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, videoTexture)
    gl.uniform1i(cameraOverlayProgram.uniforms['uVideoSampler'], 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, imageProcessedTexture)
    gl.uniform1i(cameraOverlayProgram.uniforms['uImageSampler'], 1)

    gl.uniform2f(
      cameraOverlayProgram.uniforms['uVideoShift'],
      videoTransform.shift[0],
      videoTransform.shift[1]
    )

    gl.uniform2f(
      cameraOverlayProgram.uniforms['uVideoScale'],
      videoTransform.scale[0],
      videoTransform.scale[1]
    )

    gl.uniform1f(
      cameraOverlayProgram.uniforms['uTimeLoop'],
      (now / 2000.0) % 1.0
    )

    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_BYTE, 0)

    if (framecnt++ == FRAMECNT_RUN_MODEL) {
      framecnt = 0
      const currentEmbedding = imageEmbedder.embedForVideo(
        embeddingCanvas,
        performance.now()
      ).embeddings[0]

      const similarity = ImageEmbedder.cosineSimilarity(
        targetEmbedding,
        currentEmbedding
      )

      similarityCallback(similarity)
      similaritySave = similarity
    }

    if (!checkShouldStopCallback(similaritySave)) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

const CameraCanvas = ({
  targetURL,
  onSimilarityUpdate,
  onCheckShouldStop,
  ...props
}: Props) => {
  if (!onSimilarityUpdate) throw new Error('no similarity callback')
  if (!onCheckShouldStop) throw new Error('no similarity callback')

  const cameraVideoRef = useRef<HTMLVideoElement>(null)
  const targetImageRef = useRef<HTMLImageElement>(null)
  const embeddingCanvasRef = useRef<HTMLCanvasElement>(null)
  const renderCanvasRef = useRef<HTMLCanvasElement>(null)

  const gl = useGL({ canvasRef: renderCanvasRef })

  useEffect(() => {
    const targetImage = targetImageRef.current
    const renderCanvas = renderCanvasRef.current
    const embeddingCanvas = embeddingCanvasRef.current
    const cameraVideo = cameraVideoRef.current

    if (gl && renderCanvas && embeddingCanvas && targetImage && cameraVideo) {
      ;(async () => {
        const camera = await useCamera()
        cameraVideo.srcObject = camera
        cameraVideo.playsInline = true
        cameraVideo.muted = true
        cameraVideo.play()

        run({
          gl,
          renderCanvas,
          embeddingCanvas,
          targetImage,
          cameraVideo,
          similarityCallback: onSimilarityUpdate,
          checkShouldStopCallback: onCheckShouldStop,
        })
      })()
    }
  }, [gl, targetImageRef, cameraVideoRef])

  return (
    <div {...props}>
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0.01,
        }}
      >
        <img ref={targetImageRef} src={targetURL} />
        <video controls ref={cameraVideoRef} />
        <canvas width={512} height={512} ref={embeddingCanvasRef} />
      </div>
      <canvas width={512} height={512} ref={renderCanvasRef} />
    </div>
  )
}

export default CameraCanvas
