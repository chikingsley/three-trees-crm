import { createClerkClient } from '@clerk/backend';
import { BUN_PUBLIC_CLERK_PUBLISHABLE_KEY } from "env/env";

// Initialize Clerk client with both secret and publishable keys
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: BUN_PUBLIC_CLERK_PUBLISHABLE_KEY
});

// Helper function to get a user by ID
export async function getClerkUserById(userId: string) {
  try {
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    console.error('Error fetching user from Clerk:', error);
    return null;
  }
}

// Helper function to get a list of users
export async function getClerkUsers(options?: { limit?: number; offset?: number }) {
  try {
    const { limit = 10, offset = 0 } = options || {};
    const userList = await clerkClient.users.getUserList({
      limit,
      offset,
    });
    return userList;
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    return [];
  }
}

// Helper to get user data from a request
export async function getUserFromRequest(req: Request) {
  try {
    // Use the authenticateRequest method to verify the session
    const result = await clerkClient.authenticateRequest(req);
    
    // If we have a signed-in user with a userId, get the full user object
    if (result.isSignedIn && result.toAuth()?.userId) {
      const userId = result.toAuth().userId;
      return await getClerkUserById(userId);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

export default clerkClient; 