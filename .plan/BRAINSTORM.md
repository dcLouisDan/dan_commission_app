# BRAINSTORM: Payment Integration Strategy

## Xendit Invoices vs. Xendit Direct APIs

### 1. Xendit Invoices (Hosted Checkout)
**Pros:**
- **Speed to Production:** Easiest way to accept payments. Pre-built UI.
- **Maintenance:** Xendit handles the UI updates for new payment channels.
- **Features:** Built-in email notifications, expiry reminders, and multi-channel support (GCash, Maya, Cards, Banks) out of the box.
- **Security:** Reduced scope; we don't handle sensitive inputs directly.

**Cons:**
- **UX Friction:** Redirects user away from the commission app to Xendit's domain.
- **Customization:** Limited branding control on the invoice page.

### 2. Xendit Direct APIs (Core API / Joy UI)
**Pros:**
- **Seamless UX:** User stays on our site (or appears to).
- **Control:** Full control over the checkout flow and UI.

**Cons:**
- **Complexity:** Requires building the frontend payment selection and handling various response types.
- **Maintenance:** Need to update code if Xendit changes API or adds channels.

### Recommendation for MVP
**Winner: Xendit Invoices (via API creation).**
Since the goal is a "Personal Art Commission Platform" with a "Local-First MVP", the hosted invoice reduces dev time significantly while supporting all local options (GCash, Maya, BPI, UBP) immediately. We can generate an Invoice URL via API after the commission form is submitted and redirect the user.

---

## PH E-Wallet Flow (GCash/Maya) & Local Banks

### The Happy Path
1. **Intake:** User fills out Commission Form (Next.js).
2. **Submission:** Data saved to Supabase (`status: PENDING`).
3. **Invoice Generation:** Server-side call to Xendit API to create an Invoice.
   - `external_id` = Commission ID.
   - `amount` = Calculated price.
   - `success_redirect_url` = Commission Status Page.
4. **Payment:** User is redirected to Xendit Invoice URL.
5. **Action:** User selects GCash/Maya, authenticates, and pays.
6. **Redirect:** User sent back to Commission Status Page.
7. **Confirmation:** Xendit sends a **Webhook** to our Next.js Edge Route.
8. **Update:** Webhook handler verifies `x-callback-token`, finds commission by `external_id`, and updates `status` to `PAID`.
9. **Real-time:** Supabase Realtime (or SWR revalidation) updates the Status Page UI to show "Paid".

### Handling "Pending" States
- **Initial State:** Created as `PENDING`.
- **User Abandonment:** If user closes the tab at Xendit, status remains `PENDING`.
- **Expiry:** Xendit Invoices have an expiry. When expired, Xendit sends a webhook (`INVOICE_EXPIRED`). We update DB to `EXPIRED`.
- **User Recovery:** If user returns to the Status Page and it is `PENDING` (and not expired), we show the "Pay Now" button (link to existing Invoice URL).

---

## Backend Strategy: Next.js vs. Dedicated Server

### 1. Dedicated Backend (Express/Go/Python)
**Pros:**
- **Separation of Concerns:** Clear boundary between frontend and business logic.
- **Long-running Jobs:** Better for tasks that take minutes/hours (e.g., video processing).
- **Portability:** Easier to switch frontends later (e.g., moving to a mobile app).

**Cons:**
- **Overhead:** Maintaining two deployments, two repos, and CORS issues.
- **Cost:** Likely need a VPS or separate container instance (e.g., Railway/Render) which might cost more than a serverless function tier.
- **Latency:** Extra hop from Frontend -> Backend -> DB compared to Next.js Server Components -> DB.

### 2. Next.js (App Router + Server Actions/Route Handlers)
**Pros:**
- **Simplicity:** Single codebase, single deployment (Vercel).
- **Serverless:** Scales inevitably; "Edge" capabilities for webhooks (lower latency).
- **Direct DB Access:** Server Components can query Supabase directly effectively.
- **Cost:** Free tier on Vercel is generous for this scale.

### Recommendation
**Winner: Next.js Monolith.**
For a "Personal Art Commission Platform," the scale is low-volume, high-value. We don't have complex long-running background jobs (yet).
- **Webhooks:** Next.js Route Handlers (`app/api/webhooks/...`) are perfect for this.
- **DB Operations:** Server Actions are secure and sufficient for CRUD.
- **Conclusion:** A separate backend is over-engineering for this phase. We will use Next.js logic + Supabase.

## Architecture Consideration
- **Webhook-First:** The source of truth for "Paid" status is the Webhook, not the frontend redirect. The frontend should poll or listen to the DB status after redirecting back.

---

## File Tracking & Edge Functions Plan

### 1. Unified File Tracking
Instead of storing raw URLs everywhere, we will use a `files` table to track Storage assets.
- **Why?** Allows us to manage lifecycle (delete from storage when record is deleted), track disk usage, and attach metadata.
- **Polymorphic Relations:** The `file_relations` table (Pivot) allows a single file to be reused (e.g., a "Terms of Service" PDF linked to multiple commissions) or multiple files for one record (e.g., multiple "Reference Images" for one commission).
- **Flexibility:** Existing tables like `commissions` can keep their `reference_images` (JSONB) or `thumbnail_url` for external links, but we can *also* link them via the pivot table for internal storage tracking.

### 2. Edge Functions Strategy
- **Image Optimization:** Trigger an Edge Function on `files` insert to generate thumbnails or watermark delivery files.
- **Security:** Use Edge Functions to generate signed URLs for private files (e.g. `commissions/delivery/`) only when requested by the authorized portal.
- **Cleanup:** Trigger an Edge Function to delete physical files from Supabase Storage when a `files` record is deleted.

### Action Plan
1. **Migration:** Create `files` and `file_relations` tables.
2. **Repository:** Update `StorageRepo` to also insert into `files` table upon successful Supabase Storage upload.
3. **Logic:** Implement a `LinkFile` service that manages the `file_relations` entries.
