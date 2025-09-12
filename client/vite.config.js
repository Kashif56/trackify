import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Add your ngrok host here
    allowedHosts: ['b95e84158224.ngrok-free.app'],
    // Optional: allow all hosts (less secure)
    // allowedHosts: 'all',
  },
})
