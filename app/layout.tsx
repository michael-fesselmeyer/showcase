import type { Metadata, Viewport } from 'next'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { fontVariables } from '@/lib/fonts'
import { siteUrl } from '@/lib/site'
import { siteConfig } from '@/site.config'
import './globals.css'

const { name, tagline, description } = siteConfig.brand

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${name}: ${tagline}`, template: `%s · ${name}` },
  description,
  applicationName: name,
}

export const viewport: Viewport = {
  themeColor: '#0a090b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`dark ${fontVariables}`}>
      <body id="top">
        <a
          href="#main"
          className="fixed top-3 left-3 z-50 -translate-y-20 rounded-full bg-paper px-4 py-2.5 label text-ink-950 transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
