import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';

// This is the function that processes Clerk webhook events
export async function handleClerkWebhook(req: Request): Promise<Response> {
  // Verify the webhook signature
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: Missing CLERK_WEBHOOK_SECRET env var');
    return new Response('Error: Missing webhook secret', { status: 500 });
  }

  // Extract the headers we need directly
  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');
  const payload = await req.text();

  // Validate the webhook signature
  const webhook = new Webhook(SIGNING_SECRET);

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = webhook.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid webhook signature', { status: 400 });
  }

  // Process different webhook events
  try {
    const eventType = evt.type;
    console.log(`Processing webhook event: ${eventType}`);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      // Handle user creation or update
      const { id: clerkUserId, email_addresses, first_name, last_name, image_url } = evt.data;
      
      // Get the primary email
      const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)?.email_address;
      
      // Create or update the user in the database
      // await prisma.user.upsert({
      //   where: { clerkUserId: clerkUserId },
      //   update: {
      //     email: primaryEmail || undefined,
      //     firstName: first_name || undefined,
      //     lastName: last_name || undefined,
      //     profileImageUrl: image_url || undefined,
      //     updatedAt: new Date(),
      //   },
      //   create: {
      //     clerkUserId: clerkUserId,
      //     email: primaryEmail || null,
      //     firstName: first_name || null,
      //     lastName: last_name || null,
      //     profileImageUrl: image_url || null,
      //   },
      // });

      console.log(`User ${clerkUserId} created/updated in the database`);
    } 
    else if (eventType === 'user.deleted') {
      // Handle user deletion
      const { id: clerkUserId } = evt.data;
      
      // Find the user
      // const user = await prisma.user.findUnique({
      //   where: { clerkUserId: clerkUserId },
      // });

      // if (user) {
      //   // Create an entry in the audit log
      //   await prisma.auditLog.create({
      //     data: {
      //       userId: user.id,
      //       action: 'DELETE',
      //       tableName: 'users',
      //       recordPk: user.id.toString(),
      //       changedFields: { reason: 'User deleted from Clerk' },
      //     }
      //   });

      //   // Delete the user
      //   await prisma.user.delete({
      //     where: { clerkUserId: clerkUserId },
      //   });

      //   console.log(`User ${clerkUserId} deleted from the database`);
      // } else {
      //   console.log(`User ${clerkUserId} not found in the database`);
      // }
    }

    // Return a 200 response so Clerk knows we processed the webhook successfully
    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return a 500 error so Clerk will retry the webhook
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 