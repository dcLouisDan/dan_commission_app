import CommissionForm from "@/components/commission-form";
import { TypographyH1 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { useServerLocation } from "@/hooks/use-server-location";
import { Suspense } from "react";

export default async function NewCommissionPage() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <TypographyH1>New Commission</TypographyH1>
            <Separator />
            <Suspense>
                <CommissionForm />
            </Suspense>
        </div>
    );
}