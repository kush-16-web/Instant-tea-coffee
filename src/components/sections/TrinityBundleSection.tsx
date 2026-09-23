import { TRINITY_BUNDLE, GOMZI_PRODUCTS } from '../../data/gomziProducts'
import { sound } from '../../utils/soundEngine'
import { Sparkles, Check, ShoppingBag } from 'lucide-react'

interface TrinityBundleSectionProps {
  onAddBundleToCart: () => void
}

export function TrinityBundleSection({ onAddBundleToCart }: TrinityBundleSectionProps) {
  const handleAddBundle = () => {
    sound.playChime(680, 0.5)
    onAddBundleToCart()
  }

  return (
    <section id="daily-trinity" className="relative py-28 sm:py-36 border-t border-white/5 overflow-hidden scroll-mt-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E9B964]/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Main Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1a120b] via-[#140e09] to-[#0c0806] border border-[#E9B964]/30 p-8 sm:p-14 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9B964]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9B964]/15 border border-[#E9B964]/40 text-xs font-bold text-[#E9B964] w-fit mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{TRINITY_BUNDLE.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#f4ece1] mb-4">
                {TRINITY_BUNDLE.name}
              </h2>

              <p className="text-base text-[#dcd0bf] leading-relaxed mb-6">
                {TRINITY_BUNDLE.description}
              </p>

              {/* Day-in-the-Life Routine */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-8">
                <div className="flex flex-col">
                  <span className="text-xs text-[#E9B964] font-semibold">☀️ BREAKFAST</span>
                  <span className="text-sm font-bold text-[#f4ece1] mt-0.5">Golden Rotis</span>
                  <span className="text-[11px] text-[#a89b8d]">18.5g Protein / 100g</span>
                </div>
                <div className="flex flex-col border-x border-white/10 px-3">
                  <span className="text-xs text-[#99D354] font-semibold">☕ 4 PM SLUMP</span>
                  <span className="text-sm font-bold text-[#f4ece1] mt-0.5">Spiced Chai</span>
                  <span className="text-[11px] text-[#a89b8d]">3.5g Micro-Whey</span>
                </div>
                <div className="flex flex-col pl-2">
                  <span className="text-xs text-[#D48B47] font-semibold">⚡ WORKOUT</span>
                  <span className="text-sm font-bold text-[#f4ece1] mt-0.5">Mocha Roast</span>
                  <span className="text-[11px] text-[#a89b8d]">5.0g Pure Energy</span>
                </div>
              </div>

              {/* Perks List */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#b5a79a] mb-8">
                {TRINITY_BUNDLE.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#E9B964] shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              {/* Price & Add to Cart */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#f4ece1]">
                      ₹{TRINITY_BUNDLE.price}
                    </span>
                    <span className="text-base line-through text-[#8a7e73]">
                      ₹{TRINITY_BUNDLE.originalPrice}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold mt-0.5">
                    Instant savings of ₹{TRINITY_BUNDLE.savings}
                  </span>
                </div>

                <button
                  onClick={handleAddBundle}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#E9B964] hover:bg-[#f3d28e] text-[#0c0806] font-bold text-sm shadow-xl transition-all hover:scale-105"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Claim Trinity Bundle (Save 15%)</span>
                </button>
              </div>
            </div>

            {/* Right Trio Product Display */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[420px] flex items-center justify-center">
                {/* 3 Pack Product Imagery Layer */}
                <div className="relative flex items-center justify-center">
                  {/* Atta in the center */}
                  <img
                    src={GOMZI_PRODUCTS[0].image}
                    alt="Atta Pouch"
                    className="w-48 sm:w-56 h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] z-20 hover:scale-105 transition-transform duration-500"
                  />
                  {/* Tea on the left */}
                  <img
                    src={GOMZI_PRODUCTS[1].image}
                    alt="Spiced Tea Sachet"
                    className="absolute -left-6 bottom-4 w-36 sm:w-44 h-auto -rotate-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] z-10 hover:-rotate-6 transition-transform duration-500"
                  />
                  {/* Mocha on the right */}
                  <img
                    src={GOMZI_PRODUCTS[2].image}
                    alt="Mocha Coffee Sachet"
                    className="absolute -right-6 bottom-4 w-36 sm:w-44 h-auto rotate-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] z-30 hover:rotate-6 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
