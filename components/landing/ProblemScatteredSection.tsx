'use client'

import {
  FileText,
  FileCode,
  FolderSync,
  HelpCircle,
  Sparkles,
  ArrowDown,
} from 'lucide-react'

export function ProblemScatteredSection() {
  return (
    <section id="problem" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-surface-raised/40 border-y border-border/60">
      <div className="mx-auto max-w-5xl text-center space-y-4 mb-16">
        <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase font-sans">
          The Student Reality
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
          Your knowledge shouldn&apos;t live in five different places.
        </h2>
        <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
          Lecture notes on paper, PDF handouts in downloads, exam formulas on screenshots, and code snippets in browser bookmarks. When exam week arrives, learning turns into chaotic searching.
        </p>
      </div>

      {/* Scattered Knowledge Cluster */}
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12 select-none">
        {/* Item 1 */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-red-200/80 bg-red-50/40 dark:bg-red-950/20 shadow-2xs space-y-2 transform -rotate-1 hover:rotate-0 transition-fast">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-800 dark:text-red-300">
            <FileText className="size-4" />
            <span>Lecture Slide 42.pdf</span>
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2 font-mono">
            &quot;Remember: Page table base register holds physical address of page directory...&quot;
          </p>
          <span className="text-[10px] text-text-muted">Downloaded 3 weeks ago • Lost in folder</span>
        </div>

        {/* Item 2 */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-2xs space-y-2 transform rotate-2 hover:rotate-0 transition-fast">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <HelpCircle className="size-4" />
            <span>Screenshot_2026-04-12.png</span>
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2 font-mono">
            Whiteboard diagram of B-Tree splitting algorithm from professor&apos;s tutorial.
          </p>
          <span className="text-[10px] text-text-muted">Unsorted in camera roll</span>
        </div>

        {/* Item 3 */}
        <div className="p-4 rounded-[var(--radius-lg)] border border-blue-200/80 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs space-y-2 transform -rotate-2 hover:rotate-0 transition-fast">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
            <FileCode className="size-4" />
            <span>dijkstra_test.py (Tab #14)</span>
          </div>
          <p className="text-[11px] text-text-secondary line-clamp-2 font-mono">
            Heapq priority queue implementation with adjacency list graph edges.
          </p>
          <span className="text-[10px] text-text-muted">Open in background browser window</span>
        </div>
      </div>

      {/* Transition Statement */}
      <div className="text-center space-y-3 pt-6">
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm mx-auto animate-bounce">
          <ArrowDown className="size-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary font-sans">
          Bring everything together into one calm workspace.
        </h3>
        <p className="text-xs text-text-muted font-sans">
          Capture notes, attach diagrams, organize subjects, and build lasting revision systems.
        </p>
      </div>
    </section>
  )
}
