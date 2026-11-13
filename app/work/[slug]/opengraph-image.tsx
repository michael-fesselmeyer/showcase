import { allProjects, getProject } from '@/lib/projects'
import { ogContentType, ogSize, renderOgCard } from '@/lib/og'
import { stackLabel } from '@/lib/stack'

export const alt = 'Case study'
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return allProjects().map((project) => ({ slug: project.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)

  return renderOgCard({
    eyebrow: project?.sample ? 'Case study · sample' : 'Case study',
    title: project?.title ?? 'Case study',
    footer: project ? project.stack.slice(0, 5).map(stackLabel).join(' · ') : '',
  })
}
