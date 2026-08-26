# Studora — Project Rules & Guidelines

**Last Updated:** 2026-08-23  
**Status:** Mandatory Active Rules

---

## Core Product Rules

1. **Student-First Purpose:** Every feature must answer: *"How does this help a student learn?"*
2. **Light-First Academic Aesthetics:** Studora is a digital notebook — warm, calm, tactile, organized, and focused. Avoid dark navy SaaS dashboards, generic AI gradients, neon colors, and excessive floating cards.
3. **No Unjustified Dependencies:** Do not install third-party libraries without explicit justification (performance, bundle size, necessity).
4. **No UI Abstraction Leaks:** Presentational UI components must not contain direct database or API fetching logic. Use repository and service abstractions.
5. **Local-First Architecture:** Core note-taking, editing, search, and organization must function offline using browser-side IndexedDB persistence (Dexie.js). Sync to cloud backend without UI rewriting.
6. **No AI Gradients or AI Filler:** Studora core (Phases 0–11) is a manual, distraction-free study tool. No AI subscriptions, chat widgets, or decorative AI features.
7. **Accessibility & Keyboard Standard:** All interactive elements must be focusable with visible focus rings, support standard keyboard navigation (`⌘K` command palette, `⌘N` new note, `/` slash menu, `ESC`), and conform to WCAG 2.1 AA standards.
8. **Document Everything:** Every architectural decision (ADR), schema change, UI shift, or feature addition must be recorded in `docs/` and `PROJECT_RULES.md`. Superseded decisions must be marked `SUPERSEDED` with rationale preserved.
