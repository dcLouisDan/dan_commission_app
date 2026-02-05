
import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";

export default function CommissionsLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-12 items-center">
                <AppHeader />
                <main className="flex-1 flex max-w-5xl w-full px-4 sm:px-0">
                    {children}
                </main>
                <AppFooter />
            </div>
        </main>
    );
}
