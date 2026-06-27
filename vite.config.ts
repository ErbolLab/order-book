import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works under a GitHub Pages project path
// (e.g. https://<user>.github.io/order-book/) without hardcoding the repo name.
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
