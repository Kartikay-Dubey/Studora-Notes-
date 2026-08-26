'use client'

import {
  Bookmark,
  AlertTriangle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Sigma,
  Lightbulb,
  AlertOctagon,
  Flame,
  HelpCircle,
} from 'lucide-react'

const CALLOUTS = [
  {
    type: 'EXAM POINT',
    icon: Bookmark,
    border: 'border-l-blue-600 border-blue-200',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
    content: 'TCP flow control uses receiver advertisement window (rwnd) to prevent buffer overflow.',
  },
  {
    type: 'IMPORTANT CONCEPT',
    icon: AlertTriangle,
    border: 'border-l-emerald-600 border-emerald-200',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
    content: 'Deadlock requires 4 simultaneous conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
  },
  {
    type: 'DEFINITION',
    icon: BookOpen,
    border: 'border-l-indigo-600 border-indigo-200',
    bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
    content: 'Normalization: The systematic approach of decomposing tables to eliminate data redundancy and anomalies.',
  },
  {
    type: 'KEY FORMULA',
    icon: Sigma,
    border: 'border-l-violet-600 border-violet-200',
    bg: 'bg-violet-50/50 dark:bg-violet-950/20',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300',
    content: 'Shannon Channel Capacity: C = B × log₂(1 + S/N) bits per second.',
  },
  {
    type: 'COMMON MISTAKE',
    icon: HelpCircle,
    border: 'border-l-rose-600 border-rose-200',
    bg: 'bg-rose-50/50 dark:bg-rose-950/20',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    content: 'Confusing 2NF (removing partial dependencies) with 3NF (removing transitive dependencies).',
  },
  {
    type: 'REMEMBER THIS',
    icon: Lightbulb,
    border: 'border-l-amber-600 border-amber-200',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300',
    content: 'QuickSort average runtime is O(n log n), but degrades to O(n²) if pivot selection is unbalanced.',
  },
]

export function CalloutsShowcaseSection() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-surface">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase font-sans">
            Editorial Blocks
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
            Structure your knowledge with academic callouts.
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Studora isn&apos;t just plain text. Insert purpose-built academic callouts at any time using the <code className="bg-surface-raised px-1.5 py-0.5 rounded text-accent font-mono text-xs border border-border">/</code> slash command to emphasize exam tips, formulas, definitions, and common traps.
          </p>
        </div>

        {/* Callout Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
          {CALLOUTS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.type}
                className={`rounded-[var(--radius-lg)] border-l-4 border-y border-r p-4 transition-fast shadow-2xs ${item.border} ${item.bg}`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border border-current/20 ${item.badge}`}>
                    <Icon className="size-3" />
                    <span>{item.type}</span>
                  </span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed font-sans">
                  {item.content}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
