import { useState, useEffect } from 'react'
import gsap from 'gsap'

interface LoadingScreenProps {
  onComplete: () => void
}

const BREW_STEPS = [
  'GRINDING THE BEANS...',
  'HEATING THE WATER...',
  'MEASURING THE LEAVES...',
  'PREPARING THE CUP...',
  'BREWING...',
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let currentPct = 0
    const duration = 1800 // 1.8s smooth real load feel
    const startTime = performance.now()

    const updateCounter = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      currentPct = Math.floor(progress * 100)
      setPercent(currentPct)

      // Step indices (0 to 4)
      const sIdx = Math.min(BREW_STEPS.length - 1, Math.floor(progress * BREW_STEPS.length))
      setStepIdx(sIdx)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        setPercent(100)
        setTimeout(() => {
          // GSAP Exit animation
          gsap.to('#loading-screen', {
            opacity: 0,
            y: -40,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
              setIsFinished(true)
              onComplete()
            },
          })
        }, 300)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [onComplete])

  if (isFinished) return null

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0b0705] p-8 text-[#f4ece1] select-none"
    >
      {/* Top Brand Tag */}
      <div className="flex w-full max-w-6xl items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-[#c67d3b]/70">
        <span>ROAST & LEAF /</span>
        <span>CINEMATIC ARCHIVE 01</span>
      </div>

      {/* Center Narrative */}
      <div className="flex flex-col items-center text-center">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#c67d3b] mb-4 animate-pulse">
          PREPARING YOUR BREW
        </span>

        {/* Large Percentage */}
        <div className="font-serif text-8xl md:text-9xl font-light tracking-tight text-[#f4ece1] leading-none mb-6">
          {percent < 10 ? `0${percent}` : percent}
          <span className="text-3xl md:text-4xl text-[#c67d3b]/70 font-sans ml-1">%</span>
        </div>

        {/* Dynamic brewing message */}
        <div className="h-6 overflow-hidden">
          <p className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-[#b8a898] transition-all duration-300">
            {BREW_STEPS[stepIdx]}
          </p>
        </div>

        {/* Minimal Progress Bar Line */}
        <div className="mt-8 h-[2px] w-48 overflow-hidden rounded-full bg-[#26170e]">
          <div
            className="h-full bg-gradient-to-r from-[#c67d3b] to-[#e09f3e] transition-all duration-100 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="font-mono text-[10px] tracking-[0.25em] text-[#786a5d] uppercase">
        Specialty Coffee · Artisan Tea · Slow Extraction
      </div>
    </div>
  )
}
