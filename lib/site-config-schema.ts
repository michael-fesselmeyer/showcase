import { z } from 'zod'

/** A link the owner can switch on or off without touching a component. */
export const toggleLinkSchema = z.object({
  url: z.url(),
  enabled: z.boolean(),
})

export const socialNetworks = [
  'github',
  'linkedin',
  'x',
  'instagram',
  'bluesky',
  'youtube',
] as const
export type SocialNetwork = (typeof socialNetworks)[number]

export const socialLabels: Record<SocialNetwork, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X',
  instagram: 'Instagram',
  bluesky: 'Bluesky',
  youtube: 'YouTube',
}

export const siteConfigSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    wordmark: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1).max(200),
  }),
  nav: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().startsWith('/'),
      }),
    )
    .min(1),
  social: z.record(z.enum(socialNetworks), toggleLinkSchema),
  booking: toggleLinkSchema.extend({ label: z.string().min(1) }),
})

export type SiteConfig = z.infer<typeof siteConfigSchema>
export type ToggleLink = z.infer<typeof toggleLinkSchema>
