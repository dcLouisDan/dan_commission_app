import { PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

export type DbResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: DbError };

export type DbError = {
    type: "auth" | "not_found" | "validation" | "unknown" | "database" | "storage"
    raw: PostgrestError | StorageError | Error
}

export type ServiceResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ServiceError }

export type ServiceError = {
    type: "validation" | "unknown" | "database" | "storage"
    message: string
}

export type StorageData = {
    id: string;
    path: string;
    fullPath: string;
    publicUrl?: string;
}

export type StorageSummary = {
    success_count: number;
    failed_count: number;
    total_count: number;
    failed_files: string[];
    success_files: string[];
    success_public_urls?: string[];
}