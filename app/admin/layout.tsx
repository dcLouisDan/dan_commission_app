import { AppSidebar } from "@/components/app-sidebar";
import { AuthButton } from "@/components/auth-button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <h1>Admin</h1>
                    </div>
                    <div>
                        <Suspense>
                            <AuthButton />
                        </Suspense>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}