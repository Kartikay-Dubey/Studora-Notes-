'use client'

import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Bookmark,
  CheckCircle2,
  AlertOctagon,
  Lightbulb,
  HelpCircle,
  Sigma,
  Flame,
  Image as ImageIcon,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { StudentBlockType } from './blocks/StudentBlockNode'

interface SlashMenuItem {
  id: string
  name: string
  description: string
  category: 'Formatting' | 'Student Blocks' | 'Media'
  icon: React.ElementType
  action: (editor: Editor) => void
}

interface SlashMenuProps {
  editor: Editor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsertTableRequest?: () => void
}

export function SlashMenu({ editor, open, onOpenChange, onInsertTableRequest }: SlashMenuProps) {
  const [query, setQuery] = useState('')

  if (!editor) return null

  const items: SlashMenuItem[] = [
    {
      id: 'h1',
      name: 'Heading 1',
      description: 'Large section heading',
      category: 'Formatting',
      icon: Heading1,
      action: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: 'h2',
      name: 'Heading 2',
      description: 'Medium subsection heading',
      category: 'Formatting',
      icon: Heading2,
      action: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: 'h3',
      name: 'Heading 3',
      description: 'Small subsection heading',
      category: 'Formatting',
      icon: Heading3,
      action: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      id: 'bullet-list',
      name: 'Bullet List',
      description: 'Simple un-ordered list',
      category: 'Formatting',
      icon: List,
      action: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      id: 'ordered-list',
      name: 'Ordered List',
      description: 'Sequential numbered list',
      category: 'Formatting',
      icon: ListOrdered,
      action: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      id: 'checklist',
      name: 'Checklist',
      description: 'Interactive checklist',
      category: 'Formatting',
      icon: CheckSquare,
      action: (ed) => ed.chain().focus().toggleTaskList().run(),
    },
    {
      id: 'quote',
      name: 'Quote',
      description: 'Blockquote callout',
      category: 'Formatting',
      icon: Quote,
      action: (ed) => ed.chain().focus().toggleBlockquote().run(),
    },
    {
      id: 'code-block',
      name: 'Code Block',
      description: 'Syntax highlighted code block',
      category: 'Formatting',
      icon: Code,
      action: (ed) => ed.chain().focus().toggleCodeBlock().run(),
    },
    {
      id: 'table',
      name: 'Table',
      description: 'Insert dynamic table',
      category: 'Formatting',
      icon: Table,
      action: (ed) => {
        if (onInsertTableRequest) {
          onInsertTableRequest()
        } else {
          ed.chain().focus().insertTable({ rows: 3, cols: 4, withHeaderRow: true }).run()
        }
      },
    },

    // Student Callout Blocks
    {
      id: 'block-important',
      name: 'Important Concept',
      description: 'Highlight crucial exam concepts',
      category: 'Student Blocks',
      icon: AlertTriangle,
      action: (ed) => insertStudentBlock(ed, 'important', 'IMPORTANT CONCEPT'),
    },
    {
      id: 'block-definition',
      name: 'Definition',
      description: 'Academic term definition',
      category: 'Student Blocks',
      icon: BookOpen,
      action: (ed) => insertStudentBlock(ed, 'definition', 'DEFINITION'),
    },
    {
      id: 'block-exampoint',
      name: 'Exam Point',
      description: 'Highlight frequently tested topics',
      category: 'Student Blocks',
      icon: Bookmark,
      action: (ed) => insertStudentBlock(ed, 'exampoint', 'EXAM POINT'),
    },
    {
      id: 'block-example',
      name: 'Worked Example',
      description: 'Step-by-step problem example',
      category: 'Student Blocks',
      icon: CheckCircle2,
      action: (ed) => insertStudentBlock(ed, 'example', 'WORKED EXAMPLE'),
    },
    {
      id: 'block-formula',
      name: 'Key Formula',
      description: 'Math or science equation block',
      category: 'Student Blocks',
      icon: Sigma,
      action: (ed) => insertStudentBlock(ed, 'formula', 'KEY FORMULA'),
    },
    {
      id: 'block-remember',
      name: 'Remember This',
      description: 'Memory anchors & mnemonics',
      category: 'Student Blocks',
      icon: Lightbulb,
      action: (ed) => insertStudentBlock(ed, 'remember', 'REMEMBER THIS'),
    },
    {
      id: 'block-warning',
      name: 'Warning',
      description: 'Critical academic caution',
      category: 'Student Blocks',
      icon: AlertOctagon,
      action: (ed) => insertStudentBlock(ed, 'warning', 'WARNING'),
    },
    {
      id: 'block-tip',
      name: 'Study Tip',
      description: 'Exam technique or study hint',
      category: 'Student Blocks',
      icon: Flame,
      action: (ed) => insertStudentBlock(ed, 'tip', 'STUDY TIP'),
    },
    {
      id: 'block-mistake',
      name: 'Common Mistake',
      description: 'Note errors to avoid in exams',
      category: 'Student Blocks',
      icon: HelpCircle,
      action: (ed) => insertStudentBlock(ed, 'mistake', 'COMMON MISTAKE'),
    },
    {
      id: 'block-diagram',
      name: 'Add Diagram / Image',
      description: 'Insert academic figure or chart upload container',
      category: 'Media',
      icon: ImageIcon,
      action: (ed) => {
        ed.chain()
          .focus()
          .insertContent({
            type: 'diagramBlock',
            attrs: { src: null, width: '100%', align: 'center' },
          })
          .run()
      },
    },
  ]

  const insertStudentBlock = (ed: Editor, type: StudentBlockType, label: string) => {
    ed.chain()
      .focus()
      .insertContent({
        type: 'studentBlock',
        attrs: { type, label },
        content: [{ type: 'paragraph' }],
      })
      .run()
  }

  const filteredItems = query.trim()
    ? items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    : items

  const handleSelect = (item: SlashMenuItem) => {
    onOpenChange(false)
    setQuery('')
    item.action(editor)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[var(--radius-lg)] border-border bg-surface-raised shadow-xl top-[25%] translate-y-0">
        <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
          <Sparkles className="size-4 text-accent" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blocks or commands..."
            className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0"
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-muted">No commands found.</div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-xs hover:bg-surface transition-fast outline-none focus:bg-surface"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-text-secondary">
                    <Icon className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <p className="text-[11px] text-text-muted">{item.description}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
