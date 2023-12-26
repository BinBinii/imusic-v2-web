import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postCssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/web/',
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 37.5,
          propList: ['*']
        })
      ]
    }
  },
  server: {
    proxy: {
      '/netease': {
        // target: 'http://127.0.0.1:3000',
        target: 'http://8.134.51.235/netease',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netease/, '')
      },
      '/music': {
        // target: 'http://127.0.0.1:9000',
        target: 'http://8.134.51.235/music',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/music/, '')
      }
    }
  }
})
