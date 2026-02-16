
"use client"
import { Controller } from "react-hook-form"
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
import { useFormContext } from "react-hook-form"
import { FormInput, FormOutput } from "@/lib/validations/commission"
import { parseSummary } from "@/lib/logic/commission"
import useSystemSettings from "@/hooks/use-system-settings"
import { TypographyH5 } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo } from "react"
import { CommissionSummary } from "@/lib/types/commission"
import { useServerLocation } from "@/hooks/use-server-location"
import { cn } from "@/lib/utils"
import { snakeCaseToTitleCase } from "@/lib/utils/string-utils"



export default function SubmissionSummarySection() {
    const { currency } = useServerLocation()
    const { systemSettings } = useSystemSettings()
    const form = useFormContext<FormInput, unknown, FormOutput>()
    const canSubmit = form.formState.isValid && !form.formState.isSubmitting && form.watch("tos_agreed") && form.watch("deposit_agreed")
    const CommissionSummary = useMemo<CommissionSummary>(() => {
        const summary = parseSummary(form.watch(), systemSettings, currency)
        form.setValue("cost_summary", summary)
        return summary
    }, [form.formState.isValid, systemSettings, currency])
    return (
        <FieldSet>
            <FieldLegend className="text-center">Summary</FieldLegend>
            <FieldDescription className="text-center">Here is a summary of your commission request. Please review it carefully before submitting.</FieldDescription>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="w-full h-full border p-4 rounded-2xl border-secondary/50 border-dashed flex flex-col gap-4">
                    <TypographyH5>Customer Information</TypographyH5>
                    <div className="flex flex-col border-t">
                        <InfoRow label="Name" value={form.watch("client_name")} />
                        <InfoRow label="Email" value={form.watch("client_email")} />
                        <InfoRow toTitleCase label="Social Platform" value={form.watch("social_platform")} />
                        <InfoRow label="Social Handle" value={form.watch("social_handle")} />
                    </div>
                    <TypographyH5>Creative Brief</TypographyH5>
                    <div className="flex flex-col border-t">
                        <InfoRow toTitleCase label="Character Name" value={form.watch("character_name")} />
                        <InfoRow toTitleCase label="Character Physical Description" value={form.watch("character_physical_desc")} />
                        <InfoRow toTitleCase label="Character Personality" value={form.watch("character_personality")} />
                        <InfoRow toTitleCase label="Character Setting" value={form.watch("character_setting")} />
                        <InfoRow toTitleCase label="Character Lighting" value={form.watch("character_lighting")} />
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-4">
                    <div className="border bg-secondary text-secondary-foreground rounded-md p-4 flex flex-col gap-2 text-sm">
                        <TypographyH5>Cost Breakdown</TypographyH5>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <p>Base Price <span className="text-secondary-foreground/70">{form.watch("commission_type") && `(${form.watch("commission_type").category} - ${form.watch("commission_type").variant})`}</span></p>
                            <p>₱{CommissionSummary.base_price}</p>
                        </div>
                        {CommissionSummary.addons.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className=" font-semibold">Add-ons</p>
                                {CommissionSummary.addons.map((addon) => (
                                    <div key={addon.name} className="flex items-center justify-between pl-2">
                                        <p className="text-sm">{addon.name}</p>
                                        <p className="text-sm">₱{addon.price}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="border-dashed border border-secondary-foreground/20" />
                        <div className="flex items-center justify-between text-sm">
                            <p>Subtotal</p>
                            <p>₱{CommissionSummary.subtotal}</p>
                        </div>
                        {systemSettings.rush_multiplier && CommissionSummary.rush_fee > 0 && <div className="flex items-center justify-between text-sm text-secondary-foreground/70">
                            <p>Rush Fee ({systemSettings.rush_multiplier * 100}%)</p>
                            <p>₱{CommissionSummary.rush_fee}</p>
                        </div>}
                        {systemSettings.tax_rate! > 0 && <div className="flex items-center justify-between text-sm text-secondary-foreground/70">
                            <p>Tax ({systemSettings.tax_rate}%)</p>
                            <p>₱{CommissionSummary.tax}</p>
                        </div>}
                        {(systemSettings.xendit_fee_percent || systemSettings.xendit_fee_fixed) && <div className="flex text-sm items-center justify-between text-secondary-foreground/70">
                            <p>Xendit Fee ({systemSettings.xendit_fee_percent! * 100}%)</p>
                            <p>₱{CommissionSummary.xendit_fee}</p>
                        </div>}
                        <Separator />
                        <div className="flex items-center justify-between text-base font-bold">
                            <p>Total</p>
                            <p>₱{CommissionSummary.total}</p>
                        </div>
                        <div className="border-dashed border border-secondary-foreground/20" />
                        <div className="flex items-center justify-between text-sm">
                            <p>Initial Deposit</p>
                            <p>₱{CommissionSummary.deposit}</p>
                        </div>
                    </div>
                    <div className="border p-4 rounded-md bg-card">
                        <FieldGroup>
                            <Controller
                                name="tos_agreed"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal">
                                        <Checkbox id="tos-agreed" checked={field.value} onCheckedChange={(value) => value == true ? form.setValue("tos_agreed", true) : form.setValue("tos_agreed", false)} />
                                        <FieldContent>
                                            <FieldLabel htmlFor="tos-agreed" className="inline-block">By checking this box, you agree to the <Link href="/commissions/terms-of-service" target="_blank" className="underline inline-block text-nowrap p-0 m-0">terms of service</Link>.</FieldLabel>
                                        </FieldContent>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="deposit_agreed"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal">
                                        <Checkbox id="deposit-agreed" checked={field.value} onCheckedChange={(value) => value == true ? form.setValue("deposit_agreed", true) : form.setValue("deposit_agreed", false)} />
                                        <FieldContent>
                                            <FieldLabel htmlFor="deposit-agreed" className="inline-block">By checking this box, you agree to pay the non-refundable deposit and that the work will begin after payment.</FieldLabel>
                                        </FieldContent>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </div>
                    <Button type="submit" disabled={!canSubmit}>Submit</Button>
                </div>
            </div>
        </FieldSet>
    )
}

function InfoRow({ label, value, toTitleCase = false, className }: { label: string, value: string, toTitleCase?: boolean, className?: string }) {
    if (!value) {
        return null
    }
    return (
        <div className={cn("grid grid-cols-2 items-center justify-between text-sm border-b pb-1", className)}>
            <p className="font-semibold">{label}:</p>
            <p className="text-right">{toTitleCase ? snakeCaseToTitleCase(value) : value}</p>
        </div>
    )
}