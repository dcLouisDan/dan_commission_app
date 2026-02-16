# Task Log

## Active Tasks
- [x] Initial Project Component & Plan Review
- [x] Initialize Next.js with Supabase Template

## Active Tasks (Phase 1: Core Commission Flow)
- [x] **Infrastructure & Database**
    - [x] Connect Supabase Project (Env Vars)
    - [x] Run `schema.sql` migration in Supabase
    - [x] Verify Auth (Login/Signup) working locally
- [x] **Cleanup & Layout**
    - [x] Clean up default template (audit `app/page.tsx`, components)
    - [x] Setup global layout / theme (Fonts, Colors from Design System)
- [x] **Feature: Commission Form**
    - [x] Create "Request Commission" page & modular form
    - [x] Implement Server Actions & Service layer
    - [x] Integrate Database Insert & Storage uploads
    - [ ] Integration: Fetch live Tiers from DB (Replace Mock Data)
    - [ ] Integration: Fetch live Addons from DB (Replace Mock Data)

## Active Tasks (Phase 1: Admin & Workflow Operations)
- [ ] **Admin Command Center (Primary Focus)**
    - [ ] Create Commissions Dashboard (Overview of all requests)
    - [ ] Create Inventory Management: Commission Tiers editor
    - [ ] Create Inventory Management: Commission Addons editor
    - [ ] Implement detailed Commission View (Review character briefs & images)
    - [ ] Add "Accept/Reject" logic (Acceptance triggers next workflow)
    - [ ] Add "Status Management" (Pending -> Accepted -> Deposit Paid -> In Progress)
- [ ] **Asset Management & Delivery**
    - [ ] Create "Asset Upload" page for Admin
    - [ ] Setup "Artifacts" table/storage for final high-res delivery
    - [ ] Implement secure download logic for clients (Post-Final Payment)

## Active Tasks (Phase 2: Payments & Notifications)
- [ ] **Refined Payment Flow (Xendit)**
    - [ ] Core: Generate Xendit Invoice *only* upon Admin Approval
    - [ ] Setup Webhook listener for "Paid" status sync
    - [ ] Refund/Cancel logic
- [ ] **Communication & Verification**
    - [ ] Implement Email Receipt system (resend-based or similar)
    - [ ] Add Email Verification for new clients (Magic Link or OTP)
    - [ ] Automatic status update notifications (e.g., "Your commission was accepted!")

## Completed Tasks
