"use client"
import { Plus, Upload, X } from "lucide-react";
import { useMemo } from "react";
import { useDropzone } from 'react-dropzone'
import ImageWithPreview from "./image-with-preview";
import { UploadedImage } from "@/lib/validations/commission";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Spinner } from "./ui/spinner";

const MAX_IMAGE_SIZE = 1024 * 1024 * 10;
const MAX_IMAGE_COUNT = 10;
const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

export default function MultiImageUploadInput({ images, setImages }: { images: UploadedImage[], setImages: (images: UploadedImage[]) => void }) {
    const imagePreviewUrls = useMemo(() => images.map((image) => image.publicUrl), [images]);
    const { uploadImages, loadingMap } = useImageUpload("COMMISSION_REFERENCE_IMAGES_BUCKET");

    const onDrop = async (acceptedFiles: File[]) => {
        const updatedImages = await uploadImages(acceptedFiles, images);
        setImages(updatedImages);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": ALLOWED_IMAGE_EXTENSIONS
        },
        maxSize: MAX_IMAGE_SIZE,
        maxFiles: MAX_IMAGE_COUNT,
    })
    return (
        <div className="w-full h-fit min-h-[200px] relative">
            {images.length === 0 && <div {...getRootProps()} className="w-full h-fit min-h-[200px] border-2 border-dashed rounded-md absolute inset-0 z-50">
                <input {...getInputProps()} />
                {isDragActive && <DragActiveState />}
            </div>}
            {images.length === 0 && !isDragActive && <EmptyState />}
            {images.length > 0 && (
                <div className="w-full h-fit min-h-[200px] border-2 border-dashed rounded-md relative grid grid-cols-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative h-32 w-32"
                        >
                            <ImageWithPreview
                                src={imagePreviewUrls[index] ?? ""}
                                alt={`Image ${index + 1}`}
                                previewClassName="object-cover border-2 overflow-hidden"
                            />
                            <button title="Remove image" type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="cursor-pointer absolute top-1 right-1 bg-destructive text-white rounded-full p-1"><X /></button>
                        </div>
                    ))}
                    {
                        Object.values(loadingMap).map((isLoading, index) => (

                            <div
                                key={index}
                                className="flex items-center justify-center bg-secondary h-32 w-32"
                            >
                                <Spinner />
                            </div>
                        ))
                    }
                    <div {...getRootProps()} className="h-32 w-32 border-2  rounded-md">
                        <input {...getInputProps()} />
                        {isDragActive ? <DragActiveState /> : <div className="flex flex-col items-center justify-center bg-background/50 h-full">
                            <Plus className="w-10 h-10 mb-2" />
                            <p className="text-xs text-center text-muted-foreground">PNG, JPG, WEBP</p>
                            <p className="text-xs text-center text-muted-foreground">(max {MAX_IMAGE_SIZE / 1024 / 1024}MB)</p>
                        </div>}
                    </div>
                </div>
            )}
        </div>
    )
}

function DragActiveState() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-background">
            <Upload className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">Drop files here</p>
            <p className="text-xs text-center text-muted-foreground">PNG, JPG, PDF up to {MAX_IMAGE_SIZE / 1024 / 1024}MB</p>
        </div>
    )
}

function EmptyState({ props, children }: { props?: React.HTMLAttributes<HTMLDivElement>, children?: React.ReactNode }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md">
            <Upload className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-center text-muted-foreground">PNG, JPG, PDF up to {MAX_IMAGE_SIZE / 1024 / 1024}MB</p>
        </div>
    )
}