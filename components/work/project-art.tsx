import type { ReactNode } from 'react'
import type { ArtPattern } from '@/lib/projects-schema'
import { cn } from '@/lib/utils'

type ProjectArtProps = {
  /** Unique per page; used to scope gradient ids. */
  id: string
  pattern: ArtPattern
  colors: readonly [string, string]
  className?: string
}

const W = 800
const H = 600
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

/**
 * Generated cover art for projects without screenshots yet. Each pattern is a
 * small composition in the project's two colours. Elements marked
 * `data-anim` move while the surrounding card is hovered or focused, which is
 * the card's preview; they hold still otherwise and for reduced motion.
 */
export function ProjectArt({ id, pattern, colors, className }: ProjectArtProps) {
  const [a, b] = colors
  const g = (name: string) => `${id}-${name}`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('project-art block size-full bg-ink-900', className)}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={g('line')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={g('glow')} cx="0.7" cy="0.3" r="0.8">
          <stop offset="0" stopColor={b} stopOpacity="0.45" />
          <stop offset="0.5" stopColor={a} stopOpacity="0.12" />
          <stop offset="1" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${g('glow')})`} />
      {patterns[pattern](`url(#${g('line')})`, a, b)}
    </svg>
  )
}

type Draw = (stroke: string, a: string, b: string) => ReactNode

const patterns: Record<ArtPattern, Draw> = {
  orbits: (stroke, a, b) => (
    <g fill="none" stroke={stroke} strokeWidth="1.5">
      {range(5).map((i) => (
        <g key={i} data-anim="spin" style={{ animationDuration: `${14 + i * 6}s` }}>
          <ellipse
            cx={W / 2}
            cy={H / 2}
            rx={90 + i * 62}
            ry={40 + i * 30}
            opacity={0.9 - i * 0.12}
            transform={`rotate(${-18 + i * 9} ${W / 2} ${H / 2})`}
          />
          <circle
            cx={W / 2 + 90 + i * 62}
            cy={H / 2}
            r={5 + (i % 2) * 3}
            fill={i % 2 ? a : b}
            stroke="none"
          />
        </g>
      ))}
      <circle cx={W / 2} cy={H / 2} r="26" fill={stroke} stroke="none" />
    </g>
  ),

  grid: (stroke, a, b) => (
    <g>
      <g stroke={stroke} strokeWidth="1" opacity="0.5">
        {range(17).map((i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2={H} />
        ))}
        {range(13).map((i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2={W} y2={i * 50} />
        ))}
      </g>
      {[
        [3, 2, a],
        [8, 4, b],
        [12, 3, a],
        [6, 8, b],
        [10, 9, a],
        [14, 6, b],
      ].map(([x, y, fill], i) => (
        <rect
          key={i}
          data-anim="pulse"
          style={{ animationDelay: `${i * -0.45}s` }}
          x={(x as number) * 50 + 4}
          y={(y as number) * 50 + 4}
          width="42"
          height="42"
          rx="6"
          fill={fill as string}
          opacity="0.85"
        />
      ))}
      <path
        d="M150 125 L425 225 L625 175 L525 475 L325 425"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeDasharray="6 8"
        data-anim="dash"
      />
    </g>
  ),

  waves: (stroke) => (
    <g fill="none" stroke={stroke} strokeLinecap="round">
      {range(9).map((i) => {
        const y = 150 + i * 38
        const amp = 30 + i * 6
        return (
          <path
            key={i}
            data-anim="drift"
            style={{ animationDuration: `${6 + i}s`, animationDelay: `${i * -0.7}s` }}
            d={`M-200 ${y} C 0 ${y - amp}, 100 ${y + amp}, 300 ${y} S 600 ${y - amp}, 800 ${y} S 1100 ${y + amp}, 1200 ${y}`}
            strokeWidth={1 + (i % 3)}
            opacity={0.35 + (i / 9) * 0.6}
          />
        )
      })}
    </g>
  ),

  bars: (stroke, a) => (
    <g>
      <g stroke="rgb(243 239 232 / 0.12)">
        {range(5).map((i) => (
          <line key={i} x1="80" x2="720" y1={140 + i * 90} y2={140 + i * 90} />
        ))}
      </g>
      {[0.45, 0.62, 0.38, 0.74, 0.58, 0.86, 0.69, 0.95, 0.8].map((h, i) => (
        <rect
          key={i}
          data-anim="grow"
          style={{ animationDelay: `${i * 0.12}s` }}
          x={100 + i * 68}
          y={500 - h * 360}
          width="40"
          height={h * 360}
          rx="6"
          fill={stroke}
          opacity={0.55 + h * 0.45}
        />
      ))}
      <path
        d="M120 400 L188 352 L256 380 L324 300 L392 320 L460 230 L528 260 L596 170 L664 196"
        fill="none"
        stroke={a}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  ),

  rings: (stroke, a, b) => (
    <g fill="none">
      {range(8).map((i) => (
        <circle
          key={i}
          data-anim="breathe"
          style={{ animationDelay: `${i * -0.35}s` }}
          cx={W / 2}
          cy={H / 2}
          r={30 + i * 34}
          stroke={i % 3 === 0 ? stroke : i % 2 ? a : b}
          strokeWidth={i % 3 === 0 ? 3 : 1}
          strokeDasharray={i % 2 ? '2 10' : undefined}
          opacity={1 - i * 0.09}
        />
      ))}
    </g>
  ),

  blocks: (stroke, a, b) => (
    <g>
      {[
        [140, 120, 300, 180, a],
        [470, 90, 200, 120, b],
        [180, 330, 220, 150, b],
        [430, 250, 240, 230, stroke],
      ].map(([x, y, w, h, fill], i) => (
        <g key={i} data-anim="float" style={{ animationDelay: `${i * -0.8}s` }}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx="18"
            fill="rgb(243 239 232 / 0.04)"
            stroke="rgb(243 239 232 / 0.16)"
          />
          <rect
            x={(x as number) + 20}
            y={(y as number) + 20}
            width={(w as number) * 0.45}
            height="10"
            rx="5"
            fill={fill as string}
          />
          <rect
            x={(x as number) + 20}
            y={(y as number) + 42}
            width={(w as number) * 0.7}
            height="6"
            rx="3"
            fill="rgb(243 239 232 / 0.25)"
          />
          <rect
            x={(x as number) + 20}
            y={(y as number) + 56}
            width={(w as number) * 0.55}
            height="6"
            rx="3"
            fill="rgb(243 239 232 / 0.18)"
          />
        </g>
      ))}
    </g>
  ),
}
