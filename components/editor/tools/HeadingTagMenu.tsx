'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Tag as TagIcon, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface HeadingTagMenuProps {
  editor: Editor | null
}

export function HeadingTagMenu({ editor }: HeadingTagMenuProps) {
  const [inputVal, setInputVal] = useState('')
  const [open, setOpen] = useState(false)

  if (!editor || !editor.isActive('heading')) return null

  const currentAttrs = editor.getAttributes('heading')
  const tags: string[] = Array.isArray(currentAttrs.tags) ? currentAttrs.tags : []

  const handleAddTag = () => {
    const trimmed = inputVal.trim().replace(/^#/, '').toLowerCase()
    if (!trimmed || tags.includes(trimmed)) return
    const nextTags = [...tags, trimmed]
    editor.chain().focus().updateAttributes('heading', { tags: nextTags }).run()
    setInputVal('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = tags.filter((t) => t !== tagToRemove)
    editor.chain().focus().updateAttributes('heading', { tags: nextTags }).run()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
          title="Attach Section Tag to Heading"
        >
          <TagIcon className="size-3" />
          <span>{tags.length > 0 ? `#${tags.length} Section Tag${tags.length > 1 ? 's' : ''}` : '+ Section Tag'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-2.5 shadow-md border-border bg-surface select-none">
        <div className="text-[11px] font-bold text-text-primary mb-2 flex items-center justify-between">
          <span>Section Tags</span>
          <span className="text-[10px] text-text-muted">Attach to this section</span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.length === 0 ? (
            <span className="text-[11px] text-text-muted italic">No section tags attached.</span>
          ) : (
            tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded bg-accent-subtle px-1.5 py-0.5 text-[11px] font-medium text-accent border border-accent/20"
              >
                #{t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-red-600 rounded"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-1">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="tag-name..."
            className="h-7 text-xs border-border bg-surface-raised"
          />
          <Button
            size="sm"
            onClick={handleAddTag}
            className="h-7 px-2 text-xs"
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
