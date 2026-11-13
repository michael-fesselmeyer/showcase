import { projects } from '@/content/projects'
import { Constellation } from '@/components/home/constellation'
import { RevealText } from '@/components/motion/reveal-text'
import { buildConstellation } from '@/lib/constellation'

/** Home section: the stack, derived from the projects that use it. */
export function Skills() {
  const graph = buildConstellation(projects)

  return (
    <section aria-labelledby="skills-title" className="shell pt-section">
      <div className="mb-14 grid-editorial items-end gap-y-6">
        <div className="col-span-12 md:col-span-7">
          <p className="mb-6 label text-paper-muted">02 · Stack</p>
          <RevealText as="h2" id="skills-title" className="headline text-h2">
            One toolkit, chosen per project.
          </RevealText>
        </div>
        <RevealText className="col-span-12 max-w-[40ch] text-paper-muted md:col-span-4 md:col-start-9">
          {`${graph.techs.length} technologies across ${graph.projects.length} projects. Each technology links to the projects that used it, and each project to its case study.`}
        </RevealText>
      </div>
      <Constellation graph={graph} />
    </section>
  )
}
