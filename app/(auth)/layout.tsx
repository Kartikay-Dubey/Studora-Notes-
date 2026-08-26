import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-text-primary hover:opacity-90">
          <div className="flex size-8 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
            <BookOpen className="size-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">Studora</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Centered Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-text-muted">
        Studora — Purpose-built student study workspace
      </footer>
    </div>
  )
}
