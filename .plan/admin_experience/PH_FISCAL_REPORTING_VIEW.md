# PH Fiscal Reporting View

## Context
Philippine Freelancers need to file quarterly percentage tax (usually 8% Gross Receipt Tax if opted-in). This view simplifies that headache.

## 1. The "Tax-Ready" Summary
**Scope:** Quarterly View (Q1: Jan-Mar, Q2: Apr-Jun, etc.)

### A. Gross Receipts (Taxable Income)
*   **Definition:** Total money *received* from clients (converted to PHP) *before* expenses.
*   **Display:** Big bold number: `₱ XX,XXX.XX`
*   **Source:** Sum of all 'PAID' invoices in the date range.

### B. Deductions & Fees (Expense Tracking)
*   **Xendit Fees:** Auto-sum of transaction fees deducted by payment processor.
*   **Platform Costs:** (Manual Entry or fixed cost) Hosting, Domain.
*   **Net Income:** `Gross Receipts - Fees - Costs`.

### C. BIR 8% Tax Estimator
*   **Logic:** `(Gross Receipts - 250,000)* * 8%` (Note: The 250k deduction applies annually, so the logic needs to track YTD).
*   **Display:** "Estimated Tax Due: ₱ XXX.XX"
    *   *Disclaimer: "This is an estimate. Consult an accountant."*

## 2. Export Data
*   **CSV Export:**
    *   Columns: Date, OR Number (Invoice ID), Client Name, Gross Amount (PHP), Fee (PHP), Net (PHP).
    *   **Purpose:** Copy-paste into eBIRForms or send to accountant.

## 3. Invoice Generation for BIR
*   **Official Receipt (OR) Helper:**
    *   Since Xendit provides a tech invoice, the Admin may need to write a physical OR.
    *   **View:** List of transactions strictly for OR writing.
    *   **Action:** "Mark OR as Written" (checkbox) to keep track of paperwork.

*(Note: Depending on registration type, the 250k deduction logic might vary. The system should allow a toggle: "Apply 250k deduction?" defaulting to Yes for non-VAT freelancers).*
