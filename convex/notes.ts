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

// Helper: Generates full 9-section feature guide TipTap JSON document
function buildGuideNoteContent(firstName: string = "there") {
  return {
    type: "doc",
    content: [
      // ── H1 Title ──
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: `👋 Welcome to Studora — Complete Beginner's Guide` }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Welcome, " },
          { type: "text", marks: [{ type: "bold" }], text: firstName },
          { type: "text", text: "! This interactive guide explains " },
          { type: "text", marks: [{ type: "bold" }], text: "how every Studora feature works" },
          { type: "text", text: " to help you turn scattered notes into a structured study system. Feel free to edit, practice, or check off items below!" }
        ]
      },

      // ── CALLOUT: Real-time Cloud Sync ──
      {
        type: "studentBlock",
        attrs: { type: "exampoint", label: "EXAM POINT" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "⚡ REAL-TIME CLOUD SYNC & AUTO-SAVE: " },
              { type: "text", text: "Studora saves your work automatically as you type. Everything is synced to the cloud instantly — no manual save button needed!" }
            ]
          }
        ]
      },

      // ── H2: 1. Text Formatting & Custom Writing Fonts ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "1. ✍️ Text Formatting & Custom Writing Fonts" }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Use the top toolbar to style text with " },
          { type: "text", marks: [{ type: "bold" }], text: "Bold (Ctrl+B)" },
          { type: "text", text: ", " },
          { type: "text", marks: [{ type: "italic" }], text: "Italic (Ctrl+I)" },
          { type: "text", text: ", " },
          { type: "text", marks: [{ type: "underline" }], text: "Underline (Ctrl+U)" },
          { type: "text", text: ", and " },
          { type: "text", marks: [{ type: "strike" }], text: "Strikethrough" },
          { type: "text", text: ". Change font sizes (14px–28px) or select your preferred handwriting font (" },
          { type: "text", marks: [{ type: "italic" }], text: "Patrick Hand, Kalam, Inter, Lora, JetBrains Mono" },
          { type: "text", text: ") from the font dropdown." }
        ]
      },

      // ── H2: 2. Academic Callout Blocks ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "2. 📌 Academic Callout Blocks" }]
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Click 'Academic Callout' in the toolbar to insert color-coded blocks designed for academic study:" }]
      },

      // CALLOUT: IMPORTANT CONCEPT
      {
        type: "studentBlock",
        attrs: { type: "important", label: "IMPORTANT CONCEPT" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Core Concept: " },
              { type: "text", text: "Academic callouts highlight critical info in your notes so you can quickly scan them during exam revision." }
            ]
          }
        ]
      },

      // CALLOUT: DEFINITION
      {
        type: "studentBlock",
        attrs: { type: "definition", label: "DEFINITION" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Active Recall: " },
              { type: "text", text: "A study technique where you stimulate your memory for a piece of information rather than passively re-reading slides." }
            ]
          }
        ]
      },

      // CALLOUT: KEY FORMULA
      {
        type: "studentBlock",
        attrs: { type: "formula", label: "KEY FORMULA" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Euler's Identity: " },
              { type: "text", text: "e^(iπ) + 1 = 0   |   Shannon Channel Capacity: C = B × log₂(1 + S/N)" }
            ]
          }
        ]
      },

      // CALLOUT: COMMON MISTAKE
      {
        type: "studentBlock",
        attrs: { type: "mistake", label: "COMMON MISTAKE" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Don't confuse 2NF and 3NF: " },
              { type: "text", text: "2NF eliminates partial functional dependencies; 3NF eliminates transitive functional dependencies." }
            ]
          }
        ]
      },

      // CALLOUT: REMEMBER THIS
      {
        type: "studentBlock",
        attrs: { type: "remember", label: "REMEMBER THIS" },
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", marks: [{ type: "bold" }], text: "Pro Tip: " },
              { type: "text", text: "Type '/' anywhere on a blank line to open the quick slash menu and insert blocks without touching the mouse!" }
            ]
          }
        ]
      },

      // ── H2: 3. Lists & Interactive Checklists ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "3. 📋 Lists & Interactive Task Checklists" }]
      },
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Bullet lists for quick summaries and brainstorming" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Press Tab to indent and create nested sub-points" }] }] }
        ]
      },
      {
        type: "orderedList",
        content: [
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 1: Read lecture slides & textbook chapters" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 2: Write structured summary notes in Studora" }] }] },
          { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 3: Test yourself using the interactive checklists below" }] }] }
        ]
      },
      {
        type: "taskList",
        content: [
          { type: "taskItem", attrs: { checked: true }, content: [{ type: "paragraph", content: [{ type: "text", text: "Sign up & open the Studora Starter Guide ✓" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create a new Academic Subject on the sidebar (e.g. Computer Science, Physics)" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create your first custom study note" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Add custom tags (#midterm, #formula) to organize your notes" }] }] },
          { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Press Ctrl+K / ⌘K to try the global Command Palette" }] }] }
        ]
      },

      // ── H2: 4. Code Blocks ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "4. 💻 Code Blocks with Syntax Highlighting" }]
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Click the code icon (<>) or type ``` to format code for CS & engineering courses:" }]
      },
      {
        type: "codeBlock",
        attrs: { language: "python" },
        content: [{ type: "text", text: "# Dijkstra's Shortest Path Algorithm - O((V + E) log V)\nimport heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > distances[u]: continue\n        for v, w in graph[u]:\n            if distances[u] + w < distances[v]:\n                distances[v] = distances[u] + w\n                heapq.heappush(pq, (distances[v], v))\n    return distances" }]
      },

      // ── H2: 5. Blockquotes ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "5. 💬 Blockquotes & Citations" }]
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

      // ── H2: 6. Paper Styles ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "6. 📄 Custom Notebook Paper Styles" }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Click the " },
          { type: "text", marks: [{ type: "bold" }], text: "Paper Style button" },
          { type: "text", text: " in the top-right toolbar to switch canvas background: " },
          { type: "text", marks: [{ type: "bold" }], text: "Ruled" },
          { type: "text", text: " (lined notebook), " },
          { type: "text", marks: [{ type: "bold" }], text: "Grid" },
          { type: "text", text: " (graph paper for math & engineering), " },
          { type: "text", marks: [{ type: "bold" }], text: "Dotted" },
          { type: "text", text: " (bullet journal), or " },
          { type: "text", marks: [{ type: "bold" }], text: "Blank" },
          { type: "text", text: "." }
        ]
      },

      // ── H2: 7. Floating Margin Sticky Notes ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "7. 🗒️ Margin Sticky Notes" }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Click " },
          { type: "text", marks: [{ type: "bold" }], text: "+ Sticky Note" },
          { type: "text", text: " to drop draggable, resizable sticky notes onto your document canvas. Perfect for side-margin annotations, quick formulas, and study reminders!" }
        ]
      },

      // ── H2: 8. Organization Features ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "8. 🗂️ Subject Shelves, Topics & Tag Organization" }]
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Academic Subjects Shelf: " },
                  { type: "text", text: "Organize notes into color-coded subject folders on the left sidebar (e.g. Computer Science, Physics, Economics)." }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Tags: " },
                  { type: "text", text: "Click '+ Tag' below the title to add searchable tags (#exam, #formula, #important) for quick filtering." }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Starred Favorites: " },
                  { type: "text", text: "Click the star icon next to the title to pin high-priority notes directly onto your Dashboard." }
                ]
              }
            ]
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Archive: " },
                  { type: "text", text: "Archive finished notes to keep your workspace clean without permanently deleting them." }
                ]
              }
            ]
          }
        ]
      },

      // ── H2: 9. One-Click PDF Export ──
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "9. 📥 One-Click PDF Export" }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Click the " },
          { type: "text", marks: [{ type: "bold" }], text: "Export PDF" },
          { type: "text", text: " button in the top-right toolbar to download a clean, print-ready PDF document of your note." }
        ]
      },

      // ── H3: Final Message ──
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "You're All Set! 🚀" }]
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Start by creating your first Subject Shelf, then add notes to it. Studora keeps out of your way so you can focus on " },
          { type: "text", marks: [{ type: "bold" }], text: "learning and understanding" },
          { type: "text", text: "!" }
        ]
      }
    ]
  };
}

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

    // Fallback: If this is a Welcome/Onboarding note and its content is missing or empty,
    // automatically attach the full 9-section feature guide content.
    if (
      note.title.includes("Welcome to Studora") &&
      (!note.content || !note.content.content || note.content.content.length <= 3)
    ) {
      const user = await ctx.db.get(note.userId);
      const name = user?.name ? user.name.split(" ")[0] : "there";
      return {
        ...note,
        content: buildGuideNoteContent(name),
      };
    }

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

    const firstName = (identity.name ?? "there").split(" ")[0];
    const now = new Date().toISOString();

    // Check if an onboarding note already exists for this user
    const existingNotes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const existingGuide = existingNotes.find(
      (n) => n.local_id === `onboarding-${user._id}` || n.title.includes("Welcome to Studora")
    );

    const guideContent = {
      type: "doc",
      content: [
        // ── H1 Title ──
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: `👋 Welcome to Studora — Complete Beginner's Guide` }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Welcome, " },
            { type: "text", marks: [{ type: "bold" }], text: firstName },
            { type: "text", text: "! This interactive guide explains " },
            { type: "text", marks: [{ type: "bold" }], text: "how every Studora feature works" },
            { type: "text", text: " to help you turn scattered notes into a structured study system. Feel free to edit, practice, or check off items below!" }
          ]
        },

        // ── CALLOUT: Real-time Cloud Sync ──
        {
          type: "studentBlock",
          attrs: { type: "exampoint", label: "EXAM POINT" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "⚡ REAL-TIME CLOUD SYNC & AUTO-SAVE: " },
                { type: "text", text: "Studora saves your work automatically as you type. Everything is synced to the cloud instantly — no manual save button needed!" }
              ]
            }
          ]
        },

        // ── H2: 1. Text Formatting & Writing Fonts ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "1. ✍️ Text Formatting & Custom Writing Fonts" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use the top toolbar to style text with " },
            { type: "text", marks: [{ type: "bold" }], text: "Bold (Ctrl+B)" },
            { type: "text", text: ", " },
            { type: "text", marks: [{ type: "italic" }], text: "Italic (Ctrl+I)" },
            { type: "text", text: ", " },
            { type: "text", marks: [{ type: "underline" }], text: "Underline (Ctrl+U)" },
            { type: "text", text: ", and " },
            { type: "text", marks: [{ type: "strike" }], text: "Strikethrough" },
            { type: "text", text: ". Change font sizes (14px–28px) or select your preferred handwriting font (" },
            { type: "text", marks: [{ type: "italic" }], text: "Patrick Hand, Kalam, Inter, Lora, JetBrains Mono" },
            { type: "text", text: ") from the font dropdown." }
          ]
        },

        // ── H2: 2. Academic Callout Blocks ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "2. 📌 Academic Callout Blocks" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Click 'Academic Callout' in the toolbar to insert color-coded blocks designed for academic study:" }]
        },

        // CALLOUT: IMPORTANT CONCEPT
        {
          type: "studentBlock",
          attrs: { type: "important", label: "IMPORTANT CONCEPT" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Core Concept: " },
                { type: "text", text: "Academic callouts highlight critical info in your notes so you can quickly scan them during exam revision." }
              ]
            }
          ]
        },

        // CALLOUT: DEFINITION
        {
          type: "studentBlock",
          attrs: { type: "definition", label: "DEFINITION" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Active Recall: " },
                { type: "text", text: "A study technique where you stimulate your memory for a piece of information rather than passively re-reading slides." }
              ]
            }
          ]
        },

        // CALLOUT: KEY FORMULA
        {
          type: "studentBlock",
          attrs: { type: "formula", label: "KEY FORMULA" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Euler's Identity: " },
                { type: "text", text: "e^(iπ) + 1 = 0   |   Shannon Channel Capacity: C = B × log₂(1 + S/N)" }
              ]
            }
          ]
        },

        // CALLOUT: COMMON MISTAKE
        {
          type: "studentBlock",
          attrs: { type: "mistake", label: "COMMON MISTAKE" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Don't confuse 2NF and 3NF: " },
                { type: "text", text: "2NF eliminates partial functional dependencies; 3NF eliminates transitive functional dependencies." }
              ]
            }
          ]
        },

        // CALLOUT: REMEMBER THIS
        {
          type: "studentBlock",
          attrs: { type: "remember", label: "REMEMBER THIS" },
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Pro Tip: " },
                { type: "text", text: "Type '/' anywhere on a blank line to open the quick slash menu and insert blocks without touching the mouse!" }
              ]
            }
          ]
        },

        // ── H2: 3. Lists & Interactive Checklists ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "3. 📋 Lists & Interactive Task Checklists" }]
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Bullet lists for quick summaries and brainstorming" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Press Tab to indent and create nested sub-points" }] }] }
          ]
        },
        {
          type: "orderedList",
          content: [
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 1: Read lecture slides & textbook chapters" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 2: Write structured summary notes in Studora" }] }] },
            { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step 3: Test yourself using the interactive checklists below" }] }] }
          ]
        },
        {
          type: "taskList",
          content: [
            { type: "taskItem", attrs: { checked: true }, content: [{ type: "paragraph", content: [{ type: "text", text: "Sign up & open the Studora Starter Guide ✓" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create a new Academic Subject on the sidebar (e.g. Computer Science, Physics)" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Create your first custom study note" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Add custom tags (#midterm, #formula) to organize your notes" }] }] },
            { type: "taskItem", attrs: { checked: false }, content: [{ type: "paragraph", content: [{ type: "text", text: "Press Ctrl+K / ⌘K to try the global Command Palette" }] }] }
          ]
        },

        // ── H2: 4. Code Blocks ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "4. 💻 Code Blocks with Syntax Highlighting" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Click the code icon (<>) or type ``` to format code for CS & engineering courses:" }]
        },
        {
          type: "codeBlock",
          attrs: { language: "python" },
          content: [{ type: "text", text: "# Dijkstra's Shortest Path Algorithm - O((V + E) log V)\nimport heapq\n\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > distances[u]: continue\n        for v, w in graph[u]:\n            if distances[u] + w < distances[v]:\n                distances[v] = distances[u] + w\n                heapq.heappush(pq, (distances[v], v))\n    return distances" }]
        },

        // ── H2: 5. Blockquotes ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "5. 💬 Blockquotes & Citations" }]
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

        // ── H2: 6. Paper Styles ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "6. 📄 Custom Notebook Paper Styles" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Click the " },
            { type: "text", marks: [{ type: "bold" }], text: "Paper Style button" },
            { type: "text", text: " in the top-right toolbar to switch canvas background: " },
            { type: "text", marks: [{ type: "bold" }], text: "Ruled" },
            { type: "text", text: " (lined notebook), " },
            { type: "text", marks: [{ type: "bold" }], text: "Grid" },
            { type: "text", text: " (graph paper for math & engineering), " },
            { type: "text", marks: [{ type: "bold" }], text: "Dotted" },
            { type: "text", text: " (bullet journal), or " },
            { type: "text", marks: [{ type: "bold" }], text: "Blank" },
            { type: "text", text: "." }
          ]
        },

        // ── H2: 7. Floating Margin Sticky Notes ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "7. 🗒️ Margin Sticky Notes" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Click " },
            { type: "text", marks: [{ type: "bold" }], text: "+ Sticky Note" },
            { type: "text", text: " to drop draggable, resizable sticky notes onto your document canvas. Perfect for side-margin annotations, quick formulas, and study reminders!" }
          ]
        },

        // ── H2: 8. Organization Features ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "8. 🗂️ Subject Shelves, Topics & Tag Organization" }]
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Academic Subjects Shelf: " },
                    { type: "text", text: "Organize notes into color-coded subject folders on the left sidebar (e.g. Computer Science, Physics, Economics)." }
                  ]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Tags: " },
                    { type: "text", text: "Click '+ Tag' below the title to add searchable tags (#exam, #formula, #important) for quick filtering." }
                  ]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Starred Favorites: " },
                    { type: "text", text: "Click the star icon next to the title to pin high-priority notes directly onto your Dashboard." }
                  ]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", marks: [{ type: "bold" }], text: "Archive: " },
                    { type: "text", text: "Archive finished notes to keep your workspace clean without permanently deleting them." }
                  ]
                }
              ]
            }
          ]
        },

        // ── H2: 9. One-Click PDF Export ──
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "9. 📥 One-Click PDF Export" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Click the " },
            { type: "text", marks: [{ type: "bold" }], text: "Export PDF" },
            { type: "text", text: " button in the top-right toolbar to download a clean, print-ready PDF document of your note." }
          ]
        },

        // ── H3: Final Message ──
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "You're All Set! 🚀" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Start by creating your first Subject Shelf, then add notes to it. Studora keeps out of your way so you can focus on " },
            { type: "text", marks: [{ type: "bold" }], text: "learning and understanding" },
            { type: "text", text: "!" }
          ]
        }
      ]
    };

    const contentText = `👋 Welcome to Studora — Complete Beginner's Guide. This interactive guide explains how every Studora feature works: real-time cloud auto-save, text formatting & custom writing fonts, academic callouts (exam point, important concept, definition, key formula, common mistake, remember this), bullet/numbered lists & interactive task checklists, code blocks with syntax highlighting, blockquotes, custom paper styles (ruled, grid, dotted, blank), margin sticky notes, subject shelves & topic organization, tags & starred favorites, and one-click PDF export.`;

    if (existingGuide) {
      // Patch existing onboarding note with full guide content
      await ctx.db.patch(existingGuide._id, {
        title: `👋 Welcome to Studora, ${firstName}!`,
        content: guideContent,
        content_text: contentText,
        word_count: 520,
        reading_time_mins: 3,
        is_pinned: true,
        is_favorite: true,
        tags: ["studora", "guide", "features"],
        updated_at: now,
        last_saved_at: Date.now(),
      });
      await ctx.db.patch(user._id, { onboarding_note_created: true });
      return existingGuide._id;
    }

    const noteId = await ctx.db.insert("notes", {
      userId: user._id,
      title: `👋 Welcome to Studora, ${firstName}!`,
      content: guideContent,
      content_text: contentText,
      word_count: 520,
      reading_time_mins: 3,
      is_pinned: true,
      is_favorite: true,
      local_id: `onboarding-${user._id}`,
      tags: ["studora", "guide", "features"],
      created_at: now,
      updated_at: now,
      last_saved_at: Date.now(),
    });

    await ctx.db.patch(user._id, { onboarding_note_created: true });
    return noteId;
  }
});
