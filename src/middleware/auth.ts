import { getUserFromRequest } from '../lib/clerk';
import prisma from '../lib/prisma';

/**
 * Middleware to check if a user is authenticated.
 * Returns a Response with 401 status if not authenticated.
 */
export async function requireAuth(req: Request): Promise<{ user: any; response?: Response }> {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return {
        user: null,
        response: new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      };
    }
    
    return { user };
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    return {
      user: null,
      response: new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
}

/**
 * Gets the user's database entry if they exist, or creates one if they don't
 */
export async function getDbUser(req: Request): Promise<{ dbUser: any | null; response?: Response }> {
  try {
    const { user, response } = await requireAuth(req);
    
    if (response) {
      return { dbUser: null, response };
    }
    
    // Find the user in our database or create if they don't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });
    
    // If user doesn't exist in our database but is authenticated in Clerk, create them
    if (!dbUser) {
      console.log(`User ${user.id} found in Clerk but not in database. Creating database entry...`);
      
      // Get primary email if available
      const primaryEmail = user.primaryEmailAddress?.emailAddress;
      
      // Create the user in the database
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: user.id,
          email: primaryEmail || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
          profileImageUrl: user.imageUrl || null,
        },
      });
      
      console.log(`User ${user.id} successfully created in database with DB ID: ${dbUser.id}`);
      
      // Create an audit log entry for the creation
      await prisma.auditLog.create({
        data: {
          userId: dbUser.id,
          action: 'CREATE',
          tableName: 'users',
          recordPk: dbUser.id.toString(),
          changedFields: { 
            reason: 'User auto-created during authentication',
            source: 'auth_middleware' 
          },
        }
      });
    }
    
    return { dbUser };
  } catch (error) {
    console.error('Error in getDbUser middleware:', error);
    return {
      dbUser: null,
      response: new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }
} 