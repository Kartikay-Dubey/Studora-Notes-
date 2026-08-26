'use client'

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import {
  Bookmark,
  AlertTriangle,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Sigma,
  Lightbulb,
  AlertOctagon,
  HelpCircle,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentBlockType } from './StudentBlockNode'

const BLOCK_CONFIG: Record<
  StudentBlockType,
  { label: string; icon: React.ElementType; borderClass: string; bgClass: string; badgeClass: string }
> = {
  exampoint: {
    label: 'EXAM POINT',
    icon: Bookmark,
    borderClass: 'border-l-blue-600 border-blue-200/80',
    bgClass: 'bg-blue-50/50 dark:bg-blue-950/20',
    badgeClass: 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300',
  },
  important: {
    label: 'IMPORTANT CONCEPT',
    icon: AlertTriangle,
    borderClass: 'border-l-emerald-600 border-emerald-200/80',
    bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badgeClass: 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300',
  },
  definition: {
    label: 'DEFINITION',
    icon: BookOpen,
    borderClass: 'border-l-indigo-600 border-indigo-200/80',
    bgClass: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    badgeClass: 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-300',
  },
  keyconcept: {
    label: 'KEY CONCEPT',
    icon: Sparkles,
    borderClass: 'border-l-teal-600 border-teal-200/80',
    bgClass: 'bg-teal-50/50 dark:bg-teal-950/20',
    badgeClass: 'bg-teal-100/80 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-teal-300',
  },
  example: {
    label: 'WORKED EXAMPLE',
    icon: CheckCircle2,
    borderClass: 'border-l-cyan-600 border-cyan-200/80',
    bgClass: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    badgeClass: 'bg-cyan-100/80 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-300',
  },
  formula: {
    label: 'KEY FORMULA',
    icon: Sigma,
    borderClass: 'border-l-violet-600 border-violet-200/80',
    bgClass: 'bg-violet-50/50 dark:bg-violet-950/20',
    badgeClass: 'bg-violet-100/80 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 border-violet-300',
  },
  remember: {
    label: 'REMEMBER THIS',
    icon: Lightbulb,
    borderClass: 'border-l-amber-600 border-amber-200/80',
    bgClass: 'bg-amber-50/50 dark:bg-amber-950/20',
    badgeClass: 'bg-amber-100/80 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300',
  },
  warning: {
    label: 'WARNING',
    icon: AlertOctagon,
    borderClass: 'border-l-red-600 border-red-200/80',
    bgClass: 'bg-red-50/50 dark:bg-red-950/20',
    badgeClass: 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300',
  },
  tip: {
    label: 'STUDY TIP',
    icon: Flame,
    borderClass: 'border-l-orange-500 border-orange-200/80',
    bgClass: 'bg-orange-50/50 dark:bg-orange-950/20',
    badgeClass: 'bg-orange-100/80 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300 border-orange-300',
  },
  mistake: {
    label: 'COMMON MISTAKE',
    icon: HelpCircle,
    borderClass: 'border-l-rose-600 border-rose-200/80',
    bgClass: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeClass: 'bg-rose-100/80 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border-rose-300',
  },
}

export function StudentBlockView({ node }: NodeViewProps) {
  const type = (node.attrs.type as StudentBlockType) || 'important'
  const config = BLOCK_CONFIG[type] || BLOCK_CONFIG.important
  const Icon = config.icon

  return (
    <NodeViewWrapper className="my-3 font-sans">
      <div
        className={cn(
          'relative rounded-[var(--radius-md)] border-l-4 border-y border-r p-3.5 transition-fast shadow-2xs',
          config.borderClass,
          config.bgClass
        )}
      >
        <div className="mb-2 flex items-center gap-1.5 select-none">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-3xs',
              config.badgeClass
            )}
          >
            <Icon className="size-3" />
            <span>{config.label}</span>
          </span>
        </div>

        <div className="text-sm leading-relaxed text-text-primary">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
