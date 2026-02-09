import { z } from "zod";
import { Constants } from "../types/supabase";
import { IMAGE_SUBMIT_OPTIONS, MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from "../constants/commision-form";

export const imageSchema = z.instanceof(File, {
    message: "Reference image is required",
}).refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: "Reference image size must be less than 5MB",
}).refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
    message: "Reference image type must be one of the allowed types",
})


export const formSchema = z.object({
    // Identity and Contant
    client_name: z.string().min(1, "Client name is required"),
    client_email: z.email("Invalid email"),
    social_platform: z.string().min(1, "Social platform is required"),
    social_handle: z.string(),
    // Technical Specs
    commission_type: z.object({
        id: z.string().optional(),
        category: z.string().nullable(),
        variant: z.string().nullable(),
        price_php: z.number().nullable(),
        price_usd: z.number().nullable(),
        is_active: z.boolean().nullable(),
        created_at: z.string().nullable(),
    }),
    priority_level: z.enum(Constants.public.Enums.priority_level_enum),
    addon_extra_characters: z.boolean(),
    addon_extra_characters_count: z.coerce.number<string>().optional(),
    addon_commercial: z.boolean(),
    intended_use: z.string().min(1, "Intended use is required"),
    other_addons: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        price_php: z.number().nullable(),
        price_usd: z.number().nullable(),
        is_active: z.boolean().nullable(),
        created_at: z.string().nullable(),
    })),
    // Creative Brief
    character_name: z.string().min(1, "Character name is required"),
    character_physical_desc: z.string().min(1, "Character physical description is required"),
    character_personality: z.string().min(1, "Character personality is required"),
    character_pose: z.string().min(1, "Character pose is required"),
    character_setting: z.string().min(1, "Character setting is required"),
    character_lighting: z.string().min(1, "Character lighting is required"),
    image_submit_option: z.enum(IMAGE_SUBMIT_OPTIONS).default("direct_upload"),
    google_drive_folder: z.preprocess((val: string) => val.trim().length > 0 ? val : undefined, z.url("Invalid google drive folder url")).optional(),
    image_links: z.preprocess((val: string[]) => val.filter((link) => link.trim().length > 0), z.array(z.url("Invalid image link"))).optional(),
    direct_upload_images: z.array(imageSchema).optional(),
    // TOS
    tos_agreed: z.boolean(),
    deposit_agreed: z.boolean(),
    cost_summary: z.object({
        base_price: z.number(),
        addons: z.array(z.object({
            name: z.string(),
            price: z.number(),
        })),
        subtotal: z.number(),
        tax: z.number(),
        xendit_fee: z.number(),
        rush_fee: z.number(),
        total: z.number(),
        deposit: z.number(),
    })
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
        return data.direct_upload_images && data.direct_upload_images.length >= 1
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

export type FormInput = z.input<typeof formSchema>;
export type FormOutput = z.output<typeof formSchema>;