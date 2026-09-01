import Link from 'next/link'
import { StudoraLogo } from '@/components/shared/StudoraLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-accent-subtle selection:text-accent overflow-x-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/50 bg-surface/50 backdrop-blur-xs">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity" aria-label="Studora Home">
          <StudoraLogo variant="full" size="sm" />
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Centered Content */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 min-w-0">
        <div className="w-full max-w-md min-w-0">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted border-t border-border/40">
        Studora — Purpose-built student study workspace
      </footer>
    </div>
  )
}
