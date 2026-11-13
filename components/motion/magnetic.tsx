'use client'

import { motion, useSpring } from 'motion/react'
import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { spring } from '@/lib/motion/tokens'
import { usePointerEffects } from '@/lib/motion/use-media-query'

type MagneticProps = {
  children: ReactNode
  /** Fraction of the pointer's offset from centre the child follows. */
  strength?: number
  className?: string
}

/**
 * Pulls its child toward the pointer and springs back on leave. The wrapper
 * renders the same markup everywhere; on touch or with reduced motion it
 * simply never moves.
 */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const enabled = usePointerEffects()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useSpring(0, spring.soft)
  const y = useSpring(0, spring.soft)

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
