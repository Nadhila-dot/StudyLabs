import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import AdminHeaderLayout from './admin/admin-sidebar-layout';
import { Island } from '@/components/dynamic-island/Island';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
    <Island/>
    <AdminHeaderLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AdminHeaderLayout>
    </>
);
