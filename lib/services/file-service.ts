import { STORAGE_BUCKETS } from "../constants/files";
import { deleteFiles, uploadFile as uploadFileRepo } from "../repositories/storage-repo";
import { saveFileRecordAction, saveFileRelationAction } from "../actions/file-actions";
import { FileRelatedTable, FileRelationInsert } from "../types/file-relation";
import { DbFileInsert, FileServiceResult } from "../types/db-file";

type BucketId = keyof typeof STORAGE_BUCKETS

export async function uploadFile(file: File, bucket: BucketId, folderName: string, metadata: Record<string, string> = {}, isPublic: boolean = true): Promise<FileServiceResult> {
    var filePath: string | null = null
    try {
        const actualBucketName = STORAGE_BUCKETS[bucket];
        const result = await uploadFileRepo(file, actualBucketName, folderName)
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

        const fileRecord = await saveFileRecordAction(fileRecordInsert)
        if (!fileRecord.ok) {
            await deleteFiles([filePath], actualBucketName)
            return { ok: false, error: { type: "database", message: fileRecord.error?.message || "No data returned from database" } }
        }

        return { ok: true, data: { ...fileRecord.data, publicUrl: result.data.publicUrl } }
    } catch (error) {
        const err = error as Error
        if (filePath) {
            await deleteFiles([filePath], STORAGE_BUCKETS[bucket])
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
        const fileRelation = await saveFileRelationAction(fileRelationInsert)
        if (!fileRelation.ok) {
            return { ok: false, error: { type: "database", message: fileRelation.error.message } }
        }
        return { ok: true, data: fileRelation.data }
    } catch (error) {
        const err = error as Error
        return { ok: false, error: { type: "unknown", message: err.message } }
    }
}