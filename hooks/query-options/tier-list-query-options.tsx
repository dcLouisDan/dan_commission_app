import { getCommissionTiersAction } from "@/actions/commission-tier-actions";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "./query-keys";

export default function tierListQueryOptions() {
  return queryOptions({
    queryKey: [QUERY_KEYS.COMMISSION_TIERS],
    queryFn: async () => {
      const response = await getCommissionTiersAction();
      if (!response.ok) {
        return [];
      } else {
        return response.data ?? [];
      }
    },
    initialData: [],
    refetchOnWindowFocus: false,
  });
}
