import { PostgrestError } from "@supabase/supabase-js";

export type DbResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: DbError };

export type DbError = {
    type: "auth" | "not_found" | "validation" | "unknown" | "database"
    raw: PostgrestError | Error
}

export type ServiceResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ServiceError }

export type ServiceError = {
    type: "validation" | "unknown" | "database"
    message: string
}