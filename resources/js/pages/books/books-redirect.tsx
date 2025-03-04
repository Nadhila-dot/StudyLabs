import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ToggleThemeSwitch from "@/components/elements/ToogleThemeSwitch";

interface BookRedirectProps {
  className?: string;
}


export default function BooksRedirect({ className }: BookRedirectProps) {
  const { book, type } = usePage().props as any;
  const [progress, setProgress] = React.useState(0);
  const [redirecting, setRedirecting] = React.useState(true);

  useEffect(() => {
    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 2; // Increase by 4% each time (takes ~2.5s to reach 100%)
      });
    }, 100);

    // Redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      window.location.href = book.url;
      setRedirecting(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [book.url]);

  const handleManualRedirect = () => {
    window.location.href = book.url;
    setRedirecting(false);
  };

  const handleCancel = () => {
    setRedirecting(false);
    window.history.back();
  };

  return (
    <div className={`flex items-center justify-center min-h-[50vh] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {type.reason}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center py-6">
            {redirecting ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting to external resource...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ExternalLink className="h-12 w-12 text-primary" />
                <p className="text-center text-sm text-muted-foreground">
                  You should be redirected automatically.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Book: <span className="font-bold">{book.name}</span>
            </p>
            <p className="text-sm text-muted-foreground break-all">
              URL: {book.url}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Redirecting in 5 seconds</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleManualRedirect}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Go Now
          </Button>
          <ToggleThemeSwitch/>
        </CardFooter>
      </Card>
      <div className="absolute bottom-4 text-center text-sm text-muted-foreground space-y-1">
        <p>© 2024 All rights reserved.</p>
        <p>Made by Nadhila Alokabandara</p>
      </div>
    </div>
  );
}