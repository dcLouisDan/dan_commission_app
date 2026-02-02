import AppHeader from "@/components/app-header";
import { Hero } from "@/components/hero";
import AppFooter from "@/components/app-footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <AppHeader />
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
          <main className="flex-1 flex flex-col gap-6 px-4">
            <Link href="/commissions/new" className="bg-primary text-primary-foreground p-2 text-center text-xl rounded-2xl">New Commission</Link>
          </main>
        </div>
        <AppFooter />
      </div>
    </main>
  );
}
