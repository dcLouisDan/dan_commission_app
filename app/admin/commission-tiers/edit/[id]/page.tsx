import CommissionTierForm from "@/components/commission-tier/commission-tier-form";
import { TypographyH1 } from "@/components/typography";
import { Separator } from "@/components/ui/separator";

export default async function EditCommissionTierPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <TypographyH1>Edit Commission Tier</TypographyH1>
      <Separator />
      <CommissionTierForm intent="update" />
    </div>
  );
}
