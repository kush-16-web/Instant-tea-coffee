import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { sound } from '../../utils/soundEngine'
import { type GomziProduct } from '../../data/gomziProducts'
import { RotateCcw, FlipHorizontal, ZoomIn } from 'lucide-react'

interface InteractivePack3DProps {
  product: GomziProduct
  className?: string
  priority?: boolean
  onQuickInspect?: () => void
  revealOnMount?: boolean
}

/**
 * Procedurally generates a crisp back-of-pack label texture
 * with nutrition facts, ingredients, barcode, and certification marks.
 */
function createBackLabelTexture(product: GomziProduct): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  // 2048 x 2560 Ultra-High Definition texture for crystal clear reading when rotated
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
  ctx.font = 'bold 72px "Fraunces", Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('GOMZI LIFE SCIENCE', 1024, 220)

  ctx.fillStyle = '#ffffff'
  ctx.font = '900 48px "Plus Jakarta Sans", sans-serif'
  ctx.fillText(product.name.toUpperCase(), 1024, 300)

  ctx.fillStyle = '#dcd0bf'
  ctx.font = '600 36px "Plus Jakarta Sans", monospace'
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
  ctx.font = 'bold 56px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('NUTRITIONAL VALUES (LAB VERIFIED)', 220, 560)

  ctx.fillStyle = '#e8d8c3'
  ctx.font = '36px "Plus Jakarta Sans", sans-serif'
  ctx.fillText(`Serving Size: ${product.size} | Standard Recommended Serving`, 220, 620)

  // Table header bar
  ctx.fillStyle = '#2c1e15'
  ctx.fillRect(200, 660, 1648, 72)
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('NUTRIENT COMPOSITION', 240, 710)
  ctx.textAlign = 'right'
  ctx.fillText('PER SERVING', 1480, 710)
  ctx.fillText('% RDA*', 1800, 710)

  // Table rows with alternating zebra strips for effortless reading
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
    ctx.font = idx === 1 ? 'bold 38px "Plus Jakarta Sans", sans-serif' : '500 36px "Plus Jakarta Sans", sans-serif'
    ctx.fillText(r.name, 240, y)

    ctx.textAlign = 'right'
    ctx.fillText(r.val, 1480, y)
    ctx.fillText(r.rda, 1800, y)
  })

  // Ingredients header
  ctx.textAlign = 'left'
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('AUTHENTIC INGREDIENTS LIST:', 160, 1340)

  ctx.fillStyle = '#f5efeb'
  ctx.font = '36px "Plus Jakarta Sans", sans-serif'
  const ingredientsText = product.ingredients.join(' • ') + '.'
  wrapText(ctx, ingredientsText, 160, 1410, 1728, 54)

  // Allergen statement
  ctx.fillStyle = '#cbb094'
  ctx.font = 'italic 30px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Allergens: Contains dairy (whey protein). Crafted in a facility handling tree nuts.', 160, 1560)

  // Certification Badges Row (100% Veg, FSSAI, GMP Tested)
  // Green Veg Mark Box
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
  ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('100% VEG', 340, 1740)
  ctx.font = '28px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#cbb094'
  ctx.fillText('Pure Natural Formula', 340, 1785)

  // FSSAI Badge
  ctx.fillStyle = '#1c130d'
  ctx.fillRect(720, 1640, 560, 220)
  ctx.strokeStyle = '#5a3d28'
  ctx.strokeRect(720, 1640, 560, 220)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px "Fraunces", serif'
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
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('GMP & ISO 22000', 1370, 1735)
  ctx.font = '28px "Plus Jakarta Sans", sans-serif'
  ctx.fillStyle = '#cbb094'
  ctx.fillText('Clinical NABL Lab Batch 2026', 1370, 1785)

  // High-contrast Barcode
  const barcodeY = 1940
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(240, barcodeY, 1568, 260)

  ctx.fillStyle = '#0a0604'
  for (let i = 300; i < 1740; i += 14) {
    const w = (i % 6 === 0 ? 8 : i % 10 === 0 ? 4 : 10)
    ctx.fillRect(i, barcodeY + 30, w, 150)
  }
  ctx.font = 'bold 42px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('8 908012 345678', 1024, barcodeY + 235)

  // Brand Footer & Storage Guidelines
  ctx.fillStyle = '#dcd0bf'
  ctx.font = '28px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Marketed & Distributed by Gomzi Life Science Pvt Ltd. Store in a cool, dry place away from sunlight.', 1024, 2300)
  ctx.fillStyle = product.accentColor
  ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('WWW.GOMZILIFESCIENCE.COM', 1024, 2360)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  texture.anisotropy = 16
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
 * Pillow geometry deformer that crimps edges and creates authentic gusset bulge
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
    // Pouches bulge more towards the bottom gusset
    const gusset = shape === 'pouch' ? 0.85 + 0.3 * (1 - (y + 1) / 2) : 1
    // Subtle realistic foil wrinkles
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
  g.addColorStop(0, 'rgba(0, 0, 0, 0.65)')
  g.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)')
  g.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  return t
}

export function InteractivePack3D({
  product,
  className = '',
  onQuickInspect,
  revealOnMount = false,
}: InteractivePack3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Internal rotation target state
  const targetRotY = useRef(0)
  const dragRef = useRef({
    active: false,
    lastX: 0,
    velX: 0,
    lastTime: 0,
  })

  // Pointer position for glint specular tracking
  const pointerPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, hover: 0 })

  const handleFlip = useCallback(() => {
    sound.playFoilCrinkle()
    setIsFlipped((prev) => {
      const next = !prev
      targetRotY.current = next ? Math.PI : 0
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    sound.playClick(440, 0.05)
    setIsFlipped(false)
    targetRotY.current = 0
  }, [])

  useEffect(() => {
    let animId: number
    let disposed = false
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Setup Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
    camera.position.set(0, 0, 4.85)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x1f140e, 1.2)
    scene.add(hemiLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    keyLight.position.set(3, 4, 4)
    scene.add(keyLight)

    // Dedicated Back light for crystal-clear back nutrition label reading when rotated
    const backLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
    backLight.position.set(0, 1.5, -4.5)
    scene.add(backLight)

    const rimColor = new THREE.Color(product.accentColor)
    const rimLight = new THREE.DirectionalLight(rimColor, 3.2)
    rimLight.position.set(-3.5, 2.5, -2.5)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0xffecd2, 1.0)
    fillLight.position.set(0, -3, 3)
    scene.add(fillLight)

    // Dynamic glint light that glides across foil highlights
    const glintLight = new THREE.PointLight(0xffffff, 5, 6, 1.8)
    glintLight.position.set(0.5, 0.5, 2.2)
    scene.add(glintLight)

    const packGroup = new THREE.Group()
    scene.add(packGroup)

    let shadowMesh: THREE.Mesh | null = null

    // Load textures
    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')

    textureLoader.load(
      product.image,
      (frontTexture) => {
        if (disposed) return
        frontTexture.colorSpace = THREE.SRGBColorSpace
        frontTexture.anisotropy = 8

        const imgAspect = frontTexture.image.width / frontTexture.image.height
        const H = 2.0
        const W = H * imgAspect

        const geo = createPillowGeometry(W, H, product.bulge, product.shape)

        // Ultra-realistic Foil Packaging Material
        const foilMaterial = new THREE.MeshPhysicalMaterial({
          map: frontTexture,
          roughness: 0.32,
          metalness: 0.12,
          clearcoat: 0.92,
          clearcoatRoughness: 0.18,
          reflectivity: 0.7,
        })

        const frontMesh = new THREE.Mesh(geo, foilMaterial)
        frontMesh.castShadow = true
        packGroup.add(frontMesh)

        // Back Face with realistic, high-contrast Nutrition Label
        const backTexture = createBackLabelTexture(product)
        const backMaterial = new THREE.MeshPhysicalMaterial({
          map: backTexture,
          roughness: 0.44,
          metalness: 0.04,
          clearcoat: 0.15,
          clearcoatRoughness: 0.25,
        })
        const backMesh = new THREE.Mesh(geo.clone(), backMaterial)
        backMesh.rotation.y = Math.PI
        packGroup.add(backMesh)

        // Contact Shadow
        const shadowGeo = new THREE.PlaneGeometry(W * 1.35, W * 0.55)
        const shadowMat = new THREE.MeshBasicMaterial({
          map: createShadowTexture(),
          transparent: true,
          opacity: 0.45,
          depthWrite: false,
        })
        shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
        shadowMesh.rotation.x = -Math.PI / 2
        shadowMesh.position.y = -H / 2 - 0.22
        scene.add(shadowMesh)

        setIsLoaded(true)
      },
      undefined,
      (err) => {
        console.error('Texture load failed:', err)
      }
    )

    // Resize handler
    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, rect.width)
      const h = Math.max(1, rect.height)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // Keep pack prominently sized and readable on all screens
      const baseDistance = 3.80
      camera.position.z = camera.aspect < 1 ? baseDistance / camera.aspect : baseDistance
      camera.updateProjectionMatrix()
    }
    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)

    // Animation loop variables
    let currentRotY = revealOnMount ? Math.PI : 0
    let currentRotX = 0
    let smoothPointerX = 0
    let smoothPointerY = 0
    let time = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      time += 0.016

      // Smooth dampening towards target rotation
      if (!dragRef.current.active) {
        dragRef.current.velX *= 0.92
        targetRotY.current += dragRef.current.velX * 0.015
      }

      // Smooth gradual pointer dampening to eliminate the first mouse enter "zap"
      smoothPointerX += (pointerPos.current.targetX - smoothPointerX) * 0.07
      smoothPointerY += (pointerPos.current.targetY - smoothPointerY) * 0.07

      currentRotY += (targetRotY.current - currentRotY) * 0.08
      currentRotX += (smoothPointerY * 0.15 - currentRotX) * 0.08

      // Idle subtle breathing float
      const idleFloat = Math.sin(time * 1.5) * 0.03
      const idleTilt = Math.sin(time * 0.8) * 0.015

      packGroup.position.y = idleFloat
      packGroup.rotation.y = currentRotY + smoothPointerX * 0.22
      packGroup.rotation.x = currentRotX + idleTilt
      packGroup.rotation.z = Math.sin(time * 1.2) * 0.01

      // Dynamic glint tracking
      pointerPos.current.x += (pointerPos.current.targetX - pointerPos.current.x) * 0.08
      pointerPos.current.y += (pointerPos.current.targetY - pointerPos.current.y) * 0.08
      glintLight.position.set(pointerPos.current.x * 2.5, pointerPos.current.y * 2.0 + 0.3, 2.5)

      if (shadowMesh) {
        shadowMesh.position.y = -1.22 + idleFloat * 0.3
        shadowMesh.scale.setScalar(1 - idleFloat * 0.5)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      renderer.dispose()
    }
  }, [product])

  // Mouse & Pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current.active = true
    dragRef.current.lastX = e.clientX
    dragRef.current.velX = 0
    dragRef.current.lastTime = performance.now()
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    sound.playFoilCrinkle()
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      pointerPos.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerPos.current.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    if (dragRef.current.active) {
      const now = performance.now()
      const dt = Math.max(1, now - dragRef.current.lastTime)
      const dx = e.clientX - dragRef.current.lastX
      dragRef.current.lastX = e.clientX
      dragRef.current.lastTime = now

      targetRotY.current += dx * 0.014
      dragRef.current.velX = (dx / dt) * 16
    }
  }

  const handlePointerUp = () => {
    dragRef.current.active = false
    setIsDragging(false)
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[460px] md:h-[580px] lg:h-[640px] flex items-center justify-center select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerPos.current.targetX = 0
        pointerPos.current.targetY = 0
        dragRef.current.active = false
        setIsDragging(false)
      }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${product.accentColor} transparent transparent transparent` }}
            />
            <span className="text-xs uppercase tracking-widest text-[#a89b8d]">
              Forming {product.nav} Foil...
            </span>
          </div>
        </div>
      )}

      {/* Floating 3D Control Pill - Dynamically follows product color (Image 5 fix) */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-between gap-4 px-6 py-2.5 rounded-full backdrop-blur-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-w-[320px] sm:min-w-[400px] transition-all duration-700 hover:scale-[1.02]"
        style={{
          backgroundColor: `${product.themeColor}dd`,
          borderColor: `${product.accentColor}44`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 25px ${product.accentColor}20`,
        }}
      >
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
          style={{
            backgroundColor: isFlipped ? product.accentColor : 'rgba(255,255,255,0.08)',
            color: isFlipped ? '#0c0806' : '#f4ece1',
          }}
          title="Flip pack to inspect nutrition facts and barcode"
        >
          <FlipHorizontal className="w-4 h-4" />
          <span>{isFlipped ? 'Front Packaging' : 'Back Nutrition'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-2 rounded-full text-[#a89b8d] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Reset rotation to center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {onQuickInspect && (
          <button
            onClick={() => {
              sound.playClick(600, 0.05)
              onQuickInspect()
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#f4ece1] bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer"
            title="Inspect 360 Fullscreen"
          >
            <ZoomIn className="w-4 h-4" style={{ color: product.accentColor }} />
            <span>360° Zoom</span>
          </button>
        )}
      </div>
    </div>
  )
}
