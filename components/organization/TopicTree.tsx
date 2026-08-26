'use client'

import { useState } from 'react'
import { NoteRepository } from '@/lib/repositories/note.repository'
import type { LocalTopic } from '@/lib/db/studora-db'
import { Folder, FolderPlus, Trash2, Edit2, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TopicTreeProps {
  subjectId: string
  topics: LocalTopic[]
  selectedTopicId?: string | null
  onSelectTopic: (topicId: string | null) => void
  onRefresh: () => void
}

export function TopicTree({
  subjectId,
  topics,
  selectedTopicId,
  onSelectTopic,
  onRefresh,
}: TopicTreeProps) {
  const [newTopicName, setNewTopicName] = useState('')
  const [addingChildToId, setAddingChildToId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const rootTopics = topics.filter((t) => !t.parent_id)

  const handleCreateTopic = async (parentId?: string | null) => {
    if (!newTopicName.trim()) return

    const id = 'top-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    await NoteRepository.createTopic({
      id,
      subject_id: subjectId,
      parent_id: parentId || null,
      name: newTopicName.trim(),
      sort_order: Date.now(),
    })

    setNewTopicName('')
    setAddingChildToId(null)
    onRefresh()
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return
    await NoteRepository.updateTopic(id, editName.trim())
    setEditingId(null)
    onRefresh()
  }

  const handleDelete = async (id: string) => {
    await NoteRepository.deleteTopic(id)
    onRefresh()
  }

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Topics</h3>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setAddingChildToId('root')}
          className="size-6 text-text-muted hover:text-accent"
          title="Add Root Topic"
        >
          <FolderPlus className="size-3.5" />
        </Button>
      </div>

      {/* Root Topic Inline Creator */}
      {addingChildToId === 'root' && (
        <div className="flex items-center gap-1.5 pt-1">
          <Input
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="New Topic Name..."
            autoFocus
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateTopic(null)
              if (e.key === 'Escape') setAddingChildToId(null)
            }}
          />
          <Button size="sm" variant="primary" onClick={() => handleCreateTopic(null)} className="h-7 text-xs px-2">
            Add
          </Button>
        </div>
      )}

      {/* Topic List */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectTopic(null)}
          className={cn(
            'flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs text-left transition-fast',
            selectedTopicId === null ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
          )}
        >
          <Folder className="size-3.5 shrink-0" />
          <span>All Notes in Subject</span>
        </button>

        {rootTopics.map((topic) => {
          const subTopics = topics.filter((t) => t.parent_id === topic.id)
          const isSelected = selectedTopicId === topic.id

          return (
            <div key={topic.id} className="space-y-1">
              <div
                className={cn(
                  'group flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-1.5 text-xs transition-fast cursor-pointer',
                  isSelected ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                )}
                onClick={() => onSelectTopic(topic.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="size-3.5 shrink-0" />
                  {editingId === topic.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleSaveEdit(topic.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(topic.id)}
                      autoFocus
                      className="bg-transparent border-b border-accent outline-none text-xs"
                    />
                  ) : (
                    <span className="truncate">{topic.name}</span>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAddingChildToId(topic.id)
                    }}
                    className="p-0.5 text-text-muted hover:text-accent"
                    title="Add Sub-topic"
                  >
                    <Plus className="size-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(topic.id)
                      setEditName(topic.name)
                    }}
                    className="p-0.5 text-text-muted hover:text-text-primary"
                    title="Edit Topic"
                  >
                    <Edit2 className="size-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(topic.id)
                    }}
                    className="p-0.5 text-text-muted hover:text-destructive"
                    title="Delete Topic"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>

              {/* Child Sub-topic Inline Creator */}
              {addingChildToId === topic.id && (
                <div className="flex items-center gap-1.5 pl-6 pt-1">
                  <Input
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Sub-topic Name..."
                    autoFocus
                    className="h-7 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateTopic(topic.id)
                      if (e.key === 'Escape') setAddingChildToId(null)
                    }}
                  />
                  <Button size="sm" variant="primary" onClick={() => handleCreateTopic(topic.id)} className="h-7 text-xs px-2">
                    Add
                  </Button>
                </div>
              )}

              {/* Render Sub-topics */}
              {subTopics.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectTopic(sub.id)}
                  className={cn(
                    'group flex items-center justify-between rounded-[var(--radius-sm)] pl-6 pr-2 py-1 text-[11px] transition-fast cursor-pointer',
                    selectedTopicId === sub.id ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-muted hover:bg-surface-raised hover:text-text-primary'
                  )}
                >
                  <span className="truncate">{sub.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(sub.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-destructive"
                    title="Delete Sub-topic"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
