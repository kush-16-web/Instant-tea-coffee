import React, { useState, useRef, useEffect, useCallback } from 'react'
import { GOMZI_PRODUCTS, type GomziProduct } from '../../data/gomziProducts'
import { InstancedWorldParticles } from '../3d/InstancedWorldParticles'
import { sound } from '../../utils/soundEngine'
import { ShoppingBag, ChevronLeft, ChevronRight, Sparkles, Check, Eye, ChevronRight as ArrowIcon } from 'lucide-react'

interface ThrowableProductDeckProps {
  onProductChange: (product: GomziProduct) => void
  onAddToCart: (product: GomziProduct) => void
  onQuickInspect: (product: GomziProduct) => void
  onJumpToRitual: (productId: string) => void
  activeProductId?: 'atta' | 'tea' | 'mocha'
}

// Dynamic palette & curved typography inspired by Oreo.com (Image 2)
const PRODUCT_THEMES = {
  atta: {
    bg: '#C4841D', // Saturated warm golden amber
    curve: '#663A04', // Deep roasted grain amber
    badge: '#E9B964',
    leftText: '7-GRAIN HIGH PROTEIN',
    leftSub: 'CHAKKI FRESH GROUND',
    rightText: '18.5G PROTEIN PER 100G!',
    rightSub: 'DELICIOUS PUFFED ROTIS',
  },
  tea: {
    bg: '#183B17', // Rich herbal Ayurvedic green matching tea pouch and green button
    curve: '#0B200A', // Deep botanical dark green
    badge: '#8DC63F',
    leftText: '5 RAW AYURVEDIC SPICES',
    leftSub: 'ROYAL KADAK CHAI',
    rightText: 'MICRO-WHEY INFUSED!',
    rightSub: 'HOT OR CHILLED SIP',
  },
  mocha: {
    bg: '#542E1B', // Rich velvety dark mocha cocoa
    curve: '#220F06', // Deep dark roast espresso
    badge: '#D4A373',
    leftText: 'ARABICA COLD EXTRACT',
    leftSub: 'SINGLE ESTATE BEANS',
    rightText: 'ZERO CHALK · ZERO CRASH!',
    rightSub: 'PURE VELVET CREMA',
  },
}

export function ThrowableProductDeck({
  onProductChange,
  onAddToCart,
  onQuickInspect,
  onJumpToRitual,
  activeProductId,
}: ThrowableProductDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (activeProductId) {
      const idx = GOMZI_PRODUCTS.findIndex((p) => p.id === activeProductId)
      if (idx !== -1) return idx
    }
    return 0
  })

  // Sync when activeProductId prop updates (e.g. from Hero reload/select)
  useEffect(() => {
    if (activeProductId) {
      const idx = GOMZI_PRODUCTS.findIndex((p) => p.id === activeProductId)
      if (idx !== -1 && idx !== currentIndex) {
        setCurrentIndex(idx)
      }
    }
  }, [activeProductId])

  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    lastTime: 0,
    lastClientX: 0,
  })
  const [thrownDirection, setThrownDirection] = useState<'left' | 'right' | null>(null)
  const [isEntering, setIsEntering] = useState(false)
  const [activeTab, setActiveTab] = useState<'features' | 'stats' | 'ingredients'>('features')

  const cardRef = useRef<HTMLDivElement>(null)
  const activeProduct = GOMZI_PRODUCTS[currentIndex]
  const currentTheme = PRODUCT_THEMES[activeProduct.id]

  // Inform parent when current product changes for fluid background/tone sync
  useEffect(() => {
    onProductChange(activeProduct)
  }, [currentIndex, activeProduct, onProductChange])

  // Navigate next / prev product with butter-smooth fluid transition
  const nextCard = useCallback((direction: 'left' | 'right' = 'right') => {
    sound.playFoilCrinkle()
    setThrownDirection(direction)

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % GOMZI_PRODUCTS.length)
      setThrownDirection(null)
      setIsEntering(true)
      setDragState((s) => ({ ...s, offsetX: 0, offsetY: 0, velocityX: 0, isDragging: false }))
      setTimeout(() => setIsEntering(false), 350)
    }, 240)
  }, [])

  const prevCard = useCallback(() => {
    sound.playFoilCrinkle()
    setThrownDirection('left')

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + GOMZI_PRODUCTS.length) % GOMZI_PRODUCTS.length)
      setThrownDirection(null)
      setIsEntering(true)
      setDragState((s) => ({ ...s, offsetX: 0, offsetY: 0, velocityX: 0, isDragging: false }))
      setTimeout(() => setIsEntering(false), 350)
    }, 240)
  }, [])

  // Unified smooth animated navigation for pagination dots and direct selection
  const goToIndex = useCallback((targetIdx: number) => {
    if (targetIdx === currentIndex) return
    const direction = targetIdx > currentIndex ? 'right' : 'left'
    sound.playFoilCrinkle()
    setThrownDirection(direction)

    setTimeout(() => {
      setCurrentIndex(targetIdx)
      setThrownDirection(null)
      setIsEntering(true)
      setDragState((s) => ({ ...s, offsetX: 0, offsetY: 0, velocityX: 0, isDragging: false }))
      setTimeout(() => setIsEntering(false), 350)
    }, 240)
  }, [currentIndex])

  // Drag physics handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, canvas, a, input, select')) return

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      lastTime: performance.now(),
      lastClientX: e.clientX,
    })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.isDragging) return
    const now = performance.now()
    const dt = Math.max(1, now - dragState.lastTime)
    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY
    const vx = ((e.clientX - dragState.lastClientX) / dt) * 16

    setDragState((prev) => ({
      ...prev,
      offsetX: dx,
      offsetY: dy * 0.35,
      velocityX: vx,
      lastTime: now,
      lastClientX: e.clientX,
    }))
  }

  const handlePointerUp = () => {
    if (!dragState.isDragging) return
    const threshold = 120
    const velocityThreshold = 1.1

    if (dragState.offsetX > threshold || dragState.velocityX > velocityThreshold) {
      nextCard('right')
    } else if (dragState.offsetX < -threshold || dragState.velocityX < -velocityThreshold) {
      nextCard('left')
    } else {
      // Elastic snap-back
      setDragState((prev) => ({
        ...prev,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        velocityX: 0,
      }))
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCard('right')
      else if (e.key === 'ArrowLeft') prevCard()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextCard, prevCard])

  const nextProduct = GOMZI_PRODUCTS[(currentIndex + 1) % GOMZI_PRODUCTS.length]
  const thirdProduct = GOMZI_PRODUCTS[(currentIndex + 2) % GOMZI_PRODUCTS.length]

  return (
    <section
      id="products-deck"
      className="relative min-h-[105vh] py-20 sm:py-28 flex flex-col justify-between overflow-hidden transition-colors duration-700 ease-out select-none scroll-mt-20"
      style={{ backgroundColor: currentTheme.bg }}
    >
      {/* 1. Full-Background 3D Instanced Particles */}
      <InstancedWorldParticles
        key={`${activeProduct.id}-full`}
        type={activeProduct.particleType}
        accentColor="#ffffff"
        fullScreen={true}
        className="opacity-75"
      />

      {/* 2. Left and Right Massive Curved Arcs with High-Contrast Readable Typography */}
      {/* Left Deep Curved Arc */}
      <div
        className="absolute top-0 bottom-0 left-0 w-[24vw] sm:w-[22vw] min-w-[200px] max-w-[340px] rounded-r-[120px] sm:rounded-r-[180px] pointer-events-none transition-colors duration-700 z-10 shadow-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: currentTheme.curve }}
      >
        <div className="transform -rotate-6 text-center max-w-[210px] px-4">
          <span className="font-serif text-xl sm:text-3xl xl:text-4xl font-black text-white uppercase tracking-tight leading-[0.95] block drop-shadow-md">
            {currentTheme.leftText}
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-white/80 uppercase tracking-widest mt-2 block font-bold">
            {currentTheme.leftSub}
          </span>
        </div>
      </div>

      {/* Right Deep Curved Arc */}
      <div
        className="absolute top-0 bottom-0 right-0 w-[24vw] sm:w-[22vw] min-w-[200px] max-w-[340px] rounded-l-[120px] sm:rounded-l-[180px] pointer-events-none transition-colors duration-700 z-10 shadow-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: currentTheme.curve }}
      >
        <div className="transform rotate-6 text-center max-w-[210px] px-4">
          <span className="font-serif text-xl sm:text-3xl xl:text-4xl font-black text-white uppercase tracking-tight leading-[0.95] block drop-shadow-md">
            {currentTheme.rightText}
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-white/80 uppercase tracking-widest mt-2 block font-bold">
            {currentTheme.rightSub}
          </span>
        </div>
      </div>

      {/* Top Header Tag */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/25 border border-white/20 backdrop-blur-md text-xs font-semibold text-white mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span className="tracking-widest uppercase font-mono text-[11px]">
            DRAG & SWIPE THE DECK · OREO-STYLE INTERACTION
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight drop-shadow-md">
          Everyday Staples, Powered by High Protein.
        </h2>
      </div>

      {/* 3. Center Interactive Card Arena with Real Stacked Cards */}
      <div className="relative flex items-center justify-center min-h-[560px] sm:min-h-[620px] my-auto px-4 z-20">
        {/* Subtle Central Radial Glow Behind Cards */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-white/20 blur-[100px] pointer-events-none -z-10" />

        {/* Stacked Backing Card 2 (Bottom layer - Real Third Product Card) */}
        <div
          className="absolute w-[310px] sm:w-[380px] min-h-[480px] sm:min-h-[550px] rounded-[38px] bg-[#FAF7F0] border border-white/60 p-5 shadow-2xl pointer-events-none transition-all duration-500 flex flex-col justify-between"
          style={{
            transform: 'scale(0.88) translateY(32px) rotate(6deg)',
            opacity: 0.6,
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <span className="font-mono text-xs font-bold uppercase text-[#5c4632]">
              {thirdProduct.nav}
            </span>
            <span className="font-mono text-[10px] text-[#7a6452]">{thirdProduct.size}</span>
          </div>
          <div className="relative my-2 flex items-center justify-center">
            <div
              className="w-[140px] h-[140px] rounded-full opacity-60"
              style={{ backgroundColor: thirdProduct.accentColor }}
            />
            <img
              src={thirdProduct.image}
              alt={thirdProduct.name}
              className="absolute w-[120px] h-[130px] object-contain drop-shadow-md"
            />
          </div>
          <div className="text-center pt-2 border-t border-black/5">
            <span className="font-serif text-sm font-bold text-[#1c120c] block truncate">
              {thirdProduct.name}
            </span>
          </div>
        </div>

        {/* Stacked Backing Card 1 (Middle layer - Real Next Product Card) */}
        <div
          className="absolute w-[315px] sm:w-[385px] min-h-[495px] sm:min-h-[565px] rounded-[38px] bg-[#FFFDF9] border border-white/80 p-5 shadow-2xl pointer-events-none transition-all duration-500 flex flex-col justify-between"
          style={{
            transform: 'scale(0.94) translateY(16px) rotate(-4deg)',
            opacity: 0.88,
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: nextProduct.accentColor }}
              />
              <span className="font-mono text-xs font-bold uppercase text-[#5c4632]">
                {nextProduct.nav}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#7a6452] font-semibold">
              Next Up: {nextProduct.size}
            </span>
          </div>

          <div className="relative my-3 flex items-center justify-center">
            <div
              className="w-[170px] h-[170px] rounded-full shadow-inner"
              style={{ backgroundColor: nextProduct.accentColor }}
            />
            <img
              src={nextProduct.image}
              alt={nextProduct.name}
              className="absolute w-[150px] h-[170px] object-contain drop-shadow-lg"
            />
          </div>

          <div className="text-center pt-2 border-t border-black/10">
            <span className="font-serif text-base font-bold text-[#1c120c] block">
              {nextProduct.name}
            </span>
            <span className="font-mono text-[11px] text-[#7a6452] mt-0.5 block">
              ₹{nextProduct.price} · Swipe to reveal details
            </span>
          </div>
        </div>

        {/* Front Active Swappable Card */}
        <div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-[320px] sm:w-[395px] min-h-[510px] sm:min-h-[580px] rounded-[38px] bg-[#FFFDF9] text-[#1c120c] border border-white/80 p-6 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.35)] z-20 cursor-grab active:cursor-grabbing select-none transition-transform duration-100 ${
            thrownDirection === 'right'
              ? 'translate-x-[900px] rotate-45 opacity-0 duration-300 pointer-events-none'
              : thrownDirection === 'left'
              ? '-translate-x-[900px] -rotate-45 opacity-0 duration-300 pointer-events-none'
              : ''
          }`}
          style={{
            transform: thrownDirection
              ? undefined
              : isEntering
              ? `scale(0.96) translateY(12px) translate3d(${dragState.offsetX}px, ${dragState.offsetY}px, 0px)`
              : `scale(1) translateY(0px) translate3d(${dragState.offsetX}px, ${dragState.offsetY}px, 0px) rotate(${
                  dragState.offsetX * 0.06
                }deg)`,
            transition: dragState.isDragging
              ? 'none'
              : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
          }}
        >
          {/* Card Top Pill: Category & Size */}
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeProduct.accentColor }}
              />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#5c4632]">
                {activeProduct.nav}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#7a6452] font-semibold">
              {activeProduct.size}
            </span>
          </div>

          {/* Card Visual Stage: Vibrant Product Circle Badge + Product Pack Image */}
          <div className="relative my-3 flex items-center justify-center py-2">
            {/* Saturated Circular Disc Background */}
            <div
              className="absolute w-[200px] sm:w-[230px] h-[200px] sm:h-[230px] rounded-full transition-transform duration-300 group-hover:scale-105 shadow-inner"
              style={{ backgroundColor: activeProduct.accentColor }}
            />

            {/* Pack Imagery */}
            <div className="relative z-10 w-[190px] sm:w-[220px] h-[210px] sm:h-[240px] flex items-center justify-center">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_25px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105"
                draggable={false}
              />
            </div>

            {/* Floating 360 Inspect Trigger Badge */}
            <button
              onClick={() => onQuickInspect(activeProduct)}
              className="absolute bottom-1 right-2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-black/10 shadow-md text-xs font-semibold text-[#1c120c] hover:bg-white hover:scale-105 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#C4841D]" />
              <span>360° View</span>
            </button>
          </div>

          {/* Card Product Title & Key Bio */}
          <div className="text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1c120c] leading-tight">
              {activeProduct.name}
            </h3>
            <p className="font-mono text-xs text-[#7a6452] mt-1 font-medium">
              {activeProduct.subtitle}
            </p>
          </div>

          {/* Tabbed Product Details Switcher (Features / Stats / Ingredients) */}
          <div className="mt-3">
            <div className="flex items-center justify-center gap-1 bg-black/5 p-1 rounded-xl mb-2.5">
              {(['features', 'stats', 'ingredients'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-all ${
                    activeTab === tab
                      ? 'bg-white text-[#1c120c] shadow-sm'
                      : 'text-[#7a6452] hover:text-[#1c120c]'
                  }`}
                >
                  {tab === 'features' ? 'Features' : tab === 'stats' ? 'Macros' : 'Ingredients'}
                </button>
              ))}
            </div>

            {/* Tab 1: Key Features */}
            {activeTab === 'features' && (
              <div className="space-y-1 text-xs text-[#423124] px-1">
                {activeProduct.keyFeatures.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5 leading-snug">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Nutritional Stats */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {activeProduct.stats.map((s, i) => (
                  <div key={i} className="bg-black/5 rounded-lg p-1.5">
                    <div className="font-serif text-sm font-bold text-[#1c120c]">
                      {s.value}
                      <span className="text-[10px] font-sans">{s.unit}</span>
                    </div>
                    <div className="text-[9px] font-mono text-[#7a6452] uppercase leading-tight mt-0.5">
                      {s.label.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Ingredients */}
            {activeTab === 'ingredients' && (
              <div className="flex flex-wrap items-center gap-1.5 min-h-[68px] py-1 text-[11px] text-[#423124]">
                {activeProduct.ingredients.slice(0, 5).map((ing, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-black/5 font-mono text-[10px] leading-tight">
                    {ing}
                  </span>
                ))}
                {activeProduct.ingredients.length > 5 && (
                  <span className="px-2.5 py-1 rounded-md bg-black/10 font-mono text-[10px] font-bold text-[#1c120c]">
                    +{activeProduct.ingredients.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Card Footer: Pricing & Action Button */}
          <div className="mt-4 pt-3.5 border-t border-black/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
            <div className="flex flex-col shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1c120c]">
                  ₹{activeProduct.price}
                </span>
                <span className="text-xs line-through text-[#8a7e73]">
                  ₹{activeProduct.originalPrice}
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                  SAVE {Math.round((1 - activeProduct.price / activeProduct.originalPrice) * 100)}%
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#7a6452] mt-0.5">Free Delivery over ₹499</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  sound.playClick(600, 0.04)
                  onJumpToRitual(activeProduct.id)
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-full font-mono text-xs font-semibold text-[#5c4632] hover:text-[#1c120c] bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
              >
                <span>Ritual</span>
                <ArrowIcon className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  sound.playChime(640, 0.4)
                  onAddToCart(activeProduct)
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: activeProduct.accentColor }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>

        {/* Left / Right Nav Arrows for Touch & Mouse */}
        <button
          onClick={prevCard}
          aria-label="Previous product"
          className="absolute left-2 sm:left-6 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-black shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => nextCard('right')}
          aria-label="Next product"
          className="absolute right-2 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-black shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Pagination Dots & Swipe Hint */}
      <div className="max-w-md mx-auto px-6 w-full flex flex-col items-center gap-3 relative z-20">
        <div className="flex items-center gap-2">
          {GOMZI_PRODUCTS.map((p, idx) => {
            const isCurrent = idx === currentIndex
            return (
              <button
                key={p.id}
                onClick={() => goToIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to ${p.name}`}
              />
            )
          })}
        </div>

        <span className="font-mono text-[11px] text-white/80 uppercase tracking-widest font-semibold flex items-center gap-1.5">
          <span>Swipe or drag cards left / right</span>
        </span>
      </div>
    </section>
  )
}
