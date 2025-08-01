import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    cors: true,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: [
      "19613d1ff797.ngrok-free.app", // ← replace with your current ngrok domain
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
