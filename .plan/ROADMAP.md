# ROADMAP: Local-First MVP

## User Story
"As a PH-based Illustrator, I want a simple link to send to clients where they can request art and pay via GCash/Maya automatically."

## Phase 1: Core Commission Flow (The MVP)
**Goal:** Replace manual DM coordination and manual bank checking.

### Features
1. **Commission Form:**
   - Fields: Name, Email, Type (selection), Description, Price (Automatic or Manual Quote?). *Decision: Simple fixed tiers for MVP.*
2. **Payment Integration:**
   - Xendit Sandbox Invoice creation.
   - Redirect to Payment.
3. **Status Page:**
   - Client can see: "Pending Payment" -> "Paid (In Queue)".
4. **Admin View (Basic):**
   - Protected route for Artist.
   - List of Commissions.
   - Ability to mark "In Progress" or "Done".

### Tech Stack
- Next.js 14+ / 15
- Supabase (DB + Auth for Admin)
- Tailwind CSS (Styling)
- Xendit API (Payments)

## Phase 2: Asset Delivery & Enhancements
**Goal:** Deliver the artwork securely through the platform.

### Features
1. **Supabase Storage:**
   - Admin uploads watermarked sketch or final file.
   - Client downloads file from Status Page.
2. **Email Notifications:**
   - Send receipt email on success.
   - Send "Commission Accepted" email.
3. **Portfolio/Blog:**
   - Show off previous work to convert visitors.

## Phase 3: Business Logic
- Handling Refunds.
- Dynamic Pricing (Add-ons).
- Queue Limits (Close commissions automatically when full).
