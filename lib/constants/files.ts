
export const COMMISSIONS_TABLE = "commissions"
export const COMMISSION_REFERENCE_IMAGES_BUCKET = process.env.NEXT_COMMISSION_REFERENCE_BUCKET ?? "commission_reference_images";
export const ADMIN_IMAGES_BUCKET = process.env.NEXT_ADMIN_IMAGES_BUCKET ?? "admin_images";
export const FILE_RELATION_TABLE = 'file_relations';
export const FILE_RELATED_TABLES = {
    COMMISSIONS_TABLE,
    FILE_RELATION_TABLE,
} as const;

export const STORAGE_BUCKETS = {
    ADMIN_IMAGES_BUCKET,
    COMMISSION_REFERENCE_IMAGES_BUCKET
} as const;

export const TEMP_UPLOAD_FOLDER = "temp";
export const SUBMITTED_UPLOAD_FOLDER = "submitted";
export const APPROVED_UPLOAD_FOLDER = "approved";
