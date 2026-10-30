import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Two build outputs from the same source:
//   npm run build         → dist/         normal multi-file build, deployed to GitHub Pages
//   npm run build:single  → dist-single/  one self-contained index.html for the zip,
//                                         so it opens by double-click (file://)
export default defineConfig(({ mode }) => ({
  // Relative asset paths, so the app works under any sub-path
  // (e.g. zainnb.github.io/astera-studio/) and from file://.
  base: './',
  plugins: mode === 'single' ? [react(), viteSingleFile()] : [react()],
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
  },
}))
