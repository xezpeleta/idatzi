import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'demo',
  base: './',
  resolve: {
    alias: {
      idaztian: path.resolve(__dirname, '../Idaztian/packages/idaztian/src'),
    },
  },
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
  },
})
