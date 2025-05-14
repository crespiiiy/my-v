import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths()
  ],
  build: {
    // Skip type checking during build to avoid TypeScript errors
    // This is useful for CI/CD environments
    reportCompressedSize: false, // Speed up build
    sourcemap: false, // Speed up build
    minify: 'terser', // Use terser instead of esbuild for better compatibility
    terserOptions: {
      compress: {
        // Disable features that might cause issues
        keep_infinity: true,
        passes: 1
      }
    },
    rollupOptions: {
      external: [], // Don't externalize any dependencies
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      }
    }
  }
});
