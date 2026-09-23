import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Procedural authentic roasted coffee bean geometry:
 * An elongated oval with a longitudinal center fissure crease and subtle curved posture.
 */
export function createCoffeeBeanGeometry(): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(0.24, 24, 20)
  const pos = geom.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)

    // Elongate along Y axis
    v.y *= 1.45
    // Flatten along Z axis
    v.z *= 0.72

    // Indent the characteristic center crease on front side (z > 0)
    if (v.z > -0.05) {
      const distFromCenter = Math.abs(v.x)
      const creaseDepth = Math.max(0, 1.0 - distFromCenter / 0.11)
      v.z -= creaseDepth * 0.075

      // Slight longitudinal bend
      v.z += (v.y * v.y) * 0.15
    }

    pos.setXYZ(i, v.x, v.y, v.z)
  }

  geom.computeVertexNormals()
  return geom
}

interface BeanData {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  rotX: number
  rotY: number
  rotZ: number
  rotSpeedX: number
  rotSpeedY: number
  rotSpeedZ: number
  scale: number
  originalZ: number
  layer: 'far' | 'mid' | 'front'
}

interface CoffeeBeanFieldProps {
  scrollProgress: number
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  gatherIntoCup?: boolean
}

export function CoffeeBeanField({
  scrollProgress,
  mouseRef,
  gatherIntoCup = false,
}: CoffeeBeanFieldProps) {
  const farMeshRef = useRef<THREE.InstancedMesh>(null)
  const midMeshRef = useRef<THREE.InstancedMesh>(null)
  const frontMeshRef = useRef<THREE.InstancedMesh>(null)

  const FAR_COUNT = 45
  const MID_COUNT = 32
  const FRONT_COUNT = 14

  // Single reusable geometry
  const beanGeometry = useMemo(() => createCoffeeBeanGeometry(), [])

  // Shared realistic roasted bean materials tailored per depth layer
  const farMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#28140c', // Dark roast silhouette
        roughness: 0.65,
        metalness: 0.1,
        transparent: true,
        opacity: 0.55,
      }),
    []
  )

  const midMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#381c10', // Rich espresso brown
        roughness: 0.42,
        metalness: 0.15,
      }),
    []
  )

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4a2515', // Warm lustrous roasted bean
        roughness: 0.28,
        metalness: 0.22,
      }),
    []
  )

  // Initialize individual bean state for each layer
  const { farBeans, midBeans, frontBeans } = useMemo(() => {
    const makeBeans = (
      count: number,
      layer: 'far' | 'mid' | 'front',
      zMin: number,
      zMax: number,
      scaleMin: number,
      scaleMax: number,
      speedMin: number,
      speedMax: number
    ): BeanData[] => {
      const list: BeanData[] = []
      for (let i = 0; i < count; i++) {
        list.push({
          x: (Math.random() - 0.5) * (layer === 'far' ? 14 : layer === 'mid' ? 11 : 8),
          y: (Math.random() - 0.5) * 12 + 1,
          z: zMin + Math.random() * (zMax - zMin),
          vx: (Math.random() - 0.5) * 0.005,
          vy: -(speedMin + Math.random() * (speedMax - speedMin)),
          rotX: Math.random() * Math.PI * 2,
          rotY: Math.random() * Math.PI * 2,
          rotZ: Math.random() * Math.PI * 2,
          rotSpeedX: (Math.random() - 0.5) * 0.02,
          rotSpeedY: (Math.random() - 0.5) * 0.025,
          rotSpeedZ: (Math.random() - 0.5) * 0.015,
          scale: scaleMin + Math.random() * (scaleMax - scaleMin),
          originalZ: 0,
          layer,
        })
      }
      return list
    }

    return {
      farBeans: makeBeans(FAR_COUNT, 'far', -5, -2.5, 0.45, 0.65, 0.008, 0.018),
      midBeans: makeBeans(MID_COUNT, 'mid', -2.0, 0.5, 0.75, 1.05, 0.016, 0.028),
      frontBeans: makeBeans(FRONT_COUNT, 'front', 1.0, 3.2, 1.25, 1.6, 0.024, 0.042),
    }
  }, [])

  // Dummy matrix container to avoid allocations inside loop
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    const mouseX = mouseRef.current?.x || 0
    const mouseY = mouseRef.current?.y || 0

    // Frame-rate clamped delta to prevent sudden jumps
    const d = Math.min(delta, 0.05)
    const scrollAccel = 1.0 + scrollProgress * 1.8

    // Animate Layer 1: FAR BEANS
    if (farMeshRef.current) {
      const pFactor = 0.15
      for (let i = 0; i < farBeans.length; i++) {
        const b = farBeans[i]
        b.y += b.vy * scrollAccel * 60 * d
        b.x += b.vx * 60 * d
        b.rotX += b.rotSpeedX
        b.rotY += b.rotSpeedY

        // Wrap around when falling past bottom
        if (b.y < -6.5) {
          b.y = 6.5
          b.x = (Math.random() - 0.5) * 14
        }

        dummy.position.set(b.x + mouseX * pFactor, b.y + mouseY * pFactor * 0.5, b.z)
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ)
        dummy.scale.setScalar(b.scale)
        dummy.updateMatrix()
        farMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      farMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // Animate Layer 2: MID BEANS
    if (midMeshRef.current) {
      const pFactor = 0.38
      for (let i = 0; i < midBeans.length; i++) {
        const b = midBeans[i]

        // Bean gathering toward cup behavior during mid-scroll
        if (gatherIntoCup && scrollProgress > 0.15 && scrollProgress < 0.45) {
          const funnelFactor = (scrollProgress - 0.15) / 0.3
          b.x += (0 - b.x) * funnelFactor * 0.04
          b.z += (0 - b.z) * funnelFactor * 0.04
          b.y += (0.8 - b.y) * funnelFactor * 0.03
        } else {
          b.y += b.vy * scrollAccel * 60 * d
          b.x += b.vx * 60 * d
        }

        b.rotX += b.rotSpeedX
        b.rotY += b.rotSpeedY
        b.rotZ += b.rotSpeedZ

        if (b.y < -6.5) {
          b.y = 6.5
          b.x = (Math.random() - 0.5) * 11
        }

        dummy.position.set(b.x + mouseX * pFactor, b.y + mouseY * pFactor * 0.5, b.z)
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ)
        dummy.scale.setScalar(b.scale)
        dummy.updateMatrix()
        midMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      midMeshRef.current.instanceMatrix.needsUpdate = true
    }

    // Animate Layer 3: FRONT BEANS
    if (frontMeshRef.current) {
      const pFactor = 0.85
      for (let i = 0; i < frontBeans.length; i++) {
        const b = frontBeans[i]
        b.y += b.vy * scrollAccel * 60 * d
        b.x += b.vx * 60 * d
        b.rotX += b.rotSpeedX * 1.5
        b.rotY += b.rotSpeedY * 1.5
        b.rotZ += b.rotSpeedZ * 1.5

        if (b.y < -6.5) {
          b.y = 6.5
          b.x = (Math.random() - 0.5) * 8
        }

        dummy.position.set(b.x + mouseX * pFactor, b.y + mouseY * pFactor * 0.7, b.z)
        dummy.rotation.set(b.rotX, b.rotY, b.rotZ)
        dummy.scale.setScalar(b.scale)
        dummy.updateMatrix()
        frontMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      frontMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Layer 1: Far Layer */}
      <instancedMesh
        ref={farMeshRef}
        args={[beanGeometry, farMaterial, FAR_COUNT]}
        frustumCulled={false}
      />
      {/* Layer 2: Mid Layer */}
      <instancedMesh
        ref={midMeshRef}
        args={[beanGeometry, midMaterial, MID_COUNT]}
        frustumCulled={false}
        castShadow
      />
      {/* Layer 3: Front Layer */}
      <instancedMesh
        ref={frontMeshRef}
        args={[beanGeometry, frontMaterial, FRONT_COUNT]}
        frustumCulled={false}
        castShadow
      />
    </group>
  )
}
