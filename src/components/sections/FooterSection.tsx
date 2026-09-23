import { ArrowUp, Sparkles } from 'lucide-react'

export function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative min-h-screen w-full flex flex-col justify-between px-6 py-24 bg-[#0a0604] pointer-events-auto border-t border-[#f4ece1]/10 overflow-hidden">
      {/* Top Banner Tag */}
      <div className="mx-auto w-full max-w-7xl flex items-center justify-between border-b border-[#f4ece1]/10 pb-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>INTERACTIVE BEAN STORM · FLING FOREGROUND BEANS</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#f4ece1]/70 hover:text-[#e09f3e] transition-colors"
        >
          <span>RETURN TO APEX</span>
          <ArrowUp className="h-4 w-4 text-[#c67d3b]" />
        </button>
      </div>

      {/* Center Giant Editorial Typography */}
      <div className="mx-auto w-full max-w-7xl my-auto text-center py-12">
        <h2 className="font-serif text-[12vw] sm:text-[11vw] lg:text-[8rem] font-light leading-[0.88] tracking-tight text-[#f4ece1] select-none">
          GOOD COFFEE <br />
          <span className="italic font-normal text-[#e09f3e]">STARTS</span> HERE.
        </h2>

        <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-[#b8a898]">
          Brew deliberate. Savor the extraction. Honor the growers.
        </p>
      </div>

      {/* Bottom Minimal Navigation & Legal */}
      <div className="mx-auto w-full max-w-7xl pt-12 border-t border-[#f4ece1]/10 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-[#8e7e72]">
        <div className="flex flex-wrap items-center gap-8">
          {[
            ['SELECTIONS', '#products'],
            ['EXTRACTION', '#pour'],
            ['TEA TEMPO', '#tea'],
            ['FLAVOR RADAR', '#flavor-radar'],
            ['PROVENANCE', '#ingredients'],
            ['INSTAGRAM', 'https://instagram.com'],
          ].map(([title, href]) => (
            <a
              key={title}
              href={href}
              className="uppercase tracking-widest transition-colors hover:text-[#e09f3e]"
            >
              {title}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span>© 2026 ROAST & LEAF /</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  )
}
