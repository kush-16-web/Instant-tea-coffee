import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

interface CameraRigProps {
  scrollProgress: number // 0 to 1
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

/**
 * Cinematic camera choreography driven by normalized scroll progression and subtle mouse parallax.
 *
 * Choreography keyframes:
 * 0.00 - 0.15 : Hero view, slightly elevated above the glazed ceramic cup
 * 0.15 - 0.30 : Push toward cup; beans accelerate and gather
 * 0.30 - 0.50 : Camera shifts right and begins orbiting as coffee liquid fills the cup
 * 0.50 - 0.70 : Orbit higher; looks downward directly into the shimmering dark coffee surface & steam
 * 0.70 - 0.85 : Smooth transition to Tea section (camera pulls back and frames glass vessel)
 * 0.85 - 1.00 : Pulls back for final CTA and footer bean storm
 */
export function CameraRig({ scrollProgress, mouseRef }: CameraRigProps) {
  const { camera } = useThree()

  const currentCamPos = useRef(new THREE.Vector3(0, 2.2, 5.2))
  const currentLookAt = useRef(new THREE.Vector3(0, 0.6, 0))
  const targetCamPos = useRef(new THREE.Vector3(0, 2.2, 5.2))
  const targetLookAt = useRef(new THREE.Vector3(0, 0.6, 0))

  useFrame(() => {
    const p = Math.min(1, Math.max(0, scrollProgress))
    const mouseX = mouseRef.current?.x || 0
    const mouseY = mouseRef.current?.y || 0

    // Keyframe Interpolation based on scroll timeline
    if (p <= 0.15) {
      // Hero Stage
      const t = p / 0.15
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0, 0.3, t),
        THREE.MathUtils.lerp(2.2, 1.8, t),
        THREE.MathUtils.lerp(5.2, 4.2, t)
      )
      targetLookAt.current.set(0, THREE.MathUtils.lerp(0.6, 0.7, t), 0)
    } else if (p <= 0.32) {
      // Approach & Bean Gathering
      const t = (p - 0.15) / 0.17
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.3, 1.2, t),
        THREE.MathUtils.lerp(1.8, 1.6, t),
        THREE.MathUtils.lerp(4.2, 3.4, t)
      )
      targetLookAt.current.set(0, THREE.MathUtils.lerp(0.7, 0.8, t), 0)
    } else if (p <= 0.52) {
      // Liquid Fill & Orbiting
      const t = (p - 0.32) / 0.2
      targetCamPos.current.set(
        THREE.MathUtils.lerp(1.2, 1.9, t),
        THREE.MathUtils.lerp(1.6, 2.6, t),
        THREE.MathUtils.lerp(3.4, 2.2, t)
      )
      targetLookAt.current.set(0, THREE.MathUtils.lerp(0.8, 0.9, t), 0)
    } else if (p <= 0.70) {
      // Top-down Coffee Reveal
      const t = (p - 0.52) / 0.18
      targetCamPos.current.set(
        THREE.MathUtils.lerp(1.9, 0.1, t),
        THREE.MathUtils.lerp(2.6, 4.2, t),
        THREE.MathUtils.lerp(2.2, 0.6, t)
      )
      targetLookAt.current.set(0, 0.9, 0)
    } else if (p <= 0.86) {
      // Tea Experience Transition
      const t = (p - 0.7) / 0.16
      targetCamPos.current.set(
        THREE.MathUtils.lerp(0.1, -1.2, t),
        THREE.MathUtils.lerp(4.2, 2.0, t),
        THREE.MathUtils.lerp(0.6, 4.4, t)
      )
      targetLookAt.current.set(0, 0.7, 0)
    } else {
      // Final CTA & Bean Storm
      const t = (p - 0.86) / 0.14
      targetCamPos.current.set(
        THREE.MathUtils.lerp(-1.2, 0, t),
        THREE.MathUtils.lerp(2.0, 1.8, t),
        THREE.MathUtils.lerp(4.4, 5.5, t)
      )
      targetLookAt.current.set(0, 0.6, 0)
    }

    // Add subtle cinematic mouse parallax to camera position
    const parallaxX = mouseX * 0.25
    const parallaxY = mouseY * 0.18

    // Smooth interpolation with damp factor
    currentCamPos.current.x = THREE.MathUtils.lerp(currentCamPos.current.x, targetCamPos.current.x + parallaxX, 0.08)
    currentCamPos.current.y = THREE.MathUtils.lerp(currentCamPos.current.y, targetCamPos.current.y + parallaxY, 0.08)
    currentCamPos.current.z = THREE.MathUtils.lerp(currentCamPos.current.z, targetCamPos.current.z, 0.08)

    currentLookAt.current.lerp(targetLookAt.current, 0.08)

    camera.position.copy(currentCamPos.current)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
