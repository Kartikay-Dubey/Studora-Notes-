'use client'

import { useEffect, useRef } from 'react'
import { FileText, Grid3x3, Minus, AlignLeft } from 'lucide-react'
import { gsap } from '@/lib/animations/gsap-init'

const PAPER_STYLES = [
  {
    id: 'blank',
    label: 'Blank',
    icon: FileText,
    description: 'Clean empty canvas. Let your thoughts flow freely without any visual guide.',
    preview: { type: 'blank' },
  },
  {
    id: 'ruled',
    label: 'Ruled',
    icon: AlignLeft,
    description: 'Subtle horizontal lines that keep your writing aligned — just like a real notebook.',
    preview: { type: 'ruled' },
  },
  {
    id: 'grid',
    label: 'Grid',
    icon: Grid3x3,
    description: 'Perfect for diagrams, graphs, and structured academic notes.',
    preview: { type: 'grid' },
  },
  {
    id: 'dotted',
    label: 'Dotted',
    icon: Minus,
    description: 'Bullet journal-style dot grid. Freedom with subtle visual structure.',
    preview: { type: 'dotted' },
  },
]

function PaperPreview({ type }: { type: string }) {
  const lines: React.ReactElement[] = []

  if (type === 'ruled') {
    for (let i = 0; i < 7; i++) {
      lines.push(
        <div
          key={i}
          style={{ top: `${16 + i * 20}px` }}
          className="absolute left-0 right-0 h-px bg-black/[0.07]"
        />
      )
    }
  } else if (type === 'grid') {
    for (let col = 0; col < 8; col++) {
      lines.push(
        <div
          key={`c${col}`}
          style={{ left: `${col * 16}px` }}
          className="absolute top-0 bottom-0 w-px bg-black/[0.07]"
        />
      )
    }
    for (let row = 0; row < 8; row++) {
      lines.push(
        <div
          key={`r${row}`}
          style={{ top: `${row * 16}px` }}
          className="absolute left-0 right-0 h-px bg-black/[0.07]"
        />
      )
    }
  } else if (type === 'dotted') {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        lines.push(
          <div
            key={`d${row}-${col}`}
            style={{ top: `${12 + row * 18}px`, left: `${10 + col * 18}px` }}
            className="absolute size-[3px] rounded-full bg-black/[0.15]"
          />
        )
      }
    }
  }

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-sm bg-white border border-border/30">
      {lines}
      {/* Simulated handwriting text lines */}
      <div
        className="absolute left-3 right-3 top-4 h-2.5 rounded-full bg-black/[0.08]"
        style={{ width: '65%' }}
      />
      <div
        className="absolute left-3 right-3 top-9 h-2.5 rounded-full bg-black/[0.06]"
        style={{ width: '80%' }}
      />
      <div
        className="absolute left-3 right-3 top-14 h-2.5 rounded-full bg-black/[0.05]"
        style={{ width: '55%' }}
      />
    </div>
  )
}

export function PaperStylesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.paper-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="paper-styles" className="py-24 px-4 sm:px-6 bg-background border-t border-border/80">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block rounded-sm border border-border bg-surface px-3 py-1 text-xs font-bold tracking-wider text-text-secondary uppercase font-sans shadow-3xs">
            Your Paper, Your Way
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
            Four paper styles. One workspace.
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Switch between Blank, Ruled, Grid, and Dotted paper at any time — no data loss, no disruption.
            Every style is designed to feel like premium academic stationery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
          {PAPER_STYLES.map((style) => {
            const Icon = style.icon
            return (
              <div
                key={style.id}
                className="paper-card group flex flex-col gap-4 rounded-sm border-2 border-border bg-surface p-5 shadow-3xs hover:shadow-sm hover:border-primary/40 transition-all duration-200"
              >
                <PaperPreview type={style.preview.type} />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-text-secondary" />
                    <p className="font-bold text-sm text-text-primary font-sans">{style.label}</p>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {style.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-text-muted mt-8 font-sans">
          Paper style is saved per note and persists across sessions.
        </p>
      </div>
    </section>
  )
}
