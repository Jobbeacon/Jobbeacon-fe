import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Trang quản trị: cùng source với site người dùng nhưng entry riêng (admin/index.html),
// dev server riêng (cổng 5174) và output riêng (dist-admin/).
export default defineConfig({
  root: fileURLToPath(new URL('./admin', import.meta.url)),
  envDir: projectRoot,
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  resolve: {
    // root là admin/ nên "/src/..." phải trỏ về src/ của repo (dùng chung với site người dùng).
    alias: [{ find: /^\/src\//, replacement: `${projectRoot}src/` }],
  },
  server: {
    port: 5174,
    strictPort: true,
    fs: { allow: [projectRoot] },
  },
  preview: {
    port: 4174,
  },
  build: {
    outDir: fileURLToPath(new URL('./dist-admin', import.meta.url)),
    emptyOutDir: true,
  },
})
