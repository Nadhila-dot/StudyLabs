import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface CollectionGridProps {
  collections: Collection[];
  itemsPerPage?: number;
}

export function CollectionGrid({ collections, itemsPerPage = 6 }: CollectionGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, collections.length);
  const currentCollections = collections.slice(startIndex, endIndex);

  return (
    <div>
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
            
            {/* First page */}
            <PaginationItem>
              <PaginationLink 
                onClick={() => setCurrentPage(1)} 
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            
            {/* Show ellipsis if current page is far from start */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Pages around current page */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              // Only show pages close to current page
              if (
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                pageNumber >= currentPage - 1 &&
                pageNumber <= currentPage + 1
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(pageNumber)} 
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            {/* Show ellipsis if current page is far from end */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Last page (if more than 1 page) */}
            {totalPages > 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => setCurrentPage(totalPages)} 
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
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
  );
}