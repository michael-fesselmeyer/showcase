'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isActive } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/site.config'

/** Desktop navigation: numbered links, current page marked for assistive tech. */
export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <ul className={cn('flex items-center gap-8', className)}>
      {siteConfig.nav.map((item, index) => {
        const active = isActive(pathname, item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative inline-flex items-baseline gap-1.5 rounded-sm py-1 text-small transition-colors duration-(--duration-fast)',
                active ? 'text-paper' : 'text-paper-muted hover:text-paper',
              )}
            >
              <span className="label text-[0.625rem] text-paper-faint" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.label}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-0 -bottom-0.5 h-px origin-left bg-(image:--brand-gradient) transition-transform duration-(--duration-base) ease-out-soft',
                  active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
