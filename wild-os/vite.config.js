import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// OPEN=1 builds the no-sign-in copy served from /wild-programme/open/wild-os/ (no service worker).
const OPEN = process.env.VITE_OPEN === '1'

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')) },
  base: OPEN ? '/wild-programme/open/wild-os/' : '/wild-os/',
  plugins: [
    tailwindcss(),
    react(),
    !OPEN && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'audio/*.mp3'],
      manifest: {
        name: 'WILD OS',
        short_name: 'WILD OS',
        description: 'The WILD practice companion. Included with membership.',
        theme_color: '#06100E',
        background_color: '#06100E',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/wild-os/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        // Audio and chart libraries are cached when first used, not all at install,
        // so the first visit's bandwidth goes to the page the member opened.
        globIgnores: ['**/vendor-tone-*.js', '**/vendor-recharts-*.js'],
        runtimeCaching: [{
          urlPattern: /\/assets\/vendor-(tone|recharts)-.*\.js$/,
          handler: 'CacheFirst',
          options: { cacheName: 'wos-heavy-vendor', expiration: { maxEntries: 4 } },
        }],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@config': path.resolve(__dirname, './src/config'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/tone')) return 'vendor-tone'
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) return 'vendor-recharts'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
        },
      },
    },
  },
})
