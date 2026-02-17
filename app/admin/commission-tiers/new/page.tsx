import CommissionTierForm from "@/components/commission-tier/commission-tier-form";
import { TypographyH2 } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCommissionTierPage() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Link href="/admin/commission-tiers" className={cn(buttonVariants({ variant: "link" }), "mr-auto px-0")}>
                <ArrowLeft />Back to Commission Tiers
            </Link>
            <div className="flex items-center justify-between">
                <TypographyH2>New Commission Tier</TypographyH2>
            </div>
            <CommissionTierForm />
        </div>
    )
}