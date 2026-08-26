/**
 * Studora Database Types
 *
 * This file contains TypeScript types for the Supabase database schema.
 * Generated types will be added here when the Supabase project is configured.
 * Manual type definitions are used in Phase 1 until the DB is bootstrapped.
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type FavoritableType = 'note' | 'subject' | 'topic' | 'deck'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'custom'
export type CardConfidence = 'unseen' | 'missed' | 'almost' | 'got_it'
export type SessionType = 'flashcard' | 'reading' | 'quiz'

// ─── Row Types ────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  sort_order: number
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  user_id: string
  subject_id: string
  parent_id: string | null
  name: string
  sort_order: number
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  subject_id: string | null
  topic_id: string | null
  title: string
  content: Record<string, unknown> | null  // Tiptap ProseMirror JSON
  content_text: string | null
  word_count: number | null
  is_pinned: boolean
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface NoteTag {
  note_id: string
  tag_id: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  favoritable_type: FavoritableType
  favoritable_id: string
  created_at: string
}

export interface Attachment {
  id: string
  user_id: string
  note_id: string | null
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  created_at: string
}

export interface Template {
  id: string
  user_id: string | null
  name: string
  description: string | null
  content: Record<string, unknown>
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  subject_id: string | null
  note_id: string | null
  title: string
  description: string | null
  priority: TaskPriority
  due_date: string | null
  due_time: string | null
  is_completed: boolean
  completed_at: string | null
  repeat_rule: TaskRepeat
  sort_order: number
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface FlashcardDeck {
  id: string
  user_id: string
  subject_id: string | null
  topic_id: string | null
  note_id: string | null
  name: string
  description: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface Flashcard {
  id: string
  user_id: string
  deck_id: string
  front: string
  back: string
  last_confidence: CardConfidence
  last_reviewed_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  subject_id: string | null
  deck_id: string | null
  started_at: string
  ended_at: string | null
  duration_sec: number | null
  cards_reviewed: number
  cards_correct: number
  session_type: SessionType
}

// ─── Supabase Database Type ───────────────────────────────────────────────────

/**
 * Supabase generic Database type used by createClient<Database>().
 * Will be replaced with auto-generated types from `supabase gen types` once
 * the Supabase project is configured.
 */
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      subjects: { Row: Subject; Insert: Partial<Subject>; Update: Partial<Subject> }
      topics: { Row: Topic; Insert: Partial<Topic>; Update: Partial<Topic> }
      notes: { Row: Note; Insert: Partial<Note>; Update: Partial<Note> }
      tags: { Row: Tag; Insert: Partial<Tag>; Update: Partial<Tag> }
      note_tags: { Row: NoteTag; Insert: Partial<NoteTag>; Update: Partial<NoteTag> }
      favorites: { Row: Favorite; Insert: Partial<Favorite>; Update: Partial<Favorite> }
      attachments: { Row: Attachment; Insert: Partial<Attachment>; Update: Partial<Attachment> }
      templates: { Row: Template; Insert: Partial<Template>; Update: Partial<Template> }
      tasks: { Row: Task; Insert: Partial<Task>; Update: Partial<Task> }
      flashcard_decks: { Row: FlashcardDeck; Insert: Partial<FlashcardDeck>; Update: Partial<FlashcardDeck> }
      flashcards: { Row: Flashcard; Insert: Partial<Flashcard>; Update: Partial<Flashcard> }
      study_sessions: { Row: StudySession; Insert: Partial<StudySession>; Update: Partial<StudySession> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      favoritable_type: FavoritableType
      task_priority: TaskPriority
      task_repeat: TaskRepeat
      card_confidence: CardConfidence
    }
  }
}
