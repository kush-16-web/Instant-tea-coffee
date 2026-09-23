import { useEffect } from 'react'

export interface ToastItem {
  id: string
  note: string
  x: number
  y: number
}

interface FlavorToastProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function FlavorToast({ toasts, onDismiss }: FlavorToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id)
    }, 1800)
    return () => clearTimeout(timer)
  }, [toasts, onDismiss])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500 animate-in fade-in zoom-in-95"
          style={{ left: t.x, top: t.y }}
        >
          <div className="flex items-center gap-2 rounded-full border border-[#c67d3b]/50 bg-[#160e0a]/90 px-4 py-2 shadow-2xl backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#c67d3b] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f4ece1] font-semibold">
              {t.note}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
