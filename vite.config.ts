import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src/renderer',
  base: './',
  resolve: {
    preserveSymlinks: false,
  },
  server: {
    fs: {
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
