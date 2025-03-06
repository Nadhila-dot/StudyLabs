import '../css/app.css';

import { createInertiaApp, usePage } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';
import { IslandProvider } from './components/context/Island';
import { Island } from './components/dynamic-island/Island';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';









createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <IslandProvider>
                
                
                
                <App {...props} />
            </IslandProvider>
        );
    },
    progress: {
        color: '#EF4444', // Changed to Tailwind's red-500 color
    },
});

// This will set light / dark mode on load...
initializeTheme();
