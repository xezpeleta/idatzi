import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'demo',
  base: './',
  resolve: {
    alias: {
      // Point to the Idaztian dist (built in a prior CI step)
      'idaztian/style.css': path.resolve(__dirname, 'Idaztian/packages/idaztian/dist/idaztian.css'),
      idaztian: path.resolve(__dirname, 'Idaztian/packages/idaztian/dist/idaztian.js'),
    },
  },
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
    rollupOptions: {
      // Do not bundle @huggingface/transformers — it's an optional
      // peer dep loaded dynamically only when AI completion is enabled.
      external: [/^@huggingface\/transformers/],
    },
  },
})
