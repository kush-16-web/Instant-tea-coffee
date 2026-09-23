import { sound } from '../../utils/soundEngine'
import { logoImg } from '../../data/gomziProducts'
import { ShieldCheck, Heart, ArrowUp } from 'lucide-react'

export function GomziFooter() {
  const scrollToTop = () => {
    sound.playClick(600, 0.04)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-white/10 bg-[#0c0806] pt-20 pb-12 overflow-hidden text-[#a89b8d]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9B964] text-[#0c0806] overflow-hidden">
                <img src={logoImg} alt="Gomzi Logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-serif text-xl font-bold text-[#f4ece1]">
                GOMZI LIFE SCIENCE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8a7e73] leading-relaxed max-w-sm mb-6">
              Pioneering the next generation of daily Indian staples. Formulated with pure bio-active whey and stone-milled whole grains for modern wellness and active lifespans.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#dcd0bf]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified ISO 22000 & FSSAI Lic. No. 10022021000845</span>
            </div>
          </div>

          {/* Quick Chapters */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#f4ece1] mb-4">
              3D Chapters
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#atta"
                  onClick={() => sound.playClick(500, 0.03)}
                  className="hover:text-[#E9B964] transition-colors"
                >
                  Multi Grain Atta with Protein (500g)
                </a>
              </li>
              <li>
                <a
                  href="#tea"
                  onClick={() => sound.playClick(520, 0.03)}
                  className="hover:text-[#99D354] transition-colors"
                >
                  Instant Ayurvedic Spiced Tea (14g)
                </a>
              </li>
              <li>
                <a
                  href="#mocha"
                  onClick={() => sound.playClick(540, 0.03)}
                  className="hover:text-[#D48B47] transition-colors"
                >
                  Instant Mocha Dark Roast (14g)
                </a>
              </li>
              <li>
                <a
                  href="#daily-trinity"
                  onClick={() => sound.playChime(600, 0.3)}
                  className="text-[#E9B964] font-semibold hover:underline"
                >
                  The Daily Trinity Bundle (Save 15%)
                </a>
              </li>
            </ul>
          </div>

          {/* Science & Experience */}
          <div className="md:col-span-4 flex flex-col">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#f4ece1] mb-4">
              Science & Rituals
            </h4>
            <ul className="space-y-2.5 text-xs mb-6">
              <li>
                <a href="#nutrition-lab" className="hover:text-[#f4ece1] transition-colors">
                  Comparative Nutrition Matrix
                </a>
              </li>
              <li>
                <a href="#sensory-ritual" className="hover:text-[#f4ece1] transition-colors">
                  Sensory Brewing Protocol
                </a>
              </li>
              <li>
                <span className="text-[#6e6359]">Lab Batch Certificates (Available upon request)</span>
              </li>
            </ul>

            {/* Back to top button */}
            <div>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-[#f4ece1] transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Return to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6e6359] gap-4">
          <p>© 2026 Gomzi Life Science Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for mindful nutrition & active living</span>
            <Heart className="w-3 h-3 text-[#E9B964] inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  )
}
