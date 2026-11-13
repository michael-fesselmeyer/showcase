import Link from 'next/link'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { NavLinks } from '@/components/layout/nav-links'
import { Wordmark } from '@/components/layout/wordmark'

/** Fixed top bar. Stays put during page transitions (see `site-header` view transition). */
export function SiteHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 bg-linear-to-b from-ink-950/85 via-ink-950/40 to-transparent"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="shell flex h-header items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-paper px-5 text-small font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white md:inline-flex"
          >
            Start a project
          </Link>
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </header>
  )
}
