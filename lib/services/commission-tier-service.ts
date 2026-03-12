import { ADMIN_IMAGES_BUCKET, SUBMITTED_UPLOAD_FOLDER } from "../constants/files";
import { insertCommissionTier, updateCommissionTier } from "../repositories/commission-tier-repo";
import { moveFile } from "../repositories/storage-repo";
import { insertFileRelation } from "../repositories/file-relation-repo";
import { updateFileRecord } from "../repositories/db-file-repo";
import { createClient } from "../supabase/server";
import { CommissionTier, CommissionTierInsert, CommissionTierUpdate } from "../types/commission-tier";
import { FormOutput } from "../validations/commission-tier";

export async function createCommissionTier(data: FormOutput) {
    const {
        thumbnail,
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant
    } = data

    const commissionTierInsert: CommissionTierInsert = {
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant,
        thumbnail_url: thumbnail?.publicUrl || null
    }

    try {
        const result = await insertCommissionTier(commissionTierInsert)
        if (!result.ok) {
            return { ok: false, error: { type: "database", message: result.error.raw.message ?? "Insert failed" } }
        }
        if (!result.data) {
            return { ok: false, error: { type: "database", message: "Insert succeeded but no data returned" } }
        }

        const tier = result.data

        if (thumbnail) {
            const supabase = await createClient()
            try {
                // 1. Move file out of temp folder to submitted/tier_{id}/{filename}
                const newPath = `${SUBMITTED_UPLOAD_FOLDER}/tier_${tier.id}/${thumbnail.filename}`;
                const moveResult = await moveFile(supabase, ADMIN_IMAGES_BUCKET, thumbnail.storage_path, newPath)

                if (!moveResult.ok) {
                    return { ok: false, error: { type: "storage", message: moveResult.error.raw.message ?? "Move failed" } }
                }

                // 2. Update DB record for the file
                const updateFileResult = await updateFileRecord(supabase, { storage_path: newPath }, thumbnail.id);
                if (!updateFileResult.ok) {
                    return { ok: false, error: { type: "database", message: updateFileResult.error.raw.message ?? "Update failed" } }
                }

                // 3. Create file relation
                const insertFileRelationResult = await insertFileRelation(supabase, {
                    file_id: thumbnail.id,
                    related_table: "commission_tiers",
                    related_id: tier.id,
                    relation_type: "thumbnail"
                })
                if (!insertFileRelationResult.ok) {
                    return { ok: false, error: { type: "database", message: insertFileRelationResult.error.raw.message ?? "Insert failed" } }
                }

                const commissionTierUpdate: CommissionTierUpdate = {
                    ...tier,
                    thumbnail_url: moveResult.data.publicUrl
                }
                const updateCommissionTierResult = await updateCommissionTier(commissionTierUpdate, tier.id)
                if (!updateCommissionTierResult.ok) {
                    return { ok: false, error: { type: "database", message: updateCommissionTierResult.error.raw.message ?? "Update failed" } }
                }
            } catch (e) {
                console.error(`Post-insert housekeeping failed for tier ${tier.id}`, e)
            }
        }

        return { ok: true, data: tier }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}

export async function editCommissionTier(data: FormOutput, commissionTier: CommissionTier) {
    const {
        thumbnail,
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant
    } = data

    const hasNewThumbnail = !!thumbnail && thumbnail.publicUrl !== commissionTier.thumbnail_url

    const commissionTierInsert: CommissionTierInsert = {
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant,
        thumbnail_url: thumbnail?.publicUrl || commissionTier.thumbnail_url
    }

    try {
        const result = await updateCommissionTier(commissionTierInsert, commissionTier.id)
        if (!result.ok) {
            return { ok: false, error: { type: "database", message: result.error.raw.message ?? "Update failed" } }
        }
        if (!result.data) {
            return { ok: false, error: { type: "database", message: "Update succeeded but no data returned" } }
        }

        const tier = result.data

        if (hasNewThumbnail && thumbnail) {
            const supabase = await createClient()
            try {
                // 1. Move new file out of temp
                const newPath = `${SUBMITTED_UPLOAD_FOLDER}/tier_${tier.id}/${thumbnail.filename}`;
                const moveResult = await moveFile(supabase, ADMIN_IMAGES_BUCKET, thumbnail.storage_path, newPath)

                if (!moveResult.ok) {
                    return { ok: false, error: { type: "storage", message: moveResult.error.raw.message ?? "Move failed" } }
                }

                // 2. Update DB record for the file
                const updateFileResult = await updateFileRecord(supabase, { storage_path: newPath }, thumbnail.id);
                if (!updateFileResult.ok) {
                    return { ok: false, error: { type: "database", message: updateFileResult.error.raw.message ?? "Update failed" } }
                }

                // 3. Create relation
                await insertFileRelation(supabase, {
                    file_id: thumbnail.id,
                    related_table: "commission_tiers",
                    related_id: tier.id,
                    relation_type: "thumbnail"
                })

                //TODO: Update thumbnail_url in commission_tiers table
                const commissionTierUpdate: CommissionTierUpdate = {
                    ...tier,
                    thumbnail_url: moveResult.data.publicUrl
                }
                await updateCommissionTier(commissionTierUpdate, tier.id)
            } catch (e) {
                console.error(`Post-update housekeeping failed for tier ${tier.id}`, e)
            }
        }

        return { ok: true, data: tier }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}