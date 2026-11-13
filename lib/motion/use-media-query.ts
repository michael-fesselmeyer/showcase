'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query. `serverValue` is what the server render (and
 * the first client render) assumes, so pick the value that is safe to show
 * before JavaScript knows better.
 */
export function useMediaQuery(query: string, serverValue: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/** Reduced motion. Assumed on the server so nothing animates before we know. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true)
}

/** A precise pointer (mouse, trackpad). Touch devices get native behaviour. */
export function useFinePointer() {
  return useMediaQuery('(pointer: fine)', false)
}

/** Fine pointer and motion allowed: the condition for cursor-driven effects. */
export function usePointerEffects() {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  return fine && !reduced
}
