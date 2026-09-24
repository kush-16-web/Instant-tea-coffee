import { type GomziProduct } from '../../data/gomziProducts'
import { sound } from '../../utils/soundEngine'
import { Eye, ShoppingBag, Check, ShieldCheck, Sparkles, Award } from 'lucide-react'

interface ProductDetailSectionProps {
  product: GomziProduct
  onAddToCart: (product: GomziProduct) => void
  onQuickInspect: (product: GomziProduct) => void
}

export function ProductDetailSection({
  product,
  onAddToCart,
  onQuickInspect,
}: ProductDetailSectionProps) {
  return (
    <section
      id="product-details"
      className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-16 transition-colors duration-1000 ease-out overflow-hidden"
      style={{
        backgroundColor: product.themeColor || '#0c0806',
      }}
    >
      {/* Top subtle gradient blend to ensure zero seam with the Product Deck */}
      <div
        className="absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(12, 8, 6, 0.8), transparent)`,
        }}
      />

      {/* Atmospheric radial ambient glow reflecting active product accent */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none -z-10 transition-colors duration-1000 opacity-25"
        style={{ backgroundColor: product.accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10 transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: product.secondaryAccent || product.accentColor }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{ backgroundColor: product.accentColor }}
              />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#b8a99a]">
                SELECTED SPECIFICATION · CHAPTER 01
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#f4ece1] font-normal tracking-tight">
              Anatomy of <span className="italic font-normal" style={{ color: product.accentColor }}>{product.name}</span>
            </h2>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="font-mono text-xs text-[#a8998c] uppercase tracking-wider block">
              Pure Daily Nutrition · Batch 2026
            </span>
          </div>
        </div>

        {/* Upper Split: Left Product Showcase / Right Key Spec & Commerce */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Premium Large Product Visual */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl p-8 flex items-center justify-center bg-white/[0.03] border border-white/10 shadow-2xl overflow-hidden group">
              {/* Product radial glow */}
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 blur-2xl rounded-full"
                style={{
                  background: `radial-gradient(circle at center, ${product.accentColor} 0%, transparent 70%)`,
                }}
              />

              {/* Verified Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] text-white uppercase tracking-wider font-semibold">
                  100% Veg
                </span>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#e5c390]" />
                <span className="font-mono text-[10px] text-[#e5c390] uppercase tracking-wider">
                  FSSAI Certified
                </span>
              </div>

              {/* Packaging Artwork */}
              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-105"
              />

              {/* 360° Inspection Button Trigger */}
              <button
                onClick={() => {
                  sound.playClick(600, 0.04)
                  onQuickInspect(product)
                }}
                className="absolute bottom-4 inset-x-6 py-2.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all cursor-pointer shadow-lg"
              >
                <Eye className="w-3.5 h-3.5" style={{ color: product.accentColor }} />
                <span>Open 360° Interactive Cutaway</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Lede, Price, Specs, CTA */}
          <div className="lg:col-span-7 flex flex-col">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4ece1] font-normal tracking-tight leading-tight">
              {product.name}
            </h3>

            <p className="font-sans text-sm sm:text-base text-[#dcd0bf] font-light mt-3 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-4 mt-6">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                ₹{product.price}
              </span>
              <span className="font-sans text-sm text-[#8c786a] line-through">
                ₹{product.originalPrice}
              </span>
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${product.accentColor}25`,
                  color: product.accentColor,
                  border: `1px solid ${product.accentColor}40`,
                }}
              >
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>

            <p className="font-mono text-xs text-[#a8998c] mt-1">
              Net Qty: {product.netWeight} · Single pack
            </p>

            {/* Quick Macro Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
              {product.stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col"
                >
                  <span className="font-serif text-2xl font-bold text-white">
                    {stat.value}
                    <span className="text-sm font-normal ml-0.5" style={{ color: product.accentColor }}>
                      {stat.unit}
                    </span>
                  </span>
                  <span className="font-sans text-[11px] text-[#b8a99a] mt-1 font-light">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions: Add to Bag & Secondary */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  sound.playChime(700, 0.3)
                  onAddToCart(product)
                }}
                className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0c0806] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
                style={{ backgroundColor: product.accentColor }}
              >
                <ShoppingBag className="w-4 h-4 text-[#0c0806]" />
                <span>Add {product.name} to Bag</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick(600, 0.04)
                  onQuickInspect(product)
                }}
                className="px-6 py-3.5 rounded-full text-xs font-semibold text-[#f4ece1] bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all cursor-pointer flex items-center gap-2"
              >
                <Eye className="w-3.5 h-3.5" style={{ color: product.accentColor }} />
                <span>Inspect Micro-Nutrition</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Foundation: Detailed Story, What Makes It Different, Ingredients */}
        <div className="mt-20 pt-16 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: The Formulation Story */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" style={{ color: product.accentColor }} />
                <h4 className="font-serif text-xl text-[#f4ece1] font-normal">
                  The Formulation Story
                </h4>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#b8a99a] font-light leading-relaxed">
                {product.story}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] text-[#8c786a] uppercase tracking-wider block">
                Serving Recommendation:
              </span>
              <span className="font-sans text-xs text-[#dcd0bf] mt-0.5 block">
                {product.recommendedPairing}
              </span>
            </div>
          </div>

          {/* Card 2: What Makes It Different */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: product.accentColor }} />
              <h4 className="font-serif text-xl text-[#f4ece1] font-normal">
                What Makes It Different
              </h4>
            </div>
            <ul className="space-y-3">
              {product.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#dcd0bf] font-light leading-relaxed">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: product.accentColor }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Botanical & Nutritional Purity */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4" style={{ color: product.accentColor }} />
                <h4 className="font-serif text-xl text-[#f4ece1] font-normal">
                  Authentic Ingredients
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] text-[#d4c5b5] bg-black/40 border border-white/10 rounded-full px-2.5 py-1"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Sensory Profiles */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="font-mono text-[10px] text-[#8c786a] uppercase tracking-wider block mb-2">
                Sensory Profile:
              </span>
              <div className="space-y-1.5">
                {product.sensoryNotes.slice(0, 2).map((note, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-[#dcd0bf]">
                    <span className="font-light">{note.name}</span>
                    <span className="font-mono text-[10px] text-[#b8a99a]">{note.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
