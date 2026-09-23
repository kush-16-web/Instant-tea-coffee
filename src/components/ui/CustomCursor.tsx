import { useEffect, useState, useRef } from 'react'

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const [isGrab, setIsGrab] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const cursorDot = useRef<HTMLDivElement>(null)
  const cursorRing = useRef<HTMLDivElement>(null)
  const targetPos = useRef({ x: -100, y: -100 })
  const currentPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true)
      return
    }

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true)
      targetPos.current = { x: e.clientX, y: e.clientY }

      // Check cursor target style or interactive attributes
      const target = e.target as HTMLElement | null
      const computedCursor = target ? window.getComputedStyle(target).cursor : ''
      const isDraggable = computedCursor === 'grab' || computedCursor === 'grabbing' || target?.closest('[data-draggable="true"]')
      const isInteractive = target?.closest('button, a, input, select, [role="button"]')

      setIsGrab(Boolean(isDraggable))
      setIsHovered(Boolean(isInteractive) && !isDraggable)
    }

    const onMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    // Smooth spring loop for the trailing ring
    let animId: number
    const loop = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.18
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.18

      if (cursorDot.current && cursorRing.current) {
        cursorDot.current.style.transform = `translate3d(${targetPos.current.x}px, ${targetPos.current.y}px, 0)`
        cursorRing.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`
      }
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (isTouch || !isVisible) return null

  return (
    <>
      {/* Center Precise Dot */}
      <div
        ref={cursorDot}
        className="pointer-events-none fixed top-0 left-0 z-50 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#f4ece1] transition-transform duration-75"
      />

      {/* Fluid Trailing Ring */}
      <div
        ref={cursorRing}
        className={`pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center rounded-full border transition-all duration-200 ease-out ${
          isGrab
            ? '-ml-6 -mt-6 h-12 w-12 border-[#c67d3b] bg-[#c67d3b]/20 backdrop-blur-[2px]'
            : isHovered
            ? '-ml-5 -mt-5 h-10 w-10 border-[#e09f3e] bg-[#e09f3e]/10'
            : '-ml-3.5 -mt-3.5 h-7 w-7 border-[#f4ece1]/40'
        }`}
      >
        {isGrab && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#f4ece1]">
            DRAG
          </span>
        )}
      </div>
    </>
  )
}
