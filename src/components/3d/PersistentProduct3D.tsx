import { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { type GomziProduct } from '../../data/gomziProducts'

interface PersistentProduct3DProps {
  product: GomziProduct
  scrollProgressRef: React.MutableRefObject<number>
  deckSlotRef: React.RefObject<HTMLDivElement | null>
  debugRotationRef?: React.MutableRefObject<number>
  carouselOffsetRef?: React.MutableRefObject<number>
  interactionRotationRef?: React.MutableRefObject<number>
}

/**
 * Procedurally generates a crisp back-of-pack label texture
 * with nutrition facts, ingredients, barcode, and certification marks.
 */
function createBackLabelTexture(product: GomziProduct): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 2560
  const ctx = canvas.getContext('2d')!

  // Deep matte dark espresso background
  ctx.fillStyle = '#100c09'
  ctx.fillRect(0, 0, 2048, 2560)

  // Outer gold & copper border
  ctx.strokeStyle = '#3d281a'
  ctx.lineWidth = 12
  ctx.strokeRect(80, 80, 1888, 2400)

  ctx.strokeStyle = product.accentColor
  ctx.lineWidth = 4
  ctx.strokeRect(96, 96, 1856, 2368)

  // Top header brand mark
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 72px "Instrument Serif", Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('GOMZI LIFE SCIENCE', 1024, 220)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 48px "Manrope", sans-serif'
  ctx.fillText(product.name.toUpperCase(), 1024, 300)

  ctx.fillStyle = '#dcd0bf'
  ctx.font = '600 36px monospace'
  ctx.fillText(`Net Qty: ${product.netWeight} | Batch: GOM-${product.id.toUpperCase()}-2026`, 1024, 370)

  // Divider line
  ctx.strokeStyle = product.accentColor
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(160, 420)
  ctx.lineTo(1888, 420)
  ctx.stroke()

  // Nutrition Facts Box (High-contrast clean card)
  ctx.fillStyle = '#1a120d'
  ctx.fillRect(160, 470, 1728, 780)
  ctx.strokeStyle = '#5a3d28'
  ctx.lineWidth = 4
  ctx.strokeRect(160, 470, 1728, 780)

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.font = 'bold 56px "Manrope", sans-serif'
  ctx.fillText('NUTRITIONAL VALUES (LAB VERIFIED)', 220, 560)

  ctx.fillStyle = '#e8d8c3'
  ctx.font = '36px "Manrope", sans-serif'
  ctx.fillText(`Serving Size: ${product.size} | Standard Recommended Serving`, 220, 620)

  // Table header bar
  ctx.fillStyle = '#2c1e15'
  ctx.fillRect(200, 660, 1648, 72)
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 36px "Manrope", sans-serif'
  ctx.fillText('NUTRIENT COMPOSITION', 240, 710)
  ctx.textAlign = 'right'
  ctx.fillText('PER SERVING', 1480, 710)
  ctx.fillText('% RDA*', 1800, 710)

  const rows = [
    { name: 'Energy', val: product.id === 'atta' ? '348 kcal' : product.id === 'tea' ? '55 kcal' : '58 kcal', rda: '3%' },
    { name: 'Bioavailable Protein (Whey + Plant)', val: `${product.stats[0]?.value || 5}${product.stats[0]?.unit || 'g'}`, rda: '34%' },
    { name: 'Dietary Fibre (Whole Grain / Botanical)', val: product.id === 'atta' ? '9.2 g' : '0.8 g', rda: '18%' },
    { name: 'Total Carbohydrate', val: product.id === 'atta' ? '64 g' : '7.5 g', rda: '2%' },
    { name: 'Added Sugars (Refined Cane)', val: product.id === 'atta' ? '0.0 g' : '4.2 g', rda: '1%' },
    { name: 'Total Healthy Fats', val: product.id === 'atta' ? '2.1 g' : '1.2 g', rda: '2%' },
  ]

  rows.forEach((r, idx) => {
    const y = 800 + idx * 70
    if (idx % 2 === 1) {
      ctx.fillStyle = '#22160f'
      ctx.fillRect(200, y - 50, 1648, 64)
    }
    ctx.textAlign = 'left'
    ctx.fillStyle = idx === 1 ? product.accentColor : '#ffffff'
    ctx.font = idx === 1 ? 'bold 38px "Manrope", sans-serif' : '500 36px "Manrope", sans-serif'
    ctx.fillText(r.name, 240, y)

    ctx.textAlign = 'right'
    ctx.fillText(r.val, 1480, y)
    ctx.fillText(r.rda, 1800, y)
  })

  // Ingredients header
  ctx.textAlign = 'left'
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 46px "Manrope", sans-serif'
  ctx.fillText('AUTHENTIC INGREDIENTS LIST:', 160, 1340)

  ctx.fillStyle = '#f5efeb'
  ctx.font = '36px "Manrope", sans-serif'
  const ingredientsText = product.ingredients.join(' • ') + '.'
  wrapText(ctx, ingredientsText, 160, 1410, 1728, 54)

  // Allergen statement
  ctx.fillStyle = '#cbb094'
  ctx.font = 'italic 30px "Manrope", sans-serif'
  ctx.fillText('Allergens: Contains dairy (whey protein). Crafted in a facility handling tree nuts.', 160, 1560)

  // Certification Badges Row (100% Veg, FSSAI, GMP Tested)
  ctx.fillStyle = '#1c130d'
  ctx.fillRect(160, 1640, 520, 220)
  ctx.strokeStyle = '#5a3d28'
  ctx.lineWidth = 4
  ctx.strokeRect(160, 1640, 520, 220)

  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = 6
  ctx.strokeRect(210, 1700, 100, 100)
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(260, 1750, 32, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px "Manrope", sans-serif'
  ctx.fillText('100% VEG', 340, 1740)
  ctx.font = '28px "Manrope", sans-serif'
  ctx.fillStyle = '#cbb094'
  ctx.fillText('Pure Natural Formula', 340, 1785)

  // FSSAI Badge
  ctx.fillStyle = '#1c130d'
  ctx.fillRect(720, 1640, 560, 220)
  ctx.strokeStyle = '#5a3d28'
  ctx.strokeRect(720, 1640, 560, 220)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px "Instrument Serif", serif'
  ctx.fillText('fssai', 780, 1735)
  ctx.font = '28px monospace'
  ctx.fillStyle = '#cbb094'
  ctx.fillText('Lic. No. 10022021000845', 780, 1785)

  // NABL / GMP Badge
  ctx.fillStyle = '#1c130d'
  ctx.fillRect(1320, 1640, 568, 220)
  ctx.strokeStyle = '#5a3d28'
  ctx.strokeRect(1320, 1640, 568, 220)
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 36px "Manrope", sans-serif'
  ctx.fillText('GMP & ISO 22000', 1370, 1735)
  ctx.font = '28px "Manrope", sans-serif'
  ctx.fillStyle = '#cbb094'
  ctx.fillText('Clinical NABL Lab Batch 2026', 1370, 1785)

  // Barcode
  const barcodeY = 1940
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(240, barcodeY, 1568, 260)

  ctx.fillStyle = '#0a0604'
  for (let i = 300; i < 1740; i += 14) {
    const w = i % 6 === 0 ? 8 : i % 10 === 0 ? 4 : 10
    ctx.fillRect(i, barcodeY + 30, w, 150)
  }
  ctx.font = 'bold 42px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('8 908012 345678', 1024, barcodeY + 235)

  // Brand Footer
  ctx.fillStyle = '#dcd0bf'
  ctx.font = '28px "Manrope", sans-serif'
  ctx.fillText('Marketed & Distributed by Gomzi Life Science Pvt Ltd.', 1024, 2300)
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 32px "Manrope", sans-serif'
  ctx.fillText('WWW.GOMZILIFESCIENCE.COM', 1024, 2360)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

/**
 * Creates authentic pouch pillow geometry with curved gusset bulge and foil wrinkles
 */
function createPillowGeometry(w: number, h: number, bulge: number, shape: 'pouch' | 'sachet'): THREE.PlaneGeometry {
  const g = new THREE.PlaneGeometry(w, h, 48, 56)
  const pos = g.attributes.position
  const seamX = shape === 'sachet' ? 0.91 : 0.94
  const seamY = shape === 'sachet' ? 0.89 : 0.93

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / (w / 2)
    const y = pos.getY(i) / (h / 2)
    const fx = Math.max(0, 1 - Math.pow(Math.abs(x) / seamX, 4))
    const fy = Math.max(0, 1 - Math.pow(Math.abs(y) / seamY, 4))
    const gusset = shape === 'pouch' ? 0.85 + 0.3 * (1 - (y + 1) / 2) : 1
    const wrinkle = Math.sin(x * 9 + y * 6) * 0.004 + Math.cos(x * 14 - y * 11) * 0.003
    pos.setZ(i, (bulge * Math.sqrt(fx * fy) * gusset + wrinkle) * Math.min(w, h))
  }

  g.computeVertexNormals()
  return g
}

/**
 * Soft radial contact shadow texture
 */
function createShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(0, 0, 0, 0.75)')
  g.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

export function PersistentProduct3D({
  product,
  scrollProgressRef,
  deckSlotRef,
  debugRotationRef,
  carouselOffsetRef,
  interactionRotationRef,
}: PersistentProduct3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const shadowMeshRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()

  // Front texture loading state
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null)

  // Load front packaging artwork on product change
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(product.image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      setFrontTexture(tex)
    })
  }, [product.image])

  // Dimensions based on front texture aspect ratio
  const { W, H } = useMemo(() => {
    const img = frontTexture?.image as HTMLImageElement | undefined
    if (!img || !img.width || !img.height) return { W: 1.5, H: 2.0 }
    const aspect = img.width / img.height
    const h = 2.0
    return { W: h * aspect, H: h }
  }, [frontTexture])

  // Geometries and materials
  const geometry = useMemo(() => {
    return createPillowGeometry(W, H, product.bulge, product.shape)
  }, [W, H, product.bulge, product.shape])

  const backTexture = useMemo(() => {
    return createBackLabelTexture(product)
  }, [product])

  const shadowTexture = useMemo(() => {
    return createShadowTexture()
  }, [])

  const foilMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: frontTexture || undefined,
      roughness: 0.32,
      metalness: 0.12,
      clearcoat: 0.92,
      clearcoatRoughness: 0.18,
      reflectivity: 0.7,
    })
  }, [frontTexture])

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.44,
      metalness: 0.04,
      clearcoat: 0.15,
      clearcoatRoughness: 0.25,
    })
  }, [backTexture])

  // Pre-calculate target 3D world position of the deck slot reference element
  const targetDeckPos = useRef(new THREE.Vector3(0, 0.45, 0))
  const targetDeckScale = useRef(0.62)

  const updateDeckSlotCoordinates = () => {
    if (!deckSlotRef.current) return
    const rect = deckSlotRef.current.getBoundingClientRect()
    // Calculate normalized device coordinates of the center slot
    const ndcX = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1
    const ndcY = -(((rect.top + rect.height / 2) / window.innerHeight) * 2 - 1)

    // Unproject to 3D world space at z = 0
    const vec = new THREE.Vector3(ndcX, ndcY, 0.5)
    vec.unproject(camera)
    vec.sub(camera.position).normalize()
    const distance = -camera.position.z / vec.z
    const worldPos = camera.position.clone().add(vec.multiplyScalar(distance))

    targetDeckPos.current.copy(worldPos)

    // Calibrated target scale to guarantee comfortable vertical clearance from navbar and product info
    const isMobile = window.innerWidth < 768
    targetDeckScale.current = isMobile ? 0.52 : 0.62
  }

  useEffect(() => {
    updateDeckSlotCoordinates()
    window.addEventListener('resize', updateDeckSlotCoordinates)
    return () => window.removeEventListener('resize', updateDeckSlotCoordinates)
  }, [camera, size])

  // Real 3D motion loop driven by scroll progress
  useFrame((_state, delta) => {
    if (!groupRef.current) return

    const p = Math.max(0, Math.min(1, scrollProgressRef.current))
    const isMobile = window.innerWidth < 768

    // 1. ROTATION CHOREOGRAPHY:
    // 0.00 -> 0.20: Hero front presentation (rotation.y = 0)
    // 0.20 -> 0.45: Visible rotation exposing depth, foil shine & back nutrition label
    // 0.45 -> 0.75: Continues smooth rotation settling back to front presentation in Deck
    // 0.75 -> 1.00: Stable front presentation (0 / 2*PI)
    let targetRotY = 0

    if (p <= 0.20) {
      targetRotY = 0
    } else if (p <= 0.45) {
      // 0.20 to 0.45: rotate 0 to 180 degrees (PI radians)
      const t = (p - 0.20) / 0.25
      targetRotY = t * Math.PI
    } else if (p <= 0.75) {
      // 0.45 to 0.75: rotate from 180 to 360 degrees (2*PI radians)
      const t = (p - 0.45) / 0.30
      targetRotY = Math.PI + t * Math.PI
    } else {
      // Landed in deck: front presentation
      targetRotY = Math.PI * 2
    }

    // Blend manual interactive rotation from user drag in Hero state
    let manualRot = 0
    if (interactionRotationRef) {
      // As scroll proceeds past 0.15, smoothly hand over control to ScrollTrigger
      const scrollFade = Math.min(1, Math.max(0, (p - 0.12) / 0.18))
      manualRot = interactionRotationRef.current * (1 - scrollFade)
    }

    const finalRotY = targetRotY + manualRot

    // Apply rotation around the true 3D Y axis
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      finalRotY,
      12,
      delta
    )

    if (debugRotationRef) {
      debugRotationRef.current = THREE.MathUtils.radToDeg(groupRef.current.rotation.y) % 360
    }

    // 2. SCALE CHOREOGRAPHY:
    // 2. SCALE CHOREOGRAPHY:
    // 0.00 -> 0.20: Hero base scale (calm, elegant, comfortably clear of navbar)
    // 0.20 -> 0.45: Zoom in (heroBaseScale -> heroBaseScale * 1.15)
    // 0.45 -> 0.75: Scale down to deck size (-> targetDeckScale)
    // 0.75 -> 1.00: Held at targetDeckScale
    const heroBaseScale = isMobile ? 0.72 : 0.85
    let targetScale = heroBaseScale

    if (p <= 0.20) {
      targetScale = heroBaseScale
    } else if (p <= 0.45) {
      const t = (p - 0.20) / 0.25
      targetScale = THREE.MathUtils.lerp(heroBaseScale, heroBaseScale * 1.15, t)
    } else if (p <= 0.75) {
      const t = (p - 0.45) / 0.30
      targetScale = THREE.MathUtils.lerp(heroBaseScale * 1.15, targetDeckScale.current, t)
    } else {
      targetScale = targetDeckScale.current
    }

    const currentScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 10, delta)
    groupRef.current.scale.setScalar(currentScale)

    // 3. PHYSICAL TRAVEL (Hero Position -> Deck Slot Position):
    // Hero position: slightly offset on desktop to complement left hero headline, or center on mobile
    // heroPosY is placed at -0.08 so the top of the pouch has generous breathing room below the navbar
    const heroPosX = isMobile ? 0 : 0.78
    const heroPosY = isMobile ? -0.08 : -0.08

    let targetX = heroPosX
    let targetY = heroPosY

    if (p <= 0.25) {
      targetX = heroPosX
      targetY = heroPosY
    } else if (p <= 0.75) {
      const t = (p - 0.25) / 0.50
      // Smooth cubic bezier easing for organic physical travel
      const easeT = t * t * (3 - 2 * t)
      targetX = THREE.MathUtils.lerp(heroPosX, targetDeckPos.current.x, easeT)
      targetY = THREE.MathUtils.lerp(heroPosY, targetDeckPos.current.y, easeT)
    } else {
      targetX = targetDeckPos.current.x
      targetY = targetDeckPos.current.y
    }

    // Add optional horizontal carousel slide offset when in deck mode
    if (carouselOffsetRef && p > 0.75) {
      targetX += carouselOffsetRef.current
    }

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 10, delta)
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 10, delta)

    // NO automatic vertical floating: product remains calm, premium, and stable like studio photography

    // Keep contact shadow locked directly beneath the 3D pack
    if (shadowMeshRef.current) {
      shadowMeshRef.current.position.x = groupRef.current.position.x
      shadowMeshRef.current.position.y = groupRef.current.position.y - (H / 2) * currentScale - 0.18
      shadowMeshRef.current.scale.setScalar(currentScale)
    }
  })

  return (
    <>
      {/* Dynamic Lighting System matching premium studio product photography */}
      <ambientLight color="#fff7ed" intensity={1.1} />

      {/* Main Key Light */}
      <directionalLight position={[3.5, 4.5, 4.0]} color="#ffffff" intensity={2.2} />

      {/* Dedicated Back Light so Nutrition Label is clearly readable when rotated */}
      <directionalLight position={[0, 1.5, -4.5]} color="#fff7ed" intensity={3.2} />

      {/* Dynamic Rim Light reflecting active product accent */}
      <directionalLight
        position={[-3.5, 2.5, -2.0]}
        color={product.accentColor}
        intensity={2.8}
      />

      {/* Gentle Fill Light */}
      <directionalLight position={[0, -3.0, 3.0]} color="#ffe9d1" intensity={0.9} />

      {/* Persistent 3D Object */}
      <group ref={groupRef}>
        {/* Front Mesh (Pouch geometry with front foil artwork) */}
        <mesh geometry={geometry} material={foilMaterial} />

        {/* Back Mesh (Pouch geometry flipped 180° with lab-verified nutrition label) */}
        <mesh
          geometry={geometry}
          material={backMaterial}
          rotation={[0, Math.PI, 0]}
        />
      </group>

      {/* Floor Contact Shadow */}
      <mesh
        ref={shadowMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -H / 2 - 0.18, 0]}
      >
        <planeGeometry args={[W * 1.45, W * 0.65]} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
