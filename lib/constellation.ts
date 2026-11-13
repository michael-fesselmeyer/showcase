import type { Project } from '@/lib/projects-schema'
import { stack, stackGroups, type StackGroup, type StackId } from '@/lib/stack'

export type TechNode = {
  kind: 'tech'
  id: StackId
  label: string
  group: StackGroup
  projects: string[]
}

export type ProjectNode = {
  kind: 'project'
  id: string
  label: string
  techs: StackId[]
}

export type Constellation = {
  techs: TechNode[]
  projects: ProjectNode[]
  edges: { tech: StackId; project: string }[]
  groups: { id: StackGroup; label: string; techs: StackId[] }[]
}

const groupOrder = Object.keys(stackGroups) as StackGroup[]
const stackOrder = Object.keys(stack) as StackId[]

/**
 * Builds the skills graph from the projects' stack tags: one node per
 * technology actually used, one per project, and an edge for every tag.
 * Technologies keep the order and grouping defined in `lib/stack.ts`.
 */
export function buildConstellation(projects: Project[]): Constellation {
  const used = new Map<StackId, string[]>()
  for (const project of projects) {
    for (const id of project.stack) {
      used.set(id, [...(used.get(id) ?? []), project.slug])
    }
  }

  const techs: TechNode[] = stackOrder
    .filter((id) => used.has(id))
    .sort((a, b) => groupOrder.indexOf(stack[a].group) - groupOrder.indexOf(stack[b].group))
    .map((id) => ({
      kind: 'tech',
      id,
      label: stack[id].label,
      group: stack[id].group,
      projects: used.get(id)!,
    }))

  const groups = groupOrder
    .map((id) => ({
      id,
      label: stackGroups[id],
      techs: techs.filter((t) => t.group === id).map((t) => t.id),
    }))
    .filter((group) => group.techs.length > 0)

  return {
    techs,
    projects: projects.map((p) => ({
      kind: 'project',
      id: p.slug,
      label: p.title,
      techs: [...p.stack],
    })),
    edges: projects.flatMap((p) => p.stack.map((tech) => ({ tech, project: p.slug }))),
    groups,
  }
}

export type Point = { x: number; y: number }

export type ConstellationLayout = {
  techs: Record<string, Point>
  projects: Record<string, Point>
  groupLabels: Record<string, Point>
}

/**
 * Places nodes on two ellipses in a unit square: projects on the inner one,
 * technologies on the outer one, grouped into sectors with a gap between
 * groups. Deterministic, so server and client agree and nothing jumps.
 */
export function layoutConstellation(graph: Constellation): ConstellationLayout {
  const cx = 0.5
  const cy = 0.5
  // Rounded so the server and the browser, whose trig functions can differ in
  // the last digits, render identical markup.
  const round = (n: number) => Math.round(n * 1e4) / 1e4
  const on = (angle: number, rx: number, ry: number): Point => ({
    x: round(cx + Math.cos(angle) * rx),
    y: round(cy + Math.sin(angle) * ry),
  })

  const projects: Record<string, Point> = {}
  graph.projects.forEach((project, i) => {
    const angle = -Math.PI / 2 + (i / graph.projects.length) * Math.PI * 2
    projects[project.id] = on(angle, 0.24, 0.22)
  })

  // Outer ring: one slot per technology plus a gap slot between groups.
  const gap = 1.2
  const slots = graph.techs.length + gap * graph.groups.length
  const step = (Math.PI * 2) / slots
  const techs: Record<string, Point> = {}
  const groupLabels: Record<string, Point> = {}
  let cursor = -Math.PI / 2 + step * (gap / 2)

  for (const group of graph.groups) {
    const start = cursor
    for (const id of group.techs) {
      techs[id] = on(cursor, 0.42, 0.44)
      cursor += step
    }
    const middle = (start + cursor - step) / 2
    groupLabels[group.id] = on(middle, 0.335, 0.345)
    cursor += step * gap
  }

  return { techs, projects, groupLabels }
}

/** Which nodes light up when `active` is hovered or focused. */
export function litNodes(
  graph: Constellation,
  active: { kind: 'tech' | 'project'; id: string } | null,
) {
  if (!active) return null
  if (active.kind === 'tech') {
    const tech = graph.techs.find((t) => t.id === active.id)
    return new Set<string>([active.id, ...(tech?.projects ?? [])])
  }
  const project = graph.projects.find((p) => p.id === active.id)
  return new Set<string>([active.id, ...(project?.techs ?? [])])
}
