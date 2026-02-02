import { MOCK_TIER_LIST } from "@/lib/mock-data/tier-list";
import { rowsToSelectItems } from "@/lib/utils/row-utils";

export function useTierList() {
    const tierListOptions = rowsToSelectItems(MOCK_TIER_LIST, "id", "category", (tier) => tier.category! + " - " + tier.variant!)

    return { tiers: MOCK_TIER_LIST, tierListOptions }
}