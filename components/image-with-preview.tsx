import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { cn } from "@/lib/utils"

export default function ImageWithPreview({ src, alt, previewClassName }: { src: string, alt: string, previewClassName?: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-fit cursor-pointer rounded-md overflow-hidden">
                    <img title="Preview Image" src={src} alt={alt} className={cn("w-full h-full object-cover", previewClassName)} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm"><Eye /></span>
                    </div>
                </div>
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