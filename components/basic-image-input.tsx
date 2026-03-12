"use client"
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import ImageWithPreview from "./image-with-preview";
import { UploadedImage } from "@/lib/validations/commission";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ADMIN_IMAGES_BUCKET } from "@/lib/constants/files";
import { Loader2, X, UploadCloud } from "lucide-react";

export default function BasicImageInput({ image, setImage, defaultPreviewSrc }: { image: UploadedImage | null, setImage: (image: UploadedImage | null) => void, defaultPreviewSrc?: string | null }) {
    const { uploadImages, loadingMap } = useImageUpload("ADMIN_IMAGES_BUCKET");

    const imagePreviewUrl = useMemo(() => image?.publicUrl ? image.publicUrl : defaultPreviewSrc, [image, defaultPreviewSrc]);

    const onDrop = useMemo(() => {
        return async (acceptedFiles: File[]) => {
            // For a single image input, we don't retain previous images.
            const uploadedFiles = await uploadImages(acceptedFiles, []);
            if (uploadedFiles && uploadedFiles.length > 0) {
                // Since this component historically only accepted 1 image (BasicImageInput),
                // we'll just take the first uploaded successfully.
                setImage(uploadedFiles[0]);
            }
        }
    }, [uploadImages, setImage])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

    // Any value in the map means something is uploading
    const isUploading = Object.keys(loadingMap).length > 0;

    if (imagePreviewUrl) {
        return (
            <div className="flex items-center justify-center w-full h-full relative border border-dashed rounded-md min-h-[200px] overflow-hidden">
                <ImageWithPreview
                    src={imagePreviewUrl}
                    alt="Image"
                    previewClassName="object-cover border-2 overflow-hidden"
                />
                <button title="Remove image" type="button" onClick={() => setImage(null)} className="cursor-pointer absolute top-2 right-2 bg-destructive text-white rounded-full p-1"><X /></button>
            </div>
        )
    }

    return (
        <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-full relative border border-dashed rounded-md min-h-[200px] overflow-hidden group hover:border-primary transition-colors cursor-pointer bg-muted/20">
            <input {...getInputProps()} />
            {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-foreground/70">Uploading...</p>
                </div>
            ) : isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-2 text-primary">
                    <UploadCloud className="w-8 h-8 animate-bounce" />
                    <p className="font-semibold">Drop the image here ...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-foreground/60 group-hover:text-primary transition-colors">
                    <UploadCloud className="w-8 h-8" />
                    <p className="font-medium text-sm">Drag & drop an image, or click to select</p>
                </div>
            )}
        </div>
    )
}