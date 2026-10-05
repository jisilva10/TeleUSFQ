import { defineConfig } from 'vite'

// The app is a single plain index.html (ES5, no framework) so it runs on Samsung Tizen TVs.
// Vite only copies it and public/ to dist; base './' keeps it working from any path.
export default defineConfig({
  base: './',
})
