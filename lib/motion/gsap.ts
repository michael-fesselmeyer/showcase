'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { easing, seconds, type EasingName } from '@/lib/motion/tokens'

/** GSAP ease names registered from the shared easing tokens. */
export const ease: Record<EasingName, string> = {
  out: 'site.out',
  inOut: 'site.inOut',
  in: 'site.in',
}

let registered = false

/**
 * Registers plugins and the site's eases once. Every GSAP consumer imports
 * from this module, so registration always happens before first use.
 */
function register() {
  if (registered || typeof window === 'undefined') return
  registered = true

  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase)

  for (const name of Object.keys(easing) as EasingName[]) {
    const [x1, y1, x2, y2] = easing[name]
    CustomEase.create(ease[name], `M0,0 C${x1},${y1} ${x2},${y2} 1,1`)
  }

  gsap.defaults({ ease: ease.out, duration: seconds('slow') })
}

register()

export { gsap, ScrollTrigger, SplitText, useGSAP }
