/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import { ClerkProvider } from '@clerk/clerk-react'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BUN_PUBLIC_CLERK_PUBLISHABLE_KEY, BUN_PUBLIC_CONVEX_URL } from "env/env";

// const convex = new ConvexReactClient(process.env.BUN_PUBLIC_CONVEX_URL as string);
// const BUN_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY
const PUBLISHABLE_KEY = BUN_PUBLIC_CLERK_PUBLISHABLE_KEY
const convex = new ConvexReactClient(BUN_PUBLIC_CONVEX_URL);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
