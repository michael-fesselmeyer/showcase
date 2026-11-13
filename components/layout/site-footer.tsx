import { cacheLife } from 'next/cache'
import Link from 'next/link'
import { Wordmark } from '@/components/layout/wordmark'
import { enabledSocialLinks } from '@/lib/site'
import { siteConfig } from '@/site.config'

async function CopyrightYear() {
  'use cache'
  cacheLife('days')
  return <>{new Date().getFullYear()}</>
}

export function SiteFooter() {
  const social = enabledSocialLinks()

  return (
    <footer className="relative mt-section overflow-hidden border-t border-line pt-16 pb-8">
      <div className="shell">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-12 md:col-span-5">
            <p className="max-w-sm text-paper-muted">{siteConfig.brand.description}</p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-7">
            <h2 className="mb-4 label text-paper-faint">Pages</h2>
            <ul className="flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper-muted hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {social.length > 0 && (
            <div className="col-span-6 md:col-span-2">
              <h2 className="mb-4 label text-paper-faint">Elsewhere</h2>
              <ul className="flex flex-col gap-2">
                {social.map((link) => (
                  <li key={link.network}>
                    <a
                      href={link.url}
                      className="text-paper-muted hover:text-paper"
                      rel="me noopener"
                      target="_blank"
                    >
                      {link.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-span-12 md:col-span-2 md:col-start-11 md:text-right">
            <h2 className="mb-4 label text-paper-faint">New project</h2>
            <Link href="/contact" className="text-brand-gradient font-medium">
              Start an enquiry →
            </Link>
          </div>
        </div>

        <div aria-hidden className="mt-20">
          <Wordmark
            asText
            className="block text-[clamp(5rem,24vw,26rem)] leading-[0.8] tracking-[-0.06em] text-ink-800 select-none"
          />
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-line pt-6 text-small text-paper-faint sm:flex-row">
          <p>
            © <CopyrightYear /> {siteConfig.brand.name}
          </p>
          <a href="#top" className="hover:text-paper">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
