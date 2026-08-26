'use client'

import { BubbleMenu, type Editor } from '@tiptap/react'
import { Bold, Italic, Underline as UnderlineIcon, Highlighter, Code, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BubbleToolbarProps {
  editor: Editor | null
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  if (!editor) return null

  const currentFontSizeAttr = editor.getAttributes('textStyle').fontSize as string | undefined
  const currentFontSizeNum = currentFontSizeAttr
    ? parseInt(currentFontSizeAttr.replace('px', ''), 10)
    : 16

  const handleStepFontSize = (delta: number) => {
    const nextSize = Math.max(8, Math.min(30, currentFontSizeNum + delta))
    editor.chain().focus().setFontSize(`${nextSize}px`).run()
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => {
        return Boolean(ed && ed.isEditable && !ed.state.selection.empty)
      }}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-0.5 rounded-[var(--radius-md)] border border-border bg-surface p-1 shadow-lg z-30"
    >
      <Button
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="h-7 w-7"
        title="Bold"
      >
        <Bold className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="h-7 w-7"
        title="Italic"
      >
        <Italic className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="h-7 w-7"
        title="Underline"
      >
        <UnderlineIcon className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('highlight') ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className="h-7 w-7"
        title="Highlight"
      >
        <Highlighter className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('code') ? 'secondary' : 'ghost'}
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className="h-7 w-7"
        title="Inline Code"
      >
        <Code className="size-3.5" />
      </Button>

      <div className="h-4 w-px bg-border mx-1" />

      {/* Font Size Quick Stepper */}
      <div className="flex items-center gap-0.5 text-[11px] font-mono px-1">
        <button
          type="button"
          onClick={() => handleStepFontSize(-1)}
          disabled={currentFontSizeNum <= 8}
          className="p-1 hover:bg-surface rounded text-text-muted hover:text-text-primary disabled:opacity-30"
          title="Decrease font size"
        >
          <Minus className="size-2.5" />
        </button>
        <span className="min-w-[28px] text-center text-text-primary font-medium">{currentFontSizeNum}px</span>
        <button
          type="button"
          onClick={() => handleStepFontSize(1)}
          disabled={currentFontSizeNum >= 30}
          className="p-1 hover:bg-surface rounded text-text-muted hover:text-text-primary disabled:opacity-30"
          title="Increase font size"
        >
          <Plus className="size-2.5" />
        </button>
      </div>
    </BubbleMenu>
  )
}
