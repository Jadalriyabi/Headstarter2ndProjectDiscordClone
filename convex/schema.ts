/* This is going to define our database tables and the types for them */

import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values"

export default defineSchema ({
  messages: defineTable({
    sender: v.string(),
    content: v.string(),
  })
})