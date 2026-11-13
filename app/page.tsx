import { About } from '@/components/home/about'
import { ContactCta } from '@/components/home/contact-cta'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { SelectedWork } from '@/components/home/selected-work'
import { Skills } from '@/components/home/skills'
import { VelocityMarquee } from '@/components/home/velocity-marquee'
import { projects } from '@/content/projects'
import { stackLabel } from '@/lib/stack'

const services = [
  'Marketing sites',
  'Web apps',
  'E-commerce',
  'Design systems',
  'Performance',
  'Accessibility',
]

export default function HomePage() {
  const stack = [...new Set(projects.flatMap((p) => p.stack))].slice(0, 10).map(stackLabel)

  return (
    <>
      <Hero />
      <SelectedWork />
      <VelocityMarquee
        label="Services and stack"
        bands={[
          { items: services, direction: 1 },
          { items: stack, direction: -1, outlined: true },
        ]}
      />
      <Skills />
      <Process />
      <About />
      <ContactCta />
    </>
  )
}
