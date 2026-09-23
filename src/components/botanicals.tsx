import { useId } from 'react'

/**
 * BOTANICALS — premium packaging-style vector ingredients.
 * Layered fills + ink linework + restrained shading. No flat-icon look.
 */

export const INK = '#2b1d12'
const OLIVE = '#6f7440'
const OLIVE_D = '#4c5028'

export function Cardamom({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a9bd7a" />
          <stop offset="0.55" stopColor="#c4d194" />
          <stop offset="1" stopColor="#8ba05e" />
        </linearGradient>
      </defs>
      {/* stem */}
      <path d="M60 10 C58 20 62 26 60 34" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {/* pod body */}
      <path
        d="M60 32 C88 44 96 84 82 118 C72 142 48 142 38 118 C24 84 32 44 60 32 Z"
        fill={`url(#${id}b)`}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* ridge linework */}
      <path d="M60 38 C56 66 56 98 60 128" stroke={INK} strokeWidth="2.5" opacity="0.55" />
      <path d="M46 48 C42 72 42 100 48 120" stroke={INK} strokeWidth="2" opacity="0.35" />
      <path d="M74 48 C78 72 78 100 72 120" stroke={INK} strokeWidth="2" opacity="0.35" />
      {/* highlight */}
      <path d="M50 52 C46 70 46 92 50 108" stroke="#f2f5e2" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* tip */}
      <path d="M52 132 C56 138 64 138 68 132" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Ginger({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 180 140" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4dfae" />
          <stop offset="1" stopColor="#e3b96f" />
        </linearGradient>
      </defs>
      {/* slice body */}
      <path
        d="M92 12 C128 14 160 40 158 76 C156 112 124 130 88 128 C52 126 22 108 22 74 C22 40 58 10 92 12 Z"
        fill={`url(#${id}s)`}
        stroke="#8a5a2e"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* skin edge */}
      <path
        d="M92 12 C128 14 160 40 158 76"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* flesh rings */}
      <path d="M90 34 C116 36 138 54 136 78 C134 102 112 114 88 112 C64 110 46 96 46 74 C46 52 66 32 90 34 Z" stroke="#b3813c" strokeWidth="2.5" opacity="0.8" />
      <path d="M88 54 C106 56 120 66 119 80 C118 94 104 102 88 101 C72 100 60 90 60 76 C60 64 72 52 88 54 Z" stroke="#b3813c" strokeWidth="2" opacity="0.6" />
      {/* fibre flecks */}
      <path d="M70 66 l10 -8 M104 88 l12 -6 M76 94 l8 8" stroke="#8a5a2e" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* juice shine */}
      <path d="M58 52 C54 60 54 70 58 78" stroke="#fffdf4" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}

export function Cinnamon({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5672f" />
          <stop offset="0.5" stopColor="#8a4b23" />
          <stop offset="1" stopColor="#6e3a18" />
        </linearGradient>
      </defs>
      {/* back quill */}
      <g transform="rotate(-8 100 60)">
        <rect x="18" y="46" width="164" height="30" rx="15" fill={`url(#${id}c)`} stroke={INK} strokeWidth="4" />
        <ellipse cx="182" cy="61" rx="9" ry="15" fill="#4e2812" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="182" cy="61" rx="4" ry="8" fill="#2e1608" />
        <path d="M30 54 H160 M30 68 H160" stroke="#d99a55" strokeWidth="2" opacity="0.5" />
      </g>
      {/* front quill */}
      <g transform="rotate(6 100 74)">
        <rect x="26" y="60" width="150" height="32" rx="16" fill={`url(#${id}c)`} stroke={INK} strokeWidth="4" />
        <ellipse cx="26" cy="76" rx="9" ry="16" fill="#4e2812" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="26" cy="76" rx="4" ry="9" fill="#2e1608" />
        <path d="M44 68 H162 M44 84 H162" stroke="#d99a55" strokeWidth="2" opacity="0.5" />
        <path d="M60 64 C80 62 120 62 150 64" stroke="#f0c084" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      </g>
      {/* bark curls */}
      <path d="M170 40 C176 34 184 34 187 40" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M36 100 C30 106 22 106 19 100" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function TeaLeaf({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 120 150" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b8f4e" />
          <stop offset="1" stopColor="#5c6032" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 C96 34 104 84 66 128 C60 135 52 135 46 128 C12 90 24 36 60 8 Z"
        fill={`url(#${id}l)`}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* centre vein */}
      <path d="M60 16 C62 56 60 96 56 126" stroke="#e8e4c8" strokeWidth="2.5" opacity="0.85" />
      {/* side veins */}
      <path d="M59 44 C48 40 38 36 30 28 M60 66 C49 62 39 58 31 50 M60 88 C50 84 42 80 34 72 M61 44 C72 40 82 36 90 28 M61 66 C72 62 82 58 89 50 M60 88 C70 84 78 80 86 72" stroke={INK} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      {/* stem */}
      <path d="M56 126 C54 134 52 140 48 146" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Clove({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 150" className={className} fill="none" aria-hidden>
      {/* stem */}
      <path d="M45 60 C44 90 46 116 45 142" stroke="#5c2f16" strokeWidth="9" strokeLinecap="round" />
      <path d="M45 60 C44 90 46 116 45 142" stroke={INK} strokeWidth="9" strokeLinecap="round" opacity="0.25" />
      {/* bud head */}
      <circle cx="45" cy="38" r="26" fill="#6e3a18" stroke={INK} strokeWidth="4" />
      <circle cx="45" cy="38" r="26" fill="none" stroke="#a5672f" strokeWidth="2" opacity="0.6" strokeDasharray="4 5" />
      {/* calyx star */}
      <path d="M45 12 L49 26 L63 26 L52 34 L56 48 L45 40 L34 48 L38 34 L27 26 L41 26 Z" fill="#8a4b23" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="37" cy="32" r="3" fill="#e8c48a" opacity="0.9" />
    </svg>
  )
}

export function MilkDrop({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 120" className={className} fill="none" aria-hidden>
      <path
        d="M45 8 C45 8 16 52 16 78 C16 96 29 108 45 108 C61 108 74 96 74 78 C74 52 45 8 45 8 Z"
        fill="#fffdf6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M32 74 C32 62 38 50 44 40" stroke="#d8cfae" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="36" cy="86" rx="6" ry="9" fill="#f0e8d2" opacity="0.9" />
    </svg>
  )
}

/** Small vector powder/grounds particles — deterministic spiral placement. */
export function Motes({
  className = '',
  count = 14,
  color = '#8a4b23',
  r = 130,
}: {
  className?: string
  count?: number
  color?: string
  r?: number
}) {
  const dots = Array.from({ length: count }).map((_, i) => {
    const a = i * 2.39996
    const rad = r * Math.sqrt((i + 0.5) / count)
    return { x: 150 + Math.cos(a) * rad, y: 150 + Math.sin(a) * rad, s: 2 + ((i * 7) % 4) }
  })
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={color} opacity={0.55 + ((i * 13) % 40) / 100} />
      ))}
    </svg>
  )
}

export function OliveSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} fill="none" aria-hidden>
      <path d="M20 120 C50 90 90 60 124 30" stroke={OLIVE_D} strokeWidth="4" strokeLinecap="round" />
      {[
        [48, 96, -30],
        [70, 78, -30],
        [92, 60, -30],
        [52, 92, 30],
        [74, 74, 30],
        [96, 56, 30],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="16"
          ry="7"
          fill={i % 2 ? OLIVE : '#7f8448'}
          stroke={OLIVE_D}
          strokeWidth="2.5"
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
    </svg>
  )
}
