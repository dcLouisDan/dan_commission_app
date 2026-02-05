import { MOCK_TIER_LIST } from "@/lib/mock-data/tier-list";
import { Database } from "@/lib/types/supabase";
import { rowsToSelectItems } from "@/lib/utils/row-utils";

export type CommissionTier = Database['public']['Tables']['commission_tiers']['Row']

export function useTierList() {
    const tierListOptions = rowsToSelectItems(MOCK_TIER_LIST, "id", "category", (tier) => tier.category! + " - " + tier.variant!)
    const tierListMap = new Map<string, CommissionTier>(MOCK_TIER_LIST.map((tier) => [tier.id, tier]))

    return { tiers: MOCK_TIER_LIST, tierListOptions, tierListMap }
}