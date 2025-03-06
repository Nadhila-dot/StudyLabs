import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbItem } from '@/types';
import { CalendarIcon, BookIcon, FolderIcon, Users } from 'lucide-react';

export default function Show({ user }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Users',
      href: '/users',
    },
    {
      title: user.name,
      href: `/users/${encodeURIComponent(user.name)}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${user.name} - Profile`} />
      
      <div className="container py-8 px-4">
        {/* Profile Header with Banner */}
        <div className="relative mb-8">
          {user.banner ? (
            <div className="h-48 rounded-lg overflow-hidden mb-16">
              <img 
                src={user.banner} 
                alt={`${user.name}'s banner`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-16"></div>
          )}
          
          {/* Avatar - positioned to overlap the banner */}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2">
            <Avatar className="h-24 w-24 ring-4 ring-background">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Badges - positioned to overlap the banner */}
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 flex gap-2">
            {user.is_team && (
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Team Account
              </Badge>
            )}
            {user.is_admin && (
              <Badge variant="destructive" className="text-sm py-1 px-3">
                Admin
              </Badge>
            )}
          </div>
        </div>
        
        {/* User Info */}
        <div className="mb-8 pl-6 pt-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {user.name}
            <Badge variant="outline">Level {user.level}</Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            <CalendarIcon className="inline-block w-4 h-4 mr-1" />
            Member since {user.member_since}
          </p>
          
          {user.description && (
            <p className="mt-4 text-gray-700 max-w-3xl">{user.description}</p>
          )}
        </div>
        
        {/* User Content Tabs */}
        <Tabs defaultValue="collections">
          <TabsList>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collections" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Collections</CardTitle>
                <CardDescription>Resources shared by {user.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {user.collections && user.collections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.collections.map(collection => (
                      <Card key={collection.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{collection.name}</CardTitle>
                          <CardDescription>{collection.subject} - {collection.section || 'General'}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="line-clamp-2 text-sm">
                            {collection.description || 'No description available.'}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 text-sm text-muted-foreground">
                          <div>
                            <FolderIcon className="inline-block w-4 h-4 mr-1" />
                            {collection.resource_count} resource{collection.resource_count !== 1 ? 's' : ''}
                          </div>
                          <div>
                            <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                            {collection.created_at}
                          </div>
                        </CardFooter>
                        <Link 
                          href={`/collections/${collection.id}`} 
                          className="absolute inset-0" 
                          aria-label={`View ${collection.name} collection`}
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No collections have been shared yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
                <CardDescription>Articles written by {user.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {user.posts && user.posts.length > 0 ? (
                  <div className="space-y-4">
                    {user.posts.map(post => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <CardDescription>
                            <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                            {post.published_at}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <p className="line-clamp-2">
                            {post.excerpt}
                          </p>
                          <Link 
                            href={`/news/${post.slug}`}
                            className="text-primary hover:underline inline-block mt-2"
                          >
                            Read more
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No posts have been published yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Progress and ranks earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.rank && Object.entries(user.rank).length > 0 ? (
                    Object.entries(user.rank).map(([key, value]) => (
                      <Card key={key}>
                        <CardHeader>
                          <CardTitle className="capitalize">{key}</CardTitle>
                          <CardDescription>Rank Achievement</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{value}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-10">
                      <p className="text-muted-foreground">No achievements yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}