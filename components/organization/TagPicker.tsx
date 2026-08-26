'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Tag, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TagPickerProps {
  noteId: string
  tags: string[]
  onTagsChange?: (updatedTags: string[]) => void
}

export function TagPicker({ noteId, tags, onTagsChange }: TagPickerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')

  const addTagMutation = useMutation(api.notes.addTag)
  const removeTagMutation = useMutation(api.notes.removeTag)

  const handleAddTag = async () => {
    const clean = newTag.toLowerCase().trim()
    if (!clean || tags.includes(clean)) {
      setIsAdding(false)
      setNewTag('')
      return
    }

    await addTagMutation({ id: noteId as Id<"notes">, tag: clean })
    const updated = [...tags, clean]
    if (onTagsChange) onTagsChange(updated)
    setNewTag('')
    setIsAdding(false)
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    await removeTagMutation({ id: noteId as Id<"notes">, tag: tagToRemove })
    const updated = tags.filter((t) => t !== tagToRemove)
    if (onTagsChange) onTagsChange(updated)
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 select-none">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-secondary shadow-2xs"
        >
          <span>#{tag}</span>
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="text-text-muted hover:text-destructive transition-fast"
            title={`Remove tag #${tag}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-1">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="tag name..."
            autoFocus
            className="h-6 w-24 text-[11px] px-1.5 py-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag()
              if (e.key === 'Escape') setIsAdding(false)
            }}
            onBlur={handleAddTag}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-text-muted hover:border-accent hover:text-accent transition-fast"
          title="Add Tag"
        >
          <Plus className="size-3" />
          <span>Tag</span>
        </button>
      )}
    </div>
  )
}
