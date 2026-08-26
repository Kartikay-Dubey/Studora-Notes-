'use client'

import {
  Bookmark,
  AlertTriangle,
  BookOpen,
  Check,
  Star,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  Tag,
} from 'lucide-react'

export function InteractiveNotePreview() {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-[var(--radius-xl)] border border-border/90 bg-surface shadow-xl overflow-hidden font-sans select-none text-left">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-raised/90 px-4 py-2.5 text-xs text-text-muted">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400 inline-block" />
            <span className="size-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="size-2.5 rounded-full bg-emerald-400 inline-block" />
          </div>
          <span className="text-[11px] font-mono text-text-secondary pl-1 font-medium">
            AI / Unit 3 / Neural-Networks.note
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check className="size-3 text-emerald-600" /> Auto-saved (Local)
          </span>
        </div>
      </div>

      {/* Editor Mock Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface px-4 py-1.5 text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <span className="px-2 py-0.5 rounded bg-surface-raised font-semibold text-text-primary text-[11px]">
            Heading 1
          </span>
          <span className="p-1 rounded bg-accent-subtle text-accent">
            <Bold className="size-3" />
          </span>
          <span className="p-1 text-text-muted">
            <Italic className="size-3" />
          </span>
          <span className="p-1 text-text-muted">
            <Underline className="size-3" />
          </span>
          <div className="w-px h-3.5 bg-border mx-1" />
          <span className="p-1 rounded bg-accent-subtle text-accent">
            <ListOrdered className="size-3" />
          </span>
          <div className="w-px h-3.5 bg-border mx-1" />
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-bold border border-amber-200">
            [EXAM POINT]
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-text-muted">
          <span>56 words</span>
          <span>•</span>
          <span>1 min read</span>
        </div>
      </div>

      {/* Ruled Notebook Paper Body */}
      <div className="notebook-page px-6 sm:px-10 py-6 relative">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-blue-900 dark:text-blue-300 tracking-tight">
            Neural Networks & Perceptrons
          </h2>
          <Star className="size-4 text-amber-500 fill-amber-500 shrink-0" />
        </div>

        {/* Note Content */}
        <div className="space-y-3 font-sans text-xs sm:text-sm text-text-primary leading-normal">
          <p>
            An artificial neuron models biological synapses by taking weighted input signals, computing an activation threshold, and generating a decision output.
          </p>

          {/* Academic Callout 1: EXAM POINT */}
          <div className="rounded-[var(--radius-md)] border-l-4 border-y border-r border-l-blue-600 border-blue-200 bg-blue-50/60 dark:bg-blue-950/30 p-3 font-sans">
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold tracking-wider text-blue-800 dark:text-blue-300 uppercase">
              <Bookmark className="size-3" />
              <span>EXAM POINT</span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed">
              Feed-forward networks propagate activations forward without feedback loops, whereas Recurrent Neural Networks (RNNs) maintain an internal memory state.
            </p>
          </div>

          {/* Numbered Components List */}
          <ol className="list-decimal pl-5 space-y-1 text-xs text-text-secondary leading-relaxed">
            <li><strong>Input vector (x):</strong> Sensor or feature data passed to the input layer.</li>
            <li><strong>Weights (w):</strong> Scalar importance parameters tuned during backpropagation.</li>
            <li><strong>Bias (b):</strong> Offset scalar ensuring activation even with zero inputs.</li>
            <li><strong>Activation function (σ):</strong> Introduces non-linearity (ReLU, Sigmoid, Softmax).</li>
          </ol>

          {/* Academic Callout 2: IMPORTANT CONCEPT */}
          <div className="rounded-[var(--radius-md)] border-l-4 border-y border-r border-l-emerald-600 border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 font-sans">
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold tracking-wider text-emerald-800 dark:text-emerald-300 uppercase">
              <AlertTriangle className="size-3" />
              <span>IMPORTANT CONCEPT</span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed">
              Without non-linear activation functions, deep multi-layer neural networks collapse mathematically into a single linear regression operation.
            </p>
          </div>
        </div>

        {/* Footer Tag Row */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/60 text-xs font-sans text-text-muted">
          <Tag className="size-3 text-accent" />
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border">
            #neural-networks
          </span>
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border">
            #exam-prep
          </span>
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-secondary border border-border">
            #deep-learning
          </span>
        </div>
      </div>
    </div>
  )
}
