import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fix-script-tags',
      transformIndexHtml: {
        order: 'post',
        handler(html, ctx) {
          if (ctx.command !== 'build') return html
          return html
            .replace(/ crossorigin/g, '')
            .replace(/<script type="module"/g, '<script defer')
            .replace(/<!-- DEV TEMPLATE.*?-->\s*/s, '')
        },
      },
    },
  ],
  base: './',
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'SevoraTradingApp',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
