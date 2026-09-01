'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { StudoraLogo } from '@/components/shared/StudoraLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200 select-none font-sans bg-surface/90 backdrop-blur-md border-b border-border/60 shadow-2xs',
        isScrolled ? 'py-3' : 'py-3.5'
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Studora Logo */}
        <Link href="/" className="flex items-center group hover:opacity-90 transition-opacity" aria-label="Studora — home">
          <StudoraLogo variant="full" size="sm" />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-text-secondary">
          <a href="#problem" className="hover:text-text-primary transition-fast">
            Problem
          </a>
          <a href="#editor" className="hover:text-text-primary transition-fast">
            The Editor
          </a>
          <a href="#organization" className="hover:text-text-primary transition-fast">
            Organization
          </a>
          <a href="#paper-styles" className="hover:text-text-primary transition-fast">
            Paper Styles
          </a>
          <a href="#study-flow" className="hover:text-text-primary transition-fast">
            Study Flow
          </a>
        </nav>

        {/* Right: Theme Toggle & Workspace CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="text-xs text-text-secondary hover:text-text-primary">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="primary" size="sm" className="text-xs gap-1.5 shadow-xs font-medium h-8">
            <Link href="/dashboard">
              <span>Open Workspace</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-fast"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-border bg-surface/95 backdrop-blur-md px-6 py-5 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 text-sm font-medium text-text-secondary">
            <a
              href="#problem"
              onClick={() => setMobileOpen(false)}
              className="hover:text-text-primary transition-fast"
            >
              Problem
            </a>
            <a
              href="#editor"
              onClick={() => setMobileOpen(false)}
              className="hover:text-text-primary transition-fast"
            >
              The Editor
            </a>
            <a
              href="#organization"
              onClick={() => setMobileOpen(false)}
              className="hover:text-text-primary transition-fast"
            >
              Organization
            </a>
            <a
              href="#paper-styles"
              onClick={() => setMobileOpen(false)}
              className="hover:text-text-primary transition-fast"
            >
              Paper Styles
            </a>
            <a
              href="#study-flow"
              onClick={() => setMobileOpen(false)}
              className="hover:text-text-primary transition-fast"
            >
              Study Flow
            </a>
          </nav>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Button asChild variant="secondary" size="sm" className="w-full justify-center text-xs">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="primary" size="sm" className="w-full justify-center text-xs gap-1.5">
              <Link href="/dashboard">
                <span>Open Workspace</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
