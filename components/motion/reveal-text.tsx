'use client'

import { useRef, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { ease, gsap, SplitText, useGSAP } from '@/lib/motion/gsap'
import { whenIdle } from '@/lib/motion/idle-queue'
import { seconds } from '@/lib/motion/tokens'

type RevealTextProps<T extends ElementType> = {
  as?: T
  /** Seconds to wait after the element enters the viewport. */
  delay?: number
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

/**
 * Text that reveals line by line as it scrolls into view. Lines are split
 * with SplitText (re-split on resize and font load) and slide up out of a
 * mask. The text is in the HTML from the start: without JavaScript, or with
 * reduced motion, it is simply there.
 */
export function RevealText<T extends ElementType = 'p'>({
  as,
  delay = 0,
  children,
  ...props
}: RevealTextProps<T>) {
  const Tag: ElementType = as ?? 'p'
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | null = null
        let tween: gsap.core.Tween | null = null
        let inView = false

        // Splitting measures every line, which forces layout. Doing it while
        // the page is idle keeps that work out of load and out of scrolling;
        // the animation itself only plays when the text comes into view.
        const prepare = () => {
          if (split) return
          split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            // Lines stay plain text for assistive tech; no aria-label on generic elements.
            aria: 'none',
            onSplit(self) {
              gsap.set(el, { visibility: 'visible' })
              tween = gsap.from(self.lines, {
                yPercent: 110,
                duration: seconds('slow'),
                ease: ease.out,
                stagger: 0.08,
                delay,
                paused: !inView,
              })
              return tween
            },
          })
        }
        const cancelIdle = whenIdle(prepare)

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return
            observer.disconnect()
            inView = true
            cancelIdle()
            prepare()
            tween?.restart(true)
          },
          { rootMargin: '0px 0px -8% 0px' },
        )
        observer.observe(el)

        return () => {
          cancelIdle()
          observer.disconnect()
          split?.revert()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} data-reveal="" {...props}>
      {children}
    </Tag>
  )
}
