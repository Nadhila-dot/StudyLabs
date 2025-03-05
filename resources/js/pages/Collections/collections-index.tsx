import { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Collection {
  id: number;
  name: string;
  subject: string;
  section: string;
  description: string;
  books: any[];
  resources: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Collections',
    href: '/collections',
  },
];

export default function CollectionsIndex() {
  const { collections } = usePage().props as any;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, collections.length);
  const currentCollections = collections.slice(startIndex, endIndex);

  function generatePaginationItems() {
    const items = [];
    const maxDisplayedPages = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          onClick={() => setCurrentPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (totalPages <= maxDisplayedPages) {
      // Show all pages if there are fewer than maxDisplayedPages
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis and selected range for many pages
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)} 
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page for many pages
      if (totalPages > 1) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)} 
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
  }
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Collections" />

      <div className='px-4 py-4'>
        <DashboardCard/>
      </div>
      
      <div className="container py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Browse Collections</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCollections.map(collection => (
            <Link href={route('collections.show', collection.id)} key={collection.id}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{collection.name}</CardTitle>
                  <CardDescription>{collection.subject} - {collection.section}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{collection.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">{collection.books.length} Books</Badge>
                    <Badge variant="outline">{collection.resources.length} Resources</Badge>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {generatePaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  );
}