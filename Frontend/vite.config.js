import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use 127.0.0.1, not localhost: Node may resolve localhost to IPv6 (::1),
// while Django's runserver listens on IPv4 only.
const apiTarget = process.env.API_PROXY_TARGET || "http://127.0.0.1:8000"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: {
    "/api": { target: apiTarget, changeOrigin: true },
    "/media": { target: apiTarget, changeOrigin: true },
  } },
})
