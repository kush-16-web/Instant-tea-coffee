import { useState } from 'react'

const PILLARS = [
  {
    step: '01',
    title: 'THE BEAN',
    tagline: 'Grown at 1,450 meters beneath shade canopies',
    copy: 'Harvested exclusively by hand when cherries reach deep crimson ripeness. Naturally washed in mountain stream water and dried slowly on raised bamboo beds under gentle sunlight.',
    notes: ['SLN-795 & Typica', 'Hand Picked', 'Brix 22° Sugar Content'],
  },
  {
    step: '02',
    title: 'THE ROAST',
    tagline: 'Controlled drum convection and artisan sensory crack',
    copy: 'Slow thermal development curve spanning 14 minutes. We preserve fragile organic floral esters while developing deep baker’s cacao and dark demerara sweetness.',
    notes: ['Medium-Dark Profile', 'Gentle Air Quenched', 'Agtron 58/68'],
  },
  {
    step: '03',
    title: 'THE POUR',
    tagline: 'Precision 93.5°C water dispersion and micro-channel control',
    copy: 'Pre-infusion blooming allows carbon dioxide trapped in cell walls to escape gently. The stream then draws out dense oils and golden crema without extracting astringent wood tannins.',
    notes: ['1:16 Ratio', 'Flat Bed Geometry', 'Zero Bypass'],
  },
]

export function IngredientStory() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <section id="ingredients" className="relative min-h-[140vh] w-full flex items-center justify-between px-6 py-28 pointer-events-auto">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#f4ece1]/10 pb-8 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
              PHASE 05 · PROVENANCE
            </span>
            <h2 className="mt-3 font-serif text-5xl md:text-7xl font-light text-[#f4ece1]">
              ANATOMY OF <span className="italic font-normal text-[#e09f3e]">CRAFT.</span>
            </h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-[#a8998c] mt-4 md:mt-0">
            Select a pillar to explore the slow craft methodology
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, idx) => {
            const isSelected = activeIdx === idx
            return (
              <div
                key={p.title}
                onClick={() => setActiveIdx(idx)}
                className={`group cursor-pointer rounded-3xl border p-8 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#c67d3b] bg-[#1a0f09]/90 shadow-2xl scale-[1.02]'
                    : 'border-[#f4ece1]/10 bg-[#120a06]/60 hover:border-[#f4ece1]/25 hover:bg-[#160e0a]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#c67d3b]">
                    {p.step} / 03
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-[#e09f3e] scale-125' : 'bg-[#f4ece1]/20 group-hover:bg-[#f4ece1]/40'
                    }`}
                  />
                </div>

                <h3 className="mt-5 font-serif text-3xl md:text-4xl font-normal text-[#f4ece1]">
                  {p.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-[#e09f3e] tracking-wide">
                  {p.tagline}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-[#c7b7a7]">
                  {p.copy}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-[#f4ece1]/10 pt-4">
                  {p.notes.map((note) => (
                    <span
                      key={note}
                      className="rounded-full border border-[#f4ece1]/10 bg-[#0f0704] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#d4c5b5]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
