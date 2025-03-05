import { BookOpen, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

import { BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { useIsland } from '@/hooks/useIsland';
import { CollectionGrid } from '@/components/Collections/collections';
import BookCardGrid from '@/components/Books/Books-card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 70,
      damping: 20
    }
  }
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { showMessage } = useIsland();
    const props = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Welcome section */}
                <DashboardCard />

                
                
                {/* Main content */}
                <div className="space-y-16 pb-12 d">
                    
                    {/* Collections section */}
                    <motion.section 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6 dark:bg-black/80 bg-white rounded-xl p-6 shadow-sm"
                    >
                        
                        <motion.div variants={itemVariants} className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Library className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Study Collections</h2>
                                <p className="text-muted-foreground">Curated materials to help you excel in your studies</p>
                            </div>
                            <div className="ml-auto">
                                <Button variant="outline" asChild>
                                    <a href={route('collections.index')}>View All</a>
                                </Button>
                            </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <CollectionGrid collections={props.collections} itemsPerPage={6} />
                        </motion.div>
                    </motion.section>

                    {/* Books section */}
                    <motion.section 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6 dark:bg-black/80 bg-white rounded-xl p-6 shadow-sm"
                    >
                        <motion.div variants={itemVariants} className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Educational Books</h2>
                                <p className="text-muted-foreground">Download comprehensive study materials for your courses</p>
                            </div>
                            <div className="ml-auto">
                                <Button variant="outline" asChild>
                                    <a href={route('main.books')}>View All</a>
                                </Button>
                            </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <BookCardGrid books={props.books} itemsPerPage={6} />
                        </motion.div>
                    </motion.section>
                </div>
            </div>
        </AppLayout>
    );
}