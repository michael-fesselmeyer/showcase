import { z } from 'zod'

export const projectTypes = {
  'marketing-site': 'Marketing site',
  'web-app': 'Web app',
  'e-commerce': 'E-commerce',
  redesign: 'Redesign',
  other: 'Something else',
} as const

export const budgets = {
  'under-10k': 'Under $10k',
  '10k-25k': '$10k–25k',
  '25k-50k': '$25k–50k',
  '50k-plus': '$50k+',
  'not-sure': 'Not sure yet',
} as const

export const timelines = {
  asap: 'As soon as possible',
  '1-3-months': '1–3 months',
  '3-6-months': '3–6 months',
  flexible: 'Flexible',
} as const

const keys = <T extends Record<string, string>>(o: T) => Object.keys(o) as [keyof T & string]

/** What a visitor submits. Messages are written to be shown next to the field. */
export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(100, 'That name is too long.'),
  email: z.string().trim().max(200).pipe(z.email('Please enter a valid email address.')),
  projectType: z.enum(keys(projectTypes), 'Please choose a project type.'),
  budget: z.enum(keys(budgets), 'Please choose a budget range.'),
  timeline: z.enum(keys(timelines), 'Please choose a timeline.'),
  details: z
    .string()
    .trim()
    .min(20, 'A couple of sentences helps: at least 20 characters.')
    .max(4000, 'Please keep it under 4,000 characters.'),
})

export type Enquiry = z.infer<typeof enquirySchema>
export type EnquiryField = keyof Enquiry

export const enquiryFields = Object.keys(enquirySchema.shape) as EnquiryField[]
