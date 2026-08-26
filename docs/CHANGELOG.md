# Studora — Changelog

**Format:** Newest entries first. Each entry references the phase and date.  
Breaking changes are marked `[BREAKING]`. Design changes are marked `[DESIGN]`. Architecture changes are marked `[ARCH]`.

---

## [0.6.0] — 2026-08-23 — Phase 5: Search, Tags, Favorites & Archive
 
### Added
- **Global Search Route (`/search`)**: Real-time full-text search with query term highlighting across titles, body snippets, and tags.
- **Tags System (`TagPicker.tsx`)**: Tag creation, tag removal, and dynamic tag chip filtering inside the Notes Library (`/notes`) and Note Editor header.
- **Favorites / Starred Notes**: Quick filter tabs in Notes Library and instant star toggle on all note cards and editor headers.
- **Archive & Trash Management (`/archive`)**: Soft-deleted note management with **Restore Note**, **Permanently Delete**, and **Empty Archive** actions.
- **Navigation Enhancements**: Added Search (`/search`) and Archive (`/archive`) to Sidebar navigation and Command Palette (`⌘K`).
- **Complete Button Functionality Audit**: Verified every button, modal trigger, and link across all pages (Dashboard, Notes, Subjects, Search, Archive, Settings).
- **Vitest Test Suite (`tests/unit/search-archive-tags.test.ts`)**: Total of **29 passing unit tests** across 7 test files.

---

## [0.5.0] — 2026-08-23 — Phase 4: Subjects, Topics & Academic Organization
 
### Added
- **Academic Subjects Shelf (`/subjects`)**: Displays all academic subjects as digital notebook cards with note counts, recent notes, and create subject modal trigger.
- **Subject Detail Route (`/subjects/[subjectId]`)**: Subject overview with nested topic tree navigation, note filtering by topic, and new subject note creation.
- **Subject Creation & Edit Modal (`SubjectModal.tsx`)**: 12-color palette picker with HSL variables (`indigo`, `cobalt`, `teal`, `sage`, `amber`, `rust`, `rose`, `violet`, etc.) and description.
- **Interactive Topic Tree (`TopicTree.tsx`)**: Support for root topics and sub-topics (1 level deep) with inline creation, rename, delete, and note counts.
- **Note Assignment & Movement Dialog (`MoveNoteDialog.tsx`)**: Assign or move notes between academic subjects and topics.
- **Data Layer Extensions (`NoteRepository`)**: Full IndexedDB CRUD methods for subjects and topics (`createSubject`, `updateSubject`, `deleteSubject`, `createTopic`, `updateTopic`, `deleteTopic`, `assignNoteToSubjectAndTopic`).
- **Sidebar & Command Palette**: Direct navigation to `/subjects` and "Go to Subjects Shelf" command in `⌘K`.
- **Vitest Organization Test Suite (`tests/unit/organization.test.ts`)**: Total of **25 passing unit tests** across 6 test files.

---

## [0.4.1] — 2026-08-23 — Local Demo Auth & Professional UI/UX Redesign

### Added
- **Local Demo Authentication Architecture**: `LocalAuthRepository` and `AuthService` with seeded credentials (`demo@studora.local` / `StudoraDemo123!`), local session persistence across browser refreshes, and abstract repository pattern isolating UI from future Supabase Auth migration.
- **Protected Routing with `redirectTo` Preservation**: Client & layout route protection for `/dashboard`, `/notes`, `/settings`. Unauthenticated access redirects to `/login?redirectTo=...`. Upon successful login, users are returned to their target route (e.g. `/notes`) rather than defaulting to dashboard.
- **Redesigned Login & Signup UX**: Product-aligned warm academic login card with quick-fill demo badge, password visibility toggle (`Eye`/`EyeOff`), inline animated calm error feedback, loading spinners, and state machine transitions.
- **Motion UI Polish & Micro-interactions**: `motion` (Motion for React) integrated across `Sidebar` collapse, active route spring pill, `ThemeToggle` rotation, `CommandPalette` (`⌘K`), and `SlashMenu`.
- **Student Dashboard Redesign**: "What should I study/do next?" layout with Quick Action bar, Starred/Pinned notes, Academic Subjects recap, and Recent Notes list.
- **Populated Demo Workspace**: Rich initial academic dataset (*OSI Model*, *TCP Congestion Control*, *Paging*, *Database Normalization*) across 4 core computer science subjects with option to reset workspace.
- **Expanded Unit Test Suite**: `tests/unit/local-auth.test.ts` bringing test suite total to **22 passing tests** across 5 test files.

---

## [0.4.0] — 2026-08-23 — Phase 3: Notes & Editor (Digital Notebook & Local Persistence)

### Added
- Redesigned visual identity: **Warm Light Academic Notebook** palette (`#FAF9F5` warm paper background, `#FFFFFF` paper sheets, `#1F2421` deep charcoal ink, `#2B4C7E` deep ink blue, `#4A7C59` soft sage).
- Local-first IndexedDB database layer powered by Dexie.js (`studora_local_db`) with `notes`, `subjects`, `topics`, and `tags` tables.
- Repository abstraction (`NoteRepository`) and service layer (`NoteService`) isolating UI components from database implementations.
- Full Tiptap editor engine integration (`@tiptap/react`, `@tiptap/starter-kit`) with headings H1–H3, bold, italic, underline, highlight, lists, task lists, blockquotes, code blocks, and tables.
- Custom Student Editorial Callout Blocks extension (`StudentBlockNode` & `StudentBlockView`) with 9 academic types: `Important`, `Definition`, `Exam Point`, `Example`, `Common Mistake`, `Remember`, `Question`, `Formula`, `Summary`.
- Fast Slash Command system (`/`) for inserting formatting and student editorial callouts.
- Selection `BubbleToolbar` and minimal top `EditorToolbar`.
- Auto-save engine (1200ms debounced sync) to Dexie IndexedDB with visual `AutoSaveIndicator` status pill.
- Auto-generated `OutlinePanel` (Table of Contents) from document headings (H1–H3) with smooth click-to-jump navigation.
- Distraction-free `Focus Mode` and editorial `Reading Mode`.
- Local Notes list view (`/notes`) with live reactive Dexie search filter and sample academic seeder.
- ADR-018 (Warm Light Notebook Visual Language), ADR-019 (Local-First Dexie Persistence), ADR-020 (Tiptap Student Blocks), ADR-021 (Motion for React), and ADR-022 (Editor-First 3-Column Layout).
- Unit test suite for `NoteService` (`tests/unit/editor-services.test.ts`). Total: 19 passing unit tests across 4 test files.

---

## [0.3.0] — 2026-08-23 — Phase 2: Application Shell & Navigation

### Added
- Auth layout and pages: Login (`/login`), Registration (`/signup`), Password Reset (`/reset-password`).
- Zod form validation for all authentication forms with error feedback and loading states.
- Persistent `Sidebar` component with collapsibility (`localStorage` saved state), active route styling, and subject color badges.
- `TopBar` component with breadcrumb path calculation, ⌘K search command palette trigger, and `UserMenu`.
- `UserMenu` avatar dropdown with profile preferences, theme switcher sub-menu, and Supabase sign out integration.
- Responsive `MobileNav` drawer using Dialog primitive for mobile viewports.
- `AppShell` container managing global layout, sidebar collapse state, and command palette modal.
- `CommandPalette` component supporting global ⌘K / Ctrl+K keyboard shortcut listener and fast workspace navigation.
- Authenticated app layout (`app/(app)/layout.tsx`) fetching user session from Supabase server RSC.
- Dashboard shell page (`/dashboard`) with quick stats, recent notes list, and upcoming tasks widgets.
- Settings page (`/settings`) with profile update form, theme cards, and keyboard shortcuts table.
- Accessible custom 404 page (`app/not-found.tsx`).
- Vitest unit tests for auth schemas (`tests/unit/auth-validations.test.ts`).

---

## [0.2.0] — 2026-08-23 — Phase 1: Project Foundation & Design System

### Added
- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 foundation scaffolded
- Complete HSL design token system in `app/globals.css` (Light + Dark mode)
- `next/font` integration for Inter (sans), Lora (serif), JetBrains Mono (mono)
- `ThemeProvider` and `ThemeToggle` component with system/light/dark mode support & localStorage persistence
- Core shadcn/ui component suite owned in `components/ui/` (Button, Input, Textarea, Label, Card, Badge, Skeleton, Separator, Tooltip, Dialog, DropdownMenu, Avatar)
- Supabase SSR integration (`@supabase/ssr`) with browser, server, and middleware session handlers
- Comprehensive TypeScript type definitions for all 13 database entities in `types/database.ts`
- Zod validation schemas for auth, subject, and note operations in `lib/validations/`
- Design system verification showcase route at `/design-system`
- Vitest unit testing setup with `jsdom` + `@testing-library/jest-dom` (11 unit tests passing)
- Playwright E2E configuration for Desktop Chrome and Mobile viewports
- Environment variables template (`.env.example`) and local placeholder (`.env.local`)
- ADR-016 (npm package manager choice) and ADR-017 (@supabase/ssr pattern)

---

## [0.1.0] — 2026-08-23 — Phase 0: Documentation & Architecture

### Added
- PROJECT.md — Project identity and orientation document
- PRODUCT-SPEC.md — Complete product specification including MVP definition, full product vision, information architecture, and core user journeys
- DESIGN-SYSTEM.md — Design system specification covering color tokens, typography, spacing, components, and accessibility standards
- ARCHITECTURE.md — Technical architecture covering stack, project structure, auth flow, data flow, editor architecture, and security
- DATA-MODEL.md — Complete PostgreSQL schema with RLS policies, indexes, triggers, and storage structure
- FEATURES.md — Full feature inventory with phase assignments and status
- DECISIONS.md — Initial 15 architectural decision records (ADR-001 through ADR-015)
- CHANGELOG.md — This file
- IMPLEMENTATION-LOG.md — Implementation work record (initialized)
- TESTING.md — Testing strategy document
- BUGS.md — Bug registry (initialized)
- ROADMAP.md — Phase-by-phase development roadmap

### Architecture Decisions Recorded
- ADR-001: Next.js App Router
- ADR-002: Supabase backend
- ADR-003: Tailwind CSS
- ADR-004: shadcn/ui components
- ADR-005: Tiptap editor
- ADR-006: Tiptap JSON content storage
- ADR-007: No global client-side state store (Phase 1–6)
- ADR-008: Soft delete for user content
- ADR-009: dnd-kit for drag and drop
- ADR-010: PostgreSQL full-text search
- ADR-011: Email/password auth only (Phase 1)
- ADR-012: Maximum 2 levels of topic nesting
- ADR-013: No AI features in Phase 0–11
- ADR-014: Single Next.js monolith
- ADR-015: Academic calm design language

---

_Future entries will be added here as work progresses through phases._
