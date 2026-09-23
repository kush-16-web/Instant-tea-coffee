import { useMemo } from 'react'
import * as THREE from 'three'

interface TeaCupGlassProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  visible?: boolean
}

/**
 * Minimalist borosilicate glass teacup with subtle transparency,
 * delicate curved handle, and bamboo/wood coaster.
 */
export function TeaCupGlass({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  visible = true,
}: TeaCupGlassProps) {
  // Lathe geometry for double-walled cylindrical tea glass
  const { glassGeometry, saucerGeometry } = useMemo(() => {
    const points: THREE.Vector2[] = []
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(0.68, 0.02))
    points.push(new THREE.Vector2(0.78, 0.2))
    points.push(new THREE.Vector2(0.88, 0.8))
    points.push(new THREE.Vector2(0.96, 1.5))
    points.push(new THREE.Vector2(0.98, 1.7)) // Outer rim
    // Inner wall
    points.push(new THREE.Vector2(0.93, 1.7))
    points.push(new THREE.Vector2(0.88, 1.45))
    points.push(new THREE.Vector2(0.79, 0.8))
    points.push(new THREE.Vector2(0.68, 0.25))
    points.push(new THREE.Vector2(0.55, 0.12))
    points.push(new THREE.Vector2(0, 0.12))

    const gGeom = new THREE.LatheGeometry(points, 40)

    // Wood / stone coaster
    const sPoints: THREE.Vector2[] = []
    sPoints.push(new THREE.Vector2(0, -0.06))
    sPoints.push(new THREE.Vector2(1.25, -0.06))
    sPoints.push(new THREE.Vector2(1.3, -0.01))
    sPoints.push(new THREE.Vector2(1.25, 0.04))
    sPoints.push(new THREE.Vector2(0, 0.04))
    const sGeom = new THREE.LatheGeometry(sPoints, 40)

    return { glassGeometry: gGeom, saucerGeometry: sGeom }
  }, [])

  // Borosilicate glass material
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        metalness: 0.05,
        roughness: 0.12,
        transmission: 0.82, // Glass transparency
        ior: 1.45,
        thickness: 0.5,
        transparent: true,
        opacity: 0.65,
        specularIntensity: 0.9,
      }),
    []
  )

  const coasterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#414833', // Deep botanical sage stone
        roughness: 0.55,
        metalness: 0.08,
      }),
    []
  )

  return (
    <group position={position} rotation={rotation} scale={scale} visible={visible}>
      <mesh geometry={glassGeometry} material={glassMaterial} castShadow receiveShadow />
      <mesh geometry={saucerGeometry} material={coasterMaterial} position={[0, -0.02, 0]} receiveShadow />
    </group>
  )
}
