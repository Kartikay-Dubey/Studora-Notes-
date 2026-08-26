'use client'

import {
  FileText,
  GraduationCap,
  Sparkles,
  Layers,
  Code2,
  FlaskConical,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const TEMPLATES = [
  {
    title: 'Cornell Notes System',
    description: 'Structured 3-part layout: Left keywords cue column, right lecture notes area, bottom chapter summary block.',
    icon: GraduationCap,
    badge: 'Popular for Lectures',
    tag: '#cornell',
  },
  {
    title: 'Exam Preparation Sheet',
    description: 'High-yield revision format highlighting key formulas, exam points, worked examples, and common traps.',
    icon: Sparkles,
    badge: 'Revision & Finals',
    tag: '#exam-prep',
  },
  {
    title: 'Algorithms & Data Structures',
    description: 'Problem statement, asymptotic time/space complexity analysis, edge cases, and syntax-highlighted code block.',
    icon: Code2,
    badge: 'CS & Engineering',
    tag: '#algorithms',
  },
  {
    title: 'Lab & Practical Report',
    description: 'Experiment objective, hypothesis, apparatus checklist, data observations table, and findings conclusion.',
    icon: FlaskConical,
    badge: 'Sciences & Labs',
    tag: '#lab-report',
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="py-24 px-4 sm:px-6 bg-surface border-t border-border/80">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase font-sans">
            Ready-Made Frameworks
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
            Academic templates built for university study.
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Never start from a blank page during rushed lectures. Choose from research-backed note taking systems designed to maximize memory retention and revision clarity.
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-none">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon
            return (
              <div
                key={tmpl.title}
                className="group rounded-[var(--radius-xl)] border border-border bg-surface-raised/40 p-6 shadow-2xs hover:border-border-strong hover:bg-surface hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-subtle text-accent shadow-2xs">
                      <Icon className="size-4.5" />
                    </div>
                    <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent-subtle/80 uppercase tracking-wider">
                      {tmpl.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary group-hover:text-accent transition-fast">
                    {tmpl.title}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed font-sans">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span className="font-mono text-[11px]">{tmpl.tag}</span>
                  <Link
                    href="/notes/new"
                    className="inline-flex items-center gap-1 font-semibold text-accent group-hover:translate-x-0.5 transition-fast"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
