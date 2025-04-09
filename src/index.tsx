import { serve } from "bun";
import index from "./index.html";
import { handleClerkWebhook } from "./api/webhooks";
import { handleWixSignupFormWebhook } from "./api/wix-form-webhook";
import { getCurrentUser, getCurrentDbUser, checkUserSync } from "./api/users";

// Enhanced request logger function
const logRequest = (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log headers to help diagnose webhook issues
  const headerObj = {};
  req.headers.forEach((value, key) => {
    headerObj[key] = value;
  });
  console.log(`[REQUEST HEADERS] ${JSON.stringify(headerObj)}`);
  
  // Log the URL details
  try {
    const url = new URL(req.url);
    console.log(`[URL DETAILS] Protocol: ${url.protocol}, Host: ${url.host}, Pathname: ${url.pathname}`);
  } catch (error) {
    console.log(`[URL DETAILS] Error parsing URL: ${error.message}`);
  }
};

const server = serve({
  // Add the fetch handler back
  fetch(req) {
    // Log all incoming requests with detailed URL information
    console.log('\n[FETCH HANDLER] Received request');
    logRequest(req);
    
    // Extract URL details for debugging
    try {
      const url = new URL(req.url);
      console.log(`[FETCH HANDLER] URL pathname: ${url.pathname}`);
      console.log(`[FETCH HANDLER] URL search: ${url.search}`);
      console.log(`[FETCH HANDLER] URL hash: ${url.hash}`);
    } catch (error) {
      console.log(`[FETCH HANDLER] Error parsing URL: ${error.message}`);
    }
    
    // Check if this is a webhook request by looking at the URL path
    if (req.url.includes('/api/wix-signup-form')) {
      console.log('[FETCH HANDLER] Intercepted Wix webhook request');
      
      // For POST requests to the webhook endpoint
      if (req.method === 'POST') {
        console.log('[FETCH HANDLER] Processing POST request to webhook endpoint');
        return req.json().then(payload => {
          console.log('[FETCH HANDLER] Successfully parsed payload');
          // Pass the already parsed payload to the webhook handler
          return handleWixSignupFormWebhook(req, payload);
        }).catch(error => {
          console.error('[FETCH HANDLER] Error parsing payload:', error);
          return new Response(JSON.stringify({ error: 'Failed to parse payload' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }
    }
    
    // Continue with normal routing for other requests
    console.log('[FETCH HANDLER] Continuing to standard routes');
    return undefined;
  },
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    "/api/webhooks": async (req) => {
      console.log('[ROUTE HANDLER] /api/webhooks called');
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      
      return handleClerkWebhook(req);
    },
    
    "/api/wix-signup-form": async (req) => {
      console.log('[ROUTE HANDLER] /api/wix-signup-form called');
      logRequest(req);
      
      if (req.method !== "POST") {
        console.log('[ROUTE HANDLER] Method not allowed:', req.method);
        return new Response("Method not allowed", { status: 405 });
      }
      
      try {
        console.log('[ROUTE HANDLER] Calling webhook handler...');
        const response = await handleWixSignupFormWebhook(req);
        console.log('[ROUTE HANDLER] Handler completed successfully');
        return response;
      } catch (error) {
        console.error('[ROUTE HANDLER] Error in route handler:', error);
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Error in webhook handler",
          error: error instanceof Error ? error.message : String(error)
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    },
    
    // Add a diagnostic catch-all route for API requests
    "/api/*": async (req) => {
      console.log('[CATCH-ALL] Received request to unknown API endpoint');
      logRequest(req);
      
      try {
        const url = new URL(req.url);
        console.log(`[CATCH-ALL] URL pathname: ${url.pathname}`);
      } catch (error) {
        console.log(`[CATCH-ALL] Error parsing URL: ${error.message}`);
      }
      
      return new Response(JSON.stringify({
        message: "Endpoint not found",
        requestUrl: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    },

    "/api/wix-signup-form/": async (req) => {
      console.log("[WIX WEBHOOK TRAILING SLASH] Received request to webhook endpoint");
      logRequest(req);
      
      if (req.method !== "POST") {
        console.log("[WIX WEBHOOK] Method not allowed:", req.method);
        return new Response("Method not allowed", { status: 405 });
      }
      
      try {
        console.log("[WIX WEBHOOK] Calling webhook handler...");
        const response = await handleWixSignupFormWebhook(req);
        console.log("[WIX WEBHOOK] Handler completed successfully");
        return response;
      } catch (error) {
        console.error("[WIX WEBHOOK] Error in route handler:", error);
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Error in webhook handler",
          error: error instanceof Error ? error.message : String(error)
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    },

    "/api/me": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      
      return getCurrentUser(req);
    },
    
    "/api/me/db": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      
      return getCurrentDbUser(req);
    },

    "/api/me/sync": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      
      return checkUserSync(req);
    },

    // "/api/clients": async (req) => {
    //   if (req.method !== "GET") {
    //     return new Response("Method not allowed", { status: 405 });
    //   }

    //   try {
    //     const clients = await prisma.client.findMany({
    //       orderBy: {
    //         createdAt: 'desc',
    //       },
    //     });

    //     const serializedClients = clients.map(client => ({
    //       ...client,
    //       id: client.id.toString(),
    //       createdAt: client.createdAt.toISOString(),
    //       updatedAt: client.updatedAt.toISOString(),
    //     }));

    //     return Response.json(serializedClients);
    //   } catch (error) {
    //     console.error("Failed to fetch clients:", error);
    //     return new Response("Internal Server Error", { status: 500 });
    //   }
    // },

    // "/api/payments": async (req) => {
    //   if (req.method !== "GET") {
    //     return new Response("Method not allowed", { status: 405 });
    //   }

    //   try {
    //     const payments = await prisma.payment.findMany({
    //       include: {
    //         client: {
    //           select: {
    //             firstName: true,
    //             lastName: true,
    //           }
    //         }
    //       },
    //       orderBy: {
    //         paymentDate: 'desc',
    //       },
    //     });

    //     const serializedPayments = payments.map(payment => ({
    //       ...payment,
    //       id: payment.id.toString(),
    //       clientId: payment.clientId.toString(),
    //       paymentDate: payment.paymentDate.toISOString(),
    //       createdAt: payment.createdAt.toISOString(),
    //       updatedAt: payment.updatedAt.toISOString(),
    //       clientName: `${payment.client?.lastName ?? ''}, ${payment.client?.firstName ?? ''}`.trim() || 'N/A',
    //     }));

    //     return Response.json(serializedPayments);
    //   } catch (error) {
    //     console.error("Failed to fetch payments:", error);
    //     return new Response("Internal Server Error", { status: 500 });
    //   }
    // },

    // "/api/facilitators": async (req) => {
    //   if (req.method !== "GET") {
    //     return new Response("Method not allowed", { status: 405 });
    //   }
    //   try {
    //     const facilitators = await prisma.facilitator.findMany({
    //       orderBy: { lastName: 'asc' },
    //     });
    //     const serializedFacilitators = facilitators.map(f => ({
    //       ...f,
    //       id: f.id.toString(),
    //       createdAt: f.createdAt.toISOString(),
    //       updatedAt: f.updatedAt.toISOString(),
    //     }));
    //     return Response.json(serializedFacilitators);
    //   } catch (error) {
    //     console.error("Failed to fetch facilitators:", error);
    //     return new Response("Internal Server Error", { status: 500 });
    //   }
    // },

    // "/api/attendance": async (req) => {
    //   if (req.method !== "GET") {
    //     return new Response("Method not allowed", { status: 405 });
    //   }
    //   try {
    //     const attendanceRecords = await prisma.attendance.findMany({
    //       include: {
    //         enrollment: {
    //           include: {
    //             client: { select: { firstName: true, lastName: true } }
    //           }
    //         },
    //         attendanceDate: { select: { date: true } }
    //       },
    //       orderBy: { attendanceDate: { date: 'desc' } },
    //     });

    //     const serializedAttendance = attendanceRecords.map(a => ({
    //       ...a,
    //       id: a.id.toString(),
    //       enrollmentId: a.enrollmentId.toString(),
    //       attendanceDateId: a.attendanceDateId.toString(),
    //       createdAt: a.createdAt.toISOString(),
    //       updatedAt: a.updatedAt.toISOString(),
    //       clientName: `${a.enrollment?.client?.lastName ?? ''}, ${a.enrollment?.client?.firstName ?? ''}`.trim() || 'N/A',
    //       attendanceActualDate: a.attendanceDate?.date.toISOString().split('T')[0] ?? 'N/A',
    //     }));
    //     return Response.json(serializedAttendance);
    //   } catch (error) {
    //     console.error("Failed to fetch attendance:", error);
    //     return new Response("Internal Server Error", { status: 500 });
    //   }
    // },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`📝 Available endpoints:`);
console.log(` - /api/wix-signup-form (Webhook endpoint)`);
console.log(` - /api/webhooks (Clerk webhook)`);
console.log(` - /api/me, /api/me/db, /api/me/sync (User endpoints)`);
console.log(` - /api/clients, /api/payments, /api/facilitators, /api/attendance (Data endpoints)`);
console.log(`🔌 Webhook endpoint: ${server.url}/api/wix-signup-form`);