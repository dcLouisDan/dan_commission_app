import { ServiceResult } from "./response";
import { Database } from "./supabase";

export type DbFile = Database['public']['Tables']['files']['Row'];

export type DbFileInsert = Database['public']['Tables']['files']['Insert'];

export type DbFileUpdate = Database['public']['Tables']['files']['Update'];
export type FileServiceData = DbFile & { publicUrl?: string }
export type FileServiceResult = ServiceResult<FileServiceData>