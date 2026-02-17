import { CommissionTier, CommissionTierInsert, CommissionTierUpdate } from "../types/commission-tier";
import { createClient } from "../supabase/server";
import { DbResult } from "../types/response";

const COMMISSION_TIER_TABLE = "commission_tiers"

export async function getCommissionTiers(): Promise<DbResult<CommissionTier[] | null>> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.from(COMMISSION_TIER_TABLE).select("*")
        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }
        return { ok: true, data: data as CommissionTier[] }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function insertCommissionTier(tier: CommissionTierInsert): Promise<DbResult<CommissionTier | null>> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.from(COMMISSION_TIER_TABLE).insert(tier).select("*").single()
        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }
        if (!data) {
            return { ok: false, error: { type: "unknown", raw: new Error("No data returned") } }
        }
        return { ok: true, data: data as CommissionTier }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function updateCommissionTier(tier: CommissionTierUpdate, id: string): Promise<DbResult<CommissionTier | null>> {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase.from(COMMISSION_TIER_TABLE).update(tier).eq("id", id).select("*").single()
        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }
        if (!data) {
            return { ok: false, error: { type: "unknown", raw: new Error("No data returned") } }
        }
        return { ok: true, data: data as CommissionTier }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function deleteCommissionTier(id: string): Promise<DbResult<null>> {
    const supabase = await createClient()
    try {
        const { error } = await supabase.from(COMMISSION_TIER_TABLE).delete().eq("id", id)
        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }
        return { ok: true, data: null }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}
