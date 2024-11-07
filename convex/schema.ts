/* This is going to define our database tables and the types for them */
/* This sets up the database structure */

import {
  defineSchema,
  defineTable,
} from "convex/server"; /* These fns are used to create the structure of the database tables */
import { v } from "convex/values";

/* This defines the basic "messages" table, which can hold text messages and the names of people who sent them.*/
export default defineSchema({
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
  messages: defineTable({
    /* A table named messages is created with two fields */
    sender:
      v.string() /* Stores the name of the person sending the message, as a string */,
    content: v.string() /* Stores the message content, also as a string */,
  }),
});
