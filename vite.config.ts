import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    // Resolve imports from project root node_modules
    preserveSymlinks: false,
  },
  server: {
    fs: {
      // Allow serving files from project root
      allow: [
        path.resolve(__dirname, 'src/renderer'),
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '.'),
      ],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/renderer/index.html'),
      },
    },
  },
});
