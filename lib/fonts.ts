import { Fraunces, Instrument_Sans, JetBrains_Mono } from 'next/font/google'

/**
 * Typefaces. Each one is exposed as a CSS variable that the design tokens in
 * `app/globals.css` read, so swapping a face is a change to this file only.
 *
 * - Display: Fraunces, a variable serif with an optical-size axis. At large
 *   sizes `opsz` sharpens the contrast for editorial headlines; `SOFT` rounds
 *   the terminals slightly so it reads warm rather than bookish.
 * - Text: Instrument Sans, a quiet grotesque that stays legible at small sizes.
 * - Mono: JetBrains Mono for labels, indices and stack tags.
 */
export const displayFont = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  variable: '--ff-display',
})

export const textFont = Instrument_Sans({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--ff-text',
})

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--ff-mono',
  preload: false,
})

export const fontVariables = [displayFont.variable, textFont.variable, monoFont.variable].join(' ')
