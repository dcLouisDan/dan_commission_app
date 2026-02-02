import { Database } from "../types/supabase";

export const MOCK_COMMISSION_ADDONS: Database['public']['Tables']['commission_addons']['Row'][] = [
    {
        id: "addon-simple-background",
        title: "Simple Background",
        description: "Adds a simple background to the artwork.",
        price: 500,
        is_active: true,
        created_at: "2026-02-03T05:48:25.123Z",
    },
    {
        id: "addon-complex-background",
        title: "Complex Background",
        description: "Adds a complex background to the artwork.",
        price: 1000,
        is_active: true,
        created_at: "2026-02-03T05:48:25.123Z",
    },
]