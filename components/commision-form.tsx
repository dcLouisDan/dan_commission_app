"use client"
import * as z from "zod";
import { Constants, Database } from "@/lib/types/supabase";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "./ui/input";
import BasicSelect from "./basic-select";
import { PRIORITY_LEVELS_SELECT_ITEMS, SOCIAL_PLATFORM_HANDLE_LABELS, SOCIAL_PLATFORMS_SELECT_ITEMS } from "@/lib/constants/commision-form";
import { useTierList } from "@/hooks/use-tier-list";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
    // Identity and Contant
    client_name: z.string().min(1, "Client name is required"),
    client_email: z.email("Invalid email"),
    social_platform: z.string().min(1, "Social platform is required"),
    social_handle: z.string().min(1, "Social handle is required"),
    // Technical Specs
    commission_type: z.string().min(1, "Commission type is required"),
    priority_level: z.enum(Constants.public.Enums.priority_level_enum),
    tier_id: z.string().min(1, "Tier is required"),
    addon_background: z.boolean(),
    addon_extra_characters: z.boolean(),
    addon_extra_characters_count: z.number().min(1, "Extra characters count is required"),
    addon_commercial: z.boolean(),
    rush_order: z.boolean(),
    intended_use: z.string().min(1, "Intended use is required"),
    // Creative Brief
    character_name: z.string().min(1, "Character name is required"),
    character_notes: z.string().min(1, "Character notes is required"),
    character_physical_desc: z.string().min(1, "Character physical description is required"),
    character_personality: z.string().min(1, "Character personality is required"),
    character_pose: z.string().min(1, "Character pose is required"),
    character_setting: z.string().min(1, "Character setting is required"),
    character_lighting: z.string().min(1, "Character lighting is required"),
    character_reference_images: z.array(z.string().min(1, "Reference image is required")).min(1, "At least one reference image is required"),
    // TOS
    tos_agreed: z.boolean(),
})

export default function CommissionForm() {
    const { tierListOptions } = useTierList()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_name: "",
            client_email: "",
            social_platform: "email",
            social_handle: "",
            commission_type: "",
            priority_level: "STANDARD",
            tier_id: "",
            addon_background: false,
            addon_extra_characters: false,
            addon_extra_characters_count: 1,
            addon_commercial: false,
            rush_order: false,
            intended_use: "",
            character_name: "",
            character_notes: "",
            character_physical_desc: "",
            character_personality: "",
            character_pose: "",
            character_setting: "",
            character_lighting: "",
            character_reference_images: [],
            tos_agreed: false,
        }
    })

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    return (
        <form id="commission-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
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
                                    <Input {...field} aria-invalid={fieldState.invalid} placeholder="What is your name/nickname?" />
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
                                    <Input {...field} aria-invalid={fieldState.invalid} placeholder="What is your email?" />
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
                                        placeholder="Select a social platform"
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
                <FieldSeparator />
                <FieldSet>
                    <FieldLegend>Commission Information</FieldLegend>
                    <FieldDescription>
                        Please provide the details for your commission request below.
                    </FieldDescription>
                    <FieldGroup>
                        <Controller
                            name="tier_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldContent>
                                        <FieldLabel>Tier</FieldLabel>
                                        <FieldDescription>What tier do you want?</FieldDescription>
                                    </FieldContent>
                                    <BasicSelect
                                        options={tierListOptions}
                                        placeholder="Select a tier"
                                        disabled={fieldState.invalid}
                                        value={field.value}
                                        onValueChange={(value) => {
                                            form.setValue("tier_id", value)
                                        }}
                                        ariaInvalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />


                        <Controller
                            name="priority_level"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal">
                                    <Checkbox id="rush-checkbox" checked={field.value == "RUSH"} onCheckedChange={(value) => value == true ? form.setValue("priority_level", "RUSH") : form.setValue("priority_level", "STANDARD")} />
                                    <FieldContent>
                                        <FieldLabel htmlFor="rush-checkbox">Rush Order</FieldLabel>
                                        <FieldDescription>Do you want this commission rushed? Note: Rush commissions will be charged an additional 20%.</FieldDescription>
                                    </FieldContent>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>
            </FieldGroup>
        </form>
    );
}