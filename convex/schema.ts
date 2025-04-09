import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    classID: v.optional(v.string()),
    onboardingStatus: v.optional(v.string()),
    followUp: v.optional(v.string()),
  })
  .index("by_email", ["email"])
  .index("by_lastName", ["lastName"])
  .searchIndex("search_name", {
    searchField: "firstName", 
    // filterFields: ["lastName"] 
  })
});