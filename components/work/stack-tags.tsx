import { stackLabel, type StackId } from '@/lib/stack'
import { cn } from '@/lib/utils'

type StackTagsProps = {
  stack: readonly StackId[]
  /** Show at most this many, with a "+n" for the rest. */
  limit?: number
  className?: string
}

export function StackTags({ stack, limit, className }: StackTagsProps) {
  const shown = limit ? stack.slice(0, limit) : stack
  const hidden = stack.length - shown.length

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Stack">
      {shown.map((id) => (
        <li
          key={id}
          className="rounded-full border border-line px-2.5 py-1 label text-[0.625rem] text-paper-muted"
        >
          {stackLabel(id)}
        </li>
      ))}
      {hidden > 0 && (
        <li className="rounded-full px-1.5 py-1 label text-[0.625rem] text-paper-faint">
          +{hidden}
          <span className="sr-only"> more</span>
        </li>
      )}
    </ul>
  )
}
