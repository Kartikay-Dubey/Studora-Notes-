'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useConvexAuth } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  Plus,
  FileText,
  Bookmark,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  BookOpen,
  RotateCcw,
  CheckSquare,
  Loader2,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()

  const { isAuthenticated } = useConvexAuth()
  const [isCreating, setIsCreating] = useState(false)
  const notes = useQuery(api.notes.listAll)
  const subjects = useQuery(api.subjects.list)
  const createNoteMutation = useMutation(api.notes.createNote)

  const handleCreateNote = async () => {
    if (!isAuthenticated || isCreating) return
    setIsCreating(true)
    try {
      const localId = `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const noteId = await createNoteMutation({
        title: 'Untitled Study Note',
        localId: localId
      })
      router.push(`/notes/${noteId}`)
    } catch (err) {
      console.error('Failed to create note:', err)
      alert('Could not create note. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const createOnboardingNoteMutation = useMutation(api.notes.createOnboardingNote)

  const handleResetSampleData = async () => {
    try {
      const noteId = await createOnboardingNoteMutation()
      if (noteId) {
        router.push(`/notes/${noteId}`)
      } else {
        // If already created, find the onboarding note
        const existing = notes?.find(n => n.title.includes("Welcome to Studora"))
        if (existing) {
          router.push(`/notes/${existing._id}`)
        }
      }
    } catch (err) {
      console.error("Failed to reset starter guide:", err)
    }
  }

  const pinnedNotes = notes?.filter((n) => n.is_pinned || n.is_favorite) || []
  const recentNotes = notes?.slice(0, 4) || []

  return (
    <div className="mx-auto max-w-5xl space-y-8 select-none">
      {/* Top Greeting Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mb-1">
            <Sparkles className="size-3.5" />
            <span>Academic Study Workspace</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
            Good morning, {user?.fullName || 'Student'}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            What would you like to study or revise today?
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleCreateNote} disabled={!isAuthenticated || isCreating} variant="primary" size="sm" className="gap-1.5 shadow-sm">
            {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            <span>{isCreating ? 'Creating...' : 'New Note'}</span>
          </Button>
          <Button
            onClick={handleResetSampleData}
            variant="ghost"
            size="sm"
            className="text-xs text-text-muted hover:text-text-primary gap-1.5"
            title="Reset to default sample study workspace"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </Button>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <button
            onClick={handleCreateNote}
            disabled={!isAuthenticated || isCreating}
            className="flex items-center gap-2.5 sm:gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-2.5 sm:p-3 text-left transition-fast hover:border-border-strong hover:shadow-xs group disabled:opacity-60 disabled:cursor-not-allowed min-w-0"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle text-accent">
              {isCreating ? <Loader2 className="size-3.5 sm:size-4 animate-spin" /> : <Plus className="size-3.5 sm:size-4" />}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-fast truncate">{isCreating ? 'Creating...' : 'New Note'}</p>
              <p className="text-[10px] text-text-muted truncate">Blank document</p>
            </div>
          </button>

          <Link
            href="/notes"
            className="flex items-center gap-2.5 sm:gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-2.5 sm:p-3 text-left transition-fast hover:border-border-strong hover:shadow-xs group min-w-0"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-success-subtle text-success">
              <FileText className="size-3.5 sm:size-4" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-fast truncate">Note Library</p>
              <p className="text-[10px] text-text-muted truncate">Browse notes</p>
            </div>
          </Link>

          <Link
            href="/subjects"
            className="flex items-center gap-2.5 sm:gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-2.5 sm:p-3 text-left transition-fast hover:border-border-strong hover:shadow-xs group min-w-0"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-warning-subtle text-warning">
              <Bookmark className="size-3.5 sm:size-4" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-fast truncate">Subjects</p>
              <p className="text-[10px] text-text-muted truncate">Academic shelf</p>
            </div>
          </Link>

          <Link
            href="/notes"
            className="flex items-center gap-2.5 sm:gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-2.5 sm:p-3 text-left transition-fast hover:border-border-strong hover:shadow-xs group min-w-0"
          >
            <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-surface-raised text-text-secondary">
              <CheckSquare className="size-3.5 sm:size-4" />
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-fast truncate">Study Revision</p>
              <p className="text-[10px] text-text-muted truncate">Review topics</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Pinned & Favorite Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Star className="size-3.5 fill-current text-tertiary-amber" />
              <span>Starred Study Notes</span>
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {pinnedNotes.map((note) => (
              <Link key={note._id} href={`/notes/${note._id}`}>
                <div className="group flex flex-col justify-between rounded-[var(--radius-md)] border border-border bg-surface p-4 transition-fast hover:border-border-strong hover:shadow-xs cursor-pointer h-32">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold text-text-primary group-hover:text-accent transition-fast">
                        {note.title}
                      </h3>
                      <Star className="size-3.5 fill-current text-tertiary-amber shrink-0" />
                    </div>
                    <p className="line-clamp-2 text-xs text-text-secondary leading-relaxed">
                      {note.content_text || 'No preview available...'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border pt-2">
                    <span>{note.word_count || 0} words</span>
                    <span className="flex items-center gap-1 text-accent font-medium">
                      <span>Open Note</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Academic Subjects Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Academic Subjects</h2>
          <Link href="/notes" className="text-xs text-accent hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {!subjects || subjects.length === 0 ? (
          <p className="text-xs text-text-muted">No subjects configured yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((sub) => (
              <div key={sub._id} className="rounded-[var(--radius-md)] border border-border bg-surface p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                    {sub.name}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-[11px] text-text-secondary pt-1 leading-relaxed">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Notes Library List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Study Notes</h2>
          <Link href="/notes" className="text-xs text-accent hover:underline">
            All Notes
          </Link>
        </div>

        {!recentNotes || recentNotes.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-border p-8 text-center text-xs text-text-muted">
            No notes yet. Click &quot;New Note&quot; to begin your study journal.
          </div>
        ) : (
          <div className="space-y-2">
            {recentNotes.map((note) => (
              <Link key={note._id} href={`/notes/${note._id}`}>
                <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 transition-fast hover:border-border-strong hover:bg-surface-raised cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-text-muted group-hover:text-accent transition-fast" />
                    <div>
                      <p className="text-xs font-semibold text-text-primary group-hover:text-accent transition-fast">
                        {note.title}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-text-secondary">
                        {note.content_text || 'Empty note...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="hidden sm:inline">{note.word_count || 0} words</span>
                    <ArrowRight className="size-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-fast" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
