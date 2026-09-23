import { useState, useEffect } from 'react'
import { logoImg } from '../../data/gomziProducts'
import gsap from 'gsap'

interface CiaoenergyLoaderProps {
  onComplete: () => void
  accentColor?: string
}

export function CiaoenergyLoader({ onComplete, accentColor = '#E9B964' }: CiaoenergyLoaderProps) {
  const [percent, setPercent] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const duration = 1400 // 1.4s punchy loader like ciaoenergy.com
    const startTime = performance.now()

    const updateCounter = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const currentPct = Math.floor(progress * 100)
      setPercent(currentPct)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        setPercent(100)
        setTimeout(() => {
          // Smooth Ciaoenergy-style scale & fade exit
          gsap.to('#ciao-loader', {
            opacity: 0,
            scale: 1.08,
            filter: 'blur(10px)',
            duration: 0.65,
            ease: 'power3.inOut',
            onComplete: () => {
              setIsFinished(true)
              onComplete()
            },
          })
        }, 150)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [onComplete])

  if (isFinished) return null

  return (
    <div
      id="ciao-loader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0a0705] p-8 text-[#f4ece1] select-none"
    >
      {/* Top Brand Micro Header */}
      <div className="flex w-full max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-[#dcd0bf]/60">
        <span>GOMZI LIFE SCIENCE</span>
        <span>BIO-ACTIVE NUTRITION</span>
      </div>

      {/* Center Hero Logo Emblem with Progressive Liquid Color Fill Animation */}
      <div className="flex flex-col items-center text-center my-auto">
        {/* Glowing Aura Ring */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full blur-[70px] opacity-50 transition-all duration-300"
            style={{
              backgroundColor: accentColor,
              transform: `scale(${0.7 + (percent / 100) * 0.6})`,
            }}
          />

          {/* Logo Frame with Dual-Layer Liquid Fill */}
          <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl border border-white/20 bg-[#160e0a]/95 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden p-5">
            {/* Background Base: Desaturated / Translucent Silhouette */}
            <img
              src={logoImg}
              alt="Gomzi Life Science"
              className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-contain opacity-25 filter grayscale"
            />

            {/* Foreground Fill: Vibrant Color Logo revealing from bottom to top */}
            <div
              className="absolute inset-5 overflow-hidden transition-all duration-100 ease-out"
              style={{
                clipPath: `inset(${100 - percent}% 0% 0% 0%)`,
              }}
            >
              <img
                src={logoImg}
                alt="Gomzi Life Science"
                className="h-full w-full object-contain filter drop-shadow-[0_0_15px_rgba(233,185,100,0.6)]"
              />
              {/* Liquid Meniscus Shimmer Line */}
              <div
                className="absolute left-0 right-0 h-[3px] bg-white shadow-[0_0_12px_#ffffff] -translate-y-1/2 opacity-90"
                style={{
                  top: '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Brand Typography */}
        <h1
          className="text-3xl sm:text-5xl font-black tracking-tight text-[#f4ece1] leading-none mb-3"
          style={{ fontFamily: "'Syne', 'Archivo', sans-serif" }}
        >
          GOMZI <span className="font-bold text-xs font-mono uppercase tracking-[0.35em] text-[#E9B964] block mt-1.5">LIFE SCIENCE</span>
        </h1>

        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#a89b8d] mb-6">
          Bio-Active Nutrition · Everyday Staples
        </p>

        {/* Clean Animated Numeric Percentage Counter */}
        <div className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-[#f4ece1]">
          {percent < 10 ? `0${percent}` : percent}
          <span className="text-xl sm:text-2xl text-[#E9B964] ml-1 font-mono font-normal">%</span>
        </div>

        {/* Micro Progress Bar */}
        <div className="mt-6 h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-all duration-75 ease-out rounded-full"
            style={{
              width: `${percent}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Bottom Certifications Tag */}
      <div className="font-mono text-[10px] tracking-[0.25em] text-[#7a6e63] uppercase">
        FSSAI Accredited · 18.5g Protein Engine · Stone Milled
      </div>
    </div>
  )
}
