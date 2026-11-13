import { RevealText } from '@/components/motion/reveal-text'
import { siteConfig } from '@/site.config'

const principles = [
  {
    title: 'Senior engineering',
    body: 'Every line is written and reviewed by an experienced engineer. No hand-offs to juniors mid-project.',
  },
  {
    title: 'Fast by contract',
    body: 'Performance budgets are agreed up front and checked automatically on every change.',
  },
  {
    title: 'Accessible by default',
    body: 'Keyboard support, contrast and screen-reader checks are part of the build, not an audit at the end.',
  },
]

/** Home section: a short about. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="shell scroll-mt-header pt-section">
      <p className="mb-6 label text-paper-muted">04 · About</p>
      <h2 id="about-title" className="sr-only">
        About {siteConfig.brand.name}
      </h2>
      <RevealText className="max-w-[22ch] headline text-h2">
        {`${siteConfig.brand.name} is a small, independent studio for teams who want a website that feels as considered as their product.`}
      </RevealText>

      <div className="mt-16 grid-editorial gap-y-10 border-t border-line pt-10">
        <RevealText className="col-span-12 max-w-[44ch] text-lead text-paper-muted md:col-span-5">
          Design and engineering live in one place, so ideas survive contact with the browser and
          nothing is lost in a hand-off.
        </RevealText>
        <ul className="col-span-12 grid gap-8 sm:grid-cols-3 md:col-span-7">
          {principles.map((item) => (
            <li key={item.title}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-small text-paper-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
