import { serve } from "bun";
import index from "./index.html";
import { handleClerkWebhook } from "./api/webhooks";
import { getCurrentUser, getCurrentDbUser, checkUserSync } from "./api/users";

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
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);