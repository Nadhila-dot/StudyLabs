import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { BreadcrumbItem } from '@/types';

export default function NewsIndex({ posts }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News',
            href: '/news',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="News & Updates" />
            
            <div className="container py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">News & Updates</h1>
                    <p className="text-muted-foreground mt-2">Stay updated with the latest information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map(post => (
                        <Card key={post.id} className="overflow-hidden">
                            {post.featured_image && (
                                <div className="h-48 w-full overflow-hidden">
                                    <img 
                                        src={post.featured_image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <Link 
                                        href={route('news.show', post.slug)} 
                                        className="hover:underline"
                                    >
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription>
                                    <div className="flex items-center mt-1">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={post.user?.avatar} />
                                            <AvatarFallback>{post.user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{post.user?.name}</span>
                                        <span className="text-sm text-muted-foreground mx-2">•</span>
                                        <span className="text-sm text-muted-foreground">
                                            {format(new Date(post.published_at), 'MMMM dd, yyyy')}
                                        </span>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3">{post.excerpt}</p>
                            </CardContent>
                            <CardFooter>
                               <span>Thank you for reading.</span>
                            </CardFooter>
                        </Card>
                    ))}
                    
                    {posts.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <h3 className="text-xl font-medium mb-2">No news posts yet</h3>
                            <p className="text-muted-foreground">Check back soon for updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}