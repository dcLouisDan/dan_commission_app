import { ThemeSwitcher } from "@/components/theme-switcher";
import { APP_NAME, APP_COMPANY_NAME } from "@/lib/constants/app";

export default function AppFooter() {
    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>© 2026 {APP_COMPANY_NAME} ({APP_NAME}) - All rights reserved.</p>
            <ThemeSwitcher />
        </footer>
    );
}