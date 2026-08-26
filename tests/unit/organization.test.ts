import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { db } from '@/lib/db/studora-db'

describe('NoteRepository Subject & Topic Organization', () => {
  beforeEach(async () => {
    await db.subjects.clear()
    await db.topics.clear()
    await db.notes.clear()
  })

  it('creates and retrieves academic subjects', async () => {
    const newSub = await NoteRepository.createSubject({
      id: 'sub-test-1',
      name: 'Quantum Physics',
      description: 'Schrodinger equation & wave functions',
      color: 'cobalt',
      sort_order: 1,
    })

    expect(newSub.id).toBe('sub-test-1')
    expect(newSub.name).toBe('Quantum Physics')

    const fetched = await NoteRepository.getSubjectById('sub-test-1')
    expect(fetched?.color).toBe('cobalt')
  })

  it('creates topics and sub-topics within a subject', async () => {
    await NoteRepository.createSubject({
      id: 'sub-cs',
      name: 'Computer Science',
      color: 'indigo',
      sort_order: 1,
    })

    const rootTopic = await NoteRepository.createTopic({
      id: 'top-1',
      subject_id: 'sub-cs',
      name: 'Algorithms',
      sort_order: 1,
    })

    const childTopic = await NoteRepository.createTopic({
      id: 'top-2',
      subject_id: 'sub-cs',
      parent_id: 'top-1',
      name: 'Graph Traversal',
      sort_order: 2,
    })

    const topics = await NoteRepository.getTopicsBySubject('sub-cs')
    expect(topics.length).toBe(2)
    expect(topics.find((t) => t.id === 'top-2')?.parent_id).toBe('top-1')
  })

  it('assigns notes to a subject and topic', async () => {
    const note = await NoteRepository.createNote({
      id: 'note-test-1',
      title: 'Dijkstra Algorithm',
      content: null,
      word_count: 10,
      reading_time_mins: 1,
      is_pinned: false,
      is_favorite: false,
    })

    await NoteRepository.assignNoteToSubjectAndTopic('note-test-1', 'sub-cs', 'top-2')

    const updated = await NoteRepository.getNoteById('note-test-1')
    expect(updated?.subject_id).toBe('sub-cs')
    expect(updated?.topic_id).toBe('top-2')
  })
})
