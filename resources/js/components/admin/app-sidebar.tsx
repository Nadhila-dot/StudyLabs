import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LucideBook, LucideFiles, LucideHouse, LucideLayout, LucideNotebook, LucideUsers, Settings2 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Admin-Panel',
        url: '/admin',
        icon: Settings2,
    },
    {
        title: 'Documents',
        url: '/admin/files',
        icon: LucideFiles,
    },
    {
        title: 'Books',
        url: '/admin/books',
        icon: LucideBook,
    },
    {
        title: 'Users',
        url: '/admin/users',
        icon: LucideUsers,
    },
    {
        title: 'Resources',
        url: '/admin/resources',
        icon: LucideNotebook,
    },
    
];

const footerNavItems: NavItem[] = [
    {
        title: 'Back to Non-Admin Panel',
        url: '/dashboard',
        icon: LucideLayout,
    },
    /*
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },*/
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
