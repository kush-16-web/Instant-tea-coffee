interface FinalCTASectionProps {
  onExploreMenu: () => void
  onStory: () => void
}

export function FinalCTASection({ onExploreMenu, onStory }: FinalCTASectionProps) {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-6 py-28 pointer-events-none">
      <div className="mx-auto w-full max-w-5xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
          EXTRACTION COMPLETE
        </span>

        <h2 className="mt-4 font-serif text-[14vw] sm:text-8xl lg:text-[9rem] font-light leading-[0.88] text-[#f4ece1]">
          TAKE <span className="italic font-normal text-[#e09f3e]">A SIP.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-lg font-sans text-base sm:text-lg font-light text-[#d4c5b5] leading-relaxed">
          The ritual is ready. Warm steam swirls into the air, holding rich cocoa aromas, roasted nuts, and delicate citrus florals.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
          <button
            onClick={onExploreMenu}
            className="rounded-full bg-[#c67d3b] px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#0f0a07] shadow-2xl transition-all duration-300 hover:bg-[#e09f3e] hover:scale-105"
          >
            EXPLORE THE MENU
          </button>

          <button
            onClick={onStory}
            className="rounded-full border border-[#f4ece1]/20 bg-[#160e0a]/80 px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[#f4ece1] backdrop-blur-md transition-all hover:border-[#c67d3b] hover:bg-[#20140e]"
          >
            OUR STORY
          </button>
        </div>
      </div>
    </section>
  )
}
