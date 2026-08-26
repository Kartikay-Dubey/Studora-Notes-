import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Textarea component following Studora design system.
 * Auto-resizable variant available via CSS resize property.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-20 w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-2',
        'text-sm text-text-primary placeholder:text-text-muted',
        'transition-default',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
