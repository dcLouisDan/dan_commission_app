# Admin Roles & Tasks

## Role Breakdown

### 1. The Artist (Creative)
**Focus:** Quality control, asset delivery, and maintaining the artistic standard.
*   **Goal:** Spend 90% of time drawing, 10% on admin.
*   **Mindset:** "Is this ready for the client?"

### 2. The Accountant (Financial)
**Focus:** Revenue tracking, tax compliance, and payment verification.
*   **Goal:** Ensure every peso is accounted for and taxes are prepared for BIR (Bureau of Internal Revenue).
*   **Mindset:** "Is the money safe and recorded?"

### 3. The Manager (Operational)
**Focus:** Client communication, queue management, and platform health.
*   **Goal:** Keep the queue moving and clients happy without getting overwhelmed.
*   **Mindset:** "What is blocking the workflow?"

---

## Task Breakdown

### Per-Transaction Tasks (The Workflow)
These tasks happen for *every* single commission.

1.  **Application Review (Manager):**
    *   Read client request.
    *   Check reference images.
    *   **Action:** Click "Approve" (sends quote) or "Reject" (sends polite decline).

2.  **Payment Verification (Accountant):**
    *   *Ideally automated via Webhook,* but manual fallback required.
    *   **Action:** Verify Xendit status matches Commission ID.

3.  **Work-In-Progress (WIP) Updates (Artist):**
    *   **Action:** Upload watermarked sketch/lineart to Client Portal.
    *   **Action:** Add notes/comments for client review.

4.  **Revision Handling (Manager/Artist):**
    *   **Action:** Mark commission status as "In Revision."
    *   **Action:** Review client feedback notes.

5.  **Final Delivery (Artist):**
    *   **Action:** Upload high-res files (non-watermarked) to secure storage.
    *   **Action:** Trigger "Commission Complete" status.

### Daily Tasks (The Routine - ~15 mins)
1.  **The "Command Center" Check (Manager):**
    *   Review "Urgent" alerts (e.g., invoices expiring in < 24 hrs).
    *   Check for new messages/applications.
2.  **Queue Update (Manager):**
    *   Ensure displayed "Queue Slots" on the public site matches reality.

### Weekly Tasks (The Review - ~1 hour)
1.  **Financial Reconciliation (Accountant):**
    *   Compare Xendit payouts with local bank account/GCash deposits.
    *   Log total PHP earnings for the week.
2.  **Content Updates (Manager/Artist):**
    *   Upload 1-2 completed (and approved for public) pieces to the Gallery.
    *   (Optional) Write a short blog post/devlog update.
3.  **Inventory Check (Manager):**
    *   Update pricing or close specific commission types if overwhelmed.
