import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(), // Identifier from Auth provider (e.g. Supabase/Clerk)
    onboarding_note_created: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),

  subjects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    color: v.string(),
    icon: v.optional(v.union(v.string(), v.null())),
    sort_order: v.number(),
    archived_at: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["userId"]),

  topics: defineTable({
    userId: v.id("users"),
    subject_id: v.string(), // Keeping as string to allow flexible referencing initially
    parent_id: v.optional(v.union(v.string(), v.null())), 
    name: v.string(),
    sort_order: v.number(),
    archived_at: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_subject", ["subject_id"]),

  notes: defineTable({
    userId: v.id("users"),
    subject_id: v.optional(v.union(v.string(), v.null())),
    topic_id: v.optional(v.union(v.string(), v.null())),
    title: v.string(),
    content: v.optional(v.union(v.any(), v.null())), // TipTap JSON
    content_text: v.optional(v.union(v.string(), v.null())),
    word_count: v.number(),
    reading_time_mins: v.number(),
    is_pinned: v.boolean(),
    is_favorite: v.boolean(),
    local_id: v.optional(v.string()), // To map Dexie IDs during migration
    archived_at: v.optional(v.union(v.string(), v.null())),
    last_saved_at: v.optional(v.number()),
    created_at: v.string(),
    updated_at: v.string(),
    tags: v.optional(v.array(v.string())),
    sticky_notes: v.optional(
      v.array(
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
      )
    ),
    writing_font: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_subject", ["subject_id"])
    .index("by_topic", ["topic_id"])
    .index("by_local_id", ["local_id"]),

  tags: defineTable({
    userId: v.id("users"),
    name: v.string(),
    color: v.string(),
    created_at: v.string(),
  }).index("by_user", ["userId"]),
});
