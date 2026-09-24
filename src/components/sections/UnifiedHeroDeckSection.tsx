import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GOMZI_PRODUCTS, type GomziProduct } from '../../data/gomziProducts'
import { PersistentProduct3D } from '../3d/PersistentProduct3D'
import { InstancedWorldParticles } from '../3d/InstancedWorldParticles'
import { sound } from '../../utils/soundEngine'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react'

interface UnifiedHeroDeckSectionProps {
  initialProductId?: 'atta' | 'tea' | 'mocha'
  onProductChange: (product: GomziProduct) => void
  onAddToCart: (product: GomziProduct) => void
  onQuickInspect: (product: GomziProduct) => void
  readyToReveal?: boolean
}

// Per-product dynamic atmospheric color palette
const PRODUCT_THEMES = {
  atta: {
    heroAccent: '#E9B964',
    deckBg: '#7D490C',
    gradient: 'radial-gradient(ellipse at 50% 40%, #7d490c 0%, #2b1803 70%, #0d0803 100%)',
  },
  tea: {
    heroAccent: '#7DBB6A',
    deckBg: '#153818',
    gradient: 'radial-gradient(ellipse at 50% 40%, #153818 0%, #0a1c0d 70%, #040d05 100%)',
  },
  mocha: {
    heroAccent: '#D49B6A',
    deckBg: '#3A1C10',
    gradient: 'radial-gradient(ellipse at 50% 40%, #3a1c10 0%, #170b06 70%, #080302 100%)',
  },
}

// Editorial giant background typography split for calm luxury layout
const PRODUCT_HERO_TYPO = {
  atta: { line1: 'MULTI GRAIN', line2: 'PROTEIN ATTA' },
  tea: { line1: 'AYURVEDIC', line2: 'SPICED CHAI' },
  mocha: { line1: 'COLD BREW', line2: 'DARK MOCHA' },
}

/**
 * Computes canonical circular signed offset in {-1, 0, 1}
 * Active product is ALWAYS 0.
 * Immediate next product is ALWAYS +1.
 * Immediate previous product is ALWAYS -1.
 */
function getRelativeSlot(itemIndex: number, activeIndex: number): number {
  let diff = (itemIndex - activeIndex) % 3
  if (diff > 1) diff -= 3
  if (diff < -1) diff += 3
  return diff
}

/**
 * Returns canonical CSS visual slot transform and styles
 * Uses generous horizontal spacing on desktop (+/- 430px) so side cards never crowd the center
 */
function getSlotStyle(slot: number) {
  const isMobile = window.innerWidth < 768
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
  const sideX = isMobile ? 170 : isTablet ? 290 : 430
  const farX = isMobile ? 320 : isTablet ? 520 : 750

  if (slot === 0) {
    return {
      x: 0,
      scale: 1.0,
      opacity: 1.0,
      rotateY: 0,
      zIndex: 30,
      pointerEvents: 'none' as const,
    }
  }
  if (slot === -1) {
    return {
      x: -sideX,
      scale: isMobile ? 0.58 : 0.72,
      opacity: 0.85,
      rotateY: 10,
      zIndex: 15,
      pointerEvents: 'auto' as const,
    }
  }
  if (slot === 1) {
    return {
      x: sideX,
      scale: isMobile ? 0.58 : 0.72,
      opacity: 0.85,
      rotateY: -10,
      zIndex: 15,
      pointerEvents: 'auto' as const,
    }
  }
  if (slot <= -2) {
    return {
      x: -farX,
      scale: 0.45,
      opacity: 0,
      rotateY: 18,
      zIndex: 5,
      pointerEvents: 'none' as const,
    }
  }
  return {
    x: farX,
    scale: 0.45,
    opacity: 0,
    rotateY: -18,
    zIndex: 5,
    pointerEvents: 'none' as const,
  }
}

export function UnifiedHeroDeckSection({
  initialProductId = 'atta',
  onProductChange,
  onAddToCart,
  onQuickInspect,
  readyToReveal = true,
}: UnifiedHeroDeckSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = GOMZI_PRODUCTS.findIndex((p) => p.id === initialProductId)
    return idx !== -1 ? idx : 0
  })

  const [hasRevealed, setHasRevealed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const activeProduct = GOMZI_PRODUCTS[currentIndex]

  // Shared scroll progress ref for R3F (0 to 1, no React re-renders on scroll)
  const scrollProgressRef = useRef(0)

  // Carousel physical slide offset ref for the 3D model
  const carouselOffsetRef = useRef(0)

  // Manual interactive rotation ref for Hero direct drag interaction
  const interactionRotationRef = useRef(0)
  const isDraggingHero = useRef(false)
  const heroDragStartX = useRef(0)

  // Refs for pinned scroll stage & layers
  const stageRef = useRef<HTMLElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const heroTypoRef = useRef<HTMLDivElement>(null)
  const heroDragZoneRef = useRef<HTMLDivElement>(null)
  const particlesContainerRef = useRef<HTMLDivElement>(null)
  const deckLayerRef = useRef<HTMLDivElement>(null)
  const deckInfoRef = useRef<HTMLDivElement>(null)
  const deckSlotRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Preload and decode images
  useEffect(() => {
    GOMZI_PRODUCTS.forEach((p) => {
      const img = new Image()
      img.src = p.image
      img.decode().catch(() => {})
    })
  }, [])

  // Initial load entrance
  useEffect(() => {
    if (!readyToReveal) return
    const timer = setTimeout(() => {
      setHasRevealed(true)
      sound.playFoilCrinkle()
      ScrollTrigger.refresh()
    }, 150)
    return () => clearTimeout(timer)
  }, [readyToReveal])

  // Synchronize all card positions to canonical slots
  const syncAllCardSlots = useCallback((targetIdx: number, animate = false) => {
    GOMZI_PRODUCTS.forEach((_, idx) => {
      const el = cardRefs.current[idx]
      if (!el) return
      const slot = getRelativeSlot(idx, targetIdx)
      const style = getSlotStyle(slot)
      if (animate) {
        gsap.to(el, { ...style, duration: 0.85, ease: 'power3.inOut' })
      } else {
        gsap.set(el, style)
      }
    })
  }, [])

  // Initial card positioning & resize synchronization
  useEffect(() => {
    syncAllCardSlots(currentIndex, false)
    const handleResize = () => syncAllCardSlots(currentIndex, false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, syncAllCardSlots])

  // Canonical single GSAP timeline carousel transition
  const isTransitioning = useRef(false)
  const goTo = useCallback(
    (targetIndex: number) => {
      const normalized = (targetIndex + GOMZI_PRODUCTS.length) % GOMZI_PRODUCTS.length
      if (normalized === currentIndex) return

      // Determine shortest circular direction in {-1, 1}
      let diff = (normalized - currentIndex) % 3
      if (diff > 1) diff -= 3
      if (diff < -1) diff += 3
      const dir = diff >= 0 ? 1 : -1

      sound.playFoilCrinkle()
      isTransitioning.current = true

      // Cleanly interrupt previous tweens if rapid clicking
      cardRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el)
      })
      if (deckInfoRef.current) gsap.killTweensOf(deckInfoRef.current)
      gsap.killTweensOf(carouselOffsetRef)

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioning.current = false
          syncAllCardSlots(normalized, false)
        },
      })

      // 1. Move all product cards simultaneously with relative slot math
      GOMZI_PRODUCTS.forEach((_, idx) => {
        const el = cardRefs.current[idx]
        if (!el) return

        const oldSlot = getRelativeSlot(idx, currentIndex)
        const newSlot = getRelativeSlot(idx, normalized)

        // Wraparound case (e.g. slot -1 to +1 or +1 to -1)
        if ((oldSlot === -1 && newSlot === 1 && dir === 1) || (oldSlot === 1 && newSlot === -1 && dir === -1)) {
          const exitSlot = -2 * dir
          const enterSlot = 2 * dir
          tl.to(el, { ...getSlotStyle(exitSlot), duration: 0.38, ease: 'power2.in' }, 0)
            .set(el, { ...getSlotStyle(enterSlot) }, 0.38)
            .to(el, { ...getSlotStyle(newSlot), duration: 0.47, ease: 'power2.out' }, 0.38)
        } else {
          tl.to(el, { ...getSlotStyle(newSlot), duration: 0.85, ease: 'power3.inOut' }, 0)
        }
      })

      // 2. Physical 3D model slide in R3F via carouselOffsetRef
      tl.to(
        carouselOffsetRef,
        {
          current: -dir * 1.35,
          duration: 0.42,
          ease: 'power2.in',
          onComplete: () => {
            setCurrentIndex(normalized)
            onProductChange(GOMZI_PRODUCTS[normalized])
            carouselOffsetRef.current = dir * 1.35
          },
        },
        0
      )

      tl.to(
        carouselOffsetRef,
        {
          current: 0,
          duration: 0.43,
          ease: 'power2.out',
        },
        0.42
      )

      // 3. Smooth fade/slide for text details
      if (deckInfoRef.current) {
        tl.to(
          deckInfoRef.current,
          {
            opacity: 0,
            y: -dir * 12,
            duration: 0.32,
            ease: 'power2.in',
          },
          0
        )

        tl.fromTo(
          deckInfoRef.current,
          { opacity: 0, y: dir * 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.40
        )
      }
    },
    [currentIndex, onProductChange, syncAllCardSlots]
  )

  const nextProduct = () => goTo(currentIndex + 1)
  const prevProduct = () => goTo(currentIndex - 1)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextProduct()
      else if (e.key === 'ArrowLeft') prevProduct()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextProduct, prevProduct])

  // Direct manual pointer drag rotation for Hero 3D product
  const handleHeroPointerDown = (e: React.PointerEvent) => {
    isDraggingHero.current = true
    heroDragStartX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleHeroPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingHero.current) return
    const dx = e.clientX - heroDragStartX.current
    heroDragStartX.current = e.clientX
    // Direct horizontal sensitivity
    interactionRotationRef.current += dx * 0.008
  }

  const handleHeroPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingHero.current) return
    isDraggingHero.current = false
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  // Smooth scroll down to deck state via Explore Collection button
  const handleScrollToDeck = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const st = ScrollTrigger.getById('hero-deck-trigger')
    if (st) {
      const targetScroll = st.start + (st.end - st.start) * 0.95
      const lenis = (window as any).lenis
      if (lenis) {
        lenis.scrollTo(targetScroll, { duration: 1.2 })
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    }
  }

  // Master Pinned ScrollTrigger Timeline
  useGSAP(
    () => {
      if (prefersReducedMotion || !hasRevealed) return

      const mm = gsap.matchMedia()

      // Desktop & Tablet (>= 768px)
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          id: 'hero-deck-trigger',
          scrollTrigger: {
            id: 'hero-deck-trigger',
            trigger: stageRef.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress

              // Cleanly transition pointer-events hierarchy
              if (heroCopyRef.current) {
                heroCopyRef.current.style.pointerEvents = self.progress < 0.25 ? 'auto' : 'none'
              }
              if (heroDragZoneRef.current) {
                heroDragZoneRef.current.style.pointerEvents = self.progress < 0.20 ? 'auto' : 'none'
              }
              if (deckLayerRef.current) {
                deckLayerRef.current.style.pointerEvents = self.progress > 0.70 ? 'auto' : 'none'
              }
            },
          },
        })

        // 0.00–0.35: Hero copy and giant typography fade out and drift up
        tl.to(
          heroCopyRef.current,
          {
            opacity: 0,
            y: -50,
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        )

        tl.to(
          heroTypoRef.current,
          {
            opacity: 0,
            y: -40,
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        )

        // 0.48–0.85: Atmospheric particles fade in for the Product Deck
        tl.fromTo(
          particlesContainerRef.current,
          { opacity: 0 },
          { opacity: 0.80, duration: 0.35, ease: 'power2.out' },
          0.48
        )

        // 0.55–0.90: Deck layer fades in
        tl.fromTo(
          deckLayerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'power2.out' },
          0.55
        )

        tl.fromTo(
          deckInfoRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          0.58
        )

        // 0.90–1.00: Pinned hold state
        tl.to({}, { duration: 0.1 }, 0.9)
      })

      // Mobile (< 768px)
      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          id: 'hero-deck-trigger',
          scrollTrigger: {
            id: 'hero-deck-trigger',
            trigger: stageRef.current,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress
              if (heroCopyRef.current) {
                heroCopyRef.current.style.pointerEvents = self.progress < 0.25 ? 'auto' : 'none'
              }
              if (heroDragZoneRef.current) {
                heroDragZoneRef.current.style.pointerEvents = self.progress < 0.20 ? 'auto' : 'none'
              }
              if (deckLayerRef.current) {
                deckLayerRef.current.style.pointerEvents = self.progress > 0.70 ? 'auto' : 'none'
              }
            },
          },
        })

        tl.to(heroCopyRef.current, { opacity: 0, y: -35, duration: 0.35, ease: 'power2.out' }, 0)
        tl.to(heroTypoRef.current, { opacity: 0, y: -30, duration: 0.35, ease: 'power2.out' }, 0)
        tl.fromTo(particlesContainerRef.current, { opacity: 0 }, { opacity: 0.75, duration: 0.35 }, 0.48)
        tl.fromTo(deckLayerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.55)
        tl.fromTo(deckInfoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, 0.55)
        tl.to({}, { duration: 0.1 }, 0.9)
      })

      return () => mm.revert()
    },
    { dependencies: [prefersReducedMotion, hasRevealed], scope: stageRef }
  )

  return (
    <section
      ref={stageRef}
      id="hero-deck-stage"
      className="stage relative h-[100dvh] w-full overflow-hidden select-none border-none"
    >
      {/* Anchor targets for navbar links */}
      <div id="hero" className="absolute top-0 pointer-events-none" />
      <div id="products-deck" className="absolute top-[40%] pointer-events-none" />

      {/* 1. Background Layers (One per product, crossfaded by opacity only) */}
      <div className="absolute inset-0 pointer-events-none -z-20">
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: activeProduct.id === 'atta' ? 1 : 0,
            background: PRODUCT_THEMES.atta.gradient,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: activeProduct.id === 'tea' ? 1 : 0,
            background: PRODUCT_THEMES.tea.gradient,
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: activeProduct.id === 'mocha' ? 1 : 0,
            background: PRODUCT_THEMES.mocha.gradient,
          }}
        />
      </div>

      {/* Giant Active Product Name Typography & Thin Curved Line Graphics (Behind Hero Product) */}
      <div
        ref={heroTypoRef}
        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center overflow-hidden z-0 select-none will-change-transform"
      >
        {/* Subtle technical editorial packaging lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M 120,460 C 350,160 1090,160 1320,460"
            stroke={activeProduct.accentColor}
            strokeWidth="0.75"
            strokeDasharray="4 8"
            className="transition-colors duration-1000"
          />
          <path
            d="M 220,530 C 450,230 990,230 1220,530"
            stroke="#f4ece1"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <ellipse
            cx="720"
            cy="480"
            rx="560"
            ry="280"
            stroke={activeProduct.accentColor}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            className="transition-colors duration-1000"
          />
          <line x1="720" y1="200" x2="720" y2="240" stroke="#f4ece1" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="720" y1="720" x2="720" y2="760" stroke="#f4ece1" strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>

        {/* Giant editorial product typography */}
        {GOMZI_PRODUCTS.map((prod) => {
          const typo = PRODUCT_HERO_TYPO[prod.id]
          const isActive = prod.id === activeProduct.id
          return (
            <div
              key={`typo-${prod.id}`}
              className="absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-1000 ease-out"
              style={{
                opacity: isActive ? 0.08 : 0,
              }}
            >
              <span
                className="font-serif uppercase tracking-tight text-[#f4ece1] leading-[0.8] whitespace-nowrap"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 15rem)' }}
              >
                {typo.line1}
              </span>
              <span
                className="font-serif uppercase tracking-tight text-[#f4ece1] leading-[0.8] whitespace-nowrap mt-2"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 15rem)' }}
              >
                {typo.line2}
              </span>
            </div>
          )
        })}
      </div>

      {/* Atmospheric Particles (ONLY appears when transitioning into Deck, invisible during Hero) */}
      <div
        ref={particlesContainerRef}
        className="absolute inset-0 pointer-events-none -z-10 opacity-0"
      >
        <InstancedWorldParticles
          key={`particles-${activeProduct.id}`}
          type={activeProduct.particleType}
          accentColor={activeProduct.accentColor}
          fullScreen={true}
          className="opacity-75"
        />
      </div>

      {/* 2. Hero Copy Layer (Calm, editorial typography, no clutter, no particles, z-30 pointer-events-auto) */}
      <div
        ref={heroCopyRef}
        className="absolute inset-y-0 left-0 w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 pointer-events-auto z-30 will-change-transform"
      >
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-[#f4ece1] leading-[1.06] tracking-tight">
            Protein, <br />
            <span className="italic text-[#dcd0bf]">stirred into</span> <br />
            <span
              className="font-medium transition-colors duration-500"
              style={{ color: activeProduct.accentColor }}
            >
              roti & chai.
            </span>
          </h1>

          <p className="font-sans text-xs sm:text-sm lg:text-base text-[#b8a99a] leading-relaxed mt-4 sm:mt-6 max-w-md font-light">
            Three everyday staples infused with clean bioavailable whey & plant protein. Soft rotis, royal kadak chai, silky cold-brew mocha.
          </p>

          <div className="mt-6 sm:mt-8">
            <button
              onClick={handleScrollToDeck}
              className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#0c0806] shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative z-40"
              style={{ backgroundColor: activeProduct.accentColor }}
            >
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* Hero Manual 3D Product Drag Interaction Area (Right side / over pouch, z-20) */}
      <div
        ref={heroDragZoneRef}
        onPointerDown={handleHeroPointerDown}
        onPointerMove={handleHeroPointerMove}
        onPointerUp={handleHeroPointerUp}
        onPointerCancel={handleHeroPointerUp}
        className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-20 cursor-grab active:cursor-grabbing pointer-events-auto touch-none"
        title="Drag horizontally to rotate 3D pack"
      />

      {/* 3. Product Layer: ONE persistent R3F 3D Canvas throughout the entire pinned stage */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 28 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full pointer-events-none"
        >
          <Suspense fallback={null}>
            <PersistentProduct3D
              product={activeProduct}
              scrollProgressRef={scrollProgressRef}
              deckSlotRef={deckSlotRef}
              carouselOffsetRef={carouselOffsetRef}
              interactionRotationRef={interactionRotationRef}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 4. Deck Layer (Physical Carousel Slot System: -1, 0, +1, smoothly animated with GSAP) */}
      <div
        ref={deckLayerRef}
        className="absolute inset-0 flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 pointer-events-none opacity-0 z-30"
      >
        {/* Top breathing gap below navbar */}
        <div className="w-full h-2 shrink-0" />

        {/* Carousel Slot Arena (Spacious width, slots -1, 0, +1) */}
        <div className="relative w-full max-w-7xl mx-auto h-[260px] sm:h-[300px] flex items-center justify-center my-auto overflow-visible pointer-events-none">
          {/* Permanent central reference anchor for 3D unprojection */}
          <div
            ref={deckSlotRef}
            className="absolute w-[220px] h-[260px] pointer-events-none invisible"
          />

          {/* Canonical 3 Product Cards */}
          {GOMZI_PRODUCTS.map((prod, idx) => {
            const isCenter = idx === currentIndex
            return (
              <div
                key={prod.id}
                ref={(el) => {
                  cardRefs.current[idx] = el
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (idx !== currentIndex) goTo(idx)
                }}
                className={`absolute flex flex-col items-center justify-center p-3 rounded-3xl transition-shadow ${
                  isCenter ? 'pointer-events-none' : 'cursor-pointer hover:scale-105 pointer-events-auto'
                }`}
                style={{
                  width: '240px',
                  height: '280px',
                }}
              >
                {/* Side product card: Luxury illuminated glass panel */}
                <div
                  className={`flex flex-col items-center text-center p-4 rounded-3xl transition-opacity duration-300 ${
                    isCenter ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, ${prod.themeColor}95 100%)`,
                    border: `1px solid ${prod.accentColor}40`,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div className="relative w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-serif text-xs sm:text-sm text-[#f4ece1] mt-2 font-normal line-clamp-1">
                    {prod.name}
                  </span>
                  <span className="font-sans text-[11px] text-[#b8a99a] mt-0.5">
                    ₹{prod.price}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Under the active product: Name, short line, price, "360° View" and "Add to Bag" */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center shrink-0">
          <div ref={deckInfoRef} className="flex flex-col items-center">
            {/* Product Name (Instrument Serif) */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#f4ece1] font-normal tracking-tight leading-tight">
              {activeProduct.name}
            </h2>

            {/* One short line (Manrope) */}
            <p className="font-sans text-xs sm:text-sm text-[#b8a99a] font-normal line-clamp-1 mt-1 max-w-md">
              {activeProduct.subtitle}
            </p>

            {/* Price with strikethrough */}
            <div className="flex items-center gap-3 mt-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                ₹{activeProduct.price}
              </span>
              <span className="font-sans text-xs sm:text-sm text-[#8c786a] line-through">
                ₹{activeProduct.originalPrice}
              </span>
            </div>

            {/* Action Buttons: 360° View and Add to Bag */}
            <div className="flex items-center gap-3 mt-3.5 pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sound.playClick(600, 0.04)
                  onQuickInspect(activeProduct)
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#f4ece1] bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-md min-h-[44px]"
              >
                <Eye className="w-3.5 h-3.5" style={{ color: activeProduct.accentColor }} />
                <span>360° View</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  sound.playChime(700, 0.3)
                  onAddToCart(activeProduct)
                }}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0c0806] shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer min-h-[44px]"
                style={{ backgroundColor: activeProduct.accentColor }}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#0c0806]" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>

          {/* Deck Controls: Arrows & Dots beneath info */}
          <div className="flex items-center gap-4 mt-4 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevProduct()
              }}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-[#dcd0bf] hover:text-white transition-all cursor-pointer"
              aria-label="Previous product"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {GOMZI_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(idx)
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer min-w-[20px] ${
                    idx === currentIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Select ${prod.name}`}
                />
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextProduct()
              }}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-[#dcd0bf] hover:text-white transition-all cursor-pointer"
              aria-label="Next product"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
