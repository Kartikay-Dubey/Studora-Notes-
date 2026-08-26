# Studora — Design System Specification

**Version:** 0.2.0 (Phase 3 — Light-First Digital Notebook Direction)  
**Last Updated:** 2026-08-23  
**Status:** Active — Light-First Warm Notebook Standard

---

## 1. Design Philosophy: Digital Notebook + Software Precision

Studora's visual language is a **calm, light-first digital notebook**.  
It evokes the tactile focus of an academic study desk, clean paper, structured notebooks, and editorial clarity — combined with the precision of modern productivity software.

### Core Principles

1. **Warm Academic Calm** — The interface feels like a quiet reading room or a high-quality physical notebook. Low saturation, warm paper-like tones, and zero visual noise.
2. **Editor-First Hierarchy** — The note document canvas is the hero of the application. Chrome (sidebars, toolbars, metadata) is quiet and recedes into the background.
3. **Typographic Craft** — Line length (max 720px / 65–75 characters per line), line height (`1.65` reading height), and clear hierarchy turn long reading sessions into a comfortable experience.
4. **Tactile Notebook Accents** — Subtle paper surfaces, section dividers, bookmark indicators, and ink-inspired accents instead of SaaS dashboard cards.

---

## 2. Visual Personality

| Quality | Implementation |
|---|---|
| **Warm** | Off-white paper background (`#FAF9F5`), deep charcoal text (`#1F2421`), warm neutral borders |
| **Tactile** | Subtle paper surfaces, soft page shadows, bookmark-style tags, clean section margins |
| **Focused** | Editor-first layout, collapsible outline, distraction-free Focus & Reading modes |
| **Academic** | Editorial blocks (Important, Definition, Exam Point, Formula), KaTeX math rendering, code blocks |
| **Restrained** | Muted ink-blue primary accent, soft sage secondary, no bright AI gradients or glowing borders |

### Deliberately Rejected

- ❌ Dark navy / blue SaaS dashboard templates
- ❌ Generic AI gradients (purple-to-pink, cyan-to-teal)
- ❌ Glassmorphism floating cards
- ❌ Neon accent colors or saturated background cards
- ❌ Parallax or decorative cursor-following animations
- ❌ Artificial skeuomorphic fake paper textures that harm performance or contrast

---

## 3. Color System

All tokens are defined as HSL values for seamless CSS custom property switching.

### 3.1 Warm Light Palette (Primary Experience)

```css
:root {
  /* Canvas & Paper Backgrounds */
  --background:           40 20% 97%;     /* #FAF9F5 — Warm paper canvas */
  --surface:              0 0% 100%;      /* #FFFFFF — Pure white note sheet */
  --surface-raised:       40 12% 95%;     /* #F5F4F0 — Soft warm secondary panel */

  /* Borders & Rules */
  --border:               40 8% 88%;      /* #E6E4DF — Subtle warm gray border */
  --border-strong:        40 10% 78%;     /* #C8C5BD — Emphasized margin rule */

  /* Ink & Typography */
  --text-primary:         150 5% 13%;     /* #1F2421 — Deep charcoal ink */
  --text-secondary:       150 3% 40%;     /* #5C635E — Muted graphite text */
  --text-muted:           40 4% 60%;      /* #999690 — Soft ash placeholder */
  --text-inverse:         0 0% 100%;

  /* Brand Accents — Muted Academic Ink */
  --accent:               215 50% 36%;    /* #2B4C7E — Deep ink blue */
  --accent-hover:         215 50% 28%;    /* #20385E — Darker ink blue */
  --accent-subtle:        215 40% 95%;    /* #F0F4F8 — Soft blue tint */
  --accent-foreground:    0 0% 100%;

  /* Supporting Accents */
  --secondary-sage:       140 25% 42%;    /* #4A7C59 — Soft sage green */
  --tertiary-amber:       35 85% 45%;     /* #D97706 — Warm amber */

  /* Semantics */
  --success:              140 40% 38%;
  --success-subtle:       140 30% 94%;
  --warning:              35 80% 45%;
  --warning-subtle:       35 70% 94%;
  --destructive:          0 65% 48%;
  --destructive-subtle:   0 55% 95%;
  --destructive-foreground: 0 0% 100%;
}
```

### 3.2 Dark Mode (Secondary / Night Study Support)

```css
.dark {
  --background:           215 15% 10%;    /* #14171A — Deep charcoal desk */
  --surface:              215 12% 14%;    /* #1F2328 — Warm dark sheet */
  --surface-raised:       215 12% 18%;    /* #282D34 — Raised panel */
  --border:               215 10% 22%;    /* #323842 — Dark border */
  --border-strong:        215 10% 32%;

  --text-primary:         40 15% 92%;     /* #EBE8E1 — Off-white reading ink */
  --text-secondary:       40 8% 68%;      /* #B2AEA5 — Muted reading text */
  --text-muted:           40 5% 48%;

  --accent:               215 60% 65%;    /* Softened ink blue */
  --accent-hover:         215 60% 72%;
  --accent-subtle:        215 30% 20%;
  --accent-foreground:    215 15% 10%;
}
```

---

## 4. Typography

### Font Stack

```css
/* Application Interface UI */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Note Reading & Editor Body (Optional Editorial Pair) */
--font-serif: 'Lora', Georgia, 'Times New Roman', serif;

/* Code Blocks & Formulas */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Reading Metrics (Editor Canvas)

- **Max Content Width:** `720px` (comfortable 65–75 characters per line)
- **Base Font Size:** `17px` (`1.0625rem`) for note body
- **Line Height:** `1.65` (`leading-relaxed`) for comfortable long reading
- **Heading Line Height:** `1.25` (`leading-tight`)

---

## 5. Layout Philosophy: Notebook + Library + Workspace

Studora is arranged in a 3-column structured workspace:

```
┌─────────────────┬──────────────────────────────────┬─────────────────┐
│ Library Sidebar │      Note Document Surface       │ Document Outline│
│    (240px)      │      (Main Editor Canvas)        │   (200px)       │
│                 │                                  │                 │
│ • Subjects      │ Title                            │ • Section 1     │
│ • Topics        │ Metadata (Subject, Tags)         │ • Section 2     │
│ • Notes List    │                                  │ • Section 3     │
│                 │ Editor Body Content (Tiptap)     │                 │
└─────────────────┴──────────────────────────────────┴─────────────────┘
```

- **Focus Mode:** Fades sidebar and outline, leaving only the note document canvas centered.
- **Reading Mode:** Optimizes margins, font size, line-height, and hides toolbars for continuous reading.

---

## 6. Student-Specific Editorial Blocks

Student blocks are subtle editorial callouts — **not heavy colorful boxes**. They use a thin left accent border, small label badge, and subtle background tint.

| Block Type | Label | Accent Color | Use Case |
|---|---|---|---|
| `Important` | IMPORTANT | Muted Red / Coral | Essential exam concepts |
| `Definition` | DEFINITION | Ink Blue | Terminology & key definitions |
| `Exam Point` | EXAM POINT | Warm Amber | Highly tested questions/topics |
| `Example` | EXAMPLE | Soft Sage | Worked examples & applications |
| `Common Mistake` | MISTAKE | Muted Rust | Frequent student errors |
| `Remember` | REMEMBER | Violet | Memory anchors & mnemonics |
| `Question` | QUESTION | Indigo | Practice questions |
| `Formula` | FORMULA | Teal | Math / physics equations |
| `Summary` | SUMMARY | Slate | Unit recap |

---

## 7. Motion & Animation Standards

Powered by **CSS Transitions** for micro-interactions and **Motion for React** for structural transitions.

- **Micro-interactions:** `100–150ms` (hover, button press, checkbox toggle)
- **UI Transitions:** `160–240ms` (sidebar collapse, dropdown reveal, Slash menu)
- **Page / Modal Transitions:** `250–350ms` (Focus Mode toggle, Command Palette modal)

All animations must respect `prefers-reduced-motion`.
