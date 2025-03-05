import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, LucideBookA, LucideHelpingHand, LucideNotebook, LucideNotebookPen, LucidePenTool, LucideSettings } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Courses',
        url: '/courses',
        icon: LucidePenTool,
    },
    {
        title: 'Books',
        url: '/books',
        icon: LucideBookA,
    },
    {
        title: 'Resources',
        url: '/resources',
        icon: LucideNotebookPen,
    },
    
];

const footerNavItems: NavItem[] = [
    {
        title: 'Help & Support',
        url: '/support',
        icon: LucideHelpingHand,
    },
    {
        title: 'Admin Panel',
        url: '/admin',
        icon: LucideSettings,
    },
    
];

export function AppSidebar() {
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
