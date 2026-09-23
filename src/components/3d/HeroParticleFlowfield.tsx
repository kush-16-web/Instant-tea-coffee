import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HeroParticleFlowfieldProps {
  accentColor?: string
}

export function HeroParticleFlowfield({ accentColor = '#E9B964' }: HeroParticleFlowfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animId: number
    let disposed = false

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 12)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const count = 3500
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 22
      positions[i3 + 1] = (Math.random() - 0.5) * 14
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      scales[i] = Math.random() * 2.5 + 1.0
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    // Particle texture
    const textureCanvas = document.createElement('canvas')
    textureCanvas.width = 64
    textureCanvas.height = 64
    const ctx = textureCanvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.3, 'rgba(233, 185, 100, 0.8)')
    grad.addColorStop(0.7, 'rgba(233, 185, 100, 0.15)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)

    const particleTexture = new THREE.CanvasTexture(textureCanvas)

    const mat = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(accentColor),
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, rect.width)
      const h = Math.max(1, rect.height)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(container)

    let time = 0
    const animate = () => {
      if (disposed) return
      animId = requestAnimationFrame(animate)
      time += 0.01

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      const pos = geo.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Swirling vortex physics
        const px = pos[i3]
        const py = pos[i3 + 1]

        const distMouseX = px - mouse.x * 9
        const distMouseY = py - mouse.y * 6
        const distSq = distMouseX * distMouseX + distMouseY * distMouseY

        // Mouse vortex pull & swirl
        if (distSq < 25) {
          const force = (25 - distSq) * 0.0006
          velocities[i3] += -distMouseY * force * 1.5 - distMouseX * force * 0.5
          velocities[i3 + 1] += distMouseX * force * 1.5 - distMouseY * force * 0.5
        }

        // Noise wave drift
        velocities[i3] += Math.sin(py * 0.3 + time) * 0.001
        velocities[i3 + 1] += Math.cos(px * 0.3 + time) * 0.001

        // Apply friction
        velocities[i3] *= 0.98
        velocities[i3 + 1] *= 0.98
        velocities[i3 + 2] *= 0.98

        pos[i3] += velocities[i3]
        pos[i3 + 1] += velocities[i3 + 1]
        pos[i3 + 2] += velocities[i3 + 2]

        // Boundary wrap
        if (pos[i3] > 12) pos[i3] = -12
        if (pos[i3] < -12) pos[i3] = 12
        if (pos[i3 + 1] > 8) pos[i3 + 1] = -8
        if (pos[i3 + 1] < -8) pos[i3 + 1] = 8
      }

      geo.attributes.position.needsUpdate = true
      points.rotation.y = time * 0.03 + mouse.x * 0.1
      points.rotation.x = mouse.y * 0.08

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      ro.disconnect()
      geo.dispose()
      mat.dispose()
      particleTexture.dispose()
      renderer.dispose()
    }
  }, [accentColor])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-60" />
    </div>
  )
}
