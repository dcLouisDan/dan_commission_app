import { TypographyH2 } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import tierListQueryOptions from "@/hooks/query-options/tier-list-query-options";
import TierList from "./components/tier-list";

export default async function CommissionTiersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(tierListQueryOptions());

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <TypographyH2>Commission Tiers</TypographyH2>
        <Link
          className={buttonVariants({ variant: "default" })}
          href="/admin/commission-tiers/new"
        >
          <Plus />
          New Commission Tier
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TierList />
      </HydrationBoundary>
    </div>
  );
}
