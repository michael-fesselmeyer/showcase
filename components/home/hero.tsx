import Link from 'next/link'
import { Fragment, type CSSProperties } from 'react'
import { HeroShader } from '@/components/home/hero-shader'
import { Magnetic } from '@/components/motion/magnetic'
import { siteConfig } from '@/site.config'

type Word = { text: string; accent?: boolean }

const headline: Word[] = [
  { text: 'Websites' },
  { text: 'that' },
  { text: 'earn', accent: true },
  { text: 'the' },
  { text: 'first' },
  { text: 'impression.' },
]

const order = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * The hero. Words sit in overflow masks so the opening sequence can raise
 * them into place with CSS alone; without the sequence they are static.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden"
    >
      <HeroShader />

      <div className="shell pt-header pb-[clamp(2.5rem,6vh,5rem)]">
        <p
          data-hero-fade
          style={order(0)}
          className="mb-8 flex items-center gap-3 label text-paper-muted"
        >
          <span aria-hidden className="h-px w-10 bg-(image:--brand-gradient)" />
          Independent web development studio
        </p>

        <h1 id="hero-title" className="max-w-[14ch] headline text-h1">
          {headline.map((word, i) => (
            <Fragment key={word.text}>
              <span className="hero-word">
                <span
                  style={order(i)}
                  className={word.accent ? 'text-brand-gradient pr-[0.06em] italic' : undefined}
                >
                  {word.text}
                </span>
              </span>{' '}
            </Fragment>
          ))}
        </h1>

        <div className="mt-12 grid-editorial items-end gap-y-8">
          <p
            data-hero-fade
            style={order(4)}
            className="col-span-12 max-w-[38ch] text-lead text-paper-muted md:col-span-6"
          >
            {siteConfig.brand.tagline} Design-led sites and web apps, engineered for speed and built
            to turn visitors into clients.
          </p>
          <div
            data-hero-fade
            style={order(5)}
            className="col-span-12 flex flex-wrap gap-3 md:col-span-6 md:justify-end"
          >
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-paper px-7 font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white"
              >
                Start a project <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/work"
                className="inline-flex h-14 items-center rounded-full border border-line-strong bg-ink-950/30 px-7 font-medium text-paper backdrop-blur-sm transition-colors duration-(--duration-fast) hover:border-paper"
              >
                See the work
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
