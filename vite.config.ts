import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dependencies } from "./package.json";

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (["react", "react-dom"].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    hmr: {
      host: "localhost",
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
  build: {
    //outDir: "build",
    outDir: "./dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
