import { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { User, Camera, Edit, Loader2, CheckCheckIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useIsland } from '@/hooks/useIsland';


interface AuthUser {
  name: string;
  description: string | null;
  avatar: string | null;
  banner: string | null;
  email?: string;
}

interface PageProps {
  auth: {
    user: AuthUser;
  };
}

export const ProfileHeader = () => {
  const { auth } = usePage<PageProps>().props;
  const user = auth.user;
  const { showMessage } = useIsland();


  
  // State for dialogs
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  
  // Forms for uploads and edits
  const { data: avatarData, setData: setAvatarData, post: postAvatar, processing: avatarProcessing, progress: avatarProgress } = useForm({
    avatar: null as File | null,
  });
  
  const { data: bannerData, setData: setBannerData, post: postBanner, processing: bannerProcessing, progress: bannerProgress } = useForm({
    banner: null as File | null,
  });
  
  const { data: descData, setData: setDescData, patch: patchDesc, processing: descProcessing } = useForm({
    description: user.description || '',
  });
  
  // Preview images
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarData('avatar', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
    
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerData('banner', file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };
  
  const submitAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    postAvatar(route('profile.avatar.update'), {
      onSuccess: () => {
        setAvatarDialogOpen(false);
        setAvatarPreview(null);
      }
    });
    showMessage(
      <div className="flex flex-col">
        <span className="font-bold">Avatar Change Sumbited</span>
        <span className="text-xs">Avatar has been changed successfully</span>
      </div>,
      {
        backgroundColor: "rgba(22, 163, 74, 0.9)",
        icon: <CheckCheckIcon size={18} />
      }
    );
  };
  
  const submitBanner = (e: React.FormEvent) => {
    e.preventDefault();
    postBanner(route('profile.banner.update'), {
      onSuccess: () => {
        setBannerDialogOpen(false);
        setBannerPreview(null);
      }
    });
    showMessage(
      <div className="flex flex-col">
      <span className="font-bold">Banner Change Sumbited</span>
      <span className="text-xs">Banner has been changed successfully</span>
      </div>,
      {
      backgroundColor: "rgba(22, 163, 74, 0.9)",
      icon: <CheckCheckIcon size={18} />
      }
    );
  };
  
  const submitDescription = (e: React.FormEvent) => {
    e.preventDefault();
    patchDesc(route('profile.description.update'), {
      onSuccess: () => {
        setDescDialogOpen(false);
      }
    });
  };
  
  return (
    <div className="mb-12">
      {/* Banner with avatar overlaid */}
      <div className="relative">
        {/* Banner */}
        <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 overflow-hidden rounded-lg">
          {user.banner && (
            <img 
              src={user.banner} 
              alt="Profile banner" 
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/90"
            onClick={() => setBannerDialogOpen(true)}
          >
            <Camera className="h-4 w-4 mr-1" />
            Change Banner
          </Button>
        </div>
        
        {/* Avatar that overlaps the banner */}
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="rounded-full ring-4 ring-background relative group">
            <Avatar className="h-24 w-24">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute bottom-0 right-0 rounded-full bg-background shadow-md transition-opacity"
              onClick={() => setAvatarDialogOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
     
      
      {/* Avatar Dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitAvatar}>
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <Avatar className="h-40 w-40">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Preview" />
                  ) : user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-3xl">
                    <User className="h-20 w-20 text-primary" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Label htmlFor="avatar">Choose an image</Label>
              <Input 
                id="avatar" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange}
              />
              
              {avatarProgress && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${avatarProgress.percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAvatarDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!avatarData.avatar || avatarProcessing}
              >
                {avatarProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Banner Dialog */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Banner Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitBanner}>
            <div className="space-y-4">
              <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {bannerPreview ? (
                  <img 
                    src={bannerPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : user.banner ? (
                  <img 
                    src={user.banner} 
                    alt="Current banner" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No banner image
                  </div>
                )}
              </div>
              
              <Label htmlFor="banner">Choose an image</Label>
              <Input 
                id="banner" 
                type="file" 
                accept="image/*" 
                onChange={handleBannerChange}
              />
              
              {bannerProgress && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${bannerProgress.percentage}%` }}
                  ></div>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setBannerDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!bannerData.banner || bannerProcessing}
              >
                {bannerProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      
    </div>
  );
};