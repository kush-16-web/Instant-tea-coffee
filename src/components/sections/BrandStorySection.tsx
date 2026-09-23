export function BrandStorySection() {
  return (
    <section id="brand-story" className="relative min-h-[120vh] w-full flex flex-col justify-center px-6 py-32 pointer-events-none overflow-hidden">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
            THE PHILOSOPHY
          </span>

          <h2 className="mt-4 font-serif text-[13vw] sm:text-7xl lg:text-[8rem] font-light leading-[0.88] text-[#f4ece1]">
            GOOD COFFEE <br />
            <span className="italic font-normal text-[#e09f3e]">TAKES TIME.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <p className="font-sans text-lg md:text-xl font-light leading-relaxed text-[#d4c5b5]">
              In a culture that celebrates speed, we honor the deliberate pause. We wait for cherry sugars to peak on misty mountains. We listen for the first crack in the drum.
            </p>

            <div className="rounded-3xl border border-[#f4ece1]/10 bg-[#160e0a]/60 p-6 md:p-8 backdrop-blur-md">
              <span className="font-mono text-xs uppercase tracking-widest text-[#c67d3b]">
                OUR MANIFESTO
              </span>
              <p className="mt-3 text-sm leading-relaxed text-[#b8a898]">
                Every cup is an intersection of human patience and natural chemistry. We roast in modest micro-batches, grind seconds before infusion, and brew with reverent attention.
              </p>
              <div className="mt-6 flex items-center gap-6 font-mono text-xs text-[#f4ece1]/80 border-t border-[#f4ece1]/10 pt-4">
                <span>ESTABLISHED 2026</span>
                <span>SINGLE ORIGIN PURITY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
