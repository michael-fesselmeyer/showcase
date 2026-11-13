import { RevealText } from '@/components/motion/reveal-text'

const steps = [
  {
    title: 'Discover',
    duration: '1 week',
    body: 'A working session on goals, audience and constraints, then a short written plan: scope, stack, milestones and a fixed quote. No surprises later.',
  },
  {
    title: 'Design',
    duration: '1–3 weeks',
    body: 'Layouts and a small design system in the browser, not just in mockups, so motion, type and performance are judged as they will ship.',
  },
  {
    title: 'Build',
    duration: '3–8 weeks',
    body: 'Weekly previews on a live URL. Tests, accessibility checks and performance budgets run on every change, so quality is measured, not promised.',
  },
  {
    title: 'Launch and care',
    duration: 'Ongoing',
    body: 'Launch with analytics, monitoring and a handover guide. Optional care plans cover updates, improvements and the occasional emergency.',
  },
]

/** Home section: how an engagement works. */
export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="shell scroll-mt-header pt-section"
    >
      <div className="grid-editorial gap-y-12">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-[calc(var(--header-height)+2rem)]">
            <p className="mb-6 label text-paper-muted">03 · Process</p>
            <RevealText as="h2" id="process-title" className="headline text-h2">
              How a project runs.
            </RevealText>
            <RevealText className="mt-6 max-w-[36ch] text-paper-muted">
              Four steps, each with something you can see and react to. Most sites launch in six to
              twelve weeks.
            </RevealText>
          </div>
        </div>

        <ol className="col-span-12 md:col-span-6 md:col-start-7">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-t border-line py-10 first:border-t-0 first:pt-0 md:first:pt-2"
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="text-brand-gradient headline text-h2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="label text-paper-faint">{step.duration}</span>
              </div>
              <h3 className="mt-4 headline text-h3">{step.title}</h3>
              <RevealText className="mt-4 max-w-[48ch] text-paper-muted">{step.body}</RevealText>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
