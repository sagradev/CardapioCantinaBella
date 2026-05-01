import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";  // ← linha nova

export default defineConfig({
  output: "server",
  adapter: vercel(),           // ← era node(...)
  integrations: [react(), tailwind()],
  server: { port: 4321 },
});