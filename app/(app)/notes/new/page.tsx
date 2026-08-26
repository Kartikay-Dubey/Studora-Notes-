'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from 'lucide-react'

export default function NewNotePage() {
  const router = useRouter()

  const createNoteMutation = useMutation(api.notes.createNote)

  useEffect(() => {
    async function createAndRedirect() {
      const localId = `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      const noteId = await createNoteMutation({
        title: 'Untitled Note',
        localId: localId
      })
      router.replace(`/notes/${noteId}`)
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
