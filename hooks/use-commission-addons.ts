import { MOCK_COMMISSION_ADDONS } from "@/lib/mock-data/commission-addons";
import { Database } from "@/lib/types/supabase";

export type CommissionAddon = Database['public']['Tables']['commission_addons']['Row'];


export function useCommissionAddons() {
    const commissionAddons: CommissionAddon[] = MOCK_COMMISSION_ADDONS;


    return { commissionAddons };
}