import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Set to '/notey/' for GitHub Pages: https://yuu0824f.github.io/notey/
  // Set to '/' if you use a custom domain at root
  base: '/notey/',
})
