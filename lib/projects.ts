import { projects } from '@/content/projects'
import type { Project } from '@/lib/projects-schema'

/** Projects in display order: newest first, original order within a year. */
export function allProjects(list: Project[] = projects): Project[] {
  return list
    .map((project, index) => ({ project, index }))
    .sort((a, b) => b.project.year - a.project.year || a.index - b.index)
    .map(({ project }) => project)
}

export function featuredProjects(list: Project[] = projects): Project[] {
  return allProjects(list).filter((project) => project.featured)
}

export function getProject(slug: string, list: Project[] = projects): Project | undefined {
  return list.find((project) => project.slug === slug)
}

/** The next project in display order, wrapping around, for case-study footers. */
export function nextProject(slug: string, list: Project[] = projects): Project | undefined {
  const ordered = allProjects(list)
  const index = ordered.findIndex((project) => project.slug === slug)
  if (index === -1 || ordered.length < 2) return undefined
  return ordered[(index + 1) % ordered.length]
}

/** Shared view-transition name linking a project's card to its case-study hero. */
export const projectTransitionName = (slug: string) => `project-${slug}`
