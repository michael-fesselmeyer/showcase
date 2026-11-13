'use client'

import { motion, useMotionTemplate, useSpring } from 'motion/react'
import Link from 'next/link'
import { useRef, ViewTransition, type PointerEvent } from 'react'
import { ProjectMedia } from '@/components/work/project-media'
import { StackTags } from '@/components/work/stack-tags'
import { spring } from '@/lib/motion/tokens'
import { usePointerEffects } from '@/lib/motion/use-media-query'
import { projectTransitionName } from '@/lib/projects'
import type { Project } from '@/lib/projects-schema'
import { cn } from '@/lib/utils'

const MAX_TILT = 8

type ProjectCardProps = {
  project: Project
  index: number
  className?: string
}

/**
 * A project card that tilts toward the pointer with a moving sheen, previews
 * its media on hover, and morphs into the case-study hero when opened.
 * Touch and reduced motion get a flat card with the same content.
 */
export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const enabled = usePointerEffects()
  const surface = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, spring.soft)
  const rotateY = useSpring(0, spring.soft)
  const sheenX = useSpring(50, spring.soft)
  const sheenY = useSpring(50, spring.soft)
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgb(255 255 255 / 0.18), transparent 55%)`

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType !== 'mouse' || !surface.current) return
    const rect = surface.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * 2 * MAX_TILT)
    rotateX.set((0.5 - py) * 2 * MAX_TILT)
    sheenX.set(px * 100)
    sheenY.set(py * 100)
  }

  const onEnter = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget
      .querySelector<HTMLVideoElement>('video[data-preview]')
      ?.play()
      .catch(() => {})
  }

  const onLeave = (event: PointerEvent<HTMLElement>) => {
    rotateX.set(0)
    rotateY.set(0)
    const video = event.currentTarget.querySelector<HTMLVideoElement>('video[data-preview]')
    video?.pause()
  }

  return (
    <article className={cn('group relative', className)} data-cursor-label="View">
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={['nav-forward']}
        className="block rounded-2xl outline-offset-8"
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
      >
        <div className="perspective-[1200px]">
          <motion.div
            ref={surface}
            className="spotlight-card relative rounded-2xl transform-3d"
            style={{ rotateX, rotateY }}
          >
            <ViewTransition name={projectTransitionName(project.slug)} share="morph" default="none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <ProjectMedia
                  project={project}
                  variant="card"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="transition-transform duration-(--duration-slow) ease-out-soft group-hover:scale-[1.03]"
                />
              </div>
            </ViewTransition>
            {enabled && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[3] rounded-2xl opacity-0 mix-blend-soft-light transition-opacity duration-(--duration-base) group-hover:opacity-100"
                style={{ backgroundImage: sheen }}
              />
            )}
          </motion.div>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h2 className="headline text-h3">{project.title}</h2>
          <span className="shrink-0 label text-paper-faint">
            {String(index + 1).padStart(2, '0')} · {project.year}
          </span>
        </div>
        <p className="mt-2 max-w-[52ch] text-paper-muted">{project.summary}</p>
      </Link>

      <StackTags stack={project.stack} limit={5} className="mt-4" />
      {project.sample && (
        <p className="mt-3 label text-[0.625rem] text-paper-faint">Sample project</p>
      )}
    </article>
  )
}
