import { serve } from "bun";
import index from "./index.html";
import { handleClerkWebhook } from "./api/webhooks";
import { getCurrentUser, getCurrentDbUser, checkUserSync } from "./api/users";
import prisma from "./lib/prisma"; // Import Prisma client

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
    
    // Clerk webhook endpoint
    "/api/webhooks": async (req) => {
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      
      return handleClerkWebhook(req);
    },
    
    // User information endpoints (protected)
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

    // API endpoint to fetch clients
    "/api/clients": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      try {
        const clients = await prisma.client.findMany({
          // You can add sorting, filtering, etc. here later
          orderBy: {
            createdAt: 'desc', // Example: Sort by newest first
          },
        });

        // Serialize BigInt and Date fields for JSON compatibility
        const serializedClients = clients.map(client => ({
          ...client,
          id: client.id.toString(), // Convert BigInt to string
          createdAt: client.createdAt.toISOString(), // Convert Date to ISO string
          updatedAt: client.updatedAt.toISOString(), // Convert Date to ISO string
          // Ensure other fields like currentBalance (Float) are serializable
        }));

        return Response.json(serializedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },

    // API endpoint to fetch payments
    "/api/payments": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }

      try {
        const payments = await prisma.payment.findMany({
          include: {
            client: { // Include related client data
              select: {
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: {
            paymentDate: 'desc', // Sort by payment date, newest first
          },
        });

        // Serialize BigInt, Date, and potentially Float fields
        const serializedPayments = payments.map(payment => ({
          ...payment,
          id: payment.id.toString(), // Convert BigInt to string
          clientId: payment.clientId.toString(), // Convert BigInt to string
          paymentDate: payment.paymentDate.toISOString(), // Convert Date to ISO string
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
          // Ensure amount (Float) is handled correctly if needed, but JSON usually handles numbers fine.
          // Include client names directly in the object for easier access in columns
          clientName: `${payment.client?.lastName ?? ''}, ${payment.client?.firstName ?? ''}`.trim() || 'N/A',
        }));

        return Response.json(serializedPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },

    // API endpoint to fetch facilitators
    "/api/facilitators": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      try {
        const facilitators = await prisma.facilitator.findMany({
          orderBy: { lastName: 'asc' }, // Example sort
        });
        const serializedFacilitators = facilitators.map(f => ({
          ...f,
          id: f.id.toString(),
          createdAt: f.createdAt.toISOString(),
          updatedAt: f.updatedAt.toISOString(),
        }));
        return Response.json(serializedFacilitators);
      } catch (error) {
        console.error("Failed to fetch facilitators:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },

    // API endpoint to fetch attendance records
    "/api/attendance": async (req) => {
      if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 405 });
      }
      try {
        const attendanceRecords = await prisma.attendance.findMany({
          include: {
            enrollment: {
              include: {
                client: { select: { firstName: true, lastName: true } }
              }
            },
            attendanceDate: { select: { date: true } }
          },
          orderBy: { attendanceDate: { date: 'desc' } }, // Sort by date desc
        });

        const serializedAttendance = attendanceRecords.map(a => ({
          ...a,
          id: a.id.toString(),
          enrollmentId: a.enrollmentId.toString(),
          attendanceDateId: a.attendanceDateId.toString(),
          createdAt: a.createdAt.toISOString(),
          updatedAt: a.updatedAt.toISOString(),
          // Add derived/flattened fields for easier column access
          clientName: `${a.enrollment?.client?.lastName ?? ''}, ${a.enrollment?.client?.firstName ?? ''}`.trim() || 'N/A',
          attendanceActualDate: a.attendanceDate?.date.toISOString().split('T')[0] ?? 'N/A', // Format date as YYYY-MM-DD
        }));
        return Response.json(serializedAttendance);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);