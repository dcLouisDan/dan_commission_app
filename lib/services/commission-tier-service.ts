import { insertCommissionTier, updateCommissionTier } from "../repositories/commission-tier-repo";
import { deleteFiles, uploadFile } from "../repositories/storage-repo";
import { CommissionTier, CommissionTierInsert } from "../types/commission-tier";
import { FormOutput } from "../validations/commission-tier";

const BUCKET_NAME = process.env.NEXT_ADMIN_IMAGES_BUCKET ?? "admin_images";
const FOLDER_NAME = "commission_tiers";

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

    var thumbnailPath: string | null = null

    if (thumbnail) {
        const result = await uploadFile(thumbnail, BUCKET_NAME, FOLDER_NAME)
        if (!result.ok) {
            return { ok: false, error: { type: "storage", message: result.error.raw.message } }
        }
        thumbnailPath = result.data!.fullPath
    }

    const commissionTierInsert: CommissionTierInsert = {
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant,
        thumbnail_url: thumbnailPath
    }

    try {
        const result = await insertCommissionTier(commissionTierInsert)
        if (!result.ok) {
            if (thumbnailPath) {
                await deleteFiles([thumbnailPath], BUCKET_NAME)
            }
            return { ok: false, error: { type: "database", message: result.error.raw.message } }
        }
        return { ok: true, data: result.data! }
    } catch (error) {
        const err = error as Error
        if (thumbnailPath) {
            await deleteFiles([thumbnailPath], BUCKET_NAME)
        }
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

    var thumbnailPath: string | null = null

    if (thumbnail) {
        const result = await uploadFile(thumbnail, BUCKET_NAME, FOLDER_NAME)
        if (!result.ok) {
            return { ok: false, error: { type: "storage", message: result.error.raw.message } }
        }
        thumbnailPath = result.data!.fullPath
    }

    const commissionTierInsert: CommissionTierInsert = {
        category,
        description,
        is_active,
        price_php,
        price_usd,
        slot_limit,
        variant,
        thumbnail_url: thumbnailPath
    }

    try {
        const result = await updateCommissionTier(commissionTierInsert, commissionTier.id)
        if (!result.ok) {
            if (thumbnailPath) {
                await deleteFiles([thumbnailPath], BUCKET_NAME)
            }
            return { ok: false, error: { type: "database", message: result.error.raw.message } }
        }
        if (commissionTier.thumbnail_url) {
            await deleteFiles([commissionTier.thumbnail_url], BUCKET_NAME)
        }
        return { ok: true, data: result.data! }
    } catch (error) {
        const err = error as Error
        if (thumbnailPath) {
            await deleteFiles([thumbnailPath], BUCKET_NAME)
        }
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}