import Link from 'next/link'
import { FeaturedGallery } from '@/components/home/featured-gallery'
import { RevealText } from '@/components/motion/reveal-text'
import { featuredProjects } from '@/lib/projects'

/** Home section: heading plus the pinned gallery of featured projects. */
export function SelectedWork() {
  const projects = featuredProjects()

  return (
    <section aria-labelledby="selected-work" className="pt-section">
      <div className="shell grid-editorial items-end gap-y-6">
        <div className="col-span-12 md:col-span-8">
          <p className="mb-6 label text-paper-muted">01 · Selected work</p>
          <RevealText as="h2" id="selected-work" className="headline text-h2">
            Recent projects, built to be used and to last.
          </RevealText>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border-b border-line-strong pb-1 font-medium hover:border-paper"
          >
            All work <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
      <FeaturedGallery projects={projects} />
    </section>
  )
}
