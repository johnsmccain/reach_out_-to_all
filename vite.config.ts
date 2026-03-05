import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@tiptap/react', 
      '@tiptap/starter-kit',
      'framer-motion',
      'lucide-react',
      'react-hot-toast'
    ],
  },
  build: {
    // Optimize build output
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks
          'admin': [
            './src/pages/AdminDashboard.tsx',
            './src/components/admin/SermonModal.tsx',
            './src/components/admin/ArticleModal.tsx',
            './src/components/admin/EventModal.tsx',
          ],
          'articles': [
            './src/pages/Articles.tsx',
            './src/pages/ArticleDetail.tsx',
            './src/components/ArticleCard.tsx',
          ],
          'sermons': [
            './src/pages/Sermons.tsx',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
});
