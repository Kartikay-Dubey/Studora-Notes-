'use client'

import Link from 'next/link'
import { useLiveQuery } from 'dexie-react-hooks'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { Archive, RotateCcw, Trash2, ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ArchivePage() {
  const archivedNotes = useLiveQuery(async () => {
    return await NoteRepository.getArchivedNotes()
  })

  const handleRestore = async (id: string) => {
    await NoteRepository.restoreNote(id)
  }

  const handlePermanentDelete = async (id: string) => {
    await NoteRepository.permanentlyDeleteNote(id)
  }

  const handleEmptyArchive = async () => {
    if (confirm('Are you sure you want to permanently delete all archived notes? This cannot be undone.')) {
      await NoteRepository.emptyArchive()
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon-sm" className="size-7">
              <Link href="/notes">
                <ArrowLeft className="size-4 text-text-muted" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
              Archived Notes
            </h1>
          </div>
          <p className="text-xs text-text-secondary pl-9">
            Restore previously deleted study notes or remove them permanently
          </p>
        </div>

        {archivedNotes && archivedNotes.length > 0 && (
          <Button
            onClick={handleEmptyArchive}
            variant="destructive"
            size="sm"
            className="gap-1.5 text-xs shadow-xs"
          >
            <Trash2 className="size-3.5" />
            <span>Empty Archive</span>
          </Button>
        )}
      </div>

      {/* Notes List */}
      {!archivedNotes ? (
        <div className="py-12 text-center text-xs text-text-muted">Loading archive...</div>
      ) : archivedNotes.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Archive className="size-10 text-text-muted mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-text-primary">Archive is empty</h3>
          <p className="max-w-xs mx-auto mt-1 mb-4 text-xs text-text-secondary">
            Notes you delete from your workspace will appear here before permanent deletion.
          </p>
          <Button asChild variant="secondary" size="sm">
            <Link href="/notes">Back to Notes</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {archivedNotes.map((note) => (
            <Card key={note.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1 truncate">
                <h3 className="text-sm font-semibold text-text-primary truncate">
                  {note.title || 'Untitled Note'}
                </h3>
                <p className="text-xs text-text-secondary truncate">
                  {note.content_text || 'No preview available...'}
                </p>
                <span className="text-[10px] text-text-muted">
                  Archived on {new Date(note.archived_at!).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => handleRestore(note.id)}
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  title="Restore note to active library"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Restore</span>
                </Button>
                <Button
                  onClick={() => handlePermanentDelete(note.id)}
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 text-text-muted hover:text-destructive"
                  title="Permanently delete note"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
