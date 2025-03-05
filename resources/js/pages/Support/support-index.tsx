import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useIsland } from '@/hooks/useIsland';
import { MessageCircle } from 'lucide-react'; // Import MessageCircle icon
import { use } from 'react';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { Undercontruction } from '@/components/elements/UnderContruction';
import { SupportCard } from '@/components/support/support-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'support',
        href: '/support',
    },
];

export default function Dashboard() {
    const { showMessage } = useIsland();

    const props = usePage().props as any;

    console.log(props)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DashboardCard/>
                <SupportCard/>
                
            </div>
          
        </AppLayout>
    );
}