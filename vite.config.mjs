import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import deno from "@deno/vite-plugin";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    deno(),
    svelte(),
    Icons({
      compiler: "svelte",
    }),
  ],
});
