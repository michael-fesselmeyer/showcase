import type { Metadata } from 'next'
import Link from 'next/link'
import { Magnetic } from '@/components/motion/magnetic'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_25%,color-mix(in_oklab,var(--brand-to)_30%,transparent),transparent_70%),radial-gradient(45%_50%_at_100%_80%,color-mix(in_oklab,var(--brand-from)_26%,transparent),transparent_72%)]"
      />
      <div className="shell pt-header pb-[clamp(2.5rem,8vh,6rem)]">
        <p aria-hidden className="text-brand-gradient headline text-mega italic select-none">
          404
        </p>
        <h1 id="not-found-title" className="mt-6 max-w-[16ch] headline text-h2">
          This page took a different route.
        </h1>
        <p className="mt-6 max-w-[42ch] text-lead text-paper-muted">
          The link may be old, or the page may have moved. The work and the way in are both close
          by.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <Link
              href="/"
              className="inline-flex h-14 items-center rounded-full bg-paper px-7 font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white"
            >
              Back to home
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/work"
              className="inline-flex h-14 items-center rounded-full border border-line-strong px-7 font-medium text-paper transition-colors duration-(--duration-fast) hover:border-paper"
            >
              See the work
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
