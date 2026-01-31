# Client Portal Specification

## Overview
The Client Portal is a secure, passwordless interface for clients to track their commission status, review artwork, and make payments.

## 1. Authentication Strategy
**Method:** "Magic Link" / UUID Route.
- **Mechanism:** Each commission record has a unique `portal_slug` (UUID).
- **Access URL:** `https://app.domain.com/portal/[portal_slug]`
- **Security:**
    - The `portal_slug` acts as the secret key.
    - No user account creation required.
    - Rate-limiting applied to prevent brute-force guessing (though UUID entropy is high).

## 2. State Visualization
**Requirement:** Real-time reflection of the `status` column.
- **UI Component:** "Status Stepper" or "Progress Bar".
- **States Mapped:**
    1.  **Request Received** (`PENDING`) - *Waiting for Deposit*
    2.  **In Progress** (`IN_PROGRESS`) - *Artist is working*
    3.  **Review** (`IN_REVISION`) - *Awaiting execution of changes*
    4.  **Completed** (`COMPLETED`) - *Final files locked pending balance*
    5.  **Delivered** (`COMPLETED` & `balance_due == 0`) - *Files unlocked*

## 3. Feedback Loop (Reference Gallery)
**Requirement:** Visual history of approved/current work.
- **Section:** "Current Preview".
- **Logic:**
    - Artist uploads low-res/watermarked previews to a specific bucket path linked to the commission ID.
    - Portal fetches the *latest* file from this path.
    - Client sees the art evolving.
    - **Note:** Communication remains email-based for detailed feedback strings, but the portal shows *what* is being discussed.

## 4. Xendit Integration (Dynamic Payments)
**Requirement:** "Pay Now" button functionality.
- **Visibility Condition:**
    - Show if `payment_status` is `UNPAID` (Deposit) OR (`COMPLETED` AND `balance_due > 0`) (Final).
    - Hide if `payment_status` is `FULLY_PAID`.
- **Button Action (Server Action):**
    - `onClick` -> Server Action `createXenditInvoice(commissionId, amount)`.
    - Returns: Xendit Invoice URL.
    - Redirects client to Xendit.

## 5. File Protection & Delivery
**Requirement:** Secure delivery of high-res assets.
- **Condition:** `balance_due == 0` AND (`status` == 'COMPLETED' or 'PAID').
- **Implementation:**
    - Files stored in Supabase Storage `private` bucket (`final_works/`).
    - **Server-Side Generation:**
        - When portal loads, check database balance.
        - If cleared, generate Supabase Signed URL (expires in 15 mins).
        - Render "Download High-Res Pack" button with this ephemeral URL.
    - **Security:** If a user copies the link, it dies in 15 mins. If they share the portal URL, others can see it but only valid if balance is paid.
