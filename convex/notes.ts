import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// For QUERIES - returns null if unauthenticated (graceful degradation)
const getUserIdOrNull = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  return user ? user._id : null;
};

// For MUTATIONS - throws if unauthenticated (operations require auth)
const getUserId = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  if (!user) throw new Error("User not found. Please sign in again.");
  return user._id;
};

export const getNote = query({
  args: { noteId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const normalizedId = ctx.db.normalizeId("notes", args.noteId);
    if (!normalizedId) return null;
    const note = await ctx.db.get(normalizedId);
    if (!note) return null;
    if (note.userId !== userId) return null;
    return note;
  },
});

export const saveNoteContent = mutation({
  args: {
    id: v.id("notes"),
    title: v.string(),
    content: v.optional(v.union(v.any(), v.null())),
    content_text: v.optional(v.union(v.string(), v.null())),
    word_count: v.number(),
    reading_time_mins: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const now = Date.now();
    const isoNow = new Date(now).toISOString();
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        content: args.content,
        content_text: args.content_text,
        word_count: args.word_count,
        reading_time_mins: args.reading_time_mins,
        updated_at: isoNow,
        last_saved_at: now,
      });
    } else {
      throw new Error("Note not found or unauthorized");
    }
    return now;
  },
});

export const updateStickyNotes = mutation({
  args: {
    id: v.id("notes"),
    sticky_notes: v.array(
      v.object({
        id: v.string(),
        content: v.string(),
        color: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        rotation: v.optional(v.number()),
        updated_at: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const now = Date.now();
    const isoNow = new Date(now).toISOString();
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, {
        sticky_notes: args.sticky_notes,
        updated_at: isoNow,
        last_saved_at: now,
      });
    } else {
      throw new Error("Note not found or unauthorized");
    }
    return now;
  },
});

export const toggleFavorite = mutation({
  args: { id: v.id("notes"), is_favorite: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, { is_favorite: args.is_favorite });
    }
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return notes.filter(n => !n.archived_at).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },
});

export const listBySubject = query({
  args: { subject_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("subject_id"), args.subject_id))
      .collect();
    return notes.filter(n => !n.archived_at).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },
});

export const listFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter(q => q.eq(q.field("is_favorite"), true))
      .collect();
    return notes.filter(n => !n.archived_at).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },
});

export const togglePin = mutation({
  args: { id: v.id("notes"), is_pinned: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, { is_pinned: args.is_pinned });
    }
  }
});

export const archive = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, { archived_at: new Date().toISOString() });
    }
  }
});

export const createNote = mutation({
  args: {
    localId: v.string(),
    title: v.string(),
    subject_id: v.optional(v.union(v.string(), v.null())),
    topic_id: v.optional(v.union(v.string(), v.null()))
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const now = new Date().toISOString();
    const noteId = await ctx.db.insert("notes", {
      userId,
      local_id: args.localId,
      title: args.title,
      subject_id: args.subject_id,
      topic_id: args.topic_id,
      word_count: 0,
      reading_time_mins: 0,
      is_pinned: false,
      is_favorite: false,
      created_at: now,
      updated_at: now,
      last_saved_at: Date.now(),
    });
    return noteId;
  }
});

export const listArchived = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return notes.filter(n => !!n.archived_at).sort((a, b) => new Date(b.archived_at!).getTime() - new Date(a.archived_at!).getTime());
  },
});

export const restore = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, { archived_at: undefined });
    }
  }
});

export const permanentlyDelete = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.delete(existing._id);
    }
  }
});

export const emptyArchive = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const archivedNotes = notes.filter(n => !!n.archived_at);
    for (const note of archivedNotes) {
      await ctx.db.delete(note._id);
    }
  }
});

export const moveToSubject = mutation({
  args: {
    id: v.id("notes"),
    subject_id: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, {
        subject_id: args.subject_id,
        topic_id: null,
      });
    }
  },
});

export const addTag = mutation({
  args: { id: v.id("notes"), tag: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      const tags = existing.tags || [];
      if (!tags.includes(args.tag)) {
        await ctx.db.patch(existing._id, { tags: [...tags, args.tag] });
      }
    }
  }
});

export const removeTag = mutation({
  args: { id: v.id("notes"), tag: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      const tags = existing.tags || [];
      await ctx.db.patch(existing._id, { tags: tags.filter(t => t !== args.tag) });
    }
  }
});

export const searchNotes = query({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId || !args.q.trim()) return [];
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const lower = args.q.toLowerCase();
    return notes
      .filter(n => !n.archived_at && (
        n.title.toLowerCase().includes(lower) ||
        (n.tags || []).some(t => t.toLowerCase().includes(lower))
      ))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }
});

/**
 * Creates a rich onboarding/welcome note for first-time users.
 * Demonstrates every Studora feature: headings, callouts, lists, tasks,
 * code blocks, blockquotes, bold/italic/underline, and tags.
 * Called once from storeUser when onboarding_note_created is not set.
 */
export const createOnboardingNote = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Idempotency: only create once
    if (user.onboarding_note_created) return null;

    const firstName = (identity.name ?? "there").split(" ")[0];
    const now = new Date().toISOString();

    const content = {
      type: "doc",
      content: [
        // ── Title / H1 ──────────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: `Welcome to Studora, ${firstName}! 👋` }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "This is your " },
            { type: "text", marks: [{ type: "bold" }], text: "interactive welcome note" },
            { type: "text", text: ". It showcases " },
            { type: "text", marks: [{ type: "italic" }], text: "every formatting feature" },
            { type: "text", text: " available in the Studora editor. Feel free to edit it, or delete it and start fresh!" }
          ]
        },

        // ── CALLOUT: Exam Point ─────────────────────────────────────────
        {
          type: "academicCallout",
          attrs: { calloutType: "exam-point" },
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "EXAM POINT — " },
            { type: "text", text: "Studora saves your notes in real-time. Everything is synced to the cloud instantly — no manual save required." }
          ]
        },

        // ── H2: Formatting Basics ───────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "✍️ Formatting Basics" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use the toolbar above to apply: " },
            { type: "text", marks: [{ type: "bold" }], text: "Bold" },
            { type: "text", text: ", " },
            { type: "text", marks: [{ type: "italic" }], text: "Italic" },
            { type: "text", text: ", " },
            { type: "text", marks: [{ type: "underline" }], text: "Underline" },
            { type: "text", text: ", and " },
            { type: "text", marks: [{ type: "strike" }], text: "Strikethrough" },
            { type: "text", text: ". You can also change the " },
            { type: "text", marks: [{ type: "bold" }], text: "font size" },
            { type: "text", text: " and " },
            { type: "text", marks: [{ type: "bold" }], text: "writing font" },
            { type: "text", text: " from the toolbar dropdowns." }
          ]
        },

        // ── H2: Academic Callouts ───────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📌 Academic Callouts" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Use the 'Academic' menu in the toolbar to insert study-specific callout blocks:" }]
        },
        {
          type: "academicCallout",
          attrs: { calloutType: "important-concept" },
          content: [{ type: "text", text: "IMPORTANT CONCEPT — Callouts help you structure knowledge. Use them to flag key ideas, formulas, definitions, or common mistakes." }]
        },
        {
          type: "academicCallout",
          attrs: { calloutType: "definition" },
          content: [{ type: "text", text: "DEFINITION — A callout is a styled block that visually separates critical information from regular note content." }]
        },
        {
          type: "academicCallout",
          attrs: { calloutType: "key-formula" },
          content: [{ type: "text", text: "KEY FORMULA — Shannon Capacity: C = B × log₂(1 + S/N)" }]
        },
        {
          type: "academicCallout",
          attrs: { calloutType: "common-mistake" },
          content: [{ type: "text", text: "COMMON MISTAKE — Confusing 2NF (partial dependency) with 3NF (transitive dependency). Remember: 3NF is stricter." }]
        },
        {
          type: "academicCallout",
          attrs: { calloutType: "remember-this" },
          content: [{ type: "text", text: "REMEMBER THIS — Studora auto-saves every change. Your work is never lost." }]
        },

        // ── H2: Lists & Tasks ───────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📋 Lists & Task Checklists" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Create bullet lists, numbered lists, and interactive task checklists:" }]
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Bullet list item — great for concepts & ideas" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Nest items with Tab to create sub-points" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Hit Enter twice to exit the list" }] }] },
          ]
        },
        {
          type: "orderedList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Numbered lists for step-by-step procedures" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Great for algorithms, lab steps, or proof sequences" }] }] },
          ]
        },
        {
          type: "taskList",
          content: [
            { type: "taskItem", attrs: { checked: true }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create your Studora account ✓" }] }] },
            { type: "taskItem", attrs: { checked: true }, content: [{ type: "paragraph", content: [{ type: "text", text: "Open your first note ✓" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create your first Academic Subject shelf" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Write your first real study note" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Tag a note with a topic tag (e.g. #algorithms)" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Try the Command Palette (Ctrl+K / ⌘K)" }] }] },
          ]
        },

        // ── H2: Code Blocks ─────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "💻 Code Blocks" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Perfect for CS notes — paste code with syntax highlighting:" }]
        },
        {
          type: "codeBlock",
          attrs: { language: "python" },
          content: [{ type: "text", text: "# Dijkstra's Shortest Path — O((V + E) log V)\nimport heapq\n\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]:\n            continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist" }]
        },

        // ── H2: Blockquote ──────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "💬 Blockquotes" }]
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "\"An investment in knowledge pays the best interest.\" — Benjamin Franklin" }]
            }
          ]
        },

        // ── H2: Paper Styles ────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "📄 Paper Styles & Writing Fonts" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Click the " },
            { type: "text", marks: [{ type: "bold" }], text: "paper icon" },
            { type: "text", text: " in the toolbar to switch between:" }
          ]
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Ruled" }, { type: "text", text: " — Classic lined notebook paper (default)" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Grid" }, { type: "text", text: " — Graph paper, great for diagrams & math" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Dotted" }, { type: "text", text: " — Bullet-journal style" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Blank" }, { type: "text", text: " — Clean minimal writing surface" }] }] },
          ]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use the " },
            { type: "text", marks: [{ type: "bold" }], text: "font selector" },
            { type: "text", text: " to switch between handwriting-style fonts like " },
            { type: "text", marks: [{ type: "italic" }], text: "Patrick Hand" },
            { type: "text", text: ", " },
            { type: "text", marks: [{ type: "italic" }], text: "Kalam" },
            { type: "text", text: ", or clean " },
            { type: "text", marks: [{ type: "italic" }], text: "Inter" },
            { type: "text", text: "." }
          ]
        },

        // ── H2: Sticky Notes ────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🗒️ Sticky Notes" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Click the " },
            { type: "text", marks: [{ type: "bold" }], text: "Sticky Note" },
            { type: "text", text: " button in the toolbar to place floating notes on the canvas. Drag them anywhere, resize them, and change their color. Perfect for side-margin annotations and quick reminders." }
          ]
        },

        // ── H2: Organization ────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🗂️ Organization Features" }]
        },
        {
          type: "orderedList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Subjects Shelf" }, { type: "text", text: " — Group notes by academic subject (e.g. Data Structures, Physics, Economics)" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Topics" }, { type: "text", text: " — Nest topics inside subjects for deeper organization (e.g. Subject → Topic → Note)" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Tags" }, { type: "text", text: " — Add searchable tags to any note (e.g. #midterm, #formula, #todo)" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Star / Favourite" }, { type: "text", text: " — Star important notes to pin them to the Dashboard quick-access panel" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Archive" }, { type: "text", text: " — Archive old notes you don't need but want to keep. Restore any time." }] }] },
          ]
        },

        // ── H2: Search & Command ────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "🔍 Search & Command Palette" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Press " },
            { type: "text", marks: [{ type: "code" }], text: "Ctrl+K" },
            { type: "text", text: " (or " },
            { type: "text", marks: [{ type: "code" }], text: "⌘K" },
            { type: "text", text: " on Mac) to open the Command Palette — quickly create notes, navigate pages, or toggle dark/light theme without leaving the keyboard." }
          ]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use the " },
            { type: "text", marks: [{ type: "bold" }], text: "Search page" },
            { type: "text", text: " (magnifier icon in sidebar) to search across all your notes by title, content, or tag." }
          ]
        },

        // ── Final note ──────────────────────────────────────────────────
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "You're all set! 🚀" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Start by creating your first Subject Shelf, then add notes to it. Studora will stay out of your way and let you focus on " },
            { type: "text", marks: [{ type: "bold" }], text: "learning, not managing files" },
            { type: "text", text: "." }
          ]
        },
      ]
    };

    const contentText = `Welcome to Studora! This note showcases every editor feature: headings, callouts (exam-point, definition, key-formula, common-mistake, remember-this), bullet lists, numbered lists, task checklists, code blocks, blockquotes, paper styles, sticky notes, subject organization, tags, starring, archive, and the Command Palette.`;

    const noteId = await ctx.db.insert("notes", {
      userId: user._id,
      title: `👋 Welcome to Studora, ${firstName}!`,
      content,
      content_text: contentText,
      word_count: 320,
      reading_time_mins: 2,
      is_pinned: true,
      is_favorite: true,
      local_id: `onboarding-${user._id}`,
      tags: ["studora", "guide", "features"],
      created_at: now,
      updated_at: now,
      last_saved_at: Date.now(),
    });

    // Mark user so we never create this again
    await ctx.db.patch(user._id, { onboarding_note_created: true });

    return noteId;
  }
});
