import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use GitHub Pages subpath only in GitHub Actions builds.
  base: process.env.GITHUB_ACTIONS ? '/aitoolscenter/' : '/',
  plugins: [react()],
})
