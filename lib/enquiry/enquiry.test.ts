import { describe, expect, it, vi } from 'vitest'
import { redactEmail } from '@/lib/enquiry/deliver'
import { handleEnquiry } from '@/lib/enquiry/handle'
import { isLikelySpam, MIN_FILL_MS } from '@/lib/enquiry/spam'

const NOW = 1_800_000_000_000

function form(overrides: Record<string, string> = {}) {
  const data = new FormData()
  const fields = {
    name: 'Avery Example',
    email: 'avery@example.test',
    projectType: 'web-app',
    budget: '25k-50k',
    timeline: '1-3-months',
    details: 'We need a booking portal for our clinics with online payments.',
    website: '',
    startedAt: String(NOW - 60_000),
    ...overrides,
  }
  for (const [key, value] of Object.entries(fields)) data.set(key, value)
  return data
}

describe('isLikelySpam', () => {
  it('flags a filled honeypot', () => {
    expect(isLikelySpam({ honeypot: 'https://spam.example.test', startedAt: null, now: NOW })).toBe(
      true,
    )
  })

  it('flags submissions faster than a person could type', () => {
    expect(isLikelySpam({ honeypot: '', startedAt: String(NOW - MIN_FILL_MS + 1), now: NOW })).toBe(
      true,
    )
  })

  it('lets through people, including those without JavaScript', () => {
    expect(isLikelySpam({ honeypot: '', startedAt: String(NOW - 30_000), now: NOW })).toBe(false)
    expect(isLikelySpam({ honeypot: '', startedAt: null, now: NOW })).toBe(false)
    expect(isLikelySpam({ honeypot: null, startedAt: 'garbled', now: NOW })).toBe(false)
  })
})

describe('handleEnquiry', () => {
  it('delivers a valid enquiry with trimmed values', async () => {
    const deliver = vi.fn().mockResolvedValue(undefined)
    const state = await handleEnquiry(form({ name: '  Avery Example ' }), { deliver, now: NOW })
    expect(state).toEqual({ status: 'success' })
    expect(deliver).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Avery Example', budget: '25k-50k' }),
    )
  })

  it('returns field errors and the submitted values', async () => {
    const deliver = vi.fn()
    const state = await handleEnquiry(
      form({ email: 'not-an-email', details: 'Too short', budget: '' }),
      {
        deliver,
        now: NOW,
      },
    )
    expect(deliver).not.toHaveBeenCalled()
    expect(state.status).toBe('error')
    if (state.status !== 'error') return
    expect(Object.keys(state.fieldErrors).sort()).toEqual(['budget', 'details', 'email'])
    expect(state.fieldErrors.email).toBe('Please enter a valid email address.')
    expect(state.message).toBe('Please check the 3 highlighted fields.')
    expect(state.values.email).toBe('not-an-email')
  })

  it('rejects values outside the allowed choices', async () => {
    const state = await handleEnquiry(form({ projectType: 'crypto' }), {
      deliver: vi.fn(),
      now: NOW,
    })
    expect(state.status === 'error' && state.fieldErrors.projectType).toBe(
      'Please choose a project type.',
    )
  })

  it('silently drops spam without delivering it', async () => {
    const deliver = vi.fn()
    const state = await handleEnquiry(form({ website: 'https://spam.example.test' }), {
      deliver,
      now: NOW,
    })
    expect(state).toEqual({ status: 'success' })
    expect(deliver).not.toHaveBeenCalled()
  })

  it('shows real errors to someone who presses send quickly', async () => {
    const state = await handleEnquiry(form({ name: '', startedAt: String(NOW - 500) }), {
      deliver: vi.fn(),
      now: NOW,
    })
    expect(state.status).toBe('error')
  })

  it('reports a delivery failure without losing the input', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const deliver = vi.fn().mockRejectedValue(new Error('provider down'))
    const state = await handleEnquiry(form(), { deliver, now: NOW })
    expect(state.status).toBe('error')
    if (state.status !== 'error') return
    expect(state.fieldErrors).toEqual({})
    expect(state.values.name).toBe('Avery Example')
  })
})

describe('redactEmail', () => {
  it('keeps the domain and hides the mailbox', () => {
    expect(redactEmail('avery@example.test')).toBe('a***@example.test')
  })
})
