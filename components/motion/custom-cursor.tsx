'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { spring } from '@/lib/motion/tokens'
import { usePointerEffects } from '@/lib/motion/use-media-query'

type CursorState = { variant: 'default' | 'interactive' | 'text' | 'label'; label?: string }

const INTERACTIVE = 'a, button, [role="button"], summary, label[for], [data-cursor="interactive"]'
const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]'

/** Work out what the cursor should look like over `target`. */
export function cursorStateFor(target: Element | null): CursorState {
  if (!target) return { variant: 'default' }
  const labelled = target.closest<HTMLElement>('[data-cursor-label]')
  if (labelled) return { variant: 'label', label: labelled.dataset.cursorLabel }
  if (target.closest(TEXT_ENTRY)) return { variant: 'text' }
  if (target.closest(INTERACTIVE)) return { variant: 'interactive' }
  return { variant: 'default' }
}

/**
 * A dot that tracks the pointer exactly and a ring that follows on a spring.
 * Over links and buttons the ring grows and the dot hides; over elements with
 * `data-cursor-label` the ring shows a short label ("View"); over text fields
 * the custom cursor steps aside for the native caret.
 *
 * Only on fine pointers with motion allowed; touch keeps native behaviour.
 */
export function CustomCursor() {
  const enabled = usePointerEffects()
  return enabled ? <Cursor /> : null
}

function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, spring.snappy)
  const ringY = useSpring(y, spring.snappy)
  const [state, setState] = useState<CursorState>({ variant: 'default' })
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const show = (value: boolean) => {
      if (visibleRef.current === value) return
      visibleRef.current = value
      setVisible(value)
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      show(true)
    }
    const onOver = (event: PointerEvent) => setState(cursorStateFor(event.target as Element))
    const onLeave = () => show(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  const hidden = !visible || state.variant === 'text'
  const ringScale = state.variant === 'label' ? 2.4 : state.variant === 'interactive' ? 1.7 : 1

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] mix-blend-difference">
      <motion.div
        className="absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-paper"
        style={{ x, y }}
        animate={{
          opacity: hidden || state.variant !== 'default' ? 0 : 1,
          scale: state.variant === 'default' ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div className="absolute top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="-mt-5 -ml-5 size-10 rounded-full border border-paper/45"
          animate={{
            opacity: hidden ? 0 : 1,
            scale: ringScale,
            backgroundColor:
              state.variant === 'default' ? 'rgba(243,239,232,0)' : 'rgba(243,239,232,0.08)',
            borderColor:
              state.variant === 'default' ? 'rgba(243,239,232,0.45)' : 'rgba(243,239,232,0.25)',
          }}
          transition={spring.snappy}
        />
        <motion.span
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 label text-[0.625rem] whitespace-nowrap text-paper"
          animate={{ opacity: state.variant === 'label' && !hidden ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          {state.label}
        </motion.span>
      </motion.div>
    </div>
  )
}
