import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [deno(), svelte()],
});
