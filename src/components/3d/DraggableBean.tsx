import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { createCoffeeBeanGeometry } from './CoffeeBeanField'

interface DraggableBeanProps {
  initialPosition: [number, number, number]
  scale?: number
  flavorNote?: string
  onFlavorReveal?: (note: string, screenPos: { x: number; y: number }) => void
}

export function DraggableBean({
  initialPosition,
  scale = 1.35,
  flavorNote = 'DARK CHOCOLATE',
  onFlavorReveal,
}: DraggableBeanProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()

  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Motion physics variables
  const pos = useRef(new THREE.Vector3(...initialPosition))
  const vel = useRef(new THREE.Vector3(0, -0.015, 0))
  const basePos = useRef(new THREE.Vector3(...initialPosition))
  const targetDragPos = useRef(new THREE.Vector3())
  const lastDragPos = useRef(new THREE.Vector3())
  const rotation = useRef(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0))
  const rotVel = useRef(new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0))

  const beanGeometry = useMemo(() => createCoffeeBeanGeometry(), [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4e2817', // Rich roasted coffee bean
        roughness: 0.25,
        metalness: 0.25,
        emissive: new THREE.Color('#000000'),
      }),
    []
  )

  // Drag plane for projection
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -initialPosition[2]), [initialPosition])
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const intersectionPoint = useMemo(() => new THREE.Vector3(), [])

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    setIsDragging(true)

    // Notify cursor / UI
    if (onFlavorReveal) {
      // Calculate 2D screen coordinate
      const p = pos.current.clone().project(camera)
      const sx = ((p.x + 1) * size.width) / 2
      const sy = ((-p.y + 1) * size.height) / 2
      onFlavorReveal(flavorNote, { x: sx, y: sy })
    }
  }

  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    if (isDragging) {
      setIsDragging(false)
      // Throw momentum: calculate velocity from last drag displacement
      vel.current.copy(targetDragPos.current).sub(lastDragPos.current).multiplyScalar(0.7)
      // Cap maximum fling speed
      vel.current.clampLength(0, 0.45)
      // Impart rotational spin from throw
      rotVel.current.set(
        (Math.random() - 0.5) * 0.2 + vel.current.y * 0.5,
        (Math.random() - 0.5) * 0.2 + vel.current.x * 0.5,
        (Math.random() - 0.5) * 0.1
      )
    }
  }

  const handlePointerMove = (e: any) => {
    if (!isDragging) return
    e.stopPropagation()

    // Raycast from pointer to 3D plane at bean depth
    const ndcX = (e.clientX / size.width) * 2 - 1
    const ndcY = -(e.clientY / size.height) * 2 + 1
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)

    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
      lastDragPos.current.copy(targetDragPos.current)
      targetDragPos.current.copy(intersectionPoint)
    }
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const d = Math.min(delta, 0.05)

    if (isDragging) {
      // Spring follow drag point
      pos.current.lerp(targetDragPos.current, 0.32)
      // Tilt bean in direction of drag
      const dragDelta = targetDragPos.current.clone().sub(pos.current)
      rotation.current.z = -dragDelta.x * 1.5
      rotation.current.x = dragDelta.y * 1.5
    } else {
      // Apply momentum velocity
      pos.current.addScaledVector(vel.current, 60 * d)
      // Damping velocity toward gentle downward drift
      vel.current.x *= 0.92
      vel.current.z *= 0.92
      vel.current.y = THREE.MathUtils.lerp(vel.current.y, -0.016, 0.04)

      // Spring restore toward initial X & Z boundary to stay in view
      pos.current.x = THREE.MathUtils.lerp(pos.current.x, basePos.current.x, 0.01)
      pos.current.z = THREE.MathUtils.lerp(pos.current.z, basePos.current.z, 0.01)

      // Apply rotation velocity and damp
      rotation.current.x += rotVel.current.x
      rotation.current.y += rotVel.current.y
      rotation.current.z += rotVel.current.z
      rotVel.current.multiplyScalar(0.96)

      // Continuous falling loop
      if (pos.current.y < -5.5) {
        pos.current.y = 5.5
        pos.current.x = basePos.current.x + (Math.random() - 0.5) * 1.5
        vel.current.set(0, -0.015, 0)
      }
    }

    meshRef.current.position.copy(pos.current)
    meshRef.current.rotation.copy(rotation.current)

    // Hover visual feedback: subtle scale increase & highlight
    const targetScale = isDragging ? scale * 1.25 : isHovered ? scale * 1.15 : scale
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)

    // Highlight emissive on hover
    material.emissive.lerp(
      isDragging ? new THREE.Color('#44220e') : isHovered ? new THREE.Color('#2e160a') : new THREE.Color('#000000'),
      0.15
    )
  })

  return (
    <mesh
      ref={meshRef}
      geometry={beanGeometry}
      material={material}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation()
        setIsHovered(true)
        document.body.style.cursor = 'grab'
      }}
      onPointerOut={() => {
        setIsHovered(false)
        if (!isDragging) document.body.style.cursor = 'auto'
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    />
  )
}

interface DraggableForegroundGroupProps {
  onFlavorReveal?: (note: string, screenPos: { x: number; y: number }) => void
}

export function DraggableForegroundGroup({ onFlavorReveal }: DraggableForegroundGroupProps) {
  const beansConfig = useMemo(
    () => [
      { id: '1', pos: [-2.4, 2.2, 2.4] as [number, number, number], note: 'DARK CHOCOLATE 72%', scale: 1.4 },
      { id: '2', pos: [2.5, 0.8, 2.6] as [number, number, number], note: 'CARAMELIZED TOFFEE', scale: 1.35 },
      { id: '3', pos: [-1.8, -1.5, 2.2] as [number, number, number], note: 'ROASTED HAZELNUT', scale: 1.3 },
      { id: '4', pos: [2.2, -2.2, 2.5] as [number, number, number], note: 'SPICED CARDAMOM', scale: 1.45 },
    ],
    []
  )

  return (
    <group>
      {beansConfig.map((b) => (
        <DraggableBean
          key={b.id}
          initialPosition={b.pos}
          scale={b.scale}
          flavorNote={b.note}
          onFlavorReveal={onFlavorReveal}
        />
      ))}
    </group>
  )
}
