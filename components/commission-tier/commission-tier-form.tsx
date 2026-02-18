"use client"

import { useForm, Controller } from "react-hook-form"
import { formSchema } from "@/lib/validations/commission-tier"
import { FormInput, FormOutput } from "@/lib/validations/commission-tier"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldGroup, FieldLabel, FieldError, FieldContent, FieldSeparator } from "../ui/field"
import { Input } from "../ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "../ui/textarea"
import BasicImageInput from "../basic-image-input"
import { Button } from "../ui/button"
import { createCommissionTier } from "@/lib/services/commission-tier-service"
import { toast } from "sonner"


const FIELD_PLACEHOLDERS = {
    category: "Category",
    variant: "Variant",
    description: "Description",
    is_active: "Is Active",
    price_php: "Price (PHP)",
    price_usd: "Price (USD)",
    thumbnail: "Thumbnail",
    slot_limit: "Slot Limit"
}

export default function CommissionTierForm() {
    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(formSchema),
    })

    const handleSubmit = async (data: FormOutput) => {
        const result = await createCommissionTier(data)
        if (!result.ok && result.error) {
            toast.error(result.error.message)
            return
        }
        form.reset()
    }

    const canSubmit = form.formState.isValid && form.formState.isDirty;
    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                <div>
                    <Controller
                        name="thumbnail"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="h-full">
                                <BasicImageInput image={field.value} setImage={field.onChange} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
                <FieldGroup>
                    <Controller
                        name="category"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Category</FieldLabel>
                                <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.category} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="variant"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Variant</FieldLabel>
                                <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.variant} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.description} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="price_php"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Price (PHP)</FieldLabel>
                                    <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.price_php} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="price_usd"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Price (USD)</FieldLabel>
                                    <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.price_usd} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="is_active"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal">
                                    <Checkbox id="rush-checkbox" checked={field.value} onCheckedChange={(value) => value == true ? form.setValue("is_active", true) : form.setValue("is_active", false)} />
                                    <FieldContent>
                                        <FieldLabel htmlFor="rush-checkbox">Is Active</FieldLabel>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="slot_limit"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal" className="relative">
                                    <FieldLabel className="w-40">Slot Limit</FieldLabel>
                                    <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.slot_limit} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className="absolute -bottom-6 right-0" />}
                                </Field>
                            )}
                        />
                    </div>
                    <FieldSeparator />
                    <Button type="submit" disabled={!canSubmit}>Submit</Button>
                </FieldGroup>
            </div>
        </form>
    )
}