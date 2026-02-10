import { insertCommission } from "../repositories/commission-repo";
import { deleteFiles, uploadMultipleFiles } from "../repositories/storage-repo";
import { Commission, CommissionInsert } from "../types/commission";
import { ServiceResult, StorageSummary } from "../types/response";
import { formatClientName } from "../utils/string-utils";
import { FormOutput } from "../validations/commission";

const BUCKET_NAME = process.env.NEXT_COMMISSION_REFERENCE_BUCKET ?? "commission_reference_images";

export async function createCommission(formData: FormOutput): Promise<ServiceResult<Commission>> {
    const { commission_type,
        priority_level,
        client_name,
        client_email,
        social_platform,
        social_handle,
        addon_extra_characters,
        addon_extra_characters_count,
        addon_commercial,
        intended_use,
        other_addons,
        character_name,
        character_physical_desc,
        character_personality,
        character_pose,
        character_setting,
        character_lighting,
        image_submit_option,
        google_drive_folder,
        direct_upload_images,
        image_links,
        tos_agreed,
        deposit_agreed,
        cost_summary
    } = formData

    if (!tos_agreed) {
        return { ok: false, error: { type: "validation", message: "You must agree to the terms of service" } }
    }

    if (!deposit_agreed) {
        return { ok: false, error: { type: "validation", message: "You must agree to the deposit terms" } }
    }

    if (commission_type.id === "" || commission_type.id === undefined) {
        return { ok: false, error: { type: "validation", message: "You must select a commission type" } }
    }

    let referenceImages: string[] = []
    let uploadedImages: string[] = []
    if (image_submit_option === "google_drive_folder" && google_drive_folder) {
        referenceImages.push(google_drive_folder)
    } else if (image_submit_option === "direct_upload" && direct_upload_images) {
        const timestamp = Date.now();
        const formattedClientName = formatClientName(client_name)
        const folderName = `${timestamp}_${formattedClientName}`
        const result = await uploadReferenceImages(direct_upload_images, folderName)
        if (!result.ok) {
            return { ok: false, error: { type: "storage", message: result.error.message } }
        }
        uploadedImages = result.data!.success_files
        referenceImages = result.data!.success_public_urls || []
    } else if (image_submit_option === "image_links" && image_links) {
        referenceImages = image_links
    }

    if (referenceImages.length === 0) {
        return { ok: false, error: { type: "validation", message: "You must provide at least one reference image" } }
    }

    const commissionTypeName = `${commission_type.variant} - ${commission_type.category}`
    const commissionInsert: CommissionInsert = {
        client_name,
        client_email,
        commission_type: commissionTypeName,
        tier_id: commission_type.id,
        priority_level: priority_level,
        reference_images: referenceImages,
        form_data: {
            socials: {
                platform: social_platform,
                handle: social_handle
            },
            character: {
                name: character_name,
                physical_desc: character_physical_desc,
                personality: character_personality,
                pose: character_pose,
                setting: character_setting,
                lighting: character_lighting
            },
            selected_addons: other_addons,
            extras: {
                extra_characters_count: addon_extra_characters_count,
                extra_characters_cost: addon_extra_characters
            },
            intended_use: intended_use,
            image_submit_option: image_submit_option,
            google_drive_folder: google_drive_folder,
            image_links: image_links,
            tos_agreed: tos_agreed,
            deposit_agreed: deposit_agreed,
            cost_summary: cost_summary
        },
        // Financials
        base_price: cost_summary.base_price,
        total_price: cost_summary.total,
        tax_amount: cost_summary.tax,
        xendit_fee: cost_summary.xendit_fee,
        is_commercial: addon_commercial,
    }

    try {
        const result = await insertCommission(commissionInsert)
        if (!result.ok) {
            if (uploadedImages.length > 0) {
                await deleteFiles(uploadedImages, BUCKET_NAME)
            }

            return { ok: false, error: { type: "database", message: result.error.raw.message } }
        }
        return { ok: true, data: result.data! }
    } catch (error) {
        const err = error as Error
        if (uploadedImages.length > 0) {
            await deleteFiles(uploadedImages, BUCKET_NAME)
        }
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}

async function uploadReferenceImages(files: File[], folderName: string): Promise<ServiceResult<StorageSummary>> {
    try {
        const result = await uploadMultipleFiles(files, BUCKET_NAME, folderName)
        if (!result.ok) {
            return { ok: false, error: { type: "storage", message: result.error.raw.message } }
        }
        return { ok: true, data: result.data! }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}