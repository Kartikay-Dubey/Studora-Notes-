import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Insert or update the user in the Convex database.
 * Call this from an auth sync webhook or a Client-side wrapper.
 */
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name/email changed, patch it.
      if (
        user.name !== identity.name ||
        user.email !== identity.email ||
        user.image !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name ?? "Unknown",
          email: identity.email ?? "no-email@example.com",
          image: identity.pictureUrl,
        });
      }
      return user._id;
    }

    // If it's a new identity, create a new User.
    return await ctx.db.insert("users", {
      name: identity.name ?? "Unknown",
      email: identity.email ?? "no-email@example.com",
      image: identity.pictureUrl,
      tokenIdentifier: identity.subject,
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.subject)
      )
      .unique();
  },
});
