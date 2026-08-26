'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

import { NoteEditor } from '@/components/editor/NoteEditor'
import { ArrowLeft, Loader2, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ noteId: string }>
}) {
  const { noteId } = use(params)

  const note = useQuery(api.notes.getNote, { noteId })

  if (note === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-accent mb-2" />
        <p className="text-sm text-text-muted">Loading note...</p>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <FileQuestion className="size-10 text-text-muted mb-3 opacity-60" />
        <h2 className="text-lg font-semibold text-text-primary">Note Not Found</h2>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">
          The requested note does not exist or has been deleted from local storage.
        </p>
        <Button asChild variant="secondary" size="sm" className="mt-4 gap-1.5">
          <Link href="/notes">
            <ArrowLeft className="size-4" />
            Back to Notes
          </Link>
        </Button>
      </div>
    )
  }

  return <NoteEditor initialNote={note} />
}
