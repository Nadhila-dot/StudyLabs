import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Head, usePage } from '@inertiajs/react';
import { useIsland } from '@/hooks/useIsland';
import { BarChart, LineChart, PieChart, Users } from 'lucide-react';
import StatsCards from '@/components/admin/components/stats-card';
import { BreadcrumbItem } from '@/types';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'admin',
        href: '/admin',
    },
];


export default function AdminView() {
    const { stats } = usePage().props as any;
    const { showMessage } = useIsland();
    
    const handleNotificationClick = () => {
        showMessage(
            <div className="flex flex-col">
                <span className="font-bold">Admin Notification</span>
                <span className="text-xs">Welcome to admin dashboard</span>
            </div>,
            {
                backgroundColor: "rgba(59, 130, 246, 0.9)",
                icon: <Users size={18} />
            }
        );
    };
    
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="grid gap-6">
                <div className='px-4 py-4'>
                    <DashboardCard/>
                </div>
                
                {/* Using the StatsCards component */}
                <StatsCards stats={stats} />
                
                
                
                
            </div>
        </AdminLayout>
    );
}