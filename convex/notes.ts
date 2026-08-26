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
