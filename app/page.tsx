import Link from 'next/link'
import { siteConfig } from '@/site.config'

export default function HomePage() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative shell flex min-h-svh flex-col justify-end pt-header pb-[clamp(2.5rem,6vh,5rem)]"
    >
      <p className="mb-8 flex items-center gap-3 label text-paper-muted">
        <span aria-hidden className="h-px w-10 bg-(image:--brand-gradient)" />
        Independent web development studio
      </p>

      <h1 id="hero-title" className="max-w-[14ch] headline text-h1">
        Websites that <em className="text-brand-gradient pr-[0.06em]">earn</em> the first
        impression.
      </h1>

      <div className="mt-12 grid-editorial items-end gap-y-8">
        <p className="col-span-12 max-w-[38ch] text-lead text-paper-muted md:col-span-6">
          {siteConfig.brand.tagline} Design-led sites and web apps, engineered for speed and built
          to turn visitors into clients.
        </p>
        <div className="col-span-12 flex flex-wrap gap-3 md:col-span-6 md:justify-end">
          <Link
            href="/contact"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-paper px-7 font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white"
          >
            Start a project <span aria-hidden>→</span>
          </Link>
          <Link
            href="/work"
            className="inline-flex h-14 items-center rounded-full border border-line-strong px-7 font-medium text-paper transition-colors duration-(--duration-fast) hover:border-paper"
          >
            See the work
          </Link>
        </div>
      </div>
    </section>
  )
}
