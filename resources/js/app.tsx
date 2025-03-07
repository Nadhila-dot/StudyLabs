import '../css/app.css';

import { createInertiaApp, usePage } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import { IslandProvider } from './components/context/Island';
import { Island } from './components/dynamic-island/Island';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Loading screen component with Lucide icon
const LoadingScreen = () => (
  <div className="flex items-center justify-center w-screen h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-xl font-extrabold text-foreground/80">
        Made by Nadhi.dev ❤️
      </p>
    </div>
  </div>
);

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <IslandProvider>
                <Suspense fallback={<LoadingScreen />}>
                    <App {...props} />
                </Suspense>
            </IslandProvider>
        );
    },