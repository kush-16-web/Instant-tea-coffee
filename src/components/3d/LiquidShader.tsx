import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface LiquidShaderProps {
  fillProgress: number // 0 to 1
  isTea?: boolean
  wobbleIntensity?: number
}

// GLSL Vertex Shader: creates delicate concentric ripples and wobble waves
const vertexShader = `
  uniform float uTime;
  uniform float uWobble;
  uniform float uFill;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Distance from center of liquid disk
    vec2 center = uv - vec2(0.5);
    float dist = length(center);
    
    // Wave ripples: harmonic ripples expanding from center
    float wave1 = sin(dist * 22.0 - uTime * 3.5) * 0.025;
    float wave2 = cos(center.x * 12.0 + uTime * 2.0) * sin(center.y * 12.0 + uTime * 2.2) * 0.02;
    
    // Wobble based on scroll agitation
    float wobble = sin(uTime * 4.0) * (center.x * 0.08) * uWobble;
    
    // Meniscus effect: slight elevation near edges of cup
    float meniscus = smoothstep(0.35, 0.5, dist) * 0.04;
    
    // Total displacement (only when filled > 0.02)
    float disp = (wave1 + wave2 + wobble + meniscus) * smoothstep(0.01, 0.1, uFill);
    vDisplacement = disp;
    
    vec3 transformed = position;
    transformed.z += disp; // Note: PlaneGeometry is in XY, normal along Z
    
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

// GLSL Fragment Shader: espresso/tea color gradient, crema rim, and specular Fresnel sheen
const fragmentShader = `
  uniform vec3 uColorBase;
  uniform vec3 uColorEdge;
  uniform vec3 uColorCrema;
  uniform float uFill;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uIsTea;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  void main() {
    // Distance from center
    vec2 center = vUv - vec2(0.5);
    float dist = length(center);
    
    // Clip circle (circular liquid surface)
    if (dist > 0.495) discard;
    
    // Fresnel highlight
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
    
    // Color gradient: deep center transitioning to lighter warm caramel rim
    float edgeFactor = smoothstep(0.2, 0.49, dist);
    vec3 baseCol = mix(uColorBase, uColorEdge, edgeFactor);
    
    // Subtle golden crema foam swirling rings near edges for coffee
    if (uIsTea < 0.5) {
      float cremaPattern = sin(dist * 40.0 - uTime * 0.5 + atan(center.y, center.x) * 4.0);
      float cremaMask = smoothstep(0.42, 0.485, dist) * smoothstep(0.2, 0.8, cremaPattern);
      baseCol = mix(baseCol, uColorCrema, cremaMask * 0.55);
    }
    
    // Add specular Fresnel reflection (warm studio rim reflection)
    vec3 lightReflect = vec3(0.95, 0.85, 0.72) * fresnel * 0.65;
    vec3 finalColor = baseCol + lightReflect;
    
    // Transparency: slightly higher for tea, opaque rich body for coffee
    float alpha = uOpacity * smoothstep(0.0, 0.05, uFill);
    if (uIsTea > 0.5) {
      alpha *= 0.88; // Translucent botanical tea broth
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function LiquidShader({
  fillProgress,
  isTea = false,
  wobbleIntensity = 0.5,
}: LiquidShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Compute liquid radius and Y height inside cup based on lathe geometry profile
  // Bottom of cup inner floor: Y = 0.14, radius = 0.65
  // Top of cup inner rim: Y = 1.62, radius = 1.28
  const clampedFill = Math.min(1, Math.max(0, fillProgress))
  const currentY = THREE.MathUtils.lerp(0.18, 1.55, clampedFill)
  const currentRadius = THREE.MathUtils.lerp(0.66, 1.26, clampedFill)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFill: { value: clampedFill },
      uWobble: { value: wobbleIntensity },
      uOpacity: { value: 0.98 },
      uIsTea: { value: isTea ? 1.0 : 0.0 },
      uColorBase: { value: new THREE.Color(isTea ? '#3f3815' : '#140a05') }, // Deep espresso / steep tea
      uColorEdge: { value: new THREE.Color(isTea ? '#7a6f2b' : '#3d1b09') }, // Warm amber caramel
      uColorCrema: { value: new THREE.Color('#c89b67') }, // Golden crema froth
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material as THREE.ShaderMaterial
    if (mat && mat.uniforms) {
      mat.uniforms.uTime.value = state.clock.getElapsedTime()
      mat.uniforms.uFill.value = clampedFill
      mat.uniforms.uWobble.value = THREE.MathUtils.lerp(mat.uniforms.uWobble.value, wobbleIntensity, 0.1)
      mat.uniforms.uIsTea.value = isTea ? 1.0 : 0.0

      // Smooth color transitions between coffee and tea
      const targetBase = new THREE.Color(isTea ? '#3a3311' : '#140a05')
      const targetEdge = new THREE.Color(isTea ? '#746a2a' : '#3d1b09')
      mat.uniforms.uColorBase.value.lerp(targetBase, 0.08)
      mat.uniforms.uColorEdge.value.lerp(targetEdge, 0.08)
    }
  })

  // Geometry: circular tessellated plane rotated horizontal
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2, 48, 48), [])

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [uniforms]
  )

  // When fillProgress is near zero, hide liquid to avoid clipping
  if (clampedFill < 0.02) return null

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={shaderMaterial}
      position={[0, currentY, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[currentRadius, currentRadius, 1]}
    />
  )
}
