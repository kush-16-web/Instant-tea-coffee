export function BeanGatherSection() {
  return (
    <section className="relative min-h-[120vh] w-full flex items-center justify-between px-6 py-20 pointer-events-none">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
              PHASE 02 · GATHERING
            </span>
            <h2 className="mt-4 font-serif text-[11vw] sm:text-7xl lg:text-8xl font-light leading-[0.92] text-[#f4ece1]">
              ROASTED <br />
              <span className="italic text-[#e09f3e]">WITH</span> <br />
              INTENT.
            </h2>
            <p className="mt-6 max-w-md text-base sm:text-lg font-light leading-relaxed text-[#d4c5b5]">
              Every bean is an archive of elevation, soil moisture, and deliberate thermal development. As they descend toward the ceramic cup, gravity yields to extraction.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end text-left lg:text-right">
            <div className="rounded-2xl border border-[#f4ece1]/10 bg-[#160e0a]/70 p-6 backdrop-blur-md max-w-sm">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#c67d3b]">
                DENSITY & CRACK
              </div>
              <p className="mt-2 text-sm text-[#b8a898] leading-relaxed">
                Slow roasted at 214°C over 14 minutes. Sugars caramelize without carbonizing, yielding smooth chocolate oils and sweet aromatics.
              </p>
              <div className="mt-4 flex items-center gap-4 border-t border-[#f4ece1]/10 pt-3 font-mono text-[11px] text-[#f4ece1]/80">
                <span>MOISTURE: 10.8%</span>
                <span>VARIETAL: SLN-795</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
