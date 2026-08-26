'use client'

import {
  FileText,
  Brain,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Capture',
    description: 'Take rapid lecture notes on paper-style lined canvas with academic callouts and diagrams.',
    status: 'Live in Workspace',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Organize',
    description: 'Group notes into academic subjects, nested topics, and color-coded tags for zero-friction recall.',
    status: 'Live in Workspace',
    icon: ShieldCheck,
  },
  {
    step: '03',
    title: 'Revise & Flashcards',
    description: 'Convert key points, definitions, and formulas directly into spaced repetition flashcard decks.',
    status: 'On Roadmap',
    icon: Brain,
  },
  {
    step: '04',
    title: 'Practice & Master',
    description: 'Take self-quizzes and track conceptual mastery before midterm and final exam deadlines.',
    status: 'On Roadmap',
    icon: Zap,
  },
]

export function StudyFlowPhilosophySection() {
  return (
    <section id="study-flow" className="py-24 px-4 sm:px-6 bg-surface-raised/40 border-t border-border/70">
      <div className="mx-auto max-w-5xl space-y-20">
        {/* Study Flow Progression */}
        <div>
          <div className="text-center space-y-4 mb-16">
            <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase font-sans">
              The Learning Progression
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
              Notes are only the beginning.
            </h2>
            <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
              Studora is designed as an end-to-end study system. Start with manual notes today, expand into active recall and spaced revision tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            {STEPS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.step}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold font-mono text-accent/50">{s.step}</span>
                      <span className="text-[10px] font-semibold text-text-muted px-2 py-0.5 rounded-full bg-surface-raised border border-border">
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-base text-text-primary">
                      <Icon className="size-4 text-accent" />
                      <span>{s.title}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      {s.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Editorial Product Philosophy */}
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
          <span className="text-xs font-bold tracking-widest text-text-muted uppercase font-sans">
            Our Philosophy
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary font-sans leading-tight">
            Designed for studying. <br />
            Not for distracting you.
          </h3>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg mx-auto font-sans">
            No endless social feeds. No complicated workspace setup. No noisy notifications. Just a warm, distraction-free digital notebook built around how university students actually learn and retain information.
          </p>
        </div>
      </div>
    </section>
  )
}
