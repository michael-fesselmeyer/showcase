import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { allProjects, featuredProjects, getProject, nextProject } from '@/lib/projects'
import { projectSchema, type Project } from '@/lib/projects-schema'

const base = projects[0]!
const make = (slug: string, year: number, featured = false): Project => ({
  ...base,
  slug,
  year,
  featured,
})

describe('projects content', () => {
  it.each(projects.map((p) => [p.slug, p] as const))('%s matches the schema', (_, project) => {
    expect(() => projectSchema.parse(project)).not.toThrow()
  })

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has at least three featured projects for the gallery', () => {
    expect(featuredProjects().length).toBeGreaterThanOrEqual(3)
  })

  it('labels every sample client as a sample', () => {
    for (const project of projects.filter((p) => p.sample)) {
      expect(project.client).toMatch(/\(sample\)/)
    }
  })
})

describe('project helpers', () => {
  const list = [make('a', 2024), make('b', 2026, true), make('c', 2025, true), make('d', 2026)]

  it('orders newest first, keeping file order within a year', () => {
    expect(allProjects(list).map((p) => p.slug)).toEqual(['b', 'd', 'c', 'a'])
  })

  it('filters featured projects in display order', () => {
    expect(featuredProjects(list).map((p) => p.slug)).toEqual(['b', 'c'])
  })

  it('finds a project by slug', () => {
    expect(getProject('c', list)?.slug).toBe('c')
    expect(getProject('missing', list)).toBeUndefined()
  })

  it('returns the next project and wraps around', () => {
    expect(nextProject('b', list)?.slug).toBe('d')
    expect(nextProject('a', list)?.slug).toBe('b')
    expect(nextProject('missing', list)).toBeUndefined()
  })
})
