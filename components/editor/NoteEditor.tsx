'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import LinkExtension from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontSize } from '@/lib/editor/extensions/font-size'
import { FontFamily } from '@/lib/editor/extensions/font-family'
import { CustomHeading } from '@/lib/editor/extensions/section-tags'

import { StudentBlockNode } from './blocks/StudentBlockNode'
import { DiagramNode } from './blocks/DiagramNode'
import { EditorToolbar, type PaperStyle } from './EditorToolbar'
import { BubbleToolbar } from './BubbleToolbar'
import { SlashMenu } from './SlashMenu'
import { StickyNotesLayer } from './tools/StickyNotesLayer'
import { TagPicker } from '@/components/organization/TagPicker'
import { NoteService } from '@/lib/services/note.service'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { exportNoteToPdf } from '@/lib/utils/pdf-export'
import { TableInsertDialog } from './tools/TableInsertDialog'
import type { LocalNote, StickyNoteData } from '@/lib/db/studora-db'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Star, Download, Loader2, BookOpen, Edit3, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoteEditorProps {
  initialNote: LocalNote
  onSave?: (updatedNote: Partial<LocalNote>) => void
}

export function NoteEditor({ initialNote, onSave }: NoteEditorProps) {
  const searchParams = useSearchParams()
  const targetHeading = searchParams?.get('heading')

  const [title, setTitle] = useState(initialNote.title || 'Untitled Note')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [paperStyle, setPaperStyle] = useState<PaperStyle>('ruled')
  const [slashMenuOpen, setSlashMenuOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(initialNote.is_favorite || false)
  const [tags, setTags] = useState<string[]>(initialNote.tags || [])
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>(initialNote.sticky_notes || [])
  const [writingFont, setWritingFont] = useState<string>(
    initialNote.writing_font || "'Patrick Hand', cursive, sans-serif"
  )
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [tableDialogOpen, setTableDialogOpen] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save handler
  const triggerAutoSave = useCallback(
    (newTitle: string, jsonContent: Record<string, unknown> | null) => {
      setSaveStatus('saving')

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await NoteService.saveNoteContent(initialNote.id, newTitle, jsonContent)
          setSaveStatus('saved')
          if (onSave) {
            onSave({ title: newTitle, content: jsonContent })
          }
        } catch {
          setSaveStatus('unsaved')
        }
      }, 1000)
    },
    [initialNote.id, onSave]
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 space-y-1',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 space-y-1',
          },
        },
      }),
      CustomHeading.configure({ levels: [1, 2, 3] }),
      Underline,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Type '/' for commands or start writing your notes..." }),
      CharacterCount,
      LinkExtension.configure({ openOnClick: false }),
      Highlight,
      StudentBlockNode,
      DiagramNode,
    ],
    content: initialNote.content || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: initialNote.title || 'Untitled Note' }],
        },
        { type: 'paragraph' },
      ],
    },
    editable: !isReadingMode,
    onUpdate: ({ editor: ed }) => {
      if (isReadingMode) return
      setSaveStatus('unsaved')
      const json = ed.getJSON() as Record<string, unknown>
      triggerAutoSave(title, json)
    },
  })

  // Sync editable state when toggling reading mode
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isReadingMode)
    }
  }, [editor, isReadingMode])

  // Listen for '/' slash command key in editor (only when editable)
  useEffect(() => {
    if (!editor || isReadingMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !slashMenuOpen && !isReadingMode) {
        setSlashMenuOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editor, slashMenuOpen, isReadingMode])

  // Section-aware scroll highlight effect when navigating via section search
  useEffect(() => {
    if (!targetHeading || !editor) return

    const timer = setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3')
      )
      const targetQuery = targetHeading.toLowerCase().trim()

      const match = headings.find(
        (h) =>
          h.textContent?.toLowerCase().includes(targetQuery) ||
          h.getAttribute('data-tags')?.toLowerCase().includes(targetQuery)
      )

      if (match) {
        match.scrollIntoView({ behavior: 'smooth', block: 'center' })
        match.classList.add('bg-amber-200/60', 'dark:bg-amber-900/40', 'rounded', 'px-1')
        setTimeout(() => {
          match.classList.remove('bg-amber-200/60', 'dark:bg-amber-900/40', 'rounded', 'px-1')
        }, 2000)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [targetHeading, editor])

  const handleTitleChange = (newTitle: string) => {
    if (isReadingMode) return
    setTitle(newTitle)
    setSaveStatus('unsaved')
    if (editor) {
      triggerAutoSave(newTitle, editor.getJSON() as Record<string, unknown>)
    }
  }

  const handleStickyNotesChange = async (updated: StickyNoteData[]) => {
    setStickyNotes(updated)
    setSaveStatus('saving')
    try {
      await NoteRepository.updateStickyNotes(initialNote.id, updated)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('unsaved')
    }
  }

  const handleAddStickyNote = () => {
    if (isReadingMode) return
    const newNote: StickyNoteData = {
      id: 'sticky-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      content: '',
      color: 'yellow',
      x: 30 + (stickyNotes.length % 4) * 40,
      y: 80 + (stickyNotes.length % 3) * 60,
      width: 210,
      height: 170,
      rotation: Math.floor(Math.random() * 4) - 2,
      updated_at: new Date().toISOString(),
    }
    handleStickyNotesChange([...stickyNotes, newNote])
  }

  const handleWritingFontChange = (font: string) => {
    if (!editor) return
    editor.chain().focus().setFontFamily(font).run()
  }

  const handleInsertTableSubmit = (rows: number, cols: number) => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    try {
      await exportNoteToPdf('studora-note-sheet', title)
    } finally {
      setIsExportingPdf(false)
    }
  }

  const words = editor ? editor.storage.characterCount.words() : initialNote.word_count || 0
  const characters = editor ? editor.storage.characterCount.characters() : 0
  const readingTime = NoteService.calculateReadingTime(words)

  return (
    <div className="flex flex-1 flex-col h-full bg-background transition-all min-w-0 overflow-hidden">
      {/* ─── Top Header Bar: Normal Editor Toolbar vs Reading Mode Bar ─── */}
      {!isReadingMode ? (
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-1 select-none shrink-0 min-w-0">
          <EditorToolbar
            editor={editor}
            isReadingMode={isReadingMode}
            onToggleReadingMode={() => setIsReadingMode(true)}
            paperStyle={paperStyle}
            onChangePaperStyle={setPaperStyle}
            writingFont={editor ? (editor.getAttributes('textStyle').fontFamily || "'Patrick Hand', cursive, sans-serif") : "'Patrick Hand', cursive, sans-serif"}
            onChangeWritingFont={handleWritingFontChange}
            onAddStickyNote={handleAddStickyNote}
            onInsertTableRequest={() => setTableDialogOpen(true)}
          />

          <div className="flex items-center gap-2 shrink-0 pl-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="h-7 text-xs gap-1.5 font-medium shadow-3xs"
              title="Export Note as PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Download className="size-3 text-accent" />
              )}
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Reading Mode Top Bar — Minimal, distraction-free document reader */
        <div className="flex items-center justify-between border-b border-border bg-surface-raised/80 backdrop-blur-xs px-6 py-2 select-none shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 font-semibold text-accent bg-accent-subtle px-2.5 py-0.5 rounded-full text-[11px]">
              <BookOpen className="size-3.5" />
              <span>Reading Mode</span>
            </span>
            <span className="hidden sm:inline text-text-muted text-[11px] flex items-center gap-1">
              <Lock className="size-3 text-text-muted" />
              <span>Read-Only Document</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs text-text-muted">
              <span>{words} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="h-7 text-xs gap-1.5 shadow-3xs"
              title="Export Note as PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Download className="size-3 text-accent" />
              )}
              <span>Export PDF</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsReadingMode(false)}
              className="h-7 text-xs gap-1.5 font-semibold shadow-xs"
              title="Return to Editing Mode"
            >
              <Edit3 className="size-3.5" />
              <span>Edit Note</span>
            </Button>
          </div>
        </div>
      )}

      {/* ─── Main Full-Page Notebook Canvas ─────────────────────── */}
      <div className="relative flex-1 overflow-y-auto w-full bg-surface scrollbar-none min-w-0">
        <div
          id="studora-note-sheet"
          className={cn(
            'notebook-page min-h-full w-full px-8 md:px-16 py-8 relative transition-all',
            `paper-${paperStyle}`
          )}
          style={{ '--writing-font': writingFont, fontFamily: writingFont } as React.CSSProperties}
        >
          {/* Real Sticky Notes Layer */}
          <StickyNotesLayer
            noteId={initialNote.id}
            notes={stickyNotes}
            isReadingMode={isReadingMode}
            onNotesChange={handleStickyNotesChange}
          />

          {/* Note Title & Header Info */}
          <div className="relative z-10 mb-8 space-y-2 select-none border-b-2 border-border pb-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note Title..."
                className={cn(
                  'border-0 bg-transparent p-0 text-3xl md:text-4xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-0 shadow-none h-12 leading-[48px]',
                  isReadingMode && 'cursor-default selection:bg-transparent'
                )}
                style={{ color: 'var(--heading-title-color)', fontFamily: writingFont }}
                readOnly={isReadingMode}
                tabIndex={isReadingMode ? -1 : 0}
              />
              <button
                onClick={async () => {
                  const nextFav = !isFavorite
                  setIsFavorite(nextFav)
                  await NoteRepository.toggleFavorite(initialNote.id)
                }}
                className={cn(
                  'p-1.5 rounded transition-fast shrink-0',
                  isFavorite ? 'text-amber-500' : 'text-text-muted hover:text-amber-500'
                )}
                title={isFavorite ? 'Remove favorite' : 'Star note'}
              >
                <Star className={cn('size-5', isFavorite && 'fill-current')} />
              </button>
            </div>

            {/* Note Stats & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted pt-1">
              <div className="flex items-center gap-3 font-sans text-[11px]">
                <span>{words} words</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>

              <div className="flex items-center gap-2">
                {!isReadingMode ? (
                  <TagPicker
                    noteId={initialNote.id}
                    tags={tags}
                    onTagsChange={(newTags) => setTags(newTags)}
                  />
                ) : (
                  tags.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-text-secondary border border-border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Editor Canvas with Selected Handwriting / Writing Font */}
          <div className="relative z-10" style={{ fontFamily: writingFont }}>
            <EditorContent editor={editor} style={{ fontFamily: writingFont }} />
            <BubbleToolbar editor={editor} />
            <SlashMenu
              editor={editor}
              open={!isReadingMode && slashMenuOpen}
              onOpenChange={setSlashMenuOpen}
              onInsertTableRequest={() => setTableDialogOpen(true)}
            />
          </div>
          <TableInsertDialog
            open={tableDialogOpen}
            onOpenChange={setTableDialogOpen}
            onSubmit={handleInsertTableSubmit}
          />
        </div>
      </div>

      {/* ─── SINGLE BOTTOM SAVE STATUS BAR ─────────────────────────── */}
      <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-1 text-[11px] text-text-muted select-none font-sans shrink-0">
        <div className="flex items-center gap-4">
          <span>{words} words</span>
          <span>{characters} characters</span>
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="size-3 animate-spin text-accent" />
              <span className="text-accent">Saving changes...</span>
            </>
          ) : saveStatus === 'unsaved' ? (
            <>
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span className="text-amber-600">Unsaved changes</span>
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400">
                {isReadingMode ? 'Read-Only Mode' : 'Auto-saved locally'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
