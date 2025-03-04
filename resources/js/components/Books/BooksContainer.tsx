import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Download, Book as BookIcon, Search, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the Book interface based on your data structure
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

interface BooksContainerProps {
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
}

const BooksContainer: React.FC<BooksContainerProps> = ({
  title = "Educational Books",
  description = "Browse our collection of educational books",
  emptyMessage = "No books found.. Try to contact support at nadhilaplayz@gmail.com",
  className = ""
}) => {
  const { books, categories, filters } = usePage().props as {
    books: Book[],
    categories: string[],
    filters: { category: string, search: string }
  };
  
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('books.index'), {
      search: searchQuery,
      category: selectedCategory
    }, {
      preserveState: true,
      replace: true
    });
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    router.get(route('books.index'), {
      search: searchQuery,
      category: category
    }, {
      preserveState: true,
      replace: true
    });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    router.get(route('books.index'), {}, {
      preserveState: true,
      replace: true
    });
  };
  
  const handleDownload = (book: Book) => {
    const encodedName = encodeURIComponent(book.title);
    const encodedUrl = encodeURIComponent(book.downloadUrl);
    router.visit(route('main.books.redirect', { name: encodedName, url: encodedUrl }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto items-center gap-2">
          <Input
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit" size="sm" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(filters.search || filters.category) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <FilterX className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">{emptyMessage}</p>
          {(filters.search || filters.category) && (
            <Button variant="link" onClick={clearFilters}>
              Clear filters and try again
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="flex flex-col overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-2">{book.title}</CardTitle>
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
      )}
    </div>
  );
};

export default BooksContainer;