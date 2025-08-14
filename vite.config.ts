import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "example",
  resolve: {
    alias: {
      "@jpitlor/musicxml-visualizer": path.resolve(
        __dirname,
        "lib",
        "@jpitlor",
        "musicxml-visualizer",
      ),
    },
  },
});
