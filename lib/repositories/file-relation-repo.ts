import { FILE_RELATION_TABLE } from "../constants/files";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { FileRelationInsert, FileRelation, FileRelationUpdate, FileRelatedTable } from "../types/file-relation";
import { DbResult } from "../types/response";


export async function insertFileRelation(supabase: SupabaseClient<Database>, fileRelation: FileRelationInsert): Promise<DbResult<FileRelation | null>> {
    try {
        const { data, error } = await supabase
            .from(FILE_RELATION_TABLE)
            .insert([fileRelation])
            .select()
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } };
        }

        return { ok: true, data: data as FileRelation };
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } };
    }
}

export async function deleteFileRelation(supabase: SupabaseClient<Database>, id: string): Promise<DbResult<null>> {
    try {
        const { error } = await supabase
            .from(FILE_RELATION_TABLE)
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

export async function updateFileRelation(supabase: SupabaseClient<Database>, fileRelation: FileRelationUpdate, id: string): Promise<DbResult<FileRelation | null>> {
    try {
        const { data, error } = await supabase
            .from(FILE_RELATION_TABLE)
            .update(fileRelation)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: data as FileRelation }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function getFileRelationByRelatedRecord(supabase: SupabaseClient<Database>, relatedTable: FileRelatedTable, relatedRecordId: string): Promise<DbResult<FileRelation | null>> {
    try {
        const { data, error } = await supabase
            .from(FILE_RELATION_TABLE)
            .select("*")
            .eq("related_table", relatedTable)
            .eq("related_record_id", relatedRecordId)
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: data as FileRelation }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}

export async function getFileRelationByRelatedFile(supabase: SupabaseClient<Database>, relatedFileId: string): Promise<DbResult<FileRelation | null>> {
    try {
        const { data, error } = await supabase
            .from(FILE_RELATION_TABLE)
            .select("*")
            .eq("related_file_id", relatedFileId)
            .single();

        if (error) {
            return { ok: false, error: { type: "database", raw: error } }
        }

        return { ok: true, data: data as FileRelation }
    } catch (error) {
        return { ok: false, error: { type: "unknown", raw: error as Error } }
    }
}