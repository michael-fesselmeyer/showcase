import { describe, expect, it } from 'vitest'
import { isActive } from '@/lib/nav'

describe('isActive', () => {
  it('matches the home page exactly', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/work', '/')).toBe(false)
  })

  it('marks a section as current on its nested pages', () => {
    expect(isActive('/work', '/work')).toBe(true)
    expect(isActive('/work/atlas-health', '/work')).toBe(true)
    expect(isActive('/workshop', '/work')).toBe(false)
  })

  it('never marks in-page section links as current', () => {
    expect(isActive('/', '/#about')).toBe(false)
  })
})
