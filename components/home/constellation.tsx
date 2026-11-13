'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useMemo, useState, type CSSProperties } from 'react'
import {
  layoutConstellation,
  litNodes,
  type Constellation as Graph,
  type Point,
} from '@/lib/constellation'
import { easing } from '@/lib/motion/tokens'
import { cn } from '@/lib/utils'

type Active = { kind: 'tech' | 'project'; id: string }

const VIEW = { w: 1000, h: 800 }
const toView = (p: Point) => ({ x: p.x * VIEW.w, y: p.y * VIEW.h })
const pct = (n: number) => `${(n * 100).toFixed(2)}%`
const at = (p: Point): CSSProperties => ({ left: pct(p.x), top: pct(p.y) })

/** A gentle curve from a technology to a project, bowed toward the centre. */
function edgePath(from: Point, to: Point) {
  const a = toView(from)
  const b = toView(to)
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const c = { x: mid.x + (VIEW.w / 2 - mid.x) * 0.35, y: mid.y + (VIEW.h / 2 - mid.y) * 0.35 }
  const f = (n: number) => n.toFixed(1)
  return `M${f(a.x)},${f(a.y)} Q${f(c.x)},${f(c.y)} ${f(b.x)},${f(b.y)}`
}

/**
 * The skills constellation: technologies on an outer ring, projects inside,
 * an edge for every stack tag. Hovering or focusing a node lights its
 * connections; project nodes open their case study; technology nodes can be
 * pressed to keep their connections lit.
 *
 * The plain grouped list below is the same information. It is the layout on
 * small screens and with reduced motion, and a toggle away on large screens.
 */
export function Constellation({ graph }: { graph: Graph }) {
  const layout = useMemo(() => layoutConstellation(graph), [graph])
  const [hovered, setHovered] = useState<Active | null>(null)
  const [pinned, setPinned] = useState<Active | null>(null)
  const [view, setView] = useState<'map' | 'list'>('map')
  const active = hovered ?? pinned
  const lit = litNodes(graph, active)
  const projectTitle = (slug: string) => graph.projects.find((p) => p.id === slug)?.label ?? slug

  const focusProps = (node: Active) => ({
    onPointerEnter: () => setHovered(node),
    onPointerLeave: () => setHovered(null),
    onFocus: () => setHovered(node),
    onBlur: () => setHovered(null),
  })

  const dim = (id: string) => lit !== null && !lit.has(id)

  return (
    <div>
      <div className="mb-6 hidden justify-end lg:motion-safe:flex">
        <button
          type="button"
          onClick={() => setView(view === 'map' ? 'list' : 'map')}
          className="rounded-full border border-line-strong px-4 py-2 label text-paper-muted hover:text-paper"
        >
          {view === 'map' ? 'Show as list' : 'Show as map'}
        </button>
      </div>

      <div
        role="group"
        aria-label="Stack map: technologies and the projects that use them"
        className={cn(
          'constellation relative mx-auto hidden aspect-[5/4] max-w-6xl',
          view === 'map' && 'lg:motion-safe:block',
        )}
      >
        <svg
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id="edge-lit" x1="0" x2="1">
              <stop offset="0" stopColor="var(--brand-from)" />
              <stop offset="1" stopColor="var(--brand-to)" />
            </linearGradient>
          </defs>
          {graph.edges.map((edge, i) => {
            const on = lit?.has(edge.tech) && lit.has(edge.project)
            return (
              <motion.path
                key={`${edge.tech}-${edge.project}`}
                d={edgePath(layout.techs[edge.tech]!, layout.projects[edge.project]!)}
                fill="none"
                vectorEffect="non-scaling-stroke"
                stroke={on ? 'url(#edge-lit)' : 'var(--paper)'}
                strokeWidth={on ? 1.5 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: lit === null ? 0.22 : on ? 1 : 0.05 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  pathLength: {
                    duration: 1.4,
                    delay: 0.2 + (i % 12) * 0.04,
                    ease: [...easing.out],
                  },
                  opacity: { duration: 0.3 },
                }}
                className={on ? 'constellation-edge-lit' : undefined}
              />
            )
          })}
        </svg>

        {graph.groups.map((group) => (
          <span
            key={group.id}
            aria-hidden
            style={at(layout.groupLabels[group.id]!)}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-1/2 label text-[0.625rem] whitespace-nowrap text-paper-faint transition-opacity duration-(--duration-base)',
              lit && 'opacity-30',
            )}
          >
            {group.label}
          </span>
        ))}

        {graph.techs.map((tech) => {
          const node = { kind: 'tech', id: tech.id } as const
          const isPinned = pinned?.id === tech.id
          return (
            <button
              key={tech.id}
              type="button"
              style={at(layout.techs[tech.id]!)}
              aria-pressed={isPinned}
              aria-label={`${tech.label}: used in ${tech.projects.map(projectTitle).join(', ')}`}
              onClick={() => setPinned(isPinned ? null : node)}
              {...focusProps(node)}
              className={cn(
                // The dot sits exactly on the node's point; the label points outward.
                'group/node absolute flex -translate-y-1/2 items-center gap-2 rounded-full px-2 py-1 transition-opacity duration-(--duration-base)',
                layout.techs[tech.id]!.x < 0.5
                  ? 'translate-x-[calc(-100%+12px)] flex-row-reverse'
                  : '-translate-x-[12px]',
                dim(tech.id) && 'opacity-20',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'constellation-star size-2 rounded-full bg-paper',
                  lit?.has(tech.id) &&
                    'bg-(image:--brand-gradient) shadow-[0_0_18px_4px_var(--brand-glow)]',
                )}
              />
              <span className="text-small whitespace-nowrap text-paper-muted group-hover/node:text-paper group-focus-visible/node:text-paper">
                {tech.label}
              </span>
            </button>
          )
        })}

        {graph.projects.map((project) => {
          const node = { kind: 'project', id: project.id } as const
          return (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              transitionTypes={['nav-forward']}
              style={at(layout.projects[project.id]!)}
              {...focusProps(node)}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong bg-ink-900/90 px-4 py-2 font-display text-[1.05rem] whitespace-nowrap backdrop-blur-sm transition duration-(--duration-base)',
                lit?.has(project.id) && 'border-transparent bg-paper text-ink-950',
                dim(project.id) && 'opacity-25',
              )}
              data-cursor-label="Open"
            >
              {project.label}
            </Link>
          )
        })}
      </div>

      <div className={cn(view === 'map' && 'lg:motion-safe:hidden')}>
        <div className="grid gap-x-[var(--column-gap)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {graph.groups.map((group) => (
            <section key={group.id} aria-labelledby={`stack-${group.id}`}>
              <h3
                id={`stack-${group.id}`}
                className="border-b border-line pb-3 label text-paper-muted"
              >
                {group.label}
              </h3>
              <ul className="mt-4 space-y-4">
                {group.techs.map((id) => {
                  const tech = graph.techs.find((t) => t.id === id)!
                  return (
                    <li key={id}>
                      <p className="font-medium">{tech.label}</p>
                      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-small text-paper-muted">
                        {tech.projects.map((slug) => (
                          <li key={slug}>
                            <Link
                              href={`/work/${slug}`}
                              className="underline decoration-line-strong hover:text-paper"
                            >
                              {projectTitle(slug)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
