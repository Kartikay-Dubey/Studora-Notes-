'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
import { exportNoteToPdf } from '@/lib/utils/pdf-export'
import { TableInsertDialog } from './tools/TableInsertDialog'

export interface StickyNoteData {
  id: string
  content: string
  color: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  updated_at: string
}

const calculateReadingTime = (words: number) => Math.max(1, Math.ceil(words / 200))

import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Star,
  Download,
  Loader2,
  BookOpen,
  Edit3,
  Lock,
  Save,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoteEditorProps {
  initialNote: Doc<"notes">
  onSave?: (updatedNote: Partial<Doc<"notes">>) => void
}

export function NoteEditor({ initialNote, onSave }: NoteEditorProps) {
  const searchParams = useSearchParams()
  const targetHeading = searchParams?.get('heading')

  const [title, setTitle] = useState(initialNote.title || 'Untitled Note')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null)
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

  const saveNoteContentMutation = useMutation(api.notes.saveNoteContent)
  const updateStickyNotesMutation = useMutation(api.notes.updateStickyNotes)
  const toggleFavoriteMutation = useMutation(api.notes.toggleFavorite)

  const handleManualSave = async () => {
    if (isReadingMode || !editor) return
    setSaveStatus('saving')
    try {
      const words = editor.storage.characterCount.words()
      const readingTime = calculateReadingTime(words)
      const json = editor.getJSON() as Record<string, unknown>
      const textContent = editor.getText()
      const savedAt = await saveNoteContentMutation({
        id: initialNote._id,
        title,
        content: json,
        content_text: textContent,
        word_count: words,
        reading_time_mins: readingTime,
      })
      setLastSavedTime(savedAt)
      setSaveStatus('saved')
      if (onSave) {
        onSave({ title, content: json })
      }
    } catch (err) {
      console.error('[NoteEditor] Manual save failed:', err)
      setSaveStatus('unsaved')
    }
  }

  // Auto-save handler
  const triggerAutoSave = useCallback(
    (newTitle: string, jsonContent: Record<string, unknown> | null, textContent: string, words: number, readingTime: number) => {
      setSaveStatus('saving')

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const savedAt = await saveNoteContentMutation({
            id: initialNote._id,
            title: newTitle,
            content: jsonContent,
            content_text: textContent,
            word_count: words,
            reading_time_mins: readingTime,
          })
          setLastSavedTime(savedAt)
          setSaveStatus('saved')
          if (onSave) {
            onSave({ title: newTitle, content: jsonContent })
          }
        } catch (err) {
          console.error('[NoteEditor] Auto-save failed:', err)
          setSaveStatus('unsaved')
        }
      }, 2000)
    },
    [initialNote._id, onSave, saveNoteContentMutation]
  )

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

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
      const textContent = ed.getText()
      const words = ed.storage.characterCount.words()
      const readingTime = calculateReadingTime(words)
      triggerAutoSave(title, json, textContent, words, readingTime)
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-w-0 max-w-full',
      },
      handleDOMEvents: {
        blur: () => {
          if (saveStatus === 'unsaved') {
            handleManualSave()
          }
          return false
        }
      }
    }
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
      const textContent = editor.getText()
      const words = editor.storage.characterCount.words()
      const readingTime = calculateReadingTime(words)
      triggerAutoSave(newTitle, editor.getJSON() as Record<string, unknown>, textContent, words, readingTime)
    }
  }

  const handleStickyNotesChange = async (updated: StickyNoteData[]) => {
    setStickyNotes(updated)
    setSaveStatus('saving')
    try {
      const savedAt = await updateStickyNotesMutation({
        id: initialNote._id,
        sticky_notes: updated,
      })
      setLastSavedTime(savedAt)
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
      x: 20 + (stickyNotes.length % 3) * 30,
      y: 60 + (stickyNotes.length % 3) * 40,
      width: 200,
      height: 160,
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
  const readingTime = calculateReadingTime(words)

  return (
    <div className="flex flex-1 flex-col h-full bg-background transition-all min-w-0 w-full overflow-hidden">
      {/* ─── Top Header Bar: Normal Editor Toolbar vs Reading Mode Bar ─── */}
      {!isReadingMode ? (
        <div className="flex items-center justify-between border-b border-border bg-surface px-2 sm:px-4 py-1 select-none shrink-0 min-w-0 w-full overflow-hidden">
          {/* Left: Back Button & Editor Toolbar */}
          <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-text-muted hover:text-text-primary"
              title="Back to Notes"
            >
              <Link href="/notes">
                <ArrowLeft className="size-4" />
                <span className="sr-only">Back to Notes</span>
              </Link>
            </Button>

            <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none">
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
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 pl-1 sm:pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              className="h-7 text-xs gap-1 font-medium px-2 shadow-3xs"
              title="Save Changes"
            >
              <Save className="size-3 text-text-secondary" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="h-7 text-xs gap-1 font-medium px-2 shadow-3xs"
              title="Export Note as PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Download className="size-3 text-accent" />
              )}
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Reading Mode Top Bar */
        <div className="flex items-center justify-between border-b border-border bg-surface-raised/80 backdrop-blur-xs px-3 sm:px-6 py-2 select-none shrink-0 min-w-0 w-full">
          <div className="flex items-center gap-2 text-xs text-text-secondary min-w-0">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-text-muted hover:text-text-primary"
              title="Back to Notes"
            >
              <Link href="/notes">
                <ArrowLeft className="size-4" />
                <span className="sr-only">Back to Notes</span>
              </Link>
            </Button>

            <span className="flex items-center gap-1.5 font-semibold text-accent bg-accent-subtle px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              <BookOpen className="size-3.5" />
              <span>Reading Mode</span>
            </span>
            <span className="hidden md:inline text-text-muted text-[11px] items-center gap-1 truncate">
              <Lock className="size-3 text-text-muted inline mr-1" />
              <span>Read-Only Document</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-3 text-xs text-text-muted">
              <span>{words} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="h-7 text-xs gap-1.5 px-2 shadow-3xs"
              title="Export Note as PDF"
            >
              {isExportingPdf ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Download className="size-3 text-accent" />
              )}
              <span className="hidden sm:inline">Export PDF</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsReadingMode(false)}
              className="h-7 text-xs gap-1.5 px-2 font-semibold shadow-xs"
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
            'notebook-page min-h-full w-full px-3 sm:px-8 md:px-16 py-4 sm:py-8 relative transition-all min-w-0',
            `paper-${paperStyle}`
          )}
          style={{ '--writing-font': writingFont, fontFamily: writingFont } as React.CSSProperties}
        >
          {/* Real Sticky Notes Layer */}
          <StickyNotesLayer
            noteId={initialNote._id}
            notes={stickyNotes}
            isReadingMode={isReadingMode}
            onNotesChange={handleStickyNotesChange}
          />

          {/* Note Title & Header Info */}
          <div className="relative z-10 mb-6 sm:mb-8 space-y-2 select-none border-b-2 border-border pb-3 sm:pb-4 min-w-0">
            <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note Title..."
                className={cn(
                  'border-0 bg-transparent p-0 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight focus-visible:outline-none focus-visible:ring-0 shadow-none h-auto py-1 leading-tight min-w-0 flex-1',
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
                  try {
                    await toggleFavoriteMutation({
                      id: initialNote._id,
                      is_favorite: nextFav
                    })
                  } catch {
                    setIsFavorite(!nextFav)
                  }
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted pt-1">
              <div className="flex items-center gap-2 sm:gap-3 font-sans text-[11px]">
                <span>{words} words</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>

              <div className="flex items-center gap-2">
                {!isReadingMode ? (
                  <TagPicker
                    noteId={initialNote._id}
                    tags={tags}
                    onTagsChange={(newTags) => setTags(newTags)}
                  />
                ) : (
                  tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
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
          <div className="relative z-10 min-w-0 max-w-full" style={{ fontFamily: writingFont }}>
            <EditorContent editor={editor} style={{ fontFamily: writingFont }} className="min-w-0 max-w-full" />
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
      <div className="flex items-center justify-between border-t border-border bg-surface px-3 sm:px-6 py-1 text-[10px] sm:text-[11px] text-text-muted select-none font-sans shrink-0 min-w-0">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <span>{words} words</span>
          <span className="hidden xs:inline">{characters} chars</span>
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium shrink-0">
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="size-3 animate-spin text-accent" />
              <span className="text-accent">Saving...</span>
            </>
          ) : saveStatus === 'unsaved' ? (
            <>
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span className="text-amber-600">Unsaved</span>
            </>
          ) : (
            <>
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400">
                {isReadingMode
                  ? 'Read-Only'
                  : lastSavedTime
                    ? `Saved ${new Date(lastSavedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Saved'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
