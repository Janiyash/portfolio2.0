import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Non-default asset naming — avoids the /assets/index-{hash} Replit fingerprint
        entryFileNames: "js/app.[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name?.split(".").pop() || "";
          if (/png|jpe?g|svg|gif|webp|ico/.test(ext)) return "img/[name].[hash][extname]";
          if (/woff2?|ttf|eot/.test(ext)) return "fonts/[name].[hash][extname]";
          if (ext === "css") return "css/[name].[hash][extname]";
          return "assets/[name].[hash][extname]";
        },
      },
    },
  },
});
