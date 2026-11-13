import { budgets, projectTypes, timelines, type Enquiry } from '@/lib/enquiry/schema'

/**
 * Sends a validated enquiry somewhere a person will read it.
 *
 * Delivery is not wired up yet: the only implementation logs a redacted
 * summary on the server, so submissions do not reach anyone. To go live,
 * replace `deliverEnquiry` with an implementation for an email provider
 * (for example Resend) and keep the same signature; nothing else changes.
 */
export type DeliverEnquiry = (enquiry: Enquiry) => Promise<void>

/** Keeps the domain, hides the mailbox: enough to debug, not enough to leak. */
export function redactEmail(email: string) {
  const [local = '', domain = ''] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

export const logEnquiry: DeliverEnquiry = async (enquiry) => {
  console.info('[enquiry] received (not delivered: no provider configured)', {
    from: redactEmail(enquiry.email),
    projectType: projectTypes[enquiry.projectType],
    budget: budgets[enquiry.budget],
    timeline: timelines[enquiry.timeline],
    detailsLength: enquiry.details.length,
  })
}

export const deliverEnquiry: DeliverEnquiry = logEnquiry
