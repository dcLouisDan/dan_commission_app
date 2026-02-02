import { Database } from "../types/supabase";

export const MOCK_SYSTEM_SETTINGS: Database["public"]["Tables"]["system_settings"]["Row"] = {
    id: 1,
    commercial_multiplier: 1.5,
    tax_rate: 0.8,
    xendit_fee_fixed: 5,
    xendit_fee_percent: 0.02,
    rush_multiplier: 0.5,
    extra_character_multiplier: 0.75,
    updated_at: "2026-02-03T05:35:54.123Z",
}