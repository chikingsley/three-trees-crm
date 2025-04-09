import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to fetch all clients
export const list = query({
  args: {}, // No arguments needed for now
  handler: async (ctx) => {
    // Fetch all documents from the "clients" table
    const clients = await ctx.db.query("clients").collect();
    // Optional: Sort clients if needed, e.g., by lastName
    // clients.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""));
    return clients;
  },
});

// NOTE: For production with many clients, you'll want to implement pagination
// instead of fetching all clients at once.

// Mutation to update onboarding status
export const updateOnboardingStatus = mutation({
  args: {
    clientId: v.id("clients"),
    status: v.string(), // Consider using v.union with v.literal for type safety
  },
  handler: async (ctx, args) => {
    const { clientId, status } = args;
    // TODO: Add validation/authorization if needed
    await ctx.db.patch(clientId, { onboardingStatus: status });
    console.log(`Updated onboarding status for ${clientId} to ${status}`);
    return { success: true };
  },
});

// Mutation to update follow-up status
export const updateFollowUp = mutation({
  args: {
    clientId: v.id("clients"),
    status: v.string(), // Consider using v.union with v.literal for type safety
  },
  handler: async (ctx, args) => {
    const { clientId, status } = args;
    // TODO: Add validation/authorization if needed
    await ctx.db.patch(clientId, { followUp: status });
    console.log(`Updated follow-up status for ${clientId} to ${status}`);
    return { success: true };
  },
});
