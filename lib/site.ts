import { siteConfig } from '@/site.config'
import {
  socialLabels,
  socialNetworks,
  type SiteConfig,
  type SocialNetwork,
  type ToggleLink,
} from '@/lib/site-config-schema'

export type EnabledSocialLink = { network: SocialNetwork; label: string; url: string }

/** Social profiles that are switched on, in a stable display order. */
export function enabledSocialLinks(
  social: SiteConfig['social'] = siteConfig.social,
): EnabledSocialLink[] {
  return socialNetworks.flatMap((network) => {
    const link: ToggleLink | undefined = social[network]
    return link?.enabled ? [{ network, label: socialLabels[network], url: link.url }] : []
  })
}

/** The booking link, or `null` when it is switched off. */
export function bookingLink(booking: SiteConfig['booking'] = siteConfig.booking) {
  return booking.enabled ? { label: booking.label, url: booking.url } : null
}

/**
 * Absolute origin used for metadata, the sitemap and Open Graph images.
 * Prefers an explicit setting, then the production domain Vercel provides.
 */
export function siteUrl(env: Record<string, string | undefined> = process.env): URL {
  const explicit = env.NEXT_PUBLIC_SITE_URL
  if (explicit) return new URL(explicit)
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return new URL(`https://${vercel}`)
  return new URL('http://localhost:3000')
}
