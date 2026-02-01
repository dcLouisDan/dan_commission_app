export interface SidebarNavItem {
    title: string;
    url: string;
    items?: SidebarNavItem[];
}

export type SidebarNavConfig = Record<string, SidebarNavItem[]>