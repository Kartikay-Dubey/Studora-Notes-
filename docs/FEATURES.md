# Studora — Feature Inventory

**Version:** 0.1.0 (Phase 0)  
**Last Updated:** 2026-08-23

Status key: `planned` | `in-progress` | `done` | `deferred` | `cancelled`

---

## Authentication

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Sign up (email/password) | planned | 1 | |
| Sign in | planned | 1 | |
| Sign out | planned | 1 | |
| Password reset flow | planned | 1 | |
| Session persistence | planned | 1 | |
| Profile creation on signup | planned | 1 | Via DB trigger |
| Protected route middleware | planned | 1 | |
| Account deletion | planned | 10 | GDPR compliance |
| Social login (Google) | deferred | post-11 | |

---

## Application Shell

| Feature | Status | Phase | Notes |
|---|---|---|---|
| App layout (sidebar + topbar) | planned | 2 | |
| Sidebar navigation | planned | 2 | |
| Sidebar collapse | planned | 2 | |
| Top bar with search trigger | planned | 2 | |
| User menu (avatar, sign out) | planned | 2 | |
| Dark / light mode toggle | planned | 2 | |
| Keyboard shortcut: ⌘K global search | planned | 2 | |
| Responsive sidebar (drawer on mobile) | planned | 2 | |
| Active nav item indication | planned | 2 | |

---

## Notes

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create note | planned | 3 | |
| Open / view note | planned | 3 | |
| Edit note (rich text) | planned | 3 | |
| Note title editing | planned | 3 | |
| Auto-save (debounced) | planned | 3 | 1500ms debounce |
| Save indicator (saving/saved) | planned | 3 | |
| Delete note (soft delete) | planned | 3 | |
| Restore from archive | planned | 3 | |
| Assign note to subject | planned | 3 | |
| Assign note to topic | planned | 4 | |
| Pin note | planned | 3 | |
| All Notes view | planned | 3 | |
| Recent notes list | planned | 3 | |
| Note word count | planned | 3 | |
| Note metadata (created, updated) | planned | 3 | |
| Note breadcrumb navigation | planned | 3 | |
| Distraction-free / focus mode | planned | 3 | |
| Note history / versioning | deferred | post-11 | |
| Export note as PDF | deferred | post-11 | |
| Export note as Markdown | deferred | post-11 | |

---

### Phase 3 — Notes & Editor (Complete)

- [x] Tiptap rich-text editor engine integration (`@tiptap/react`)
- [x] Rich formatting: Headings H1–H3, Bold, Italic, Underline, Highlight, Lists (bullet, numbered, checklist), Tables, Quotes, Code Blocks
- [x] Custom Student Editorial Blocks (`Important`, `Definition`, `Exam Point`, `Example`, `Common Mistake`, `Remember`, `Question`, `Formula`, `Summary`)
- [x] Slash command system (`/`) for fast block insertion
- [x] Bubble formatting toolbar for selected text
- [x] Auto-save (1200ms debounced sync) to local IndexedDB via Dexie.js
- [x] Word count, reading time estimation, and live metrics
- [x] Document Outline / Table of Contents panel generated from H1–H3 headings with click-to-jump navigation
- [x] Distraction-free Focus Mode (fades chrome for centered document canvas)
- [x] Editorial Reading Mode (serif typography, enhanced line height)
- [x] Note Library list view (`/notes`) with live reactive search and initial data seed

---

## Subjects

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create subject | planned | 4 | |
| Edit subject (name, color, icon) | planned | 4 | |
| Delete subject (with confirmation) | planned | 4 | |
| Archive subject | planned | 4 | |
| Subject list in sidebar | planned | 4 | |
| Subject detail page (overview) | planned | 4 | |
| Subject color indicator | planned | 4 | |
| Subject icon selection | planned | 4 | |
| Subject sort / reorder (drag) | planned | 4 | dnd-kit |
| Subject note count | planned | 4 | |

---

## Topics (Folders)

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create topic within subject | planned | 4 | |
| Edit topic | planned | 4 | |
| Delete topic | planned | 4 | |
| Archive topic | planned | 4 | |
| Sub-topic (1 level of nesting) | planned | 4 | Max depth: 2 |
| Topic list view | planned | 4 | |
| Topic reorder (drag) | planned | 4 | dnd-kit |
| Move note between topics | planned | 4 | |
| Move note between subjects | planned | 4 | |

---

## Search and Discovery

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Global full-text search | planned | 5 | PostgreSQL tsvector |
| Search UI (command palette) | planned | 5 | ⌘K |
| Search result snippets | planned | 5 | |
| Filter by subject | planned | 5 | |
| Filter by tag | planned | 5 | |
| Filter by date range | planned | 5 | |
| Search within subject | planned | 5 | |
| Keyboard navigation of results | planned | 5 | |
| Recent searches | planned | 5 | localStorage |

---

## Tags

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create tag | planned | 5 | |
| Apply tag to note | planned | 5 | |
| Remove tag from note | planned | 5 | |
| Tag list page | planned | 5 | |
| Notes by tag view | planned | 5 | |
| Delete tag | planned | 5 | |
| Edit tag color | planned | 5 | |

---

## Favorites and Archive

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Favorite a note | planned | 5 | |
| Favorite a subject | planned | 5 | |
| Favorites sidebar section | planned | 5 | |
| Archive note | planned | 5 | |
| Archive view | planned | 5 | |
| Restore from archive | planned | 5 | |
| Permanent delete from archive | planned | 5 | |

---

## Backlinks

| Feature | Status | Phase | Notes |
|---|---|---|---|
| [[Note]] reference syntax in editor | planned | 5 | |
| Backlinks panel on note | planned | 5 | |
| Navigate to linked note | planned | 5 | |

---

## Templates

| Feature | Status | Phase | Notes |
|---|---|---|---|
| System templates (6 types) | planned | 6 | Lecture, Cornell, etc. |
| Template picker on note creation | planned | 6 | |
| Save note as template | planned | 6 | |
| Manage user templates | planned | 6 | |
| Delete user template | planned | 6 | |

---

## Attachments and Resources

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Attach file to note | planned | 6 | Supabase Storage |
| File list on note | planned | 6 | |
| Download attachment | planned | 6 | |
| Delete attachment | planned | 6 | |
| In-app PDF viewer | planned | 6 | |
| Image display in note | planned | 6 | |
| Resource list per subject | planned | 6 | |
| Resource list per topic | planned | 6 | |

---

## Flashcards

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create flashcard deck | planned | 7 | |
| Create flashcard (front/back) | planned | 7 | |
| Edit flashcard | planned | 7 | |
| Delete flashcard | planned | 7 | |
| Deck list view | planned | 7 | |
| Deck study mode | planned | 7 | Sequential review |
| Confidence scoring (Got it / Almost / Missed) | planned | 7 | |
| Missed cards review round | planned | 7 | |
| Flashcard mastery % per deck | planned | 7 | |
| Link deck to note/topic/subject | planned | 7 | |

---

## Practice Quiz

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Multiple-choice quiz from deck | planned | 7 | |
| Quick Quiz (10 random questions) | planned | 7 | |
| Quiz result summary | planned | 7 | |
| Wrong answer review | planned | 7 | |

---

## Study Sessions

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Start / end study session | planned | 7 | |
| Session log (what, when, duration) | planned | 7 | |
| Session history view | planned | 7 | |

---

## Tasks

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Create task | planned | 8 | |
| Complete task | planned | 8 | |
| Edit task | planned | 8 | |
| Delete task | planned | 8 | |
| Set due date | planned | 8 | |
| Set priority | planned | 8 | |
| Link task to subject | planned | 8 | |
| Link task to note | planned | 8 | |
| Task list view | planned | 8 | |
| Today / Upcoming view | planned | 8 | |
| Group by subject | planned | 8 | |
| Upcoming tasks widget (dashboard) | planned | 8 | |
| Task repeat rules | planned | 8 | daily/weekly |

---

## Calendar / Planning

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Calendar view of tasks/deadlines | planned | 8 | |
| Week/month toggle | planned | 8 | |

---

## Progress and Analytics

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Notes created per week chart | planned | 8 | Recharts |
| Study session activity heatmap | planned | 8 | |
| Flashcard mastery per deck | planned | 8 | |
| Task completion rate | planned | 8 | |
| Subject coverage | planned | 8 | |
| Dashboard overview widgets | planned | 8 | |

---

## Responsive / PWA

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Mobile-responsive layout | planned | 9 | |
| Touch-friendly interactions | planned | 9 | |
| PWA manifest | planned | 9 | |
| Service worker (offline basics) | planned | 9 | |
| Offline read access | planned | 9 | |

---

## Settings

| Feature | Status | Phase | Notes |
|---|---|---|---|
| Edit display name | planned | 2 | |
| Change avatar | planned | 2 | |
| Theme toggle (light/dark) | planned | 2 | |
| Font size preference | planned | 2 | |
| Keyboard shortcuts reference | planned | 2 | |
| Change password | planned | 10 | |
| Account deletion | planned | 10 | |

---

## Quality, Accessibility, Performance

| Feature | Status | Phase | Notes |
|---|---|---|---|
| WCAG 2.1 AA compliance | planned | 10 | |
| Keyboard navigation audit | planned | 10 | |
| Screen reader testing | planned | 10 | |
| Core Web Vitals audit | planned | 10 | |
| Lighthouse CI | planned | 10 | |
| Unit test coverage >80% | planned | 10 | |
| E2E critical path coverage | planned | 10 | Playwright |
| Print stylesheet | planned | 10 | |
| Security headers | planned | 10 | |
