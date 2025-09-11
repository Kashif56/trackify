import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Add your ngrok host here
    allowedHosts: ['162e14b5eefa.ngrok-free.app'],
    // Optional: allow all hosts (less secure)
    // allowedHosts: 'all',
  },
})
