import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component following Studora design system.
 * Height: 36px. Focus ring: accent color.
 * Error state via aria-invalid attribute.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[var(--radius-sm)] border border-border bg-surface-raised px-3 py-1',
          'text-sm text-text-primary placeholder:text-text-muted',
          'transition-default',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:outline-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
