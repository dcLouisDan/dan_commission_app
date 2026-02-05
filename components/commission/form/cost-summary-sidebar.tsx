
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
import { calculateCostSummary } from "@/lib/logic/commission"
import useSystemSettings from "@/hooks/use-system-settings"
import { TypographyH5 } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo } from "react"
import { CostSummary } from "@/lib/types/commission"
import { useServerLocation } from "@/hooks/use-server-location"

export default function CostSummarySidebar() {
    const { currency } = useServerLocation()
    const { systemSettings } = useSystemSettings()
    const form = useFormContext<FormInput, unknown, FormOutput>()
    const canSubmit = form.formState.isValid && !form.formState.isSubmitting && form.watch("tos_agreed") && form.watch("deposit_agreed")
    const costSummary = useMemo<CostSummary>(() => calculateCostSummary(form.watch(), systemSettings, currency), [form.watch(), systemSettings, currency])

    return (
        <FieldSet>
            <FieldLegend className="text-center">Summary</FieldLegend>
            <FieldDescription className="text-center">Here is a summary of your commission request. Please review it carefully before submitting.</FieldDescription>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="w-full h-full border p-4 rounded-2xl border-secondary/50 border-dashed flex flex-col gap-4">
                    <TypographyH5>Customer Information</TypographyH5>
                    <div className="flex flex-col gap-2">
                        <p>Name: {form.watch("client_name")}</p>
                        <p>Email: {form.watch("client_email")}</p>
                        <p>Social Platform: {form.watch("social_platform")}</p>
                        <p>Social Handle: {form.watch("social_handle")}</p>
                    </div>
                </div>
                <div className="w-full h-fit flex flex-col gap-4">
                    <div className="border bg-secondary text-secondary-foreground rounded-md p-4 flex flex-col gap-2 text-sm">
                        <TypographyH5>Cost Breakdown</TypographyH5>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <p>Base Price <span className="text-secondary-foreground/70">{form.watch("commission_type") && `(${form.watch("commission_type").category} - ${form.watch("commission_type").variant})`}</span></p>
                            <p>₱{costSummary.base_price}</p>
                        </div>
                        {costSummary.addons.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <p className=" font-semibold">Add-ons</p>
                                {costSummary.addons.map((addon) => (
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
                            <p>₱{costSummary.subtotal}</p>
                        </div>
                        {systemSettings.rush_multiplier && costSummary.rush_fee > 0 && <div className="flex items-center justify-between text-sm text-secondary-foreground/70">
                            <p>Rush Fee ({systemSettings.rush_multiplier * 100}%)</p>
                            <p>₱{costSummary.rush_fee}</p>
                        </div>}
                        {systemSettings.tax_rate! > 0 && <div className="flex items-center justify-between text-sm text-secondary-foreground/70">
                            <p>Tax ({systemSettings.tax_rate}%)</p>
                            <p>₱{costSummary.tax}</p>
                        </div>}
                        {(systemSettings.xendit_fee_percent || systemSettings.xendit_fee_fixed) && <div className="flex text-sm items-center justify-between text-secondary-foreground/70">
                            <p>Xendit Fee ({systemSettings.xendit_fee_percent! * 100}%)</p>
                            <p>₱{costSummary.xendit_fee}</p>
                        </div>}
                        <Separator />
                        <div className="flex items-center justify-between text-base font-bold">
                            <p>Total</p>
                            <p>₱{costSummary.total}</p>
                        </div>
                        <div className="border-dashed border border-secondary-foreground/20" />
                        <div className="flex items-center justify-between text-sm">
                            <p>Initial Deposit</p>
                            <p>₱{costSummary.deposit}</p>
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