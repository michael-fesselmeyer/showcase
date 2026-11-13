import type { SiteConfig } from '@/lib/site-config-schema'

/**
 * Site-wide settings. Brand, navigation, social profiles and the booking link
 * all live here so they can change without touching a component.
 *
 * The brand below is a placeholder. Swap `name`, `wordmark` and `tagline`
 * for the real brand before launch.
 */
export const siteConfig = {
  brand: {
    name: 'Halftone Studio',
    wordmark: 'halftone',
    tagline: 'Websites with a point of view.',
    description:
      'Independent web development studio. Fast, considered websites and web apps, designed and engineered end to end.',
  },

  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Process', href: '/#process' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/contact' },
  ],

  // Only enabled profiles render. Set `url` to the real profile and flip
  // `enabled` to show one in the footer and on the contact page.
  social: {
    github: { url: 'https://github.com/', enabled: false },
    linkedin: { url: 'https://www.linkedin.com/', enabled: false },
    x: { url: 'https://x.com/', enabled: false },
    instagram: { url: 'https://www.instagram.com/', enabled: false },
    bluesky: { url: 'https://bsky.app/', enabled: false },
    youtube: { url: 'https://www.youtube.com/', enabled: false },
  },

  // Shown on the contact page next to the form when enabled.
  booking: {
    label: 'Book a 20-minute intro call',
    url: 'https://booking.example.test/intro',
    enabled: false,
  },
} satisfies SiteConfig
