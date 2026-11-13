import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cssEasing, duration, easing, seconds, type EasingName } from '@/lib/motion/tokens'

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

function cssVar(name: string) {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  return match?.[1]?.trim()
}

const cssEasingVar: Record<EasingName, string> = {
  out: 'ease-out',
  inOut: 'ease-in-out',
  in: 'ease-in',
}

describe('motion tokens', () => {
  it.each(Object.keys(easing) as EasingName[])('CSS easing "%s" matches TypeScript', (name) => {
    expect(cssVar(cssEasingVar[name])).toBe(cssEasing(name))
  })

  it.each(Object.entries(duration))('CSS duration "%s" matches TypeScript', (name, ms) => {
    expect(cssVar(`duration-${name}`)).toBe(`${ms}ms`)
  })

  it('converts durations to seconds', () => {
    expect(seconds('base')).toBe(0.42)
  })
})
