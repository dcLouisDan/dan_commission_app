import { createClient } from "../supabase/server";
import { Commission, CommissionInsert } from "../types/commission";
import { DbResult } from "../types/response";

export async function insertCommission(data: CommissionInsert): Promise<DbResult<Commission | null>> {
    const supabase = await createClient()
    try {
        const { error, data: commission } = await supabase.from("commissions").insert([data]).select("*").single()

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: commission }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}