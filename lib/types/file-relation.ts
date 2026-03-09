import { FILE_RELATED_TABLES } from "../constants/files";
import { Database } from "./supabase";

export type FileRelation = Database['public']['Tables']['file_relations']['Row'];

export type FileRelationInsert = Database['public']['Tables']['file_relations']['Insert'];

export type FileRelationUpdate = Database['public']['Tables']['file_relations']['Update'];

export type FileRelatedTable = keyof typeof FILE_RELATED_TABLES;