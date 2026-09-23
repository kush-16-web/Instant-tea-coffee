import { useEffect, useRef } from 'react'

export interface MousePos {
  x: number // -1 to 1
  y: number // -1 to 1
  rawX: number
  rawY: number
}

export function useMouseParallax(damping = 0.08) {
  const target = useRef<MousePos>({ x: 0, y: 0, rawX: 0, rawY: 0 })
  const current = useRef<MousePos>({ x: 0, y: 0, rawX: 0, rawY: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      target.current.rawX = e.clientX
      target.current.rawY = e.clientY
      target.current.x = (e.clientX / innerWidth) * 2 - 1
      target.current.y = -((e.clientY / innerHeight) * 2 - 1)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const update = () => {
    current.current.x += (target.current.x - current.current.x) * damping
    current.current.y += (target.current.y - current.current.y) * damping
    current.current.rawX += (target.current.rawX - current.current.rawX) * damping
    current.current.rawY += (target.current.rawY - current.current.rawY) * damping
    return current.current
  }

  return { target, current, update }
}
