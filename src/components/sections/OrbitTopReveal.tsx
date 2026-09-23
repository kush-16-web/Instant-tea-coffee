import { Sparkles, Wind } from 'lucide-react'

export function OrbitTopReveal() {
  return (
    <section className="relative min-h-[130vh] w-full flex items-center justify-between px-6 py-28 pointer-events-none">
      <div className="mx-auto w-full max-w-7xl flex flex-col justify-between min-h-[70vh]">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c67d3b]/40 bg-[#160e0a]/80 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#e09f3e] animate-spin" style={{ animationDuration: '6s' }} />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#e09f3e]">
              PHASE 04 · TOP-DOWN REVEAL
            </span>
          </div>

          <h2 className="mt-6 font-serif text-[10vw] sm:text-7xl lg:text-8xl font-light tracking-tight text-[#f4ece1]">
            THE GOLDEN <span className="italic font-normal text-[#e09f3e]">CREMA.</span>
          </h2>

          <p className="mt-4 font-sans text-base sm:text-lg font-light text-[#d4c5b5] max-w-xl leading-relaxed">
            Suspended directly overhead. Witness harmonic micro-ripples and delicate steam rising from the mirror-smooth surface of freshly extracted single-origin espresso.
          </p>
        </div>

        {/* Bottom Floating Annotations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="rounded-2xl border border-[#f4ece1]/10 bg-[#160e0a]/60 p-5 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c67d3b]">
              SURFACE TENSION
            </span>
            <p className="mt-1 text-sm text-[#b8a898]">
              Cohesive lipid bonds create a glossy meniscus curve adhering naturally against the ceramic rim.
            </p>
          </div>

          <div className="rounded-2xl border border-[#f4ece1]/10 bg-[#160e0a]/60 p-5 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c67d3b] flex items-center gap-1.5">
              <Wind className="h-3 w-3" /> AROMATIC STEAM
            </span>
            <p className="mt-1 text-sm text-[#b8a898]">
              Volatile terpenes, pyrazines, and esters disperse into the air at 68°C drinking temperature.
            </p>
          </div>

          <div className="rounded-2xl border border-[#f4ece1]/10 bg-[#160e0a]/60 p-5 backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c67d3b]">
              EXTRACTION CLARITY
            </span>
            <p className="mt-1 text-sm text-[#b8a898]">
              TDS (Total Dissolved Solids) balanced at an ideal 9.8% concentration for silky body.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
