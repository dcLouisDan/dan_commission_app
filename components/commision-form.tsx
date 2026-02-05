"use client"
import * as z from "zod";
import { Constants, Database } from "@/lib/types/supabase";
import { Controller, useForm, UseFormReturn } from "react-hook-form"
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
import { SOCIAL_PLATFORM_HANDLE_LABELS, SOCIAL_PLATFORMS_SELECT_ITEMS } from "@/lib/constants/commision-form";
import { useTierList } from "@/hooks/use-tier-list";
import { Checkbox } from "./ui/checkbox";
import useSystemSettings from "@/hooks/use-system-settings";
import { CommissionAddon, useCommissionAddons } from "@/hooks/use-commission-addons";
import { Textarea } from "./ui/textarea";
import { useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { snakeCaseToTitleCase } from "@/lib/utils/string-utils";
import MultiImageInput from "./multi-image-input";
import { FolderOpen, Image, Link as LinkIcon, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { TypographyH5 } from "./typography";
import { Separator } from "./ui/separator";
import Link from "next/link";

const IMAGE_SUBMIT_OPTIONS = ['direct_upload', 'google_drive_folder', 'image_links'] as const;
type ImageSubmitOption = typeof IMAGE_SUBMIT_OPTIONS[number];

const IMAGE_UPLOAD_LIMIT = 5;
const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageSchema = z.instanceof(File, {
    message: "Reference image is required",
}).refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: "Reference image size must be less than 5MB",
}).refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: "Reference image type must be one of the allowed types",
})

interface CostSummary {
    base_price: number;
    addons: {
        name: string;
        price: number;
    }[];
    subtotal: number;
    tax: number;
    xendit_fee: number;
    total: number;
    deposit: number;
}

const formSchema = z.object({
    // Identity and Contant
    client_name: z.string().min(1, "Client name is required"),
    client_email: z.email("Invalid email"),
    social_platform: z.string().min(1, "Social platform is required"),
    social_handle: z.string(),
    // Technical Specs
    commission_type: z.string().min(1, "Commission type is required"),
    priority_level: z.enum(Constants.public.Enums.priority_level_enum),
    tier_id: z.string().min(1, "Tier is required"),
    addon_extra_characters: z.boolean(),
    addon_extra_characters_count: z.coerce.number<string>().optional(),
    addon_commercial: z.boolean(),
    rush_order: z.boolean(),
    intended_use: z.string().min(1, "Intended use is required"),
    other_addons: z.array(z.object({ id: z.string().nullable(), title: z.string().nullable(), description: z.string().nullable(), price: z.number().nullable(), is_active: z.boolean().nullable() })),
    // Creative Brief
    character_name: z.string().min(1, "Character name is required"),
    character_physical_desc: z.string().min(1, "Character physical description is required"),
    character_personality: z.string().min(1, "Character personality is required"),
    character_pose: z.string().min(1, "Character pose is required"),
    character_setting: z.string().min(1, "Character setting is required"),
    character_lighting: z.string().min(1, "Character lighting is required"),
    image_submit_option: z.enum(IMAGE_SUBMIT_OPTIONS),
    google_drive_folder: z.url().optional(),
    image_links: z.array(z.url()).optional(),
    direct_upload_images: z.array(imageSchema),
    // TOS
    tos_agreed: z.boolean(),
    deposit_agreed: z.boolean(),
}).refine((data) => {
    if (data.social_platform !== "email") {
        return data.social_handle && data.social_handle.length > 0
    }
    return true
}, {
    message: "Social handle is required",
    path: ["social_handle"]
}).refine((data) => {
    if (data.image_submit_option === "direct_upload") {
        return data.direct_upload_images.length > 0
    }
    return true
}, {
    message: "At least one reference image is required",
    path: ["direct_upload_images"]
}).refine((data) => {
    if (data.image_submit_option === "google_drive_folder") {
        return data.google_drive_folder && data.google_drive_folder.length > 0
    }
    return true
}, {
    message: "Google Drive folder is required",
    path: ["google_drive_folder"]
})

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const fieldPlaceholders: Record<keyof typeof formSchema.shape, string> = {
    // Identity & Contact
    client_name: "What is your name?",
    client_email: "What is your email address?",
    social_platform: "What social platform do you use?",
    social_handle: "What is your social handle?",
    // Technical Specs
    commission_type: "What type of commission do you want?",
    priority_level: "What is your priority level?",
    tier_id: "What tier do you want?",
    addon_extra_characters: "Do you want extra characters?",
    addon_extra_characters_count: "How many extra characters do you want?",
    addon_commercial: "Do you want commercial use?",
    rush_order: "Do you want a rush order?",
    intended_use: "What is the intended use of this commission?",
    other_addons: "Do you want any other addons?",
    // Creative Brief
    character_name: "What is your character's name?",
    character_physical_desc: "Describe your character's physical appearance in detail.",
    character_personality: "Describe your character's personality in detail.",
    character_pose: "Describe your character's pose in detail.",
    character_setting: "Describe your character's setting in detail.",
    character_lighting: "Describe your character's lighting in detail.",
    image_submit_option: "How do you want to submit your reference images?",
    direct_upload_images: "Upload reference images for your character.",
    image_links: "Enter your one or more image links.",
    google_drive_folder: "Enter your Google Drive folder link.",
    // TOS
    tos_agreed: "Do you agree to the terms and conditions?",
    deposit_agreed: "By checking this box, you agree to pay the non-refundable deposit and that the work will begin after payment.",
}


export default function CommissionForm() {
    const { tierListOptions } = useTierList()
    const { systemSettings } = useSystemSettings()
    const { commissionAddons } = useCommissionAddons()
    const form = useForm<FormInput, unknown, FormOutput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_name: "",
            client_email: "",
            social_platform: "email",
            social_handle: "",
            commission_type: "",
            priority_level: "STANDARD",
            tier_id: "",
            addon_extra_characters: false,
            addon_extra_characters_count: "0",
            addon_commercial: false,
            rush_order: false,
            intended_use: "",
            other_addons: [],
            character_name: "",
            character_physical_desc: "",
            character_personality: "",
            character_pose: "",
            character_setting: "",
            character_lighting: "",
            image_submit_option: IMAGE_SUBMIT_OPTIONS[0],
            google_drive_folder: undefined,
            direct_upload_images: [],
            image_links: undefined,
            tos_agreed: false,
            deposit_agreed: false,
        }
    })
    const [costSummary, setCostSummary] = useState<CostSummary>({
        base_price: 1000,
        addons: [
            {
                name: "Extra Character",
                price: 500,
            },
            {
                name: "Commercial Use",
                price: 1000,
            },
        ],
        subtotal: 2500,
        tax: 200,
        xendit_fee: 100,
        total: 2800,
        deposit: 1400,
    })
    const hasBackgroundAddon = useMemo(() => form.watch("other_addons").some((addon) => addon.id?.includes("background")), [form.watch("other_addons")])

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    const isAddonSelected = (addonId: string, values?: CommissionAddon[]) => {
        if (!values) return false
        return values.some((addon) => addon.id === addonId)
    }

    const handleAddonChange = (addon: CommissionAddon, value: boolean, currentAddons?: CommissionAddon[]) => {
        if (!currentAddons) return
        if (value) {
            form.setValue("other_addons", [...currentAddons, addon])
        } else {
            form.setValue("other_addons", currentAddons.filter((addon) => addon.id !== addon.id))
        }
    }

    const onUploadMethodChange = (value: ImageSubmitOption) => {
        form.setValue("direct_upload_images", [])
        form.setValue("image_links", [""])
        form.setValue("google_drive_folder", "")
    }

    console.log(form.formState.errors)

    const canSubmit = form.formState.isValid && !form.formState.isSubmitting && form.watch("tos_agreed") && form.watch("deposit_agreed")

    return (
        <form id="commission-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col md:flex-row gap-4">
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
                                        <Input {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.client_name} />
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
                                        <Input {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.client_email} />
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
                                            placeholder={fieldPlaceholders.social_platform}
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
                        <Controller
                            name="tier_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="responsive" className="relative">
                                    <FieldContent>
                                        <FieldLabel>Commission Tier</FieldLabel>
                                        <FieldDescription>Choose the tier that best suits your needs.</FieldDescription>
                                    </FieldContent>
                                    <BasicSelect
                                        options={tierListOptions}
                                        placeholder={fieldPlaceholders.tier_id}
                                        value={field.value}
                                        onValueChange={(value) => {
                                            form.setValue("tier_id", value)
                                            const tierName = tierListOptions.find((tier) => tier.value === value)?.label
                                            form.setValue("commission_type", tierName!)
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
                                    <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.intended_use} />
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
                                                <Input {...field} aria-invalid={fieldState.invalid} placeholder="Number of extra characters" />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="absolute bottom-2 right-0" />}
                                            </Field>
                                        )}
                                    />}
                                    {
                                        commissionAddons.map((addon) => (
                                            <Controller
                                                key={addon.id}
                                                name={`other_addons`}
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field orientation="horizontal">
                                                        <Checkbox id={addon.id} aria-disabled={fieldState.invalid} checked={isAddonSelected(addon.id, field.value as CommissionAddon[])} onCheckedChange={(value) => handleAddonChange(addon, value === true, field.value as CommissionAddon[])} />
                                                        <FieldContent>
                                                            <FieldLabel htmlFor={addon.id}>{addon.title}</FieldLabel>
                                                            <FieldDescription>{addon.description}</FieldDescription>
                                                        </FieldContent>
                                                    </Field>
                                                )}
                                            />
                                        ))
                                    }
                                </FieldGroup>
                            </FieldSet>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>The Creative Brief</FieldLegend>
                        <FieldDescription>Tell me about your character and the vision you have for this commission.</FieldDescription>
                        <FieldGroup>
                            <Controller
                                name="character_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character Name(s)</FieldLabel>
                                        <Input {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_name} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="character_physical_desc"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character Physical Description</FieldLabel>
                                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_physical_desc} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="character_personality"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character Personality</FieldLabel>
                                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_personality} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="character_pose"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character Pose</FieldLabel>
                                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_pose} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="character_setting"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character {hasBackgroundAddon ? "Background Setting" : "Background Color"}</FieldLabel>
                                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_setting} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="character_lighting"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Character Lighting</FieldLabel>
                                        <Textarea {...field} aria-invalid={fieldState.invalid} placeholder={fieldPlaceholders.character_lighting} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>
                    <Separator />
                    <FieldSet>
                        <FieldLegend>Reference Images</FieldLegend>
                        <FieldDescription>Upload reference images for your character.</FieldDescription>
                        <div className="grid grid-cols-3 gap-4">
                            <Controller
                                name="image_submit_option"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Upload Method</FieldLabel>
                                        <RadioGroup orientation="horizontal" defaultValue={IMAGE_SUBMIT_OPTIONS[0]} value={field.value} onValueChange={(value) => { onUploadMethodChange(value as ImageSubmitOption); field.onChange(value) }}>
                                            {IMAGE_SUBMIT_OPTIONS.map((option) => (<Field key={option} orientation="horizontal">
                                                <RadioGroupItem value={option} id={option} />
                                                <FieldLabel htmlFor={option}>{snakeCaseToTitleCase(option)}</FieldLabel>
                                            </Field>))}
                                        </RadioGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <div className="col-span-2">
                                {form.watch("image_submit_option") === "direct_upload" && <Controller
                                    name="direct_upload_images"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="border bg-card p-4 rounded-md">
                                            <FieldLabel><Image className="inline w-4 h-4" /> Character Reference Images</FieldLabel>
                                            <MultiImageInput images={field.value} setImages={field.onChange} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />}
                                {form.watch("image_submit_option") === "google_drive_folder" && <Controller
                                    name="google_drive_folder"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="border bg-card p-4 rounded-md">
                                            <FieldLabel><FolderOpen className="inline w-4 h-4" /> Google Drive Folder Link</FieldLabel>
                                            <Input placeholder="https://drive.google.com/drive/folders/your-folder-id" {...field} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />}
                                {form.watch("image_submit_option") === "image_links" && <Controller
                                    name="image_links"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="border bg-card p-4 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <FieldLabel><LinkIcon className="inline w-4 h-4" /> Image Links</FieldLabel>
                                                <Button variant="secondary" type="button" size="icon" onClick={() => field.onChange([...(field.value || []), ""])}><Plus className="w-4 h-4" /></Button>
                                            </div>
                                            {
                                                Array.from({ length: form.watch("image_links")?.length || 1 }).map((_, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Input placeholder="https://image.com/image.jpg" value={field.value?.[index]} onChange={(e) => field.onChange(field.value?.map((link, i) => i === index ? e.target.value : link))} />
                                                        <Button disabled={form.watch("image_links")?.length === 1} variant="ghost" type="button" size="icon" onClick={() => field.onChange(field.value?.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4" /></Button>
                                                    </div>
                                                ))
                                            }
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />}
                            </div>
                        </div>
                    </FieldSet>
                </FieldGroup>
                <div className=" w-full md:w-1/2  h-fit sticky top-4 flex flex-col gap-4">
                    <div className="border bg-secondary text-secondary-foreground rounded-md p-4 flex flex-col gap-2 text-sm">
                        <TypographyH5>Summary</TypographyH5>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <p>Base Price <span className="text-secondary-foreground/70">{form.watch("commission_type") && `(${form.watch("commission_type")})`}</span></p>
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
                        {systemSettings.tax_rate! > 0 && <div className="flex items-center justify-between text-sm text-secondary-foreground/70">
                            <p>Tax ({systemSettings.tax_rate}%)</p>
                            <p>₱{costSummary.tax}</p>
                        </div>}
                        {(systemSettings.xendit_fee_percent || systemSettings.xendit_fee_fixed) && <div className="flex text-sm items-center justify-between text-secondary-foreground/70">
                            <p>Xendit Fee</p>
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
        </form>
    );
}