import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import { Loader2, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function SecurePdf() {
  const { file, auth } = usePage().props as any;
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing viewer...");
  
  useEffect(() => {
    if (file.type !== 'pdf') return;

    // Start progress animation
    let progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stay at 90% until actually loaded
        }
        return prev + 5;
      });
    }, 200);

    // Show we're loading the PDF viewer
    setLoadingMessage("Loading secure PDF viewer...");
    
    // Use a simpler approach with a secure object tag
    try {
      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error setting up PDF viewer:', error);
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoading(false);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [file]);
  
  // Add security measures when the PDF is loaded
  useEffect(() => {
    if (!loading && file.type === 'pdf') {
      // Prevent keyboard shortcuts
      const handleKeyDown = (e) => {
        // Prevent Ctrl+S, Ctrl+P, etc.
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 's' || e.key === 'p' || e.key === 'c' || 
             e.key === 'g' || e.key === 'u' || e.key === 'd')) {
          e.preventDefault();
          return false;
        }
      };
      
      // Prevent right-click
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Intercept before unload
      const handleBeforeUnload = () => {
        // Clear any cache of this document if possible
        const embeds = document.querySelectorAll('object[data]');
        embeds.forEach(embed => {
          if (embed.getAttribute('data')?.includes(file.name)) {
            embed.setAttribute('data', '');
          }
        });
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [loading, file]);
  
  if (file.type === 'image') {
    return (
      <>
        <Head title={`Viewing: ${file.name}`} />
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Files
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-black mb-4">{file.name}</h1>
            
            <div className="relative mx-auto">
              {/* Watermark overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
                <div className="transform rotate-45 text-zinc-200 text-opacity-10 text-5xl font-bold whitespace-nowrap select-none">
                  This media is owned by Studylabs.
                </div>
              </div>
              
              {/* Image with protection */}
              <img 
                src={file.url}
                alt={file.name}
                className="max-w-full mx-auto rounded shadow-md"
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  WebkitUserDrag: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            This image is protected and for viewing purposes only.<br />
            © {new Date().getFullYear()} Studylabs, Nadhila Alokabandara
          </div>
        </div>
      </>
    );
  }
  
  if (file.type === 'pdf') {
    return (
      <>
        <Head title={`Viewing: ${file.name}`} />
        <style jsx global>{`
          @media print {
            body * {
              display: none !important;
            }
            body:after {
              content: "Printing this protected document is not allowed.";
              display: block !important;
              font-size: 18pt;
              text-align: center;
              margin-top: 100px;
            }
          }
        `}</style>
        
        <div className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href={route('admin.files.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Files
              </Link>
            </Button>
          </div>
          
          <div className="bg-white text-black rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{file.name}</h1>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center text-black py-16">
                <Loader2 className="h-10 w-10 animate-spin text-black mb-4" />
                <p>{loadingMessage}</p>
                <div className="w-64 mt-4">
                  <Progress value={loadingProgress} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="relative w-full" style={{ height: "800px" }}>
                {/* Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  
                </div>
                
                {/* PDF.js viewer with security features */}
                <div 
                  className="pdfjs-wrapper w-full h-full" 
                  style={{ overflow: "hidden" }}
                >
                  <object
                    data={`${file.url}#navpanes=0&toolbar=0&statusbar=0&scrollbar=1&view=FitH`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="w-full h-full border-0"
                  >
                    <div className="text-center p-8 bg-gray-100 rounded-md">
                      <p className="mb-4">It appears your browser doesn't support embedded PDFs.</p>
                      <p>Please try using a different browser to view this document. Womp Womp</p>
                    </div>
                  </object>
                </div>
                
                {/* Custom controls overlay to prevent browser UI */}
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white p-3 z-20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Protected Document - View Only</span>
                  </div>
                  <div className="text-sm">
                    © {new Date().getFullYear()} Studylabs
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            This PDF is protected and for viewing purposes only.<br />
            © {new Date().getFullYear()} Studylabs, Nadhila Alokabandara
          </div>
        </div>
      </>
    );
  }
  
  // Fallback for other file types
  return (
    <>
      <Head title={`File: ${file.name}`} />
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href={route('admin.files.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Files
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{file.name}</h1>
          
          <div className="flex flex-col items-center py-12">
            <FileText className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-center mb-4">This file type cannot be previewed directly.</p>
            
            <Button asChild>
              <a href={file.url} target="_blank" rel="noreferrer">Download File</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}