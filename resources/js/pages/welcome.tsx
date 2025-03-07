import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import { LucideGraduationCap } from 'lucide-react';
import ToggleThemeSwitch from '@/components/elements/ToogleThemeSwitch';
import { Globe } from '@/components/ui/globe';
import Footer from '@/components/Footer/footer';
import { Badge } from '@/components/ui/badge';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // If user is authenticated, show the dialog
    if (auth.user) {
      setShowAuthDialog(true);
        
      // Start countdown for auto-redirect
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.visit('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
        
      // Clean up timer
      return () => clearInterval(timer);
    }
  }, [auth.user]);
    
  const handleCancel = () => {
    setShowAuthDialog(false);
  };

  return (
    <>
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a] relative overflow-hidden">
        
        {/* Graduation Cap SVG Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-full h-screen  ">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  {/* Graduation Cap Mortarboard */}
  <path 
    d="M2 10l10-5 10 5-10 5z" 
    style={{
      stroke: '#6366f1', 
      strokeWidth: 0.5, // Reduced from 2 to 1
      fill: 'none', 
      filter: 'url(#glow)',
      strokeDasharray: 100,
      animation: 'dashInOut 4s linear infinite',
    }}
  />
  {/* Graduation Cap Tassel/Stand */}
  <path 
    d="M22 10v6M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" 
    style={{
      stroke: '#6366f1', 
      strokeWidth: 0.5, // Reduced from 2 to 1
      fill: 'none', 
      filter: 'url(#glow)',
      strokeDasharray: 100,
      animation: 'dashInOutDelayed 4s linear infinite',
      animationDelay: '0.5s'
    }}
  />
</svg>
        </div>
        
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl z-10">
          <nav className="flex items-center justify-end gap-4">
            {auth.user ? (
              <>
              <Link
                href={route("dashboard")}
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Dashboard
              </Link>
              <ToggleThemeSwitch/>
              </>
            ) : (
              <>
                <Link
                  href={route("login")}
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Log in
                </Link>
                <Link
                  href={route("register")}
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Register
                </Link>
                <ToggleThemeSwitch/>
              </>
            )}
          </nav>
        </header>
        
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0 z-10">
          <main className="text-center max-w-3xl">
            
            <div className="flex justify-center items-center mb-8">
                <LucideGraduationCap className="w-16 h-16 text-primary" />
              
            </div>

            <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl md:text-6xl dark:text-white mb-6">
              Welcome to <span className="text-primary">StudyLabs</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              A free and opensource project by Nadhila Alokabandara and Savith Ratnaweera. Studylabs will make you want to study more and more.
            </p>
            
            {!auth.user && (
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
                <Link
                  href={route('login')}
                  className="px-6 py-3 dark:bg-primary bg-zinc-200  rounded-md hover:bg-zinc-300 font-medium"
                >
                  Get Started
                </Link>
                <Link
                  href={route('register')}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Learn More
                </Link>
              </div>
            )}
            <div className='animate-bounce mt-5'>
              <Badge>We Welcome teachers aswell!</Badge>
            </div>
          </main>
          
        </div>
      </div>
      
      <AlertDialog open={showAuthDialog} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're authenticated!</AlertDialogTitle>
            <AlertDialogDescription>
              You are already logged in. Redirecting to dashboard in {countdown} seconds...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.visit('/dashboard')}>
              Go to Dashboard Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes dashInOut {
          0% { stroke-dashoffset: 100; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }
        
        @keyframes dashInOutDelayed {
          0% { stroke-dashoffset: 100; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }
      `}</style>
      <div className="fixed top-1/2 opacity-25 right-[-2400px] bottom-5 transform -translate-y-1/99 z-0  pointer-events-none">
              <div className="w-[5200px] h-[5200px] bg-transparent">
                <Globe />
              </div>
      
            </div>
      <div className='z-10 dark:bg-black bg-white'>
        
      </div>
    </>
    <div className='fixed bottom-0 w-full '>
      <Footer/>
    </div>
    </>
  );
}