'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LandingNav } from '@/components/landing/LandingNav'
import { InteractiveNotePreview } from '@/components/landing/InteractiveNotePreview'
import { ProblemScatteredSection } from '@/components/landing/ProblemScatteredSection'
import { CalloutsShowcaseSection } from '@/components/landing/CalloutsShowcaseSection'
import { OrganizationSearchSection } from '@/components/landing/OrganizationSearchSection'
import { PaperStylesSection } from '@/components/landing/PaperStylesSection'
import { StudyFlowPhilosophySection } from '@/components/landing/StudyFlowPhilosophySection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, ShieldCheck, FileCheck, BookOpen } from 'lucide-react'
import { gsap } from '@/lib/animations/gsap-init'

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !heroRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.05 }
      )
        .fromTo(
          '.hero-headline',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.25'
        )
        .fromTo(
          '.hero-description',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          '-=0.25'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35 },
          '-=0.2'
        )
        .fromTo(
          '.hero-trust',
          { opacity: 0 },
          { opacity: 1, duration: 0.35 },
          '-=0.2'
        )
        .fromTo(
          '.hero-preview',
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary overflow-x-hidden font-sans">
      {/* Sticky Header Navigation */}
      <LandingNav />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* ─── Hero Section ───────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 overflow-hidden"
        >
          <div className="mx-auto max-w-4xl text-center space-y-5">
            {/* Small Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-3 py-1 text-xs font-semibold text-text-secondary shadow-2xs">
              <Sparkles className="size-3.5 text-primary" />
              <span>Digital Notebook for Students</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="hero-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary font-sans leading-[1.15] max-w-2xl mx-auto">
              Turn your study notes into a knowledge system.
            </h1>

            {/* Supporting Human Paragraph */}
            <p className="hero-description text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto font-sans">
              Capture lectures, organize subjects, build structured notes with academic callouts, and prepare everything you need for revision — all in one calm workspace.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button asChild variant="primary" size="lg" className="gap-2 font-semibold shadow-xs h-10 px-5 text-xs sm:text-sm">
                <Link href="/dashboard">
                  <span>Start Studying</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2 h-10 px-5 text-xs sm:text-sm">
                <Link href="/notes">Explore the Workspace</Link>
              </Button>
            </div>

            {/* Trust & Product Highlights — actual product features only */}
            <div className="hero-trust flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-2 text-[11px] text-text-muted select-none">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Works Offline</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="size-3.5 text-primary" />
                <span>Academic Callouts</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-amber-600" />
                <span>Export to PDF</span>
              </span>
            </div>

            {/* Interactive Real React Product Preview */}
            <div className="hero-preview pt-6">
              <InteractiveNotePreview />
            </div>
          </div>
        </section>

        {/* ─── Section 1: The Problem & Scattered Knowledge ─── */}
        <ProblemScatteredSection />

        {/* ─── Section 2: Academic Callouts Showcase ─────────── */}
        <CalloutsShowcaseSection />

        {/* ─── Section 3: Organization & Fast Search ─────────── */}
        <OrganizationSearchSection />

        {/* ─── Section 4: Paper Styles Showcase ───────────────── */}
        <PaperStylesSection />

        {/* ─── Section 5: Study Flow & Philosophy ─────────────── */}
        <StudyFlowPhilosophySection />
      </main>

      {/* ─── Footer ────────────────────────────────────────── */}
      <LandingFooter />
    </div>
  )
}
