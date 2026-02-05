import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { cn } from "@/lib/utils"

export default function ImageWithPreview({ src, alt, previewClassName }: { src: string, alt: string, previewClassName?: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img title="Preview Image" src={src} alt={alt} className={cn("w-full h-full object-cover cursor-pointer", previewClassName)} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="sr-only">
                    <DialogTitle>{alt}</DialogTitle>
                    <DialogDescription>
                        Image preview of {alt}
                    </DialogDescription>
                </DialogHeader>
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            </DialogContent>
        </Dialog>
    )
}