import { useState } from "react";
import { uploadFile as uploadFileToStorage } from "@/lib/repositories/storage-repo";
import { saveFileRecordAction } from "@/lib/actions/file-actions";
import { deleteFiles } from "@/lib/repositories/storage-repo";
import { STORAGE_BUCKETS, TEMP_UPLOAD_FOLDER } from "@/lib/constants/files";
import { UploadedImage } from "@/lib/validations/commission";
import { toast } from "sonner";

type BucketId = keyof typeof STORAGE_BUCKETS;

export function useImageUpload(bucket: BucketId) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const actualBucketName = STORAGE_BUCKETS[bucket];

    const uploadImages = async (
        acceptedFiles: File[],
        currentImages: UploadedImage[]
    ): Promise<UploadedImage[]> => {
        const results = await Promise.allSettled(
            acceptedFiles.map(async (file): Promise<UploadedImage> => {
                const fileName = file.name;
                setLoadingMap((prev) => ({ ...prev, [fileName]: true }));

                try {
                    // Step 1: Upload file bytes directly from the browser to Supabase Storage.
                    // This bypasses the Next.js Server Action body size limit entirely.
                    const storageResult = await uploadFileToStorage(
                        file,
                        actualBucketName,
                        TEMP_UPLOAD_FOLDER
                    );
                    if (!storageResult.ok) {
                        throw new Error(storageResult.error.raw.message);
                    }

                    // Step 2: Save the metadata record via Server Action.
                    // Only tiny JSON is sent through the server boundary — no size concern.
                    const fileRecord = await saveFileRecordAction({
                        bucket_id: actualBucketName,
                        filename: file.name,
                        storage_path: storageResult.data.fullPath,
                        size_bytes: file.size,
                        content_type: file.type,
                        metadata: {},
                        is_public: true,
                    });

                    if (!fileRecord.ok) {
                        // Roll back: remove the orphaned file from storage
                        await deleteFiles(
                            [storageResult.data.fullPath],
                            actualBucketName
                        );
                        throw new Error(
                            fileRecord.error?.message ??
                            "Failed to save file record"
                        );
                    }

                    return {
                        id: fileRecord.data.id,
                        publicUrl: storageResult.data.publicUrl,
                        filename: fileRecord.data.filename,
                        size_bytes: fileRecord.data.size_bytes,
                        storage_path: fileRecord.data.storage_path,
                    };
                } finally {
                    setLoadingMap((prev) => {
                        const next = { ...prev };
                        delete next[fileName];
                        return next;
                    });
                }
            })
        );

        const uploadedImages: UploadedImage[] = [];
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                uploadedImages.push(result.value);
            } else {
                toast.error(
                    `Error uploading ${acceptedFiles[index].name}: ${result.reason?.message ?? "Unknown error"}`
                );
                console.error(result.reason);
            }
        });

        return [...currentImages, ...uploadedImages];
    };

    return { uploadImages, loadingMap };
}
