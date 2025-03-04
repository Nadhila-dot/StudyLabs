import { usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface auth {
  user: {
    name: string;
    description: string;
    avatar: string;
    banner: string;
    }
}

export const  ProfileHeader = () => {
  const { auth } = usePage().props;
  const user = auth.user as any;
  
  return (
    <div className="mb-6">
      {/* Banner with avatar overlaid */}
      <div className="relative">
        {/* Banner */}
        <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 overflow-hidden rounded-lg">
          {user.banner ? (
            <img 
              src={user.banner} 
              alt="Profile banner" 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : null}
        </div>
        
        {/* Avatar that overlaps the banner */}
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="rounded-full ring-4 ring-background">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10">
                <User className="h-12 w-12 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      {/* Profile info - positioned below to account for avatar overlap */}
      
    </div>
  );
};

