import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Match options defined in frontend: src/components/clients/columns.tsx
export const OnboardingStatusLiterals = [
  v.literal("Initiation"),
  v.literal("Initial Contact"),
  v.literal("Form Submitted"),
  v.literal("Payment Pending"),
  v.literal("Payment Confirmed"),
  v.literal("Documentation Pending"),
  v.literal("Ready for Class"),
  v.literal("Complete"),
] as const;

export const FollowUpLiterals = [
  v.literal("Admin Call"),
  v.literal("Call Client for Onboarding"),
  v.literal("Send Valent Sign-Up SMS"),
  v.literal("Confirm Valent Signup"),
  v.literal("Send Payment Link SMS"),
  v.literal("🤖 Confirm Payment"),
  v.literal("Send DocSign Link SMS"),
  v.literal("🤖 Confirm Documentation"),
  v.literal("Assign to Class"),
  v.null(), // Added null for completed state
] as const;

export default defineSchema({
  clients: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    classID: v.optional(v.string()),
    onboardingStatus: v.optional(v.union(...OnboardingStatusLiterals)),
    followUp: v.optional(v.union(...FollowUpLiterals)),
  })
  .index("by_email", ["email"])
  .index("by_lastName", ["lastName"])
  .searchIndex("search_name", {
    searchField: "firstName", 
    // filterFields: ["lastName"] 
  })
});