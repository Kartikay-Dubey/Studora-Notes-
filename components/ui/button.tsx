import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:bg-accent-hover',
        secondary:
          'border border-border bg-surface-raised text-text-primary shadow-sm hover:bg-surface hover:border-border-strong',
        ghost:
          'text-text-secondary hover:bg-surface hover:text-text-primary',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        link:
          'text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-xs [&_svg]:size-3.5',
        md: 'h-9 rounded-[var(--radius-md)] px-4 text-sm [&_svg]:size-4',
        lg: 'h-10 rounded-[var(--radius-md)] px-5 text-sm [&_svg]:size-4',
        icon: 'size-9 rounded-[var(--radius-md)] [&_svg]:size-4',
        'icon-sm': 'size-8 rounded-[var(--radius-sm)] [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button component with variant and size support.
 * Follows Studora design system: primary, secondary, ghost, destructive, link.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
