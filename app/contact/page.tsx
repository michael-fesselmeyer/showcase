import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import { EnquiryForm } from '@/components/contact/enquiry-form'
import { bookingLink, enabledSocialLinks } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us about your project: what you are building, your budget and your timeline.',
}

const nextSteps = [
  'A reply within two working days, with any questions.',
  'A short call to talk through goals and constraints.',
  'A written plan with scope, timeline and a fixed quote.',
]

export default function ContactPage() {
  const booking = bookingLink()
  const social = enabledSocialLinks()

  return (
    <ViewTransition>
      <div className="shell pt-[calc(var(--header-height)+clamp(3rem,8vw,7rem))]">
        <div className="grid-editorial gap-y-16">
          <div className="col-span-12 lg:col-span-5">
            <p className="mb-6 label text-paper-muted">Contact · New project</p>
            <h1 className="headline text-h1">
              Let’s make it <em className="text-brand-gradient pr-[0.06em]">unforgettable</em>.
            </h1>
            <p className="mt-8 max-w-[40ch] text-lead text-paper-muted">
              Tell us a little about the project. The more context, the better the first reply.
            </p>

            <h2 className="mt-14 mb-5 label text-paper-faint">What happens next</h2>
            <ol className="space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex gap-4 text-paper-muted">
                  <span className="pt-1 label text-paper-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            {booking && (
              <a
                href={booking.url}
                target="_blank"
                rel="noopener"
                className="group mt-12 flex items-center justify-between gap-6 rounded-2xl border border-line bg-ink-900 p-6 transition-colors hover:border-line-strong"
              >
                <span>
                  <span className="block label text-paper-faint">Prefer to talk?</span>
                  <span className="mt-2 block font-medium">{booking.label}</span>
                </span>
                <span
                  aria-hidden
                  className="text-h3 transition-transform duration-(--duration-base) ease-out-soft group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            )}

            {social.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="Elsewhere">
                {social.map((link) => (
                  <li key={link.network}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="me noopener"
                      className="text-paper-muted hover:text-paper"
                    >
                      {link.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </ViewTransition>
  )
}
