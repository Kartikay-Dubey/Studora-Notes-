# Studora — Testing Strategy

**Version:** 0.1.0 (Phase 0)  
**Last Updated:** 2026-08-23

---

## 1. Testing Philosophy

- **Test behavior, not implementation.** Tests verify that features work from a user's perspective, not that internal functions have specific shapes.
- **Coverage is a floor, not a ceiling.** 80% unit coverage is the minimum target; critical paths must be 100% E2E covered.
- **Every major feature requires tests before it is marked done.**
- **Accessibility is tested, not assumed.**
- **Tests run in CI before any merge.**

---

## 2. Test Layers

### 2.1 Unit Tests — Vitest

**What:** Pure functions, utility functions, Zod validation schemas, data transformations, component logic hooks.

**What NOT to unit test:**
- UI components (covered by integration)
- Database queries (covered by integration against Supabase test project)
- External API calls (mocked in integration)

**Location:** `tests/unit/`

**Naming:** `*.test.ts` or `*.test.tsx`

**Coverage target:** 80% across utility functions, hooks, and validation schemas.

**Example targets:**
- `lib/validations/note.ts` — Zod schema tests
- `lib/utils.ts` — All utility functions
- `hooks/` — Custom hooks (with React Testing Library)
- Editor extensions — Custom Tiptap extension logic

---

### 2.2 Integration Tests — Vitest + Supabase Test Project

**What:** Feature flows that involve database interaction, auth flows, and data mutations.

**Strategy:**
- Separate Supabase test project with seeded test data
- Each test runs against real PostgreSQL (validates RLS policies, triggers, constraints)
- Tests wrapped in transactions and rolled back after each test (or use Supabase local via Docker)

**Location:** `tests/integration/`

**Example targets:**
- Creating a note creates a row with correct user_id
- RLS: user A cannot read user B's notes
- Tag creation with duplicate name returns correct error
- Soft delete: archived note does not appear in main list

---

### 2.3 End-to-End Tests — Playwright

**What:** Critical user journeys through the full application, running in a real browser.

**Strategy:**
- Chromium only for CI (fast); cross-browser on release
- Dedicated test user accounts in Supabase test project
- Database seeded before suite, cleaned after
- Tests are independent (no test depends on another test's state)

**Location:** `tests/e2e/`

**Naming:** `*.spec.ts`

**Critical paths to cover (Phase 10):**

| Journey | Priority |
|---|---|
| Sign up → create subject → create note → edit note → sign out | P0 |
| Sign in → global search → open result | P0 |
| Create flashcard deck → study session → see result | P0 |
| Create task → complete task → view in completed | P0 |
| Sign in → create subject → create topic → create note in topic | P1 |
| Apply tag to note → filter by tag in search | P1 |
| Archive note → restore from archive | P1 |
| Keyboard navigation: ⌘K search → navigate to note | P1 |

---

## 3. Accessibility Testing

### 3.1 Automated

- `axe-core` integrated with Playwright E2E tests
- Run on all primary pages and modal dialogs
- Must return zero critical or serious violations

### 3.2 Manual

- Keyboard-only navigation audit (Tab, Shift+Tab, Enter, Escape, Arrow keys)
- Screen reader testing: NVDA (Windows) + VoiceOver (Mac) on critical flows
- Focus management audit: modal open/close, dynamic content, toast notifications

---

## 4. Visual Regression (Phase 10)

- Playwright screenshot comparison for key pages
- Desktop (1280px) and mobile (375px) viewports
- Light and dark mode captured separately
- Baseline stored in `tests/screenshots/baseline/`

---

## 5. Performance Testing

### 5.1 Metrics

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Lighthouse Performance Score | ≥ 90 |

### 5.2 Tools

- Lighthouse CI in GitHub Actions
- Next.js Bundle Analyzer for bundle size monitoring
- Target: editor bundle lazy-loaded < 200KB initial JS

---

## 6. Test Environment Setup

```bash
# Run unit tests
pnpm test:unit

# Run unit tests with coverage
pnpm test:unit --coverage

# Run integration tests
pnpm test:integration

# Run E2E tests (requires dev server)
pnpm test:e2e

# Run all tests
pnpm test
```

---

## 7. Testing Rules

1. No feature is marked `done` without passing tests at the appropriate layer.
2. A failing test is a blocking issue — do not merge code with failing tests.
3. Tests must be readable. A test that cannot be understood is not useful.
4. Flaky tests must be fixed immediately — they erode trust in the test suite.
5. Test files live adjacent to or near the code they test, not in a distant folder.
6. Mock only external services (Supabase in unit tests) — do not mock your own code.

---

## 8. CI/CD (Phase 10)

- GitHub Actions workflow
- On every PR: lint → type-check → unit tests → integration tests
- On release branch: + E2E tests + Lighthouse CI + bundle analysis
- PR blocked if any check fails
