import { useState, useEffect } from 'react'
import { logoImg } from '../../data/gomziProducts'
import gsap from 'gsap'

interface CiaoenergyLoaderProps {
  onComplete: () => void
  accentColor?: string
}

export function CiaoenergyLoader({ onComplete, accentColor = '#E9B964' }: CiaoenergyLoaderProps) {
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    // Subtle logo entrance & pulse, short duration (~750ms total)
    const tl = gsap.timeline({
      onComplete: () => {
        setIsFinished(true)
        onComplete()
      },
    })

    // Subtle fade in and breathing scale
    tl.fromTo(
      '#loader-logo',
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    )
      .to('#loader-logo', {
        scale: 1.04,
        duration: 0.35,
        ease: 'sine.inOut',
      })
      .to('#ciao-loader', {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (isFinished) return null

  return (
    <div
      id="ciao-loader"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0705] text-[#f4ece1] select-none pointer-events-none"
    >
      {/* Centered Brand Logo Only - Minimal, subtle aura pulse */}
      <div id="loader-logo" className="relative flex items-center justify-center">
        {/* Soft radial backdrop aura */}
        <div
          className="absolute w-36 h-36 rounded-full blur-[50px] opacity-35"
          style={{ backgroundColor: accentColor }}
        />
        {/* Crisp Logo */}
        <img
          src={logoImg}
          alt="Gomzi Life Science"
          className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
        />
      </div>
    </div>
  )
}
