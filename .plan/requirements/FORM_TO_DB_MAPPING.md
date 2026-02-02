# Form to Database Data Mapping

This document reconciles the User UX (`COMMISSION_FORM_CONTENT.md`) with the Database Schema (`SPEC.md`) and Pricing Logic (`PRICING_STRATEGY.md`).

## 1. High-Level Flow
`[Form Input]` -> `[Pricing Engine (Frontend)]` -> `[Supabase Insert]`

---

## 2. Field-by-Field Mapping

### A. Identity & Contact
| Form Input | DB Column (`commissions`) | Notes |
| :--- | :--- | :--- |
| **Name / Nickname** | `client_name` | Top-level column. |
| **Email Address** | `client_email` | Top-level column Used for Xendit invoicing. |
| **Preferred Socials** | `form_data->socials` | JSON object: `{ "platform": "Twitter", "handle": "@user" }` |

### B. Technical Specs (The Order)
| Form Input | DB Column | Logic / Pricing Rule |
| :--- | :--- | :--- |
| **Commission Type**<br>*(e.g., "Full Body")* | `tier_id` (FK)<br>`commission_type` (Snapshot) | **Base Price Source**.<br>Fetches price from `commission_tiers` table. |
| **Add-On: Background** | `form_data->selected_addons`<br>`total_price` | Adds fixed amount from `commission_addons` table (+₱1,500). |
| **Add-On: Extra Char** | `form_data->extras->extra_characters`<br>`total_price` | **Math**: `Base Price` * 0.75 per extra character.<br>Stored in JSON for reference. |
| **Add-On: Commercial** | `is_commercial`<br>`total_price` | **Math**: Multiplies `(Base + Addons)` by `system_settings.commercial_multiplier` (2.0x). |
| **Rush Order** | `priority_level` | Sets Enum to `'RUSH'`.<br>Price impact negotiated (custom quote) or fixed %? |
| **Intended Use** | `form_data->intended_use` | Text reference. |

### C. The Creative Brief (Vibe Check)
| Form Input | DB Column | Notes |
| :--- | :--- | :--- |
| **Character Name** | `form_data->character->name` | |
| **Reference Images** | `reference_images` | JSON Array of strings (URLs). |
| **Physical Desc** | `form_data->character->physical_desc` | |
| **Personality** | `form_data->character->personality` | |
| **Pose** | `form_data->character->pose` | |
| **Setting** | `form_data->character->setting` | |
| **Lighting** | `form_data->character->lighting` | |

---

## 3. Pricing Calculation Logic (Frontend)

The frontend `PricingCalculator` component will pull live data from:
1.  `commission_tiers` (for Base Price)
2.  `commission_addons` (for Fixed Extras)
3.  `system_settings` (for Multipliers & Tax)

**Formula:**
```typescript
const base = Tier.price;
const extraCharCost = (base * 0.75) * numExtraChars;
const addonsCost = SelectedAddons.reduce((sum, item) => sum + item.price, 0);

let subtotal = base + extraCharCost + addonsCost;

if (isCommercial) {
  subtotal = subtotal * SystemSettings.commercial_multiplier; // e.g., x2
}

const tax = subtotal * SystemSettings.tax_rate; // e.g., 0.08
const total = subtotal + tax; // Grand Total
```

---

## 4. Calculated Financial Storage
We store the **Result** of the calculation so the invoice is immutable, but we also save the **Formula** snapshot so we know *why*.

| DB Column | Value |
| :--- | :--- |
| `base_price` | `Tier.price` |
| `tax_amount` | Calculated Tax |
| `total_price` | Final Amount to Invoice |
| `form_data->financial_snapshot` | `{ "extra_char_fee": 1500, "addon_total": 500, "multiplier_applied": 2.0 }` |

---

## 5. Visual Summary of `form_data` JSON
```json
{
  "socials": {
    "platform": "Twitter",
    "handle": "@Dan_Art"
  },
  "character": {
    "name": "Eldric",
    "notes": "..."
  },
  "selected_addons": [
    { "id": "uuid-1", "title": "Complex BG", "price_at_booking": 1500 }
  ],
  "extras": {
    "extra_characters_count": 1,
    "extra_characters_cost": 2500
  },
  "intended_use": "Twitch Banner",
  "tos_agreed": true
}
```
