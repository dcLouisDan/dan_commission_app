import { Database } from "../types/supabase";

export const MOCK_COMMISSION_ADDONS: Database['public']['Tables']['commission_addons']['Row'][] = [
    {
        id: "addon-simple-background",
        title: "Simple Background",
        description: "Adds a simple background to the artwork. (e.g., solid color, gradient)",
        price_php: 500,
        price_usd: 15,
        is_active: true,
        created_at: "2026-02-03T05:48:25.123Z",
    },
    {
        id: "addon-complex-background",
        title: "Complex Background",
        description: "Adds a more detailed background to the artwork. (e.g., complex environment, detailed setting)",
        price_php: 1000,
        price_usd: 30,
        is_active: true,
        created_at: "2026-02-03T05:48:25.123Z",
    },
]