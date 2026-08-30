import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: dir,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    fs: { allow: [resolve(dir, "..")] },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
