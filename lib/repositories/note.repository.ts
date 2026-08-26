import { db, type LocalNote, type LocalSubject, seedInitialLocalData } from '@/lib/db/studora-db'

export class NoteRepository {
  static async init() {
    await seedInitialLocalData()
  }

  static async getAllNotes(): Promise<LocalNote[]> {
    return await db.notes
      .filter((note) => !note.archived_at)
      .reverse()
      .sortBy('updated_at')
  }

  static async getNoteById(id: string): Promise<LocalNote | undefined> {
    return await db.notes.get(id)
  }

  static async getNotesBySubject(subjectId: string): Promise<LocalNote[]> {
    return await db.notes
      .where('subject_id')
      .equals(subjectId)
      .filter((note) => !note.archived_at)
      .toArray()
  }

  static async createNote(
    data: Omit<LocalNote, 'created_at' | 'updated_at'>
  ): Promise<LocalNote> {
    const now = new Date().toISOString()
    const newNote: LocalNote = {
      ...data,
      created_at: now,
      updated_at: now,
    }
    await db.notes.add(newNote)
    return newNote
  }

  static async updateNote(
    id: string,
    updates: Partial<Omit<LocalNote, 'id' | 'created_at'>>
  ): Promise<void> {
    const now = new Date().toISOString()
    await db.notes.update(id, {
      ...updates,
      updated_at: now,
    })
  }

  static async updateStickyNotes(id: string, stickyNotes: LocalNote['sticky_notes']): Promise<void> {
    const now = new Date().toISOString()
    await db.notes.update(id, {
      sticky_notes: stickyNotes,
      updated_at: now,
    })
  }

  static async updateWritingFont(id: string, writingFont: string): Promise<void> {
    const now = new Date().toISOString()
    await db.notes.update(id, {
      writing_font: writingFont,
      updated_at: now,
    })
  }

  static async softDeleteNote(id: string): Promise<void> {
    const now = new Date().toISOString()
    await db.notes.update(id, {
      archived_at: now,
      updated_at: now,
    })
  }

  static async searchNotes(query: string): Promise<LocalNote[]> {
    const q = query.toLowerCase().trim().replace(/^#/, '')
    if (!q) return this.getAllNotes()

    return await db.notes
      .filter((note) => {
        if (note.archived_at) return false

        const titleMatch = note.title.toLowerCase().includes(q)
        const textMatch = Boolean(note.content_text && note.content_text.toLowerCase().includes(q))
        const tagMatch = Boolean(note.tags && note.tags.some((tag) => tag.toLowerCase().includes(q)))

        // Section-level heading tags & heading text match
        let sectionMatch = false
        if (note.content && typeof note.content === 'object' && Array.isArray((note.content as { content?: unknown[] }).content)) {
          const blocks = (note.content as { content: Array<{ type?: string; attrs?: { tags?: string[] }; content?: Array<{ text?: string }> }> }).content
          for (const block of blocks) {
            if (block.type === 'heading') {
              const hTags = block.attrs?.tags || []
              if (hTags.some((t) => t.toLowerCase().includes(q))) {
                sectionMatch = true;
                break;
              }
              const hText = block.content?.map((c) => c.text || '').join('') || ''
              if (hText.toLowerCase().includes(q)) {
                sectionMatch = true;
                break;
              }
            }
          }
        }

        return titleMatch || textMatch || tagMatch || sectionMatch
      })
      .toArray()
  }

  // Subject methods
  static async getAllSubjects(): Promise<LocalSubject[]> {
    return await db.subjects.filter((s) => !s.archived_at).sortBy('sort_order')
  }

  static async getSubjectById(id: string): Promise<LocalSubject | undefined> {
    return await db.subjects.get(id)
  }

  static async createSubject(
    data: Omit<LocalSubject, 'created_at' | 'updated_at'>
  ): Promise<LocalSubject> {
    const now = new Date().toISOString()
    const newSubject: LocalSubject = {
      ...data,
      created_at: now,
      updated_at: now,
    }
    await db.subjects.add(newSubject)
    return newSubject
  }

  static async updateSubject(
    id: string,
    updates: Partial<Omit<LocalSubject, 'id' | 'created_at'>>
  ): Promise<void> {
    const now = new Date().toISOString()
    await db.subjects.update(id, {
      ...updates,
      updated_at: now,
    })
  }

  static async deleteSubject(id: string): Promise<void> {
    const now = new Date().toISOString()
    await db.subjects.update(id, { archived_at: now, updated_at: now })
  }

  // Topic methods
  static async getTopicsBySubject(subjectId: string) {
    return await db.topics
      .where('subject_id')
      .equals(subjectId)
      .filter((t) => !t.archived_at)
      .sortBy('sort_order')
  }

  static async createTopic(data: {
    id: string
    subject_id: string
    parent_id?: string | null
    name: string
    sort_order: number
  }) {
    const now = new Date().toISOString()
    const topic = {
      ...data,
      created_at: now,
      updated_at: now,
    }
    await db.topics.add(topic)
    return topic
  }

  static async updateTopic(id: string, name: string) {
    const now = new Date().toISOString()
    await db.topics.update(id, { name, updated_at: now })
  }

  static async deleteTopic(id: string) {
    const now = new Date().toISOString()
    await db.topics.update(id, { archived_at: now, updated_at: now })
  }

  static async assignNoteToSubjectAndTopic(
    noteId: string,
    subjectId: string | null,
    topicId: string | null
  ) {
    const now = new Date().toISOString()
    await db.notes.update(noteId, {
      subject_id: subjectId,
      topic_id: topicId,
      updated_at: now,
    })
  }

  // Phase 5: Archive & Restoration methods
  static async getArchivedNotes(): Promise<LocalNote[]> {
    return await db.notes
      .filter((note) => Boolean(note.archived_at))
      .reverse()
      .sortBy('updated_at')
  }

  static async restoreNote(id: string): Promise<void> {
    const now = new Date().toISOString()
    await db.notes.update(id, {
      archived_at: null,
      updated_at: now,
    })
  }

  static async permanentlyDeleteNote(id: string): Promise<void> {
    await db.notes.delete(id)
  }

  static async emptyArchive(): Promise<void> {
    const archived = await db.notes.filter((n) => Boolean(n.archived_at)).toArray()
    const ids = archived.map((n) => n.id)
    await db.notes.bulkDelete(ids)
  }

  // Phase 5: Favorite & Pin toggles
  static async toggleFavorite(id: string): Promise<boolean> {
    const note = await db.notes.get(id)
    if (!note) return false
    const nextVal = !note.is_favorite
    const now = new Date().toISOString()
    await db.notes.update(id, { is_favorite: nextVal, updated_at: now })
    return nextVal
  }

  static async togglePin(id: string): Promise<boolean> {
    const note = await db.notes.get(id)
    if (!note) return false
    const nextVal = !note.is_pinned
    const now = new Date().toISOString()
    await db.notes.update(id, { is_pinned: nextVal, updated_at: now })
    return nextVal
  }

  // Phase 5: Tagging methods
  static async addTagToNote(noteId: string, tag: string): Promise<void> {
    const cleanTag = tag.toLowerCase().trim()
    if (!cleanTag) return
    const note = await db.notes.get(noteId)
    if (!note) return

    const currentTags = note.tags || []
    if (!currentTags.includes(cleanTag)) {
      const now = new Date().toISOString()
      await db.notes.update(noteId, {
        tags: [...currentTags, cleanTag],
        updated_at: now,
      })
    }
  }

  static async removeTagFromNote(noteId: string, tag: string): Promise<void> {
    const note = await db.notes.get(noteId)
    if (!note || !note.tags) return

    const now = new Date().toISOString()
    await db.notes.update(noteId, {
      tags: note.tags.filter((t) => t !== tag),
      updated_at: now,
    })
  }

  static async getAllUniqueTags(): Promise<string[]> {
    const notes = await db.notes.filter((n) => !n.archived_at).toArray()
    const tagsSet = new Set<string>()
    notes.forEach((note) => {
      note.tags?.forEach((tag) => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }
}
