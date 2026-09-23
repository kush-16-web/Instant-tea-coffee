import { Leaf, Wind } from 'lucide-react'

export function TeaExperience() {
  return (
    <section id="tea" className="relative min-h-[140vh] w-full flex items-center justify-between px-6 py-28 pointer-events-none">
      {/* Background color transition aura to botanical green & warm cream */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a261c]/40 to-transparent pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Calm Botanical Editorial Typography */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#587b54]/40 bg-[#162218]/80 px-4 py-1.5 backdrop-blur-md mb-6">
              <Leaf className="h-3.5 w-3.5 text-[#7ea878]" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#a4c99e]">
                PHASE 06 · BOTANICAL RITUAL
              </span>
            </div>

            <h2 className="font-serif text-[12vw] sm:text-7xl lg:text-[7.5rem] font-light leading-[0.9] text-[#f4ece1]">
              TEA HAS <br />
              <span className="italic font-normal text-[#8cb385]">A TEMPO.</span>
            </h2>

            <p className="mt-6 font-sans text-base sm:text-lg font-light text-[#d5e0d3] max-w-lg leading-relaxed">
              Where coffee commands bold focus, tea asks for stillness. Whole unfurled leaves, crushed green cardamom pods, and Himalayan river mists release their soul into simmering warmth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider text-[#a8c2a3]">
              <div className="flex items-center gap-2 rounded-full border border-[#4a6b47]/40 bg-[#141f16]/60 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ea878]" />
                Whole Leaf Orthodox
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#4a6b47]/40 bg-[#141f16]/60 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ea878]" />
                Simmered Masala Decoction
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#4a6b47]/40 bg-[#141f16]/60 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7ea878]" />
                Ceremonial Stone Milled
              </div>
            </div>
          </div>

          {/* Right Column: Floating Tea Glass Details */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="rounded-3xl border border-[#4a6b47]/30 bg-[#121c13]/85 p-6 md:p-8 backdrop-blur-xl shadow-2xl max-w-md pointer-events-auto">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#8cb385] flex items-center gap-1.5">
                <Wind className="h-3 w-3" /> INFUSION HARMONY
              </span>

              <h4 className="mt-3 font-serif text-2xl font-light text-[#f4ece1]">
                Double-Walled Borosilicate Glass
              </h4>

              <p className="mt-3 text-sm text-[#b8ccb5] leading-relaxed">
                Watch the liquor turn from faint jade into radiant amber-gold. The descending tea leaves tumble gently in thermal currents before resting quietly at the bottom.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#3b5539]/40 pt-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#789674] uppercase block">STEEP DURATION</span>
                  <span className="font-bold text-[#e8f2e6]">3 MIN 30 SEC</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#789674] uppercase block">WATER PURITY</span>
                  <span className="font-bold text-[#e8f2e6]">45 PPM SPRING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
