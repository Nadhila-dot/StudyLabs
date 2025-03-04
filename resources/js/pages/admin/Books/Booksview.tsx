import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit, 
  Book as BookIcon,
  X, 
  Filter 
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'admin',
        href: '/admin',
    },
    {
        title: 'books',
        href: '/admin/books',
    },
];


export default function Booksview({ books, categories, filters }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const { data, setData, post, processing, errors, reset } = useForm({
    book_name: '',
    subject: '',
    url: '',
    category: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('admin.books.store'), {
      onSuccess: () => {
        reset();
        setIsAddDialogOpen(false);
      },
    });
  };

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  const deleteBook = () => {
    if (!bookToDelete) return;
    
    router.delete(route('admin.books.destroy', bookToDelete.id))
      .then(() => {
        setIsDeleteDialogOpen(false);
        setBookToDelete(null);
        window.location.reload();
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = route('admin.books.index', { search: searchQuery });
  };

  const handleCategoryFilter = (category) => {
    window.location.href = route('admin.books.index', { 
      search: filters.search,
      filter: category === filters.filter ? null : category 
    });
  };

  const clearFilters = () => {
    window.location.href = route('admin.books.index');
  };

  

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Books Management" />

      <div className='px-4 mt-3'>
        <DashboardCard/>
      </div>

      <div className="flex flex-col gap-6 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Books Management</h1>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Books</CardTitle>

            <div className="flex items-center gap-2">
              {filters.filter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.filter}
                  <button onClick={clearFilters}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input 
                  placeholder="Search books..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button type="submit" size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Select 
                onValueChange={handleCategoryFilter}
                value={filters.filter || ''}
              >
                <SelectTrigger className="w-40">
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
            </div>
          </CardHeader>
          <CardContent>
            {books.data.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No books found. Add your first book using the button above.
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Book Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.data.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>{book.book_name}</TableCell>
                          <TableCell>{book.subject}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {book.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            <a 
                              href={book.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {book.url}
                            </a>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                              >
                                <Link href={route('admin.books.edit', book.id)}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(book)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <Pagination
                    currentPage={books.current_page}
                    totalPages={books.last_page}
                    onPageChange={(page) => {
                      window.location.href = `${route('admin.books.index')}?page=${page}&search=${filters.search || ''}&filter=${filters.filter || ''}`;
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Enter the details for the new book. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="book_name" className="required">Book Name</Label>
                <Input 
                  id="book_name"
                  value={data.book_name}
                  onChange={(e) => setData('book_name', e.target.value)}
                  required
                />
                {errors.book_name && <p className="text-sm text-red-500">{errors.book_name}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="subject" className="required">Subject</Label>
                <Input 
                  id="subject"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                  required
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="url" className="required">URL</Label>
                <Input 
                  id="url"
                  value={data.url}
                  onChange={(e) => setData('url', e.target.value)}
                  placeholder="https://example.com/book.pdf"
                  required
                />
                {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category" className="required">Category</Label>
                <div className="flex gap-2">
                  <Select 
                    value={data.category}
                    onValueChange={(value) => setData('category', value)}
                  >
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="IGCSE Books">IGCSE Books</SelectItem>
                      <SelectItem value="I/AL Books">I/AL Books</SelectItem>
                      <SelectItem value="University Books">University Books</SelectItem>
                      <SelectItem value="Other Books">Other Books</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Allow adding new category */}
                  <Input 
                    placeholder="Or type new category"
                    value={!categories.includes(data.category) ? data.category : ''}
                    onChange={(e) => setData('category', e.target.value)}
                  />
                </div>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                Save Book
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bookToDelete?.book_name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteBook}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}