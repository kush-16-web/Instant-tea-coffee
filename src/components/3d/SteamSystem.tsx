import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface SteamSystemProps {
  intensity?: number // 0 to 1
  position?: [number, number, number]
}

/**
 * Lightweight, procedural rising steam system using soft radial gradient particles
 * with gentle upward drift, slight harmonic sway, and natural opacity fading.
 */
export function SteamSystem({ intensity = 1, position = [0, 1.6, 0] }: SteamSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const COUNT = 36

  // Generate soft radial puff texture dynamically without needing external image assets
  const steamTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30)
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)')
      grad.addColorStop(0.3, 'rgba(240, 230, 220, 0.25)')
      grad.addColorStop(0.7, 'rgba(220, 210, 200, 0.08)')
      grad.addColorStop(1, 'rgba(200, 190, 180, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 64, 64)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  // Particle positions and attributes
  const { positions, velocities, originalData } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const vel = new Float32Array(COUNT * 3)
    const orig = []

    for (let i = 0; i < COUNT; i++) {
      // Spawn near cup surface radius
      const r = Math.random() * 0.75
      const theta = Math.random() * Math.PI * 2
      const x = Math.cos(theta) * r
      const y = Math.random() * 1.8
      const z = Math.sin(theta) * r

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      vel[i * 3] = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 1] = 0.008 + Math.random() * 0.012 // Upward rise
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003

      orig.push({
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 1.2 + Math.random() * 1.5,
        spawnR: r,
        spawnTheta: theta,
      })
    }

    return {
      positions: pos,
      velocities: vel,
      originalData: orig,
    }
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [positions])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: steamTexture,
        size: 0.85,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.NormalBlending,
        color: new THREE.Color('#faf5ee'),
      }),
    [steamTexture]
  )

  useFrame((state, delta) => {
    if (!pointsRef.current || intensity <= 0.01) return
    const d = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArr = posAttr.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3
      const data = originalData[i]

      // Rise upward
      posArr[idx + 1] += velocities[idx + 1] * 60 * d

      // Delicate sway
      const sway = Math.sin(time * data.swaySpeed + data.phase) * 0.003
      posArr[idx] += sway
      posArr[idx + 2] += Math.cos(time * data.swaySpeed + data.phase) * 0.002

      // Reset when floating high
      if (posArr[idx + 1] > 2.4) {
        posArr[idx + 1] = 0.05
        const r = Math.random() * 0.65
        const theta = Math.random() * Math.PI * 2
        posArr[idx] = Math.cos(theta) * r
        posArr[idx + 2] = Math.sin(theta) * r
      }
    }

    posAttr.needsUpdate = true
    // Modulate opacity with intensity
    material.opacity = 0.22 * intensity
  })

  if (intensity <= 0.01) return null

  return (
    <group position={position}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  )
}
