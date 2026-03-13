import { getCommissionTierByIdAction } from "@/actions/commission-tier-actions";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";

export default function tierQueryOptions(id: string) {
  return queryOptions({
    queryKey: [QUERY_KEYS.COMMISSION_TIERS, id],
    queryFn: async () => {
      const response = await getCommissionTierByIdAction(id);
      if (!response.ok) {
        return null;
      } else {
        return response.data;
      }
    },
    initialData: null,
    refetchOnWindowFocus: false,
  });
}
