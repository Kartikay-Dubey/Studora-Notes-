# Studora — Technical Architecture

**Version:** 0.1.0 (Phase 0)  
**Last Updated:** 2026-08-23  
**Status:** Draft — Awaiting Phase 1 Approval

---

## 1. Architecture Philosophy

**Simple modular monolith.**

- One Next.js application
- One Supabase project (PostgreSQL + Auth + Storage)
- No microservices unless a concrete, unavoidable requirement appears
- Complexity is introduced only when a problem demands it
- Every dependency must justify its inclusion

---

## 2. Technology Stack

### 2.1 Core

| Layer | Technology | Justification |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, file-based routing, server components, industry standard |
| Language | TypeScript | Type safety, refactoring confidence, self-documenting code |
| Styling | Tailwind CSS | Utility-first, consistent design tokens, Purge for production |
| UI Components | shadcn/ui | Accessible, unstyled-base, composable, full source ownership |
| Icons | Lucide React | Consistent, MIT, well-maintained, React-native |

### 2.2 Editor

| Layer | Technology | Justification |
|---|---|---|
| Rich Text | Tiptap | ProseMirror-based, extensible, maintained, React bindings |
| Math | KaTeX + Tiptap extension | Industry standard for academic math rendering |
| Syntax highlighting | lowlight (via Tiptap) | No build-time dependency, runtime highlighting |

### 2.3 Local-First & Data Layer

| Layer | Technology | Justification |
|---|---|---|
| Local Database | Dexie.js (IndexedDB) | Fast, offline-first client database for note JSON, tags, and subjects |
| Reactive Hooks | `dexie-react-hooks` | Live reactive UI updates on local note mutations |
| Repository Abstraction | `NoteRepository` | Decouples editor UI from IndexedDB storage for seamless future Supabase cloud sync |
| Backend / Cloud | Supabase (@supabase/ssr) | Auth + Remote Sync PostgreSQL + Storage (connected in later cloud phases) |
| Validation | Zod | Schema-first validation for auth and note data models |

### 2.4 Features

| Layer | Technology | Justification |
|---|---|---|
| Drag and drop | dnd-kit | Lightweight, accessible, modular (unlike react-beautiful-dnd) |
| Charts | Recharts | React-native, declarative, sufficient for study analytics |

### 2.5 Testing

| Layer | Technology | Justification |
|---|---|---|
| Unit / Integration | Vitest | Fast, ESM-native, Vite-compatible |
| E2E | Playwright | Cross-browser, reliable, excellent for Next.js |

---

## 3. Project Structure

```
studora/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (app)/                    # Authenticated app route group
│   │   ├── layout.tsx            # App shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx
│   │   ├── subjects/
│   │   │   ├── page.tsx          # All subjects
│   │   │   └── [subjectId]/
│   │   │       ├── page.tsx      # Subject detail
│   │   │       └── [topicId]/
│   │   │           └── page.tsx  # Topic detail
│   │   ├── notes/
│   │   │   ├── page.tsx          # All notes
│   │   │   └── [noteId]/page.tsx # Note editor
│   │   ├── study/
│   │   │   ├── page.tsx          # Study tools hub
│   │   │   └── decks/
│   │   │       ├── page.tsx
│   │   │       └── [deckId]/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── progress/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                      # Next.js API routes (thin, Supabase delegates)
│   │   └── ...
│   ├── globals.css               # Global styles + design tokens
│   ├── layout.tsx                # Root layout (font loading, providers)
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # shadcn/ui components (owned source)
│   ├── layout/                   # App shell components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── AppShell.tsx
│   ├── editor/                   # Tiptap editor components
│   │   ├── NoteEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   └── extensions/
│   ├── notes/                    # Note-specific components
│   ├── subjects/                 # Subject-specific components
│   ├── tasks/                    # Task components
│   ├── study/                    # Flashcard and quiz components
│   ├── progress/                 # Chart components
│   └── shared/                   # Truly shared across features
│       ├── EmptyState.tsx
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       ├── ConfirmDialog.tsx
│       └── CommandPalette.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (RSC)
│   │   └── middleware.ts         # Auth middleware
│   ├── validations/              # Zod schemas
│   │   ├── note.ts
│   │   ├── subject.ts
│   │   ├── topic.ts
│   │   ├── task.ts
│   │   └── flashcard.ts
│   └── utils.ts                  # Shared utilities
│
├── hooks/                        # Custom React hooks
│   ├── useNotes.ts
│   ├── useSubjects.ts
│   ├── useTasks.ts
│   └── useUser.ts
│
├── types/
│   └── database.ts               # Generated Supabase types + manual extensions
│
├── docs/                         # Project documentation
│
├── tests/
│   ├── unit/                     # Vitest unit tests
│   ├── integration/              # Vitest integration tests
│   └── e2e/                      # Playwright e2e tests
│
├── public/
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Example env file (committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Authentication Architecture

- Provider: Supabase Auth (email/password, Phase 0)
- Session: Supabase session cookies (httpOnly, secure)
- Middleware: `middleware.ts` protects all `/app/*` routes
- Row Level Security: ALL database tables have RLS policies
- User profile: `profiles` table linked to `auth.users` via FK

### Auth Flow

```
User visits /app/* → middleware checks session
→ No session: redirect to /login
→ Session valid: allow through

POST /login → supabase.auth.signInWithPassword()
→ Session created → redirect to /dashboard

POST /signup → supabase.auth.signUp()
→ Email confirmation (optional, configurable)
→ Profile row created via database trigger
```

---

## 5. Data Flow Architecture

### 5.1 Server Components (Data Fetching)

Page-level data fetching uses Next.js Server Components with Supabase server client:

```typescript
// app/(app)/subjects/page.tsx (Server Component)
const supabase = createServerClient()
const { data: subjects } = await supabase
  .from('subjects')
  .select('*')
  .order('created_at', { ascending: false })
```

### 5.2 Client Components (Mutations + Realtime)

Interactive components (editor, task toggles, drag-drop) are Client Components using the browser Supabase client.

Mutations follow this pattern:
```typescript
// Optimistic UI update → Supabase mutation → Error rollback
```

### 5.3 Form Validation

All forms validate with Zod on client before submission. Server-side Zod validation on API routes (defense in depth).

---

## 6. State Management

No global client-side state store (no Redux, no Zustand) in Phase 1.

State hierarchy:
1. **Server state**: fetched in RSC, passed as props
2. **URL state**: active subject/topic/note via route params
3. **Local component state**: `useState` / `useReducer`
4. **Form state**: React Hook Form
5. **Editor state**: Tiptap internal

If cross-component state becomes necessary (e.g., command palette, active note breadcrumb), introduce Zustand in a targeted, bounded way. Document the decision in DECISIONS.md at that time.

---

## 7. Editor Architecture

### 7.1 Tiptap Configuration

Extensions (Phase 3 scope):
- StarterKit (Bold, Italic, Heading, Paragraph, BulletList, OrderedList, Code, Blockquote, HardBreak, HorizontalRule, Strike)
- Underline
- TaskList + TaskItem (interactive checkboxes)
- Table + TableRow + TableCell
- CodeBlock (with lowlight for syntax highlighting)
- Mathematics (KaTeX)
- Link
- Placeholder

### 7.2 Auto-save

- Debounced save: 1500ms after last keystroke
- Visual indicator: "Saving..." → "Saved" → no indicator
- Optimistic: content in Tiptap state is source of truth until explicit sync failure
- Failure: show error banner, offer retry

---

## 8. Security

### 8.1 Row Level Security (RLS)

Every table enforces:
```sql
-- Users can only see their own data
CREATE POLICY "Users can only access own data" ON notes
  FOR ALL USING (auth.uid() = user_id);
```

### 8.2 Input Sanitization

- Zod validates all inputs at form and API boundary
- Tiptap output is HTML — sanitized before storage and before render
- File uploads: type validation, size limits, stored in user-scoped Supabase Storage paths

### 8.3 Environment Variables

- Supabase URL and anon key: safe for client exposure
- Supabase service role key: server only, never exposed to client
- No secrets in client bundles

---

## 9. Performance

### 9.1 Build

- Static generation for public pages (auth pages)
- Dynamic rendering for app pages (user-specific)
- Image optimization via Next.js `<Image>` component

### 9.2 Runtime

- Code splitting: automatic via Next.js App Router
- Suspense boundaries at page level for loading states
- Lazy loading of Tiptap editor (heavy dependency)
- KaTeX loaded only when math blocks are present

### 9.3 Database

- All tables indexed on `user_id` and `created_at`
- Full-text search via PostgreSQL `tsvector` + GIN index on notes content
- Pagination on all list views (cursor-based)

---

## 10. Environment Configuration

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server only
NEXT_PUBLIC_APP_URL=
```

---

## 11. Deployment (Future)

Target: Vercel (Next.js native hosting)  
Database: Supabase managed PostgreSQL  
Not yet configured — will be addressed in Phase 10.
