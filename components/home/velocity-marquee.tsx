'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils'

type Band = { items: string[]; direction: 1 | -1; outlined?: boolean }

/** Seconds for one band to travel its own width at rest. */
const BASE_DURATION = 40

/**
 * Bands of oversized text that scroll endlessly. Scrolling speeds them up in
 * proportion to scroll velocity, and scrolling back up reverses them; when
 * scrolling stops they ease back to their resting speed.
 *
 * Each band repeats its text twice so the loop is seamless; the copies are
 * hidden from assistive tech, which gets each band once as a list. With
 * reduced motion the bands sit still.
 */
export function VelocityMarquee({ bands, label }: { bands: Band[]; label: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-marquee-row]')
        const tweens = rows.map((row) => {
          const dir = Number(row.dataset.direction)
          gsap.set(row, { xPercent: dir === 1 ? 0 : -50 })
          return gsap.to(row, {
            xPercent: dir === 1 ? -50 : 0,
            duration: BASE_DURATION,
            ease: 'none',
            repeat: -1,
            // Starts still; plays only while the bands are on screen (below).
            paused: true,
          })
        })

        // Scroll velocity becomes a temporary boost on top of the resting speed.
        const boost = { value: 1 }
        let scrollDirection = 1
        const apply = () => {
          for (const tween of tweens) tween.timeScale(boost.value * scrollDirection)
        }

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate(self) {
            const velocity = self.getVelocity()
            scrollDirection = self.direction
            const target = 1 + Math.min(Math.abs(velocity) / 220, 7)
            gsap.killTweensOf(boost)
            boost.value = Math.max(boost.value, target)
            apply()
            gsap.to(boost, { value: 1, duration: 1.1, ease: 'power3.out', onUpdate: apply })
          },
        })

        // Off screen, including before the visitor scrolls to it, the loop
        // stops costing anything.
        const visibility = new IntersectionObserver(([entry]) => {
          for (const tween of tweens) {
            if (entry?.isIntersecting) tween.resume()
            else tween.pause()
          }
        })
        visibility.observe(root.current!)
        return () => visibility.disconnect()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="overflow-hidden py-6" role="region" aria-label={label}>
      {bands.map((band, b) => (
        <div key={b} className={cn('relative', b > 0 && 'mt-2')}>
          <ul className="sr-only">
            {band.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div
            aria-hidden
            data-marquee-row
            data-direction={band.direction}
            className="flex w-max will-change-transform"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {band.items.map((item) => (
                  <span key={item} className="flex items-center">
                    <span
                      className={cn(
                        'px-[0.35em] headline text-[clamp(3.5rem,2rem+7vw,9rem)] leading-none whitespace-nowrap',
                        band.outlined
                          ? 'text-transparent [-webkit-text-stroke:1px_var(--line-strong)]'
                          : 'text-paper',
                      )}
                    >
                      {item}
                    </span>
                    <span className="text-brand-gradient text-[clamp(1.5rem,1rem+2vw,3rem)]">
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
