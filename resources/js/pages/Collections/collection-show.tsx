import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

export default function CollectionShow() {
  const { collection } = usePage().props as any;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Collections',
      href: '/collections',
    },
    {
        title: `${collection.name}`,
        href: `/collections/${collection.id}`,
    },
  ];
  
  const openResourcePreview = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={collection.name} />
      
      <div className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <div className="flex items-center mt-2 gap-4">
            <Badge>{collection.subject}</Badge>
            <Badge variant="outline">{collection.section}</Badge>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={collection.user?.avatar} />
                <AvatarFallback>{collection.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">Created by <a href={`/users/${collection.user?.name}`}>{collection.user?.name}</a></span>
            </div>
          </div>
          
          <p className="mt-4 text-gray-700">{collection.description}</p>
        </div>
        
        <Tabs defaultValue="resources">
          <TabsList>
            <TabsTrigger value="resources">Resources ({collection.resources.length})</TabsTrigger>
            <TabsTrigger value="books">Books ({collection.books.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collection.resources.map(resource => (
                <Card 
                  key={resource.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openResourcePreview(resource.preview_url)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {resource.name}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{resource.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md overflow-hidden border h-80 relative group">
                      <iframe 
                        src={resource.preview_url} 
                        className="w-full h-full"
                        title={resource.name}
                        loading="lazy"
                        allowFullScreen
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button variant="secondary">
                          <FileText className="mr-2 h-4 w-4" />
                          Open Resource
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge>Term: {resource.term}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openResourcePreview(resource.preview_url);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {collection.resources.length === 0 && (
              <p className="text-center py-8 text-gray-500">No resources in this collection</p>
            )}
          </TabsContent>
          
          <TabsContent value="books" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collection.books.map(book => (
                <Card key={book.id}>
                  <CardHeader>
                    <CardTitle>{book.book_name}</CardTitle>
                    <CardDescription>{book.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={book.downloadUrl} 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      View Book <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </CardContent>
                  <CardFooter>
                    <Badge>{book.category}</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {collection.books.length === 0 && (
              <p className="text-center py-8 text-gray-500">No books in this collection</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}