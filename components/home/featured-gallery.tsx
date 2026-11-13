'use client'

import Link from 'next/link'
import { useRef, ViewTransition } from 'react'
import { ProjectMedia } from '@/components/work/project-media'
import { StackTags } from '@/components/work/stack-tags'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { projectTransitionName } from '@/lib/projects'
import type { Project } from '@/lib/projects-schema'

/** Where the pinned, scroll-driven version runs. Everywhere else is a native swipe row. */
const PINNED = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

/**
 * Featured projects in a horizontal row. On larger screens with motion
 * allowed, the section pins and the row slides sideways as you scroll, then
 * releases. On phones and with reduced motion it is a native, swipeable
 * scroll-snap row. Keyboard focus always brings the focused project into view.
 */
export function FeaturedGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(PINNED, () => {
        const row = track.current!
        const distance = () => Math.max(0, row.scrollWidth - row.clientWidth)

        const tween = gsap.to(row, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current?.style.setProperty('transform', `scaleX(${self.progress})`)
            },
          },
        })
        trigger.current = tween.scrollTrigger ?? null

        return () => {
          trigger.current = null
        }
      })
      return () => mm.revert()
    },
    { scope: section },
  )

  // When the row is pinned, translated items are off screen; scroll the page
  // to the point where the focused project is in view.
  const onFocus = (event: React.FocusEvent<HTMLUListElement>) => {
    const st = trigger.current
    const row = track.current
    const item = (event.target as HTMLElement).closest('li')
    if (!st || !row || !item) return
    const distance = row.scrollWidth - row.clientWidth
    if (distance <= 0) return
    const ratio = Math.min(1, item.offsetLeft / distance)
    window.scrollTo({ top: st.start + (st.end - st.start) * ratio, behavior: 'instant' })
  }

  return (
    <div
      ref={section}
      className="relative flex flex-col justify-center overflow-hidden py-12 md:min-h-svh md:py-16"
    >
      <ul
        ref={track}
        data-gallery
        onFocus={onFocus}
        className="flex snap-x snap-mandatory scroll-px-gutter [scrollbar-width:none] gap-[var(--column-gap)] overflow-x-auto px-gutter md:overflow-visible motion-reduce:md:overflow-x-auto"
      >
        {projects.map((project, index) => (
          <li
            key={project.slug}
            className="group w-[min(84vw,58rem)] shrink-0 snap-start md:w-[min(84vw,58rem,calc((100svh-15rem)*1.6))]"
            data-cursor-label="View"
          >
            <Link
              href={`/work/${project.slug}`}
              transitionTypes={['nav-forward']}
              className="block rounded-2xl outline-offset-8"
            >
              <ViewTransition
                name={projectTransitionName(project.slug)}
                share="morph"
                default="none"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line md:aspect-[16/10]">
                  <ProjectMedia
                    project={project}
                    variant="gallery"
                    sizes="(min-width: 768px) 58rem, 84vw"
                    className="transition-transform duration-(--duration-slower) ease-out-soft group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-5 left-5 rounded-full bg-ink-950/60 px-3 py-1.5 label text-paper backdrop-blur-sm">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(projects.length).padStart(2, '0')}
                  </span>
                </div>
              </ViewTransition>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <h3 className="headline text-h2">{project.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-paper-muted">{project.summary}</p>
                </div>
                <span className="label text-paper-faint">
                  {project.year}
                  {project.sample && ' · Sample'}
                </span>
              </div>
            </Link>
            <StackTags stack={project.stack} limit={4} className="mt-4" />
          </li>
        ))}
      </ul>

      <div aria-hidden className="shell mt-10 hidden md:motion-safe:block">
        <div className="h-px bg-line">
          <div ref={progress} className="h-px origin-left scale-x-0 bg-(image:--brand-gradient)" />
        </div>
      </div>
    </div>
  )
}
