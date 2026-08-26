'use client'

import { useState, useEffect } from 'react'
import { NoteRepository } from '@/lib/repositories/note.repository'
import type { LocalSubject } from '@/lib/db/studora-db'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Bookmark, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subjectToEdit?: LocalSubject | null
  onSuccess?: () => void
}

const COLOR_PALETTE = [
  { id: 'indigo', name: 'Indigo', bg: 'bg-subject-indigo', text: 'text-subject-indigo' },
  { id: 'cobalt', name: 'Cobalt', bg: 'bg-subject-cobalt', text: 'text-subject-cobalt' },
  { id: 'teal', name: 'Teal', bg: 'bg-subject-teal', text: 'text-subject-teal' },
  { id: 'sage', name: 'Sage', bg: 'bg-subject-sage', text: 'text-subject-sage' },
  { id: 'amber', name: 'Amber', bg: 'bg-subject-amber', text: 'text-subject-amber' },
  { id: 'rust', name: 'Rust', bg: 'bg-subject-rust', text: 'text-subject-rust' },
  { id: 'rose', name: 'Rose', bg: 'bg-subject-rose', text: 'text-subject-rose' },
  { id: 'violet', name: 'Violet', bg: 'bg-subject-violet', text: 'text-subject-violet' },
  { id: 'copper', name: 'Copper', bg: 'bg-subject-copper', text: 'text-subject-copper' },
  { id: 'slate', name: 'Slate', bg: 'bg-subject-slate', text: 'text-subject-slate' },
  { id: 'stone', name: 'Stone', bg: 'bg-subject-stone', text: 'text-subject-stone' },
  { id: 'plum', name: 'Plum', bg: 'bg-subject-plum', text: 'text-subject-plum' },
]

export function SubjectModal({ open, onOpenChange, subjectToEdit, onSuccess }: SubjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('indigo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name)
      setDescription(subjectToEdit.description || '')
      setColor(subjectToEdit.color || 'indigo')
    } else {
      setName('')
      setDescription('')
      setColor('indigo')
    }
  }, [subjectToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      if (subjectToEdit) {
        await NoteRepository.updateSubject(subjectToEdit.id, {
          name: name.trim(),
          description: description.trim() || null,
          color,
        })
      } else {
        const id = 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
        await NoteRepository.createSubject({
          id,
          name: name.trim(),
          description: description.trim() || null,
          color,
          sort_order: Date.now(),
        })
      }

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 select-none rounded-[var(--radius-xl)] border-border bg-surface-raised shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="size-5 text-accent" />
            <span>{subjectToEdit ? 'Edit Subject' : 'New Academic Subject'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="sub-name" className="text-xs font-semibold text-text-secondary">
              Subject Name
            </Label>
            <Input
              id="sub-name"
              placeholder="e.g. Distributed Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sub-desc" className="text-xs font-semibold text-text-secondary">
              Description (Optional)
            </Label>
            <Textarea
              id="sub-desc"
              placeholder="Consensus protocols, RPCs, fault tolerance & replication..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none text-xs"
            />
          </div>

          {/* Color Palette Picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-text-secondary">Subject Color Badge</Label>
            <div className="grid grid-cols-6 gap-2 pt-1">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full transition-fast border border-border/40',
                    c.bg,
                    color === c.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : 'opacity-80 hover:opacity-100 hover:scale-105'
                  )}
                  title={c.name}
                >
                  {color === c.id && <Check className="size-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting || !name.trim()}>
              {subjectToEdit ? 'Save Changes' : 'Create Subject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
