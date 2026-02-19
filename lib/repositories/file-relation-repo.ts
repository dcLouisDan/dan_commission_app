import { createClient } from "../supabase/client";
import { FileRelationInsert, FileRelation, FileRelationUpdate, FileRelatedTable } from "../types/file-relation";
import { DbResult } from "../types/response";

export const FILE_RELATION_TABLE = 'file_relations';

export async function insertFileRelation(fileRelation: FileRelationInsert): Promise<DbResult<FileRelation | null>> {
    const supabase = createClient()
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

export async function deleteFileRelation(id: string): Promise<DbResult<null>> {
    const supabase = createClient()
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

export async function updateFileRelation(fileRelation: FileRelationUpdate, id: string): Promise<DbResult<FileRelation | null>> {
    const supabase = createClient()
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

export async function getFileRelationByRelatedRecord(relatedTable: FileRelatedTable, relatedRecordId: string): Promise<DbResult<FileRelation | null>> {
    const supabase = createClient()
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

export async function getFileRelationByRelatedFile(relatedFileId: string): Promise<DbResult<FileRelation | null>> {
    const supabase = createClient()
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