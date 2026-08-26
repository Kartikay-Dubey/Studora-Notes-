'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/studora-db'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { NoteService } from '@/lib/services/note.service'
import { TopicTree } from '@/components/organization/TopicTree'
import { SubjectModal } from '@/components/organization/SubjectModal'
import { MoveNoteDialog } from '@/components/organization/MoveNoteDialog'
import { ArrowLeft, Plus, FileText, Star, Trash2, Edit2, Loader2, FolderInput } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LocalNote } from '@/lib/db/studora-db'

export default function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = use(params)
  const router = useRouter()

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [moveNoteModal, setMoveNoteModal] = useState<LocalNote | null>(null)

  const subject = useLiveQuery(async () => {
    return await db.subjects.get(subjectId)
  }, [subjectId])

  const subjects = useLiveQuery(async () => {
    return await NoteRepository.getAllSubjects()
  })

  const topics = useLiveQuery(async () => {
    return await NoteRepository.getTopicsBySubject(subjectId)
  }, [subjectId])

  const notes = useLiveQuery(async () => {
    const all = await NoteRepository.getNotesBySubject(subjectId)
    if (selectedTopicId) {
      return all.filter((n) => n.topic_id === selectedTopicId)
    }
    return all
  }, [subjectId, selectedTopicId])

  const handleCreateNoteInSubject = async () => {
    const newNote = await NoteService.createNewNote('Untitled Note', subjectId)
    router.push(`/notes/${newNote.id}`)
  }

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    e.preventDefault()
    await NoteRepository.softDeleteNote(id)
  }

  if (subject === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-24 text-text-muted">
        <Loader2 className="size-6 animate-spin text-accent mb-2" />
        <p className="text-xs">Loading subject shelf...</p>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-semibold text-text-primary">Subject Not Found</h2>
        <Button asChild variant="secondary" size="sm" className="mt-4 gap-1.5">
          <Link href="/subjects">
            <ArrowLeft className="size-4" /> Back to Subjects Shelf
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 select-none">
      {/* Subject Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon-sm" className="size-7">
              <Link href="/subjects">
                <ArrowLeft className="size-4 text-text-muted" />
              </Link>
            </Button>
            <Badge variant="accent" className="text-xs">
              {subject.name}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
            {subject.name}
          </h1>
          <p className="text-xs text-text-secondary max-w-xl">
            {subject.description || 'Academic notes and topic organization for this subject.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setModalOpen(true)} variant="ghost" size="sm" className="gap-1 text-xs">
            <Edit2 className="size-3.5" />
            <span>Edit Subject</span>
          </Button>
          <Button onClick={handleCreateNoteInSubject} variant="primary" size="sm" className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>New Subject Note</span>
          </Button>
        </div>
      </div>

      {/* 2-Column Workspace: Left Topics Tree + Right Notes List */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Left Column: Topics Navigation */}
        <div className="md:col-span-1 border-r border-border pr-4">
          <TopicTree
            subjectId={subjectId}
            topics={topics || []}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onRefresh={() => {}}
          />
        </div>

        {/* Right Column: Notes List */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {notes?.length || 0} {notes?.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {!notes ? (
            <div className="py-12 text-center text-xs text-text-muted">Loading notes...</div>
          ) : notes.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <FileText className="size-10 text-text-muted mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-text-primary">No notes in this topic</h3>
              <p className="max-w-xs mx-auto mt-1 mb-4 text-xs text-text-secondary">
                Create a note assigned to this subject or topic.
              </p>
              <Button onClick={handleCreateNoteInSubject} variant="primary" size="sm">
                Create Note
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <Card className="group flex flex-col justify-between h-44 p-4 transition-fast hover:border-border-strong hover:shadow-md cursor-pointer">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold text-text-primary group-hover:text-accent transition-fast">
                          {note.title}
                        </h3>
                        {note.is_favorite && <Star className="size-3.5 fill-current text-tertiary-amber shrink-0" />}
                      </div>
                      <p className="line-clamp-3 text-xs text-text-secondary leading-relaxed">
                        {note.content_text || 'Empty note...'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-2 text-[11px] text-text-muted">
                      <span>{note.word_count || 0} words</span>

                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setMoveNoteModal(note)
                          }}
                          className="p-1 text-text-muted hover:text-accent transition-fast"
                          title="Move Note"
                        >
                          <FolderInput className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNote(e, note.id)}
                          className="p-1 text-text-muted hover:text-destructive transition-fast"
                          title="Delete Note"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SubjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        subjectToEdit={subject}
      />

      <MoveNoteDialog
        note={moveNoteModal}
        subjects={subjects || []}
        open={!!moveNoteModal}
        onOpenChange={(op) => !op && setMoveNoteModal(null)}
      />
    </div>
  )
}
