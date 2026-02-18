import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTierList } from "@/hooks/use-tier-list";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import ImageWithPreview from "@/components/image-with-preview";
import { useServerLocation } from "@/hooks/use-server-location";
import { CommissionTier } from "@/lib/types/commission-tier";

export default function CommissionTierGrid({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const { tiers } = useTierList()
    return (
        <div className="border rounded-md p-2 bg-card grid-cols-2">
            <RadioGroup value={value ?? ""} onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {tiers.map((tier) => (
                    <TierCard
                        key={tier.id}
                        tier={tier}
                    />
                ))}
            </RadioGroup>
        </div>
    );
}

function TierCard({
    tier,
}: {
    tier: CommissionTier;
}) {
    const { isPH } = useServerLocation()
    const price = isPH ? "₱" + tier.price_php : "$" + tier.price_usd
    return (
        <FieldLabel htmlFor={tier.id} className="bg-background cursor-pointer" title="Select tier">
            <Field orientation="horizontal">
                <ImageWithPreview src={tier.thumbnail_url ?? ""} alt={tier.category ?? ""} previewClassName="w-24 h-24" />
                <FieldContent className="gap-1">
                    <FieldTitle>{tier.category} - {tier.variant}</FieldTitle>
                    <p className="text-sm font-semibold text-primary">Base Price: {price}</p>
                    <FieldDescription>{tier.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem id={tier.id} value={tier.id} />
            </Field>
        </FieldLabel>
    );
}