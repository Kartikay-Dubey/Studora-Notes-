# Studora — Decision Log

**Format:** Each decision has a unique ID, date, status, context, the decision made, and its rationale. Superseded decisions are marked but never deleted.

Status: `active` | `superseded` | `reconsidered`

---

## ADR-001 — Framework: Next.js App Router

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture

**Context:**  
We need a React framework that supports SSR, file-based routing, and efficient data fetching patterns for an authenticated multi-page application.

**Decision:**  
Use Next.js 14 with the App Router (not the Pages Router).

**Rationale:**  
- App Router enables React Server Components, reducing client-side JavaScript for data-heavy pages
- Nested layouts match Studora's shell architecture (persistent sidebar, top bar)
- First-class TypeScript support
- Route groups allow clean separation of auth routes vs. app routes without URL path impact
- Industry standard with strong ecosystem and long-term support

**Consequences:**  
- Must distinguish clearly between Server and Client Components — requires discipline
- Some shadcn/ui patterns require `"use client"` directives — acceptable overhead

---

## ADR-002 — Backend: Supabase (not custom API)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture

**Context:**  
We need authentication, a relational database, file storage, and potentially real-time sync. We are a small team building a student product, not an enterprise SaaS.

**Decision:**  
Use Supabase as the backend platform (Auth + PostgreSQL + Storage).

**Rationale:**  
- Auth, database, storage, and real-time in one service eliminates operational complexity
- PostgreSQL gives us full relational power (joins, full-text search, RLS, triggers)
- Row Level Security enforces data isolation at the database level — not just in application code
- Supabase JS client is typed and ergonomic
- No need to maintain a custom API server for Phase 0–11 scope

**Consequences:**  
- Vendor dependency on Supabase — acceptable given open-source nature (self-hostable if needed)
- Real-time features available without additional services
- Service role key must never be exposed client-side

---

## ADR-003 — Styling: Tailwind CSS (not CSS Modules, not Styled Components)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture / Design System

**Context:**  
We need a styling approach that enforces consistency, works well with shadcn/ui, and supports theming via CSS custom properties.

**Decision:**  
Use Tailwind CSS with CSS custom properties for design tokens.

**Rationale:**  
- Tailwind CSS classes enforce the design system through constrained utility classes
- shadcn/ui is built on Tailwind — using both eliminates friction
- CSS custom properties (HSL tokens) support light/dark theming with a single class toggle
- No runtime style computation (unlike CSS-in-JS)
- Co-located styles improve DX without creating large CSS files

**Consequences:**  
- All design token overrides must go through `tailwind.config.ts` — not inline or ad-hoc
- Developers must not use arbitrary Tailwind values (e.g., `text-[17px]`) without documenting in DESIGN-SYSTEM.md

---

## ADR-004 — Component Library: shadcn/ui (not Radix UI directly, not MUI, not Chakra)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture / Design System

**Context:**  
We need accessible, composable UI components that we can own and style without fighting a component library's opinions.

**Decision:**  
Use shadcn/ui as the component foundation.

**Rationale:**  
- shadcn/ui components are copied into the codebase — full ownership, no version lock
- Built on Radix UI primitives — accessibility behaviors correct by default
- Designed for Tailwind CSS — natural fit with ADR-003
- We can modify any component without forking a library
- No additional CSS framework or design system fights

**Consequences:**  
- Components live in `components/ui/` and are maintained as first-party code
- Updates to shadcn/ui are pulled manually by choice, not automatically via npm
- Any modification to a shadcn/ui component must be documented in the component file header

---

## ADR-005 — Editor: Tiptap (not Slate, not Quill, not ProseMirror directly)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Feature / Architecture

**Context:**  
We need a rich-text editor with React bindings that supports academic note-taking features: headings, lists, tables, code blocks, math, and task lists.

**Decision:**  
Use Tiptap as the rich-text editor.

**Rationale:**  
- Tiptap is ProseMirror-based (battle-tested document model)
- First-class React integration
- Extension model enables adding math (KaTeX), syntax highlighting, custom nodes without rewriting core
- JSON document format suitable for storage in PostgreSQL JSONB
- Well-maintained with active community
- Supports collaborative editing in future if needed (Tiptap Collab / Y.js)

**Consequences:**  
- Tiptap is a non-trivial bundle size — must be lazy-loaded
- Editor content stored as Tiptap JSON (not raw HTML, not Markdown)
- Content migration between editor versions requires a migration strategy

---

## ADR-006 — Content Storage Format: Tiptap JSON (not Markdown, not HTML)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Data Model

**Context:**  
Notes created in the Tiptap editor can be stored as HTML, Markdown, or Tiptap's native ProseMirror JSON.

**Decision:**  
Store note content as Tiptap ProseMirror JSON in a PostgreSQL JSONB column.

**Rationale:**  
- JSON is structured and queryable — supports future node-level operations
- HTML storage requires sanitization before every render (XSS risk)
- Markdown storage loses Tiptap-specific node metadata (custom attributes, embedded blocks)
- JSONB supports GIN indexes for future node-type queries
- A separate `content_text` column (plain text) is maintained for full-text search

**Consequences:**  
- Content is only renderable by Tiptap (or compatible ProseMirror renderers) — not human-readable in DB
- Export features (PDF, Markdown) require a conversion step
- Content migration required if Tiptap schema changes

---

## ADR-007 — No Global Client-Side State Store (Phase 1–6)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture

**Context:**  
Applications often introduce Redux or Zustand early, even when not needed, adding complexity.

**Decision:**  
Do not introduce Zustand, Redux, or any global state store in Phase 1. Use React Server Components, URL state, and local `useState`/`useReducer`.

**Rationale:**  
- Next.js App Router Server Components cover most data fetching without client state
- URL params cover navigation state (active subject, active note)
- Local state covers UI state (modal open, form values)
- Introducing a store prematurely creates abstraction without solving a real problem

**Consequences:**  
- If genuine cross-component state sharing (beyond URL) becomes needed (e.g., command palette), introduce Zustand in a targeted, bounded way at that time — document in DECISIONS.md

---

## ADR-008 — Soft Delete (not hard delete) for User Content

**Date:** 2026-08-23  
**Status:** active  
**Category:** Data Model

**Context:**  
Deleting notes, subjects, and topics accidentally is a common, high-regret action for students. Hard deletes are permanent.

**Decision:**  
All user-created content (notes, subjects, topics, tasks, decks) uses soft delete via `archived_at TIMESTAMPTZ NULL`. Hard delete only available from the Archive view after explicit confirmation.

**Rationale:**  
- Prevents irreversible data loss
- Enables Undo / Restore workflow
- Archive state gives users a safety net
- Aligns with student product principle: trust and safety

**Consequences:**  
- All list queries must filter `WHERE archived_at IS NULL`
- Index on `archived_at` per user for performance
- Archive view required in Phase 5

---

## ADR-009 — Drag and Drop: dnd-kit (not react-beautiful-dnd)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Libraries

**Context:**  
Sorting notes, topics, and subjects requires accessible drag-and-drop.

**Decision:**  
Use dnd-kit.

**Rationale:**  
- react-beautiful-dnd is unmaintained (last release 2022, open issues unresolved)
- dnd-kit is actively maintained, modular, and keyboard-accessible
- Significantly smaller bundle
- Supports complex scenarios (multi-container, virtualized lists) if needed

**Consequences:**  
- dnd-kit requires more boilerplate than react-beautiful-dnd but is more flexible

---

## ADR-010 — Full-Text Search: PostgreSQL tsvector (not Algolia, not ElasticSearch)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture / Features

**Context:**  
Notes need to be searchable by content. Options include a dedicated search service or using PostgreSQL's built-in FTS.

**Decision:**  
Use PostgreSQL full-text search via `tsvector` generated columns and GIN indexes.

**Rationale:**  
- No additional service or cost
- Sufficient for single-user search on personal note volume (thousands, not millions of documents)
- `tsvector` with GIN index is fast for this scale
- Supabase exposes this natively via the JS client

**Consequences:**  
- Search quality: good (stemming, ranking) but not as advanced as dedicated search engines
- If note volume or search quality requirements grow significantly, Algolia/Typesense can be added without schema changes (just index notes externally)

---

## ADR-011 — Authentication: Email/Password Only (Phase 1)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Features

**Context:**  
Supabase supports email/password, magic link, and OAuth (Google, GitHub, etc.).

**Decision:**  
Implement email/password only in Phase 1. Defer social login.

**Rationale:**  
- Simplest to implement correctly
- No dependency on third-party OAuth app registration
- Sufficient for an early-stage student product
- Social login can be added without schema changes (Supabase handles identity linking)

**Consequences:**  
- Users must remember a password — password reset flow is required
- Social login deferred to post-Phase 11

---

## ADR-012 — Topic Nesting: Maximum 2 Levels Deep

**Date:** 2026-08-23  
**Status:** active  
**Category:** Product / Data Model

**Context:**  
Unlimited nesting creates UX complexity and cognitive overhead for students. Academic organization typically maps well to: Subject → Chapter/Unit → Notes.

**Decision:**  
Allow a maximum of 2 levels of topic nesting (a topic can have sub-topics, but sub-topics cannot have their own sub-topics).

**Rationale:**  
- Academic hierarchy maps to: Subject → Topic → Sub-topic → Notes
- Deeper nesting creates navigation complexity disproportionate to benefit
- Enforced at application layer with clear UI indication

**Consequences:**  
- DB schema supports `parent_id` on topics (self-referential FK)
- Application must validate and prevent nesting beyond depth 2

---

## ADR-013 — No AI Features in Phase 0–11

**Date:** 2026-08-23  
**Status:** active  
**Category:** Product Strategy

**Context:**  
Many study tools are rushing to add AI features. There's pressure to include AI early.

**Decision:**  
No AI features will be implemented in Phases 0–11. AI integration is reserved for Phase 12+.

**Rationale:**  
- The core value proposition must stand on its own as a manual tool
- AI should enhance an already excellent product, not paper over a weak one
- Avoids external API dependency, cost, and complexity during foundation building
- Gives us time to deeply understand user workflows before deciding where AI genuinely helps

**Consequences:**  
- Architecture must not be designed around AI (no "AI-ready" data shapes)
- AI can be layered on without restructuring the core product when the time comes

---

## ADR-014 — Monorepo: Single Package (not Turborepo, not Nx)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Architecture

**Context:**  
We need a code organization strategy. Some teams split into monorepos (frontend, backend packages).

**Decision:**  
Single Next.js project with modular directory structure. No monorepo tooling.

**Rationale:**  
- One application, one team, one deployment target
- Monorepo tooling adds complexity not justified at this scale
- Supabase is external — no shared package needed
- Modular directory structure (`components/`, `lib/`, `hooks/`, `types/`) achieves logical separation without physical package boundaries

**Consequences:**  
- If a separate package genuinely emerges (e.g., a shared types package for a future mobile app), introduce Turborepo at that time and document the decision

---

## ADR-015 — Design Language: Academic Calm (not Vibrant / Gradient-Heavy)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Design

**Context:**  
Many modern productivity tools use vibrant gradients, glassmorphism, and animation-heavy UI to signal modernity.

**Decision:**  
Studora's design language is academic, calm, and typographically focused. No generic AI gradients, no excessive glassmorphism, no decorative animation.

**Rationale:**  
- Students use this tool for extended focused work sessions — the UI must not compete for attention
- Academic-feeling environments (think: a clean library desk) improve study focus
- Trust is built through consistency, not visual novelty
- Typography and whitespace signal quality more durably than decoration

**Consequences:**  
- Every visual decision must justify itself in terms of usability, not aesthetics
- Animation requires a functional reason (state change, guidance, loading) to be included

---

## ADR-016 — Package Manager: npm (not pnpm)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Tooling

**Context:**  
`pnpm` was initially considered, but `pnpm` is not globally installed on the developer's execution environment. `npm` is natively available with Node 22.

**Decision:**  
Use `npm` as the package manager for Studora.

**Rationale:**  
- Ensures reproducible builds without requiring global pnpm binary installation on host environment
- Node.js 22 + npm 10 provides fast package resolution and lockfile stability (`package-lock.json`)

**Consequences:**  
- Dependency installation commands use `npm install` and `npm run <script>`
- `package-lock.json` is committed to version control

---

## ADR-017 — Supabase Auth & SSR Architecture (@supabase/ssr)

**Date:** 2026-08-23  
**Status:** active  
**Category:** Backend / Auth Architecture

**Context:**  
Next.js App Router handles cookies differently across Server Components, Route Handlers, and Client Components. `@supabase/auth-helpers-nextjs` is deprecated in favor of `@supabase/ssr`.

**Decision:**  
Use `@supabase/ssr` with separate helper instantiations:
- `lib/supabase/client.ts` for Client Components
- `lib/supabase/server.ts` for Server Components & Route Handlers
- `lib/supabase/middleware.ts` for session refresh in root middleware

**Rationale:**  
- `@supabase/ssr` is the official modern library for Next.js App Router auth
- Handles cookie reads/writes safely across RSC and Server Actions
- Prevents session stale issues via middleware refresh

**Consequences:**  
- Server components use `await createClient()` to read session
- Middleware handles route protection and cookie synchronization

---

## ADR-018 — Visual Direction: Light-First Warm Academic Notebook (Supersedes ADR-015 Visual Language)

**Date:** 2026-08-23  
**Status:** active (Supersedes ADR-015)  
**Category:** Product Design / Visual Identity

**Context:**  
The initial Phase 1 dark navy/blue SaaS theme felt like a generic developer tool or AI SaaS dashboard. The core product principle requires Studora to feel like a **warm, calm, focused digital student notebook**.

**Decision:**  
Adopt a warm, light-first palette based on off-white paper tones (`#FAF9F5`), crisp white note sheets (`#FFFFFF`), deep charcoal ink typography (`#1F2421`), and muted ink-blue/sage accents (`#2B4C7E`, `#4A7C59`).

**Rationale:**  
- Warm neutral tones reduce eye strain during multi-hour study sessions.
- Notebook-like page surfaces create a physical, tactile mental model for students.
- Typography and paper whitespace establish hierarchy without relying on bright card backgrounds or SaaS gradients.

**Consequences:**  
- Default theme is Light Mode. Dark Mode is retained as an opt-in night-study secondary mode.
- All SaaS cards, floating borders, and generic dark blue panels are removed in favor of page surfaces and paper rules.

---

## ADR-019 — Local-First Persistence via Dexie.js (IndexedDB) & Repository Pattern

**Date:** 2026-08-23  
**Status:** active  
**Category:** Data Layer / Local Storage

**Context:**  
Phase 3 prioritizes building the best manual note-taking experience first. The app must work flawlessly offline and save instantaneously without waiting for cloud backend latency or auth sessions.

**Decision:**  
Use **Dexie.js** (IndexedDB wrapper) with a strict Repository pattern (`NoteRepository` / `NoteService`).

**Rationale:**  
- IndexedDB handles large document JSON payloads, attachments, and fast full-text search queries far better than 5MB localStorage.
- Dexie provides TypeScript safety, reactive hooks (`useLiveQuery`), and transaction support.
- Abstracting storage behind `NoteRepository` ensures the editor UI is completely decoupled from storage implementation — allowing cloud sync with Supabase to be added later without touching editor components.

**Consequences:**  
- All note CRUD, auto-save, search, and subject hierarchy operate against IndexedDB locally.
- Cloud sync hooks can wrap `NoteRepository` in post-MVP phases seamlessly.

---

## ADR-020 — Tiptap Modular Extension Architecture & Custom Student Editorial Blocks

**Date:** 2026-08-23  
**Status:** active  
**Category:** Editor Architecture

**Context:**  
Students need more than standard headings and bullet lists — they need academic callouts (Important concepts, Definitions, Exam Points, Worked Examples, Common Mistakes, Formulas, Summaries).

**Decision:**  
Use Tiptap with custom ProseMirror extension nodes for student editorial callouts.

**Rationale:**  
- Custom nodes ensure student callouts are preserved in the ProseMirror document JSON structure rather than unstructured HTML.
- Editorial styling (thin left accent rule, badge label, low-saturation tint) keeps callouts readable and professional.

**Consequences:**  
- Student blocks can be inserted via Slash Command (`/important`, `/definition`, `/exampoint`, etc.) or toolbar controls.

---

## ADR-021 — Animation Strategy: Motion for React for Purposeful UI Transitions

**Date:** 2026-08-23  
**Status:** active  
**Category:** UI / Motion Architecture

**Context:**  
We need smooth transitions for sidebar expand/collapse, slash command menus, bubble toolbars, and Focus Mode without introduce heavy or distracting physics animations.

**Decision:**  
Use `motion` (Motion for React, formerly `framer-motion`) for structural UI transitions, paired with CSS transitions for micro-interactions (hover, active states).

**Rationale:**  
- Motion provides declarative layout animations (`AnimatePresence`, `motion.div`) with minimal bundle overhead.
- Strictly enforced timing: micro (100–160ms), UI (160–240ms), focus transitions (250–300ms).
- Native support for `prefers-reduced-motion`.

**Consequences:**  
- Animations serve state changes and guidance only — no continuous background effects.

---

## ADR-022 — Layout Architecture: Editor-First 3-Column Notebook Workspace

**Date:** 2026-08-23  
**Status:** active  
**Category:** Information Architecture / UX

**Context:**  
The standard SaaS dashboard layout (grid of small cards) compresses the editor and competes for the student's attention.

**Decision:**  
Adopt an **Editor-First 3-Column Layout**:
- Left: Compact Library Sidebar (Subjects, Topics, Notes)
- Center: Centered Note Document Surface (Hero workspace)
- Right: Collapsible Table of Contents / Outline Panel

**Rationale:**  
- Puts 80% of visual focus on the note document sheet.
- Outline panel enables rapid jumping through long 5,000+ word notes.
- Focus Mode fades the left and right panels seamlessly into a centered reading/writing canvas.

---

## ADR-023 — Local Demo Authentication Layer & Repository Pattern

**Date:** 2026-08-23  
**Status:** active (Supersedes ADR-017 for Phase 3 manual study product priority)  
**Category:** Auth / Local Architecture

**Context:**  
The immediate priority is building an exceptional manual note-taking and study product without forcing users to register against a remote backend or cloud Supabase instance during early product iterations.

**Decision:**  
Implement a **Local Demo Authentication Architecture**:
- `LocalAuthRepository` managing seeded user credentials (`demo@studora.local` / `StudoraDemo123!`) and session tokens in IndexedDB / localStorage.
- `AuthService` abstraction wrapping login, logout, session restoration, and user state.
- Client & Middleware route protection for `/dashboard`, `/notes`, `/settings` with `redirectTo` return path preservation.

**Rationale:**  
- Allows Studora to run 100% offline as a standalone digital notebook.
- Decouples login UI components from auth provider — `AuthService` interface can be swapped to `SupabaseAuthRepository` in production cloud phases without touching React forms.

---

## ADR-024 — Semantic Design Tokens & Motion Architecture

**Date:** 2026-08-23  
**Status:** active  
**Category:** UI / Design System

**Context:**  
The interface previously felt static and lacked feedback on interaction states.

**Decision:**  
- Implement full CSS semantic tokens (`--background`, `--surface`, `--surface-subtle`, `--muted`, `--border`, `--primary`, `--secondary`, `--accent`, `--success`, `--warning`, `--destructive`).
- Use `motion` (Motion for React) for structural transitions (sidebar collapse, command palette, slash menu, active route tab pill) and CSS transitions for micro-interactions.
- Respect `prefers-reduced-motion`.



