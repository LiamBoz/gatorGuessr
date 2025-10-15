import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api":   { target: "http://localhost:8001", changeOrigin: true },
      "/image": { target: "http://localhost:8001", changeOrigin: true },
      "/static":{ target: "http://localhost:8001", changeOrigin: true },
    },
  },
});
