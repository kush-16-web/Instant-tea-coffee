import { useState, useEffect, useRef } from 'react'
import { GOMZI_PRODUCTS, type GomziProduct } from '../../data/gomziProducts'
import { InteractivePack3D } from '../3d/InteractivePack3D'
import { sound } from '../../utils/soundEngine'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { ArrowDown, Sparkles, Eye } from 'lucide-react'

interface GomziHeroProps {
  onQuickInspect: (p: GomziProduct) => void
  onExploreClick: () => void
  onProductSelect?: (p: GomziProduct) => void
  readyToReveal?: boolean
}

// Seamless palette connector to match ThrowableProductDeck
const DECK_BG_COLORS: Record<string, string> = {
  atta: '#C4841D', // Saturated warm golden amber
  tea: '#183B17',  // Rich herbal Ayurvedic green
  mocha: '#542E1B', // Rich velvety dark mocha cocoa
}

export function GomziHero({
  onQuickInspect,
  onExploreClick,
  onProductSelect,
  readyToReveal = true,
}: GomziHeroProps) {
  // Randomize initial product on every reload/refresh
  const [activeProduct] = useState<GomziProduct>(() => {
    const randomIndex = Math.floor(Math.random() * GOMZI_PRODUCTS.length)
    return GOMZI_PRODUCTS[randomIndex]
  })

  // State to coordinate the bottom-to-center reveal once loader finishes
  const [hasRevealed, setHasRevealed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const heroSectionRef = useRef<HTMLElement>(null)
  const productContainerRef = useRef<HTMLDivElement>(null)
  const leftFlankRef = useRef<HTMLDivElement>(null)
  const rightFlankRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const topBadgeRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  // Notify parent on mount/product set
  useEffect(() => {
    onProductSelect?.(activeProduct)
  }, [activeProduct, onProductSelect])

  // Bottom-to-center entrance on initial load
  useEffect(() => {
    if (!readyToReveal) return

    const timer = setTimeout(() => {
      setHasRevealed(true)
      sound.playFoilCrinkle()

      if (productContainerRef.current) {
        gsap.fromTo(
          productContainerRef.current,
          {
            y: prefersReducedMotion ? 0 : 160,
            scale: prefersReducedMotion ? 1 : 0.75,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.15,
            ease: 'power3.out',
            onComplete: () => {
              ScrollTrigger.refresh()
            },
          }
        )
      }
    }, 180)

    return () => clearTimeout(timer)
  }, [readyToReveal, prefersReducedMotion])

  // Pinned scroll-scrub timeline: hero pins, copy fades/parts away,
  // and the hero pack scrolls smoothly down to place directly into the product deck!
  useGSAP(
    () => {
      if (prefersReducedMotion || !hasRevealed) return

      const mm = gsap.matchMedia()

      // Desktop & Tablet (>= 861px)
      mm.add('(min-width: 861px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // 1. Left copy fades out and slides up/outward
        tl.to(
          leftFlankRef.current,
          {
            opacity: 0,
            y: -70,
            x: -40,
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        )

        // 2. Right metrics flank fades out and slides up/outward
        tl.to(
          rightFlankRef.current,
          {
            opacity: 0,
            y: -70,
            x: 40,
            duration: 0.35,
            ease: 'power2.out',
          },
          0
        )

        // 3. Top badge & bottom scroll cue fade out early
        tl.to(
          [topBadgeRef.current, scrollCueRef.current],
          {
            opacity: 0,
            y: -30,
            duration: 0.25,
            ease: 'power2.out',
          },
          0
        )

        // 4. Oversized background brand typography fades out and scales up
        tl.to(
          bgTextRef.current,
          {
            opacity: 0,
            scale: 1.18,
            duration: 0.45,
            ease: 'power2.out',
          },
          0
        )

        // 5. The Hero Product Pack continues scrolling down seamlessly into the product deck
        // First subtle heroic scale
        tl.to(
          productContainerRef.current,
          {
            scale: 1.12,
            duration: 0.35,
            ease: 'power1.out',
          },
          0
        )

        // Then descends smoothly towards the center card position of the deck
        tl.to(
          productContainerRef.current,
          {
            yPercent: 62,
            scale: 0.88,
            duration: 0.65,
            ease: 'power2.inOut',
          },
          0.35
        )
      })

      // Mobile (< 861px)
      mm.add('(max-width: 860px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: '+=60%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(
          [leftFlankRef.current, rightFlankRef.current, topBadgeRef.current, scrollCueRef.current],
          {
            opacity: 0,
            y: -35,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        )

        tl.to(
          bgTextRef.current,
          {
            opacity: 0,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out',
          },
          0
        )

        tl.to(
          productContainerRef.current,
          {
            yPercent: 45,
            scale: 0.9,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0.2
        )
      })

      return () => mm.revert()
    },
    { dependencies: [prefersReducedMotion, hasRevealed], scope: heroSectionRef }
  )

  const deckBg = DECK_BG_COLORS[activeProduct.id] || '#C4841D'

  return (
    <section
      ref={heroSectionRef}
      id="hero-section"
      className="relative min-h-[100dvh] flex flex-col justify-between pt-20 pb-10 overflow-x-clip overflow-y-visible text-[#f4ece1] select-none border-none"
      style={{
        // Seamless color gradient connecting directly into the Product Deck with no divider or border
        background: `linear-gradient(180deg, #0e0b08 0%, #15100c 55%, ${deckBg} 100%)`,
      }}
    >
      {/* 1. Oversized Editorial Brand Typography Layered BEHIND the Center 3D Pack */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      >
        <span
          className="text-[18vw] sm:text-[20vw] font-black tracking-tighter uppercase leading-none text-white/[0.04] whitespace-nowrap will-change-transform"
          style={{
            fontFamily: "var(--font, 'Archivo', system-ui, sans-serif)",
          }}
        >
          {activeProduct.id === 'atta' ? 'ATTAGOMZI' : activeProduct.id === 'tea' ? 'CHAIGOMZI' : 'MOCHAGOMZI'}
        </span>
      </div>

      {/* 2. Central Subtle Radial Warmth matching active product */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-25 -z-10"
        style={{ backgroundColor: activeProduct.accentColor }}
      />

      {/* 3. Top Header Tag */}
      <div ref={topBadgeRef} className="max-w-7xl mx-auto px-6 w-full text-center relative z-20 pt-2 will-change-transform">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#16110d]/90 border border-white/10 text-xs font-semibold text-[#f4ece1] shadow-sm">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: activeProduct.accentColor }}
          />
          <span className="tracking-widest uppercase font-mono text-[11px] text-[#E9B964]">
            GOMZI LIFE SCIENCE · EVERYDAY STAPLES RE-ENGINEERED
          </span>
        </div>
      </div>

      {/* 4. Main Arena: Centered 3D Product with Editorial Flanks */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto relative z-10">
        {/* Left Editorial Flank */}
        <div
          ref={leftFlankRef}
          className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1 will-change-transform"
        >
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-black tracking-tight text-[#f4ece1] leading-[1.08] mb-4">
            Protein, <br />
            <span className="italic font-normal text-[#dcd0bf]">stirred into</span> <br />
            <span
              className="transition-colors duration-700 underline decoration-wavy decoration-2 underline-offset-6"
              style={{ color: activeProduct.accentColor }}
            >
              roti & chai.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#a89b8d] leading-relaxed mb-6 max-w-xs">
            Three everyday staples infused with clean bioavailable whey & plant protein. Soft rotis, royal kadak chai, silky cold-brew mocha.
          </p>

          <a
            href="#products-deck"
            onClick={() => sound.playClick(600, 0.05)}
            className="px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase text-[#0c0806] shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: activeProduct.accentColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Deck</span>
          </a>
        </div>

        {/* Center Stage: Hero Product 3D Model with Bottom-to-Center Reveal & Deck Placement Scrub */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[520px] order-1 lg:order-2">
          {/* 3D Product Pack Container with Bottom-to-Center Reveal and Scroll Scrub */}
          <div
            ref={productContainerRef}
            className="w-full max-w-[420px] relative z-10 will-change-transform"
            style={{
              opacity: hasRevealed ? 1 : 0,
            }}
          >
            <InteractivePack3D
              key={activeProduct.id}
              product={activeProduct}
              priority
              revealOnMount={true}
              onQuickInspect={() => onQuickInspect(activeProduct)}
            />
          </div>
        </div>

        {/* Right Editorial Flank */}
        <div
          ref={rightFlankRef}
          className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right order-3 will-change-transform"
        >
          {/* Key Product Highlight Metrics */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#16110d]/90 border border-white/10 w-full max-w-xs mb-4 shadow-xl">
            <div className="flex items-center justify-between lg:justify-end gap-3 pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono text-[#a89b8d] uppercase tracking-wider">
                ACTIVE BIO-CORE
              </span>
              <span className="font-bold text-xs text-[#f4ece1]">{activeProduct.nav}</span>
            </div>

            <div className="space-y-2 text-left lg:text-right">
              <div>
                <div className="font-serif text-2xl font-black" style={{ color: activeProduct.accentColor }}>
                  {activeProduct.stats[0]?.value}{activeProduct.stats[0]?.unit}
                </div>
                <div className="text-[10px] font-mono text-[#a89b8d] uppercase">
                  {activeProduct.stats[0]?.label}
                </div>
              </div>

              <div>
                <div className="font-serif text-lg font-bold text-[#f4ece1]">
                  100% Clean
                </div>
                <div className="text-[10px] font-mono text-[#a89b8d] uppercase">
                  Zero Preservatives · FSSAI
                </div>
              </div>
            </div>
          </div>

          {/* Quick 360 Inspect Prompt */}
          <button
            onClick={() => onQuickInspect(activeProduct)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#16110d]/90 hover:bg-[#201813] border border-white/15 text-xs text-[#dcd0bf] hover:text-white transition-all cursor-pointer shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspect 3D Anatomical Anatomy</span>
          </button>
        </div>
      </div>

      {/* Downward Scroll Cue */}
      <div ref={scrollCueRef} className="flex justify-center mt-4 z-20 will-change-transform">
        <button
          onClick={onExploreClick}
          className="group flex flex-col items-center gap-1.5 text-xs tracking-widest uppercase text-[#8a7e73] hover:text-[#f4ece1] transition-colors cursor-pointer"
        >
          <span className="font-mono text-[10px]">SCROLL TO PRODUCT DECK</span>
          <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center group-hover:border-white/40 transition-colors animate-bounce">
            <ArrowDown className="w-3 h-3 text-[#E9B964]" />
          </div>
        </button>
      </div>
    </section>
  )
}
