import { SignIn } from '@clerk/nextjs'
import { StudoraMark } from '@/components/shared/StudoraLogo'

export default function SignInPage() {
  return (
    <div className="w-full rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:p-8 shadow-sm">
      {/* Header Branding */}
      <div className="mb-6 text-center space-y-2 select-none">
        <div className="flex justify-center mb-1">
          <StudoraMark size={44} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Welcome back</h1>
        <p className="text-xs sm:text-sm text-text-secondary">Continue your distraction-free study workspace</p>
      </div>

      <div className="flex justify-center w-full">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: 'w-full',
              cardBox: 'w-full shadow-none',
              card: 'shadow-none bg-transparent w-full p-0 border-0',
              header: 'hidden',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'rounded-[var(--radius-md)] border-border bg-surface-raised text-text-primary hover:bg-surface transition-fast h-10',
              formButtonPrimary: 'rounded-[var(--radius-md)] bg-accent text-accent-foreground hover:bg-accent/90 transition-fast h-10 font-semibold',
              formFieldInput: 'rounded-[var(--radius-md)] border-border bg-surface text-text-primary focus:ring-1 focus:ring-accent h-10',
              formFieldLabel: 'text-xs font-semibold text-text-secondary',
              dividerLine: 'bg-border',
              dividerText: 'text-xs text-text-muted',
              footerActionText: 'text-xs text-text-muted',
              footerActionLink: 'text-xs font-semibold text-accent hover:text-accent/90',
            },
          }}
        />
      </div>
    </div>
  )
}
