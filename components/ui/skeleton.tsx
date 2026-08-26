import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton loading placeholder.
 * Used in loading states instead of spinners (per design system).
 * Renders as a pulsing rounded rectangle.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-surface',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
