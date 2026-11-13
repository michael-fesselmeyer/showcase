import type { MetadataRoute } from 'next'
import { allProjects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl()
  const url = (path: string) => new URL(path, origin).toString()

  return [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/work'), changeFrequency: 'monthly', priority: 0.8 },
    ...allProjects().map((project) => ({
      url: url(`/work/${project.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.7 },
  ]
}
