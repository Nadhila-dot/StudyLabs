import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    optimizeDeps: {
        exclude: [
            // Icon libraries
            'lucide-react',
            '@radix-ui/react-icons',
            
            // UI component libraries that are already optimized
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-avatar',
            '@radix-ui/react-toast',
            
            // Other heavy libraries
            'date-fns',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            '@inertiajs/react',
        ]
    },
    build: {
        chunkSizeWarningLimit: 1000, // Increase the size warning limit
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'ui': ['@/components/ui']
                }
            }
        }
    }
});