import { CommissionTier } from "@/lib/types/commission-tier";
import { rowsToSelectItems } from "@/lib/utils/row-utils";
import { getCommissionTiersAction } from "@/actions/commission-tier-actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useTierList() {
    const [tiers, setTiers] = useState<CommissionTier[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTiers() {
            try {
                const response = await getCommissionTiersAction();
                if (!response.ok) {
                    toast.error(response.error?.raw?.message ?? "Failed to fetch commission tiers");
                } else if (response.data) {
                    setTiers(response.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("An unexpected error occurred while fetching commission tiers");
            } finally {
                setIsLoading(false);
            }
        }

        fetchTiers();
    }, []);

    const tierListOptions = rowsToSelectItems(tiers, "id", "category", (tier) => tier.category! + " - " + tier.variant!);
    const tierListMap = new Map<string, CommissionTier>(tiers.map((tier) => [tier.id, tier]));

    return { tiers, tierListOptions, tierListMap, isLoading };
}