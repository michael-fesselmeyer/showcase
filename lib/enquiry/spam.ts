/** Name of the hidden field humans never fill in. */
export const HONEYPOT_FIELD = 'website'

/** Name of the hidden field holding when the form was first shown (ms since epoch). */
export const STARTED_AT_FIELD = 'startedAt'

/** Real people take longer than this to fill the form in. */
export const MIN_FILL_MS = 3000

type SpamSignals = {
  honeypot: FormDataEntryValue | null
  startedAt: FormDataEntryValue | null
  now: number
}

/**
 * Cheap bot checks that never bother a real visitor:
 * - a honeypot field hidden from people but tempting to form-filling bots;
 * - a minimum time between the form appearing and being submitted.
 *
 * The timestamp is set in the browser, so without JavaScript only the
 * honeypot applies. A missing or garbled timestamp is not treated as spam.
 */
export function isLikelySpam({ honeypot, startedAt, now }: SpamSignals): boolean {
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return true

  const started = typeof startedAt === 'string' ? Number(startedAt) : NaN
  if (Number.isFinite(started) && started > 0 && now - started < MIN_FILL_MS) return true

  return false
}
