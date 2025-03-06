import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash, Eye, Image, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { BreadcrumbItem } from '@/types';

export default function PostsView({ posts }) {
  // State for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // State for tracking current post
  const [currentPost, setCurrentPost] = useState(null);
  
  // Refs for file inputs
  const createImageRef = useRef(null);
  const editImageRef = useRef(null);
  
  // Image previews
  const [createImagePreview, setCreateImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  
  // Create post form
  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    processing: createProcessing,
    errors: createErrors,
    reset: resetCreate
  } = useForm({
    title: '',
    content: '',
    excerpt: '',
    featured_image: null,
    published: false,
  });
  
  // Edit post form
  const {
    data: editData,
    setData: setEditData,
    put: updatePost,
    processing: editProcessing,
    errors: editErrors,
    reset: resetEdit
  } = useForm({
    title: '',
    content: '',
    excerpt: '',
    featured_image: null,
    published: false,
  });
  
  // Delete post form
  const { delete: deletePost, processing: deleteProcessing } = useForm();
  
  // Create handlers
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createPost(route('admin.posts.store'), {
      onSuccess: () => {
        setCreateDialogOpen(false);
        resetCreate();
        setCreateImagePreview(null);
      }
    });
  };
  
  const handleCreateImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCreateData('featured_image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setCreateImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  // Edit handlers
  const openEditDialog = (post) => {
    setCurrentPost(post);
    setEditData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: null,
      published: post.published,
    });
    setEditImagePreview(post.featured_image);
    setEditDialogOpen(true);
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    // Need to convert the image file to base64 string if it exists
    if (editData.featured_image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Create a new object with all the edit data plus the base64 image
        const dataToSubmit = {
          ...editData,
          featured_image: reader.result
        };
        
        // Send the request with the complete data
        updatePost(route('admin.posts.update', currentPost.id), {
          data: dataToSubmit, // Explicitly pass the data
          onSuccess: () => {
            setEditDialogOpen(false);
            resetEdit();
            setEditImagePreview(null);
          }
        });
      };
      reader.readAsDataURL(editData.featured_image);
    } else {
      // If no new image was selected, just send the current data
      // including the existing image URL if there was one
      updatePost(route('admin.posts.update', currentPost.id), {
        data: editData, // Explicitly pass the data
        onSuccess: () => {
          setEditDialogOpen(false);
          resetEdit();
          setEditImagePreview(null);
        }
      });
    }
  };
  
  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditData('featured_image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  // Delete handlers
  const openDeleteDialog = (post) => {
    setCurrentPost(post);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    deletePost(route('admin.posts.destroy', currentPost.id), {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setCurrentPost(null);
      }
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
      {
          title: 'admin',
          href: '/admin',
      },
      {
          title: 'Posts',
          href: '/admin/posts',
      },
  ];
  
  return (
    <AdminLayout  breadcrumbs={breadcrumbs}>
      <Head title="Manage News Posts" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">News Posts</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        </div>
        
        {/* Posts Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  {post.published ? (
                    <Badge className="bg-green-500">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Not published'}
                </TableCell>
                <TableCell>{post.user?.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {post.published && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="View"
                        onClick={() => window.open(route('news.show', post.slug), '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      title="Edit"
                      onClick={() => openEditDialog(post)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      title="Delete"
                      onClick={() => openDeleteDialog(post)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No posts found. Create your first post!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Create Post Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                Create a new news post that will be displayed to all users.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateSubmit} className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    value={createData.title}
                    onChange={e => setCreateData('title', e.target.value)}
                  />
                  {createErrors.title && (
                    <p className="text-red-500 text-sm">{createErrors.title}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="create-content">Content</Label>
                  <Textarea
                    id="create-content"
                    value={createData.content}
                    onChange={e => setCreateData('content', e.target.value)}
                    rows={10}
                  />
                  {createErrors.content && (
                    <p className="text-red-500 text-sm">{createErrors.content}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="create-excerpt">Excerpt (optional)</Label>
                  <Textarea
                    id="create-excerpt"
                    value={createData.excerpt}
                    onChange={e => setCreateData('excerpt', e.target.value)}
                    rows={3}
                    placeholder="Brief summary of the post. Leave blank to auto-generate."
                  />
                  {createErrors.excerpt && (
                    <p className="text-red-500 text-sm">{createErrors.excerpt}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>Featured Image</Label>
                  <input
                    type="file"
                    ref={createImageRef}
                    onChange={handleCreateImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {createImagePreview ? (
                    <div className="mt-2 relative">
                      <img 
                        src={createImagePreview} 
                        alt="Preview" 
                        className="max-h-64 rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => createImageRef.current.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => createImageRef.current.click()}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  )}
                  {createErrors.featured_image && (
                    <p className="text-red-500 text-sm">{createErrors.featured_image}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-published"
                    checked={createData.published}
                    onCheckedChange={(checked) => setCreateData('published', checked)}
                  />
                  <Label htmlFor="create-published">Publish this post</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProcessing}
                >
                  {createProcessing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Post
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Post Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Update the details of your post.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editData.title}
                    onChange={e => setEditData('title', e.target.value)}
                  />
                  {editErrors.title && (
                    <p className="text-red-500 text-sm">{editErrors.title}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editData.content}
                    onChange={e => setEditData('content', e.target.value)}
                    rows={10}
                  />
                  {editErrors.content && (
                    <p className="text-red-500 text-sm">{editErrors.content}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-excerpt">Excerpt (optional)</Label>
                  <Textarea
                    id="edit-excerpt"
                    value={editData.excerpt}
                    onChange={e => setEditData('excerpt', e.target.value)}
                    rows={3}
                    placeholder="Brief summary of the post. Leave blank to auto-generate."
                  />
                  {editErrors.excerpt && (
                    <p className="text-red-500 text-sm">{editErrors.excerpt}</p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>Featured Image</Label>
                  <input
                    type="file"
                    ref={editImageRef}
                    onChange={handleEditImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {editImagePreview ? (
                    <div className="mt-2 relative">
                      <img 
                        src={editImagePreview} 
                        alt="Preview" 
                        className="max-h-64 rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => editImageRef.current.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editImageRef.current.click()}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  )}
                  {editErrors.featured_image && (
                    <p className="text-red-500 text-sm">{editErrors.featured_image}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-published"
                    checked={editData.published}
                    onCheckedChange={(checked) => setEditData('published', checked)}
                  />
                  <Label htmlFor="edit-published">Publish this post</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={editProcessing}
                >
                  {editProcessing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Update Post
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete "{currentPost?.title}"?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteProcessing}
              >
                {deleteProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}