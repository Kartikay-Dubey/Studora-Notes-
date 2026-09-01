'use client'

import { useState, useRef, useEffect } from 'react'
import type { StickyNoteData } from '../NoteEditor'
import { Trash2, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyNotesLayerProps {
  noteId: string
  notes: StickyNoteData[]
  isReadingMode: boolean
  onNotesChange: (updated: StickyNoteData[]) => void
}

export const SOFT_PAPER_COLORS: Record<
  string,
  { bg: string; bgStyle: string; border: string; borderStyle: string; text: string; dot: string }
> = {
  yellow: {
    bg: '',
    bgStyle: '#FFF9C4',
    border: '',
    borderStyle: '#F9E86D',
    text: 'text-[#3B3000]',
    dot: '#FFF9C4',
  },
  cream: {
    bg: '',
    bgStyle: '#FFFDE7',
    border: '',
    borderStyle: '#F5ECBB',
    text: 'text-[#3A3500]',
    dot: '#FFFDE7',
  },
  beige: {
    bg: '',
    bgStyle: '#F5E6CA',
    border: '',
    borderStyle: '#E8CFA0',
    text: 'text-[#3A2E1A]',
    dot: '#F5E6CA',
  },
  blue: {
    bg: '',
    bgStyle: '#E3F2FD',
    border: '',
    borderStyle: '#B3D4F8',
    text: 'text-[#0A3A6A]',
    dot: '#E3F2FD',
  },
  mint: {
    bg: '',
    bgStyle: '#E8F8EE',
    border: '',
    borderStyle: '#A8DFB8',
    text: 'text-[#0A4020]',
    dot: '#E8F8EE',
  },
  pink: {
    bg: '',
    bgStyle: '#FCE4EC',
    border: '',
    borderStyle: '#F5B8C9',
    text: 'text-[#6A0E28]',
    dot: '#FCE4EC',
  },
  lavender: {
    bg: '',
    bgStyle: '#EDE7F6',
    border: '',
    borderStyle: '#C9B8F5',
    text: 'text-[#3A1A72]',
    dot: '#EDE7F6',
  },
  green: {
    bg: '',
    bgStyle: '#E8F5E9',
    border: '',
    borderStyle: '#A5D6A7',
    text: 'text-[#0A3A15]',
    dot: '#E8F5E9',
  },
}

export function StickyNotesLayer({
  notes,
  isReadingMode,
  onNotesChange,
}: StickyNotesLayerProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [resizingId, setResizingId] = useState<string | null>(null)

  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStartRef = useRef<{ startW: number; startH: number; startX: number; startY: number }>({
    startW: 200,
    startH: 160,
    startX: 0,
    startY: 0,
  })
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Dragging mouse/touch handler
  const startDrag = (clientX: number, clientY: number, note: StickyNoteData) => {
    if (isReadingMode) return
    setActiveNoteId(note.id)
    setDraggingId(note.id)
    dragOffsetRef.current = {
      x: clientX - note.x,
      y: clientY - note.y,
    }
  }

  const handleDragMouseDown = (e: React.MouseEvent, note: StickyNoteData) => {
    e.stopPropagation()
    startDrag(e.clientX, e.clientY, note)
  }

  const handleDragTouchStart = (e: React.TouchEvent, note: StickyNoteData) => {
    if (e.touches.length === 1) {
      e.stopPropagation()
      startDrag(e.touches[0].clientX, e.touches[0].clientY, note)
    }
  }

  // Resizing mouse/touch handler
  const startResize = (clientX: number, clientY: number, note: StickyNoteData) => {
    if (isReadingMode) return
    setActiveNoteId(note.id)
    setResizingId(note.id)
    resizeStartRef.current = {
      startW: note.width || 200,
      startH: note.height || 160,
      startX: clientX,
      startY: clientY,
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, note: StickyNoteData) => {
    e.stopPropagation()
    startResize(e.clientX, e.clientY, note)
  }

  const handleResizeTouchStart = (e: React.TouchEvent, note: StickyNoteData) => {
    if (e.touches.length === 1) {
      e.stopPropagation()
      startResize(e.touches[0].clientX, e.touches[0].clientY, note)
    }
  }

  useEffect(() => {
    if (!draggingId && !resizingId) return

    const updatePosition = (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()

      if (draggingId) {
        const currentNote = notes.find((n) => n.id === draggingId)
        const noteWidth = currentNote?.width || 200
        const maxX = Math.max(0, rect.width - noteWidth)
        const newX = Math.max(0, Math.min(maxX, clientX - dragOffsetRef.current.x))
        const newY = Math.max(0, clientY - dragOffsetRef.current.y)

        onNotesChange(
          notes.map((n) => (n.id === draggingId ? { ...n, x: newX, y: newY } : n))
        )
      } else if (resizingId) {
        const deltaX = clientX - resizeStartRef.current.startX
        const deltaY = clientY - resizeStartRef.current.startY

        const maxAvailableW = Math.max(140, Math.min(600, rect.width - 20))
        const newW = Math.max(140, Math.min(maxAvailableW, resizeStartRef.current.startW + deltaX))
        const newH = Math.max(100, Math.min(600, resizeStartRef.current.startH + deltaY))

        onNotesChange(
          notes.map((n) => (n.id === resizingId ? { ...n, width: newW, height: newH } : n))
        )
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleEnd = () => {
      setDraggingId(null)
      setResizingId(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [draggingId, resizingId, notes, onNotesChange])

  const handleUpdateContent = (id: string, content: string) => {
    onNotesChange(
      notes.map((n) => (n.id === id ? { ...n, content, updated_at: new Date().toISOString() } : n))
    )
  }

  const handleChangeColor = (id: string, color: StickyNoteData['color']) => {
    onNotesChange(notes.map((n) => (n.id === id ? { ...n, color } : n)))
  }

  const handleDelete = (id: string) => {
    onNotesChange(notes.filter((n) => n.id !== id))
    if (activeNoteId === id) setActiveNoteId(null)
  }

  const handleDuplicate = (note: StickyNoteData) => {
    const dup: StickyNoteData = {
      ...note,
      id: 'sticky-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      x: note.x + 20,
      y: note.y + 20,
      updated_at: new Date().toISOString(),
    }
    onNotesChange([...notes, dup])
    setActiveNoteId(dup.id)
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
    >
      {notes.map((note) => {
        const colorKey = note.color in SOFT_PAPER_COLORS ? note.color : 'yellow'
        const colorStyle = SOFT_PAPER_COLORS[colorKey]
        const isActive = activeNoteId === note.id

        return (
          <div
            key={note.id}
            onClick={(e) => {
              e.stopPropagation()
              setActiveNoteId(note.id)
            }}
            style={{
              transform: `translate(${note.x}px, ${note.y}px) rotate(${note.rotation || 0}deg)`,
              width: `${note.width || 200}px`,
              maxWidth: 'calc(100% - 20px)',
              height: `${note.height || 160}px`,
              backgroundColor: colorStyle.bgStyle,
              borderColor: colorStyle.borderStyle,
            }}
            className={cn(
              'absolute pointer-events-auto flex flex-col rounded-xs border shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-all select-none group',
              isActive && !isReadingMode && 'ring-2 ring-primary/30 shadow-md z-30'
            )}
          >
            {/* Drag Handle Header */}
            <div
              onMouseDown={(e) => handleDragMouseDown(e, note)}
              onTouchStart={(e) => handleDragTouchStart(e, note)}
              className="h-6 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-2 select-none touch-none"
            >
              {/* Subtle top grip indicator */}
              <div className="w-8 h-1 rounded-full bg-black/10 mx-auto" />

              {!isReadingMode && (
                <div className="absolute right-1 top-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-raised/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-border text-[10px] shadow-xs">
                  {/* Color dots */}
                  <div className="flex items-center gap-0.5 mr-1">
                    {(['yellow', 'cream', 'beige', 'blue', 'mint', 'pink', 'lavender'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleChangeColor(note.id, c)}
                        className="size-2.5 rounded-full border border-black/15 hover:scale-125 transition-transform"
                        style={{ backgroundColor: SOFT_PAPER_COLORS[c].dot }}
                        title={c}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(note)}
                    className="p-0.5 hover:bg-black/10 rounded"
                    title="Duplicate Sticky Note"
                  >
                    <Copy className="size-2.5 text-text-secondary" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className="p-0.5 hover:bg-black/10 rounded text-red-600"
                    title="Delete Sticky Note"
                  >
                    <Trash2 className="size-2.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Note Content Textarea */}
            <div className="p-2 pt-0 flex-1 flex flex-col min-h-0">
              <textarea
                value={note.content}
                disabled={isReadingMode}
                onChange={(e) => handleUpdateContent(note.id, e.target.value)}
                placeholder="Type sticky note..."
                className={cn(
                  'w-full flex-1 bg-transparent border-0 resize-none font-hand text-sm leading-relaxed focus:outline-none focus:ring-0',
                  colorStyle.text,
                  isReadingMode && 'cursor-default'
                )}
              />
            </div>

            {/* Resizable Corner Handle */}
            {!isReadingMode && (
              <div
                onMouseDown={(e) => handleResizeMouseDown(e, note)}
                onTouchStart={(e) => handleResizeTouchStart(e, note)}
                className="absolute bottom-0 right-0 size-5 cursor-se-resize flex items-center justify-center text-black/20 hover:text-black/60 transition-colors touch-none"
                title="Resize Sticky Note"
              >
                <svg className="size-3" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 1L1 7M9 5L5 9M9 8.5L8.5 9" />
                </svg>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
