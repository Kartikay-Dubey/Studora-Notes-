'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLiveQuery } from 'dexie-react-hooks'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { SubjectModal } from '@/components/organization/SubjectModal'
import { Bookmark, Plus, FileText, ArrowRight, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LocalSubject } from '@/lib/db/studora-db'

export default function SubjectsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [subjectToEdit, setSubjectToEdit] = useState<LocalSubject | null>(null)

  const subjects = useLiveQuery(async () => {
    return await NoteRepository.getAllSubjects()
  })

  const notes = useLiveQuery(async () => {
    return await NoteRepository.getAllNotes()
  })

  const handleEdit = (e: React.MouseEvent, sub: LocalSubject) => {
    e.stopPropagation()
    e.preventDefault()
    setSubjectToEdit(sub)
    setModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    e.preventDefault()
    await NoteRepository.deleteSubject(id)
  }

  const getSubjectNoteCount = (subjectId: string) => {
    if (!notes) return 0
    return notes.filter((n) => n.subject_id === subjectId).length
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
            Academic Subjects Shelf
          </h1>
          <p className="text-sm text-text-secondary">
            Organize notes, topics, and study modules by subject
          </p>
        </div>
        <Button
          onClick={() => {
            setSubjectToEdit(null)
            setModalOpen(true)
          }}
          variant="primary"
          size="sm"
          className="gap-1.5 shadow-xs"
        >
          <Plus className="size-4" />
          <span>New Subject</span>
        </Button>
      </div>

      {/* Subjects Grid */}
      {!subjects ? (
        <div className="py-12 text-center text-sm text-text-muted">Loading subjects shelf...</div>
      ) : subjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Bookmark className="size-10 text-text-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-semibold text-text-primary">No subjects created</h3>
          <p className="max-w-xs mx-auto mt-1 mb-4 text-xs text-text-secondary">
            Create your first academic subject shelf to organize your lecture notes.
          </p>
          <Button
            onClick={() => {
              setSubjectToEdit(null)
              setModalOpen(true)
            }}
            variant="primary"
            size="sm"
          >
            Create Subject
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => {
            const count = getSubjectNoteCount(sub.id)
            return (
              <Link key={sub.id} href={`/subjects/${sub.id}`}>
                <Card className="group relative flex flex-col justify-between h-48 p-5 transition-fast hover:border-border-strong hover:shadow-md cursor-pointer border-l-4 border-l-accent">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-fast line-clamp-1">
                        {sub.name}
                      </h3>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        <button
                          onClick={(e) => handleEdit(e, sub)}
                          className="p-1 text-text-muted hover:text-text-primary transition-fast"
                          title="Edit subject"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, sub.id)}
                          className="p-1 text-text-muted hover:text-destructive transition-fast"
                          title="Delete subject"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-xs text-text-secondary leading-relaxed">
                      {sub.description || 'No description provided...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <FileText className="size-3.5 text-accent" />
                      <span className="font-semibold text-text-primary">{count}</span>
                      <span>{count === 1 ? 'note' : 'notes'}</span>
                    </div>

                    <span className="flex items-center gap-1 text-accent font-medium text-xs group-hover:translate-x-0.5 transition-fast">
                      <span>Open Shelf</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <SubjectModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        subjectToEdit={subjectToEdit}
      />
    </div>
  )
}
