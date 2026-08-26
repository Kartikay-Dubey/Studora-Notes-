# Studora — Product Specification

**Version:** 0.1.0 (Phase 0 — Initial Definition)  
**Last Updated:** 2026-08-23  
**Status:** Draft — Awaiting Phase 1 Approval

---

## 1. Problem Statement

Students across secondary school, undergraduate, and postgraduate programs struggle with:

1. **Fragmented tools** — notes in one app, tasks in another, flashcards in a third.
2. **Poor retrieval** — note-taking without structure leads to content that cannot be found or reviewed efficiently.
3. **No study context** — generic note-taking tools don't understand subjects, semesters, exams, or academic structure.
4. **Revision debt** — notes are created but never structured for active recall or spaced repetition.
5. **Task blindness** — assignments and deadlines exist outside the knowledge context they relate to.

Studora solves this by providing a single workspace that is aware of academic structure from the ground up.

---

## 2. Target Users

### Primary User: The Committed Student

A student who:
- Is serious about their studies (not casual)
- Takes notes regularly
- Wants to revise efficiently, not just re-read
- Has multiple subjects with different types of content
- Uses a laptop or desktop for primary study sessions
- May also use a phone for quick capture

### Secondary User: The Power Student

A student who additionally:
- Maintains a personal knowledge base across semesters
- Links concepts across subjects
- Wants to track their own learning progress over time
- Creates self-tests to verify comprehension

### Out of Scope (Phase 0–11)

- Educators / teachers creating shared content
- Students collaborating on shared notes in real time
- Casual users wanting a simple notepad

---

## 3. MVP Definition

The MVP (Minimum Viable Product) is the smallest set of features that delivers genuine standalone value to a committed student.

### MVP Core Features

| Feature | Description |
|---|---|
| **Authentication** | Sign up, sign in, sign out (email/password via Supabase Auth) |
| **Subjects** | Create, name, and color-code academic subjects |
| **Topics** | Create topics/folders within subjects to organize notes |
| **Notes** | Create, edit, and delete rich-text notes with Tiptap editor |
| **Note Organization** | Assign notes to subjects and topics |
| **Search** | Full-text search across all notes |
| **Tags** | Tag notes for cross-subject retrieval |
| **Favorites** | Star notes for quick access |
| **Dashboard** | Overview of recent notes, subjects, and upcoming tasks |
| **Basic Tasks** | Create and complete simple to-do items linked to subjects |

### What the MVP Deliberately Excludes

- Flashcards (Phase 7)
- Practice quizzes (Phase 7)
- File attachments (Phase 6)
- Templates (Phase 6)
- Calendar/planning view (Phase 8)
- Progress charts (Phase 8)
- Offline support (Phase 9)

---

## 4. Complete Product Vision

The full product (Phases 0–11) delivers:

### 4.1 Note-Taking System

- Rich-text editor powered by Tiptap with academic formatting
- Support for: headings, bold/italic/underline, lists, tables, code blocks, math (KaTeX), blockquotes, horizontal rules, task lists
- Distraction-free focus mode
- Full-width and document-width layout options
- Word count, reading time
- Last edited timestamp
- Note history (future consideration)

### 4.2 Organization System

```
Workspace
└── Subject (e.g., Organic Chemistry)
    └── Topic (e.g., Alkenes)
        └── Note (e.g., "Markovnikov's Rule")
```

- Subjects: color-coded, iconable, sortable
- Topics: nested folders within subjects
- Notes: can live in a subject (no topic) or in a specific topic
- Tags: cross-cutting labels that work across subjects and topics
- Favorites: starred items across all types
- Archive: soft-delete with full recovery

### 4.3 Search and Retrieval

- Global search (⌘K / Ctrl+K)
- Filter by subject, tag, date range, note type
- Search within a subject or topic
- Relevant snippet preview in results

### 4.4 Templates

- Pre-built templates: Lecture Notes, Study Guide, Problem Set, Cornell Notes, Meeting Notes, Chapter Summary
- User-defined templates saved from any note
- Template picker at note creation

### 4.5 Attachments and Resources

- File attachments (PDF, images) stored in Supabase Storage
- PDF viewer (in-app, embedded)
- Image display within notes
- Resource list per note, topic, or subject

### 4.6 Study Tools

- **Flashcard Decks**: create decks from notes or from scratch; card front/back
- **Flashcard Study Mode**: sequential review with confidence scoring (I got it / Almost / Missed)
- **Practice Quiz**: multiple-choice questions from flashcard content
- **Quick Quiz**: random 10-question quiz from a subject or tag
- **Study Session Log**: record what was studied, when, duration

### 4.7 Task Management

- Tasks linked to subjects, topics, or notes
- Due dates and time estimates
- Priority levels (High / Medium / Low)
- Repeat rules (daily, weekly, custom)
- Task views: list, grouped by subject, by due date
- Upcoming tasks widget on dashboard

### 4.8 Progress and Analytics

- Notes created per week/month chart
- Study session activity heatmap
- Flashcard mastery percentage per deck
- Task completion rate
- Subject coverage (topics with at least one note)

### 4.9 Keyboard Navigation

All primary workflows accessible via keyboard:
- ⌘K / Ctrl+K — global search / command palette
- ⌘N / Ctrl+N — new note
- ⌘P / Ctrl+P — navigate to subject/topic/note
- Editor shortcuts standard (bold, italic, etc.)

---

## 5. Information Architecture

```
Studora Workspace (user-scoped)
├── Dashboard
│   ├── Recent Notes
│   ├── Upcoming Tasks
│   ├── Recent Subjects
│   └── Study Activity Widget
│
├── Subjects (sidebar)
│   ├── Subject Detail
│   │   ├── Overview
│   │   ├── Topics list
│   │   ├── Notes (flat, in subject)
│   │   └── Resources
│   └── Topic Detail
│       ├── Notes list
│       └── Resources
│
├── Notes (global)
│   ├── All Notes
│   ├── Favorites
│   ├── Tags view
│   ├── Archive
│   └── Note Editor
│
├── Study Tools
│   ├── Flashcard Decks
│   │   ├── Deck Detail
│   │   └── Study Mode
│   └── Practice Quiz
│
├── Tasks
│   ├── Today
│   ├── Upcoming
│   ├── By Subject
│   └── Completed
│
├── Progress
│   ├── Activity Overview
│   ├── Subject Progress
│   └── Study Sessions
│
└── Settings
    ├── Profile
    ├── Appearance (theme, font size)
    ├── Keyboard Shortcuts
    └── Account
```

---

## 6. Core User Journeys

### Journey 1: First-Time Setup
1. Land on marketing/auth page
2. Sign up with email and password
3. Onboarding flow: create first subject, name it, pick color
4. Create first note inside that subject
5. Arrive at Dashboard

### Journey 2: Daily Note-Taking
1. Open Studora
2. See Dashboard with recent notes
3. Navigate to subject (sidebar click or ⌘P)
4. Open or create a note
5. Write lecture notes in editor
6. Tag the note
7. Note auto-saves

### Journey 3: Revision Session
1. Open subject
2. Browse topic notes
3. Open a note and read
4. Open linked flashcard deck
5. Study flashcards (confirm / almost / miss)
6. Review missed cards again
7. Mark study session as done

### Journey 4: Assignment Workflow
1. Receive assignment — open Tasks
2. Create task: "Essay on Photosynthesis", due in 5 days, linked to Biology
3. Open Biology > Photosynthesis topic
4. Create research note with sources and key points
5. Complete the task
6. Archive the draft note

### Journey 5: Exam Prep
1. Navigate to subject
2. Browse all notes for the subject
3. Open Quick Quiz (10 random flashcard questions)
4. Review wrong answers
5. Open original notes for context
6. Create a summary note from memory

---

## 7. Missing Requirements Analysis

### Identified During Phase 0 Review

| Gap | Decision |
|---|---|
| Password reset flow | Include in auth (Phase 1) |
| Account deletion | Include in settings (Phase 10) |
| Note versioning / history | Deferred to post-Phase 11 consideration |
| Export (PDF, Markdown) | Deferred — post-MVP roadmap item |
| Import from Notion / Markdown | Deferred — post-MVP roadmap item |
| Dark mode | Supported via Tailwind dark variant from Phase 1 |
| Custom fonts / themes beyond light/dark | Deferred |
| Math block (KaTeX) in editor | Phase 3 (advanced editor features) |
| Code block syntax highlighting | Phase 3 |
| Drag-and-drop note reordering | Phase 4 (dnd-kit) |
| Drag-and-drop topic reordering | Phase 4 |
| Spaced repetition algorithm | Phase 7 (study tools) |
| Linking notes to each other (backlinks) | Phase 5 (search/tags phase) |
| Inline note embeds | Post-Phase 11 |
| Offline support | Phase 9 |
| Multi-device sync | Native via Supabase (real-time) |
| Notifications / reminders | Phase 8 (tasks/calendar) |
| Table of contents for long notes | Phase 3 |
| Print-friendly note view | Phase 10 |
