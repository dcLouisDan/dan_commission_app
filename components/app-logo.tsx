import { APP_NAME } from "@/lib/constants/app";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FONTS } from "@/lib/constants/fonts";

export default function AppLogo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", FONTS.libreBaskerville.className, className)}>
            <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>
    );
}