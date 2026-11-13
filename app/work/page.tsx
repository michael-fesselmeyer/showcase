import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import { RevealText } from '@/components/motion/reveal-text'
import { ProjectCard } from '@/components/work/project-card'
import { SpotlightGroup } from '@/components/work/spotlight-group'
import { allProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected websites and web apps: the problem, what was built, the stack and the results.',
}

export default function WorkPage() {
  const projects = allProjects()

  return (
    <ViewTransition>
      <div className="shell pt-[calc(var(--header-height)+clamp(3rem,8vw,7rem))]">
        <header className="grid-editorial items-end gap-y-6 border-b border-line pb-10">
          <div className="col-span-12 md:col-span-8">
            <p className="mb-6 label text-paper-muted">Work · {projects.length} projects</p>
            <h1 className="headline text-h1">
              Selected <em className="text-brand-gradient pr-[0.06em]">work</em>
            </h1>
          </div>
          <RevealText className="col-span-12 max-w-[42ch] text-lead text-paper-muted md:col-span-4">
            Sites and apps across front end, back end, payments and real time. Each one links to a
            case study with the problem, the build and the results.
          </RevealText>
        </header>

        <SpotlightGroup className="mt-16 grid gap-x-[var(--column-gap)] gap-y-20 md:grid-cols-2 md:[&>*:nth-child(even)]:mt-32">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </SpotlightGroup>
      </div>
    </ViewTransition>
  )
}
