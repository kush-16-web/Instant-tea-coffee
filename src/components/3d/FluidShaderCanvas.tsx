import { useEffect, useRef } from 'react'

interface FluidShaderCanvasProps {
  currentTone: 'hero' | 'atta' | 'tea' | 'mocha' | 'lab'
}

const TONES = {
  hero: { base: [0.05, 0.03, 0.02], target: [0.08, 0.05, 0.03], accent: [0.91, 0.72, 0.39] },
  atta: { base: [0.11, 0.07, 0.03], target: [0.18, 0.12, 0.05], accent: [0.91, 0.72, 0.39] },
  tea: { base: [0.04, 0.08, 0.03], target: [0.08, 0.14, 0.05], accent: [0.6, 0.83, 0.33] },
  mocha: { base: [0.09, 0.05, 0.02], target: [0.16, 0.09, 0.04], accent: [0.83, 0.54, 0.28] },
  lab: { base: [0.04, 0.04, 0.04], target: [0.07, 0.07, 0.08], accent: [0.85, 0.75, 0.65] },
}

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;
uniform vec2 uMouse;

// Hash & simplex-style noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.04 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  float t = uTime * 0.035;

  // Domain warping for silky organic motion
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t * 0.8));
  vec2 r = vec2(fbm(p * 1.2 + q * 1.4 + vec2(1.7, 9.2)), fbm(p * 1.2 + q * 1.4 + vec2(8.3, 2.8)));
  float f = fbm(p * 1.0 + r * 1.2);

  // Gradient mixing
  vec3 col = mix(uColorA, uColorB, smoothstep(0.1, 0.9, f));

  // Accent glow radiating near center/mouse
  vec2 mouseP = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
  float distMouse = distance(p, mouseP);
  float mouseGlow = exp(-distMouse * 2.8) * 0.35;
  col += uAccent * mouseGlow;

  // Radial dark vignette
  float distCenter = length(p);
  col *= smoothstep(1.3, 0.2, distCenter);

  // High-frequency subtle film grain to eliminate banding
  float grain = (hash(gl_FragCoord.xy + fract(uTime * 13.0)) - 0.5) * 0.03;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`

export function FluidShaderCanvas({ currentTone }: FluidShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetTone = useRef(TONES[currentTone] || TONES.hero)
  const currentColors = useRef({
    a: [...targetTone.current.base],
    b: [...targetTone.current.target],
    acc: [...targetTone.current.accent],
  })

  useEffect(() => {
    targetTone.current = TONES[currentTone] || TONES.hero
  }, [currentTone])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    let animId: number
    let disposed = false

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }

    const prog = gl.createProgram()!
    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uResLoc = gl.getUniformLocation(prog, 'uRes')
    const uTimeLoc = gl.getUniformLocation(prog, 'uTime')
    const uColorALoc = gl.getUniformLocation(prog, 'uColorA')
    const uColorBLoc = gl.getUniformLocation(prog, 'uColorB')
    const uAccentLoc = gl.getUniformLocation(prog, 'uAccent')
    const uMouseLoc = gl.getUniformLocation(prog, 'uMouse')

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX / window.innerWidth
      mouse.targetY = 1.0 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const resize = () => {
      const scale = 0.5 // Render at half resolution for ultra-smooth fluid feel
      const w = Math.floor(window.innerWidth * scale)
      const h = Math.floor(window.innerHeight * scale)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const render = () => {
      if (disposed) return
      animId = requestAnimationFrame(render)
      time += 0.016

      // Interpolate colors towards target
      const t = targetTone.current
      const c = currentColors.current
      for (let i = 0; i < 3; i++) {
        c.a[i] += (t.base[i] - c.a[i]) * 0.05
        c.b[i] += (t.target[i] - c.b[i]) * 0.05
        c.acc[i] += (t.accent[i] - c.acc[i]) * 0.05
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      gl.uniform2f(uResLoc, canvas.width, canvas.height)
      gl.uniform1f(uTimeLoc, time)
      gl.uniform3fv(uColorALoc, c.a)
      gl.uniform3fv(uColorBLoc, c.b)
      gl.uniform3fv(uAccentLoc, c.acc)
      gl.uniform2f(uMouseLoc, mouse.x, mouse.y)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    render()

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
