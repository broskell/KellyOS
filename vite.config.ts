import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { kellosDirectoryIndex, kellosPrerender } from "./vite.prerender";

export default defineConfig({
  appType: "spa",
  plugins: [react(), tailwindcss(), kellosDirectoryIndex(), kellosPrerender()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
