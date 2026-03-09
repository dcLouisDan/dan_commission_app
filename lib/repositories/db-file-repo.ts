import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { DbFileInsert, DbFile, DbFileUpdate } from "../types/db-file";
import { DbResult } from "../types/response";

export const DB_FILE_TABLE = 'files';

export async function insertFileRecord(supabase: SupabaseClient<Database>, file: DbFileInsert): Promise<DbResult<DbFile>> {

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

export async function updateFileRecord(supabase: SupabaseClient<Database>, file: DbFileUpdate, id: string): Promise<DbResult<DbFile>> {
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

export async function deleteFileRecord(supabase: SupabaseClient<Database>, id: string): Promise<DbResult<null>> {
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