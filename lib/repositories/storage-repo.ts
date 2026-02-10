import { createClient } from "../supabase/server";
import { DbResult, StorageData, StorageSummary } from "../types/response";

export async function uploadFile(file: File, bucket: string, folderName?: string): Promise<DbResult<StorageData>> {
    const supabase = await createClient();
    try {
        const fileName = folderName ? `${folderName}/${file.name}` : file.name;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        if (error) {
            return { ok: false, error: { type: "storage", raw: error } }
        }
        if (!data) {
            return { ok: false, error: { type: "storage", raw: new Error("No data returned from storage upload") } }
        }
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        return { ok: true, data: { ...data, publicUrl: publicUrlData.publicUrl } };
    } catch (error) {
        return { ok: false, error: { type: "storage", raw: error as Error } }
    }
}

export async function deleteFiles(paths: string[], bucket: string): Promise<DbResult<void>> {
    const supabase = await createClient();
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove(paths);
        if (error) {
            return { ok: false, error: { type: "storage", raw: error } }
        }
        return { ok: true, data: undefined };
    } catch (error) {
        return { ok: false, error: { type: "storage", raw: error as Error } }
    }
}

export async function uploadMultipleFiles(files: File[], bucket: string, folderName?: string): Promise<DbResult<StorageSummary>> {
    // Filter duplicates
    const uniqueFiles = files.filter((file, index) => files.findIndex(f => f.name === file.name) === index);

    // Upload files
    const data = await Promise.all(uniqueFiles.map(file => uploadFile(file, bucket, folderName)));

    const summary = summarize(data);
    return { ok: true, data: summary };
}

function summarize(data: DbResult<StorageData>[]): StorageSummary {
    const success_count = data.filter(item => item.ok).length || 0;
    const failed_count = data.filter(item => !item.ok).length || 0;
    const total_count = data.length || 0;
    const failed_files = data.filter(item => !item.ok).map(item => item.error?.raw.message) || [];
    const success_files = data.filter(item => item.ok).map(item => item.data?.fullPath) || [];
    const success_public_urls = data.filter(item => item.ok).map(item => item.data?.publicUrl).filter(url => url !== undefined) || [];
    return { success_count, failed_count, total_count, failed_files, success_files, success_public_urls };
}