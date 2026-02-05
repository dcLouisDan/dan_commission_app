import { MOCK_SYSTEM_SETTINGS } from "@/lib/mock-data/settings";
import type { Database } from "@/lib/types/supabase";

export type SystemSettings = Database["public"]["Tables"]["system_settings"]["Row"]

export default function useSystemSettings() {
    // Placeholder hook for Actual API call
    return { systemSettings: MOCK_SYSTEM_SETTINGS }
}