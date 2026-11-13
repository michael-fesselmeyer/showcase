import { z } from 'zod'
import { stack, type StackId } from '@/lib/stack'

const stackIds = Object.keys(stack) as [StackId, ...StackId[]]

/** Generated artwork used until a project has real screenshots. */
export const artPatterns = ['orbits', 'grid', 'waves', 'bars', 'rings', 'blocks'] as const
export type ArtPattern = (typeof artPatterns)[number]

const hex = z.string().regex(/^#[0-9a-f]{6}$/i)

const mediaSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('art'),
    pattern: z.enum(artPatterns),
    colors: z.tuple([hex, hex]),
  }),
  z.object({
    kind: z.literal('image'),
    src: z.string().startsWith('/'),
    alt: z.string().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    /** Optional short muted loop shown on hover. */
    previewVideo: z.string().startsWith('/').optional(),
  }),
])

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  client: z.string().min(1),
  /** One sentence for cards and metadata. */
  summary: z.string().min(1).max(180),
  year: z.number().int().min(2000).max(2100),
  role: z.string().min(1),
  /** Marks placeholder projects so they are always labelled as samples. */
  sample: z.boolean(),
  featured: z.boolean(),
  stack: z.array(z.enum(stackIds)).min(1),
  links: z.object({
    live: z.url().optional(),
    repo: z.url().optional(),
  }),
  media: mediaSchema,
  caseStudy: z.object({
    problem: z.array(z.string().min(1)).min(1),
    built: z.array(z.string().min(1)).min(1),
    highlights: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })),
    results: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
  }),
})

export type Project = z.infer<typeof projectSchema>
export type ProjectMedia = Project['media']
