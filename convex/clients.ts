import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { FollowUpLiterals, OnboardingStatusLiterals } from "./schema";

// Define types based on the actual string/null values allowed by the schema literals
export type FollowUpOption =
  | "Admin Call"
  | "Call Client for Onboarding"
  | "Send Valent Sign-Up SMS"
  | "Confirm Valent Signup"
  | "Send Payment Link SMS"
  | "🤖 Confirm Payment"
  | "Send DocSign Link SMS"
  | "🤖 Confirm Documentation"
  | "Assign to Class"
  | null;

// Manually define the type based on the actual string values in OnboardingStatusLiterals
type OnboardingStatusOption =
  | "Initiation"
  | "Initial Contact"
  | "Form Submitted"
  | "Payment Pending"
  | "Payment Confirmed"
  | "Documentation Pending"
  | "Ready for Class"
  | "Complete";

const determineOnboardingStatus = (followUp: FollowUpOption): OnboardingStatusOption => {
  const statusMap: Record<string, OnboardingStatusOption> = {
    "Call Client for Onboarding": "Initiation",
    "Send Valent Sign-Up SMS": "Initiation",
    "Confirm Valent Signup": "Initiation",
    "Send Payment Link SMS": "Initiation",
    "🤖 Confirm Payment": "Payment Pending",
    "Send DocSign Link SMS": "Documentation Pending",
    "🤖 Confirm Documentation": "Documentation Pending",
    "Assign to Class": "Ready for Class",
    "Admin Call": "Ready for Class",
  };

  if (followUp === null) {
    return "Complete";
  }
  return statusMap[followUp] ?? "Initiation";
};

const getNextFollowUp = (completedFollowUp: string | null | undefined): FollowUpOption => {
  switch (completedFollowUp) {
    case undefined:
    case "Initial Contact":
    case "Form Submitted":
      return "Call Client for Onboarding";

    case "Call Client for Onboarding":
      return "Send Valent Sign-Up SMS";
    case "Send Valent Sign-Up SMS":
      return "Confirm Valent Signup";
    case "Confirm Valent Signup":
      return "Send Payment Link SMS";
    case "Send Payment Link SMS":
      return "🤖 Confirm Payment";
    case "Send DocSign Link SMS":
      return "🤖 Confirm Documentation";
    case "Assign to Class":
      return "Admin Call";
    case "Admin Call":
      return null;

    case "🤖 Confirm Payment":
      console.warn("getNextFollowUp called unexpectedly for automatic task: 🤖 Confirm Payment");
      return "Send DocSign Link SMS";
    case "🤖 Confirm Documentation":
      console.warn("getNextFollowUp called unexpectedly for automatic task: 🤖 Confirm Documentation");
      return "Assign to Class";

    case null:
      return null;

    default:
      console.warn(`getNextFollowUp received unexpected value: ${completedFollowUp}`);
      return "Call Client for Onboarding";
  }
};

export const completeManualFollowUp = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const { clientId } = args;
    const client = await ctx.db.get(clientId);

    if (!client) {
      console.error(`Client not found: ${clientId}`);
      return { success: false, message: "Client not found." };
    }

    const currentFollowUp = client.followUp;

    if (currentFollowUp === null || (typeof currentFollowUp === 'string' && currentFollowUp.startsWith("🤖"))) {
      console.warn(`Attempted manual completion on non-manual task for client ${clientId}. Current: ${currentFollowUp}`);
      return { success: false, message: `Cannot manually complete '${currentFollowUp}'.` };
    }

    const nextFollowUp = getNextFollowUp(currentFollowUp);
    const newOnboardingStatus = determineOnboardingStatus(nextFollowUp);

    try {
      await ctx.db.patch(clientId, {
        followUp: nextFollowUp,
        onboardingStatus: newOnboardingStatus,
      });
      console.log(`Completed manual task for ${clientId}. Old: ${currentFollowUp}, New: ${nextFollowUp}, Status: ${newOnboardingStatus}`);
      return { success: true, nextFollowUp, newOnboardingStatus };
    } catch (error: any) {
      console.error(`Failed to complete manual follow-up for ${clientId}:`, error);
      return { success: false, message: error?.message || "Database update failed." };
    }
  },
});

export const manualSetFollowUp = mutation({
  args: {
    clientId: v.id("clients"),
    newFollowUp: v.union(...FollowUpLiterals)
  },
  handler: async (ctx, args) => {
    const { clientId, newFollowUp } = args;

    const currentClient = await ctx.db.get(clientId);
    if (!currentClient) {
      console.error(`[manualSetFollowUp] Client not found: ${clientId}`);
      return { success: false, message: "Client not found." };
    }

    const newOnboardingStatus = determineOnboardingStatus(newFollowUp as FollowUpOption);

    try {
      await ctx.db.patch(clientId, {
        followUp: newFollowUp,
        onboardingStatus: newOnboardingStatus,
      });
      console.log(`[manualSetFollowUp] Manually set followUp for ${clientId} to ${newFollowUp}, status to ${newOnboardingStatus}`);
      return { success: true, newFollowUp, newOnboardingStatus };
    } catch (error: any) {
      console.error(`[manualSetFollowUp] Failed for ${clientId}:`, error);
      return { success: false, message: error?.message || "Database update failed." };
    }
  },
});

export const deleteClient = mutation({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    const { clientId } = args;
    try {
      const existingClient = await ctx.db.get(clientId);
      if (!existingClient) {
        console.warn(`[deleteClient] Attempted to delete non-existent client: ${clientId}`);
        return { success: true, message: "Client already deleted." };
      }

      await ctx.db.delete(clientId);
      console.log(`[deleteClient] Deleted client: ${clientId}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[deleteClient] Failed for ${clientId}:`, error);
      return { success: false, message: error?.message || "Database deletion failed." };
    }
  },
});

export const getClient = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").collect();
    return clients;
  },
});
