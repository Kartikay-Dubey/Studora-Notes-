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

export const listBySubject = query({
  args: { subject_id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrNull(ctx);
    if (!userId) return [];
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("subject_id"), args.subject_id))
      .collect();
    return topics
      .filter((t) => !t.archived_at)
      .sort((a, b) => a.sort_order - b.sort_order);
  },
});

export const createTopic = mutation({
  args: {
    name: v.string(),
    subject_id: v.string(),
    parent_id: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const now = new Date().toISOString();
    const topics = await ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("subject_id"), args.subject_id))
      .collect();
    const maxSortOrder = topics.reduce((max, t) => Math.max(max, t.sort_order), 0);
    return await ctx.db.insert("topics", {
      userId,
      name: args.name,
      subject_id: args.subject_id,
      parent_id: args.parent_id,
      sort_order: maxSortOrder + 1,
      created_at: now,
      updated_at: now,
    });
  },
});

export const updateTopic = mutation({
  args: {
    id: v.id("topics"),
    name: v.optional(v.string()),
    parent_id: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const topic = await ctx.db.get(args.id);
    if (!topic) throw new Error("Topic not found");
    if (topic.userId !== userId) throw new Error("Unauthorized");
    const updates: any = { updated_at: new Date().toISOString() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.parent_id !== undefined) updates.parent_id = args.parent_id;
    await ctx.db.patch(args.id, updates);
  },
});

export const deleteTopic = mutation({
  args: { id: v.id("topics") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const topic = await ctx.db.get(args.id);
    if (!topic) throw new Error("Topic not found");
    if (topic.userId !== userId) throw new Error("Unauthorized");
    await ctx.db.delete(args.id);
  },
});
