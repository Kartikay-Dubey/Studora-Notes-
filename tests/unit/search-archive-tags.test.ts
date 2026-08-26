import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { db } from '@/lib/db/studora-db'

describe('NoteRepository Phase 5: Search, Tags, Favorites & Archive', () => {
  beforeEach(async () => {
    await db.notes.clear()
    await db.subjects.clear()
    await db.topics.clear()
  })

  it('adds and removes tags from notes and queries unique tags', async () => {
    const note = await NoteRepository.createNote({
      id: 'note-tag-1',
      title: 'Graph Theory',
      content: null,
      word_count: 5,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: false,
      tags: ['math'],
    })

    await NoteRepository.addTagToNote(note.id, 'algorithms')
    let fetched = await NoteRepository.getNoteById(note.id)
    expect(fetched?.tags).toContain('algorithms')
    expect(fetched?.tags).toContain('math')

    await NoteRepository.removeTagFromNote(note.id, 'math')
    fetched = await NoteRepository.getNoteById(note.id)
    expect(fetched?.tags).not.toContain('math')
    expect(fetched?.tags).toContain('algorithms')

    const uniqueTags = await NoteRepository.getAllUniqueTags()
    expect(uniqueTags).toContain('algorithms')
  })

  it('toggles favorite and pin states', async () => {
    const note = await NoteRepository.createNote({
      id: 'note-fav-1',
      title: 'Operating Systems Scheduling',
      content: null,
      word_count: 12,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: false,
    })

    const isFav = await NoteRepository.toggleFavorite(note.id)
    expect(isFav).toBe(true)

    const fetched = await NoteRepository.getNoteById(note.id)
    expect(fetched?.is_favorite).toBe(true)

    const isPin = await NoteRepository.togglePin(note.id)
    expect(isPin).toBe(true)
  })

  it('archives, restores, and permanently deletes notes', async () => {
    const note = await NoteRepository.createNote({
      id: 'note-arch-1',
      title: 'TCP Flow Control',
      content: null,
      word_count: 20,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: false,
    })

    await NoteRepository.softDeleteNote(note.id)
    let activeNotes = await NoteRepository.getAllNotes()
    expect(activeNotes.find((n) => n.id === note.id)).toBeUndefined()

    let archived = await NoteRepository.getArchivedNotes()
    expect(archived.find((n) => n.id === note.id)).toBeDefined()

    await NoteRepository.restoreNote(note.id)
    activeNotes = await NoteRepository.getAllNotes()
    expect(activeNotes.find((n) => n.id === note.id)).toBeDefined()

    await NoteRepository.permanentlyDeleteNote(note.id)
    const afterDelete = await NoteRepository.getNoteById(note.id)
    expect(afterDelete).toBeUndefined()
  })

  it('searches notes by title and content text', async () => {
    await NoteRepository.createNote({
      id: 'note-search-1',
      title: 'Markovnikov Addition',
      content: null,
      content_text: 'Electrophilic addition of HX to asymmetric alkenes.',
      word_count: 8,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: false,
      tags: ['chemistry'],
    })

    const byTitle = await NoteRepository.searchNotes('Markovnikov')
    expect(byTitle.length).toBe(1)

    const byContent = await NoteRepository.searchNotes('electrophilic')
    expect(byContent.length).toBe(1)

    const byTag = await NoteRepository.searchNotes('chemistry')
    expect(byTag.length).toBe(1)
  })
})
