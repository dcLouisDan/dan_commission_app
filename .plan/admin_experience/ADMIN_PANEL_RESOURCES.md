# Admin Panel Resources & Views

## 1. The Command Center (Dashboard)
**Purpose:** Immediate situational awareness. "What needs my attention *now*?"
*   **Metrics Bar:**
    *   **Active Commissions:** (Count)
    *   **Pending Applications:** (Count)
    *   **Monthly Revenue (Est.):** (PHP Value)
*   **Urgent Alerts Feed:**
    *   Unpaid invoices expring in < 24 hours.
    *   Commissions approaching deadline (Yellow warning).
    *   New client messages/feedback received.

## 2. Commission Manager
**Purpose:** The central database view for all works.
*   **View Type:** List/Table View.
*   **Columns:** ID, Client Name, Type, Status label, Payment Status, Progress Bar, Due Date.
*   **Filters:**
    *   **Status:** (Pending, In Progress, Review, Done, Cancelled)
    *   **Payment:** (Paid, Unpaid, Partial)
    *   **Date:** (Newest First)
*   **Quick Actions:**
    *   Hover on row -> "Quick View" (Modal).
    *   "Copy Email" button.

## 3. Inventory & Tier Editor
**Purpose:** Managing the "Product" without code edits.
*   **Tier List:**
    *   Display all available commission types (e.g., "Headshot", "Full Body").
*   **Controls:**
    *   **Price Input:** Update base price (support for USD/PHP toggle or auto-conversion display).
    *   **Status Toggle:** "Open" / "Closed" (Immediately updates public form).
    *   **Slot Limit:** Set max number of concurrently active commissions per type.

## 4. Gallery & Blog CMS
**Purpose:** Marketing and Portfolio management.
*   **Gallery Upload:**
    *   Drag-and-drop image upload.
    *   Fields: Title, Description, Tags (e.g., "Fanart", "OC"), Commission Type link.
    *   *Auto-Watermark Option:* Toggle to apply default watermark overlay.
*   **Blog/Updates:**
    *   Simple Markdown Editor.
    *   "Post to Public News" button.
