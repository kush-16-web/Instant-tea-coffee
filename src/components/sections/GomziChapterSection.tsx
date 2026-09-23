import { useState } from 'react'
import { type GomziProduct } from '../../data/gomziProducts'
import { InteractivePack3D } from '../3d/InteractivePack3D'
import { InstancedWorldParticles } from '../3d/InstancedWorldParticles'
import { sound } from '../../utils/soundEngine'
import { ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react'

interface GomziChapterSectionProps {
  product: GomziProduct
  index: number
  onAddToCart: (p: GomziProduct) => void
  onQuickInspect: (p: GomziProduct) => void
  onJumpToRitual: (productId: string) => void
}

export function GomziChapterSection({
  product,
  index,
  onAddToCart,
  onQuickInspect,
  onJumpToRitual,
}: GomziChapterSectionProps) {
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'sensory'>('benefits')

  const handleAddToCart = () => {
    sound.playChime(640, 0.4)
    onAddToCart(product)
  }

  return (
    <section
      id={product.id}
      className="relative min-h-screen py-24 sm:py-32 flex flex-col justify-center border-t border-white/5 overflow-hidden scroll-mt-24"
    >
      {/* Background Big Kinetic Marquee */}
      <div
        className="absolute top-12 left-0 w-full overflow-hidden pointer-events-none select-none opacity-[0.06] -z-10"
        aria-hidden="true"
      >
        <div className="whitespace-nowrap font-serif text-[12vw] font-black uppercase tracking-tighter text-[#f4ece1] leading-none animate-marquee">
          {product.bigName} {product.bigName}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        {/* Chapter Header Tracker */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className="text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border"
            style={{
              color: product.accentColor,
              borderColor: `${product.accentColor}40`,
              backgroundColor: `${product.accentColor}10`,
            }}
          >
            CHAPTER 0{index + 1}
          </span>
          <span className="text-xs uppercase tracking-widest text-[#8a7e73] font-semibold">
            {product.nav} Experience
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Product Information & Interactive Explorer */}
          <div className="lg:col-span-6 flex flex-col order-2 lg:order-1">
            <span className="text-xs uppercase tracking-widest text-[#a89b8d] font-medium mb-2">
              {product.size} · {product.netWeight}
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#f4ece1] leading-tight mb-4">
              {product.name}
            </h2>

            <p className="text-base sm:text-lg text-[#dcd0bf] leading-relaxed mb-6">
              {product.lede}
            </p>

            {/* Key Nutritional Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8">
              {product.stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="text-2xl sm:text-3xl font-bold font-serif"
                      style={{ color: product.accentColor }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs text-[#a89b8d] font-semibold">{s.unit}</span>
                  </div>
                  <span className="text-xs text-[#8a7e73] font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tabbed Interactive Information */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-6">
              <button
                onClick={() => {
                  sound.playClick(500, 0.03)
                  setActiveTab('benefits')
                }}
                className={`text-xs uppercase tracking-wider font-semibold py-1.5 px-3 rounded-lg transition-all ${
                  activeTab === 'benefits'
                    ? 'bg-white/10 text-white'
                    : 'text-[#8a7e73] hover:text-[#f4ece1]'
                }`}
              >
                Key Features
              </button>
              <button
                onClick={() => {
                  sound.playClick(550, 0.03)
                  setActiveTab('sensory')
                }}
                className={`text-xs uppercase tracking-wider font-semibold py-1.5 px-3 rounded-lg transition-all ${
                  activeTab === 'sensory'
                    ? 'bg-white/10 text-white'
                    : 'text-[#8a7e73] hover:text-[#f4ece1]'
                }`}
              >
                Sensory Profile
              </button>
              <button
                onClick={() => {
                  sound.playClick(600, 0.03)
                  setActiveTab('ingredients')
                }}
                className={`text-xs uppercase tracking-wider font-semibold py-1.5 px-3 rounded-lg transition-all ${
                  activeTab === 'ingredients'
                    ? 'bg-white/10 text-white'
                    : 'text-[#8a7e73] hover:text-[#f4ece1]'
                }`}
              >
                Ingredients
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[160px] mb-8">
              {activeTab === 'benefits' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#b5a79a]">
                  {product.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: product.accentColor }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'sensory' && (
                <div className="grid grid-cols-2 gap-4">
                  {product.sensoryNotes.map((note, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-[#dcd0bf]">
                        <span>{note.name}</span>
                        <span className="font-mono text-[#8a7e73]">{note.score}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${note.score}%`,
                            backgroundColor: product.accentColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#dcd0bf]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Primary CTA Deck */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-serif text-[#f4ece1]">
                    ₹{product.price}
                  </span>
                  <span className="text-sm line-through text-[#8a7e73]">
                    ₹{product.originalPrice}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${product.accentColor}25`,
                      color: product.accentColor,
                    }}
                  >
                    SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
                <span className="text-[11px] text-[#a89b8d] mt-0.5">
                  Tax included · Ships in 24 hours
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick(600, 0.04)
                    onJumpToRitual(product.id)
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#dcd0bf] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span>Brew Ritual</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#0c0806] shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: product.accentColor }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Stage with Real-time 3D Pack & 3D Instanced Particles */}
          <div className="lg:col-span-6 relative flex items-center justify-center order-1 lg:order-2">
            {/* Ambient Radial Spotlight */}
            <div
              className="absolute w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none opacity-20 -z-10"
              style={{ backgroundColor: product.accentColor }}
            />

            {/* 3D Instanced World Particles (Grains / Leaves / Beans) */}
            <InstancedWorldParticles
              type={product.particleType}
              accentColor={product.accentColor}
            />

            {/* 3D Pack Interactive Stage */}
            <div className="w-full relative z-20">
              <InteractivePack3D
                product={product}
                onQuickInspect={() => onQuickInspect(product)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
