import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

const { resolve } = path

const proxyMap = {
  local: 'http://localhost:3300',
  dev: 'http://158.85.121.180:9097',
  prod: 'http://bm.bjqingniu.com',
}
const defaultProxy = proxyMap.local

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      pages: resolve(__dirname, 'src/pages'),
      auth: resolve(__dirname, 'src/pages/auth'),
      demo: resolve(__dirname, 'src/pages/demo'),
      assets: resolve(__dirname, 'src/assets'),
    },
  },
  optimizeDeps: {
    exclude: [],
    include: ['@ant-design/colors'],
  },
  build: {
    rollupOptions: {
      input: {
        auth: resolve(__dirname, 'src/pages/auth/index.html'),
        demo: resolve(__dirname, 'src/pages/demo/index.html'),
      },
    },
  },
  server: {
    open: '/src/pages/demo/',
    proxy: {
      '/api': {
        target: defaultProxy,
        proxyTimeout: 1500000,
        timeout: 1500000,
        changeOrigin: true,
        // events: {
        //   proxyReq(proxyReq, req, res) {
        //     console.log(proxyReq, req, res)
        //   },
        // },
        // router: function (req: { query: { _proxy: any }; path: any; _pathRewrited: boolean }) {
        //   // Object.keys(req)
        //   if (req.query._proxy) {
        //     const proxyTarget = req.query._proxy
        //     console.log(req.path, `: proxy to ${proxyMap[proxyTarget] || proxyTarget}`)
        //     if (!['local', 'dev'].includes(proxyTarget)) {
        //       req._pathRewrited = true
        //     }
        //     return proxyMap[proxyTarget] || proxyTarget
        //   }

        //   console.log(req.path, `: proxy to ${defaultProxy}`)
        //   return defaultProxy
        // },
        rewrite: function (path) {
          // if (req._pathRewrited) {
          //   console.log('req._pathRewrited', path)
          //   return path.replace('/api/v1/', '/')
          // }
          return path
        },
      },
    },
  },
})
