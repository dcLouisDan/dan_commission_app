"use client"
import { Controller } from "react-hook-form"
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldLabel, FieldContent, FieldSet, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FIELD_PLACEHOLDERS, SOCIAL_PLATFORM_HANDLE_LABELS, SOCIAL_PLATFORMS_SELECT_ITEMS } from "@/lib/constants/commision-form"
import { useFormContext } from "react-hook-form"
import type { FormInput } from "@/lib/validations/commission"
import BasicSelect from "@/components/basic-select"

export default function CustomerInfoSection() {
    const form = useFormContext<FormInput>()
    return (
        <FieldSet>
            <FieldLegend>Customer Information</FieldLegend>
            <FieldDescription>
                Tell us a bit about yourself so we can stay in touch regarding your commission.
            </FieldDescription>
            <FieldGroup>
                <Controller
                    name="client_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Client Name</FieldLabel>
                            <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.client_name} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="client_email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Client Email</FieldLabel>
                            <Input {...field} aria-invalid={fieldState.invalid} placeholder={FIELD_PLACEHOLDERS.client_email} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="social_platform"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel>Social Platform</FieldLabel>
                                <FieldDescription>Where's the best place for us to reach out to you?</FieldDescription>
                            </FieldContent>
                            <BasicSelect
                                options={SOCIAL_PLATFORMS_SELECT_ITEMS}
                                placeholder={FIELD_PLACEHOLDERS.social_platform}
                                disabled={fieldState.invalid}
                                defaultValue="email"
                                value={field.value}
                                onValueChange={(value) => form.setValue("social_platform", value)}
                                ariaInvalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                {form.watch("social_platform") !== "email" && <Controller
                    name="social_handle"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldContent>
                                <FieldLabel>{SOCIAL_PLATFORM_HANDLE_LABELS[form.watch("social_platform")] ?? "Social Handle"}</FieldLabel>
                            </FieldContent>
                            <Input {...field} aria-invalid={fieldState.invalid} placeholder={`What is your ${SOCIAL_PLATFORM_HANDLE_LABELS[form.watch("social_platform")] ?? "social handle"}?`} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />}
            </FieldGroup>
        </FieldSet>
    )
}