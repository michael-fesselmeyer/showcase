import { ogContentType, ogSize, renderOgCard } from '@/lib/og'
import { siteConfig } from '@/site.config'

export const alt = `${siteConfig.brand.name}: ${siteConfig.brand.tagline}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgCard({
    eyebrow: 'Web development studio',
    title: 'Websites that',
    accent: 'earn the first impression.',
    footer: siteConfig.brand.tagline,
  })
}
