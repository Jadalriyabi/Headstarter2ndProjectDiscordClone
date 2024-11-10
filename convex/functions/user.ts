import {
  // These are functions for creating mutations(changes to the database) and queries(retrieving data)
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values"; // the validator builder is used to define the type of documents

// This function is a query that retrieves the current user's information
export const get = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx); // retrieves their info if they're signed in
  },
});

// This function updates or inserts user data
export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // First, it tries to find an existing user by using getUserByClerkId
    const user = await getUserByClerkId(ctx, args.clerkId);

    // if a user is found, it updates their username and image
    if (user) {
      await ctx.db.patch(user._id, {
        username: args.username,
        image: args.image,
      });
      // if no user is found, it inserts a new user record into the "users" collection with the
      // provided data
    } else {
      await ctx.db.insert("users", {
        username: args.username,
        image: args.image,
        clerkId: args.clerkId,
      });
    }
  },
});

// This function deletes a user based on their clerkId
export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    // Looks up the user by clerkId
    const user = await getUserByClerkId(ctx, clerkId);
    // If the user exists, it deletes their record from the database
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// Retrieves the current user's data based on their identity from the authentication context(ctx.auth)
const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return await getUserByClerkId(ctx, identity.subject);
};

// Queries the "users" database collection to find a user with a specific (clerkId)
const getUserByClerkId = async (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
};
