import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { kellosDirectoryIndex, kellosPrerender } from "./vite.prerender";

export default defineConfig({
  appType: "spa",
  plugins: [react(), tailwindcss(), kellosDirectoryIndex(), kellosPrerender()],
});
