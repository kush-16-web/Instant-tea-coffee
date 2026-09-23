import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

/**
 * SCRUB — scroll-driven choreography without re-renders.
 * Tall wrapper + sticky stage; one rAF loop writes SVG attributes directly
 * (transform / opacity / dashoffset / fill). Discrete captions use a
 * deduped step state so React only re-renders on step changes.
 */

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** Smooth segment: 0 before a, eased 0→1 across a→b, 1 after b. */
export const seg = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Hex colour lerp for liquid morphs. */
export function lerpColor(from: string, to: string, t: number): string {
  const a = parseInt(from.slice(1), 16)
  const b = parseInt(to.slice(1), 16)
  const r = Math.round(((a >> 16) & 255) + ((((b >> 16) & 255) - ((a >> 16) & 255)) * t))
  const g = Math.round(((a >> 8) & 255) + ((((b >> 8) & 255) - ((a >> 8) & 255)) * t))
  const bl = Math.round((a & 255) + (((b & 255) - (a & 255)) * t))
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`
}

export function useScrub(ref: RefObject<HTMLDivElement | null>, fn: (p: number) => void) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fnRef.current(1)
      return
    }
    let raf = 0
    let last = -1
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const r = el.getBoundingClientRect()
      // skip work while fully out of view
      if (r.bottom < -window.innerHeight || r.top > window.innerHeight * 2) return
      const total = el.offsetHeight - window.innerHeight
      const p = total <= 0 ? 0 : clamp01(-r.top / total)
      if (Math.abs(p - last) < 0.0004) return
      last = p
      fnRef.current(p)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [ref])
}

/** Tall scroll wrapper with a sticky full-screen stage. */
export function Stage({
  children,
  length = '400vh',
  className = '',
  stageRef,
  id,
}: {
  children: ReactNode
  length?: string
  className?: string
  stageRef?: RefObject<HTMLDivElement | null>
  id?: string
}) {
  return (
    <div id={id} ref={stageRef} className={`relative ${className}`} style={{ height: length }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">{children}</div>
    </div>
  )
}

/** setAttribute helpers (null-safe, cheap). */
export const setT = (el: SVGGElement | null, x: number, y: number, s = 1, r = 0) => {
  el?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${r ? ` rotate(${r.toFixed(1)})` : ''}${s !== 1 ? ` scale(${s.toFixed(3)})` : ''}`)
}
export const setO = (el: Element | null, o: number) => {
  el?.setAttribute('opacity', o.toFixed(3))
}
