import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { introScript } from '@/components/motion/opening-sequence'

const root = document.documentElement

function setReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
  }))
}

function runScript() {
  new Function(introScript)()
}

describe('opening sequence script', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    root.removeAttribute('data-intro')
    root.classList.remove('js')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('plays on the first visit of a session and cleans up afterwards', () => {
    setReducedMotion(false)
    runScript()
    expect(root.classList.contains('js')).toBe(true)
    expect(root.hasAttribute('data-intro')).toBe(true)

    vi.advanceTimersByTime(2600)
    expect(root.hasAttribute('data-intro')).toBe(false)
  })

  it('does not play again in the same session', () => {
    setReducedMotion(false)
    runScript()
    vi.advanceTimersByTime(2600)
    runScript()
    expect(root.hasAttribute('data-intro')).toBe(false)
  })

  it('never plays with reduced motion', () => {
    setReducedMotion(true)
    runScript()
    expect(root.classList.contains('js')).toBe(true)
    expect(root.hasAttribute('data-intro')).toBe(false)
  })
})
