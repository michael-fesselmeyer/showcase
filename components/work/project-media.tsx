import Image from 'next/image'
import { ProjectArt } from '@/components/work/project-art'
import type { Project } from '@/lib/projects-schema'
import { cn } from '@/lib/utils'

type ProjectMediaProps = {
  project: Project
  /** Distinguishes several renders of one project on a page (gradient ids). */
  variant: string
  sizes: string
  priority?: boolean
  className?: string
}

/**
 * A project's cover: generated art for samples, or a screenshot with an
 * optional muted preview loop. The parent reserves the aspect ratio, so
 * nothing shifts while images load.
 */
export function ProjectMedia({ project, variant, sizes, priority, className }: ProjectMediaProps) {
  const { media } = project

  if (media.kind === 'art') {
    return (
      <ProjectArt
        id={`${project.slug}-${variant}`}
        pattern={media.pattern}
        colors={media.colors}
        className={className}
      />
    )
  }

  return (
    <div className={cn('relative size-full bg-ink-900', className)}>
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className="size-full object-cover"
      />
      {media.previewVideo && (
        <video
          data-preview
          src={media.previewVideo}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-(--duration-base) group-hover:opacity-100"
        />
      )}
    </div>
  )
}
