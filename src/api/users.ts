import { requireAuth, getDbUser } from '../middleware/auth';

// Get the current user's information
export async function getCurrentUser(req: Request): Promise<Response> {
  // Check if the user is authenticated
  const { user, response } = await requireAuth(req);
  if (response) return response;

  // Return the user data
  return new Response(JSON.stringify({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.imageUrl,
    emailAddress: user.primaryEmailAddress?.emailAddress || null
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Get the current user's database entry
export async function getCurrentDbUser(req: Request): Promise<Response> {
  // Check if the user is authenticated and has a database entry
  const { dbUser, response } = await getDbUser(req);
  if (response) return response;

  if (!dbUser) {
    return new Response(JSON.stringify({ error: 'User not found in database' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return the database user
  return new Response(JSON.stringify(dbUser), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Check if a user is properly synced between Clerk and the database
export async function checkUserSync(req: Request): Promise<Response> {
  // Check if the user is authenticated
  const { user, response } = await requireAuth(req);
  if (response) return response;

  // Get the database user (this will create one if it doesn't exist)
  const { dbUser } = await getDbUser(req);

  // Return the sync status
  return new Response(JSON.stringify({
    clerkUser: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress || null,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    },
    dbUser: dbUser ? {
      id: dbUser.id,
      clerkUserId: dbUser.clerkUserId,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      profileImageUrl: dbUser.profileImageUrl,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    } : null,
    isSynced: !!dbUser && dbUser.clerkUserId === user.id,
    autoCreated: !!(dbUser && new Date(dbUser.createdAt).getTime() > Date.now() - 10000), // Created in the last 10 seconds
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
} 