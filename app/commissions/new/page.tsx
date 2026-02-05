import CommissionForm from "@/components/commision-form";
import { TypographyH1 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";
import { useServerLocation } from "@/hooks/use-server-location";

export default async function NewCommissionPage() {
    const location = useServerLocation();
    return (
        <div className="flex flex-col gap-4 w-full">
            <TypographyH1>New Commission</TypographyH1>
            <Separator />
            <CommissionForm location={location} />
        </div>
    );
}