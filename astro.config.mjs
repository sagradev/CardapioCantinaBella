import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

export default defineConfig({
  output: "server", // SSR obrigatório para buscar dados no servidor
  adapter: node({ mode: "standalone" }),
  integrations: [react(), tailwind()],
  server: { port: 4321 },
});
