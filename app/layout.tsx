import type { Metadata, Viewport } from 'next'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { CustomCursor } from '@/components/motion/custom-cursor'
import { FilmGrain } from '@/components/motion/film-grain'
import { introScript, OpeningSequence } from '@/components/motion/opening-sequence'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { fontVariables } from '@/lib/fonts'
import { siteUrl } from '@/lib/site'
import { siteConfig } from '@/site.config'
import './globals.css'

const { name, tagline, description } = siteConfig.brand

// Every route must be fully static. The build fails if a change would add
// request-time rendering, and unknown case-study slugs get a real 404.
export const ensureStatic = 'navigation'

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${name}: ${tagline}`, template: `%s · ${name}` },
  description,
  applicationName: name,
  openGraph: { type: 'website', siteName: name, locale: 'en', title: name, description },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0a090b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // The pre-paint script adds a class and the intro attribute to <html>.
    <html lang="en" className={`dark ${fontVariables}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body id="top">
        <OpeningSequence />
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
        <FilmGrain />
        <CustomCursor />
        <SmoothScroll />
      </body>
    </html>
  )
}
