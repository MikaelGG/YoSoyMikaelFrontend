import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    fs: {
      allow: ["./client", "./shared", "index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"]
    },
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: "dist/spa",
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'vendor-react';
          }
          if (
            id.includes('node_modules/@radix-ui/') ||
            id.includes('node_modules/lucide-react/') ||
            id.includes('node_modules/sonner/')
          ) {
            return 'vendor-ui';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./client"),
      "@shared": path.resolve(import.meta.dirname, "./shared")
    }
  }
}));
