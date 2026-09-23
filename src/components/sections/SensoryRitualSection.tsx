import { useState, useEffect } from 'react'
import { GOMZI_PRODUCTS } from '../../data/gomziProducts'
import { sound } from '../../utils/soundEngine'
import { Sparkles, Timer, Play, Pause, RotateCcw, Thermometer, Check } from 'lucide-react'

interface SensoryRitualSectionProps {
  initialProductId?: 'tea' | 'mocha' | 'atta'
}

export function SensoryRitualSection({ initialProductId = 'tea' }: SensoryRitualSectionProps) {
  const [selectedRitual, setSelectedRitual] = useState<'tea' | 'mocha' | 'atta'>(initialProductId)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [timerSeconds, setTimerSeconds] = useState<number>(60)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)

  // Sync initial product if changed
  useEffect(() => {
    setSelectedRitual(initialProductId)
    setCurrentStep(0)
    setTimerSeconds(initialProductId === 'tea' ? 60 : initialProductId === 'mocha' ? 45 : 180)
    setIsTimerRunning(false)
  }, [initialProductId])

  const product = GOMZI_PRODUCTS.find((p) => p.id === selectedRitual) || GOMZI_PRODUCTS[1]

  // Master ritual recipes & sensory guide
  const ritualGuides = {
    tea: {
      title: 'The 60-Second Kadak Chai Bloom',
      subtitle: 'Assam orthodox liquor, crushed cardamom & micro-whey froth',
      targetTemp: '85°C – 90°C Hot Water',
      totalSeconds: 60,
      steps: [
        {
          num: '01',
          name: 'The Sachet Release',
          tag: 'AROMA RELEASE',
          action: 'Tear along the notched foil seal into your favourite ceramic cup or clay kullad.',
          notes: 'Inhale immediate sun-dried green cardamom and warm ginger terpenes before pouring.',
          detailTip: 'No boiling saucepan needed — whole spices are cryogenically micro-pulverized.',
        },
        {
          num: '02',
          name: 'The 85°C Thermal Bloom',
          tag: 'WATER INFUSION',
          action: 'Pour 120ml to 140ml of freshly boiled water (ideal temperature 85°C – 90°C).',
          notes: 'Watch the micro-whey emulsion froth instantly into a golden-amber kadak liquor.',
          detailTip: 'Pour in a slow circular swirl to aerate the liquor and activate natural tea foam.',
        },
        {
          num: '03',
          name: 'The 8-Second Stir & Savor',
          tag: 'HOMOGENIZATION',
          action: 'Stir briskly for 8 seconds until completely velvety and smooth.',
          notes: 'Experience rich Indian tapri chai soul paired with 3.5g of clean athletic protein.',
          detailTip: 'Pairs impeccably with roasted almonds or warm multigrain roti.',
        },
      ],
    },
    mocha: {
      title: 'The Velvet Hot & Iced Mocha Protocol',
      subtitle: 'Single-estate Arabica, Dutch alkalized cocoa & zero clumps',
      targetTemp: 'Ice Cold Milk OR 80°C Steaming Milk',
      totalSeconds: 45,
      steps: [
        {
          num: '01',
          name: 'Liquid Architecture',
          tag: 'HOT OR ICED BASE',
          action: 'Pour 160ml hot oat/dairy milk OR fill a tall tumbler with ice and chilled milk.',
          notes: 'Engineered with cold-dispersible whey isolate that dissolves without shaker grates.',
          detailTip: 'For a richer dessert profile, use 50% almond milk and 50% full-cream milk.',
        },
        {
          num: '02',
          name: 'The Dutch Cocoa Dispersion',
          tag: 'SACHET EMPTY',
          action: 'Empty one full 14g sachet across the liquid surface.',
          notes: 'Deep dark cocoa notes emerge immediately as the Arabica micro-grounds hit the liquid.',
          detailTip: 'Contains alkalized Dutch cocoa with high cardiovascular polyphenols and zero chalkiness.',
        },
        {
          num: '03',
          name: 'The 12-Second Crema Froth',
          tag: 'VELVET EMULSION',
          action: 'Whisk with a handheld frother or shake in a bottle for 12 seconds.',
          notes: 'Yields a thick, café-grade velvet micro-foam with 5.0g bio-available protein energy.',
          detailTip: 'Dust lightly with cinnamon powder for a seasonal barista finish.',
        },
      ],
    },
    atta: {
      title: 'The Golden Multigrain Kneading Ritual',
      subtitle: '7 stone-milled grains, hydrolyzed whey & fluffy puffed rotis',
      targetTemp: 'Lukewarm Water (40°C)',
      totalSeconds: 180,
      steps: [
        {
          num: '01',
          name: 'Measure & Oxygenate',
          tag: 'DRY FLOUR PREP',
          action: 'Measure 2 cups of Gomzi Protein Atta into a wide brass or wooden parat.',
          notes: 'Notice the speckled whole-grain bran layers and nutty stone-ground aroma.',
          detailTip: 'Add 1/2 tsp roasted cumin or ajwain seeds for traditional digestive warmth.',
        },
        {
          num: '02',
          name: 'Warm Water Knead & Hydrate',
          tag: 'PROTEIN HYDRATION',
          action: 'Add lukewarm water gradually. Knead with your palms for 3 to 4 minutes.',
          notes: 'Lukewarm water relaxes the natural gluten and allows whey peptides to bind smoothly.',
          detailTip: 'Cover the dough with a damp muslin cloth for 10 minutes to lock in moisture.',
        },
        {
          num: '03',
          name: 'Cast-Iron Tawa Balloon Puff',
          tag: 'GOLDEN FLAME PUFF',
          action: 'Roll thin with light pressure and place on a smoking hot iron tawa.',
          notes: 'Flip once brown freckles appear, then transfer to direct flame for a complete balloon puff.',
          detailTip: 'Brush with hot A2 cow ghee and serve immediately. Stays soft for up to 8 hours.',
        },
      ],
    },
  }[selectedRitual]

  // Timer countdown logic
  useEffect(() => {
    let interval: any
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1)
      }, 1000)
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false)
      sound.playChime(880, 0.4)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
    if (index === 1) {
      sound.playSteamHiss(0.4)
    } else {
      sound.playClick(520 + index * 60, 0.04)
    }
  }

  const handleRitualSelect = (id: 'tea' | 'mocha' | 'atta') => {
    sound.playClick(480, 0.03)
    setSelectedRitual(id)
    setCurrentStep(0)
    setTimerSeconds(id === 'tea' ? 60 : id === 'mocha' ? 45 : 180)
    setIsTimerRunning(false)
  }

  const toggleTimer = () => {
    if (!isTimerRunning && timerSeconds === 0) {
      setTimerSeconds(selectedRitual === 'tea' ? 60 : selectedRitual === 'mocha' ? 45 : 180)
    }
    sound.playClick(isTimerRunning ? 440 : 660, 0.04)
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(selectedRitual === 'tea' ? 60 : selectedRitual === 'mocha' ? 45 : 180)
    sound.playClick(400, 0.03)
  }

  const progressPercent = Math.min(
    100,
    Math.max(0, ((ritualGuides.totalSeconds - timerSeconds) / ritualGuides.totalSeconds) * 100)
  )

  return (
    <section
      id="sensory-ritual"
      className="relative py-24 sm:py-32 bg-[#140d09] text-[#f4ece1] overflow-hidden scroll-mt-24 border-t border-[#8c5a36]/30 select-none"
    >
      {/* Dynamic Background Atmosphere */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[800px] h-[550px] rounded-full blur-[200px] pointer-events-none opacity-20 transition-all duration-1000 -z-10"
        style={{ backgroundColor: product.accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#cbb0940a_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#241710] border border-[#8c5a36]/40 text-xs font-semibold text-[#f7efe6] mb-5 backdrop-blur-md shadow-md">
            <Sparkles className="w-4 h-4 text-[#E9B964]" />
            <span className="font-mono uppercase tracking-[0.25em] text-[11px] text-[#E9B964]">
              MINDFUL CULINARY RITUAL
            </span>
          </div>

          <h2
            className="text-4xl sm:text-6xl font-black text-[#f7efe6] tracking-tight mb-4 leading-[1.08]"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Mastering the <br />
            <span
              className="transition-colors duration-700 italic font-light underline decoration-[#8c5a36]/50 decoration-2 underline-offset-8"
              style={{ color: product.accentColor }}
            >
              daily sensory craft.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#cbb094] leading-relaxed max-w-2xl font-sans">
            Designed to integrate effortlessly into your morning routine. Three mindful steps to unlock authentic kadak aroma, silky micro-crema, and golden balloon puffs.
          </p>
        </div>

        {/* Product Ritual Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-full bg-[#221610]/80 border border-[#8c5a36]/35 backdrop-blur-2xl shadow-xl max-w-xl mx-auto mb-12 sm:mb-16">
          {(['tea', 'mocha', 'atta'] as const).map((id) => {
            const active = selectedRitual === id
            const p = GOMZI_PRODUCTS.find((item) => item.id === id)!
            return (
              <button
                key={id}
                onClick={() => handleRitualSelect(id)}
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

        {/* Master Showcase Layout: Pedestal & Interactive Timer Dial (Left) + 3 Ritual Steps (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Floating Product Pack on Illuminated Warm Pedestal with Sensory Timer */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#241710] to-[#18100b] border border-[#8c5a36]/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Ambient Radial Spotlight */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-30 transition-all duration-1000"
              style={{ backgroundColor: product.accentColor }}
            />

            {/* Header: Title & Ideal Temperature Guide */}
            <div className="relative z-10 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#E9B964] px-3 py-1 rounded-full bg-[#E9B964]/10 border border-[#E9B964]/30 block w-fit mb-2">
                {product.size}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#f7efe6] mb-1">
                {ritualGuides.title}
              </h3>
              <p className="text-xs text-[#cbb094]">
                {ritualGuides.subtitle}
              </p>
            </div>

            {/* Central Realistic Product Showcase with Subtle Floating Animation */}
            <div className="relative z-10 my-4 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[190px] sm:w-[220px] h-auto max-h-[260px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] transition-transform duration-700 hover:scale-105"
                />

                {/* Warm Illuminated Pedestal Ring */}
                <div
                  className="w-44 h-5 rounded-full blur-md -mt-1 transition-all duration-700 opacity-80"
                  style={{ backgroundColor: `${product.accentColor}50` }}
                />

                {/* Target Temperature / Ratio Pill */}
                <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b120c]/90 border border-[#8c5a36]/40 text-xs font-mono text-[#f7efe6] backdrop-blur-md shadow-lg">
                  <Thermometer className="w-3.5 h-3.5 text-[#E9B964]" />
                  <span>{ritualGuides.targetTemp}</span>
                </div>
              </div>
            </div>

            {/* Live Sensory Stopwatch & Countdown Dial */}
            <div className="relative z-10 pt-5 border-t border-[#8c5a36]/30 flex items-center justify-between gap-4">
              {/* Circular Mini Dial */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#8c5a36"
                      strokeWidth="3"
                      fill="transparent"
                      strokeOpacity="0.25"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke={product.accentColor}
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <Timer className="w-4 h-4 text-[#f7efe6] absolute" />
                </div>

                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#f7efe6]">
                    {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                    {String(timerSeconds % 60).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[10px] text-[#a68a6f] uppercase tracking-wider block">
                    {isTimerRunning ? 'Infusing in Real Time...' : 'Sensory Brew Timer'}
                  </span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTimer}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-[#120b08] shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ backgroundColor: product.accentColor }}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                </button>

                <button
                  onClick={resetTimer}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#cbb094] hover:text-white transition-colors cursor-pointer border border-[#8c5a36]/30"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Interactive Ritual Step Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E9B964] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                STEP-BY-STEP PREPARATION JOURNEY
              </span>
              <span className="font-mono text-[11px] text-[#a68a6f]">
                Active Step {currentStep + 1} of 3
              </span>
            </div>

            {ritualGuides.steps.map((step, idx) => {
              const isActive = currentStep === idx
              return (
                <div
                  key={step.num}
                  onClick={() => handleStepClick(idx)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#221610] border-[#E9B964]/60 shadow-[0_12px_32px_rgba(0,0,0,0.5)] scale-[1.01]'
                      : 'bg-[#18110c]/80 border-[#8c5a36]/25 hover:border-[#8c5a36]/50 hover:bg-[#1e130e]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span
                        className={`flex items-center justify-center w-9 h-9 rounded-full font-mono text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#E9B964] text-[#120b08] shadow-md scale-110'
                            : 'bg-white/5 text-[#cbb094]'
                        }`}
                      >
                        {step.num}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg sm:text-xl font-bold text-[#f7efe6]">
                            {step.name}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#E9B964] border border-[#E9B964]/30">
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#ede2d3] mt-1 font-sans">
                          {step.action}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Sensory Notes When Active */}
                  {isActive && (
                    <div className="mt-4 pt-3.5 border-t border-[#8c5a36]/25 animate-fadeIn space-y-2">
                      <div className="flex items-start gap-2 text-xs text-[#cbb094]">
                        <span className="font-mono text-[10px] font-bold text-[#E9B964] uppercase tracking-wider shrink-0 mt-0.5">
                          SENSORY NOTE:
                        </span>
                        <span>{step.notes}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-[#d8bca0] bg-[#170f0a]/60 p-2.5 rounded-xl border border-[#8c5a36]/20">
                        <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 mt-0.5">
                          CHEF TIP:
                        </span>
                        <span>{step.detailTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Bottom Culinary Guarantee Strip */}
            <div className="p-4 rounded-2xl bg-[#1b120c] border border-[#8c5a36]/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs text-[#cbb094]">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero Clumping · 100% Native Dissolution</span>
              </div>
              <span className="font-mono text-[11px] text-[#E9B964]">
                AUTHENTIC INDIAN TASTE GUARANTEE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
