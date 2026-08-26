# Studora — Development Roadmap

**Version:** 0.1.0 (Phase 0)  
**Last Updated:** 2026-08-23

---

## Phase Overview

| Phase | Name | Status | Target |
|---|---|---|---|
| 0 | Documentation & Architecture | **Complete** | Week 1 |
| 1 | Project Foundation & Design System | **Complete** | Week 2 |
| 2 | Application Shell & Navigation | **Complete** | Week 3 |
| 3 | Notes & Editor | **Complete** | Week 4–5 |
| 4 | Subjects, Topics & Organization | **Complete** | Week 6–7 |
| 5 | Search, Tags, Favorites & Archive | **Complete** | Week 8 |
| 6 | Templates, Attachments & Academic Features | Planned | Week 9–10 |
| 7 | Study Tools (Flashcards & Quizzes) | Planned | Week 11–12 |
| 8 | Tasks, Calendar & Progress Analytics | Planned | Week 13–14 |
| 9 | Responsive, Mobile & PWA | Planned | Week 15 |
| 10 | Testing, Accessibility & Performance | Planned | Week 16–17 |
| 11 | Final Documentation & Production Readiness | Planned | Week 18 |
| 12 | AI Integration (future) | Deferred | TBD |

---

## Phase 0 — Documentation & Architecture

**Goal:** Define the product, technical architecture, data model, and design system with enough clarity to begin implementation without guessing.

**Deliverables:**
- [x] Product specification (problem, users, MVP, full vision)
- [x] Information architecture and user journeys
- [x] Technical architecture decisions (15 ADRs)
- [x] Complete PostgreSQL schema design
- [x] Design system direction (colors, typography, spacing, components)
- [x] Feature inventory with phase assignments
- [x] Full documentation structure (12 documents)

**Exit Criteria:**  
All documentation reviewed and approved. Phase 1 approved to begin.

---

## Phase 1 — Project Foundation & Design System

**Goal:** Scaffold the Next.js project, configure all tooling, implement the design system in code, and establish the development environment.

**Deliverables:**
- [x] Initialize Next.js project with TypeScript and App Router
- [x] Configure Tailwind CSS with Studora design tokens
- [x] Install and configure shadcn/ui components
- [x] Implement CSS custom property token system (light + dark mode)
- [x] Configure Inter, Lora, JetBrains Mono fonts
- [x] Configure Supabase JS client (browser + server)
- [x] Configure middleware for auth protection
- [x] Create `.env.example` and `.env.local`
- [x] Set up Vitest
- [x] Set up Playwright
- [x] Set up ESLint + Prettier
- [x] Create basic component library (Button, Input, Textarea, Label, Card, Badge, Skeleton, Separator, Tooltip, Dialog, DropdownMenu, Avatar)
- [x] Implement theme toggle (light/dark) with localStorage persistence
- [x] Write Vitest tests for design system utilities

**Exit Criteria:**  
Project runs locally. Design tokens visible and correct in both themes. No TypeScript errors. No lint errors.

---

## Phase 2 — Application Shell & Navigation

**Goal:** Build the persistent application shell — sidebar, top bar, routing, and navigation — that all other features will live inside.

**Deliverables:**
- [x] App layout with sidebar + top bar
- [x] Sidebar: navigation sections (Dashboard, Subjects, Notes, Study, Tasks, Progress, Settings)
- [x] Sidebar: static subject list preview with color badges
- [x] Sidebar: collapse/expand behavior with localStorage persistence
- [x] Sidebar: active item indication
- [x] Top bar: breadcrumbs, global search trigger (⌘K), user avatar/menu
- [x] User menu: display name, theme toggle, sign out
- [x] Responsive: sidebar drawer on mobile (MobileNav)
- [x] Auth pages: Sign in, Sign up, Password reset (UI + Supabase Auth integration)
- [x] Auth middleware: protect `/dashboard` and app routes
- [x] Dashboard page shell (`/dashboard`)
- [x] Settings page (`/settings`)
- [x] Global command palette stub (⌘K search modal)
- [x] Custom 404 page (`app/not-found.tsx`)

**Exit Criteria:**  
User can sign up, sign in, sign out. Protected routes redirect correctly. Shell renders on all viewports. No broken navigation links.

---

## Phase 3 — Notes & Editor

**Goal:** Implement the core note-taking experience — the richest, most-used part of the application.

**Deliverables:**
- [ ] Create note (from dashboard or ⌘N)
- [ ] Note editor page layout (breadcrumb, toolbar, canvas)
- [ ] Tiptap editor integration with all planned extensions
- [ ] Editor toolbar (formatting controls)
- [ ] Auto-save with debounce (1500ms) and save indicator
- [ ] Note title inline editing
- [ ] All Notes list view (sorted by updated_at)
- [ ] Recent notes widget (dashboard)
- [ ] Delete note (soft delete with confirmation)
- [ ] Pin note
- [ ] Note metadata display (created, updated, word count)
- [ ] Distraction-free / focus mode
- [ ] Assign note to subject (Phase 4 will add topic assignment)
- [ ] Empty state for All Notes
- [ ] Loading state for note list and editor
- [ ] Error state for failed saves
- [ ] Vitest: editor utility tests
- [ ] Playwright: create note → edit → auto-save → close → reopen journey

**Exit Criteria:**  
User can create, edit, and return to notes. Content persists in Supabase. Auto-save works. All states (loading, empty, error) render correctly.

---

## Phase 4 — Subjects, Topics & Organization

**Goal:** Build the academic organization layer — subjects, topics, and the ability to assign notes to them.

**Deliverables:**
- [x] Create subject (name, color, description)
- [x] Edit subject
- [x] Delete / archive subject
- [x] Subject list in sidebar & subjects shelf page (`/subjects`)
- [x] Subject detail page (overview + note list + topic tree at `/subjects/[subjectId]`)
- [x] Create topic within subject
- [x] Edit topic
- [x] Delete / archive topic
- [x] Sub-topic support (1 level deep)
- [x] Topic filtering in Subject Detail view
- [x] Assign note to subject & topic (`MoveNoteDialog`)
- [x] Subject note count indicator
- [x] Empty states for subject and topic views
- [x] Vitest: subject, topic, and note assignment tests (25 passing unit tests)

**Exit Criteria:**  
Full organizational hierarchy works. Notes correctly filter by subject and topic. All unit tests pass. Production build succeeds cleanly.

---

## Phase 5 — Search, Tags, Favorites & Archive

**Goal:** Make content discoverable and retrievable. Implement tags, favorites, archive, and full-text search.

**Deliverables:**
- [x] Global full-text search page (`/search`) with term highlight matching
- [x] Search input in Sidebar, TopBar, and Command Palette (`⌘K`)
- [x] Tag creation & assignment (`TagPicker.tsx`)
- [x] Tag filtering chips in Notes Library (`/notes`)
- [x] Tag color badges
- [x] Starred / Favorite notes filter and card toggles
- [x] Archive / Soft-delete notes page (`/archive`)
- [x] Restore archived note
- [x] Permanently delete note and Empty Archive action
- [x] Vitest: search, tags, favorites, and archive test suite (29 passing unit tests)

**Exit Criteria:**  
Search returns matching results instantaneously with highlighted terms. Notes can be tagged, starred, filtered, archived, restored, and permanently deleted. All 29 unit tests pass. Production build succeeds cleanly.

---

## Phase 6 — Templates, Attachments & Academic Features

**Goal:** Add depth to the note-taking experience with templates, file attachments, and academic-specific editor features.

**Deliverables:**
- [ ] 6 system templates (Lecture Notes, Cornell Notes, Study Guide, Problem Set, Chapter Summary, Meeting Notes)
- [ ] Template picker at note creation
- [ ] Save note as template
- [ ] User template management (list, delete)
- [ ] File attachment to notes (Supabase Storage)
- [ ] Attachment list on note
- [ ] File download
- [ ] Delete attachment
- [ ] In-app PDF viewer (iframe or react-pdf)
- [ ] Image display within note
- [ ] Resource list per subject / topic
- [ ] Image paste into editor
- [ ] Table of contents auto-generated from headings
- [ ] Playwright: create from template; attach file; view attachment

**Exit Criteria:**  
Templates apply correctly. Files upload, display, and download successfully. PDF viewer renders. Template management CRUD works.

---

## Phase 7 — Study Tools

**Goal:** Build the revision and active recall tools: flashcards, practice quizzes, and study session logging.

**Deliverables:**
- [ ] Create flashcard deck (linked to subject/topic/note)
- [ ] Add, edit, delete flashcards
- [ ] Deck list view
- [ ] Flashcard study mode (sequential review)
- [ ] Confidence scoring (Got it / Almost / Missed)
- [ ] Missed cards review round
- [ ] Deck mastery percentage
- [ ] Multiple-choice practice quiz from deck
- [ ] Quick Quiz (10 random questions from subject or tag)
- [ ] Quiz result summary
- [ ] Study session start/end logging
- [ ] Study session history view
- [ ] Playwright: create deck → study all cards → complete session → view mastery

**Exit Criteria:**  
Full flashcard CRUD works. Study mode completes correctly. Quiz generates questions from flashcard content. Session is logged.

---

## Phase 8 — Tasks, Calendar & Progress Analytics

**Goal:** Add task management, deadline tracking, and learning progress visualization.

**Deliverables:**
- [ ] Create, edit, complete, delete task
- [ ] Set due date, priority, subject link
- [ ] Today / Upcoming task views
- [ ] Task group by subject view
- [ ] Recurring task rules
- [ ] Calendar view of tasks and due dates (week/month)
- [ ] Dashboard: upcoming tasks widget
- [ ] Notes created per week chart (Recharts)
- [ ] Study session heatmap
- [ ] Flashcard mastery per deck chart
- [ ] Task completion rate chart
- [ ] Subject coverage visualization
- [ ] Progress page (full analytics)
- [ ] Playwright: create task → set due date → complete task → verify in charts

**Exit Criteria:**  
Task CRUD and completion work. Charts render with real data. Calendar displays tasks correctly.

---

## Phase 9 — Responsive, Mobile & PWA

**Goal:** Ensure the application is genuinely usable on mobile devices and supports basic offline access.

**Deliverables:**
- [ ] Responsive audit and fixes across all pages
- [ ] Touch-optimized interactions (tap targets, swipe gestures)
- [ ] Mobile-optimized editor toolbar
- [ ] PWA manifest (name, icons, theme color)
- [ ] Service worker (Next.js + next-pwa or custom)
- [ ] Offline read access for cached notes
- [ ] Add to Home Screen prompt
- [ ] Playwright mobile viewport tests

**Exit Criteria:**  
Application is fully usable at 375px width. PWA installs on Android and iOS. Cached notes readable offline.

---

## Phase 10 — Testing, Accessibility & Performance

**Goal:** Bring the application to production quality through comprehensive testing, accessibility compliance, and performance optimization.

**Deliverables:**
- [ ] Unit test coverage ≥ 80% (Vitest)
- [ ] Full E2E coverage of all P0 and P1 critical paths (Playwright)
- [ ] WCAG 2.1 AA compliance audit (axe-core)
- [ ] Keyboard navigation audit and fixes
- [ ] Screen reader testing (NVDA + VoiceOver)
- [ ] Lighthouse CI integration
- [ ] Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Bundle size audit and optimization
- [ ] Security headers configuration
- [ ] Print stylesheet for note export
- [ ] Change password flow
- [ ] Account deletion flow
- [ ] Lighthouse score ≥ 90 on all primary pages

**Exit Criteria:**  
All tests pass. No critical or serious axe violations. Lighthouse ≥ 90. Security headers in place.

---

## Phase 11 — Final Documentation & Production Readiness

**Goal:** Prepare the application for production deployment with complete documentation and operational readiness.

**Deliverables:**
- [ ] All documentation files accurate and complete
- [ ] README.md with setup, development, and deployment instructions
- [ ] Environment configuration guide
- [ ] Supabase migration files committed (database schema as code)
- [ ] Deployment configuration (Vercel)
- [ ] Error monitoring setup (Sentry or equivalent)
- [ ] Analytics integration (privacy-respecting, e.g., Plausible)
- [ ] Rate limiting on API routes
- [ ] Final security review
- [ ] Production smoke test

**Exit Criteria:**  
Application deployed to production. All systems healthy. Documentation complete.

---

## Phase 12 — AI Integration (Deferred)

**Goal:** Layer AI capabilities onto the stable manual product without restructuring core architecture.

**Potential features (not committed):**
- AI-assisted note summarization
- AI-generated flashcard suggestions from notes
- AI quiz question generation
- AI-powered search with semantic understanding
- Writing assistance in the editor

**Prerequisites:**
- Phase 11 complete
- Core product validated by real users
- Specific AI use cases validated through user research
- AI provider selected with clear data privacy policy

**Status:** Deferred indefinitely. Will not be planned until Phase 11 exit criteria are met.

---

## Out-of-Scope Items (Post-Phase 12 or Reconsidered)

| Item | Rationale |
|---|---|
| Real-time collaboration | Significant architectural complexity, not a student-solo-use need |
| Mobile native app (iOS/Android) | PWA in Phase 9 covers mobile needs |
| LMS integration (Canvas, Moodle) | No concrete requirement |
| Note import (Notion, Markdown, OneNote) | Post-Phase 11 quality-of-life feature |
| Note export (PDF, Markdown) | Post-Phase 11 quality-of-life feature |
| Public note sharing | Not aligned with personal knowledge base philosophy |
| Third-party OAuth (Phase 1) | Deferred to post-Phase 11 |
| Custom domains | Not applicable |
| Team / group accounts | Out of scope for student-personal tool |
