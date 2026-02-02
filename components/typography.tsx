import { FONTS } from "@/lib/constants/fonts";
import { cn } from "@/lib/utils";

const HEADER_FONT = FONTS.hubotSans;

export function TypographyH1({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h1 className={cn(HEADER_FONT.className, "text-4xl font-bold", className)}>
            {children}
        </h1>
    );
}

export function TypographyH2({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h2 className={cn(HEADER_FONT.className, "text-3xl font-bold", className)}>
            {children}
        </h2>
    );
}

export function TypographyH3({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h3 className={cn(HEADER_FONT.className, "text-2xl font-bold", className)}>
            {children}
        </h3>
    );
}

export function TypographyH4({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h4 className={cn(HEADER_FONT.className, "text-xl font-bold", className)}>
            {children}
        </h4>
    );
}

export function TypographyH5({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h5 className={cn(HEADER_FONT.className, "text-lg font-bold", className)}>
            {children}
        </h5>
    );
}

export function TypographyH6({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h6 className={cn(HEADER_FONT.className, "text-base font-bold", className)}>
            {children}
        </h6>
    );
}
