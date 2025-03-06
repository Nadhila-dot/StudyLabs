import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

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
    resolve: {
        alias: {
            '@': '/resources/js', // Make sure this alias is properly set
        },
    },
    esbuild: {
        jsx: 'automatic',
        treeShaking: true,
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
        ],
    },
    build: {
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        cssMinify: true,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Create chunks based on node_modules
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }
                        if (id.includes('lucide-react') || id.includes('@radix-ui/react-icons')) {
                            return 'vendor-icons';
                        }
                        if (id.includes('@radix-ui')) {
                            return 'vendor-radix';
                        }
                        // All other node_modules
                        return 'vendor';
                    }
                    
                    // Group UI components - be specific about paths to avoid the error
                    if (id.includes('/resources/js/components/ui/')) {
                        return 'ui-components';
                    }
                }
            }
        },
    }
});