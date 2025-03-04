import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, LucideCheckCircle2 } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIsland } from '@/hooks/useIsland';

const breadcrumbs = [
  {
    title: 'admin',
    href: '/admin',
  },
  {
    title: 'resources',
    href: '/admin/resources',
  },
  {
    title: 'edit',
    href: '#',
  },
];

export default function EditResource({ resource, categories }) {

    const { showMessage } = useIsland();
  // Default categories in case they're not provided
  const defaultCategories = [
    'Notes', 
    'Past Papers', 
    'Tutes', 
    'Worksheets', 
    'Presentations', 
    'Videos', 
    'Other'
  ];

  const categoriesToUse = categories || defaultCategories;

  // Initialize form with resource data or defaults
  const { data, setData, put, processing, errors } = useForm({
    name: resource?.name || '',
    preview_url: resource?.preview_url || '',
    subject: resource?.subject || 'none',
    term: resource?.term || '',
    category: resource?.category || categoriesToUse[0],
    etc: resource?.etc || {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!resource || !resource.id) {
      console.error("Resource ID is missing");
      return;
    }

    
    showMessage(
      <div className="flex flex-col">
        <span className="font-bold">Sucessfully Updated </span>
        <span className="text-xs">This resource has been updated!</span>
      </div>,
      {
        backgroundColor: "rgba(0, 255, 0, 0.3)",
        icon: <LucideCheckCircle2 size={18} />
      }
    );
    
    put(route('admin.resources.update', resource.id));
  };

  // If resource is not provided, show an error
  if (!resource) {
    return (
      <AdminLayout breadcrumbs={breadcrumbs}>
        <Head title="Resource Not Found" />
        <div className="p-4">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The resource you are trying to edit could not be found.
              <div className="mt-4">
                <Button onClick={() => router.visit(route('admin.resources'))}>
                  Return to Resources
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Resource: ${data.name}`} />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.visit(route('admin.resources'))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
            <h1 className="text-2xl font-bold">Edit Resource: {data.name}</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex gap-2">
                  <Input 
                    id="preview_url"
                    value={data.preview_url}
                    onChange={(e) => setData('preview_url', e.target.value)}
                    required
                    className="flex-grow"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => window.open(data.preview_url, '_blank')}
                    disabled={!data.preview_url}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
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
                    <SelectItem value="none">None</SelectItem>
                    
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
                      <SelectItem value="Biology (IAL)">Biology</SelectItem>
                      <SelectItem value="Chemistry (IAL)">Chemistry</SelectItem>
                      <SelectItem value="Computer Science (IAL)">Computer Science</SelectItem>
                      <SelectItem value="Economics (IAL)">Economics</SelectItem>
                      <SelectItem value="Mathematics (IAL)">Mathematics</SelectItem>
                      <SelectItem value="Physics (IAL)">Physics</SelectItem>
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
                {errors.term && <p className="text-sm text-red-500">{errors.term}</p>}
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
                    {categoriesToUse.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.visit(route('admin.resources'))}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Update Resource
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}