import { MOCK_TIER_LIST } from "@/lib/mock-data/tier-list";
import { CommissionTier } from "@/lib/types/commission-tier";
import { rowsToSelectItems } from "@/lib/utils/row-utils";


export function useTierList() {
    const tierListOptions = rowsToSelectItems(MOCK_TIER_LIST, "id", "category", (tier) => tier.category! + " - " + tier.variant!)
    const tierListMap = new Map<string, CommissionTier>(MOCK_TIER_LIST.map((tier) => [tier.id, tier]))

    return { tiers: MOCK_TIER_LIST, tierListOptions, tierListMap }
}