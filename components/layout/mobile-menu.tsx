'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { isActive } from '@/lib/nav'
import { Wordmark } from '@/components/layout/wordmark'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { enabledSocialLinks } from '@/lib/site'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/site.config'

/** Full-screen menu for small screens, built on an accessible dialog. */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const social = enabledSocialLinks()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 label text-paper',
          className,
        )}
      >
        Menu
        <span aria-hidden className="flex flex-col gap-[3px]">
          <span className="block h-px w-3.5 bg-current" />
          <span className="block h-px w-3.5 bg-current" />
        </span>
      </SheetTrigger>

      <SheetContent
        side="top"
        showCloseButton={false}
        className="gap-0 border-none bg-ink-950 p-0 shadow-none data-[side=top]:h-svh"
      >
        <div className="shell flex h-header shrink-0 items-center justify-between">
          <Wordmark asText />
          <SheetClose className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 label text-paper">
            Close
          </SheetClose>
        </div>

        <SheetTitle className="sr-only">Site menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigate to a section of {siteConfig.brand.name}.
        </SheetDescription>

        <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
          <ul className="flex flex-col gap-2">
            {siteConfig.nav.map((item, index) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-baseline gap-4 rounded-sm py-1"
                  >
                    <span className="label text-paper-faint" aria-hidden>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={cn(
                        'headline text-[clamp(3rem,14vw,5.5rem)] leading-[0.95]',
                        active && 'text-brand-gradient italic',
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="shell pb-6">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex h-14 items-center justify-between rounded-full bg-paper px-7 font-medium text-ink-950"
          >
            Start a project <span aria-hidden>→</span>
          </Link>
        </div>

        {social.length > 0 && (
          <ul className="shell flex flex-wrap gap-x-6 gap-y-2 pb-8">
            {social.map((link) => (
              <li key={link.network}>
                <a
                  href={link.url}
                  className="label text-paper-muted hover:text-paper"
                  rel="me noopener"
                  target="_blank"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  )
}
