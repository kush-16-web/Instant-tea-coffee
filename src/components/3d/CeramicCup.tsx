import { useMemo } from 'react'
import * as THREE from 'three'

interface CeramicCupProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  visible?: boolean
}

/**
 * Procedural ceramic artisan cup with saucer, smooth rim, and glazed ceramic finish.
 */
export function CeramicCup({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
}: CeramicCupProps) {
  // Cup body points for LatheGeometry to create a sleek cafe latte cup profile
  const { cupGeometry, rimGeometry, saucerGeometry } = useMemo(() => {
    // Cup profile points (lathe around Y axis)
    const points: THREE.Vector2[] = []
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.7, 0.04))
    points.push(new THREE.Vector2(0.85, 0.2))
    points.push(new THREE.Vector2(1.05, 0.6))
    points.push(new THREE.Vector2(1.25, 1.2))
    points.push(new THREE.Vector2(1.35, 1.6))
    points.push(new THREE.Vector2(1.38, 1.7)) // Outer rim
    // Inner wall
    points.push(new THREE.Vector2(1.32, 1.7))
    points.push(new THREE.Vector2(1.22, 1.4))
    points.push(new THREE.Vector2(1.0, 0.7))
    points.push(new THREE.Vector2(0.75, 0.2))
    points.push(new THREE.Vector2(0.65, 0.12))
    points.push(new THREE.Vector2(0, 0.12))

    const cupGeom = new THREE.LatheGeometry(points, 48)

    // Gold / glazed lip rim ring
    const rimGeom = new THREE.TorusGeometry(1.35, 0.035, 16, 48)

    // Saucer points
    const sPoints: THREE.Vector2[] = []
    sPoints.push(new THREE.Vector2(0, -0.05))
    sPoints.push(new THREE.Vector2(0.8, -0.05))
    sPoints.push(new THREE.Vector2(1.1, -0.02))
    sPoints.push(new THREE.Vector2(1.7, 0.08))
    sPoints.push(new THREE.Vector2(2.1, 0.28))
    sPoints.push(new THREE.Vector2(2.15, 0.26))
    sPoints.push(new THREE.Vector2(1.7, 0.04))
    sPoints.push(new THREE.Vector2(1.0, -0.08))
    sPoints.push(new THREE.Vector2(0.8, -0.09))
    sPoints.push(new THREE.Vector2(0, -0.09))
    const saucerGeom = new THREE.LatheGeometry(sPoints, 48)

    return { cupGeometry: cupGeom, rimGeometry: rimGeom, saucerGeometry: saucerGeom }
  }, [])

  // Curved ceramic handle
  const handleGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.12, 0.48, 0),
      new THREE.Vector3(1.72, 0.85, 0),
      new THREE.Vector3(1.68, 1.25, 0),
      new THREE.Vector3(1.24, 1.45, 0),
    ])
    return new THREE.TubeGeometry(curve, 32, 0.1, 16, false)
  }, [])

  // Glazed stoneware ceramic material
  const ceramicMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ebe3d5',
        roughness: 0.22,
        metalness: 0.04,
        bumpScale: 0.015,
      }),
    []
  )

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c49a62', // Warm amber-gold glaze highlight
        roughness: 0.35,
        metalness: 0.6,
      }),
    []
  )

  const saucerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e4dcd0',
        roughness: 0.28,
        metalness: 0.02,
      }),
    []
  )

  return (
    <group position={position} rotation={rotation} scale={scale} visible={visible}>
      {/* Main Cup Body */}
      <mesh geometry={cupGeometry} material={ceramicMaterial} castShadow receiveShadow />

      {/* Rim Detail */}
      <mesh
        geometry={rimGeometry}
        material={rimMaterial}
        position={[0, 1.68, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Ceramic Handle */}
      <mesh geometry={handleGeometry} material={ceramicMaterial} castShadow />

      {/* Saucer Plate */}
      <mesh geometry={saucerGeometry} material={saucerMaterial} position={[0, -0.04, 0]} receiveShadow />
    </group>
  )
}
