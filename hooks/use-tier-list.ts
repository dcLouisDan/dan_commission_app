import { CommissionTier } from "@/lib/types/commission-tier";
import { rowsToSelectItems } from "@/lib/utils/row-utils";
import { useQuery } from "@tanstack/react-query";
import tierListQueryOptions from "./query-options/tier-list-query-options";

export function useTierList() {
  const { data: tiers, isLoading } = useQuery(tierListQueryOptions());

  const tierListOptions = rowsToSelectItems(
    tiers,
    "id",
    "category",
    (tier) => tier.category! + " - " + tier.variant!,
  );
  const tierListMap = new Map<string, CommissionTier>(
    tiers.map((tier) => [tier.id, tier]),
  );

  return { tiers, tierListOptions, tierListMap, isLoading };
}
