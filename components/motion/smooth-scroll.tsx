'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { usePrefersReducedMotion } from '@/lib/motion/use-media-query'

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so Lenis and
 * ScrollTrigger update in the same frame. Touch keeps native scrolling, and
 * reduced-motion users get the browser's scrolling untouched.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.12 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  // A new page starts at the top, and its scroll-driven sections re-measure.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
