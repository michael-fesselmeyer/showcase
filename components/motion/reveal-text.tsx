'use client'

import { useRef, type ComponentPropsWithoutRef, type ElementType } from 'react'
import { ease, gsap, SplitText, useGSAP } from '@/lib/motion/gsap'
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
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: 'visible' })
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: seconds('slow'),
              ease: ease.out,
              stagger: 0.08,
              delay,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            })
          },
        })
        return () => split.revert()
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
