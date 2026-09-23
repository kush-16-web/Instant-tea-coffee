import { useId } from 'react'
import { INK } from './botanicals'

/**
 * VESSELS — hero cups, coffee beans, packaging. Layered fills, ink contour,
 * hand-drawn steam. Unique gradient ids per instance via useId.
 */

/** Hand-drawn steam — 3 slow linework paths (CSS animates draw + drift). */
export function SteamLines({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const c = dark ? '#8a7358' : '#a89a80'
  return (
    <svg viewBox="0 0 200 190" className={className} fill="none" aria-hidden>
      <path className="steam-p s1" d="M60 175 C50 140 74 128 64 96 C56 70 70 50 66 22" stroke={c} strokeWidth="5" strokeLinecap="round" />
      <path className="steam-p s2" d="M100 182 C90 146 116 132 105 100 C97 72 112 54 107 18" stroke={c} strokeWidth="5" strokeLinecap="round" />
      <path className="steam-p s3" d="M140 175 C130 140 154 128 144 96 C136 70 150 50 146 22" stroke={c} strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/** Premium packaging-style coffee bean: organic body, S-crease, shading. */
export function CoffeeBean({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 140 150" className={className} fill="none" aria-hidden>
      <defs>
        <radialGradient id={`${id}g`} cx="0.38" cy="0.32" r="0.9">
          <stop offset="0" stopColor="#6b4423" />
          <stop offset="0.6" stopColor="#4a2b14" />
          <stop offset="1" stopColor="#2e1a0c" />
        </radialGradient>
      </defs>
      <path
        d="M70 8 C104 10 126 38 124 76 C122 114 98 142 66 142 C34 142 14 114 16 76 C18 38 38 6 70 8 Z"
        fill={`url(#${id}g)`}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* central crease */}
      <path
        d="M70 16 C60 44 84 66 72 92 C64 110 66 126 74 138"
        stroke="#1c0f06"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M70 16 C60 44 84 66 72 92 C64 110 66 126 74 138"
        stroke="#8a5a30"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* sheen + nicks */}
      <path d="M38 36 C32 52 32 72 38 90" stroke="#a5763f" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      <path d="M52 120 l6 -4 M96 44 l5 5 M104 96 l-6 3" stroke="#1c0f06" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

/** Cracked grounds — angular shards for the grind sequence. */
export function Grounds({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" aria-hidden>
      {[
        'M20 80 L44 62 L58 84 L34 100 Z',
        'M70 60 L96 52 L104 78 L78 88 Z',
        'M118 82 L144 66 L158 90 L132 104 Z',
        'M160 50 L180 44 L186 64 L168 70 Z',
        'M40 40 L56 34 L62 50 L46 56 Z',
        'M96 100 L114 96 L118 112 L100 116 Z',
      ].map((d, i) => (
        <path key={i} d={d} fill={i % 2 ? '#3a2313' : '#54331a'} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

export type CupTheme = {
  body: string
  bodyShade: string
  liquid: string
  surface: string
  ring: string
}

export const CHAI_CUP: CupTheme = {
  body: '#faf4e6',
  bodyShade: '#e4d7bd',
  liquid: '#c07a2e',
  surface: '#d99a4e',
  ring: '#f0e3c8',
}

export const COFFEE_CUP: CupTheme = {
  body: '#3a2313',
  bodyShade: '#241407',
  liquid: '#2a1408',
  surface: '#4a2c14',
  ring: '#8a5a30',
}

/**
 * The hero object — luxury-packaging ceramic cup. Refs expose every animated
 * part to the scroll choreography: outline, liquid, stream, steam, saucer.
 */
export function BrewCup({
  theme = CHAI_CUP,
  className = '',
  outlineRef,
  liquidRef,
  streamRef,
  steamRef,
  saucerRef,
  fill = 1,
}: {
  theme?: CupTheme
  className?: string
  outlineRef?: (el: SVGGElement | null) => void
  liquidRef?: (el: SVGGElement | null) => void
  streamRef?: (el: SVGPathElement | null) => void
  steamRef?: (el: SVGGElement | null) => void
  saucerRef?: (el: SVGGElement | null) => void
  fill?: number
}) {
  const id = useId()
  const dark = theme.body === COFFEE_CUP.body
  return (
    <svg viewBox="0 0 400 430" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}bd`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={theme.bodyShade} />
          <stop offset="0.28" stopColor={theme.body} />
          <stop offset="0.72" stopColor={theme.body} />
          <stop offset="1" stopColor={theme.bodyShade} />
        </linearGradient>
        <linearGradient id={`${id}lq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.surface} />
          <stop offset="1" stopColor={theme.liquid} />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <path d="M112 188 L288 188 L274 300 C271 322 240 336 200 336 C160 336 129 322 126 300 Z" />
        </clipPath>
      </defs>

      {/* saucer */}
      <g ref={saucerRef}>
        <ellipse cx="200" cy="368" rx="132" ry="26" fill={dark ? '#241407' : '#f3ead6'} stroke={INK} strokeWidth="4" />
        <ellipse cx="200" cy="364" rx="96" ry="17" stroke={INK} strokeWidth="2" opacity="0.35" />
        {/* spoon resting left */}
        <g transform="rotate(-14 96 356)">
          <ellipse cx="96" cy="356" rx="17" ry="11" fill={dark ? '#c8925b' : '#e8ddc2'} stroke={INK} strokeWidth="3" />
          <path d="M112 352 L168 340" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <path d="M112 352 L168 340" stroke={dark ? '#c8925b' : '#e8ddc2'} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* pouring stream (hidden until choreography reveals it) */}
      <path
        ref={streamRef}
        d="M200 6 C196 50 206 96 200 158"
        stroke={theme.surface}
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0"
      />

      {/* steam */}
      <g ref={steamRef} opacity="0.9">
        <path className="steam-p s1" d="M158 158 C150 128 170 118 162 92 C156 72 168 58 164 40" stroke={dark ? '#8a7358' : '#a89a80'} strokeWidth="5" strokeLinecap="round" />
        <path className="steam-p s2" d="M200 164 C192 132 214 120 205 94 C199 72 212 56 207 36" stroke={dark ? '#8a7358' : '#a89a80'} strokeWidth="5" strokeLinecap="round" />
        <path className="steam-p s3" d="M242 158 C234 128 254 118 246 92 C240 72 252 58 248 40" stroke={dark ? '#8a7358' : '#a89a80'} strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* cup body */}
      <g ref={outlineRef}>
        {/* handle */}
        <path d="M286 210 C344 210 346 292 280 300" stroke={INK} strokeWidth="16" strokeLinecap="round" />
        <path d="M286 210 C344 210 346 292 280 300" stroke={theme.body} strokeWidth="8" strokeLinecap="round" />
        {/* body */}
        <path
          d="M110 186 L290 186 L276 302 C273 326 240 340 200 340 C160 340 127 326 124 302 Z"
          fill={`url(#${id}bd)`}
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* hand-drawn contour shading */}
        <path d="M132 200 C136 260 150 308 176 326" stroke={theme.bodyShade} strokeWidth="7" strokeLinecap="round" opacity="0.9" />
        <path d="M146 204 C150 252 160 292 178 312" stroke="#fffdf6" strokeWidth="4" strokeLinecap="round" opacity={dark ? 0.25 : 0.8} />
        {/* rim */}
        <ellipse cx="200" cy="186" rx="90" ry="18" fill={dark ? '#1c0f06' : '#fffdf6'} stroke={INK} strokeWidth="4" />
        {/* liquid */}
        <g ref={liquidRef} opacity={fill}>
          <g clipPath={`url(#${id}clip)`}>
            <rect x="100" y="150" width="200" height="200" fill={`url(#${id}lq)`} />
            <ellipse cx="200" cy="186" rx="76" ry="13" fill={theme.surface} opacity="0.9" />
            <path className="ripple" d="M150 186 C170 180 190 192 210 186 C230 180 250 190 262 185" stroke={theme.ring} strokeWidth="2.5" opacity="0.8" />
            <rect x="140" y="200" width="12" height="120" rx="6" fill="#ffffff" opacity="0.14" />
          </g>
        </g>
        {/* brand mark on cup */}
        <g opacity="0.9">
          <circle cx="200" cy="268" r="17" stroke={dark ? '#c8925b' : INK} strokeWidth="2.5" />
          <path d="M193 268 C193 262 207 262 207 268 C207 274 193 274 193 268 Z" fill="none" stroke={dark ? '#c8925b' : INK} strokeWidth="2" />
          <path d="M188 288 H212 M191 294 H209" stroke={dark ? '#c8925b' : INK} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </g>
      </g>
    </svg>
  )
}

/** Thin editorial connector line with endpoint dot. */
export function Connector({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 24" className={className} fill="none" aria-hidden style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path className="connector-draw" d="M4 12 H104" stroke={INK} strokeWidth="1.5" opacity="0.6" />
      <circle cx="110" cy="12" r="4" fill={INK} opacity="0.7" />
      <circle cx="4" cy="12" r="2.5" fill="none" stroke={INK} strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

/** Chai pouch packaging illustration. */
export function ChaiPouch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 400" className={className} fill="none" aria-hidden>
      <ellipse cx="150" cy="378" rx="100" ry="12" fill={INK} opacity="0.12" />
      {/* body */}
      <path d="M62 70 L238 70 L250 360 L50 360 Z" fill="#a5672f" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M62 70 L238 70 L250 360 L50 360 Z" fill="#000" opacity="0.08" />
      <path d="M62 70 L84 70 L74 360 L50 360 Z" fill="#8a4b23" opacity="0.85" />
      {/* folded top */}
      <path d="M56 44 L244 44 L238 74 L62 74 Z" fill="#7a3c14" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M56 44 H244" stroke="#d99a55" strokeWidth="2" opacity="0.6" />
      {/* label */}
      <rect x="82" y="120" width="136" height="180" rx="6" fill="#f6f1e6" stroke={INK} strokeWidth="3.5" />
      <text x="150" y="148" textAnchor="middle" fontSize="17" letterSpacing="4" fill={INK} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>CUPPA</text>
      <path d="M100 160 H200" stroke={INK} strokeWidth="1.5" opacity="0.5" />
      <text x="150" y="188" textAnchor="middle" fontSize="26" fill="#8e2f21" style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>MASALA</text>
      <text x="150" y="216" textAnchor="middle" fontSize="26" fill="#8e2f21" style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>CHAI</text>
      <text x="150" y="238" textAnchor="middle" fontSize="11" letterSpacing="2.5" fill={INK} opacity="0.75">INSTANT MILK TEA</text>
      {/* botanical sprig on label */}
      <g transform="translate(108 248)">
        <path d="M42 0 C30 18 30 34 42 46" stroke="#4c5028" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="30" cy="14" rx="10" ry="5" fill="#7f8448" stroke="#4c5028" strokeWidth="2" transform="rotate(-30 30 14)" />
        <ellipse cx="28" cy="32" rx="10" ry="5" fill="#7f8448" stroke="#4c5028" strokeWidth="2" transform="rotate(-25 28 32)" />
        <ellipse cx="54" cy="14" rx="10" ry="5" fill="#7f8448" stroke="#4c5028" strokeWidth="2" transform="rotate(30 54 14)" />
        <ellipse cx="56" cy="32" rx="10" ry="5" fill="#7f8448" stroke="#4c5028" strokeWidth="2" transform="rotate(25 56 32)" />
      </g>
      {/* seal badge */}
      <circle cx="216" cy="316" r="24" fill="#8e2f21" stroke={INK} strokeWidth="3" />
      <text x="216" y="324" textAnchor="middle" fontSize="16" fill="#f6f1e6" style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>10s</text>
      {/* gusset lines */}
      <path d="M62 74 L238 74" stroke={INK} strokeWidth="2" opacity="0.4" />
    </svg>
  )
}

/** Coffee bag packaging illustration. */
export function CoffeeBag({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 400" className={className} fill="none" aria-hidden>
      <ellipse cx="150" cy="378" rx="100" ry="12" fill={INK} opacity="0.12" />
      <path d="M66 78 L234 78 L244 360 L56 360 Z" fill="#3a2313" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M66 78 L88 78 L80 360 L56 360 Z" fill="#241407" opacity="0.9" />
      {/* rolled top */}
      <rect x="58" y="46" width="184" height="36" rx="8" fill="#241407" stroke={INK} strokeWidth="4" />
      <path d="M72 64 H228" stroke="#c8925b" strokeWidth="2" opacity="0.7" />
      {/* label */}
      <rect x="82" y="118" width="136" height="184" rx="6" fill="#f6f1e6" stroke={INK} strokeWidth="3.5" />
      <text x="150" y="146" textAnchor="middle" fontSize="17" letterSpacing="4" fill={INK} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>CUPPA</text>
      <path d="M100 158 H200" stroke={INK} strokeWidth="1.5" opacity="0.5" />
      <text x="150" y="186" textAnchor="middle" fontSize="24" fill="#3a2313" style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>FILTER</text>
      <text x="150" y="214" textAnchor="middle" fontSize="24" fill="#3a2313" style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>KAAPI</text>
      <text x="150" y="236" textAnchor="middle" fontSize="11" letterSpacing="2.5" fill={INK} opacity="0.75">INSTANT COFFEE</text>
      {/* bean trio on label */}
      <g transform="translate(150 268)">
        <g transform="rotate(-18)">
          <ellipse cx="0" cy="0" rx="13" ry="17" fill="#4a2b14" stroke={INK} strokeWidth="2.5" />
          <path d="M0 -15 C-6 -5 6 5 0 15" stroke="#1c0f06" strokeWidth="3.5" />
        </g>
        <g transform="translate(26 6) rotate(14)">
          <ellipse cx="0" cy="0" rx="11" ry="15" fill="#54331a" stroke={INK} strokeWidth="2.5" />
          <path d="M0 -13 C-5 -4 5 4 0 13" stroke="#1c0f06" strokeWidth="3" />
        </g>
        <g transform="translate(-26 6) rotate(-14)">
          <ellipse cx="0" cy="0" rx="11" ry="15" fill="#3a2313" stroke={INK} strokeWidth="2.5" />
          <path d="M0 -13 C-5 -4 5 4 0 13" stroke="#1c0f06" strokeWidth="3" />
        </g>
      </g>
      <circle cx="216" cy="318" r="24" fill="#c8925b" stroke={INK} strokeWidth="3" />
      <text x="216" y="326" textAnchor="middle" fontSize="15" fill={INK} style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 900 }}>80:20</text>
    </svg>
  )
}
