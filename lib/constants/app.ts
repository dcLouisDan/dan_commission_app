import { SidebarNavConfig } from "../types/ui";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "DAN DC";
export const APP_COMPANY_NAME = process.env.NEXT_PUBLIC_APP_COMPANY_NAME || "DAN LOUIS DELA CRUZ";
export const APP_HERO_TAGLINE = process.env.NEXT_PUBLIC_APP_HERO_TAGLINE || "Your one-stop shop for all things digital art and design.";

export const SIDEBAR_NAV_ITEMS: SidebarNavConfig = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
        },
        {
            title: "Commissions",
            url: "/admin/commissions",
        },
        {
            title: "Gallery",
            url: "/admin/gallery",
        },
        {
            title: "Blog",
            url: "/admin/blog",
        },
        {
            title: "Settings",
            url: "/admin/settings",
        },
    ]
}