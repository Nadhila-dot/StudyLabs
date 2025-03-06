import react from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import million from 'million/compiler';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        million.vite({
            auto: {
                threshold: 0.05, // Only adds Million.js to components that would benefit
            },
            telemetry: false, // Disable telemetry
        }),
        react({
            // Using SWC for faster compilation
            swc: {
                jsc: {
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            },
        }),
    ],
    
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
    
    build: {
        // Smaller chunks for better caching
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
    },
    
    server: {
        // Warm up frequently accessed pages for faster dev experience
        warmup: {
            clientFiles: [
                // Main entry points
                'resources/js/app.tsx',
                
                // Common Pages - adjust these paths to match your structure
                'resources/js/Pages/Dashboard.tsx',
                'resources/js/Pages/Profile/Edit.tsx',
                'resources/js/Pages/Auth/Login.tsx',
                'resources/js/Pages/Auth/Register.tsx',
                'resources/js/Pages/Collections/*',
                
                // Common layouts
                'resources/js/Layouts/AppLayout.tsx',
                'resources/js/Layouts/AdminLayout.tsx',
            ],
        },
    },
    
    optimizeDeps: {
        // Avoid processing these libraries repeatedly
        include: [
            'react', 
            'react-dom', 
            '@inertiajs/react',
            '@headlessui/react',
            'lucide-react',
        ],
    },
});