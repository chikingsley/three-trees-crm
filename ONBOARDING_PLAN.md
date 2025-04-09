# Client Onboarding Workflow Automation Plan

## 1. Goal

Implement an automated client onboarding workflow where the client's `onboardingStatus` is driven by the completion of sequential `followUp` tasks. Some tasks are completed manually by administrators via the UI (checkbox), while others are completed automatically via external triggers (webhooks/API calls).

## 2. States & Transitions

**Onboarding Status States:** (Defined in `src/components/clients/columns.tsx`)
- Initiation
- Payment Pending
- Documentation Pending
- Complete

**Follow-up Task States:** (Defined in `src/components/clients/columns.tsx`)
- Call Client for Onboarding (Manual)
- Send Valent Sign-Up SMS (Manual)
- Confirm Valent Signup (Manual - *Assumption*)
- Send Payment Link SMS (Manual)
- 🤖 Confirm Payment (Automatic)
- Send DocSign Link SMS (Manual)
- 🤖 Confirm Documentation (Automatic)
- Assign to Class (Manual)
- *null* (Represents end of workflow)

**Transition Table:**

| Current Follow-up              | Trigger          | Next Follow-up             | New Status              | Notes                                   |
| :----------------------------- | :--------------- | :------------------------- | :---------------------- | :-------------------------------------- |
| *(New Client)*                 | Creation         | Call Client for Onboarding | Initiation              | Default state                           |
| Call Client for Onboarding     | Manual Checkbox  | Send Valent Sign-Up SMS    | Initiation              |                                         |
| Send Valent Sign-Up SMS        | Manual Checkbox  | Confirm Valent Signup      | Initiation              |                                         |
| Confirm Valent Signup          | Manual Checkbox  | Send Payment Link SMS      | **Payment Pending**     |                                         |
| Send Payment Link SMS          | Manual Checkbox  | 🤖 Confirm Payment         | Payment Pending         | Status changes                          |
| 🤖 Confirm Payment             | Automatic Trigger | Send DocSign Link SMS      | **Documentation Pending** | Status changes (via Webhook/API)     |
| Send DocSign Link SMS          | Manual Checkbox  | 🤖 Confirm Documentation   | Documentation Pending   |                                         |
| 🤖 Confirm Documentation       | Automatic Trigger | Assign to Class          | Documentation Pending   | Status stays (via Webhook/API)          |
| Assign to Class                | Manual Checkbox  | *null*                     | **Complete**            | Final state, Follow-up becomes null     |

## 3. Implementation Details

### Backend (Convex)

**A. Schema (`convex/schema.ts`)**
   - Modify `onboardingStatus` and `followUp` fields in the `clients` table:
     - Use `v.union` with `v.literal` based on `OnboardingStatusOptions` and `FollowUpOptions` arrays for type safety.
     - Make fields non-optional (`v.literal(...)` instead of `v.optional(v.literal(...))`). Default values will be set during client creation.
     - Example (`followUp`):
       ```typescript
       followUp: v.union(
         v.literal("Call Client for Onboarding"),
         v.literal("Send Valent Sign-Up SMS"),
         // ... other manual states
         v.literal("🤖 Confirm Payment"),
         v.literal("🤖 Confirm Documentation"),
         v.literal("Assign to Class"),
         v.null() // For completed state
       ),
       ```

**B. Mutations (`convex/clients.ts`)**
   - **Client Creation Logic** (Update webhook handler `src/api/wix-form-webhook.ts` or create a dedicated `createClient` mutation if needed):
     - Set default `onboardingStatus` to `"Initiation"`.
     - Set default `followUp` to `"Call Client for Onboarding"`.
   - **`completeManualFollowUp` Mutation:**
     - `args`: `{ clientId: v.id("clients") }`
     - `handler`:
       - Fetch the client: `ctx.db.get(args.clientId)`.
       - Check authorization (is the user allowed to do this?).
       - If client not found or no `followUp` state, return error.
       - Use a `switch` statement or a mapping based on the `client.followUp` value to determine `nextFollowUp` and `nextStatus` according to the Transition Table.
       - **Important:** Only allow transitions from *manual* follow-up states.
       - Patch the client: `ctx.db.patch(args.clientId, { followUp: nextFollowUp, onboardingStatus: nextStatus })`.
       - Return success/failure.
   - **`confirmAutomatedFollowUp` (or specific mutations e.g., `confirmPayment`) Mutation:**
     - `args`: `{ clientId: v.id("clients"), taskToConfirm: v.union(v.literal("🤖 Confirm Payment"), v.literal("🤖 Confirm Documentation")) }` (or separate mutations)
     - `handler`:
       - Fetch the client.
       - Validate: Check if `client.followUp` matches `args.taskToConfirm`.
       - If validation passes, determine `nextFollowUp` and `nextStatus` based on the Transition Table.
       - Patch the client.
       - Return success/failure.
       - **Note:** This mutation will be called by HTTP actions.

**C. HTTP Actions (`convex/http.ts`)**
   - Define `httpAction` endpoints for incoming webhooks (e.g., payment confirmation, document signing confirmation).
   - Examples:
     - `/webhooks/paymentConfirmation`: Handles POST requests, validates payload/signature, extracts relevant data (e.g., `clientId` or lookup key), calls `confirmAutomatedFollowUp` (or `confirmPayment`) mutation with `clientId` and `taskToConfirm: "🤖 Confirm Payment"`.
     - `/webhooks/documentConfirmation`: Similar logic for document signing, calling mutation with `taskToConfirm: "🤖 Confirm Documentation"`.
   - Ensure robust validation and security for webhook endpoints.

### Frontend (React/Shadcn - `src/components/clients/columns.tsx`)

**A. Column Definitions (`columns.tsx`)**
   - **Onboarding Status Column:**
     - Keep `accessorKey: "onboardingStatus"`.
     - `cell`: Display `row.original.onboardingStatus` as plain text (or use a Badge component for visual styling).
     - Remove the `StatusSelect` component usage for this column.
   - **Follow Up Column:**
     - `accessorKey: "followUp"`.
     - `cell`: Implement conditional rendering:
       - Get `currentFollowUp = row.original.followUp`.
       - Check if `currentFollowUp` starts with "🤖".
       - **If Automatic (`"🤖"`):**
         - Display `currentFollowUp` text with a loading indicator.
         - Do *not* render a Checkbox (or render a disabled one).
       - **If Manual (no `"🤖"`):**
         - Render a `div` containing:
           - An *unchecked* `Checkbox` component.
           - The `currentFollowUp` text next to it.
         - Get the `completeManualFollowUp` mutation using `useMutation(api.clients.completeManualFollowUp)`.
         - Add an `onCheckedChange` handler to the `Checkbox`:
           - Call `completeManualFollowUp({ clientId: row.original._id })`.
           - Handle loading state (e.g., disable checkbox during mutation).
           - Handle potential errors (e.g., show toast notification).
       - **If `null`:**
         - Display "Completed" or similar text.

**B. Data Table Component (`data-table.tsx` or parent)**
   - Ensure the table correctly refetches or updates data after mutations to reflect the changes immediately in the UI.

## 4. Key Considerations

- **Type Safety:** Strictly enforce states using `v.union(v.literal(...))` in Convex.
- **Error Handling:** Implement user feedback for errors during manual task completion and log errors for automatic processes.
- **Loading States:** Provide visual feedback in the UI when a manual task completion is processing.
- **Idempotency:** Design webhook handlers (`http.ts`) and the corresponding automatic confirmation mutations (`clients.ts`) to be idempotent.
- **Authorization:** Add checks in mutations to ensure the logged-in user has permission to perform actions.

## 5. Open Questions / Assumptions

- Is "Confirm Valent Signup" definitely a manual checkbox action, or should it be automated?
- Should the `onboardingStatus` change after "🤖 Confirm Documentation" completes, or only after "Assign to Class"? (Current plan: only after Assign to Class).

