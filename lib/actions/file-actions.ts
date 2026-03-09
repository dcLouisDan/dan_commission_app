"use server";

import { createClient } from "../supabase/server";
import { insertFileRecord } from "../repositories/db-file-repo";
import { insertFileRelation } from "../repositories/file-relation-repo";
import { DbFileInsert, DbFile } from "../types/db-file";
import { FileRelationInsert, FileRelation } from "../types/file-relation";
import { ServiceResult } from "../types/response";

export async function saveFileRecordAction(file: DbFileInsert): Promise<ServiceResult<DbFile>> {
    try {
        const supabase = await createClient();
        const result = await insertFileRecord(supabase, file);

        if (!result.ok) {
            return { ok: false, error: { type: "database", message: result.error.raw.message || "Failed to save file record" } };
        }
        return { ok: true, data: result.data };
    } catch (e: any) {
        return { ok: false, error: { type: "unknown", message: e.message } };
    }
}

export async function saveFileRelationAction(fileRelation: FileRelationInsert): Promise<ServiceResult<FileRelation | null>> {
    try {
        const supabase = await createClient();
        const result = await insertFileRelation(supabase, fileRelation);

        if (!result.ok) {
            return { ok: false, error: { type: "database", message: result.error.raw.message || "Failed to save file relation" } };
        }
        return { ok: true, data: result.data };
    } catch (e: any) {
        return { ok: false, error: { type: "unknown", message: e.message } };
    }
}
