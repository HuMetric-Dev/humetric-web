import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      // SPA mode: every route falls back to index.html so the Svelte
      // router handles client-side navigation.
      fallback: "index.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
