import { createClient } from "../supabase/client";
import { DbFileInsert, DbFile, DbFileUpdate } from "../types/db-file";
import { DbResult } from "../types/response";

export const DB_FILE_TABLE = 'files';

export async function insertFileRecord(file: DbFileInsert): Promise<DbResult<DbFile | null>> {
    const supabase = createClient()

    try {
        const { data, error } = await supabase
            .from(DB_FILE_TABLE)
            .insert([file])
            .select()
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: data as DbFile }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function updateFileRecord(file: DbFileUpdate, id: string): Promise<DbResult<DbFile | null>> {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from(DB_FILE_TABLE)
            .update(file)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: data as DbFile }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function deleteFileRecord(id: string): Promise<DbResult<null>> {
    const supabase = createClient()
    try {
        const { error } = await supabase
            .from(DB_FILE_TABLE)
            .delete()
            .eq("id", id)

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: null }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}