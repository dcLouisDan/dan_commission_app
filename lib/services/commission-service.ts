import { COMMISSION_REFERENCE_IMAGES_BUCKET, SUBMITTED_UPLOAD_FOLDER, TEMP_UPLOAD_FOLDER } from "../constants/files";
import { insertCommission } from "../repositories/commission-repo";
import { moveFile } from "../repositories/storage-repo";
import { insertFileRelation } from "../repositories/file-relation-repo";
import { updateFileRecord } from "../repositories/db-file-repo";
import { createClient } from "../supabase/server";
import { Commission, CommissionInsert } from "../types/commission";
import { ServiceResult } from "../types/response";
import { FormOutput } from "../validations/commission";

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

    if (image_submit_option === "google_drive_folder" && google_drive_folder) {
        referenceImages.push(google_drive_folder)
    } else if (image_submit_option === "direct_upload" && direct_upload_images) {
        // Collect the public URLs of the already-uploaded images to save in the JSON column
        referenceImages = direct_upload_images.map(img => img.publicUrl).filter((url): url is string => url !== undefined)
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
            return { ok: false, error: { type: "database", message: result.error.raw.message ?? "Insert failed" } }
        }
        if (!result.data) {
            return { ok: false, error: { type: "database", message: "Insert succeeded but no data returned" } }
        }

        const commission = result.data;

        // Post-insert: Handle direct upload files (move out of temp, update DB, create relation)
        if (image_submit_option === "direct_upload" && direct_upload_images && direct_upload_images.length > 0) {
            console.log(`[COMMISSION CREATION] Processing ${direct_upload_images.length} direct upload images for commission ${commission.id}`);
            const supabase = await createClient();

            for (const image of direct_upload_images) {
                try {
                    // 1. Move the file in storage from temp/ to submitted/{commission_id}/
                    const newPath = `${SUBMITTED_UPLOAD_FOLDER}/${commission.id}/${image.filename}`;
                    console.log(`[COMMISSION CREATION] Moving file from ${image.storage_path} to ${newPath}`);
                    const moveResult = await moveFile(supabase, COMMISSION_REFERENCE_IMAGES_BUCKET, image.storage_path, newPath);

                    if (moveResult.ok) {
                        console.log(`[COMMISSION CREATION] Successfully moved file`);
                        // 2. Update the files table with the new storage path
                        await updateFileRecord(supabase, { storage_path: newPath }, image.id);
                    } else {
                        console.error(`[COMMISSION CREATION] Failed to move file ${image.filename} in storage:`, moveResult.error);
                        // We intentionally don't throw - the commission is valid, just the file housekeeping failed
                    }

                    // 3. Create the file relation linking the file to the commission
                    await insertFileRelation(supabase, {
                        file_id: image.id,
                        related_table: "commissions",
                        related_id: commission.id,
                        relation_type: "reference_image"
                    });
                } catch (e) {
                    console.error(`Error processing post-insert for file ${image.filename}:`, e);
                }
            }
        }

        return { ok: true, data: commission }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}