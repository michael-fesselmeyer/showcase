import Link from 'next/link'
import { Magnetic } from '@/components/motion/magnetic'
import { RevealText } from '@/components/motion/reveal-text'

/** Home section: the closing call to action before the footer. */
export function ContactCta() {
  return (
    <section aria-labelledby="cta-title" className="shell pt-section">
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-line px-6 py-20 text-center md:py-32">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_120%,var(--brand-glow),transparent_70%)]"
        />
        <p className="label text-paper-muted">05 · Start a project</p>
        <RevealText as="h2" id="cta-title" className="mx-auto mt-6 max-w-[16ch] headline text-h1">
          Have something in mind?
        </RevealText>
        <p className="mx-auto mt-8 max-w-[44ch] text-lead text-paper-muted">
          Share a few details and you will have a reply within two working days.
        </p>
        <div className="mt-12 flex justify-center">
          <Magnetic strength={0.4}>
            <Link
              href="/contact"
              className="inline-flex h-16 items-center gap-3 rounded-full bg-paper px-9 text-lead font-medium text-ink-950 transition-colors duration-(--duration-fast) hover:bg-white"
            >
              Start a project <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
