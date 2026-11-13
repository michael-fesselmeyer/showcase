'use server'

import { handleEnquiry, type EnquiryState } from '@/lib/enquiry/handle'

/** The site's only server code: receives the enquiry form. */
export async function submitEnquiry(_previous: EnquiryState, formData: FormData) {
  return handleEnquiry(formData)
}
