import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { FileQuestion } from 'lucide-react';
import { useIsland } from '@/hooks/useIsland';
import { useEffect } from 'react';

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
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 p-4 text-center">
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
    </AppLayout>
  );
}