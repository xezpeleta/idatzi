import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src/renderer',
  base: './',
  resolve: {
    alias: {
      // Point idaztian to its built dist within the monorepo-style git dep
      idaztian: path.resolve(__dirname, 'node_modules/idaztian/packages/idaztian/src/index.ts'),
    },
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
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
});
