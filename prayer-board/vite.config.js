import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Version bump to force cache refresh - change this number when deploying updates
const APP_VERSION = '1.0.2';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.svg'],
      manifest: {
        name: 'Prayer Board',
        short_name: 'Prayer',
        description: 'Share prayer requests and pray for one another.',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        id: `prayer-board-v${APP_VERSION}`,
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: `api-cache-v${APP_VERSION}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 hour - shorter cache for API
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
