'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { usePointerEffects } from '@/lib/motion/use-media-query'

/**
 * Tracks the pointer over a group and tells every `.spotlight-card` inside
 * where it is, relative to that card. The CSS glow on each card's border then
 * follows the pointer across the whole group, not just the hovered card.
 * Updates are batched to one per frame and only write CSS variables.
 */
export function SpotlightGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = usePointerEffects()

  useEffect(() => {
    const group = ref.current
    if (!group || !enabled) return

    let frame = 0
    let point = { x: 0, y: 0 }

    const paint = () => {
      frame = 0
      for (const card of group.querySelectorAll<HTMLElement>('.spotlight-card')) {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${point.x - rect.left}px`)
        card.style.setProperty('--my', `${point.y - rect.top}px`)
      }
    }
    const onMove = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY }
      frame ||= requestAnimationFrame(paint)
    }
    const onLeave = () => {
      point = { x: -9999, y: -9999 }
      frame ||= requestAnimationFrame(paint)
    }

    group.addEventListener('pointermove', onMove, { passive: true })
    group.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      group.removeEventListener('pointermove', onMove)
      group.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
