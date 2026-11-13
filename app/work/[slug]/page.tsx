import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { RevealText } from '@/components/motion/reveal-text'
import { ProjectMedia } from '@/components/work/project-media'
import { StackTags } from '@/components/work/stack-tags'
import { allProjects, getProject, nextProject, projectTransitionName } from '@/lib/projects'
import { stackGroupOf, stackGroups, type StackGroup, type StackId } from '@/lib/stack'

export function generateStaticParams() {
  return allProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProject(slug)
  if (!project) return {}
  return { title: project.title, description: project.summary }
}

function groupStack(stack: readonly StackId[]) {
  const groups = new Map<StackGroup, StackId[]>()
  for (const id of stack) {
    const group = stackGroupOf(id)
    groups.set(group, [...(groups.get(group) ?? []), id])
  }
  return [...groups]
}

export default async function CaseStudyPage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params
  const project = getProject(slug)
  if (!project) notFound()

  const next = nextProject(slug)
  const { caseStudy } = project

  return (
    <ViewTransition>
      <article className="pt-[calc(var(--header-height)+clamp(2rem,6vw,5rem))]">
        <div className="shell">
          <Link
            href="/work"
            transitionTypes={['nav-back']}
            className="inline-flex items-center gap-2 label text-paper-muted hover:text-paper"
          >
            <span aria-hidden>←</span> All work
          </Link>
        </div>

        <div className="shell mt-8">
          <ViewTransition name={projectTransitionName(project.slug)} share="morph" default="none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line md:aspect-[16/7]">
              <ProjectMedia
                project={project}
                variant="hero"
                sizes="100vw"
                priority
                className="size-full"
              />
            </div>
          </ViewTransition>
        </div>

        <div className="shell">
          {project.sample && (
            <p className="mt-6 max-w-2xl rounded-xl border border-line bg-ink-900 px-4 py-3 text-small text-paper-muted">
              <strong className="font-medium text-paper">Sample project.</strong> The client,
              figures and links are invented to show how a case study is presented.
            </p>
          )}

          <header className="mt-10 grid-editorial gap-y-8">
            <div className="col-span-12 lg:col-span-8">
              <p className="mb-6 label text-paper-muted">Case study · {project.year}</p>
              <h1 className="headline text-h1">{project.title}</h1>
              <RevealText className="mt-8 max-w-[46ch] text-lead text-paper-muted">
                {project.summary}
              </RevealText>
            </div>
            <dl className="col-span-12 grid grid-cols-2 gap-6 self-end text-small lg:col-span-4 lg:grid-cols-1">
              <div>
                <dt className="mb-1 label text-paper-faint">Client</dt>
                <dd>{project.client}</dd>
              </div>
              <div>
                <dt className="mb-1 label text-paper-faint">Role</dt>
                <dd>{project.role}</dd>
              </div>
            </dl>
          </header>
        </div>

        <div className="shell">
          <section
            aria-label="Results"
            className="mt-14 grid-editorial gap-y-10 border-b border-line pb-14"
          >
            {caseStudy.results.map((result) => (
              <div key={result.label} className="col-span-12 sm:col-span-4">
                <p className="text-brand-gradient headline text-h2">{result.value}</p>
                <p className="mt-2 text-paper-muted">{result.label}</p>
              </div>
            ))}
          </section>

          <section aria-labelledby="problem" className="mt-section grid-editorial gap-y-6">
            <h2 id="problem" className="col-span-12 label text-paper-muted md:col-span-3">
              01 · The problem
            </h2>
            <div className="col-span-12 space-y-6 md:col-span-8 md:col-start-5">
              {caseStudy.problem.map((paragraph) => (
                <RevealText key={paragraph} className="text-lead">
                  {paragraph}
                </RevealText>
              ))}
            </div>
          </section>

          <section aria-labelledby="built" className="mt-section grid-editorial gap-y-6">
            <h2 id="built" className="col-span-12 label text-paper-muted md:col-span-3">
              02 · What was built
            </h2>
            <div className="col-span-12 space-y-6 md:col-span-8 md:col-start-5">
              {caseStudy.built.map((paragraph) => (
                <RevealText key={paragraph} className="text-lead">
                  {paragraph}
                </RevealText>
              ))}
            </div>
          </section>

          {caseStudy.highlights.length > 0 && (
            <section aria-labelledby="highlights" className="mt-section">
              <h2 id="highlights" className="label text-paper-muted">
                03 · Highlights
              </h2>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
                {caseStudy.highlights.map((highlight) => (
                  <li key={highlight.title} className="bg-ink-950 p-8">
                    <h3 className="headline text-h3">{highlight.title}</h3>
                    <p className="mt-4 text-paper-muted">{highlight.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="stack" className="mt-section grid-editorial gap-y-8">
            <h2 id="stack" className="col-span-12 label text-paper-muted md:col-span-3">
              04 · Stack
            </h2>
            <dl className="col-span-12 grid gap-6 sm:grid-cols-2 md:col-span-8 md:col-start-5">
              {groupStack(project.stack).map(([group, ids]) => (
                <div key={group}>
                  <dt className="mb-3 text-paper">{stackGroups[group]}</dt>
                  <dd>
                    <StackTags stack={ids} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="links" className="mt-section grid-editorial gap-y-6">
            <h2 id="links" className="col-span-12 label text-paper-muted md:col-span-3">
              05 · Links
            </h2>
            <ul className="col-span-12 flex flex-wrap gap-3 md:col-span-8 md:col-start-5">
              {project.links.live && (
                <li>
                  <ProjectLink href={project.links.live} sample={project.sample}>
                    Live site
                  </ProjectLink>
                </li>
              )}
              {project.links.repo && (
                <li>
                  <ProjectLink href={project.links.repo} sample={project.sample}>
                    Repository
                  </ProjectLink>
                </li>
              )}
            </ul>
          </section>
        </div>

        {next && (
          <nav aria-label="Next project" className="mt-section border-t border-line">
            <Link
              href={`/work/${next.slug}`}
              transitionTypes={['nav-forward']}
              className="group shell block py-16"
              data-cursor-label="Next"
            >
              <span className="label text-paper-muted">Next project</span>
              <span className="mt-4 flex items-baseline justify-between gap-6 headline text-h1">
                <span className="transition-colors duration-(--duration-base) group-hover:text-brand-gradient">
                  {next.title}
                </span>
                <span
                  aria-hidden
                  className="text-h2 transition-transform duration-(--duration-base) ease-out-soft group-hover:translate-x-3"
                >
                  →
                </span>
              </span>
            </Link>
          </nav>
        )}
      </article>
    </ViewTransition>
  )
}

function ProjectLink({
  href,
  sample,
  children,
}: {
  href: string
  sample: boolean
  children: string
}) {
  const className =
    'inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 font-medium'
  if (sample) {
    return (
      <span className={`${className} text-paper-faint`} title="Sample project: no live link">
        {children} <span className="label text-[0.625rem]">(sample)</span>
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`${className} text-paper hover:border-paper`}
    >
      {children} <span aria-hidden>↗</span>
    </a>
  )
}
