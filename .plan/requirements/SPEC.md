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
| `commission_type` | `text` | - | Snapshot of Tier Name (e.g. "Bust") |
| `tier_id` | `uuid` | - | Link to `commission_tiers` (optional) |
| `form_data` | `jsonb` | `{}` | Full intake form responses (Socials, Character, Addons) |
| `reference_images` | `jsonb` | `[]` | Array of image URLs |
| `is_commercial` | `boolean` | `false` | Commercial rights flag |
| `priority_level` | `priority_level_enum` | `'STANDARD'` | Priority status |
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

### 2. `commission_tiers` (Inventory - Services)
Manageable list of offered services (SKUs).

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `category` | `text` | - | Style grouping (e.g. "Flat Color") |
| `variant` | `text` | - | Scale/Size (e.g. "Headshot") |
| `price_php` | `numeric` | 0 | Local Price |
| `price_usd` | `numeric` | 0 | International Price |
| `description` | `text` | - | Short blurb for form |
| `is_active` | `boolean` | `true` | Open/Closed status |
| `slot_limit` | `integer` | 10 | Max active orders allowed |
| `thumbnail_url` | `text` | - | Icon/Example image |

### 3. `commission_addons` (Inventory - Extras)
Manageable list of add-ons.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `uuid_generate_v4()` | Primary Key |
| `title` | `text` | - | Display Name (e.g. "Complex bg") |
| `description` | `text` | - | Details |
| `price` | `numeric` | 0 | Price increase |
| `is_active` | `boolean` | `true` | Show in form? |

### 4. `system_settings` (Config)
Global configuration for fees and calculations. Single row enforced.

| Column | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | 1 | Singleton ID |
| `tax_rate` | `numeric` | 0.08 | Default BIR Tax Rate (8%) |
| `xendit_fee_percent`| `numeric` | 0.0 | Xendit % Fee (e.g. 0.02 for 2%) |
| `xendit_fee_fixed` | `numeric` | 0.0 | Xendit Fixed Fee (e.g. 15 PHP) |
| `commercial_multiplier`| `numeric`| 2.0 | Multiplier for commercial works |
| `rush_multiplier` | `numeric` | 0.5 | Multiplier for rush orders |
| `extra_character_multiplier`| `numeric`| 0.75 | Multiplier for extra characters |
| `updated_at` | `timestamptz` | `now()` | - |

### 5. `portfolio_items` (CMS)
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

### 6. `posts` (CMS)
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

### 7. `activity_logs` & `webhooks_log`
(See existing schema)

---

## Enums
**`priority_level_enum`**
- `STANDARD`
- `RUSH`
- `VIP`

(See existing enums)

## RLS Policies

### `commissions`
*   **Admin:** `ALL` rights.
*   **Public:** `INSERT` only.

### `commission_tiers` & `commission_addons`
*   **Admin:** `ALL` rights.
*   **Public:** `SELECT` where `is_active` = true.

### `system_settings`
*   **Admin:** `ALL` rights.
*   **Public:** `SELECT` only.
