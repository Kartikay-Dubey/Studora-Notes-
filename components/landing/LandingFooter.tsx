'use client'

import Link from 'next/link'
import { StudoraLogo } from '@/components/shared/StudoraLogo'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface text-text-secondary select-none font-sans">
      {/* Final CTA Banner */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans">
          Build a study system that feels like yours.
        </h2>
        <p className="text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          Start with your first note today in a quiet, offline-first digital notebook.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild variant="primary" size="lg" className="gap-2 font-semibold shadow-sm">
            <Link href="/dashboard">
              <span>Start Studying</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/notes">Explore Notes Library</Link>
          </Button>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="border-t border-border/80 bg-surface-raised/50 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Brand */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <StudoraLogo variant="full" size="sm" showTagline />
            <p className="text-text-muted leading-relaxed text-[11px]">
              The calm, distraction-free digital notebook and study workspace designed for students.
            </p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-2.5">
            <p className="font-bold text-text-primary uppercase tracking-wider text-[11px]">Product</p>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <Link href="/dashboard" className="hover:text-text-primary transition-fast">
                  Workspace
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-text-primary transition-fast">
                  Study Notes
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:text-text-primary transition-fast">
                  Subjects Shelf
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-text-primary transition-fast">
                  Full-Text Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-2.5">
            <p className="font-bold text-text-primary uppercase tracking-wider text-[11px]">Features</p>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="/#paper-styles" className="hover:text-text-primary transition-fast">
                  Paper Styles
                </a>
              </li>
              <li>
                <a href="/#editor" className="hover:text-text-primary transition-fast">
                  Academic Callouts
                </a>
              </li>
              <li>
                <span className="text-text-muted">PDF Export</span>
              </li>
              <li>
                <span className="text-text-muted">Reading Mode</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Auth */}
          <div className="space-y-2.5">
            <p className="font-bold text-text-primary uppercase tracking-wider text-[11px]">Account</p>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <Link href="/sign-in" className="hover:text-text-primary transition-fast">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-text-primary transition-fast">
                  Create Demo Account
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-text-primary transition-fast">
                  Workspace Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mx-auto max-w-5xl pt-8 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted">
          <p>© {new Date().getFullYear()} Studora. Purpose-built for student focus and learning.</p>
          <div className="flex items-center gap-4">
            <span>Offline-First</span>
            <span>•</span>
            <span>Local Persistence</span>
            <span>•</span>
            <span>No Tracking</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
