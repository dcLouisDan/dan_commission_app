"use server"

import { createCommissionTier, editCommissionTier } from "@/lib/services/commission-tier-service"
import { CommissionTier } from "@/lib/types/commission-tier"
import { FormOutput } from "@/lib/validations/commission-tier"

export async function createCommissionTierAction(tier: FormOutput) {
    return await createCommissionTier(tier)
}

export async function editCommissionTierAction(tier: FormOutput, commissionTier: CommissionTier) {
    return await editCommissionTier(tier, commissionTier)
}