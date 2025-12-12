import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import deno from "@deno/vite-plugin";
import Icons from "unplugin-icons/vite";
import { execSync } from "node:child_process";

const commitHash = execSync("git rev-parse --short=8 HEAD").toString().trim();
const buildDate = new Date().toISOString();

export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [
    deno(),
    svelte(),
    Icons({
      compiler: "svelte",
    }),
  ],
  server: {
    proxy: {
      "/api/sawthat": {
        target: "https://server.sawthat.band",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sawthat/, "/api"),
      },
    },
  },
});
