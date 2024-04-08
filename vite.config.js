import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  envDir: './src/env',
  server: {
    proxy: {
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://localhost:18080', // 后端服务器地址
        changeOrigin: true, // 改变请求来源，以便服务器正确识别客户端地址
        // rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，移除开头的 /api
      },
    }
  }
})
