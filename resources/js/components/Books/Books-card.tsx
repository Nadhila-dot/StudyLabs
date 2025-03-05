import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Download } from 'lucide-react';
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
import { router } from '@inertiajs/react';

interface Book {
  id: string | number;
  title: string;
  author: string;
  description: string;
  coverImage: string | null;
  rating: string | null;
  downloadUrl: string;
  subject: string;
  category: string;
}

interface BookCardGridProps {
  books: Book[];
  itemsPerPage?: number;
}

const BookCardGrid: React.FC<BookCardGridProps> = ({
  books,
  itemsPerPage = 9
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination values
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, books.length);
  const currentBooks = books.slice(startIndex, endIndex);
  
  const handleDownload = (book: Book) => {
    const encodedName = encodeURIComponent(book.title);
    const encodedUrl = encodeURIComponent(book.downloadUrl);
    router.visit(route('main.books.redirect', { name: encodedName, url: encodedUrl }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBooks.map((book) => (
          <Card key={book.id} className="flex flex-col overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="line-clamp-2">{book.book_name}</CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">
                    {book.author}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {book.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3 flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Subject: {book.subject}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.description}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                onClick={() => handleDownload(book)} 
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
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
};

export default BookCardGrid;