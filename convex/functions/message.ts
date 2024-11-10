/* In here we're going to define some functions that we can use to interact with our messages table. */
/* The first will be a query which will return all of our messages and the other is going to be a mutation which we'll use to 
  create a new message*/

/* Query fetches data while mutation modifies it */

import {
  mutation,
  query,
} from "../_generated/server"; /* Query(Fetches data from database without changing it):
                                                          Mutation(Modifies or adds new data to the database) */
import { v } from "convex/values";

// collects all messages from the messages table
export const list = query({
  /* This function retrieves all the messages from the messages table */
  handler: async (ctx) => {
    /* It queries the messages table, collects all entries, and returns them */
    return await ctx.db.query("messages").collect();
  },
});

// adds a new message to the messages table
export const create = mutation({
  /* This function adds a new message to the messages table */
  args: {
    /* Takes sender (name of the person) and content(message) as arguments */
    sender: v.string(),
    content: v.string(),
  } /* It inserts a new entry into the messages table with the provided sender and content */,
  handler: async (ctx, { sender, content }) => {
    await ctx.db.insert("messages", { sender, content });
  },
});
