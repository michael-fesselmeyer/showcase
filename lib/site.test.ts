import { describe, expect, it } from 'vitest'
import { siteConfigSchema, type SiteConfig } from '@/lib/site-config-schema'
import { bookingLink, enabledSocialLinks, siteUrl } from '@/lib/site'
import { siteConfig } from '@/site.config'

const off = (url: string) => ({ url, enabled: false })

const social: SiteConfig['social'] = {
  github: off('https://github.com/example'),
  linkedin: off('https://www.linkedin.com/in/example'),
  x: off('https://x.com/example'),
  instagram: off('https://www.instagram.com/example'),
  bluesky: off('https://bsky.app/profile/example.test'),
  youtube: off('https://www.youtube.com/@example'),
}

describe('site config', () => {
  it('matches the schema', () => {
    expect(() => siteConfigSchema.parse(siteConfig)).not.toThrow()
  })

  it('launches with every social link and the booking link switched off', () => {
    expect(enabledSocialLinks(siteConfig.social)).toEqual([])
    expect(bookingLink(siteConfig.booking)).toBeNull()
  })
})

describe('enabledSocialLinks', () => {
  it('returns only enabled networks, in display order, with labels', () => {
    const links = enabledSocialLinks({
      ...social,
      youtube: { ...social.youtube, enabled: true },
      github: { ...social.github, enabled: true },
    })
    expect(links).toEqual([
      { network: 'github', label: 'GitHub', url: 'https://github.com/example' },
      { network: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@example' },
    ])
  })
})

describe('bookingLink', () => {
  it('returns the link when enabled', () => {
    expect(
      bookingLink({ label: 'Book a call', url: 'https://booking.example.test/a', enabled: true }),
    ).toEqual({ label: 'Book a call', url: 'https://booking.example.test/a' })
  })
})

describe('siteUrl', () => {
  it('prefers an explicit site URL', () => {
    expect(
      siteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://studio.example.test',
        VERCEL_PROJECT_PRODUCTION_URL: 'other.example.test',
      }).origin,
    ).toBe('https://studio.example.test')
  })

  it('falls back to the Vercel production domain, then localhost', () => {
    expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'showcase.example.test' }).origin).toBe(
      'https://showcase.example.test',
    )
    expect(siteUrl({}).origin).toBe('http://localhost:3000')
  })
})
