'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Search as SearchIcon, FileText, ArrowRight, Star, Clock, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const allNotes = useQuery(api.notes.listAll)
  const subjects = useQuery(api.subjects.list)

  const searchResults = allNotes ? (query.trim() ? allNotes.filter(n => 
    n.title.toLowerCase().includes(query.toLowerCase()) || 
    (n.content_text && n.content_text.toLowerCase().includes(query.toLowerCase())) ||
    (n.tags && n.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
  ) : []) : undefined

  const getSubjectName = (subjectId?: string | null) => {
    if (!subjectId || !subjects) return null
    return subjects.find((s) => s._id === subjectId)
  }

  // Highlight matches in search snippets
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text
    const regex = new RegExp(`(${search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent-subtle text-accent font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl font-sans">
          Search Notes
        </h1>
        <p className="text-sm text-text-secondary">
          Find notes, formulas, concepts, and tags across your entire workspace
        </p>
      </div>

      {/* Big Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword, topic, or #tag..."
          className="h-12 pl-12 text-sm shadow-xs rounded-[var(--radius-lg)]"
          autoFocus
        />
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {!query.trim() ? (
          <div className="py-16 text-center text-xs text-text-muted">
            <SearchIcon className="size-8 mx-auto mb-2 opacity-40" />
            <p>Type keywords to search across your academic study library.</p>
          </div>
        ) : !searchResults ? (
          <div className="py-12 text-center text-xs text-text-muted">Searching notes...</div>
        ) : searchResults.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <FileText className="size-8 text-text-muted mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-semibold text-text-primary">No results found</h3>
            <p className="text-xs text-text-muted mt-1">
              No notes match &quot;{query}&quot;. Try different keywords.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-text-muted pb-1">
              Found {searchResults.length} {searchResults.length === 1 ? 'note' : 'notes'} matching &quot;{query}&quot;
            </p>

            {searchResults.map((note) => {
              const subject = getSubjectName(note.subject_id)
              const cleanQuery = query.toLowerCase().trim().replace(/^#/, '')

              // Check for matching section/heading inside Tiptap content
              let matchedSectionTitle: string | null = null
              let matchedSectionTags: string[] = []

              if (cleanQuery && note.content && typeof note.content === 'object' && Array.isArray((note.content as { content?: unknown[] }).content)) {
                const blocks = (note.content as { content: Array<{ type?: string; attrs?: { tags?: string[] }; content?: Array<{ text?: string }> }> }).content
                for (const block of blocks) {
                  if (block.type === 'heading') {
                    const hTags = block.attrs?.tags || []
                    const hText = block.content?.map((c) => c.text || '').join('') || ''
                    if (hTags.some((t) => t.toLowerCase().includes(cleanQuery)) || hText.toLowerCase().includes(cleanQuery)) {
                      matchedSectionTitle = hText || 'Section'
                      matchedSectionTags = hTags
                      break
                    }
                  }
                }
              }

              const noteHref = matchedSectionTitle
                ? `/notes/${note._id}?heading=${encodeURIComponent(matchedSectionTitle)}`
                : `/notes/${note._id}`

              return (
                <Link key={note._id} href={noteHref}>
                  <Card className="p-4 transition-fast hover:border-border-strong hover:bg-surface-raised cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-fast">
                            {highlightMatch(note.title, query)}
                          </h3>
                          {matchedSectionTitle && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              → {highlightMatch(matchedSectionTitle, query)}
                            </span>
                          )}
                          {note.is_favorite && (
                            <Star className="size-3.5 fill-current text-tertiary-amber shrink-0" />
                          )}
                        </div>

                        <p className="line-clamp-2 text-xs text-text-secondary leading-relaxed">
                          {highlightMatch(note.content_text || 'Empty note content...', query)}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-text-muted">
                          {subject && (
                            <Badge variant="accent" className="text-[10px] py-0 px-1.5">
                              {subject.name}
                            </Badge>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>{note.word_count || 0} words</span>
                          </span>
                          {((note.tags && note.tags.length > 0) || matchedSectionTags.length > 0) && (
                            <span className="flex items-center gap-1">
                              <Tag className="size-3" />
                              <span>
                                {[...(note.tags || []), ...matchedSectionTags].map((t) => `#${t}`).join(' ')}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="size-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-fast shrink-0 mt-1" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
