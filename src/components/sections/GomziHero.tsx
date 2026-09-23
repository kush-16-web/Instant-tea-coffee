import { useState, useEffect } from 'react'
import { GOMZI_PRODUCTS, type GomziProduct } from '../../data/gomziProducts'
import { InteractivePack3D } from '../3d/InteractivePack3D'
import { InstancedWorldParticles } from '../3d/InstancedWorldParticles'
import { sound } from '../../utils/soundEngine'
import { ArrowDown, Sparkles, Eye } from 'lucide-react'

interface GomziHeroProps {
  onQuickInspect: (p: GomziProduct) => void
  onExploreClick: () => void
  onProductSelect?: (p: GomziProduct) => void
  readyToReveal?: boolean
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

  // State to trigger the bottom-to-center half-rotation reveal once loader finishes
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    if (readyToReveal) {
      const timer = setTimeout(() => {
        setHasRevealed(true)
        sound.playFoilCrinkle()
      }, 180)
      return () => clearTimeout(timer)
    }
  }, [readyToReveal])

  // Notify parent on mount/product set
  useEffect(() => {
    onProductSelect?.(activeProduct)
  }, [activeProduct, onProductSelect])

  return (
    <section
      id="hero-section"
      className="relative min-h-[105vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#111411] text-[#f4ece1] select-none"
    >
      {/* 1. Realistic Instanced Floating 3D Grains / Beans / Leaves in Background */}
      <InstancedWorldParticles
        key={`hero-particles-${activeProduct.id}`}
        type={activeProduct.particleType}
        accentColor={activeProduct.accentColor}
        fullScreen={true}
        className="opacity-55"
      />

      {/* 2. Oversized Editorial Brand Typography Layered BEHIND the Center 3D Pack */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span
          className="text-[18vw] sm:text-[20vw] font-black tracking-tighter uppercase leading-none text-white/[0.04] transition-all duration-1000 whitespace-nowrap"
          style={{
            fontFamily: "var(--font, 'Archivo', system-ui, sans-serif)",
          }}
        >
          {activeProduct.id === 'atta' ? 'ATTAGOMZI' : activeProduct.id === 'tea' ? 'CHAIGOMZI' : 'MOCHAGOMZI'}
        </span>
      </div>

      {/* 3. Subtle Central Radial Warmth matching active product */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-all duration-1000 -z-10"
        style={{ backgroundColor: activeProduct.accentColor }}
      />

      {/* Top Header Tag */}
      <div className="max-w-7xl mx-auto px-6 w-full text-center relative z-20 pt-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold text-[#f4ece1] shadow-sm">
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
        <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
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

        {/* Center Stage: Hero Product 3D Model with Bottom-to-Center 180° Reveal */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[520px] order-1 lg:order-2">
          {/* Subtle Ambient Circular Orbit Rings */}
          <div
            className="absolute w-[440px] h-[440px] rounded-full border border-white/5 pointer-events-none -z-10 animate-spin"
            style={{ animationDuration: '80s' }}
          />
          <div
            className="absolute w-[330px] h-[330px] rounded-full border border-dashed border-white/10 pointer-events-none -z-10"
          />

          {/* 3D Product Pack Container with Bottom-to-Center 180° Reveal Animation */}
          <div
            className="w-full max-w-[420px] relative z-10 transition-all duration-[1200ms]"
            style={{
              transform: hasRevealed
                ? 'translate3d(0, 0, 0) rotateY(0deg) scale(1)'
                : 'translate3d(0, 110%, 0) rotateY(180deg) scale(0.65)',
              opacity: hasRevealed ? 1 : 0,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <InteractivePack3D
              key={activeProduct.id}
              product={activeProduct}
              priority
              onQuickInspect={() => onQuickInspect(activeProduct)}
            />
          </div>
        </div>

        {/* Right Editorial Flank */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right order-3">
          {/* Key Product Highlight Metrics */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md w-full max-w-xs mb-4">
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
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#dcd0bf] hover:text-white transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspect 3D Anatomical Anatomy</span>
          </button>
        </div>
      </div>

      {/* Downward Scroll Cue */}
      <div className="flex justify-center mt-6 z-20">
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
