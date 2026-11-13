import Link from 'next/link'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/site.config'

type WordmarkProps = {
  className?: string
  /** Render as plain text instead of a home link. */
  asText?: boolean
}

/** The brand wordmark: the display face in italic, finished with a gradient dot. */
export function Wordmark({ className, asText = false }: WordmarkProps) {
  const mark = (
    <span
      className={cn(
        'font-display text-[1.375rem] leading-none tracking-[-0.03em] italic',
        '[font-variation-settings:"opsz"_72,"SOFT"_50]',
        className,
      )}
    >
      {siteConfig.brand.wordmark}
      <span className="text-brand-gradient not-italic">.</span>
    </span>
  )

  if (asText) return mark

  return (
    <Link
      href="/"
      className="inline-flex items-center rounded-sm"
      aria-label={`${siteConfig.brand.name}, home`}
    >
      {mark}
    </Link>
  )
}
