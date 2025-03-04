import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { BreadcrumbItem } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'admin',
        href: '/admin',
    },
    {
        title: 'resources',
        href: '/admin/resources',
    },
];

export default function ResourcesIndex({ resources }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    preview_url: '',
    subject: '',
    term: '',
    category: '',
    etc: {}
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('admin.resources.store'), {
      onSuccess: () => {
        reset();
        setIsAddDialogOpen(false);
      },
    });
  };

  const confirmDelete = (resource) => {
    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const deleteResource = () => {
    if (!resourceToDelete) return;
    
    router.delete(route('admin.resources.destroy', resourceToDelete.id))
      .then(() => {
        setIsDeleteDialogOpen(false);
        setResourceToDelete(null);
        window.location.reload();
      });
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Resources Management" />

      <div className="flex flex-col gap-6 p-4">
        <DashboardCard/>
        <div className="flex justify-between items-center px-2">
          <h1 className="text-2xl font-bold">Resources Management</h1>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resources</CardTitle>
            <Input 
              placeholder="Search resources..." 
              className="w-64"
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.data.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell>{resource.subject || '-'}</TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>
                      <a 
                        href={resource.preview_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Preview
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={route('admin.resources.edit', resource.id)}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => confirmDelete(resource)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Resource Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Enter the details for the new resource. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="preview_url">Preview URL</Label>
              <Input 
                id="preview_url"
                value={data.preview_url}
                onChange={(e) => setData('preview_url', e.target.value)}
                required
              />
              {errors.preview_url && <p className="text-sm text-red-500">{errors.preview_url}</p>}
            </div>
            
            <div>
  <Label htmlFor="subject">Subject</Label>
  <Select 
    value={data.subject}
    onValueChange={(value) => setData('subject', value)}
  >
    <SelectTrigger id="subject" className="w-full">
      <SelectValue placeholder="Select a subject" />
    </SelectTrigger>
    <SelectContent className="max-h-80 overflow-y-auto">
      
      
      {/* IGCSE Subjects */}
      <SelectGroup>
        <SelectLabel>IGCSE Subjects</SelectLabel>
        <SelectItem value="Accounting">Accounting</SelectItem>
        <SelectItem value="Sinhala">Sinhala</SelectItem>
        <SelectItem value="Art and Design">Art and Design</SelectItem>
        <SelectItem value="Biology">Biology</SelectItem>
        <SelectItem value="Business Studies">Business Studies</SelectItem>
        <SelectItem value="Chemistry">Chemistry</SelectItem>
        <SelectItem value="Chinese">Chinese</SelectItem>
        <SelectItem value="Commerce">Commerce</SelectItem>
        <SelectItem value="Computer Science">Computer Science</SelectItem>
        <SelectItem value="Economics">Economics</SelectItem>
        <SelectItem value="English Language">English Language</SelectItem>
        <SelectItem value="English Literature">English Literature</SelectItem>
        <SelectItem value="French">French</SelectItem>
        <SelectItem value="Geography">Geography</SelectItem>
        <SelectItem value="German">German</SelectItem>
        <SelectItem value="Global Citizenship">Global Citizenship</SelectItem>
        <SelectItem value="History">History</SelectItem>
        <SelectItem value="Information Technology">Information Technology</SelectItem>
        <SelectItem value="Mathematics">Mathematics</SelectItem>
        <SelectItem value="Mathematics A">Mathematics A</SelectItem>
        <SelectItem value="Mathematics B">Mathematics B</SelectItem>
        <SelectItem value="Music">Music</SelectItem>
        <SelectItem value="Physical Education">Physical Education</SelectItem>
        <SelectItem value="Physics">Physics</SelectItem>
        <SelectItem value="Psychology">Psychology</SelectItem>
        <SelectItem value="Religious Studies">Religious Studies</SelectItem>
        <SelectItem value="Science (Double Award)">Science (Double Award)</SelectItem>
        <SelectItem value="Sociology">Sociology</SelectItem>
        <SelectItem value="Spanish">Spanish</SelectItem>
      </SelectGroup>
      
      {/* IAL Subjects */}
      <SelectGroup>
        <SelectLabel>IAL (A-Level) Subjects</SelectLabel>
        <SelectItem value="Accounting (IAL)">Accounting</SelectItem>
        <SelectItem value="Applied ICT">Applied ICT</SelectItem>
        <SelectItem value="Art and Design (IAL)">Art and Design</SelectItem>
        <SelectItem value="Biology (IAL)">Biology</SelectItem>
        <SelectItem value="Business Studies (IAL)">Business Studies</SelectItem>
        <SelectItem value="Chemistry (IAL)">Chemistry</SelectItem>
        <SelectItem value="Computer Science (IAL)">Computer Science</SelectItem>
        <SelectItem value="Economics (IAL)">Economics</SelectItem>
        <SelectItem value="English Language (IAL)">English Language</SelectItem>
        <SelectItem value="English Literature (IAL)">English Literature</SelectItem>
        <SelectItem value="French (IAL)">French</SelectItem>
        <SelectItem value="Further Mathematics">Further Mathematics</SelectItem>
        <SelectItem value="Geography (IAL)">Geography</SelectItem>
        <SelectItem value="German (IAL)">German</SelectItem>
        <SelectItem value="Global Development">Global Development</SelectItem>
        <SelectItem value="History (IAL)">History</SelectItem>
        <SelectItem value="Law">Law</SelectItem>
        <SelectItem value="Mathematics (IAL)">Mathematics</SelectItem>
        <SelectItem value="Media Studies">Media Studies</SelectItem>
        <SelectItem value="Physics (IAL)">Physics</SelectItem>
        <SelectItem value="Politics">Politics</SelectItem>
        <SelectItem value="Psychology (IAL)">Psychology</SelectItem>
        <SelectItem value="Religious Studies (IAL)">Religious Studies</SelectItem>
        <SelectItem value="Spanish (IAL)">Spanish</SelectItem>
      </SelectGroup>

      {/* Other */}
      <SelectItem value="Other">Other</SelectItem>
    </SelectContent>
  </Select>
  {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
</div>
            
            <div>
              <Label htmlFor="term">Term</Label>
              <Input 
                id="term"
                value={data.term}
                onChange={(e) => setData('term', e.target.value)}
              />
            </div>
            
            <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                    value={data.category}
                    onValueChange={(value) => setData('category', value)}
                >
                    <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Notes">Notes</SelectItem>
                    <SelectItem value="Past Papers">Past Papers</SelectItem>
                    <SelectItem value="Tutes">Tutes</SelectItem>
                    <SelectItem value="Worksheets">Worksheets</SelectItem>
                    <SelectItem value="Presentations">Presentations</SelectItem>
                    <SelectItem value="Videos">Videos</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
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
                Save Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{resourceToDelete?.name}"? 
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
              onClick={deleteResource}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}