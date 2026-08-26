import { NoteRepository } from '@/lib/repositories/note.repository'
import type { LocalNote } from '@/lib/db/studora-db'

export class NoteService {
  /**
   * Extract plain text recursively from Tiptap ProseMirror JSON schema
   */
  static extractPlainText(node: Record<string, unknown> | null): string {
    if (!node) return ''

    let text = ''
    if (typeof node.text === 'string') {
      text += node.text
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        if (child && typeof child === 'object') {
          text += ' ' + this.extractPlainText(child as Record<string, unknown>)
        }
      }
    }

    return text.replace(/\s+/g, ' ').trim()
  }

  /**
   * Count words in plain text string
   */
  static calculateWordCount(text: string): number {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).length
  }

  /**
   * Calculate reading time in minutes (assumes 200 wpm)
   */
  static calculateReadingTime(wordCount: number): number {
    if (wordCount === 0) return 1
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  /**
   * Save note updates with automatically computed metrics
   */
  static async saveNoteContent(
    id: string,
    title: string,
    content: Record<string, unknown> | null
  ): Promise<void> {
    const contentText = this.extractPlainText(content)
    const wordCount = this.calculateWordCount(contentText)
    const readingTimeMins = this.calculateReadingTime(wordCount)

    await NoteRepository.updateNote(id, {
      title,
      content,
      content_text: contentText,
      word_count: wordCount,
      reading_time_mins: readingTimeMins,
    })
  }

  /**
   * Create a new blank note with template content if provided
   */
  static async createNewNote(
    title: string = 'Untitled Note',
    subjectId?: string | null,
    templateContent?: Record<string, unknown>
  ): Promise<LocalNote> {
    const id = 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
    const content = templateContent || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: title }],
        },
        {
          type: 'paragraph',
          content: [],
        },
      ],
    }

    const contentText = this.extractPlainText(content)
    const wordCount = this.calculateWordCount(contentText)
    const readingTimeMins = this.calculateReadingTime(wordCount)

    return await NoteRepository.createNote({
      id,
      title,
      subject_id: subjectId || null,
      content,
      content_text: contentText,
      word_count: wordCount,
      reading_time_mins: readingTimeMins,
      is_pinned: false,
      is_favorite: false,
    })
  }
}
