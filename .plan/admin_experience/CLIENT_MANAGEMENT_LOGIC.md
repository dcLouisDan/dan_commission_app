# Client Management Logic (Single Commission View)

## Context
This view appears when the Admin clicks on a specific Commission ID. It is the "Cockpit" for that specific job.

## 1. Application Phase Actions
*   **Applicant Details:** Show Name, Email, Socials.
*   **Request Brief:** Show Description and References Breakdown.
*   **Action: Approve Application:**
    *   **Input:** Confirm "Quoted Price" and "Estimated Timeline" (pre-filled from Tier defaults, editable).
    *   **Trigger:** Sends "Commission Accepted" email to client with Invoice Link.
    *   **System:** Generates Xendit Invoice via API.
*   **Action: Reject Application:**
    *   **Input:** Select reason (Optional: "Slots Full", "Not my style", "Other").
    *   **Trigger:** Sends polite rejection email.

## 2. Active Phase Actions (The Workspace)
*   **Status Control:** Dropdown to change status manually (To Do -> Sketching -> Review -> Finalizing).
*   **Financial Actions:**
    *   **Button: "Generate Xendit Invoice"** (If not already generated or if extra fee added).
    *   **Manual Override:** "Mark as Paid" (For outliers/manual bank transfers).
*   **Reference Gallery:**
    *   A sticky sidebar showing the client's uploaded reference images for easy viewing while working (if looking at admin panel on second monitor).

## 3. Delivery Phase Actions
*   **WIP Uploader:**
    *   Upload file -> Notify Client -> Status updates to "Pending Review".
*   **Final Delivery Uploader (Critical):**
    *   **Input:** Multi-file uploader.
    *   **Security:** Files are stored in a restricted bucket.
    *   **Trigger:**
        1.  System checks if **Balance == 0**.
        2.  **If Paid:** Sends email with secure expiring download link to client.
        3.  **If Unpaid:** Locks files, notifies client to pay balance to unlock.

## 4. Archive/History
*   **Activity Log:** Timeline of all status changes, uploads, and emails sent for this commission (Audit Trail).
