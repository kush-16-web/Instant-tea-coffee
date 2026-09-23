import { useState } from 'react'
import { GOMZI_PRODUCTS } from '../../data/gomziProducts'
import { sound } from '../../utils/soundEngine'
import { Microscope, Sparkles, ShieldCheck, Zap } from 'lucide-react'

export function NutritionLabSection() {
  const [selectedProduct, setSelectedProduct] = useState<'atta' | 'tea' | 'mocha'>('atta')
  const [activeStep, setActiveStep] = useState<number>(0)

  const product = GOMZI_PRODUCTS.find((p) => p.id === selectedProduct)!

  // Detailed 3-Step Bio-Active Science Pipeline tailored for each product
  const scienceData = {
    atta: {
      tagline: 'Stone-Milled Whole Grains · Micro-Whey Matrix',
      heroMetric: '18.5g',
      heroMetricLabel: 'Bio-Active Protein / 100g',
      heroAdvantage: '+89% Higher than regular wheat flour',
      steps: [
        {
          num: '01',
          name: 'Single-Origin 7-Grain Selection',
          subtitle: 'High-nitrogen Sharbati wheat, defatted soy, sprouted ragi & roasted oats',
          detail: 'Conventional flours strip away the fibrous germ and bran during industrial roller milling. We combine sun-ripened Sharbati wheat with 6 micro-milled supergrains, achieving complete essential amino acid profile (EAA).',
          metric: '100% Whole Bran Preserved',
          badge: 'NATIVE PROVENANCE',
        },
        {
          num: '02',
          name: 'Cold-Frictional Stone Chakki Milling',
          subtitle: 'Slow rotational stone grinding under 42°C',
          detail: 'High-speed industrial rollers generate frictional heat exceeding 85°C, denaturing wheat proteins and oxidizing natural oils. Our cold stone chakki preserves living Vitamin E, delicate zinc, and natural nutty grain sweetness.',
          metric: 'Zero Thermal Degradation',
          badge: 'HEAT-PROTECTED PROCESS',
        },
        {
          num: '03',
          name: 'Hydrolyzed Whey Micro-Homogenization',
          subtitle: 'Micro-homogenized protein peptides for fluffy soft rotis',
          detail: 'Pure dairy whey isolate is micro-homogenized with the flour particles at molecular level. When kneaded with warm water, gluten strands bind seamlessly with whey peptides, allowing rotis to puff golden soft with no chalky aftertaste.',
          metric: '18.5g Bioavailable Protein',
          badge: 'CLINICAL FORMULATION',
        },
      ],
      comparison: [
        { metric: 'Protein / 100g', gomzi: '18.5 g', standard: '9.8 g', lift: '+89% Advantage' },
        { metric: 'Dietary Fiber', gomzi: '9.2 g', standard: '3.4 g', lift: '+171% Advantage' },
        { metric: 'Added Preservatives', gomzi: '0%', standard: 'Chemical Bleach', lift: 'Purity Standard' },
        { metric: 'Glycemic Impact', gomzi: 'Low GI Satiety', standard: 'High Spike', lift: 'Sustained Energy' },
      ],
    },
    tea: {
      tagline: 'Royal Assam Flush · 5 Sun-Dried Ayurvedic Spices',
      heroMetric: '3.5g',
      heroMetricLabel: 'Clean Protein / 14g Serving',
      heroAdvantage: '9x Higher protein than commercial tea sachets',
      steps: [
        {
          num: '01',
          name: 'Estate-Selected Upper Assam CTC',
          subtitle: 'First-flush orthodox black tea granules with intense malty liquor',
          detail: 'Hand-picked from biodynamic gardens in Upper Assam during peak second flush. Rich in theaflavins and thearubigins that provide brisk Indian tapri astringency and sustained mental clarity without nervous jitters.',
          metric: 'Single-Estate Assam Harvest',
          badge: 'BOTANICAL PURITY',
        },
        {
          num: '02',
          name: 'Cryogenic Spiced Crushing',
          subtitle: 'Malabar ginger, Idukki green cardamom, Ceylon cinnamon, clove & pepper',
          detail: 'Conventional tea powders use synthetic liquid flavor oils that evaporate with boiling water. We cryogenically pulverize five whole raw Ayurvedic botanicals so active gingerols, cineole, and essential terpenes dissolve instantaneously.',
          metric: '5 Whole Sacred Spices',
          badge: 'COLD-CRUSHED OILS',
        },
        {
          num: '03',
          name: 'Instant Crema Micro-Dispersion',
          subtitle: 'Instant hot-water froth without separate boiling milk',
          detail: 'Engineered with cold-microfiltered whey that instantly blooms into a creamy kadak decoction in 85°C water. Just pour hot water and stir for 8 seconds to experience highway chai-stall body with functional athletic recovery.',
          metric: '3.5g Clean Recovery Protein',
          badge: 'INSTANT BLOOM TECH',
        },
      ],
      comparison: [
        { metric: 'Bioavailable Protein', gomzi: '3.5 g', standard: '0.4 g', lift: '+775% Advantage' },
        { metric: 'Refined Sugar', gomzi: '4.8 g (Botanical)', standard: '12.0 g (Syrup)', lift: '60% Less Sugar' },
        { metric: 'Whole Spices', gomzi: '5 Raw Botanicals', standard: 'Artificial Essence', lift: 'Pure Harvest' },
        { metric: 'Preparation Speed', gomzi: '60 Seconds', standard: '10 Mins Pan Boil', lift: 'Zero Pan Clutter' },
      ],
    },
    mocha: {
      tagline: 'Single-Estate Arabica · Alkalized Dutch Cocoa',
      heroMetric: '5.0g',
      heroMetricLabel: 'Whey Protein / 14g Serving',
      heroAdvantage: '8x Higher protein than conventional coffee mix',
      steps: [
        {
          num: '01',
          name: 'Chikmagalur Shade-Grown Arabica',
          subtitle: 'Slow-roasted high-elevation beans from Western Ghats estates',
          detail: 'Cultivated under wild silver oak canopies at 1,200m elevation. Micro-roasted to medium-dark perfection to amplify caramelized chocolate and hazelnut undertones while stripping harsh burnt bitterness.',
          metric: 'Single-Estate Arabica Beans',
          badge: 'SHADE-GROWN ROAST',
        },
        {
          num: '02',
          name: 'Dutch Alkalized Cocoa Fusion',
          subtitle: '100% pure unsweetened cocoa with rich polyphenols',
          detail: 'Alkalized Dutch cocoa provides a velvety, round bittersweet depth packed with cardiovascular flavonoids and magnesium. Blends in perfect harmony with Arabica caffeine for smooth, jitter-free focus.',
          metric: 'Dark Dutch Cocoa Core',
          badge: 'POLYPHENOL DENSITY',
        },
        {
          num: '03',
          name: 'Dual Hot & Cold Ultra-Solubility',
          subtitle: 'Zero clumps in ice-cold milk or steaming water',
          detail: 'Specialized enzymatic peptide processing guarantees instant dispersion. Dissolves seamlessly in cold milk over ice for an iced protein latte, or in hot water for a steaming café mocha with thick velvet crema.',
          metric: '5.0g Pure Whey Peptides',
          badge: 'COLD-SOLUBLE MATRIX',
        },
      ],
      comparison: [
        { metric: 'Protein per Cup', gomzi: '5.0 g', standard: '0.6 g', lift: '+733% Advantage' },
        { metric: 'Added Cane Sugar', gomzi: '4.2 g', standard: '14.5 g', lift: '71% Less Sugar' },
        { metric: 'Dissolution Speed', gomzi: 'Instant in Cold & Hot', standard: 'Clumps in Cold', lift: 'Ultra-Soluble' },
        { metric: 'Caffeine Smoothness', gomzi: 'L-Theanine Balanced', standard: 'Harsh Spike', lift: 'Zero Afternoon Crash' },
      ],
    },
  }[selectedProduct]

  return (
    <section
      id="nutrition-lab"
      className="relative py-24 sm:py-32 bg-[#120b08] text-[#f4ece1] overflow-hidden scroll-mt-24 border-t border-[#8c5a36]/30 select-none"
    >
      {/* Ambient Milk-Coffee & Oat Cream Radial Glows */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[200px] pointer-events-none opacity-25 transition-all duration-1000 -z-10"
        style={{ backgroundColor: product.accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#cbb0940a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        {/* Section Header: Editorial & Prestigious */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241710] border border-[#8c5a36]/40 text-xs font-semibold text-[#f7efe6] mb-5 backdrop-blur-md shadow-md">
            <Microscope className="w-4 h-4 text-[#E9B964]" />
            <span className="font-mono uppercase tracking-[0.25em] text-[11px] text-[#E9B964]">
              MOLECULAR SCIENCE · EXTRACTION LAB
            </span>
          </div>

          <h2
            className="text-4xl sm:text-6xl font-black text-[#f7efe6] tracking-tight mb-4 leading-[1.08]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Real food, re-engineered <br />
            <span
              className="transition-colors duration-700 italic font-light underline decoration-[#8c5a36]/50 decoration-2 underline-offset-8"
              style={{ color: product.accentColor }}
            >
              with clinical precision.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#cbb094] leading-relaxed max-w-2xl font-sans">
            Every Gomzi staple bridges culinary heritage with athletic protein science. No artificial fillers, zero chalkiness — just pure, bioavailable daily nourishment.
          </p>
        </div>

        {/* Product Selector Deck (Warm Milk Coffee & Latte Glass) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-full bg-[#221610]/80 border border-[#8c5a36]/35 backdrop-blur-2xl shadow-xl max-w-xl mx-auto mb-12 sm:mb-16">
          {(['atta', 'tea', 'mocha'] as const).map((id) => {
            const active = selectedProduct === id
            const p = GOMZI_PRODUCTS.find((item) => item.id === id)!
            return (
              <button
                key={id}
                onClick={() => {
                  sound.playClick(520, 0.03)
                  setSelectedProduct(id)
                  setActiveStep(0)
                }}
                className={`flex items-center gap-2.5 px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#E9B964] via-[#dfad5a] to-[#d4a373] text-[#120b08] shadow-lg scale-105 font-black'
                    : 'text-[#cbb094] hover:text-[#f7efe6] hover:bg-white/5'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? '#120b08' : p.accentColor }}
                />
                <span>{p.nav}</span>
              </button>
            )
          })}
        </div>

        {/* Core Showcase Stage: 3D Product Perspective (Left) + 3-Step Science Pipeline (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Rich Product Pack Showcase with Dynamic Halo & Botanical SVG */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#241710] to-[#18100b] border border-[#8c5a36]/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group">
            {/* Ambient Back Glow */}
            <div
              className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-30 transition-all duration-1000"
              style={{ backgroundColor: product.accentColor }}
            />

            {/* Top Tag & Hero Metric */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#E9B964] px-3 py-1 rounded-full bg-[#E9B964]/10 border border-[#E9B964]/30">
                  {scienceData.tagline}
                </span>
                <span className="font-mono text-xs text-[#a68a6f]">
                  {product.size}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-4xl sm:text-5xl font-black font-serif tracking-tight"
                  style={{ color: product.accentColor }}
                >
                  {scienceData.heroMetric}
                </span>
                <span className="text-sm font-mono text-[#cbb094]">
                  {scienceData.heroMetricLabel}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {scienceData.heroAdvantage}
              </p>
            </div>

            {/* Central Realistic Pack Presentation with Soft Levitation */}
            <div className="relative z-10 my-6 flex items-center justify-center">
              {/* Decorative Botanical SVG Accent Behind Pack */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                {product.id === 'atta' ? (
                  <svg viewBox="0 0 200 200" className="w-56 h-56 text-[#E9B964] stroke-current fill-none stroke-[1.5]">
                    <path d="M100 20 C100 60, 60 90, 60 140 C60 170, 80 185, 100 185 C120 185, 140 170, 140 140 C140 90, 100 60, 100 20 Z" />
                    <line x1="100" y1="20" x2="100" y2="185" strokeDasharray="3 3" />
                    <circle cx="85" cy="80" r="10" />
                    <circle cx="115" cy="110" r="10" />
                    <circle cx="85" cy="140" r="10" />
                  </svg>
                ) : product.id === 'tea' ? (
                  <svg viewBox="0 0 200 200" className="w-56 h-56 text-[#99D354] stroke-current fill-none stroke-[1.5]">
                    <path d="M40 160 C70 120, 90 70, 160 40 C140 100, 100 140, 40 160 Z" />
                    <line x1="40" y1="160" x2="160" y2="40" />
                    <path d="M75 130 C90 120, 110 115, 130 115" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 200 200" className="w-56 h-56 text-[#D48B47] stroke-current fill-none stroke-[1.5]">
                    <ellipse cx="100" cy="100" rx="60" ry="80" transform="rotate(-25 100 100)" />
                    <path d="M85 30 Q115 100 85 170" strokeWidth="2.5" />
                  </svg>
                )}
              </div>

              {/* Real Product Pack Image with Warm Ambient Floor Shadow */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[200px] sm:w-[240px] h-auto max-h-[300px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2"
                />
                <div
                  className="w-36 h-4 mx-auto rounded-full blur-md mt-2 transition-all duration-700 group-hover:scale-110 opacity-70"
                  style={{ backgroundColor: `${product.accentColor}40` }}
                />
              </div>
            </div>

            {/* Bottom Proof Badges */}
            <div className="relative z-10 pt-4 border-t border-[#8c5a36]/30 grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-black/30 border border-white/5">
                <span className="font-mono text-[10px] text-[#cbb094] block uppercase">Tested By</span>
                <span className="font-serif text-xs font-bold text-[#f7efe6]">NABL Certified Lab</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/30 border border-white/5">
                <span className="font-mono text-[10px] text-[#cbb094] block uppercase">Purity Formula</span>
                <span className="font-serif text-xs font-bold text-[#f7efe6]">100% Vegetarian</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Stage Bio-Extraction Pipeline + Luxury Macro Comparison */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* 3 Step Interactive Process Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E9B964] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  THE 3-PHASE BIO-EXTRACTION PIPELINE
                </span>
                <span className="font-mono text-[11px] text-[#a68a6f]">
                  Step {activeStep + 1} of 3
                </span>
              </div>

              {scienceData.steps.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <div
                    key={step.num}
                    onClick={() => {
                      sound.playClick(540 + idx * 40, 0.03)
                      setActiveStep(idx)
                    }}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#221610] border-[#E9B964]/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-[1.01]'
                        : 'bg-[#18110c]/80 border-[#8c5a36]/25 hover:border-[#8c5a36]/50 hover:bg-[#1f140e]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-[#E9B964] text-[#120b08] shadow-md'
                              : 'bg-white/5 text-[#cbb094]'
                          }`}
                        >
                          {step.num}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base sm:text-lg font-bold text-[#f7efe6]">
                              {step.name}
                            </span>
                            <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#E9B964] border border-[#E9B964]/30">
                              {step.badge}
                            </span>
                          </div>
                          <span className="text-xs text-[#cbb094] block mt-0.5">
                            {step.subtitle}
                          </span>
                        </div>
                      </div>

                      <span
                        className="font-mono text-xs font-bold whitespace-nowrap hidden sm:inline"
                        style={{ color: isActive ? product.accentColor : '#a68a6f' }}
                      >
                        {step.metric}
                      </span>
                    </div>

                    {/* Expanded Detail When Active */}
                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-[#8c5a36]/25 animate-fadeIn">
                        <p className="text-xs sm:text-sm text-[#ede2d3] leading-relaxed font-sans">
                          {step.detail}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Editorial Macro Comparison Deck (No generic progress bars!) */}
            <div className="rounded-3xl bg-[#1b120c] border border-[#8c5a36]/35 p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#8c5a36]/25">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#f7efe6] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  AUTHENTIC LAB BENCHMARK VS MARKET STANDARD
                </span>
                <span className="font-mono text-[10px] text-[#a68a6f]">
                  Per 100g / Cup
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {scienceData.comparison.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#241710]/70 border border-[#8c5a36]/25 flex flex-col justify-between"
                  >
                    <span className="font-mono text-[10px] text-[#cbb094] block mb-1">
                      {item.metric}
                    </span>
                    <div>
                      <div
                        className="text-lg sm:text-xl font-bold font-serif"
                        style={{ color: product.accentColor }}
                      >
                        {item.gomzi}
                      </div>
                      <div className="text-[11px] text-[#8a7664] line-through font-mono mt-0.5">
                        {item.standard}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 mt-2 block">
                      {item.lift}
                    </span>
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
