'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  CheckSquare,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  BookOpen,
  Code,
  Quote,
  Sparkles,
  Palette,
  Image as ImageIcon,
  ChevronDown,
  Layers,
  Minus,
  Plus,
  StickyNote as StickyNoteIcon,
  ArrowRightLeft,
  Sigma,
  AlertCircle,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  Flame,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StudentBlockType } from './blocks/StudentBlockNode'
import { WritingFontPicker } from './tools/WritingFontPicker'
import { SymbolsFlowPopover } from './tools/SymbolsFlowPopover'
import { cn } from '@/lib/utils'

export type PaperStyle = 'ruled' | 'grid' | 'dotted' | 'blank'

interface EditorToolbarProps {
  editor: Editor | null
  isReadingMode: boolean
  onToggleReadingMode: () => void
  paperStyle?: PaperStyle
  onChangePaperStyle?: (style: PaperStyle) => void
  writingFont?: string
  onChangeWritingFont?: (font: string) => void
  onAddStickyNote?: () => void
  onInsertTableRequest?: () => void
}

const COLOR_PALETTE = [
  { name: 'Default Ink', color: '#192638' },
  { name: 'Dark Gray', color: '#4b5563' },
  { name: 'Academic Red', color: '#dc2626' },
  { name: 'Ink Blue', color: '#2563eb' },
  { name: 'Sage Green', color: '#16a34a' },
  { name: 'Amber Orange', color: '#ea580c' },
  { name: 'Purple', color: '#9333ea' },
  { name: 'Warm Brown', color: '#b45309' },
]

const FONT_SIZES = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30,
]

export function EditorToolbar({
  editor,
  isReadingMode,
  onToggleReadingMode,
  paperStyle = 'ruled',
  onChangePaperStyle,
  writingFont = "'Patrick Hand', cursive, sans-serif",
  onChangeWritingFont,
  onAddStickyNote,
  onInsertTableRequest,
}: EditorToolbarProps) {
  const [customColor, setCustomColor] = useState('#2563eb')
  const [symbolsOpen, setSymbolsOpen] = useState(false)

  if (!editor) return null

  // Determine current active font size from selection
  const currentFontSizeAttr = editor.getAttributes('textStyle').fontSize as string | undefined
  const currentFontSizeNum = currentFontSizeAttr
    ? parseInt(currentFontSizeAttr.replace('px', ''), 10)
    : 16

  const handleSetFontSize = (size: number) => {
    const clampedSize = Math.max(8, Math.min(30, size))
    editor.chain().focus().setFontSize(`${clampedSize}px`).run()
  }

  const handleStepFontSize = (delta: number) => {
    const nextSize = Math.max(8, Math.min(30, currentFontSizeNum + delta))
    editor.chain().focus().setFontSize(`${nextSize}px`).run()
  }

  const addStudentBlock = (type: StudentBlockType, label: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'studentBlock',
        attrs: { type, label },
        content: [{ type: 'paragraph' }],
      })
      .run()
  }

  const addDiagramBlock = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'diagramBlock',
        attrs: { src: null, width: '100%', align: 'center' },
      })
      .run()
  }

  return (
    <div className="flex items-center gap-0.5 bg-surface py-1 select-none font-sans text-xs min-w-0 overflow-x-auto scrollbar-none flex-nowrap shrink-0">
      {/* ─── Group 1: Typography & Heading ───────────────────────── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs font-semibold shrink-0">
            <span>
              {editor.isActive('heading', { level: 1 })
                ? 'H1'
                : editor.isActive('heading', { level: 2 })
                ? 'H2'
                : editor.isActive('heading', { level: 3 })
                ? 'H3'
                : 'Text'}
            </span>
            <ChevronDown className="size-3 text-text-muted" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
            Regular Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="size-3.5 mr-2" /> Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="size-3.5 mr-2" /> Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="size-3.5 mr-2" /> Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Writing Font Style Selector */}
      {onChangeWritingFont && (
        <WritingFontPicker font={writingFont} onChangeFont={onChangeWritingFont} />
      )}

      {/* Font Size Control: 8px to 30px */}
      <div className="flex items-center rounded-md border border-border bg-surface-raised/60 px-1 py-0.5 mx-0.5 shrink-0">
        <button
          type="button"
          onClick={() => handleStepFontSize(-1)}
          disabled={currentFontSizeNum <= 8}
          className="p-0.5 text-text-muted hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface transition-fast"
          title="Decrease font size"
          aria-label="Decrease font size"
        >
          <Minus className="size-2.5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="px-1 py-0.5 text-[11px] font-mono font-medium text-text-primary hover:bg-surface rounded transition-fast flex items-center gap-0.5 min-w-[34px] justify-center"
              title="Font Size (8px–30px)"
            >
              <span>{currentFontSizeNum}px</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-24 max-h-56 overflow-y-auto p-1">
            <div className="text-[10px] font-semibold text-text-muted px-2 py-1 uppercase tracking-wider">
              Size
            </div>
            {FONT_SIZES.map((size) => (
              <DropdownMenuItem
                key={size}
                onClick={() => handleSetFontSize(size)}
                className={cn(
                  'text-xs cursor-pointer justify-between py-1',
                  currentFontSizeNum === size && 'bg-accent-subtle font-semibold text-accent'
                )}
              >
                <span>{size}px</span>
                {currentFontSizeNum === size && <span className="text-[10px] text-accent">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => handleStepFontSize(1)}
          disabled={currentFontSizeNum >= 30}
          className="p-0.5 text-text-muted hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface transition-fast"
          title="Increase font size"
          aria-label="Increase font size"
        >
          <Plus className="size-2.5" />
        </button>
      </div>

      <Separator orientation="vertical" className="h-4 mx-0.5 shrink-0" />

      {/* ─── Group 2: Text Formatting ─────────────────────────── */}
      <Button
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
        aria-label="Bold"
      >
        <Bold className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
        aria-label="Italic"
      >
        <Italic className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
        aria-label="Underline"
      >
        <UnderlineIcon className="size-3.5" />
      </Button>

      {/* Text Color Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0"
            title="Text Color"
            aria-label="Text Color"
          >
            <Palette className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 p-2">
          <div className="text-[11px] font-semibold text-text-muted mb-2 px-1">Text Color</div>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.color}
                onClick={() => editor.chain().focus().setColor(c.color).run()}
                className="flex items-center justify-center size-7 rounded-md border border-border/80 hover:scale-110 transition-fast"
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border mt-1">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value)
                editor.chain().focus().setColor(e.target.value).run()
              }}
              className="size-6 rounded border border-border cursor-pointer bg-transparent"
              title="Custom Color"
            />
            <button
              onClick={() => editor.chain().focus().unsetColor().run()}
              className="text-[10px] text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded hover:bg-surface-raised transition-fast"
            >
              Reset Color
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-4 mx-0.5 shrink-0" />

      {/* ─── Group 3: Lists & Blocks ───────────────────────────── */}
      <Button
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
        aria-label="Bullet List"
      >
        <List className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
        aria-label="Numbered List"
      >
        <ListOrdered className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('taskList') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Checklist"
        aria-label="Checklist"
      >
        <CheckSquare className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
        aria-label="Blockquote"
      >
        <Quote className="size-3.5" />
      </Button>

      <Button
        variant={editor.isActive('codeBlock') ? 'secondary' : 'ghost'}
        size="icon-sm"
        className="size-7 shrink-0"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code Block"
        aria-label="Code Block"
      >
        <Code className="size-3.5" />
      </Button>

      {onInsertTableRequest && (
        <Button
          variant={editor.isActive('table') ? 'secondary' : 'ghost'}
          size="icon-sm"
          className="size-7 shrink-0"
          onClick={onInsertTableRequest}
          title="Insert Table"
          aria-label="Insert Table"
        >
          <TableIcon className="size-3.5 text-text-secondary" />
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 px-1.5 text-xs text-text-secondary hover:text-text-primary shrink-0"
        onClick={addDiagramBlock}
        title="Add Diagram / Image Container"
      >
        <ImageIcon className="size-3.5" />
        <span className="hidden lg:inline">Diagram</span>
      </Button>

      {/* ─── Academic Callout ▾ Categorized Menu ─── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs text-accent font-semibold shrink-0">
            <Sparkles className="size-3.5" />
            <span className="hidden sm:inline">Academic Callout</span>
            <ChevronDown className="size-3 text-accent/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60 p-1.5 bg-surface border border-border shadow-md rounded-[var(--radius-lg)]">
          <div className="text-[10px] font-bold text-text-muted px-2.5 py-1.5 uppercase tracking-wider">
            Callout Blocks
          </div>
          <DropdownMenuItem onClick={() => addStudentBlock('formula', 'KEY FORMULA')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <Sigma className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Key Formula</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('exampoint', 'EXAM POINT')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <AlertCircle className="size-3.5 text-red-600 dark:text-red-400 shrink-0" />
            <span>Exam Point</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('definition', 'DEFINITION')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <BookOpen className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Definition</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('important', 'IMPORTANT CONCEPT')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <Bookmark className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Important Concept</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('example', 'WORKED EXAMPLE')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Worked Example</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('remember', 'REMEMBER THIS')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <Lightbulb className="size-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Remember This</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('warning', 'WARNING')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
            <span>Warning</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('tip', 'STUDY TIP')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <Flame className="size-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
            <span>Study Tip</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addStudentBlock('mistake', 'COMMON MISTAKE')} className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-raised cursor-pointer rounded">
            <XCircle className="size-3.5 text-red-500 dark:text-red-400 shrink-0" />
            <span>Common Mistake</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-border" />

          <div className="text-[10px] font-bold text-text-muted px-2.5 py-1.5 uppercase tracking-wider">
            Study Tools
          </div>
          {onAddStickyNote && (
            <DropdownMenuItem
              onClick={onAddStickyNote}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-50/50 dark:hover:bg-amber-950/20 cursor-pointer rounded"
            >
              <StickyNoteIcon className="size-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
              <span>🟨 Sticky Note</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => setSymbolsOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-accent font-semibold hover:bg-accent-subtle/50 cursor-pointer rounded"
          >
            <ArrowRightLeft className="size-3.5 text-accent shrink-0" />
            <span>→ Symbols & Flow</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render Symbols & Flow Popover trigger modal if activated */}
      {symbolsOpen && (
        <SymbolsFlowPopover
          editor={editor}
          open={symbolsOpen}
          onOpenChange={setSymbolsOpen}
        />
      )}

      {/* ─── Group 4: Paper Style & Reading Mode ────────────── */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Paper Style Selector */}
        {onChangePaperStyle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-1.5 text-xs text-text-secondary hover:text-text-primary capitalize shrink-0"
                title="Select Paper Style"
              >
                <Layers className="size-3.5 text-text-muted" />
                <span className="hidden md:inline">{paperStyle}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <div className="text-[10px] font-semibold text-text-muted px-2 py-1 uppercase tracking-wider">
                Paper Style
              </div>
              <DropdownMenuItem
                onClick={() => onChangePaperStyle('ruled')}
                className={cn('text-xs cursor-pointer', paperStyle === 'ruled' && 'bg-accent-subtle font-semibold text-accent')}
              >
                Ruled Lines
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangePaperStyle('grid')}
                className={cn('text-xs cursor-pointer', paperStyle === 'grid' && 'bg-accent-subtle font-semibold text-accent')}
              >
                Graph Grid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangePaperStyle('dotted')}
                className={cn('text-xs cursor-pointer', paperStyle === 'dotted' && 'bg-accent-subtle font-semibold text-accent')}
              >
                Dot Grid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangePaperStyle('blank')}
                className={cn('text-xs cursor-pointer', paperStyle === 'blank' && 'bg-accent-subtle font-semibold text-accent')}
              >
                Blank Canvas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant={isReadingMode ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleReadingMode}
          className="h-7 text-xs gap-1.5 px-2 shrink-0"
          title="Toggle Reading Mode"
        >
          <BookOpen className="size-3.5" />
          <span className="hidden md:inline">Reading</span>
        </Button>
      </div>
    </div>
  )
}
