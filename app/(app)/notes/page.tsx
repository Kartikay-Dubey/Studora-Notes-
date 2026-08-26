'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id, Doc } from '@/convex/_generated/dataModel'
import { MoveNoteDialog } from '@/components/organization/MoveNoteDialog'
import {
  Plus,
  Search,
  FileText,
  Clock,
  Star,
  Trash2,
  Bookmark,
  FolderInput,
  Archive,
  Tag,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function NotesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMode, setFilterMode] = useState<'all' | 'starred'>('all')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [moveNoteTarget, setMoveNoteTarget] = useState<Doc<"notes"> | null>(null)

  const allNotes = useQuery(api.notes.listAll)
  const subjects = useQuery(api.subjects.list)

  const uniqueTags = Array.from(new Set((allNotes || []).flatMap(n => n.tags || [])))

  const notes = allNotes ? allNotes.filter(n => {
    if (searchQuery.trim() && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) {
       return false
    }
    if (filterMode === 'starred' && !n.is_favorite) {
       return false
    }
    if (selectedTag && (!n.tags || !n.tags.includes(selectedTag))) {
       return false
    }
    return true
  }) : undefined

  const createNoteMutation = useMutation(api.notes.createNote)
  const archiveNoteMutation = useMutation(api.notes.archive)
  const toggleFavoriteMutation = useMutation(api.notes.toggleFavorite)

  const handleCreateNote = async () => {
    const localId = `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const noteId = await createNoteMutation({
      title: 'Untitled Note',
      localId: localId
    })
    router.push(`/notes/${noteId}`)
  }

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    e.preventDefault()
    await archiveNoteMutation({ id: id as Id<"notes"> })
  }

  const handleToggleFavorite = async (e: React.MouseEvent, id: string, is_favorite: boolean) => {
    e.stopPropagation()
    e.preventDefault()
    await toggleFavoriteMutation({ id: id as Id<"notes">, is_favorite: !is_favorite })
  }

  const getSubjectName = (subjectId?: string | null) => {
    if (!subjectId || !subjects) return null
    return subjects.find((s) => s._id === subjectId)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
            Study Notes Library
          </h1>
          <p className="text-sm text-text-secondary">
            Manage, tag, and organize all your digital study notes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-text-muted">
            <Link href="/archive">
              <Archive className="size-4" />
              <span>Archive</span>
            </Link>
          </Button>
          <Button onClick={handleCreateNote} variant="primary" size="sm" className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>New Note</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filterMode === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilterMode('all')}
            className="text-xs h-8"
          >
            All Notes
          </Button>
          <Button
            variant={filterMode === 'starred' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilterMode('starred')}
            className="text-xs h-8 gap-1.5"
          >
            <Star className="size-3.5 fill-current text-tertiary-amber" />
            <span>Starred</span>
          </Button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-9 h-8 text-xs"
          />
        </div>
      </div>

      {/* Tag Filtering Chips */}
      {uniqueTags && uniqueTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
            <Tag className="size-3" />
            <span>Tags:</span>
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-medium transition-fast',
              selectedTag === null ? 'bg-accent text-accent-foreground font-semibold' : 'bg-surface border border-border text-text-muted hover:text-text-primary'
            )}
          >
            All
          </button>
          {uniqueTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(selectedTag === t ? null : t)}
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-medium transition-fast',
                selectedTag === t ? 'bg-accent text-accent-foreground font-semibold' : 'bg-surface border border-border text-text-secondary hover:border-border-strong hover:text-text-primary'
              )}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {!notes ? (
        <div className="py-12 text-center text-sm text-text-muted">Loading your notes...</div>
      ) : notes.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="size-10 text-text-muted mx-auto mb-3 opacity-60" />
          <CardTitle className="text-lg">No notes found</CardTitle>
          <CardDescription className="max-w-xs mx-auto mt-1 mb-4">
            {searchQuery || selectedTag || filterMode === 'starred'
              ? 'No study notes match the active filter.'
              : 'Start your first digital academic notebook entry.'}
          </CardDescription>
          <Button onClick={handleCreateNote} variant="primary" size="sm">
            Create Note
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => {
            const subject = getSubjectName(note.subject_id)
            return (
              <Link key={note._id} href={`/notes/${note._id}`}>
                <Card className="group relative flex flex-col justify-between h-52 p-4 transition-fast hover:border-border-strong hover:shadow-md cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-base font-semibold text-text-primary group-hover:text-accent transition-fast">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <button
                        onClick={(e) => handleToggleFavorite(e, note._id, note.is_favorite || false)}
                        className={cn(
                          'p-1 transition-fast rounded-sm',
                          note.is_favorite ? 'text-tertiary-amber' : 'text-text-muted hover:text-tertiary-amber opacity-0 group-hover:opacity-100'
                        )}
                        title={note.is_favorite ? 'Unstar note' : 'Star note'}
                      >
                        <Star className={cn('size-4', note.is_favorite && 'fill-current')} />
                      </button>
                    </div>

                    <p className="line-clamp-3 text-xs text-text-secondary leading-relaxed">
                      {note.content_text || 'Empty note...'}
                    </p>
                  </div>

                  {/* Tags & Metadata Footer */}
                  <div className="space-y-2 border-t border-border pt-2.5">
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tg) => (
                          <span key={tg} className="rounded bg-surface-raised px-1.5 py-0.5 text-[10px] text-text-muted">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <div className="flex items-center gap-2">
                        {subject && (
                          <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                            {subject.name}
                          </Badge>
                        )}
                        <span>{note.word_count || 0} words</span>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMoveNoteTarget(note)
                          }}
                          className="p-1 text-text-muted hover:text-accent transition-fast"
                          title="Move note to subject"
                        >
                          <FolderInput className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNote(e, note._id)}
                          className="p-1 text-text-muted hover:text-destructive transition-fast"
                          title="Archive note"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Move Note Dialog */}
      <MoveNoteDialog
        note={moveNoteTarget}
        subjects={subjects || []}
        open={!!moveNoteTarget}
        onOpenChange={(op) => !op && setMoveNoteTarget(null)}
      />
    </div>
  )
}
