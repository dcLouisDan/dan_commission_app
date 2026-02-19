import { STORAGE_BUCKETS } from "../constants/files";
import { deleteFiles, uploadFile as uploadFileRepo } from "../repositories/storage-repo";
import { insertFileRecord } from "../repositories/db-file-repo";
import { insertFileRelation } from "../repositories/file-relation-repo";
import { FileRelatedTable, FileRelationInsert } from "../types/file-relation";
import { DbFileInsert } from "../types/db-file";

type BucketId = typeof STORAGE_BUCKETS[number]

export async function uploadFile(file: File, bucket: BucketId, folderName: string, metadata: Record<string, string>, isPublic: boolean = false) {
    var filePath: string | null = null
    try {
        const result = await uploadFileRepo(file, bucket, folderName)
        if (!result.ok) {
            return { ok: false, error: { type: "storage", message: result.error.raw.message } }
        }
        filePath = result.data!.fullPath

        const fileRecordInsert: DbFileInsert = {
            bucket_id: bucket,
            filename: file.name,
            storage_path: result.data!.fullPath,
            size_bytes: file.size,
            content_type: file.type,
            metadata: metadata,
            is_public: isPublic
        }

        const fileRecord = await insertFileRecord(fileRecordInsert)
        if (!fileRecord.ok) {
            await deleteFiles([filePath], bucket)
            return { ok: false, error: { type: "database", message: fileRecord.error.raw.message } }
        }

        return { ok: true, data: fileRecord.data }
    } catch (error) {
        const err = error as Error
        if (filePath) {
            await deleteFiles([filePath], bucket)
        }
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}

export async function linkFileToRecord(fileId: string, relatedTable: FileRelatedTable, relatedRecordId: string, relationType: string) {
    try {
        const fileRelationInsert: FileRelationInsert = {
            file_id: fileId,
            related_table: relatedTable,
            related_id: relatedRecordId,
            relation_type: relationType
        }
        const fileRelation = await insertFileRelation(fileRelationInsert)
        if (!fileRelation.ok) {
            return { ok: false, error: { type: "database", message: fileRelation.error.raw.message } }
        }
        return { ok: true, data: fileRelation.data }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}