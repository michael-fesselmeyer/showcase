/**
 * Motion tokens shared by Motion, GSAP and CSS. The CSS custom properties in
 * `app/globals.css` mirror these values; a unit test keeps the two in sync.
 *
 * Every animation on the site picks from this small set, which is what makes
 * different effects feel like one system.
 */

export type CubicBezier = readonly [number, number, number, number]

export const easing = {
  /** Fast start, long settle. Default for anything arriving. */
  out: [0.16, 1, 0.3, 1],
  /** Symmetric. Wipes, page transitions, things that travel. */
  inOut: [0.76, 0, 0.24, 1],
  /** Slow start. Only for things leaving. */
  in: [0.7, 0, 0.84, 0],
} as const satisfies Record<string, CubicBezier>

/** Durations in milliseconds. */
export const duration = {
  instant: 120,
  fast: 220,
  base: 420,
  slow: 800,
  slower: 1200,
} as const

export type EasingName = keyof typeof easing
export type DurationName = keyof typeof duration

/** Seconds, for Motion and GSAP which take durations in seconds. */
export const seconds = (name: DurationName) => duration[name] / 1000

/** `cubic-bezier(...)` string for CSS and for GSAP's CustomEase. */
export const cssEasing = (name: EasingName) => `cubic-bezier(${easing[name].join(', ')})`

/** Spring presets for Motion gestures and magnetic elements. */
export const spring = {
  /** Snappy, slight overshoot. Buttons, cursor. */
  snappy: { type: 'spring', stiffness: 380, damping: 30, mass: 0.6 },
  /** Soft follow. Tilt, magnetic pull. */
  soft: { type: 'spring', stiffness: 150, damping: 18, mass: 0.4 },
} as const
