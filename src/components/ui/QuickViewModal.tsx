import { useState, useEffect } from 'react'
import { type GomziProduct } from '../../data/gomziProducts'
import { InteractivePack3D } from '../3d/InteractivePack3D'
import { sound } from '../../utils/soundEngine'
import { X, ShoppingBag, ArrowRight } from 'lucide-react'

interface QuickViewModalProps {
  product: GomziProduct | null
  onClose: () => void
  onAddToCart: (p: GomziProduct) => void
}

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  const [viewMode, setViewMode] = useState<'360' | '2d'>('360')
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    // Lock body scroll and prevent background page movement
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [onClose])

  if (!product) return null

  // Hotspots tailored specifically for EACH product with elegant coordinates
  const tailoredHotspots = product.id === 'atta' ? [
    {
      id: 1,
      title: 'Hermetic Zip Lock',
      badge: 'TOP BARRIER SEAL',
      desc: 'Resealable high-barrier zipper prevents ambient humidity and oxidation, keeping whole-grain oils fresh for 6+ months.',
      x: '50%',
      y: '14%',
      label: 'HERMETIC ZIP LOCK',
      side: 'top' as const,
    },
    {
      id: 2,
      title: 'Whole Grain Bran Layer',
      badge: '9.2G DIETARY FIBRE',
      desc: 'Unbleached Sharbati wheat bran retains all insoluble dietary fibre, promoting gentle digestion and sustained glycemic release.',
      x: '24%',
      y: '38%',
      label: 'WHOLE BRAN SHIELD',
      side: 'left' as const,
    },
    {
      id: 3,
      title: '7-Grain Milling Core',
      badge: 'COMPLETE EAA PROFILE',
      desc: 'Precision blend of sprouted ragi, roasted oats, defatted soy, pearl barley and bengal gram providing complete amino acid balance.',
      x: '76%',
      y: '48%',
      label: '7-GRAIN BLEND',
      side: 'right' as const,
    },
    {
      id: 4,
      title: 'Micro-Whey Fortification',
      badge: '18.5G PROTEIN ENGINE',
      desc: 'Bio-active whey isolate is micro-homogenized with flour particles so rotis puff soft without any chalkiness or aftertaste.',
      x: '24%',
      y: '68%',
      label: 'MICRO-WHEY PEPTIDES',
      side: 'left' as const,
    },
    {
      id: 5,
      title: 'Cold Chakki Grinding',
      badge: 'HEAT-PROTECTED STONE MILL',
      desc: 'Slow rotational stone chakki prevents frictional heat breakdown, preserving sensitive Vitamin E, magnesium and natural grain sweetness.',
      x: '76%',
      y: '78%',
      label: 'COLD CHAKKI STONE',
      side: 'right' as const,
    },
  ] : product.id === 'tea' ? [
    {
      id: 1,
      title: 'Aroma-Barrier Foil',
      badge: 'TERPENE SHIELD',
      desc: 'Multi-layer micro-foil barrier shields volatile essential oils of ginger and cardamom from ambient heat, light and moisture degradation.',
      x: '50%',
      y: '14%',
      label: 'AROMA FOIL BARRIER',
      side: 'top' as const,
    },
    {
      id: 2,
      title: '5 Raw Ayurvedic Spices',
      badge: 'KADAK HEAT BOTANICALS',
      desc: 'Sun-dried Malabar ginger, green Idukki cardamom, Ceylon cinnamon, cloves and black pepper providing authentic kadak heat.',
      x: '24%',
      y: '38%',
      label: '5 AYURVEDIC SPICES',
      side: 'left' as const,
    },
    {
      id: 3,
      title: 'Assam CTC Leaf Extract',
      badge: 'BRISK MALTY LIQUOR',
      desc: 'Cold-extracted upper Assam orthodox tea granules delivering the bold, satisfying golden-amber liquor of traditional Indian tapri chai.',
      x: '76%',
      y: '48%',
      label: 'UPPER ASSAM FLUSH',
      side: 'right' as const,
    },
    {
      id: 4,
      title: 'Micro-Whey Infusion',
      badge: '3.5G PROTEIN / CUP',
      desc: 'Micro-filtered dairy whey instantly disperses in 80–90°C water with a rich natural crema, requiring no separate milk or heating pot.',
      x: '24%',
      y: '68%',
      label: 'MICRO-WHEY EMULSION',
      side: 'left' as const,
    },
    {
      id: 5,
      title: 'Zero Refined Sugar Formula',
      badge: '55 KCAL CLEAN PROFILE',
      desc: 'Only 55 kcal per serving with natural sweetness balanced by botanicals, keeping energy steady without afternoon sugar crashes.',
      x: '76%',
      y: '78%',
      label: 'CLEAN GLYCEMIC',
      side: 'right' as const,
    },
  ] : [
    {
      id: 1,
      title: 'Nitrogen Flush Ultrasonic Seal',
      badge: '18 MONTH FRESHNESS',
      desc: 'Hermetically sealed sachet flushed with inert food-grade nitrogen to eliminate oxygen and lock in fresh dark-roast aromas.',
      x: '50%',
      y: '14%',
      label: 'NITROGEN SEAL',
      side: 'top' as const,
    },
    {
      id: 2,
      title: 'Arabica Micro-Extraction',
      badge: 'CHIKMAGALUR ESTATE BEANS',
      desc: 'Slow roasted Arabica beans micro-ground to cold-dissolve instantly, yielding deep roasted cocoa notes and rich aromatic crema.',
      x: '24%',
      y: '38%',
      label: 'ESTATE ARABICA',
      side: 'left' as const,
    },
    {
      id: 3,
      title: 'Alkalized Dutch Cocoa',
      badge: 'RICH POLYPHENOLS',
      desc: 'Dark alkalized cocoa provides rich polyphenols, velvety crema and deep bittersweet chocolate notes with zero artificial flavors.',
      x: '76%',
      y: '48%',
      label: 'DUTCH COCOA CREMA',
      side: 'right' as const,
    },
    {
      id: 4,
      title: 'Hydrolyzed Whey Protein Core',
      badge: '5.0G RAPID PEPTIDES',
      desc: 'Rapid-absorbing whey peptides fuel post-workout recovery and sustain morning focus without digestive heaviness or bloat.',
      x: '24%',
      y: '68%',
      label: '5G WHEY PROTEIN',
      side: 'left' as const,
    },
    {
      id: 5,
      title: 'Dual Hot & Iced Dissolution',
      badge: 'COLD-SOLUBLE MATRIX',
      desc: 'Engineered micro-dispersion matrix completely dissolves in chilled milk or steaming water with zero lumps, grit or residue.',
      x: '76%',
      y: '78%',
      label: 'HOT & ICED SOLUBLE',
      side: 'right' as const,
    },
  ]

  // Product-specific atmospheric lighting palette
  const showroomAura = {
    atta: {
      spotlight: 'radial-gradient(circle at 50% 50%, rgba(196, 132, 29, 0.28) 0%, rgba(102, 58, 4, 0.15) 50%, transparent 80%)',
      accent: '#E9B964',
      badgeBg: 'rgba(233, 185, 100, 0.15)',
    },
    tea: {
      spotlight: 'radial-gradient(circle at 50% 50%, rgba(24, 59, 23, 0.35) 0%, rgba(11, 32, 10, 0.2) 50%, transparent 80%)',
      accent: '#8DC63F',
      badgeBg: 'rgba(141, 198, 63, 0.15)',
    },
    mocha: {
      spotlight: 'radial-gradient(circle at 50% 50%, rgba(84, 46, 27, 0.35) 0%, rgba(34, 15, 6, 0.2) 50%, transparent 80%)',
      accent: '#D4A373',
      badgeBg: 'rgba(212, 163, 115, 0.15)',
    },
  }[product.id]

  const activeHsData = tailoredHotspots.find((h) => h.id === activeHotspot)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a0705]/95 backdrop-blur-3xl animate-fadeIn overflow-hidden text-[#f7efe6] select-none"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* 1. Atmospheric Showroom Lighting inheriting Product Deck theme */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 -z-10"
        style={{ background: showroomAura.spotlight }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(247,239,230,0.03)_1px,transparent_1px)] [background-size:36px_36px] pointer-events-none -z-10" />

      {/* 2. Editorial Showroom Header */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-12 py-5 sm:py-6 border-b border-white/10 shrink-0 backdrop-blur-md bg-black/20">
        {/* Left: Product Name & Showroom Subtitle */}
        <div className="flex flex-col">
          <span className="font-mono text-[10px] sm:text-[11px] text-[#cbb094] uppercase tracking-[0.25em] font-semibold mb-1">
            {product.nav} · {product.size} · 360° PRODUCT SHOWROOM
          </span>
          <h2
            className="font-serif text-2xl sm:text-3xl font-black text-[#f7efe6] tracking-tight leading-none"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {product.name}
          </h2>
        </div>

        {/* Center: Minimal Floating 2D / 360° Switcher */}
        <div className="hidden md:flex items-center bg-[#1c120c]/80 border border-[#8c5a36]/40 p-1 rounded-full shadow-lg backdrop-blur-md">
          <button
            onClick={() => {
              sound.playClick(500, 0.03)
              setViewMode('2d')
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === '2d'
                ? 'bg-gradient-to-r from-[#E9B964] to-[#f4ece1] text-[#120b08] shadow-md font-black'
                : 'text-[#cbb094] hover:text-white'
            }`}
          >
            2D STILL
          </button>
          <button
            onClick={() => {
              sound.playClick(500, 0.03)
              setViewMode('360')
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === '360'
                ? 'bg-gradient-to-r from-[#E9B964] to-[#f4ece1] text-[#120b08] shadow-md font-black'
                : 'text-[#cbb094] hover:text-white'
            }`}
          >
            360° ORBIT
          </button>
        </div>

        {/* Right: Minimal Circular Close Button */}
        <button
          onClick={() => {
            sound.playClick(440, 0.04)
            onClose()
          }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#f7efe6] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
          title="Exit Showroom (Esc)"
          aria-label="Close Showroom"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* 3. Central Hero 3D Showroom Area (Open Depth Space, No Box Frames!) */}
      <main
        className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto px-4 overflow-visible"
        onPointerDown={() => setHasInteracted(true)}
      >
        {viewMode === '360' ? (
          /* Live 3D Interactive Model */
          <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
            {/* The 3D Pack Canvas (Open Space, Hero Visual) */}
            <div className="w-[280px] sm:w-[360px] md:w-[420px] h-[360px] sm:h-[440px] md:h-[500px] relative z-10 flex items-center justify-center pointer-events-auto">
              <InteractivePack3D product={product} priority />
            </div>

            {/* Subtle Luxury Hotspot Points Floating Beside Pack */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {tailoredHotspots.map((hs) => {
                const isSelected = activeHotspot === hs.id
                const isLeft = hs.side === 'left'
                const isTop = hs.side === 'top'

                return (
                  <div
                    key={hs.id}
                    className="absolute pointer-events-auto cursor-pointer group"
                    style={{
                      top: hs.y,
                      left: isLeft ? '8%' : isTop ? '50%' : undefined,
                      right: !isLeft && !isTop ? '8%' : undefined,
                      transform: isTop ? 'translateX(-50%)' : undefined,
                      width: isTop ? 'auto' : '36%',
                    }}
                    onClick={() => {
                      sound.playClick(580, 0.03)
                      setActiveHotspot(isSelected ? null : hs.id)
                    }}
                  >
                    {isTop ? (
                      <div className="flex flex-col items-center gap-1.5 -translate-y-3">
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-[#f7efe6] bg-[#1a120c]/85 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-lg group-hover:border-[#E9B964] transition-colors">
                          {hs.label}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E9B964] animate-ping" />
                      </div>
                    ) : isLeft ? (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-right pr-2">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-white block tracking-tight group-hover:text-[#E9B964] transition-colors">
                            {hs.label}
                          </span>
                        </div>
                        {/* Thin Leader Thread Line */}
                        <div className="flex-1 mx-2 h-[1px] bg-gradient-to-r from-transparent via-[#E9B964]/60 to-[#E9B964]" />
                        {/* Circular Hotspot Pin */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 border-white bg-[#E9B964] shadow-md shrink-0 transition-all ${
                            isSelected ? 'scale-125 ring-4 ring-[#E9B964]/50 animate-pulse' : 'group-hover:scale-110'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        {/* Circular Hotspot Pin */}
                        <div
                          className={`w-3.5 h-3.5 rounded-full border-2 border-white bg-[#E9B964] shadow-md shrink-0 transition-all ${
                            isSelected ? 'scale-125 ring-4 ring-[#E9B964]/50 animate-pulse' : 'group-hover:scale-110'
                          }`}
                        />
                        {/* Thin Leader Thread Line */}
                        <div className="flex-1 mx-2 h-[1px] bg-gradient-to-r from-[#E9B964] via-[#E9B964]/60 to-transparent" />
                        <div className="text-left pl-2">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-white block tracking-tight group-hover:text-[#E9B964] transition-colors">
                            {hs.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Floating Hotspot Detail Popover (Minimal floating card, NOT a giant dashboard) */}
            {activeHsData && (
              <aside className="absolute bottom-6 left-6 z-30 max-w-xs p-4 rounded-2xl bg-[#1c120c]/90 border border-[#8c5a36]/50 shadow-2xl backdrop-blur-xl animate-fadeIn">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#E9B964] uppercase tracking-wider">
                    {activeHsData.badge}
                  </span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="p-1 text-[#cbb094] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-serif text-base font-bold text-[#f7efe6] mb-1">
                  {activeHsData.title}
                </h4>
                <p className="text-xs text-[#ede2d3] leading-relaxed">
                  {activeHsData.desc}
                </p>
              </aside>
            )}

            {/* Subtle Drag Hint Banner (Disappears after interaction) */}
            <div
              className={`absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
                hasInteracted ? 'opacity-30' : 'opacity-80'
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#cbb094] bg-black/40 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                360° · DRAG TO ROTATE & EXPLORE
              </span>
            </div>
          </div>
        ) : (
          /* 2D Still Gallery Mode */
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[460px] max-w-[340px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-105"
            />
            <div className="mt-4 font-mono text-xs text-[#cbb094] tracking-widest uppercase">
              Packaging Anatomy · High Definition Scan
            </div>
          </div>
        )}
      </main>

      {/* 4. Floating Bottom Editorial Purchase & Metrics Bar */}
      <footer className="relative z-30 px-6 sm:px-12 py-4 sm:py-5 border-t border-white/10 shrink-0 backdrop-blur-md bg-black/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Key Metrics in Editorial Layout */}
          <div className="flex items-center gap-6 sm:gap-8">
            {product.stats.slice(0, 2).map((s, idx) => (
              <div key={idx} className="flex flex-col">
                <span
                  className="font-serif text-2xl sm:text-3xl font-black leading-none"
                  style={{ color: product.accentColor }}
                >
                  {s.value}
                  <span className="text-sm font-sans ml-0.5">{s.unit}</span>
                </span>
                <span className="font-mono text-[10px] text-[#cbb094] uppercase tracking-wider mt-1">
                  {s.label}
                </span>
              </div>
            ))}

            <div className="hidden lg:block max-w-sm pl-4 border-l border-white/10 text-xs text-[#cbb094] line-clamp-2">
              {product.story}
            </div>
          </div>

          {/* Right: Integrated Price & Rounded Tactile Add to Bag Button */}
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex flex-col text-right">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#f7efe6]">
                  ₹{product.price}
                </span>
                <span className="text-xs line-through text-[#8a7e73]">
                  ₹{product.originalPrice}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                  SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#cbb094]">
                Ready to dispatch · Tax included
              </span>
            </div>

            <button
              onClick={() => {
                sound.playChime(600, 0.4)
                onAddToCart(product)
                onClose()
              }}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full font-bold text-sm text-[#0c0806] shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer font-sans"
              style={{ backgroundColor: product.accentColor }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
