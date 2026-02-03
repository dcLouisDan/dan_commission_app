import { Upload } from "lucide-react";

export default function MultImageInput() {
    return (
        <div className="w-full h-fit min-h-[200px] border-2 border-dashed rounded-md relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 mb-2" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
            </div>
        </div>
    )
}