'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { ArrowRightLeft, Workflow, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface SymbolsFlowPopoverProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ARROWS = [
  '→', '←', '↑', '↓', '↔', '↕',
  '⇒', '⇐', '⇑', '⇓', '⇔',
  '↗', '↘', '↙', '↖',
  '⟶', '⟵', '➔', '➜'
]

const FLOW_SHAPES = [
  { label: 'Process Box', text: '[ Process: Step 1 ]' },
  { label: 'Decision Node', text: '⟨ Is Condition Met? ⟩' },
  { label: 'Start / End', text: '( Start / End )' },
  { label: 'Input / Output', text: '[/ Input / Output Data /]' },
  { label: 'Database Cyl', text: '[( Database Store )]' },
  { label: 'Document Sheet', text: '[📄 Document Output]' },
  { label: 'State Circle', text: '( State Node )' },
  { label: 'Flow Connection', text: ' ───► ' },
]

const ACADEMIC_SYMBOLS = [
  '✓', '✕', '★', '!', '?',
  '≈', '≠', '≤', '≥', '±', '÷', '×',
  '∑', '√', '∞', '∴', '∵', 'Δ',
  'π', 'λ', 'α', 'β', 'γ', 'θ', 'σ', 'μ', 'Ω'
]

export function SymbolsFlowPopover({ editor, open, onOpenChange }: SymbolsFlowPopoverProps) {
  const [activeTab, setActiveTab] = useState<'arrows' | 'flow' | 'academic'>('arrows')

  if (!editor) return null

  const handleInsertSymbol = (sym: string) => {
    editor.chain().focus().insertContent(sym).run()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs p-4 shadow-xl border-border bg-surface select-none rounded-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
          <DialogTitle className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Workflow className="size-3.5 text-accent" />
            <span>Symbols & Flow</span>
          </DialogTitle>
        </DialogHeader>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded bg-surface-raised border border-border mt-2 mb-2 text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('arrows')}
            className={cn(
              'flex-1 py-1 rounded text-center transition-fast font-medium',
              activeTab === 'arrows' ? 'bg-surface font-semibold text-accent shadow-3xs' : 'text-text-muted hover:text-text-primary'
            )}
          >
            Arrows
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={cn(
              'flex-1 py-1 rounded text-center transition-fast font-medium',
              activeTab === 'flow' ? 'bg-surface font-semibold text-accent shadow-3xs' : 'text-text-muted hover:text-text-primary'
            )}
          >
            Flowchart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={cn(
              'flex-1 py-1 rounded text-center transition-fast font-medium',
              activeTab === 'academic' ? 'bg-surface font-semibold text-accent shadow-3xs' : 'text-text-muted hover:text-text-primary'
            )}
          >
            Academic
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'arrows' && (
          <div className="grid grid-cols-5 gap-1 max-h-52 overflow-y-auto p-1">
            {ARROWS.map((arrow) => (
              <button
                key={arrow}
                type="button"
                onClick={() => handleInsertSymbol(arrow)}
                className="flex items-center justify-center h-8 rounded border border-border bg-surface-raised hover:bg-accent-subtle hover:border-accent hover:text-accent transition-all text-sm font-sans"
              >
                {arrow}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'flow' && (
          <div className="space-y-1 max-h-52 overflow-y-auto p-1">
            {FLOW_SHAPES.map((shape) => (
              <button
                key={shape.label}
                type="button"
                onClick={() => handleInsertSymbol(shape.text)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded border border-border bg-surface-raised hover:bg-accent-subtle hover:border-accent transition-all text-xs text-left"
              >
                <span className="font-medium text-text-primary">{shape.label}</span>
                <span className="font-mono text-[11px] text-text-muted">{shape.text}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-5 gap-1 max-h-52 overflow-y-auto p-1">
            {ACADEMIC_SYMBOLS.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => handleInsertSymbol(sym)}
                className="flex items-center justify-center h-8 rounded border border-border bg-surface-raised hover:bg-accent-subtle hover:border-accent hover:text-accent transition-all text-sm font-sans"
              >
                {sym}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
