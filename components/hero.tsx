import { APP_HERO_TAGLINE } from "@/lib/constants/app";
import { cn } from "@/lib/utils";
import { FONTS } from "@/lib/constants/fonts";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">

      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className={cn("text-3xl lg:text-4xl leading-tight! mx-auto max-w-xl text-center", FONTS.notoSerif.className)}>
        {APP_HERO_TAGLINE}
      </p>
      <div className="w-full p-px bg-linear-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
