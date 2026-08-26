'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import { Tag as TagIcon, Plus, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function HeadingNodeView({ node, updateAttributes, editor }: NodeViewProps) {
  const level = node.attrs.level || 1
  const tags: string[] = Array.isArray(node.attrs.tags) ? node.attrs.tags : []
  const [inputVal, setInputVal] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const isEditable = editor.isEditable

  const TagComp = `h${level}` as any

  const handleAddTag = () => {
    const trimmed = inputVal.trim().replace(/^#/, '').toLowerCase()
    if (!trimmed || tags.includes(trimmed)) return
    updateAttributes({ tags: [...tags, trimmed] })
    setInputVal('')
  }

  const handleRemoveTag = (t: string) => {
    updateAttributes({ tags: tags.filter((item) => item !== t) })
  }

  return (
    <NodeViewWrapper className="group relative flex flex-wrap items-baseline justify-between gap-2 my-1">
      <TagComp className="flex-1 font-hand">
        <NodeViewContent />
      </TagComp>

      {/* Section Tags & Contextual + Tag control */}
      <div className="flex items-center gap-1.5 select-none shrink-0 font-sans">
        {/* Existing section tag chips */}
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
          >
            #{tag}
            {isEditable && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-600 rounded p-0.5"
              >
                <X className="size-2.5" />
              </button>
            )}
          </span>
        ))}

        {/* Contextual + Tag control (appears on hover / focus when editable) */}
        {isEditable && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[10px] font-medium text-text-muted hover:text-text-primary hover:bg-surface shadow-3xs cursor-pointer"
                title="Add section tag to this heading"
              >
                <TagIcon className="size-2.5" />
                <span>+ Tag</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-2 shadow-md border-border bg-surface">
              <div className="text-[10px] font-bold text-text-primary mb-1.5">
                Section Tag (H{level})
              </div>
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
                  className="h-6 text-xs border-border bg-surface-raised"
                />
                <Button size="sm" onClick={handleAddTag} className="h-6 px-2 text-xs">
                  <Plus className="size-3" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </NodeViewWrapper>
  )
}
