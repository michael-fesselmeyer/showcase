import { deliverEnquiry, type DeliverEnquiry } from '@/lib/enquiry/deliver'
import { enquiryFields, enquirySchema, type EnquiryField } from '@/lib/enquiry/schema'
import { HONEYPOT_FIELD, isLikelySpam, STARTED_AT_FIELD } from '@/lib/enquiry/spam'

export type EnquiryValues = Partial<Record<EnquiryField, string>>

export type EnquiryState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      message: string
      fieldErrors: Partial<Record<EnquiryField, string>>
      /** What was submitted, so the form can be refilled (also without JavaScript). */
      values: EnquiryValues
    }

export const initialEnquiryState: EnquiryState = { status: 'idle' }

type Dependencies = { deliver?: DeliverEnquiry; now?: number }

/**
 * Validates and delivers one enquiry. People get field-level errors with
 * their input intact; submissions that pass validation but look automated
 * get a normal-looking success, so bots learn nothing, and are dropped.
 */
export async function handleEnquiry(
  formData: FormData,
  { deliver = deliverEnquiry, now = Date.now() }: Dependencies = {},
): Promise<EnquiryState> {
  const values: EnquiryValues = {}
  for (const field of enquiryFields) {
    const value = formData.get(field)
    values[field] = typeof value === 'string' ? value : ''
  }

  const parsed = enquirySchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: Partial<Record<EnquiryField, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as EnquiryField
      fieldErrors[field] ??= issue.message
    }
    const count = Object.keys(fieldErrors).length
    return {
      status: 'error',
      message:
        count === 1
          ? 'Please check the highlighted field.'
          : `Please check the ${count} highlighted fields.`,
      fieldErrors,
      values,
    }
  }

  // Spam checks run only on otherwise valid submissions, so a person who
  // presses send early still sees what is missing instead of a false success.
  const signals = {
    honeypot: formData.get(HONEYPOT_FIELD),
    startedAt: formData.get(STARTED_AT_FIELD),
    now,
  }
  if (isLikelySpam(signals)) return { status: 'success' }

  try {
    await deliver(parsed.data)
  } catch (error) {
    console.error('[enquiry] delivery failed', error)
    return {
      status: 'error',
      message: 'Something went wrong sending your enquiry. Please try again in a moment.',
      fieldErrors: {},
      values,
    }
  }

  return { status: 'success' }
}
