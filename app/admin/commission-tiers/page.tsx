import { TypographyH2 } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CommissionTiersPage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <TypographyH2>Commission Tiers</TypographyH2>
                <Link className={buttonVariants({ variant: "default" })} href="/admin/commission-tiers/new">
                    <Plus />New Commission Tier
                </Link>
            </div>
        </div>
    )
}