/* In here we're going to define some functions that we can use to interact with our messages table. */
/* The first will be a query which will return all of our messages and the other is going to be a mutation which we'll use to 
  create a new message*/

/* Query fetches data while mutation modifies it */

import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const create = mutation({
  args: {
    sender: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { sender, content }) => {
    await ctx.db.insert("messages", { sender, content });
  },
});
