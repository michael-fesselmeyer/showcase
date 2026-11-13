import * as React from 'react'
import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'field-sizing-content min-h-40 w-full rounded-xl border border-input bg-ink-900/60 px-4 py-3.5 text-body text-paper transition-[border-color,box-shadow] duration-(--duration-fast) outline-none',
        'placeholder:text-paper-faint',
        'focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/20',
        'aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
