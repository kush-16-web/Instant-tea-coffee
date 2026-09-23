import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { CeramicCup } from './CeramicCup'
import { LiquidShader } from './LiquidShader'
import { CoffeeBeanField } from './CoffeeBeanField'
import { DraggableForegroundGroup } from './DraggableBean'
import { SteamSystem } from './SteamSystem'
import { TeaCupGlass } from './TeaCupGlass'
import { FloatingTeaLeaves } from './FloatingTeaLeaves'
import { FooterBeanStorm } from './FooterBeanStorm'
import { CameraRig } from './CameraRig'

interface SceneCanvasProps {
  scrollProgress: number // 0 to 1
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  onFlavorReveal?: (note: string, screenPos: { x: number; y: number }) => void
}

export function SceneCanvas({
  scrollProgress,
  mouseRef,
  onFlavorReveal,
}: SceneCanvasProps) {
  // Compute contextual fill, steam, and section transitions
  const p = Math.min(1, Math.max(0, scrollProgress))

  // Coffee liquid fills between 0.22 and 0.52 of scroll
  const coffeeFill = useMemo(() => {
    if (p < 0.22) return 0
    if (p > 0.52) return 1
    return (p - 0.22) / 0.3
  }, [p])

  // Tea liquid fills between 0.70 and 0.82
  const teaFill = useMemo(() => {
    if (p < 0.7) return 0
    if (p > 0.82) return 1
    return (p - 0.7) / 0.12
  }, [p])

  // Steam intensity: increases as coffee/tea fills
  const steamIntensity = useMemo(() => {
    if (p >= 0.45 && p <= 0.72) return Math.min(1, (p - 0.45) / 0.1) // Coffee top-down steam
    if (p >= 0.74 && p <= 0.86) return Math.min(1, (p - 0.74) / 0.08) // Tea steam
    if (p >= 0.9) return 0.85 // Final CTA steam
    return 0
  }, [p])

  // Is Tea section dominant? (0.68 to 0.86)
  const isTeaSection = p >= 0.68 && p <= 0.86
  // Is Footer bean storm dominant? (0.85 to 1.0)
  const isFooterSection = p >= 0.84

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 2.2, 5.2], fov: 42 }}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          {/* Studio Lighting System */}
          <ambientLight color="#fff7ed" intensity={0.7} />
          
          {/* Key warm studio spot */}
          <directionalLight
            position={[4, 7, 5]}
            color="#ffe8d1"
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={18}
            shadow-camera-left={-4}
            shadow-camera-right={4}
            shadow-camera-top={4}
            shadow-camera-bottom={-4}
            shadow-bias={-0.0005}
          />

          {/* Rim light for ceramic luster */}
          <directionalLight position={[-4, 3, -3]} color="#d6e6ff" intensity={0.9} />
          
          {/* Soft amber ground bounce */}
          <pointLight position={[0, -1.5, 1]} color="#e09f3e" intensity={0.5} distance={6} />

          {/* Persistent Cinematic Camera Choreography */}
          <CameraRig scrollProgress={p} mouseRef={mouseRef} />

          {/* 1. COFFEE EXPERIENCE (Hero, Pour, Orbit, Top reveal, Final CTA) */}
          <group visible={!isTeaSection && p < 0.88}>
            <CeramicCup position={[0, 0, 0]} />
            <LiquidShader fillProgress={coffeeFill} isTea={false} wobbleIntensity={0.6} />
            <SteamSystem intensity={steamIntensity} position={[0, 1.6, 0]} />
          </group>

          {/* 2. TEA EXPERIENCE (0.68 to 0.88) */}
          <group visible={isTeaSection}>
            <TeaCupGlass position={[0, 0, 0]} />
            <LiquidShader fillProgress={teaFill} isTea={true} wobbleIntensity={0.4} />
            <SteamSystem intensity={steamIntensity} position={[0, 1.65, 0]} />
            <FloatingTeaLeaves active={isTeaSection} mouseRef={mouseRef} />
          </group>

          {/* 3. HERO & INGREDIENT FALLING BEANS */}
          {p < 0.72 && (
            <>
              <CoffeeBeanField
                scrollProgress={p}
                mouseRef={mouseRef}
                gatherIntoCup={p > 0.15 && p < 0.45}
              />
              {/* Interactive Foreground Beans in Hero */}
              {p < 0.28 && <DraggableForegroundGroup onFlavorReveal={onFlavorReveal} />}
            </>
          )}

          {/* 4. FOOTER BEAN STORM */}
          {isFooterSection && (
            <FooterBeanStorm
              active={isFooterSection}
              mouseRef={mouseRef}
              onFlavorReveal={onFlavorReveal}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
