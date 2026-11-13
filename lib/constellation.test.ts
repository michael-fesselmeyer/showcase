import { describe, expect, it } from 'vitest'
import { projects } from '@/content/projects'
import { buildConstellation, layoutConstellation, litNodes } from '@/lib/constellation'
import type { Project } from '@/lib/projects-schema'

const base = projects[0]!
const make = (slug: string, stack: Project['stack']): Project => ({
  ...base,
  slug,
  title: slug,
  stack,
})

const graph = buildConstellation([
  make('alpha', ['nextjs', 'postgres', 'stripe']),
  make('beta', ['react', 'postgres', 'vitest']),
])

describe('buildConstellation', () => {
  it('creates one node per technology used, grouped in stack order', () => {
    expect(graph.techs.map((t) => t.id)).toEqual([
      'nextjs',
      'react',
      'postgres',
      'stripe',
      'vitest',
    ])
    expect(graph.groups.map((g) => g.id)).toEqual(['frontend', 'data', 'payments', 'testing'])
  })

  it('links each technology to the projects that use it', () => {
    expect(graph.techs.find((t) => t.id === 'postgres')?.projects).toEqual(['alpha', 'beta'])
    expect(graph.edges).toHaveLength(6)
  })

  it('omits technologies no project uses', () => {
    expect(graph.techs.some((t) => t.id === 'python')).toBe(false)
  })

  it('stays correct for the real content', () => {
    const real = buildConstellation(projects)
    const tags = new Set(projects.flatMap((p) => p.stack))
    expect(real.techs).toHaveLength(tags.size)
    expect(real.edges).toHaveLength(projects.reduce((n, p) => n + p.stack.length, 0))
  })
})

describe('layoutConstellation', () => {
  it('places every node inside the unit square', () => {
    const layout = layoutConstellation(buildConstellation(projects))
    for (const point of [...Object.values(layout.techs), ...Object.values(layout.projects)]) {
      expect(point.x).toBeGreaterThanOrEqual(0)
      expect(point.x).toBeLessThanOrEqual(1)
      expect(point.y).toBeGreaterThanOrEqual(0)
      expect(point.y).toBeLessThanOrEqual(1)
    }
  })

  it('is deterministic', () => {
    expect(layoutConstellation(graph)).toEqual(layoutConstellation(graph))
  })
})

describe('litNodes', () => {
  it('lights a technology and its projects', () => {
    expect(litNodes(graph, { kind: 'tech', id: 'postgres' })).toEqual(
      new Set(['postgres', 'alpha', 'beta']),
    )
  })

  it('lights a project and its technologies', () => {
    expect(litNodes(graph, { kind: 'project', id: 'beta' })).toEqual(
      new Set(['beta', 'react', 'postgres', 'vitest']),
    )
  })

  it('lights nothing when idle', () => {
    expect(litNodes(graph, null)).toBeNull()
  })
})
