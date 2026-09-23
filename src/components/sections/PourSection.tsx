import { Droplets, Activity, Gauge, Flame } from 'lucide-react'

interface PourSectionProps {
  fillProgress: number
}

export function PourSection({ fillProgress }: PourSectionProps) {
  const displayPercent = Math.min(100, Math.floor(fillProgress * 100))

  return (
    <section id="pour" className="relative min-h-[140vh] w-full flex items-center justify-between px-6 py-24 pointer-events-none">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Extraction Metrics Hud */}
          <div className="order-2 lg:order-1 flex flex-col gap-4 max-w-md">
            <div className="rounded-3xl border border-[#f4ece1]/10 bg-[#160e0a]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f4ece1]/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#c67d3b] flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  EXTRACTION IN PROGRESS
                </span>
                <span className="font-mono text-xs font-bold text-[#f4ece1]">
                  STAGE: {displayPercent}%
                </span>
              </div>

              {/* Realtime Fill Height Progress Bar */}
              <div className="mt-5">
                <div className="flex justify-between font-mono text-[11px] text-[#b8a898] mb-1.5">
                  <span>VESSEL VOLUME</span>
                  <span>{displayPercent}% FULL</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#2a170d]">
                  <div
                    className="h-full bg-gradient-to-r from-[#8a4216] via-[#c67d3b] to-[#e09f3e] transition-all duration-75"
                    style={{ width: `${displayPercent}%` }}
                  />
                </div>
              </div>

              {/* Extraction Parameters */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center border-t border-[#f4ece1]/10 pt-4">
                <div className="flex flex-col items-center">
                  <Flame className="h-4 w-4 text-[#c67d3b] mb-1" />
                  <span className="font-mono text-[10px] uppercase text-[#8e7e72]">WATER TEMP</span>
                  <span className="font-mono text-xs font-bold text-[#f4ece1]">93.4°C</span>
                </div>
                <div className="flex flex-col items-center">
                  <Gauge className="h-4 w-4 text-[#c67d3b] mb-1" />
                  <span className="font-mono text-[10px] uppercase text-[#8e7e72]">PRESSURE</span>
                  <span className="font-mono text-xs font-bold text-[#f4ece1]">9.2 BAR</span>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="h-4 w-4 text-[#c67d3b] mb-1" />
                  <span className="font-mono text-[10px] uppercase text-[#8e7e72]">YIELD</span>
                  <span className="font-mono text-xs font-bold text-[#f4ece1]">36.0 G</span>
                </div>
              </div>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-widest text-[#a8998c] px-2">
              Continuous scroll dynamically shifts liquid volume inside the ceramic vessel
            </p>
          </div>

          {/* Right Column: Giant Editorial Typography */}
          <div className="order-1 lg:order-2 lg:text-right">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
              PHASE 03 · EXTRACTION
            </span>
            <h2 className="mt-4 font-serif text-[13vw] sm:text-8xl lg:text-[7.5rem] font-light leading-[0.88] text-[#f4ece1]">
              BREW <br />
              <span className="italic text-[#e09f3e]">SLOW.</span>
            </h2>
            <p className="mt-6 font-sans text-base sm:text-lg font-light text-[#d4c5b5] max-w-lg lg:ml-auto leading-relaxed">
              Pressurized hot water meets micro-ground coffee cells. Emulsified lipids and delicate golden crema release a symphony of bittersweet complexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
