# Studora — Assistant Instructions & Context Reference

> For complete project architecture, progress logs, and system specs, see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

## Quick Commands

- **Development Server**: `npm run dev` (Runs on http://localhost:3000)
- **Type Checking**: `npm run type-check` (`tsc --noEmit`)
- **Unit Tests**: `npm run test:unit` (`vitest run`)
- **Production Build**: `npm run build`
- **Linting**: `npm run lint`

## Architecture Highlights
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + PostCSS with HSL semantic variables
- **Database**: Dexie.js 4 (IndexedDB) for local offline-first storage + Supabase for cloud
- **Editor**: TipTap 2 with custom `StudentBlock` nodes and KaTeX math formulas
- **Demo Account**: `demo@studora.local` / `StudoraDemo123!`

## Current Milestone
- **Phases 0–5 Completed**: Scaffolding, App Shell, Note Editor, Subjects/Topics, Search/Tags/Archive/Favorites, and GSAP Landing Page.
- **Next Phase (Phase 6)**: Flashcards & Spaced Repetition (SM-2 Algorithm).
