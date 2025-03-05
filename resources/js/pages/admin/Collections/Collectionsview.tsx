import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/components/ui/dialog';
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Collections',
        href: '/admin/collections',
    },
];

export default function CollectionsIndex({ collections, books, resources }) {
    // State for dialogs
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    // State for tracking selected collection for operations
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [currentCollection, setCurrentCollection] = useState(null);
    
    // Create collection form
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        subject: '',
        section: '',
        books: [],
        resources: []
    });
    
    // Edit collection form
    const { 
        data: editData, 
        setData: setEditData, 
        errors: editErrors, 
        patch: patchCollection, 
        processing: editProcessing, 
        reset: resetEdit 
    } = useForm({
        name: '',
        description: '',
        subject: '',
        section: '',
        books: [],
        resources: []
    });
    
    // Create collection handlers
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.collections.store'), {
            onSuccess: () => {
                setCreateDialogOpen(false);
                reset();
            }
        });
    };
    
    const toggleBook = (bookId) => {
        const updated = data.books.includes(bookId)
            ? data.books.filter(id => id !== bookId)
            : [...data.books, bookId];
        
        setData('books', updated);
    };
    
    const toggleResource = (resourceId) => {
        const updated = data.resources.includes(resourceId)
            ? data.resources.filter(id => id !== resourceId)
            : [...data.resources, resourceId];
        
        setData('resources', updated);
    };
    
    // Edit collection handlers
    const openEditDialog = (collection) => {
        setCurrentCollection(collection);
        setEditData({
            name: collection.name,
            description: collection.description || '',
            subject: collection.subject || '',
            section: collection.section || '',
            books: collection.books?.map(book => book.id) || [],
            resources: collection.resources?.map(resource => resource.id) || []
        });
        setEditDialogOpen(true);
    };
    
    const handleEditSubmit = (e) => {
        e.preventDefault();
        patchCollection(route('admin.collections.update', currentCollection.id), {
            onSuccess: () => {
                setEditDialogOpen(false);
                resetEdit();
            }
        });
    };
    
    const toggleEditBook = (bookId) => {
        const updated = editData.books.includes(bookId)
            ? editData.books.filter(id => id !== bookId)
            : [...editData.books, bookId];
        
        setEditData('books', updated);
    };
    
    const toggleEditResource = (resourceId) => {
        const updated = editData.resources.includes(resourceId)
            ? editData.resources.filter(id => id !== resourceId)
            : [...editData.resources, resourceId];
        
        setEditData('resources', updated);
    };
    
    // Delete collection handlers
    const confirmDelete = (collection) => {
        setCollectionToDelete(collection);
        setDeleteDialogOpen(true);
    };
    
    const deleteCollection = () => {
        router.delete(route('admin.collections.destroy', collectionToDelete.id), {
            onSuccess: () => setDeleteDialogOpen(false)
        });
    };
    
    // Helper functions to get names
    const getBookName = (bookId) => {
        const book = books.find(b => b.id === bookId);
        return book ? book.book_name : 'Unknown book';
    };
    
    const getResourceName = (resourceId) => {
        const resource = resources.find(r => r.id === resourceId);
        return resource ? resource.name : 'Unknown resource';
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Collections" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Collections</h1>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Collection
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Books</TableHead>
                            <TableHead>Resources</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map((collection) => (
                            <TableRow key={collection.id}>
                                <TableCell className="font-medium">{collection.name}</TableCell>
                                <TableCell>{collection.description}</TableCell>
                                <TableCell>{collection.subject}</TableCell>
                                <TableCell>{collection.section}</TableCell>
                                <TableCell>{collection.books?.length || 0}</TableCell>
                                <TableCell>{collection.resources?.length || 0}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => openEditDialog(collection)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => confirmDelete(collection)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Create Collection Dialog */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Collection</DialogTitle>
                            <DialogDescription>Add a new collection with books and resources.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {errors.description && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.description}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subject" className="text-right">
                                        Subject
                                    </Label>
                                    <Input
                                        id="subject"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.subject}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="section" className="text-right">
                                        Section
                                    </Label>
                                    <Input
                                        id="section"
                                        value={data.section}
                                        onChange={e => setData('section', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {errors.section && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.section}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Books</Label>
                                    <div className="col-span-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {data.books.length > 0 ? `${data.books.length} book(s) selected` : "Select books"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <ScrollArea className="h-60">
                                                    {books.map((book) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={book.id}
                                                            checked={data.books.includes(book.id)}
                                                            onCheckedChange={() => toggleBook(book.id)}
                                                        >
                                                            {book.book_name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Resources</Label>
                                    <div className="col-span-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {data.resources.length > 0 ? `${data.resources.length} resource(s) selected` : "Select resources"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <ScrollArea className="h-60">
                                                    {resources.map((resource) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={resource.id}
                                                            checked={data.resources.includes(resource.id)}
                                                            onCheckedChange={() => toggleResource(resource.id)}
                                                        >
                                                            {resource.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    Create Collection
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Collection Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Collection</DialogTitle>
                            <DialogDescription>Update collection details, books, and resources.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={e => setEditData('name', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {editErrors.name && <p className="text-red-500 text-sm col-span-3 col-start-2">{editErrors.name}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-description" className="text-right">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editData.description}
                                        onChange={e => setEditData('description', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {editErrors.description && <p className="text-red-500 text-sm col-span-3 col-start-2">{editErrors.description}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-subject" className="text-right">
                                        Subject
                                    </Label>
                                    <Input
                                        id="edit-subject"
                                        value={editData.subject}
                                        onChange={e => setEditData('subject', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {editErrors.subject && <p className="text-red-500 text-sm col-span-3 col-start-2">{editErrors.subject}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-section" className="text-right">
                                        Section
                                    </Label>
                                    <Input
                                        id="edit-section"
                                        value={editData.section}
                                        onChange={e => setEditData('section', e.target.value)}
                                        className="col-span-3"
                                    />
                                    {editErrors.section && <p className="text-red-500 text-sm col-span-3 col-start-2">{editErrors.section}</p>}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Books</Label>
                                    <div className="col-span-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {editData.books.length > 0 ? `${editData.books.length} book(s) selected` : "Select books"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <ScrollArea className="h-60">
                                                    {books.map((book) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={book.id}
                                                            checked={editData.books.includes(book.id)}
                                                            onCheckedChange={() => toggleEditBook(book.id)}
                                                        >
                                                            {book.book_name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Resources</Label>
                                    <div className="col-span-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start">
                                                    {editData.resources.length > 0 ? `${editData.resources.length} resource(s) selected` : "Select resources"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <ScrollArea className="h-60">
                                                    {resources.map((resource) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={resource.id}
                                                            checked={editData.resources.includes(resource.id)}
                                                            onCheckedChange={() => toggleEditResource(resource.id)}
                                                        >
                                                            {resource.name}
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </ScrollArea>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                            
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={editProcessing}>
                                    Update Collection
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                
                {/* Delete Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Collection</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete {collectionToDelete?.name}?</p>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={deleteCollection}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}