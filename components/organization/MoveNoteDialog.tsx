'use client'

import { useState } from 'react'
import { Doc } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FolderInput } from 'lucide-react'

interface MoveNoteDialogProps {
  note: Doc<"notes"> | null
  subjects: Doc<"subjects">[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function MoveNoteDialog({ note, subjects, open, onOpenChange, onSuccess }: MoveNoteDialogProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(note?.subject_id || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const moveToSubjectMutation = useMutation(api.notes.moveToSubject)

  if (!note) return null

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await moveToSubjectMutation({
        id: note._id,
        subject_id: selectedSubjectId || null,
      })
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-6 select-none rounded-[var(--radius-xl)] border-border bg-surface-raised shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FolderInput className="size-4 text-accent" />
            <span>Move Note to Subject</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-xs text-text-muted">
            Reassign <span className="font-semibold text-text-primary">&quot;{note.title}&quot;</span> to an academic subject shelf.
          </p>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-text-secondary">Select Subject</Label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full h-10 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Unassigned</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isSubmitting}>
              Move Note
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
