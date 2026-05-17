import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: false,
      },
      // Auth routes are mounted at /auth/* on the API, not under /api.
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: false,
      },
    },
  },
});
