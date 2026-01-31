# Workflow Logic: Business Rule Enforcement

This document defines the functional logic bridging business rules to technical implementation.

## 1. Milestone Payments ("Kill Fee" Logic)

**Business Rule:** 50% downpayment is non-refundable. Work starts only after deposit.
**Implementation:**

1.  **Commission Request:**
    *   Client submits form.
    *   System calculates `total_price`.
    *   System creates Xendit Invoice for 50% of `total_price`.
    *   Record Status: `PENDING`, Payment Status: `UNPAID`.

2.  **Deposit Webhook (`invoice.paid`):**
    *   Verify `external_id` matches commission.
    *   Update `amount_paid` += Invoice Amount.
    *   Set `payment_status` = `DEPOSIT_PAID`.
    *   **Action:** Change `status` to `IN_PROGRESS`.
    *   **Action:** Send email notification to Artist ("New Commission Started") & Client ("Receipt - Deposit").

3.  **Final Completion:**
    *   Artist marks work as "Ready for Final".
    *   System creates Xendit Invoice for remaining `balance_due`.
    *   Record Status updates to `AWAITING_FINAL_PAYMENT`.

4.  **Final Webhook (`invoice.paid`):**
    *   Update `amount_paid` += Invoice Amount.
    *   Set `payment_status` = `FULLY_PAID`.
    *   **Action:** Unlock "Download High-Res" link.

## 2. Revision Logic Gate

**Business Rule:** 2 free rounds of revisions. Excessive revisions incur fees.
**Implementation:**

*   **Trigger:** Client clicks "Request Revision".
*   **Logic Check:**
    ```python
    if commission.revision_count < 2:
        commission.revision_count += 1
        commission.status = 'IN_REVISION'
        notify_artist("Revision Requested (Round X)")
    else:
        # Fee Required
        fee_amount = calculate_revision_fee() # e.g. 500 PHP
        invoice = xendit.create_invoice(fee_amount, description="Revision Fee")
        redirect_client_to(invoice.url)
        # Webhook will eventually trigger the actual status change
    ```

## 3. PH Tax Compliance (BIR)

**Business Rule:** Issue receipts and track income.
**Implementation:**

*   **Data Point:** `tax_amount` is calculated at `INSERT` time.
    *   Formula: `total_price * 0.08` (if 8% rate selected) or custom logic.
*   **Receipt Generation:**
    *   Upon **ANY** successful `invoice.paid` webhook (Deposit, Final, or Revision Fee).
    *   **Action:** Generate a PDF "Collection Receipt".
    *   **Content:** Client Name, Date, Amount Paid, Tax Withheld/Due.
    *   **Storage:** Save PDF to Supabase Storage `receipts/`.
    *   **Delivery:** Email PDF to Client.

## 4. Usage Rights (Commercial vs Personal)

**Business Rule:** Commercial use costs 2x base price.
**Implementation:**

*   **Intake Form:**
    *   Checkbox: "Is this for Commercial Use?" (`is_commercial`).
*   **Price Calculation:**
    ```javascript
    let multiplier = is_commercial ? 2.0 : 1.0;
    let total_price = (base_price * multiplier) + add_ons;
    ```
*   **Receipt/Terms:** The generated receipt and final email must explicitly state "Commercial Rights Granted" or "Personal Use Only" based on this boolean.

## 5. Secure File Delivery

**Business Rule:** High-res files protected until full payment.
**Implementation:**

*   **Storage:** Upload high-res final files to a `private` Supabase Storage bucket.
*   **Access Control:**
    *   Client Dashboard checks:
        ```javascript
        if (commission.balance_due <= 0 && commission.status == 'COMPLETED') {
            const url = supabase.storage
                .from('final_works')
                .createSignedUrl(path, 60 * 60); // 1 hour link
            show_download_button(url);
        } else {
            show_locked_icon("Pay remaining balance to unlock");
        }
        ```
