import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'books/edit',
        href: '/books/edit',
    },
];

export default function EditBook({ book, categories }) {
  const { data, setData, put, processing, errors } = useForm({
    book_name: book.book_name,
    subject: book.subject,
    url: book.url,
    category: book.category,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    put(route('admin.books.update', book.id));
  };

  return (
    <AdminLayout>
      <Head title={`Edit: ${book.book_name}`} />

      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link href={route('admin.books.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Book</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent>
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
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Update Book
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}