# Studora — Data Model

**Version:** 0.1.0 (Phase 0)  
**Last Updated:** 2026-08-23  
**Status:** Draft — Will be implemented in Phase 1

---

## 1. Design Principles

- Every row is owned by a user (`user_id UUID NOT NULL` on all tables)
- Row Level Security enforced on all tables
- Soft deletes for user-created content (`archived_at TIMESTAMPTZ NULL`)
- Audit fields on all tables: `created_at`, `updated_at`
- `updated_at` maintained via trigger function
- UUIDs as primary keys (Supabase default `gen_random_uuid()`)

---

## 2. Entity Relationship Overview

```
profiles (1) ──────── (N) subjects
subjects (1) ──────── (N) topics
subjects (1) ──────── (N) notes
topics   (1) ──────── (N) notes
notes    (M) ──────── (N) tags        [via note_tags join]
notes    (1) ──────── (N) attachments
notes    (1) ──────── (N) flashcards
profiles (1) ──────── (N) tasks
tasks    (N) ──────── (1) subjects    [optional FK]
tasks    (N) ──────── (1) notes       [optional FK]
profiles (1) ──────── (N) tags
profiles (1) ──────── (N) flashcard_decks
flashcard_decks (1) – (N) flashcards
profiles (1) ──────── (N) study_sessions
profiles (1) ──────── (N) favorites   [polymorphic]
```

---

## 3. Schema Definitions

### 3.1 `profiles`

Extension of `auth.users`. Created automatically via trigger on user signup.

```sql
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and update own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

### 3.2 `subjects`

Top-level organizational unit. Represents an academic subject or course.

```sql
CREATE TABLE subjects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  description   TEXT,
  color         TEXT NOT NULL DEFAULT 'slate',    -- from design system palette
  icon          TEXT,                              -- Lucide icon name, optional
  sort_order    INTEGER NOT NULL DEFAULT 0,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subjects_user_id ON subjects(user_id);
CREATE INDEX idx_subjects_archived ON subjects(user_id, archived_at);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subjects" ON subjects
  FOR ALL USING (auth.uid() = user_id);
```

### 3.3 `topics`

Folders within a subject. Up to 2 levels of nesting (parent_id for one level of sub-topics).

```sql
CREATE TABLE topics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES topics(id) ON DELETE CASCADE,  -- NULL = top-level
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_topics_subject_id ON topics(subject_id);
CREATE INDEX idx_topics_parent_id ON topics(parent_id);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own topics" ON topics
  FOR ALL USING (auth.uid() = user_id);
```

**Constraint:** Maximum nesting depth = 2 levels. Enforced at application layer.

### 3.4 `notes`

Core content entity. Contains the actual note content.

```sql
CREATE TABLE notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic_id      UUID REFERENCES topics(id) ON DELETE SET NULL,
  title         TEXT NOT NULL DEFAULT 'Untitled',
  content       JSONB,                              -- Tiptap ProseMirror JSON
  content_text  TEXT,                               -- Extracted plain text for search
  word_count    INTEGER GENERATED ALWAYS AS (
                  array_length(regexp_split_to_array(trim(content_text), '\s+'), 1)
                ) STORED,
  is_pinned     BOOLEAN NOT NULL DEFAULT false,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search vector
ALTER TABLE notes ADD COLUMN search_vector TSVECTOR
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content_text, '')), 'B')
  ) STORED;

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_subject_id ON notes(subject_id);
CREATE INDEX idx_notes_topic_id ON notes(topic_id);
CREATE INDEX idx_notes_search ON notes USING GIN(search_vector);
CREATE INDEX idx_notes_updated ON notes(user_id, updated_at DESC);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);
```

**Notes on content storage:**
- `content` JSONB stores full Tiptap document JSON (safe, structured, diffable)
- `content_text` plain text extracted server-side on save for search indexing
- `search_vector` auto-updated via generated column

### 3.5 `tags`

User-defined labels. Global across all subjects.

```sql
CREATE TABLE tags (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  color         TEXT NOT NULL DEFAULT 'slate',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)                              -- No duplicate tag names per user
);

CREATE INDEX idx_tags_user_id ON tags(user_id);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);
```

### 3.6 `note_tags`

Many-to-many join between notes and tags.

```sql
CREATE TABLE note_tags (
  note_id       UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (note_id, tag_id)
);

CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own note tags" ON note_tags
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM notes WHERE id = note_id)
  );
```

### 3.7 `favorites`

Polymorphic favorites. One table for all favoritable types.

```sql
CREATE TYPE favoritable_type AS ENUM ('note', 'subject', 'topic', 'deck');

CREATE TABLE favorites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  favoritable_type favoritable_type NOT NULL,
  favoritable_id   UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, favoritable_type, favoritable_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);
```

### 3.8 `attachments`

Files associated with notes. Stored in Supabase Storage.

```sql
CREATE TABLE attachments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note_id       UUID REFERENCES notes(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL,                       -- MIME type
  file_size     INTEGER NOT NULL,                    -- bytes
  storage_path  TEXT NOT NULL,                       -- Supabase Storage path
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_note_id ON attachments(note_id);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own attachments" ON attachments
  FOR ALL USING (auth.uid() = user_id);
```

### 3.9 `templates`

Reusable note templates. System-provided or user-created.

```sql
CREATE TABLE templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- NULL = system template
  name          TEXT NOT NULL,
  description   TEXT,
  content       JSONB NOT NULL,                      -- Tiptap JSON template content
  is_system     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view system templates and own templates" ON templates
  FOR SELECT USING (is_system = true OR auth.uid() = user_id);
CREATE POLICY "Users can manage own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own templates" ON templates
  FOR DELETE USING (auth.uid() = user_id);
```

### 3.10 `tasks`

Academic tasks / to-do items.

```sql
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_repeat AS ENUM ('none', 'daily', 'weekly', 'custom');

CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    UUID REFERENCES subjects(id) ON DELETE SET NULL,
  note_id       UUID REFERENCES notes(id) ON DELETE SET NULL,
  title         TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description   TEXT,
  priority      task_priority NOT NULL DEFAULT 'medium',
  due_date      DATE,
  due_time      TIME,
  is_completed  BOOLEAN NOT NULL DEFAULT false,
  completed_at  TIMESTAMPTZ,
  repeat_rule   task_repeat NOT NULL DEFAULT 'none',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_subject_id ON tasks(subject_id);
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date);
CREATE INDEX idx_tasks_completed ON tasks(user_id, is_completed);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
```

### 3.11 `flashcard_decks`

Collections of flashcards. Can be linked to a note, topic, or subject.

```sql
CREATE TABLE flashcard_decks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    UUID REFERENCES subjects(id) ON DELETE SET NULL,
  topic_id      UUID REFERENCES topics(id) ON DELETE SET NULL,
  note_id       UUID REFERENCES notes(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  archived_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_decks_user_id ON flashcard_decks(user_id);

ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own decks" ON flashcard_decks
  FOR ALL USING (auth.uid() = user_id);
```

### 3.12 `flashcards`

Individual flashcard items.

```sql
CREATE TYPE card_confidence AS ENUM ('unseen', 'missed', 'almost', 'got_it');

CREATE TABLE flashcards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deck_id         UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front           TEXT NOT NULL,
  back            TEXT NOT NULL,
  last_confidence card_confidence NOT NULL DEFAULT 'unseen',
  last_reviewed_at TIMESTAMPTZ,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_flashcards_deck_id ON flashcards(deck_id);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own flashcards" ON flashcards
  FOR ALL USING (auth.uid() = user_id);
```

### 3.13 `study_sessions`

Log of study activity for progress tracking.

```sql
CREATE TABLE study_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    UUID REFERENCES subjects(id) ON DELETE SET NULL,
  deck_id       UUID REFERENCES flashcard_decks(id) ON DELETE SET NULL,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at      TIMESTAMPTZ,
  duration_sec  INTEGER,                             -- computed on session end
  cards_reviewed INTEGER DEFAULT 0,
  cards_correct  INTEGER DEFAULT 0,
  session_type  TEXT NOT NULL DEFAULT 'flashcard'    -- 'flashcard', 'reading', 'quiz'
);

CREATE INDEX idx_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_sessions_started ON study_sessions(user_id, started_at DESC);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON study_sessions
  FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Shared Database Functions

### 4.1 `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to all tables with updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- (repeated for: topics, notes, tasks, flashcard_decks, flashcards, templates)
```

### 4.2 Profile Creation Trigger

```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();
```

---

## 5. Data Constraints and Rules

| Rule | Implementation |
|---|---|
| A topic must belong to a subject | FK constraint (subject_id NOT NULL on topics) |
| A note can be in a subject without a topic | subject_id is nullable, topic_id is nullable |
| A note's topic must belong to the note's subject | Application-level validation + DB check constraint (Phase 1) |
| Tags are unique per user | UNIQUE(user_id, name) on tags |
| Favorites are unique per user+type+id | UNIQUE constraint on favorites |
| Task priority defaults to medium | DEFAULT 'medium' |
| Note title defaults to 'Untitled' | DEFAULT 'Untitled' |
| User cannot access another user's data | RLS on all tables |

---

## 6. Storage Structure

Supabase Storage bucket: `studora-user-files`

```
{user_id}/
├── attachments/
│   └── {attachment_id}/{original_filename}
└── avatars/
    └── {user_id}.{ext}
```

- Storage bucket: private (requires auth to access)
- Signed URLs generated per-request (24h expiry)
- Max file size: 50MB per attachment (Phase 6)
- Allowed types: PDF, PNG, JPG, JPEG, GIF, SVG, WEBP, MP4 (Phase 6)
