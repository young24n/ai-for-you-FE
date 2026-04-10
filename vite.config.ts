import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: { // @로 경로 별명 설정
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
