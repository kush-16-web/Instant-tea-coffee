import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface InstancedWorldParticlesProps {
  type: 'grains' | 'leaves' | 'beans'
  accentColor: string
  className?: string
  fullScreen?: boolean
}

export function InstancedWorldParticles({
  type,
  accentColor,
  className = '',
  fullScreen = false,
}: InstancedWorldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let animId: number
    let disposed = false

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, fullScreen ? 9.5 : 8)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const count = fullScreen
      ? type === 'grains' ? 55 : type === 'leaves' ? 45 : 48
      : type === 'grains' ? 36 : type === 'leaves' ? 28 : 32

    // Build realistic organic geometries based on particle type
    let geo: THREE.BufferGeometry
    let mat: THREE.Material

    if (type === 'grains') {
      // Golden wheat grain: realistic elongated spindle with subtle ventral indentation
      const baseGeo = new THREE.SphereGeometry(0.15, 24, 16)
      const pos = baseGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i)
        let y = pos.getY(i)
        let z = pos.getZ(i)
        // Elongate along Y, taper ends, add subtle ventral groove along Z=0
        const taper = 1.0 - Math.abs(y / 0.15) * 0.35
        x *= taper * 0.65
        z *= taper * 0.75
        y *= 1.85
        // Ventral crease indentation on one side (x < 0)
        if (x < 0 && Math.abs(z) < 0.05) {
          x *= 0.55
        }
        pos.setXYZ(i, x, y, z)
      }
      baseGeo.computeVertexNormals()
      geo = baseGeo
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#D8A44F'),
        roughness: 0.38,
        metalness: 0.15,
      })
    } else if (type === 'leaves') {
      // Organic curled tea leaf: double-sided curved planar leaf ribbon with natural twist
      const leafGeo = new THREE.PlaneGeometry(0.24, 0.58, 12, 16)
      const pos = leafGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i)
        let y = pos.getY(i)
        // Leaf curl: bend edges backward, raise center spine, add organic S-curve twist
        const normalizedY = y / 0.29 // -1 to 1
        const taper = 1.0 - Math.pow(Math.abs(normalizedY), 1.5) * 0.7
        x *= taper
        const curl = Math.sin(x * 12) * 0.04
        const twist = Math.sin(normalizedY * Math.PI) * 0.06
        const z = -Math.abs(x) * 0.35 + curl + twist
        pos.setXYZ(i, x, y, z)
      }
      leafGeo.computeVertexNormals()
      geo = leafGeo
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#386427'),
        roughness: 0.35,
        metalness: 0.08,
        side: THREE.DoubleSide,
      })
    } else {
      // Roasted Arabica Coffee Bean: sculpted bean with characteristic center split crease
      const beanGeo = new THREE.SphereGeometry(0.18, 28, 20)
      const pos = beanGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i)
        let y = pos.getY(i)
        let z = pos.getZ(i)
        // Bean proportions: flattened, slightly kidney curved
        x *= 0.85
        y *= 1.25
        z *= 0.68
        // Center longitudinal crease indentation along Y axis where x ~= 0 and z > 0
        if (z > 0 && Math.abs(x) < 0.06) {
          z *= 0.45
        }
        pos.setXYZ(i, x, y, z)
      }
      beanGeo.computeVertexNormals()
      geo = beanGeo
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2C160B'),
        roughness: 0.25,
        metalness: 0.18,
      })
    }

    const instancedMesh = new THREE.InstancedMesh(geo, mat, count)
    const dummy = new THREE.Object3D()

    // Particle state tracking
    interface ParticleState {
      baseX: number
      baseY: number
      baseZ: number
      rotX: number
      rotY: number
      rotZ: number
      rotSpeedX: number
      rotSpeedY: number
      rotSpeedZ: number
      scale: number
      floatSpeed: number
      floatPhase: number
      floatRadius: number
    }

    const particles: ParticleState[] = []

    for (let i = 0; i < count; i++) {
      let x = 0
      let y = 0
      let z = 0

      if (fullScreen) {
        // Disperse across the entire wide background
        x = (Math.random() - 0.5) * 15
        y = (Math.random() - 0.5) * 9.5
        z = (Math.random() - 0.5) * 4.5 - 1.0
      } else {
        // Orbit around the pack in hero
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const rad = 2.2 + Math.random() * 2.2
        x = Math.cos(angle) * rad + (Math.random() - 0.5) * 0.8
        y = (Math.random() - 0.5) * 3.8
        z = (Math.random() - 0.5) * 2.5 - 0.5
      }

      const scale = fullScreen
        ? 0.5 + Math.random() * 0.95
        : 0.5 + Math.random() * 0.85

      particles.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        scale,
        floatSpeed: 0.6 + Math.random() * 0.8,
        floatPhase: Math.random() * Math.PI * 2,
        floatRadius: 0.15 + Math.random() * 0.25,
      })
    }

    scene.add(instancedMesh)

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambLight)

    const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0)
    dirLight.position.set(4, 5, 5)
    scene.add(dirLight)

    const accentLight = new THREE.PointLight(new THREE.Color(accentColor), 3.5, 8)
    accentLight.position.set(0, 0, 3)
    scene.add(accentLight)

    // Mouse interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
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

    let clock = 0
    const animate = () => {
      if (disposed) return
      animId = requestAnimationFrame(animate)
      clock += 0.016

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      camera.position.x = mouse.x * 0.4
      camera.position.y = mouse.y * 0.4
      camera.lookAt(0, 0, 0)

      for (let i = 0; i < count; i++) {
        const p = particles[i]
        p.rotX += p.rotSpeedX
        p.rotY += p.rotSpeedY
        p.rotZ += p.rotSpeedZ

        const floatY = Math.sin(clock * p.floatSpeed + p.floatPhase) * p.floatRadius
        const floatX = Math.cos(clock * p.floatSpeed * 0.7 + p.floatPhase) * (p.floatRadius * 0.8)

        // Smooth continuous mouse turbulence without jitter or lag
        const dx = p.baseX - mouse.x * 3
        const dy = p.baseY - mouse.y * 2.5
        const distSq = dx * dx + dy * dy
        let pushX = 0
        let pushY = 0
        if (distSq < 3.5 && distSq > 0.01) {
          const pushMag = (3.5 - distSq) * 0.1
          const angle = Math.atan2(dy, dx)
          pushX = Math.cos(angle) * pushMag
          pushY = Math.sin(angle) * pushMag
        }

        dummy.position.set(
          p.baseX + floatX + pushX,
          p.baseY + floatY + pushY,
          p.baseZ
        )
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ)
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()

        instancedMesh.setMatrixAt(i, dummy.matrix)
      }

      instancedMesh.instanceMatrix.needsUpdate = true
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
      renderer.dispose()
    }
  }, [type, accentColor])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
