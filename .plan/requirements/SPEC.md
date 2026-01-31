# SPEC: Database Schema

## Overview
The application uses Supabase (PostgreSQL) as the primary data store.

## Tables

### 1. `commissions`
The core table storing commission requests and life-cycle data.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `created_at` | `timestamptz` | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | `now()` | Last update timestamp |
| `client_name` | `text` | - | Client's display name |
| `client_email` | `text` | - | Contact email |
| `commission_type` | `text` | - | Tier (e.g., "Bust", "Full Body") |
| `details` | `text` | - | Request details/brief |
| `reference_images` | `jsonb` | `[]` | Array of image URLs |
| `is_commercial` | `boolean` | `false` | Commercial rights flag |
| `priority_level` | `text` | `'STANDARD'` | 'STANDARD', 'RUSH', 'VIP' |
| `internal_notes` | `text` | - | Private artist notes (hidden from client) |
| **Financials** | | | |
| `base_price` | `numeric` | - | Starting price |
| `total_price` | `numeric` | - | Final agreed price |
| `amount_paid` | `numeric` | 0 | Total received |
| `balance_due` | `numeric` | `generated` | `total_price - amount_paid` |
| `tax_amount` | `numeric` | 0 | BIR Tax expected |
| `xendit_fee` | `numeric` | 0 | Transaction fees deducted |
| `net_earnings_php`| `numeric` | 0 | `amount_paid - xendit_fee` |
| `or_number` | `text` | - | Physical Official Receipt number |
| **Workflow** | | | |
| `revision_count` | `integer` | 0 | Revisions used |
| `status` | `commission_status` | `'PENDING'` | Workflow state |
| `payment_status` | `payment_status_enum` | `'UNPAID'` | financial state |
| `portal_slug` | `uuid` | `uuid_generate_v4()` | Secret client access key |
| `portal_accessed_at`| `timestamptz` | - | Last client visit |
| `external_id` | `text` | - | Xendit Invoice ID |
| `payment_url` | `text` | - | Active Xendit Link |

### 2. `portfolio_items` (CMS)
Showcase of completed works.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `title` | `text` | - | Artwork title |
| `image_url` | `text` | - | Main display image |
| `description` | `text` | - | Public description |
| `tags` | `text[]` | `[]` | Categories (e.g. "Fantasy", "Client Work") |
| `is_featured` | `boolean` | `false` | Show on Homepage? |
| `published_at` | `timestamptz` | - | If null, it's a draft |
| `created_at` | `timestamptz` | `now()` | - |

### 3. `posts` (CMS)
Blog/Devlog updates.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `slug` | `text` | - | URL friendly ID |
| `title` | `text` | - | Post title |
| `content` | `text` | - | Markdown content |
| `excerpt` | `text` | - | Short summary |
| `cover_image` | `text` | - | Optional header image |
| `is_published` | `boolean` | `false` | Draft status |
| `published_at` | `timestamptz` | - | Public date |

### 4. `activity_logs`
Audit trail for changes.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `commission_id` | `uuid` | - | Reference to Commission |
| `actor` | `text` | `'SYSTEM'` | Who made the change? (Admin/Client/System) |
| `action` | `text` | - | e.g. "STATUS_CHANGE", "PAYMENT_RECEIVED" |
| `details` | `jsonb` | - | e.g. `{ "old": "PENDING", "new": "IN_PROGRESS" }` |
| `created_at` | `timestamptz` | `now()` | - |

### 5. `webhooks_log`
(Retained from previous spec)

---

## Enums
**`commission_status`**
- `PENDING`
- `IN_PROGRESS`
- `IN_REVISION`
- `AWAITING_FINAL_PAYMENT`
- `COMPLETED`
- `EXPIRED`
- `REFUNDED`
- `REJECTED`

**`payment_status_enum`**
- `UNPAID`
- `DEPOSIT_PAID`
- `FULLY_PAID`

## RLS Policies

### `commissions`
*   **Admin:** `ALL` rights (SELECT, INSERT, UPDATE, DELETE).
*   **Public:** `INSERT` only (Requests).
*   **Public:** `SELECT` where `portal_slug` = input_slug (via Function or View to prevent table scanning, or rely on UUID unguessability for MVP).
    *   *Constraint:* Clients cannot UPDATE anything.

### `portfolio_items` & `posts`
*   **Admin:** `ALL` rights.
*   **Public:** `SELECT` where `published_at` is not null.

### `activity_logs` & `webhooks_log`
*   **Admin:** `SELECT` only. 
*   **System:** `INSERT` (via Service Key).
*   **Public:** No access.
