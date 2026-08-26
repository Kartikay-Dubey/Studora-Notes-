'use client'

import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { ListTree } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OutlineItem {
  id: string
  text: string
  level: number
  pos: number
}

interface OutlinePanelProps {
  editor: Editor | null
}

export function OutlinePanel({ editor }: OutlinePanelProps) {
  const [items, setItems] = useState<OutlineItem[]>([])

  useEffect(() => {
    if (!editor) return

    const updateOutline = () => {
      const headings: OutlineItem[] = []
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          headings.push({
            id: `heading-${pos}`,
            text: node.textContent,
            level: node.attrs.level,
            pos,
          })
        }
      })
      setItems(headings)
    }

    updateOutline()
    editor.on('update', updateOutline)
    return () => {
      editor.off('update', updateOutline)
    }
  }, [editor])

  const handleJump = (pos: number) => {
    if (!editor) return
    editor.commands.setTextSelection(pos + 1)
    editor.commands.scrollIntoView()
  }

  if (items.length === 0) {
    return (
      <div className="p-4 text-xs text-text-muted text-center space-y-1 select-none">
        <ListTree className="size-4 mx-auto opacity-50 mb-1" />
        <p>No headings yet.</p>
        <p className="text-[11px] opacity-75">Add H1–H3 headings to see the document outline.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 select-none">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
        <ListTree className="size-3.5" />
        <span>Contents</span>
      </div>

      <nav className="space-y-1 text-xs">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleJump(item.pos)}
            className={cn(
              'block w-full text-left truncate rounded-[var(--radius-sm)] py-1 px-1.5 transition-fast hover:bg-surface hover:text-text-primary',
              item.level === 1 && 'font-semibold text-text-primary pl-1.5',
              item.level === 2 && 'text-text-secondary pl-3',
              item.level === 3 && 'text-text-muted pl-5 font-mono text-[11px]'
            )}
          >
            {item.text || 'Untitled Heading'}
          </button>
        ))}
      </nav>
    </div>
  )
}
