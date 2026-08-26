import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// For QUERIES - returns null if unauthenticated
const getUserIdOrNull = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();
  return user ? user._id : null;
};

// For MUTATIONS - throws if unauthenticated
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

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const subjects = await ctx.db
      .query("subjects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return subjects.filter(s => !s.archived_at).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  },
});

export const getById = query({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return null;
    const subject = await ctx.db.get(args.id);
    if (!subject || subject.userId !== userId) return null;
    return subject;
  },
});

export const createSubject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const now = new Date().toISOString();
    return await ctx.db.insert("subjects", {
      userId,
      name: args.name,
      description: args.description,
      color: args.color,
      sort_order: Date.now(),
      created_at: now,
      updated_at: now,
    });
  },
});

export const updateSubject = mutation({
  args: {
    id: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description,
        color: args.color,
        updated_at: new Date().toISOString(),
      });
    }
  },
});

export const deleteSubject = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const existing = await ctx.db.get(args.id);
    if (existing && existing.userId === userId) {
      await ctx.db.patch(existing._id, { archived_at: new Date().toISOString() });
    }
  }
});
