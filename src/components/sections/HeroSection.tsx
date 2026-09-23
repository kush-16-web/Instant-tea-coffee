import { Sparkles } from 'lucide-react'

interface HeroSectionProps {
  onExplore: () => void
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-between px-6 py-28 pointer-events-none">
      {/* Top Tagline */}
      <div className="mx-auto w-full max-w-7xl pt-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c67d3b] animate-ping" />
          Single Estate · Slow Roasted · Whole Leaf
        </div>
      </div>

      {/* Main Center Editorial Typography */}
      <div className="mx-auto w-full max-w-7xl my-auto">
        <div className="max-w-4xl">
          <h1 className="font-serif text-[13vw] sm:text-[11vw] lg:text-[8.5rem] font-light leading-[0.88] tracking-tight text-[#f4ece1]">
            COFFEE <br />
            <span className="italic font-normal text-[#e09f3e]">WITHOUT</span> <br />
            THE RUSH.
          </h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <p className="font-sans text-base sm:text-lg text-[#d4c5b5] max-w-md leading-relaxed font-light">
              Specialty coffee and artisan tea, prepared with quiet intention. A ritual where time is an ingredient, not an obstacle.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
              <button
                onClick={onExplore}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#c67d3b] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#0f0a07] shadow-2xl transition-all duration-300 hover:bg-[#e09f3e] hover:scale-105"
              >
                <span>EXPLORE THE BREW</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f0a07] transition-transform duration-300 group-hover:scale-150" />
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#a8998c]">
                <Sparkles className="h-3.5 w-3.5 text-[#c67d3b]" />
                <span>Grab & fling foreground beans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8e7e72]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-[1px] bg-gradient-to-b from-[#c67d3b] to-transparent animate-pulse" />
          <span>SCROLL TO ADVANCE BREW</span>
        </div>
        <div className="hidden sm:block">
          TEMPO: 01 / 07 · THE VESSEL & GRAIN
        </div>
      </div>
    </section>
  )
}
