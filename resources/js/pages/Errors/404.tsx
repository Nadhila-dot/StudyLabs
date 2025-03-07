import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { FileQuestion } from 'lucide-react';
import { useIsland } from '@/hooks/useIsland';
import { useEffect, useState } from 'react';
import { Globe } from '@/components/ui/globe';

// Custom ShootingStars component
const CustomShootingStars = () => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Function to create a new star
    const createStar = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const size = Math.random() * 3 + 1; // 1-4px
      const duration = Math.random() * 1.5 + 0.5; // 0.5-2s
      const delay = Math.random() * 2; // 0-2s
      
      // Position percentages (start from top-left area)
      const startX = Math.random() * 20; // 0-20% from left
      const startY = Math.random() * 20; // 0-20% from top
      
      // Set the star with a timeout to remove it
      setStars(prev => [...prev, { id, size, duration, delay, startX, startY }]);
      
      // Remove the star after animation completes
      setTimeout(() => {
        setStars(prev => prev.filter(star => star.id !== id));
      }, (duration + delay) * 1000 + 500);
    };
    
    // Create initial stars
    for (let i = 0; i < 5; i++) {
      setTimeout(createStar, Math.random() * 2000);
    }
    
    // Create new stars periodically
    const interval = setInterval(createStar, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <div 
            className="shooting-star"
            style={{
              width: `${star.size * 30}px`, 
              height: `${star.size}px`
            }}
          />
        </div>
      ))}
    </div>
  );
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: '404',
    href: '#',
  },
];

export default function NotFound() {
  // Get the current URL from Inertia page props
  const { url } = usePage().props as any;
  const { showMessage } = useIsland();
  
  useEffect(() => {
    if (showMessage) {
      showMessage(
        <div className="flex flex-col">
          <span className="font-bold">Page not found</span>
          <span className="text-xs">We couldn't find {url}</span>
        </div>,
        {
          backgroundColor: "rgba(220, 38, 38, 0.9)",
          icon: <FileQuestion size={18} />
        }
      );
    }
  }, [url, showMessage]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Page Not Found" />
      <style jsx global>{`
        .shooting-star {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, #ffffff 100%);
          border-radius: 0 50% 50% 0;
          animation: shoot 2s linear forwards;
          transform: rotate(45deg);
        }
        
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(2000px) translateY(2000px) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 p-4 text-center relative z-10">
        <div className="rounded-full p-6">
          <img 
            src="https://media.tenor.com/i2alOMp8NXAAAAAC/sousou-no-frieren-frieren.gif" 
            alt="Frieren looking confused" 
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">{url} was not found</h1>
        
        <p className="max-w-[600px] text-lg text-muted-foreground">
          We couldn't find what you wanted at <span className="font-mono font-medium">{url}</span>. It doesn't seem to exist.
        </p>
        
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/support">Support</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
      
      {/* Visible Globe in right side - adjusted positioning */}
      <div className="fixed top-1/2 opacity-25 right-[-2400px] bottom-2 transform -translate-y-1/99 z-1  pointer-events-none">
        <div className="w-[5200px] h-[5200px] bg-transparent">
          <Globe />
        </div>

      </div>
      
      {/* Custom shooting stars */}
      <div className='opacity-85 z-1'>
         <CustomShootingStars />
      </div>
    </AppLayout>
  );
}