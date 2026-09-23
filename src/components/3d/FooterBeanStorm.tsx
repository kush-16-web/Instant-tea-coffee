import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createCoffeeBeanGeometry } from './CoffeeBeanField'
import { DraggableBean } from './DraggableBean'

interface FooterBeanStormProps {
  active: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  onFlavorReveal?: (note: string, screenPos: { x: number; y: number }) => void
}

export function FooterBeanStorm({
  active,
  mouseRef,
  onFlavorReveal,
}: FooterBeanStormProps) {
  const backMeshRef = useRef<THREE.InstancedMesh>(null)
  const midMeshRef = useRef<THREE.InstancedMesh>(null)

  const BACK_COUNT = 55
  const MID_COUNT = 38

  const beanGeometry = useMemo(() => createCoffeeBeanGeometry(), [])

  // Deep background beans (pass behind text)
  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a160d',
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
      }),
    []
  )

  // Mid-ground beans
  const midMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#422213',
        roughness: 0.38,
        metalness: 0.18,
      }),
    []
  )

  const { backBeans, midBeans } = useMemo(() => {
    const makeData = (count: number, zMin: number, zMax: number, sMin: number, sMax: number) => {
      const arr = []
      for (let i = 0; i < count; i++) {
        arr.push({
          x: (Math.random() - 0.5) * 16,
          y: Math.random() * 14 - 4,
          z: zMin + Math.random() * (zMax - zMin),
          vy: -(0.015 + Math.random() * 0.035),
          vx: (Math.random() - 0.5) * 0.005,
          rotX: Math.random() * Math.PI * 2,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          rotSpeedX: 0.01 + Math.random() * 0.02,
          rotSpeedY: 0.01 + Math.random() * 0.02,
          scale: sMin + Math.random() * (sMax - sMin),
        })
      }
      return arr
    }

    return {
      backBeans: makeData(BACK_COUNT, -6, -2, 0.45, 0.7),
      midBeans: makeData(MID_COUNT, -1.5, 0.8, 0.85, 1.15),
    }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    if (!active) return
    const d = Math.min(delta, 0.05)
    const mouseX = mouseRef.current?.x || 0
    const mouseY = mouseRef.current?.y || 0

    // Background beans (behind text)
    if (backMeshRef.current) {
      for (let i = 0; i < BACK_COUNT; i++) {
        const b = backBeans[i]
        b.y += b.vy * 60 * d
        b.x += b.vx * 60 * d
        b.rotX += b.rotSpeedX
        b.rotY += b.rotSpeedY

        if (b.y < -7.0) {
          b.y = 7.0
          b.x = (Math.random() - 0.5) * 16
        }

        dummy.position.set(b.x + mouseX * 0.12, b.y + mouseY * 0.12, b.z)
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ)
        dummy.scale.setScalar(b.scale)
        dummy.updateMatrix()
        backMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      backMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // Midground beans
    if (midMeshRef.current) {
      for (let i = 0; i < MID_COUNT; i++) {
        const b = midBeans[i]
        b.y += b.vy * 60 * d
        b.x += b.vx * 60 * d
        b.rotX += b.rotSpeedX
        b.rotY += b.rotSpeedY

        if (b.y < -7.0) {
          b.y = 7.0
          b.x = (Math.random() - 0.5) * 13
        }

        dummy.position.set(b.x + mouseX * 0.35, b.y + mouseY * 0.35, b.z)
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ)
        dummy.scale.setScalar(b.scale)
        dummy.updateMatrix()
        midMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      midMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  // Foreground interactive beans passing in front of text
  const interactiveBeans = useMemo(
    () => [
      { id: 'f1', pos: [-3.2, 0.5, 2.2] as [number, number, number], note: 'DARK CHOCOLATE FUDGE', scale: 1.5 },
      { id: 'f2', pos: [3.4, -0.8, 2.4] as [number, number, number], note: 'GOLDEN CARAMEL', scale: 1.45 },
      { id: 'f3', pos: [-1.2, -2.5, 2.1] as [number, number, number], note: 'ROASTED ALMOND', scale: 1.4 },
      { id: 'f4', pos: [1.8, 1.8, 2.3] as [number, number, number], note: 'ROYAL CARDAMOM', scale: 1.55 },
      { id: 'f5', pos: [0.2, -1.2, 2.6] as [number, number, number], note: 'BERGAMOT BLOSSOM', scale: 1.35 },
    ],
    []
  )

  if (!active) return null

  return (
    <group position={[0, -0.5, 0]}>
      {/* Background layer (behind HTML text) */}
      <instancedMesh
        ref={backMeshRef}
        args={[beanGeometry, backMaterial, BACK_COUNT]}
        frustumCulled={false}
      />
      {/* Midground layer */}
      <instancedMesh
        ref={midMeshRef}
        args={[beanGeometry, midMaterial, MID_COUNT]}
        frustumCulled={false}
        castShadow
      />
      {/* Foreground interactive layer (in front of text) */}
      {interactiveBeans.map((ib) => (
        <DraggableBean
          key={ib.id}
          initialPosition={ib.pos}
          scale={ib.scale}
          flavorNote={ib.note}
          onFlavorReveal={onFlavorReveal}
        />
      ))}
    </group>
  )
}
