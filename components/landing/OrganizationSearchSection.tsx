'use client'

import {
  Bookmark,
  FolderTree,
  FileText,
  Search,
  CheckCircle,
  Tag,
  ArrowRight,
} from 'lucide-react'

export function OrganizationSearchSection() {
  return (
    <section id="organization" className="py-24 px-4 sm:px-6 bg-surface-raised/50 border-t border-border/70">
      <div className="mx-auto max-w-5xl">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase font-sans">
            Academic Hierarchy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary font-sans max-w-2xl mx-auto leading-tight">
            Your subjects. Your structure. Instant retrieval.
          </h2>
          <p className="text-base text-text-secondary max-w-xl mx-auto font-sans leading-relaxed">
            Organize every semester with academic subjects, nested topics, and colored tags. Search across your whole library with full-text keyword highlighting.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch select-none">
          {/* Left Column: Academic Subject Hierarchy Preview */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                  <Bookmark className="size-4 text-accent" />
                  <span>Subjects Shelf</span>
                </div>
                <span className="text-[11px] text-text-muted">4 Subjects • 18 Notes</span>
              </div>

              {/* Nested Topic Tree Mock */}
              <div className="space-y-3 font-sans text-xs">
                {/* Subject 1 */}
                <div className="p-2.5 rounded-[var(--radius-md)] bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-blue-600 inline-block" />
                      <span>Artificial Intelligence</span>
                    </div>
                    <span className="text-[10px] text-blue-700">6 notes</span>
                  </div>
                  <div className="pl-4 space-y-1 text-[11px] text-text-secondary border-l border-blue-200 ml-1">
                    <div className="flex items-center gap-1.5 hover:text-accent cursor-pointer">
                      <FileText className="size-3" />
                      <span>Neural Networks & Perceptrons</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-accent cursor-pointer">
                      <FileText className="size-3" />
                      <span>Gradient Descent & Backpropagation</span>
                    </div>
                  </div>
                </div>

                {/* Subject 2 */}
                <div className="p-2.5 rounded-[var(--radius-md)] bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-600 inline-block" />
                      <span>Data Structures & Algorithms</span>
                    </div>
                    <span className="text-[10px] text-emerald-700">5 notes</span>
                  </div>
                  <div className="pl-4 space-y-1 text-[11px] text-text-secondary border-l border-emerald-200 ml-1">
                    <div className="flex items-center gap-1.5 hover:text-accent cursor-pointer">
                      <FileText className="size-3" />
                      <span>Red-Black Trees & AVL Balance</span>
                    </div>
                  </div>
                </div>

                {/* Subject 3 */}
                <div className="p-2.5 rounded-[var(--radius-md)] bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-300">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-amber-600 inline-block" />
                      <span>Database Management</span>
                    </div>
                    <span className="text-[10px] text-amber-700">4 notes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/80 text-[11px] text-text-muted flex items-center gap-1">
              <CheckCircle className="size-3.5 text-emerald-600" />
              <span>Full drag-and-drop & topic assignment</span>
            </div>
          </div>

          {/* Right Column: Search & Discovery Preview */}
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-text-primary uppercase tracking-wider">
                  <Search className="size-4 text-accent" />
                  <span>Full-Text Search</span>
                </div>
                <kbd className="rounded bg-surface-raised px-1.5 font-mono text-[10px] text-text-muted border border-border">
                  Ctrl K
                </kbd>
              </div>

              {/* Simulated Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
                <input
                  type="text"
                  readOnly
                  value="normalization"
                  className="w-full h-8 pl-8 pr-3 text-xs bg-surface-raised border border-border rounded-[var(--radius-md)] text-text-primary font-mono focus:outline-none"
                />
              </div>

              {/* Search Results Preview */}
              <div className="space-y-2 text-xs font-sans">
                <div className="p-2.5 rounded-[var(--radius-md)] border border-accent/40 bg-accent-subtle/40 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-accent">
                    <span>Database Normalization (1NF, 2NF, 3NF, BCNF)</span>
                    <span className="text-[10px] text-text-muted">DBMS</span>
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-2">
                    &quot;Decomposing relations to remove transitive dependencies and ensure <mark className="bg-accent/20 text-accent font-semibold px-0.5 rounded">normalization</mark> integrity.&quot;
                  </p>
                </div>

                <div className="p-2.5 rounded-[var(--radius-md)] border border-border bg-surface-raised/40 space-y-1 opacity-70">
                  <div className="flex items-center justify-between font-semibold text-text-primary">
                    <span>Lossless Join & Dependency Preservation</span>
                    <span className="text-[10px] text-text-muted">DBMS</span>
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-1">
                    &quot;Testing whether schema decomposition under Boyce-Codd preserves...&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/80 text-[11px] text-text-muted flex items-center gap-1">
              <CheckCircle className="size-3.5 text-emerald-600" />
              <span>Instant sub-millisecond local search</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
