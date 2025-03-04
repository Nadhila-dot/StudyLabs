import React, { useState, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { 
  File, 

  FileText, 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Eye,
  AlertCircle,
  CheckCircle2,
  LucideFile,
  LucideLink
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsland } from '@/hooks/useIsland';
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { BreadcrumbItem } from '@/types';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import SecurePdfViewer from './secure-pdf';

interface FileData {
  name: string;
  path: string;
  url: string;
  size: number;
  last_modified: number;
  type: 'image' | 'pdf' | 'document' | 'other';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'admin',
        href: '/admin',
    },
    {
        title: 'files',
        href: '/admin/files',
    },
];

export default function Fileview({ files }: { files: FileData[] }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showMessage } = useIsland();

  const { data, setData, post, processing, errors, reset } = useForm({
    file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('file', e.target.files[0]);
    }
  };

  const uploadFile = () => {
    if (!data.file) return;

    setUploading(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    post(route('admin.files.store'), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        clearInterval(progressInterval);
        setProgress(100);
        setUploading(false);
        reset('file');
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        showMessage(
          <div className="flex flex-col">
            <span className="font-bold">File Uploaded</span>
            <span className="text-xs">File has been uploaded successfully</span>
          </div>,
          {
            backgroundColor: "rgba(34, 197, 94, 0.9)",
            icon: <CheckCircle2 size={18} />
          }
        );
      },
      onError: () => {
        clearInterval(progressInterval);
        setProgress(0);
        setUploading(false);
        
        showMessage(
          <div className="flex flex-col">
            <span className="font-bold">Upload Failed</span>
            <span className="text-xs">Please check file type and size</span>
          </div>,
          {
            backgroundColor: "rgba(220, 38, 38, 0.9)",
            icon: <AlertCircle size={18} />
          }
        );
      }
    });
  };

  const confirmDelete = (file: FileData) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const deleteFile = () => {
    if (!fileToDelete) return;
    
    router.delete(route('admin.files.destroy', fileToDelete.name), {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setFileToDelete(null);
        
        showMessage(
          <div className="flex flex-col">
            <span className="font-bold">File Deleted</span>
            <span className="text-xs">File has been removed successfully</span>
          </div>,
          {
            backgroundColor: "rgba(220, 38, 38, 0.9)",
            icon: <CheckCircle2 size={18} />
          }
        );
      }
    });
  };

  const openPreview = (file: FileData) => {
    setPreviewFile(file);
    setPreviewDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <LucideFile className="h-5 w-5 text-red-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="File Management" />

      <div className="flex flex-col gap-6">
        <div className='px-4 py-4'>
            <DashboardCard/>
        </div>

        <div className='px-4'>
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:cursor-pointer"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.md"
                />
                <Button 
                  onClick={uploadFile} 
                  disabled={!data.file || uploading || processing}
                  className="whitespace-nowrap"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4 animate-pulse" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </span>
                  )}
                </Button>
              </div>

              {uploading && (
                <Progress value={progress} className="h-2 transition-all" />
              )}

              {errors.file && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Error</AlertTitle>
                  <AlertDescription>{errors.file}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No files uploaded yet. Upload your first file above.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="w-[150px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.path}>
                        <TableCell>{getFileIcon(file.type)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {file.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatFileSize(file.size)}</TableCell>
                        <TableCell>{formatDate(file.last_modified)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openPreview(file)}
                            >
                            <Eye className="h-4 w-4" />
                            </Button>

                            
                            <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            >
                            <Link href={route('files.preview', file.name)}>
                                <Eye className="h-4 w-4" />
                            </Link>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => confirmDelete(file)}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{fileToDelete?.name}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteFile}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}

        </div>
    </AdminLayout>
  );
}