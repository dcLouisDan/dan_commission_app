
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import BasicSelect from "@/components/basic-select";
import { Controller, useFormContext } from "react-hook-form";
import type { FormInput, FormOutput } from "@/lib/validations/commission";
import { useTierList } from "@/hooks/use-tier-list";
import { CommissionAddon, useCommissionAddons } from "@/hooks/use-commission-addons";
import { FIELD_PLACEHOLDERS } from "@/lib/constants/commision-form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import useSystemSettings from "@/hooks/use-system-settings";
import { useMemo } from "react";

export default function CommissionSpecsSection() {
    const form = useFormContext<FormInput>()
    const { tierListOptions, tierListMap } = useTierList()
    const { commissionAddons } = useCommissionAddons()
    const { systemSettings } = useSystemSettings()
    const isAddonSelected = (addonId: string, values?: CommissionAddon[]) => {
        if (!values) return false
        return values.some((addon) => addon.id === addonId)
    }

    const handleAddonChange = (addon: CommissionAddon, value: boolean, currentAddons?: FormOutput["other_addons"]) => {
        if (!currentAddons) return
        if (value) {
            form.setValue("other_addons", [...currentAddons, addon] as FormOutput["other_addons"])
        } else {
            form.setValue("other_addons", currentAddons.filter((item) => item.id !== addon.id))
        }
    }
    const hasBackgroundAddon = useMemo(() => form.watch("other_addons").some((addon) => addon.id?.includes("background")), [form.watch("other_addons")])
    return (
        <FieldSet>
            <FieldLegend>Commission Information</FieldLegend>
            <FieldDescription>
                Please provide the details for your commission request below.
            </FieldDescription>
            <Controller
                name="commission_type"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field orientation="responsive" className="relative">
                        <FieldContent>
                            <FieldLabel>Commission Tier</FieldLabel>
                            <FieldDescription>Choose the tier that best suits your needs.</FieldDescription>
                        </FieldContent>
                        <BasicSelect
                            options={tierListOptions}
                            placeholder={FIELD_PLACEHOLDERS.commission_type}
                            value={field.value?.id as string}
                            onValueChange={(value) => {
                                const tier = tierListMap.get(value)
                                if (tier) {
                                    form.setValue("commission_type", { ...tier })
                                }
                            }}
                            ariaInvalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} className="absolute -bottom-3 right-0" />}
                    </Field>
                )}
            />
            <Controller
                name="intended_use"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldContent>
                            <FieldLabel>Intended Use</FieldLabel>
                            <FieldDescription>Describe any specific details or requirements like dimensions, color palette, or any other preferences you have in mind.</FieldDescription>
                        </FieldContent>
                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.intended_use} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <FieldGroup className="bg-card p-4 rounded-md border">
                <FieldSet>
                    <FieldLegend>Add-ons</FieldLegend>
                    <FieldDescription>Add-ons are optional and will increase the price of the commission.</FieldDescription>
                    <FieldGroup>
                        {systemSettings.rush_multiplier && <Controller
                            name="priority_level"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal">
                                    <Checkbox id="rush-checkbox" checked={field.value == "RUSH"} onCheckedChange={(value) => value == true ? form.setValue("priority_level", "RUSH") : form.setValue("priority_level", "STANDARD")} />
                                    <FieldContent>
                                        <FieldLabel htmlFor="rush-checkbox">Rush Order</FieldLabel>
                                        <FieldDescription>Do you want this commission rushed? Note: Rush commissions will be charged an additional {systemSettings.rush_multiplier! * 100}%.</FieldDescription>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />}
                        {systemSettings.commercial_multiplier && <Controller
                            name="addon_commercial"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal">
                                    <Checkbox id="commercial-checkbox" checked={field.value} onCheckedChange={(value) => value == true ? form.setValue("addon_commercial", true) : form.setValue("addon_commercial", false)} />
                                    <FieldContent>
                                        <FieldLabel htmlFor="commercial-checkbox">Commercial Use</FieldLabel>
                                        <FieldDescription>Do you want this commission for commercial use? Note: Commercial use will be charged an additional {systemSettings.commercial_multiplier! * 100}%.</FieldDescription>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />}
                        {systemSettings.extra_character_multiplier && <Controller
                            name="addon_extra_characters"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal">
                                    <Checkbox id="extra-character-checkbox" checked={field.value} onCheckedChange={(value) => value == true ? form.setValue("addon_extra_characters", true) : form.setValue("addon_extra_characters", false)} />
                                    <FieldContent>
                                        <FieldLabel htmlFor="extra-character-checkbox">Extra Character</FieldLabel>
                                        <FieldDescription>Do you want this commission with an extra character? Note: Extra characters will be charged an additional {systemSettings.extra_character_multiplier! * 100}%.</FieldDescription>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />}
                        {form.watch("addon_extra_characters") && <Controller
                            name="addon_extra_characters_count"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" className="relative">
                                    <FieldContent>
                                        <FieldLabel htmlFor="extra-character-checkbox">Number of extra characters</FieldLabel>
                                        <FieldDescription>How many extra characters do you want to add to this commission?</FieldDescription>
                                    </FieldContent>
                                    <Input type="number" min={1} max={5} {...field} aria-invalid={fieldState.invalid} placeholder="Number of extra characters" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="absolute bottom-2 right-0" />}
                                </Field>
                            )}
                        />}
                        {
                            commissionAddons.map((addon) => {
                                const isSelected = isAddonSelected(addon.id, form.watch("other_addons"))
                                const disabled = addon.id?.includes("background") && hasBackgroundAddon && !isSelected
                                return (
                                    <Controller
                                        key={addon.id}
                                        name={`other_addons`}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field orientation="horizontal" className={disabled ? "opacity-50" : ""}>
                                                <Checkbox
                                                    disabled={disabled}
                                                    id={addon.id} aria-disabled={fieldState.invalid} checked={isSelected} onCheckedChange={(value) => handleAddonChange(addon, value === true, field.value as FormOutput["other_addons"])} />
                                                <FieldContent>
                                                    <FieldLabel htmlFor={addon.id}>{addon.title}</FieldLabel>
                                                    <FieldDescription>{addon.description}</FieldDescription>
                                                </FieldContent>
                                            </Field>
                                        )}
                                    />
                                )
                            })
                        }
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </FieldSet>
    )
}