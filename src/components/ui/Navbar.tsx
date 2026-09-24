import { useState, useEffect } from 'react'
import { sound } from '../../utils/soundEngine'
import { logoImg, type GomziProduct } from '../../data/gomziProducts'
import { ShoppingBag, Volume2, VolumeX } from 'lucide-react'

interface NavbarProps {
  cartCount: number
  onOpenCart: () => void
  activeProduct?: GomziProduct
}

export function Navbar({ cartCount, onOpenCart, activeProduct }: NavbarProps) {
  const [soundOn, setSoundOn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const accent = activeProduct?.accentColor || '#E9B964'
  const theme = activeProduct?.themeColor || '#271912'

  useEffect(() => {
    setSoundOn(sound.isEnabled())
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggleSound = () => {
    const newState = sound.toggle()
    setSoundOn(newState)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 transition-all duration-300">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border transition-all duration-500 px-5 py-2.5 shadow-[0_14px_35px_rgba(25,12,6,0.45)] backdrop-blur-2xl relative ${
          isScrolled
            ? 'py-2 shadow-[0_18px_45px_rgba(18,9,4,0.65)]'
            : ''
        }`}
        style={{
          backgroundColor: isScrolled ? `${theme}f0` : `${theme}dd`,
          borderColor: `${accent}40`,
          boxShadow: `0 14px 35px rgba(0,0,0,0.5), 0 0 25px ${accent}18`,
        }}
      >
        {/* Subtle top latte shimmer */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f5efeb]/25 to-transparent pointer-events-none" />

        {/* Brand Mark */}
        <a href="#hero" className="group flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0c0806] font-serif font-black text-sm shadow-md transition-transform duration-300 group-hover:scale-105 overflow-hidden ring-1 ring-white/30"
            style={{
              background: `linear-gradient(135deg, ${accent}, #cbb094)`,
              boxShadow: `0 0 16px ${accent}45`,
            }}
          >
            <img src={logoImg} alt="Gomzi" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#f7efe6] leading-none">
              GOMZI{' '}
              <span
                className="font-normal text-xs uppercase tracking-widest ml-1 transition-colors duration-500"
                style={{ color: accent }}
              >
                LIFE SCIENCE
              </span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#cbb094] mt-0.5">
              Protein Staples
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {[
            ['PRODUCTS DECK', '#products-deck'],
            ['SCIENCE LAB', '#nutrition-lab'],
            ['SENSORY RITUAL', '#sensory-ritual'],
            ['TRINITY 3-PACK', '#daily-trinity'],
          ].map(([title, href]) => (
            <a
              key={title}
              href={href}
              onClick={() => sound.playClick(500, 0.03)}
              className="text-xs uppercase tracking-wider font-semibold text-[#d8bca0] transition-colors duration-300 hover:text-white"
              style={{
                ['--hover-color' as any]: accent,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#d8bca0')}
            >
              {title}
            </a>
          ))}
        </nav>

        {/* Right Controls: Sound Toggle & Bag Trigger */}
        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Switch */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              soundOn
                ? 'shadow-sm'
                : 'border-white/10 bg-white/[0.04] text-[#cbb094] hover:text-white'
            }`}
            style={
              soundOn
                ? {
                    borderColor: accent,
                    backgroundColor: `${accent}25`,
                    color: accent,
                    boxShadow: `0 0 12px ${accent}30`,
                  }
                : {}
            }
            title={soundOn ? 'Sensory sound active (Click to mute)' : 'Click to enable sensory sound'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono text-[11px]">{soundOn ? 'SOUND ON' : 'MUTE'}</span>
            {soundOn && (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 animate-pulse" style={{ backgroundColor: accent }} />
                <span className="w-0.5 h-3 animate-pulse delay-75" style={{ backgroundColor: accent }} />
                <span className="w-0.5 h-1.5 animate-pulse delay-150" style={{ backgroundColor: accent }} />
              </span>
            )}
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={() => {
              sound.playClick(600, 0.04)
              onOpenCart()
            }}
            className="flex items-center gap-2 rounded-full font-bold px-3.5 py-1.5 shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-white/20 text-[#140e0a]"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 20px ${accent}50`,
            }}
            aria-label="View selection bag"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#140e0a]" />
            <span className="font-mono text-xs font-bold text-[#140e0a]">BAG</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#140e0a] text-[10px] font-mono font-bold" style={{ color: accent }}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
