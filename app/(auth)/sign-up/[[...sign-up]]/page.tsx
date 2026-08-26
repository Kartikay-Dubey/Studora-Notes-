import { SignUp } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-md">
      {/* Header Branding (Replicating old UI) */}
      <div className="mb-6 text-center space-y-2 select-none">
        <div className="inline-flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-accent text-accent-foreground mb-2 shadow-sm">
          <BookOpen className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Join Studora</h1>
        <p className="text-sm text-text-secondary">Start your distraction-free study workspace</p>
      </div>

      <div className="mt-4 flex justify-center w-full">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none bg-transparent w-full p-0 border-0',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'rounded-[var(--radius-md)] border-border bg-surface-raised text-text-primary hover:bg-surface transition-fast',
              formButtonPrimary: 'rounded-[var(--radius-md)] bg-accent text-accent-foreground hover:bg-accent/90 transition-fast h-10',
              formFieldInput: 'rounded-[var(--radius-md)] border-border bg-surface text-text-primary focus:ring-1 focus:ring-accent',
              formFieldLabel: 'text-text-secondary',
              dividerLine: 'bg-border',
              dividerText: 'text-text-muted',
              footerActionText: 'text-text-muted',
              footerActionLink: 'text-accent hover:text-accent/90',
            },
          }}
        />
      </div>
    </div>
  )
}
