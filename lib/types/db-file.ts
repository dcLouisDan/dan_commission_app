import { Database } from "./supabase";

export type DbFile = Database['public']['Tables']['files']['Row'];

export type DbFileInsert = Database['public']['Tables']['files']['Insert'];

export type DbFileUpdate = Database['public']['Tables']['files']['Update'];