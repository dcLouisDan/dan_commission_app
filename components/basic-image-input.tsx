
"use client"
import { MAX_IMAGE_SIZE } from "@/lib/constants/commision-form";
import { Upload, X } from "lucide-react";
import { useMemo } from "react";
import { useDropzone } from 'react-dropzone'
import ImageWithPreview from "./image-with-preview";

export default function BasicImageInput({ image, setImage }: { image: File | null, setImage: (image: File | null) => void }) {
    const imagePreviewUrl = useMemo(() => image ? URL.createObjectURL(image) : null, [image]);
    const onDrop = useMemo(() => {
        return (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            setImage(file)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    if (image && imagePreviewUrl) {
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
        <div {...getRootProps()} className="flex items-center justify-center w-full h-full relative border border-dashed rounded-md min-h-[200px]">
            {isDragActive && <DragActiveState />}
            <input {...getInputProps()} />
            {!image && !isDragActive && <EmptyState />}

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