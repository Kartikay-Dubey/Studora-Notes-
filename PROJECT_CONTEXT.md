# STUDORA — MASTER PROJECT CONTEXT & STATE SUMMARY

> **Single Source of Truth Context Document**  
> *Designed for LLMs (ChatGPT, Claude, Antigravity) and developers to instantly understand the complete state, architecture, progress, conventions, and next steps for Studora.*

---

## 1. Executive Summary & Product Vision

- **Product Name**: **Studora**
- **Tagline**: *Your Study Workspace*
- **Mission**: A calm, distraction-free, light-first academic study workspace that helps students capture notes, organize by subject, master topics with study tools, and retain knowledge offline and online.
- **Positioning**: The sweet spot between **Notion** (structured blocks), **OneNote** (academic multi-subject hierarchy), and **academic notebooks** (ruled/grid paper aesthetic, LaTeX math formulas, student callouts, exam points).
- **Core Philosophy**: Light-First, calm editorial design (warm off-white backgrounds, deep ink text, refined cobalt/indigo/amber accents). No generic dark SaaS templates, no neon AI gimmicks, no distracting clutter.

---

## 2. Technical Stack & Key Architecture

| Layer | Technologies | Notes & Decisions |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** + **React 19** + **TypeScript 5** | Server & Client Components, Turbopack, Fast Refresh |
| **Styling** | **Tailwind CSS v4** + **PostCSS** + **CSS Variables** | HSL design tokens, light/dark mode support via `next-themes` |
| **Editor Engine** | **Tiptap 2 (ProseMirror)** | StarterKit, Highlight, TextStyle, Color, Table, CharacterCount, KaTeX Math |
| **Custom Nodes** | Custom `StudentBlock` extension | 5 callout types: *Key Formula*, *Exam Point*, *Definition*, *Important Concept*, *Common Mistake* |
| **Animation** | **GSAP 3.15 + ScrollTrigger** (Landing) / **Motion (Framer Motion 12)** (App UI) | Scroll-driven storytelling on landing page; spring transitions in app shell |
| **Local / Offline DB** | **Dexie.js 4 (IndexedDB)** + `dexie-react-hooks` | Offline-first reactive state (`studora_local_db`), zero-lag local editing |
| **Remote DB & Auth** | **Supabase (PostgreSQL + Auth)** + `@supabase/ssr` | Optional sync / multi-device backup, local demo auth fallback |
| **Auth Modes** | **Hybrid**: Local Demo Auth (`LocalAuthRepository`) + Supabase Auth | Demo account: `demo@studora.local` / `StudoraDemo123!` |
| **Validation** | **Zod 3** | Form and domain data validation schemas |
| **Testing** | **Vitest 4** (Unit & Integration) + **Playwright** (E2E) | 29 passing unit tests across 7 test suites |
| **PDF Export** | **jsPDF 4** + **html2canvas** | High-fidelity student study note PDF export |

---

## 3. Directory & Codebase Structure

```
Studora/
├── app/
│   ├── (app)/                    # Authenticated workspace application routes
│   │   ├── dashboard/page.tsx    # "What to study next" student dashboard
│   │   ├── notes/                # All Notes library (filter by tab, tag, subject)
│   │   │   └── [noteId]/page.tsx # Full TipTap note editor workspace
│   │   ├── subjects/             # Subject shelf & [subjectId] detail topic tree
│   │   ├── search/page.tsx       # Dedicated full-text & tag search page
│   │   ├── archive/page.tsx      # Trash & note restoration center
│   │   ├── settings/page.tsx     # Student preferences & shortcuts
│   │   └── layout.tsx            # Protected app shell wrapper
│   ├── (auth)/                   # Login, signup, reset password
│   ├── design-system/page.tsx    # Living design tokens & UI library showcase
│   ├── globals.css               # Design system tokens, paper styles, tip-tap styles
│   ├── layout.tsx                # Root layout with fonts, metadata & ThemeProvider
│   └── page.tsx                  # High-conversion editorial landing page (GSAP)
├── components/
│   ├── branding/
│   │   └── StudoraLogo.tsx       # Pure SVG brand mark & full lockup component
│   ├── editor/
│   │   ├── NoteEditor.tsx        # Master note editor with auto-save & paper modes
│   │   ├── EditorToolbar.tsx     # Sticky formatting bar (headings, lists, blocks)
│   │   ├── BubbleToolbar.tsx     # Contextual floating selection toolbar
│   │   ├── StudentBlockView.tsx  # Interactive rendered custom student callouts
│   │   ├── MathDialog.tsx        # Live KaTeX equation inserter
│   │   └── TagPicker.tsx         # Note tag assignment popover
│   ├── landing/                  # GSAP-powered landing page story sections
│   │   ├── LandingNav.tsx        # Sticky blur navigation
│   │   ├── InteractiveNotePreview.tsx # Live simulated interactive note
│   │   ├── ProblemScatteredSection.tsx# Storytelling: fragmented student notes
│   │   ├── CalloutsShowcaseSection.tsx# Highlighting formulas, exam points
│   │   ├── OrganizationSearchSection.tsx # Subject nesting & search demo
│   │   ├── StudyFlowPhilosophySection.tsx# The capture -> organize -> master flow
│   │   ├── TemplatesSection.tsx  # Academic templates carousel
│   │   └── LandingFooter.tsx     # Final CTA and footer navigation
│   ├── layout/
│   │   ├── Sidebar.tsx           # Collapsible workspace navigation
│   │   ├── TopBar.tsx            # Breadcrumbs, quick search, user avatar
│   │   ├── AppShell.tsx          # Layout orchestration
│   │   └── CommandPalette.tsx    # ⌘K / Ctrl+K instant navigator
│   ├── organization/
│   │   ├── SubjectModal.tsx      # Subject creator with 12-color palette
│   │   ├── TopicTree.tsx         # Hierarchical topic tree with inline rename
│   │   └── MoveNoteDialog.tsx    # Note subject/topic reassignment
│   ├── shared/
│   │   ├── ThemeToggle.tsx       # Light/dark mode toggle
│   │   └── StudoraLogo.tsx       # Scalable SVG logo
│   └── ui/                       # Accessible owned UI components (Radix primitives)
├── docs/                         # Comprehensive project documentation (12 files)
│   ├── ARCHITECTURE.md, BUGS.md, CHANGELOG.md, DATA-MODEL.md, DECISIONS.md
│   ├── DESIGN-SYSTEM.md, FEATURES.md, IMPLEMENTATION-LOG.md, PRODUCT-SPEC.md
│   └── PROJECT.md, ROADMAP.md, TESTING.md
├── lib/
│   ├── animations/               # GSAP initialization & ScrollTrigger context
│   ├── db/
│   │   └── studora-db.ts         # Dexie local IndexedDB schemas & sample seeder
│   ├── hooks/                    # useAuth, useTheme, etc.
│   ├── repositories/             # NoteRepository, LocalAuthRepository
│   ├── services/                 # NoteService, ExportService, AuthService
│   └── validations/              # Zod validation schemas
├── public/
│   └── brand/                    # SVG brand marks and favicon
└── tests/
    └── unit/                     # 7 Vitest test suites (29 passing tests)
```

---

## 4. Progress Completed So Far (Phase by Phase)

### ✅ Phase 0 — Documentation & Architecture
- Authored 12 exhaustive specifications covering product vision, information architecture, 13-table database schema with RLS, design tokens, testing strategy, and roadmap.

### ✅ Phase 1 — Project Scaffolding & Design System
- Built Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 foundation.
- Configured HSL color tokens (`bg-surface`, `bg-canvas`, `text-primary`, `accent`, `tertiary-amber`).
- Implemented 12 accessible Radix-based UI components in `components/ui/`.
- Set up unit testing with Vitest and E2E harness with Playwright.

### ✅ Phase 2 — App Shell, Navigation & Local Demo Auth
- Persistent collapsible `Sidebar.tsx`, dynamic `TopBar.tsx`, responsive `MobileNav.tsx`, and `CommandPalette.tsx` (`Ctrl+K`).
- Local demo auth engine (`demo@studora.local`) with session persistence in `localStorage`.
- Protected routes with redirection guards.

### ✅ Phase 3 — Notes Editor Engine (Tiptap + Student Academic Features)
- Rich text formatting (H1-H3, bold, italic, underline, highlight, strikethrough, lists, task lists, code blocks, tables).
- **5 Custom Student Callout Blocks**: *Key Formula*, *Exam Point*, *Definition*, *Important Concept*, *Common Mistake*.
- **KaTeX Math Formula Editor**: Inline and block equation rendering with live preview.
- **Paper Background Styles**: Blank, Ruled, Grid, and Dotted backgrounds with toggleable margin guides (red vertical line removed as requested).
- **Auto-Save**: Debounced auto-save to IndexedDB with visual saving/saved status indicators.
- **Export System**: Export to PDF (custom student notebook layout), Markdown (`.md`), HTML, and Plain Text (`.txt`).
- **Word & Character Counter** with estimated reading time.

### ✅ Phase 4 — Subjects, Topics & Academic Organization
- Subject Shelf (`/subjects`) and Subject Detail (`/subjects/[subjectId]`).
- 12-color HSL palette picker for subjects.
- Hierarchical topic tree (`TopicTree.tsx`) with parent-child nesting, inline renaming, and drag/movement.
- `MoveNoteDialog.tsx` for moving notes across subjects and topics.

### ✅ Phase 5 — Search, Tags, Starred Favorites & Trash
- Dedicated full-text search page (`/search`) highlighting query matches.
- Tagging system (`TagPicker.tsx`) with filtering chips across library.
- Starred favorites toggle across editor header, note cards, and dashboard.
- Soft-delete trash archive (`/archive`) with restore and permanent delete actions.
- Audit of all buttons and interactions across every route.

### ✅ Brand Identity & Landing Page Redesign
- Custom vector SVG brand mark (`StudoraMark` & `StudoraLogo`) featuring an open book + S letterform + pencil + academic sparkle.
- Complete editorial GSAP + ScrollTrigger storytelling landing page (`app/page.tsx`).
- Integrated brand mark into Navbar, Sidebar, Footer, and browser Favicon.
- Cleaned sidebar navigation: removed redundant *Recent*, *Templates*, and *Tools* placeholders; fixed double plus on *New Note* and *New Subject* buttons.

---

## 5. Current System State & Health

- **TypeScript Compilation**: `npm run type-check` ➜ **0 errors**
- **Unit Tests**: `npm run test:unit` ➜ **29 / 29 passed across 7 test files**
- **Production Build**: `npm run build` ➜ **Compiles all 15 routes cleanly**
- **Offline Reliability**: 100% functional locally via Dexie IndexedDB with zero cloud dependencies required for development/demo.

---

## 6. What Remains on the Roadmap (Next Phases)

| Phase | Feature Focus | Status |
|---|---|---|
| **Phase 6** | **Flashcards & Spaced Repetition (SM-2)**: Convert notes/callouts into flashcards; Leitner/SM-2 review session interface. | *Next Priority* |
| **Phase 7** | **Study Tasks & Deadlines**: Homework/exam checklist linked to subjects and notes. | *Planned* |
| **Phase 8** | **Study Analytics & Heatmaps**: Daily study streak, revision schedules, topic mastery charts. | *Planned* |
| **Phase 9** | **PWA Offline Mastery & Mobile Polish**: Service worker caching, installable web app manifest. | *Planned* |
| **Phase 10** | **Supabase Remote Sync**: Bi-directional sync between local Dexie and remote PostgreSQL. | *Planned* |

---

## 7. Instructions for AI Assistants (ChatGPT / Claude)

When working on this repository:
1. **Light-First Aesthetics**: Maintain the warm, clean academic aesthetic. Never apply dark, neon, or generic SaaS gradients.
2. **Offline-First Data Flow**: Operations should first write to Dexie IndexedDB (`lib/db/studora-db.ts` or `lib/repositories/note.repository.ts`).
3. **No Placeholders**: Never leave broken buttons, `onClick={() => {}}`, or `#` anchor links. Every UI control must be connected to real state or handlers.
4. **Preserve Code Quality**: Always run `npm run type-check` and `npm run test:unit` to ensure zero regressions.
