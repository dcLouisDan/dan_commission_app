"use server"

import { createCommission } from "@/lib/services/commission-service";
import { FormOutput } from "@/lib/validations/commission";

export async function createCommissionAction(data: FormOutput) {
    return await createCommission(data)
}