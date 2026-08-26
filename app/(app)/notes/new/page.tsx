'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NoteService } from '@/lib/services/note.service'
import { Loader2 } from 'lucide-react'

export default function NewNotePage() {
  const router = useRouter()

  useEffect(() => {
    async function createAndRedirect() {
      const newNote = await NoteService.createNewNote('Untitled Note')
      router.replace(`/notes/${newNote.id}`)
    }
    createAndRedirect()
  }, [router])

  return (
    <div className="flex h-full flex-col items-center justify-center py-24">
      <Loader2 className="size-6 animate-spin text-accent mb-2" />
      <p className="text-sm text-text-muted">Creating your new note...</p>
    </div>
  )
}
