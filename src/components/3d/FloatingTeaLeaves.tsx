import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Procedural curved tea leaf geometry:
 * An elongated curled leaf shape with central ridge spine.
 */
function createTeaLeafGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, -0.4)
  shape.bezierCurveTo(0.18, -0.2, 0.22, 0.1, 0, 0.45)
  shape.bezierCurveTo(-0.22, 0.1, -0.18, -0.2, 0, -0.4)

  const geom = new THREE.ShapeGeometry(shape, 12)
  const pos = geom.attributes.position
  const v = new THREE.Vector3()

  // Give the flat 2D leaf organic 3D curvature and center fold
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // Curvature along length
    v.z += (v.y * v.y) * 0.4
    // Curvature along width (cup-like curl)
    v.z -= Math.abs(v.x) * 0.35
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geom.computeVertexNormals()
  return geom
}

interface FloatingTeaLeavesProps {
  active: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function FloatingTeaLeaves({ active, mouseRef }: FloatingTeaLeavesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const COUNT = 32

  const leafGeometry = useMemo(() => createTeaLeafGeometry(), [])

  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4f6d49', // Botanical fresh tea leaf green
        roughness: 0.35,
        metalness: 0.1,
        side: THREE.DoubleSide,
      }),
    []
  )

  const leavesData = useMemo(() => {
    const arr = []
    for (let i = 0; i < COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 8 + 1,
        z: (Math.random() - 0.5) * 4 + 0.5,
        vy: -(0.012 + Math.random() * 0.016),
        vx: (Math.random() - 0.5) * 0.006,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: 0.015 + Math.random() * 0.02,
        rotSpeedY: 0.01 + Math.random() * 0.02,
        rotSpeedZ: 0.012 + Math.random() * 0.018,
        scale: 0.55 + Math.random() * 0.5,
        swayPhase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    if (!meshRef.current || !active) return
    const d = Math.min(delta, 0.05)
    const time = state.clock.getElapsedTime()
    const mouseX = mouseRef.current?.x || 0
    const mouseY = mouseRef.current?.y || 0

    for (let i = 0; i < COUNT; i++) {
      const leaf = leavesData[i]

      // Gentle fluttering leaf descent with sinusoidal sway
      leaf.y += leaf.vy * 60 * d
      leaf.x += Math.sin(time * 2.0 + leaf.swayPhase) * 0.008 + leaf.vx * 60 * d

      // Flutter rotation
      leaf.rotX += leaf.rotSpeedX
      leaf.rotY += leaf.rotSpeedY
      leaf.rotZ = Math.sin(time * 2.5 + leaf.swayPhase) * 0.6

      if (leaf.y < -4.5) {
        leaf.y = 5.5
        leaf.x = (Math.random() - 0.5) * 8
      }

      dummy.position.set(leaf.x + mouseX * 0.35, leaf.y + mouseY * 0.35, leaf.z)
      dummy.rotation.set(leaf.rotX, leaf.rotY, leaf.rotZ)
      dummy.scale.setScalar(leaf.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  if (!active) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[leafGeometry, leafMaterial, COUNT]}
      frustumCulled={false}
      castShadow
    />
  )
}
