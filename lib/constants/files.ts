import { COMMISSIONS_TABLE } from "../repositories/commission-repo";
import { FILE_RELATION_TABLE } from "../repositories/file-relation-repo";
import { COMMISSION_REFERENCE_IMAGES_BUCKET } from "../services/commission-service";
import { ADMIN_IMAGES_BUCKET } from "../services/commission-tier-service";

export const FILE_RELATED_TABLES = [
    COMMISSIONS_TABLE,
    FILE_RELATION_TABLE,
] as const;

export const STORAGE_BUCKETS = [
    ADMIN_IMAGES_BUCKET,
    COMMISSION_REFERENCE_IMAGES_BUCKET
] as const;